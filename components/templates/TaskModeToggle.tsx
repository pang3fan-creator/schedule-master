"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { CheckSquare } from "lucide-react"
import { useSettings } from "@/components/SettingsContext"
import { useTranslations } from "next-intl"

export interface ToggleProps {
    variant?: 'default' | 'compact'
}

export function TaskModeToggle({ variant = 'default' }: ToggleProps) {
    const t = useTranslations('TemplateComponents')
    const { settings, updateSettings } = useSettings()

    if (variant === 'compact') {
        return (
            <Button
                variant="outline"
                size="icon"
                className={`size-12 rounded-full shadow-md border-gray-200 dark:border-gray-700 transition-all ${settings.taskModeEnabled ? 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700/50 dark:text-green-400' : 'text-gray-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'}`}
                onClick={() => updateSettings({ taskModeEnabled: !settings.taskModeEnabled })}
                title={t('TaskModeToggle.title')}
            >
                <CheckSquare className="size-6" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            className={`justify-start gap-3 w-full ${settings.taskModeEnabled ? 'text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            onClick={() => updateSettings({ taskModeEnabled: !settings.taskModeEnabled })}
        >
            <CheckSquare className="size-5" />
            {t('TaskModeToggle.label')} {settings.taskModeEnabled ? t('common.on') : t('common.off')}
        </Button>
    )
}
