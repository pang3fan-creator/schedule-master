"use client"

import { cn } from "@/lib/utils"

interface ViewModeToggleProps {
    value: "day" | "week"
    onValueChange: (value: "day" | "week") => void
    className?: string
    size?: "default" | "sm"
}

/**
 * A custom toggle component for switching between Day and Week view modes.
 * Uses a segmented control pattern with proper ARIA attributes.
 * 
 * This replaces the Radix UI Tabs component which was causing ARIA warnings
 * because we were using TabsTrigger without TabsContent.
 */
export function ViewModeToggle({ value, onValueChange, className, size = "default" }: ViewModeToggleProps) {
    const isSmall = size === "sm"

    return (
        <div
            role="group"
            aria-label="Calendar view mode"
            className={cn(
                "grid grid-cols-2 items-center rounded-lg bg-gray-100 p-1",
                isSmall ? "h-9" : "h-10",
                className
            )}
        >
            <button
                type="button"
                role="radio"
                aria-checked={value === "day"}
                onClick={() => onValueChange("day")}
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSmall ? "px-3 text-xs h-7" : "px-4 text-sm h-8",
                    value === "day"
                        ? "bg-white text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                Day
            </button>
            <button
                type="button"
                role="radio"
                aria-checked={value === "week"}
                onClick={() => onValueChange("week")}
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSmall ? "px-3 text-xs h-7" : "px-4 text-sm h-8",
                    value === "week"
                        ? "bg-white text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
            >
                Week
            </button>
        </div>
    )
}
