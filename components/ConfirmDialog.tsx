"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { useTranslations } from "next-intl"

interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    icon?: LucideIcon
    iconClassName?: string
    confirmText: string
    cancelText?: string
    onConfirm: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "blue"
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    icon: Icon,
    iconClassName = "size-5 text-gray-500",
    confirmText,
    cancelText,
    onConfirm,
    variant = "default"
}: ConfirmDialogProps) {
    const t = useTranslations('Common')
    const displayCancelText = cancelText || t('buttons.cancel')
    const handleConfirm = () => {
        onConfirm()
        onOpenChange(false)
    }

    // Map common variants to specific styles if needed
    const buttonClassName = variant === "blue" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
    const finalVariant = variant === "blue" ? "default" : variant

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        {Icon && <Icon className={iconClassName} />}
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-left text-gray-600 dark:text-gray-400">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2 text-right">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {displayCancelText}
                    </Button>
                    <Button
                        variant={finalVariant}
                        onClick={handleConfirm}
                        className={buttonClassName}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
