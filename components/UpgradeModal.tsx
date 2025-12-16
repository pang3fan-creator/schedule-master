"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, FileDown, Cloud } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    feature?: string;
}

export function UpgradeModal({ open, onOpenChange, feature = "this feature" }: UpgradeModalProps) {
    const benefits = [
        { icon: FileDown, text: "High-res PDF exports without watermarks" },
        { icon: Sparkles, text: "AI-powered scheduling suggestions" },
        { icon: Cloud, text: "Cloud save & sync across devices" },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Lock className="h-6 w-6 text-blue-600" />
                    </div>
                    <DialogTitle className="text-xl text-center">Upgrade to Pro</DialogTitle>
                    <DialogDescription className="text-center">
                        {feature} is available on Pro plans. Upgrade now to unlock all premium features.
                    </DialogDescription>
                </DialogHeader>

                <div className="my-6 space-y-3">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
                            <benefit.icon className="h-5 w-5 text-blue-600 shrink-0" />
                            <span>{benefit.text}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-3">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                        <Link href="/pricing">View Plans</Link>
                    </Button>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full">
                        Maybe Later
                    </Button>
                </div>

                <p className="text-center text-xs text-gray-500 mt-2">
                    Starting at just $4.9 for a 7-day pass
                </p>
            </DialogContent>
        </Dialog>
    );
}
