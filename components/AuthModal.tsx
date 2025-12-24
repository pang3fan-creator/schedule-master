"use client"

import * as React from "react"
import Image from "next/image"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Import extracted auth components
import { SignInForm } from "@/components/auth/SignInForm"
import { SignUpForm } from "@/components/auth/SignUpForm"
import { FeatureItem, DecorativeCircles, CalendarPreviewCard } from "@/components/auth/AuthDecorations"

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
