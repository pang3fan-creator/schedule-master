"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, Trash2 } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface AIQuickActionsProps {
    variant?: 'default' | 'compact'
    onRegenerateSchedule?: () => void
    onClearSchedule?: () => void
}

export function AIQuickActions({
    variant = 'default',
    onRegenerateSchedule,
    onClearSchedule,
}: AIQuickActionsProps) {
    const t = useTranslations('TemplateComponents.AIQuickActions')
    const [isOpen, setIsOpen] = useState(false)

    const handleRegenerate = () => {
        setIsOpen(false)
        onRegenerateSchedule?.()
    }

    const handleClear = () => {
        setIsOpen(false)
        onClearSchedule?.()
    }

    if (variant === 'compact') {
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        size="icon"
                        className={`size-12 rounded-full shadow-lg border-0 transition-all bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white ${isOpen ? 'ring-2 ring-violet-300 ring-offset-2 dark:ring-violet-700 dark:ring-offset-gray-900' : ''}`}
                        title={t('title')}
                    >
                        <Sparkles className="size-6" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-48 p-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <button
                        onClick={handleRegenerate}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200"
                    >
                        <RefreshCw className="size-4 text-violet-500 dark:text-violet-400" />
                        <span>{t('regenerate')}</span>
                    </button>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                    >
                        <Trash2 className="size-4" />
                        <span>{t('clear')}</span>
                    </button>
                </PopoverContent>
            </Popover>
        )
    }

    // Default variant for sidebar (refined for alignment/consistency)
    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className={`justify-start gap-3 w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 ${isOpen ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                >
                    <Sparkles className="size-5 text-violet-500 dark:text-violet-400" />
                    {t('title')}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <button
                    onClick={handleRegenerate}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200"
                >
                    <RefreshCw className="size-4 text-violet-500 dark:text-violet-400" />
                    <span>{t('regenerate')}</span>
                </button>
                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                <button
                    onClick={handleClear}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                >
                    <Trash2 className="size-4" />
                    <span>{t('clear')}</span>
                </button>
            </PopoverContent>
        </Popover>
    )
}
