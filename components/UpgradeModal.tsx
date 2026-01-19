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
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
                <DialogHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                        <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <DialogTitle className="text-xl text-center text-gray-900 dark:text-gray-100">{t('upgradeModal.title')}</DialogTitle>
                    <DialogDescription className="text-center text-gray-600 dark:text-gray-300">
                        {t('upgradeModal.description', { feature })}
                    </DialogDescription>
                </DialogHeader>

                <div className="my-6 space-y-3">
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

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t('upgradeModal.priceNote')}
                </p>
            </DialogContent>
        </Dialog>
    );
}
