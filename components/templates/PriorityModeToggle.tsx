"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"
import { useSettings } from "@/components/SettingsContext"

export interface ToggleProps {
    variant?: 'default' | 'compact'
}

export function PriorityModeToggle({ variant = 'default' }: ToggleProps) {
    const { settings, updateSettings } = useSettings()

    if (variant === 'compact') {
        return (
            <Button
                variant="outline"
                size="icon"
                className={`size-12 rounded-full shadow-md border-gray-200 transition-all ${settings.priorityModeEnabled ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-gray-600 bg-white hover:bg-gray-50'}`}
                onClick={() => updateSettings({ priorityModeEnabled: !settings.priorityModeEnabled })}
                title="Toggle Priority Mode"
            >
                <Flag className="size-6" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            className={`justify-start gap-3 w-full ${settings.priorityModeEnabled ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => updateSettings({ priorityModeEnabled: !settings.priorityModeEnabled })}
        >
            <Flag className="size-5" />
            Priority Mode {settings.priorityModeEnabled ? 'On' : 'Off'}
        </Button>
    )
}
