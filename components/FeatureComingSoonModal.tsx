"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Check, Loader2 } from "lucide-react";

interface FeatureComingSoonModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    featureName: string;
}

export function FeatureComingSoonModal({
    open,
    onOpenChange,
    featureName
}: FeatureComingSoonModalProps) {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: "Feature Waitlist",
                    email,
                    subject: `[Waitlist] ${featureName}`,
                    message: `用户希望订阅功能更新：${featureName}\n邮箱：${email}`,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "提交失败，请稍后重试");
            }

            setIsSubmitted(true);

            // Reset并关闭
            setTimeout(() => {
                setIsSubmitted(false);
                setEmail("");
                onOpenChange(false);
            }, 2000);
        } catch (err) {
            console.error("提交等待列表失败:", err);
            alert(err instanceof Error ? err.message : "提交失败，请稍后重试");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = (open: boolean) => {
        if (!open) {
            // Reset state when closing
            setIsSubmitted(false);
            setEmail("");
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-100 to-blue-100">
                        <Sparkles className="h-7 w-7 text-violet-600" />
                    </div>
                    <DialogTitle className="text-xl text-center">
                        {featureName} - Coming Soon!
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        This Pro feature is currently in development. Be the first to know when it launches and get an exclusive <span className="font-semibold text-violet-600">50% discount</span>!
                    </DialogDescription>
                </DialogHeader>

                {isSubmitted ? (
                    <div className="flex flex-col items-center py-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-3">
                            <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="text-sm font-medium text-green-600">
                            You&apos;re on the list! 🎉
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            We&apos;ll notify you when it&apos;s ready.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div>
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
                            disabled={isSubmitting || !email}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing up...
                                </>
                            ) : (
                                "Notify Me & Get 50% Off"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => onOpenChange(false)}
                        >
                            Maybe Later
                        </Button>
                    </form>
                )}

                <p className="text-center text-xs text-gray-400 mt-2">
                    No spam, unsubscribe anytime.
                </p>
            </DialogContent>
        </Dialog>
    );
}
