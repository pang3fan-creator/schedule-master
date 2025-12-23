"use client"

import * as React from "react"
import Image from "next/image"
import { useState } from "react"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuthModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultMode?: "sign-in" | "sign-up"
}

export function AuthModal({ open, onOpenChange, defaultMode = "sign-in" }: AuthModalProps) {
    const [activeTab, setActiveTab] = useState<"sign-up" | "sign-in">(defaultMode)

    // Reset tab when modal opens with different default mode
    React.useEffect(() => {
        if (open) {
            setActiveTab(defaultMode)
        }
    }, [open, defaultMode])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[900px] p-0 overflow-hidden gap-0 border-0"
                showCloseButton={true}
            >
                <DialogTitle className="sr-only">Authentication</DialogTitle>
                <div className="flex min-h-[620px]">
                    {/* Left Panel - Brand Area */}
                    <div className="hidden md:flex flex-col justify-center items-center w-[45%] bg-gradient-to-br from-blue-600 via-blue-500 to-violet-600 p-8 relative overflow-hidden">
                        {/* Decorative elements */}
                        <DecorativeCircles />

                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Image src="/logo.png" alt="TrySchedule" width={40} height={40} className="object-contain" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">
                                {activeTab === "sign-in" ? "Welcome back!" : "Join TrySchedule"}
                            </h2>
                            <p className="text-blue-100 text-sm max-w-[280px] leading-relaxed">
                                {activeTab === "sign-in"
                                    ? "Let's pick up where you left off and keep scheduling smarter"
                                    : "Start building beautiful schedules in minutes, no learning curve required"}
                            </p>
                        </div>

                        {/* Feature highlights */}
                        <div className="relative z-10 mt-8 space-y-3 w-full max-w-[240px]">
                            <FeatureItem icon="✨" text="Drag & drop simplicity" />
                            <FeatureItem icon="🎨" text="Beautiful color themes" />
                            <FeatureItem icon="📱" text="Works on any device" />
                        </div>

                        {/* Calendar Preview Card */}
                        <div className="relative z-10 mt-8">
                            <CalendarPreviewCard />
                        </div>
                    </div>

                    {/* Right Panel - Auth Form */}
                    <div className="flex-1 p-8 py-12 flex flex-col justify-center">
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "sign-up" | "sign-in")} className="w-full h-full flex flex-col">
                            <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent gap-4 h-auto p-0">
                                <TabsTrigger
                                    value="sign-up"
                                    className={cn(
                                        "py-2.5 rounded-lg border data-[state=active]:shadow-none transition-all",
                                        activeTab === "sign-up"
                                            ? "border-blue-600 text-blue-600 bg-blue-50/50"
                                            : "border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
                                    )}
                                >
                                    Sign Up
                                </TabsTrigger>
                                <TabsTrigger
                                    value="sign-in"
                                    className={cn(
                                        "py-2.5 rounded-lg border data-[state=active]:shadow-none transition-all",
                                        activeTab === "sign-in"
                                            ? "border-blue-600 text-blue-600 bg-blue-50/50"
                                            : "border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300"
                                    )}
                                >
                                    Sign In
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="sign-up" className="mt-0 flex-1 flex flex-col">
                                <SignUpForm onSuccess={() => onOpenChange(false)} />
                            </TabsContent>

                            <TabsContent value="sign-in" className="mt-0 flex-1 flex flex-col">
                                <SignInForm onSuccess={() => onOpenChange(false)} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ============================================
// Sign In Form
// ============================================
function SignInForm({ onSuccess }: { onSuccess: () => void }) {
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
                // Handle other statuses if needed
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
            {/* Form fields section */}
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

            {/* Fixed bottom section */}
            <div className="pt-6">
                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-gray-400">OR</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-gray-200 hover:bg-gray-50"
                    onClick={handleGoogleSignIn}
                >
                    <svg className="size-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                </Button>
            </div>
        </form>
    )
}

// ============================================
// Sign Up Form
// ============================================
function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
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

            // Send email verification code
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
                    <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        We sent a verification code to <strong>{email}</strong>
                    </p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <Input
                        id="verification-code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="h-11 text-center text-lg tracking-widest border-gray-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        maxLength={6}
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
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
                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                >
                    ← Back to sign up
                </button>
            </form>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            {/* Form fields section */}
            <div className="flex-1">
                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">
                            First name <span className="text-gray-400 text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="h-11 border-gray-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">
                            Last name <span className="text-gray-400 text-xs">(Optional)</span>
                        </Label>
                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="h-11 border-gray-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        />
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <Label htmlFor="signup-email">Email address</Label>
                    <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 border-gray-200 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        required
                    />
                </div>

                <div className="space-y-2 mb-4">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                        <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
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

                <div id="clerk-captcha"></div>
                <Button
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
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

            {/* Fixed bottom section */}
            <div className="pt-6">
                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-gray-400">OR</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-gray-200 hover:bg-gray-50"
                    onClick={handleGoogleSignUp}
                >
                    <svg className="size-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign up with Google
                </Button>
            </div>
        </form>
    )
}

// ============================================
// Decorative Components
// ============================================
// Feature Item Component
function FeatureItem({ icon, text }: { icon: string; text: string }) {
    return (
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5">
            <span className="text-lg">{icon}</span>
            <span className="text-sm text-white font-medium">{text}</span>
        </div>
    )
}

function DecorativeCircles() {
    return (
        <>
            {/* Large gradient orb - top right */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            {/* Medium orb - bottom left */}
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-400/20 rounded-full blur-2xl" />

            {/* Small floating circles */}
            <div className="absolute top-20 right-8 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
            <div className="absolute top-32 left-12 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-24 right-16 w-2 h-2 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Decorative ring */}
            <div className="absolute top-1/4 -left-8 w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
                    <circle
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="20 10"
                    />
                </svg>
            </div>

            {/* Another decorative ring */}
            <div className="absolute bottom-1/3 -right-4 w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full opacity-15">
                    <circle
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                    />
                </svg>
            </div>
        </>
    )
}

function CalendarPreviewCard() {
    return (
        <div className="bg-white rounded-xl shadow-2xl p-4 w-[220px] transform hover:scale-105 transition-transform duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">T</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                        <span className="text-blue-600">Try</span>Schedule
                    </span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
            </div>

            {/* Day headers */}
            <div className="flex gap-1 mb-2">
                {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
                    <div key={i} className="flex-1 text-center text-[10px] font-medium text-gray-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="space-y-1.5">
                {/* Row 1 */}
                <div className="flex gap-1 h-3">
                    <div className="flex-1 bg-blue-400 rounded-sm" />
                    <div className="flex-1 bg-blue-400 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-violet-400 rounded-sm" />
                </div>
                {/* Row 2 */}
                <div className="flex gap-1 h-3">
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-emerald-400 rounded-sm" />
                    <div className="flex-1 bg-emerald-400 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                </div>
                {/* Row 3 */}
                <div className="flex gap-1 h-3">
                    <div className="flex-1 bg-amber-400 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-rose-400 rounded-sm" />
                    <div className="flex-1 bg-rose-400 rounded-sm" />
                </div>
                {/* Row 4 */}
                <div className="flex gap-1 h-3">
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                    <div className="flex-1 bg-sky-400 rounded-sm" />
                    <div className="flex-1 bg-sky-400 rounded-sm" />
                    <div className="flex-1 bg-gray-100 rounded-sm" />
                </div>
            </div>

            {/* Footer indicator */}
            <div className="mt-3 flex items-center justify-center gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-500" />
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="w-1 h-1 rounded-full bg-gray-300" />
            </div>
        </div>
    )
}
