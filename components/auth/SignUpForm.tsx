"use client"

import { useState } from "react"
import { useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { GoogleButton } from "./GoogleButton"

interface SignUpFormProps {
    onSuccess: () => void
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
    const { signUp, setActive, isLoaded } = useSignUp()
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)
    const [verificationCode, setVerificationCode] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded || !signUp) return

        setIsLoading(true)
        setError("")

        try {
            await signUp.create({
                emailAddress: email,
                password: password,
                firstName: firstName || undefined,
                lastName: lastName || undefined,
            })

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
            setPendingVerification(true)
        } catch (err: unknown) {
            const clerkError = err as { errors?: Array<{ message: string }> }
            setError(clerkError.errors?.[0]?.message || "An error occurred during sign up")
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded || !signUp) return

        setIsLoading(true)
        setError("")

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            })

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                onSuccess()
                router.refresh()
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: Array<{ message: string }> }
            setError(clerkError.errors?.[0]?.message || "Verification failed")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignUp = async () => {
        if (!isLoaded || !signUp) return

        try {
            await signUp.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            })
        } catch (err: unknown) {
            const clerkError = err as { errors?: Array<{ message: string }> }
            setError(clerkError.errors?.[0]?.message || "Failed to sign up with Google")
        }
    }

    // Verification code entry screen
    if (pendingVerification) {
        return (
            <form onSubmit={handleVerification} className="space-y-4">
                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Check your email</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        We sent a verification code to <strong>{email}</strong>
                    </p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="verification-code" className="text-gray-900 dark:text-gray-100">Verification Code</Label>
                    <Input
                        id="verification-code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="h-11 text-center text-lg tracking-widest border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        maxLength={6}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        "Verify Email"
                    )}
                </Button>

                <button
                    type="button"
                    onClick={() => setPendingVerification(false)}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    ← Back to sign up
                </button>
            </form>
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

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-900 dark:text-gray-100">
                            First name <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="h-11 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-900 dark:text-gray-100">
                            Last name <span className="text-gray-400 dark:text-gray-500 text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="h-11 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        />
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <Label htmlFor="signup-email" className="text-gray-900 dark:text-gray-100">Email address</Label>
                    <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        required
                    />
                </div>

                <div className="space-y-2 mb-4">
                    <Label htmlFor="signup-password" className="text-gray-900 dark:text-gray-100">Password</Label>
                    <div className="relative">
                        <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
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

                <div id="clerk-captcha"></div>
                <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <>
                            Continue <ArrowRight className="ml-2 size-4" />
                        </>
                    )}
                </Button>
            </div>

            <div className="pt-6">
                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-900 px-4 text-gray-400">OR</span>
                    </div>
                </div>

                <GoogleButton onClick={handleGoogleSignUp} text="Sign up with Google" />
            </div>
        </form>
    )
}
