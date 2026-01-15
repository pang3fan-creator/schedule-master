"use client"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { GoogleButton } from "./GoogleButton"
import { useTranslations } from "next-intl"

interface SignInFormProps {
    onSuccess: () => void
}

export function SignInForm({ onSuccess }: SignInFormProps) {
    const t = useTranslations('Auth')
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
    const [resetEmailSent, setResetEmailSent] = useState(false)

    // New states for complete password reset flow
    const [verificationCode, setVerificationCode] = useState("")
    const [codeVerified, setCodeVerified] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded || !signIn) return

        setIsLoading(true)
        setError("")

        try {
            const result = await signIn.create({
                identifier: email,
                password: password,
            })

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                onSuccess()
                router.refresh()
            } else {
                console.log("Sign in status:", result.status)
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: Array<{ message: string }> }
            setError(clerkError.errors?.[0]?.message || t('errors.signInError'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        if (!isLoaded || !signIn) return

        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            })
        } catch (err: unknown) {
            const clerkError = err as { errors?: Array<{ message: string }> }
            setError(clerkError.errors?.[0]?.message || t('errors.googleSignInError'))
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded || !signIn || !email) return

        setIsLoading(true)
        setError("")

        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: email,
            })
            setResetEmailSent(true)
        } catch (err: unknown) {
            const clerkError = err as { errors?: Array<{ message: string }> }
            setError(clerkError.errors?.[0]?.message || t('errors.resetEmailError'))
        } finally {
            setIsLoading(false)
        }
    }

    // Step 2: Verify the code from email
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded || !signIn || !verificationCode) return

        setIsLoading(true)
        setError("")

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code: verificationCode,
            })

            if (result.status === "needs_new_password") {
                setCodeVerified(true)
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: Array<{ message: string }> }
            setError(clerkError.errors?.[0]?.message || t('errors.codeError'))
        } finally {
            setIsLoading(false)
        }
    }

    // Step 3: Set new password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded || !signIn) return

        if (newPassword !== confirmPassword) {
            setError(t('errors.passwordMismatch'))
            return
        }

        if (newPassword.length < 8) {
            setError(t('errors.passwordLength'))
            return
        }

        setIsLoading(true)
        setError("")

        try {
            const result = await signIn.resetPassword({
                password: newPassword,
            })

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                setResetSuccess(true)
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: Array<{ message: string }> }
            setError(clerkError.errors?.[0]?.message || t('errors.resetError'))
        } finally {
            setIsLoading(false)
        }
    }

    // Reset all forgot password states
    const resetForgotPasswordFlow = () => {
        setForgotPasswordMode(false)
        setResetEmailSent(false)
        setVerificationCode("")
        setCodeVerified(false)
        setNewPassword("")
        setConfirmPassword("")
        setResetSuccess(false)
        setError("")
    }

    // Forgot password mode
    if (forgotPasswordMode) {
        return (
            <div className="flex flex-col flex-1">
                <div className="flex-1">
                    {/* Step 4: Reset success */}
                    {resetSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('forgotPassword.success')}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                {t('forgotPassword.successMessage')}
                            </p>
                            <Button
                                onClick={() => {
                                    resetForgotPasswordFlow()
                                    onSuccess()
                                    router.refresh()
                                }}
                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium"
                            >
                                {t('common.continue')}
                            </Button>
                        </div>
                    ) : codeVerified ? (
                        /* Step 3: Set new password */
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('forgotPassword.setNewPassword')}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {t('forgotPassword.setNewPasswordInstruction')}
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="new-password" className="text-gray-900 dark:text-gray-100">{t('forgotPassword.newPassword')}</Label>
                                <div className="relative">
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder={t('forgotPassword.newPasswordPlaceholder')}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="h-11 pr-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password" className="text-gray-900 dark:text-gray-100">{t('forgotPassword.confirmPassword')}</Label>
                                <div className="relative">
                                    <Input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder={t('forgotPassword.confirmPasswordPlaceholder')}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="h-11 pr-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium"
                                disabled={isLoading || !newPassword || !confirmPassword}
                            >
                                {isLoading ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    t('forgotPassword.resetPassword')
                                )}
                            </Button>

                            <button
                                type="button"
                                onClick={resetForgotPasswordFlow}
                                className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                ← Back to sign in
                            </button>
                        </form>
                    ) : resetEmailSent ? (
                        /* Step 2: Enter verification code */
                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <div className="text-center mb-4">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('forgotPassword.checkEmail')}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {t('forgotPassword.codeSentTo')} <strong>{email}</strong>
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="verification-code" className="text-gray-900 dark:text-gray-100">{t('forgotPassword.verificationCode')}</Label>
                                <Input
                                    id="verification-code"
                                    type="text"
                                    placeholder={t('forgotPassword.codePlaceholder')}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="h-11 text-center text-lg tracking-widest border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                                    required
                                    maxLength={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium"
                                disabled={isLoading || verificationCode.length !== 6}
                            >
                                {isLoading ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    t('forgotPassword.verifyCode')
                                )}
                            </Button>

                            <button
                                type="button"
                                onClick={resetForgotPasswordFlow}
                                className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                {t('common.backToSignIn')}
                            </button>
                        </form>
                    ) : (
                        /* Step 1: Enter email */
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('forgotPassword.title')}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {t('forgotPassword.instruction')}
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="reset-email" className="text-gray-900 dark:text-gray-100">{t('common.emailAddress')}</Label>
                                <Input
                                    id="reset-email"
                                    type="email"
                                    placeholder={t('signIn.emailPlaceholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium"
                                disabled={isLoading || !email}
                            >
                                {isLoading ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    t('forgotPassword.submitEmail')
                                )}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setForgotPasswordMode(false)}
                                className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                {t('common.backToSignIn')}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="flex-1">
                {error && (
                    <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800 mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-2 mb-4">
                    <Label htmlFor="signin-email" className="text-gray-900 dark:text-gray-100">{t('common.email')}</Label>
                    <Input
                        id="signin-email"
                        type="email"
                        placeholder={t('signIn.emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        required
                    />
                </div>

                <div className="space-y-2 mb-4">
                    <Label htmlFor="signin-password" className="text-gray-900 dark:text-gray-100">{t('common.password')}</Label>
                    <div className="relative">
                        <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('signIn.passwordPlaceholder')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 pr-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium mb-3"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <>
                            {t('signIn.submit')} <ArrowRight className="ml-2 size-4" />
                        </>
                    )}
                </Button>

                <div className="text-center">
                    <button
                        type="button"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                        onClick={() => setForgotPasswordMode(true)}
                    >
                        {t('signIn.forgotPassword')}
                    </button>
                </div>
            </div>

            <div className="pt-6">
                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-900 px-4 text-gray-400">{t('common.or')}</span>
                    </div>
                </div>

                <GoogleButton onClick={handleGoogleSignIn} text={t('signIn.googleButton')} />
            </div>
        </form>
    )
}
