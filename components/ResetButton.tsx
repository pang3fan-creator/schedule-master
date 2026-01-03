"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { useSettings, DEFAULT_SETTINGS, type CalendarSettings } from "@/components/SettingsContext"
import { EVENTS_STORAGE_KEY } from "@/lib/storage-keys"
import type { Event } from "@/lib/types"

/**
 * Check if there's any data to reset (events, settings, or active template).
 * This is a pure function that can be used in multiple places.
 */
export function hasDataToReset(
    settings: CalendarSettings,
    events: Event[]
): boolean {
    const hasActiveTemplate = !!settings.activeTemplateSlug
    const hasEvents = events.length > 0

    // Shallow compare settings with DEFAULT_SETTINGS
    // excluding activeTemplateSlug as we check it separately
    const isDefaultSettings = Object.keys(DEFAULT_SETTINGS).every(key => {
        if (key === 'activeTemplateSlug') return true
        return (settings as any)[key] === (DEFAULT_SETTINGS as any)[key]
    })

    return hasActiveTemplate || !isDefaultSettings || hasEvents
}

/**
 * Check if there's any data to reset by reading events from localStorage.
 * Useful when you don't have the events array in state.
 */
export function hasDataToResetFromStorage(settings: CalendarSettings): boolean {
    const hasActiveTemplate = !!settings.activeTemplateSlug

    // Check events from localStorage
    let hasEvents = false
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem(EVENTS_STORAGE_KEY)
        if (stored) {
            try {
                const events = JSON.parse(stored)
                hasEvents = Array.isArray(events) && events.length > 0
            } catch (error) {
                console.error("Error parsing events for reset check", error)
            }
        }
    }

    // Shallow compare settings with DEFAULT_SETTINGS
    const isDefaultSettings = Object.keys(DEFAULT_SETTINGS).every(key => {
        if (key === 'activeTemplateSlug') return true
        return (settings as any)[key] === (DEFAULT_SETTINGS as any)[key]
    })

    return hasActiveTemplate || !isDefaultSettings || hasEvents
}

interface ResetButtonProps {
    events: Event[]
    onReset: () => void
    variant?: "ghost" | "outline" | "default"
    className?: string
    showLabel?: boolean
}

/**
 * A reusable reset button component that checks if there's anything to reset
 * before showing a confirmation dialog.
 */
export function ResetButton({
    events,
    onReset,
    variant = "ghost",
    className = "",
    showLabel = true,
}: ResetButtonProps) {
    const [showResetDialog, setShowResetDialog] = useState(false)
    const { settings } = useSettings()

    const handleResetClick = () => {
        if (!hasDataToReset(settings, events)) {
            // No response if everything is already at default/empty
            return
        }
        setShowResetDialog(true)
    }

    return (
        <>
            <Button
                variant={variant}
                className={`justify-start gap-3 text-gray-600 hover:text-gray-900 ${className}`}
                onClick={handleResetClick}
            >
                <RotateCcw className="size-5" />
                {showLabel && "Reset"}
            </Button>

            <ConfirmDialog
                open={showResetDialog}
                onOpenChange={setShowResetDialog}
                title="Reset Everything"
                description="This will clear all sidebar template features, restore your settings to default, and delete all events from the calendar. This action cannot be undone."
                icon={RotateCcw}
                confirmText="Yes, Reset"
                onConfirm={onReset}
                variant="blue"
            />
        </>
    )
}

