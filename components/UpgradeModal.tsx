"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, FileDown, Cloud, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface UpgradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    feature?: string;
}

export function UpgradeModal({ open, onOpenChange, feature = "this feature" }: UpgradeModalProps) {
    const t = useTranslations('Common');

    const benefits = [
        { icon: FileDown, text: t('upgradeModal.benefits.pdf') },
        { icon: Sparkles, text: t('upgradeModal.benefits.ai') },
        { icon: Cloud, text: t('upgradeModal.benefits.cloud') },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-white dark:bg-gray-900" showCloseButton={false}>
                <DialogHeader className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800 text-left">
                    <div className="flex items-center justify-between mb-2">
                        <DialogTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-gray-100">
                            <Lock className="size-5 text-blue-600 dark:text-blue-400" />
                            {t('upgradeModal.title')}
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 sm:size-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="size-4 sm:size-5" />
                        </Button>
                    </div>
                    <DialogDescription className="text-left text-gray-600 dark:text-gray-300">
                        {t('upgradeModal.description', { feature })}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6">
                    <div className="space-y-3 mb-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                <benefit.icon className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                                <span>{benefit.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                            <Link href="/pricing">{t('upgradeModal.viewPlans')}</Link>
                        </Button>
                        <Button variant="ghost" onClick={() => onOpenChange(false)} className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                            {t('upgradeModal.maybeLater')}
                        </Button>
                    </div>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                        {t('upgradeModal.priceNote')}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
