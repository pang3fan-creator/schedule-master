"use client"

import { useState } from "react"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { GoogleButton } from "./GoogleButton"

interface SignInFormProps {
    onSuccess: () => void
}

export function SignInForm({ onSuccess }: SignInFormProps) {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false)
    const [resetEmailSent, setResetEmailSent] = useState(false)

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
            setError(clerkError.errors?.[0]?.message || "An error occurred during sign in")
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
            setError(clerkError.errors?.[0]?.message || "Failed to sign in with Google")
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
            setError(clerkError.errors?.[0]?.message || "Failed to send reset email")
        } finally {
            setIsLoading(false)
        }
    }

    // Forgot password mode
    if (forgotPasswordMode) {
        return (
            <div className="flex flex-col flex-1">
                <div className="flex-1">
                    {resetEmailSent ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                We sent password reset instructions to <strong>{email}</strong>
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setForgotPasswordMode(false)
                                    setResetEmailSent(false)
                                }}
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                ← Back to sign in
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Reset your password</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter your email and we&apos;ll send you reset instructions
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="reset-email">Email address</Label>
                                <Input
                                    id="reset-email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 border-gray-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                disabled={isLoading || !email}
                            >
                                {isLoading ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setForgotPasswordMode(false)}
                                className="w-full text-sm text-gray-500 hover:text-gray-700"
                            >
                                ← Back to sign in
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
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 mb-4">
                        {error}
                    </div>
                )}

                <div className="space-y-2 mb-4">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 border-gray-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        required
                    />
                </div>

                <div className="space-y-2 mb-4">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                        <Input
                            id="signin-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 pr-10 border-gray-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium mb-3"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <>
                            Sign In <ArrowRight className="ml-2 size-4" />
                        </>
                    )}
                </Button>

                <div className="text-center">
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        onClick={() => setForgotPasswordMode(true)}
                    >
                        Forgot your password?
                    </button>
                </div>
            </div>

            <div className="pt-6">
                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-gray-400">OR</span>
                    </div>
                </div>

                <GoogleButton onClick={handleGoogleSignIn} text="Sign in with Google" />
            </div>
        </form>
    )
}
