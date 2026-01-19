"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"
import { useSettings } from "@/components/SettingsContext"
import { useTranslations } from "next-intl"

export interface ToggleProps {
    variant?: 'default' | 'compact'
}

export function PriorityModeToggle({ variant = 'default' }: ToggleProps) {
    const t = useTranslations('TemplateComponents')
    const { settings, updateSettings } = useSettings()

    if (variant === 'compact') {
        return (
            <Button
                variant="outline"
                size="icon"
                className={`size-12 rounded-full shadow-md border-gray-200 dark:border-gray-700 transition-all ${settings.priorityModeEnabled ? 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700/50 dark:text-amber-400' : 'text-gray-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                onClick={() => updateSettings({ priorityModeEnabled: !settings.priorityModeEnabled })}
                title={t('PriorityModeToggle.title')}
            >
                <Flag className="size-6" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            className={`justify-start gap-3 w-full ${settings.priorityModeEnabled ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-400' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => updateSettings({ priorityModeEnabled: !settings.priorityModeEnabled })}
        >
            <Flag className="size-5" />
            {t('PriorityModeToggle.label')} {settings.priorityModeEnabled ? t('common.on') : t('common.off')}
        </Button>
    )
}
