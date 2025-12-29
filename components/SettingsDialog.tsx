"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Settings, RotateCcw, X } from "lucide-react"
import { useSettings, type CalendarSettings } from "@/components/SettingsContext"

interface SettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const { settings, updateSettings, resetSettings } = useSettings()

    const handleWeekStartChange = (checked: boolean) => {
        updateSettings({ weekStartsOnSunday: checked })
    }

    const handleTimeFormatChange = (checked: boolean) => {
        updateSettings({ use12HourFormat: checked })
    }

    const handleTimeIncrementChange = (value: string) => {
        updateSettings({ timeIncrement: parseInt(value) as 5 | 15 | 30 | 60 })
    }

    const handleWorkingHoursStartChange = (value: string) => {
        const newStart = parseInt(value)
        // If current end is not valid (must be > start), adjust it to start + 1
        if (settings.workingHoursEnd <= newStart) {
            updateSettings({
                workingHoursStart: newStart,
                workingHoursEnd: newStart + 1
            })
        } else {
            updateSettings({ workingHoursStart: newStart })
        }
    }

    const handleWorkingHoursEndChange = (value: string) => {
        updateSettings({ workingHoursEnd: parseInt(value) })
    }

    const handleShowDatesChange = (checked: boolean) => {
        updateSettings({ showDates: checked })
    }

    const handleReset = () => {
        resetSettings()
    }

    // Generate hour options for start time (A): 0-23 (12 AM to 11 PM)
    const startHourOptions = Array.from({ length: 24 }, (_, i) => i)

    // Generate hour options for end time (B): (A+1) to 24 (midnight)
    const endHourOptions = Array.from(
        { length: 24 - settings.workingHoursStart },
        (_, i) => settings.workingHoursStart + 1 + i
    )

    // Format hour for display based on current time format setting
    const formatHourOption = (hour: number) => {
        if (settings.use12HourFormat) {
            if (hour === 0) return "12:00 AM"
            if (hour === 12) return "12:00 PM"
            if (hour < 12) return `${hour}:00 AM`
            return `${hour - 12}:00 PM`
        }
        return `${hour.toString().padStart(2, "0")}:00`
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden" showCloseButton={false}>
                {/* Header */}
                <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <Settings className="size-5 text-blue-600" />
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            Settings
                        </DialogTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 sm:size-9 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="size-4 sm:size-5" />
                    </Button>
                </DialogHeader>

                {/* Settings Content */}
                <div className="px-6 py-5 space-y-6">
                    {/* Week Start Day */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium text-gray-900">
                                Start week on Sunday
                            </Label>
                            <p className="text-xs text-gray-500">
                                US standard is Sunday, ISO standard is Monday
                            </p>
                        </div>
                        <Switch
                            checked={settings.weekStartsOnSunday}
                            onCheckedChange={handleWeekStartChange}
                        />
                    </div>

                    {/* Time Format */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium text-gray-900">
                                12-hour format (AM/PM)
                            </Label>
                            <p className="text-xs text-gray-500">
                                Toggle off for 24-hour format
                            </p>
                        </div>
                        <Switch
                            checked={settings.use12HourFormat}
                            onCheckedChange={handleTimeFormatChange}
                        />
                    </div>

                    {/* Show Dates */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium text-gray-900">
                                Show dates
                            </Label>
                            <p className="text-xs text-gray-500">
                                Display date numbers in calendar headers
                            </p>
                        </div>
                        <Switch
                            checked={settings.showDates}
                            onCheckedChange={handleShowDatesChange}
                        />
                    </div>

                    {/* Time Increment */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900">
                            Time increment
                        </Label>
                        <Select
                            value={settings.timeIncrement.toString()}
                            onValueChange={handleTimeIncrementChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5 minutes</SelectItem>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Working Hours */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900">
                            Working hours
                        </Label>
                        <div className="flex items-center gap-3">
                            <Select
                                value={settings.workingHoursStart.toString()}
                                onValueChange={handleWorkingHoursStartChange}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {startHourOptions.map((hour) => (
                                        <SelectItem key={hour} value={hour.toString()}>
                                            {formatHourOption(hour)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-gray-400">to</span>
                            <Select
                                value={settings.workingHoursEnd.toString()}
                                onValueChange={handleWorkingHoursEndChange}
                            >
                                <SelectTrigger className="flex-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {endHourOptions.map((hour) => (
                                        <SelectItem key={hour} value={hour.toString()}>
                                            {formatHourOption(hour)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex border-t border-gray-100">
                    <Button
                        variant="ghost"
                        className="flex-1 h-12 rounded-none text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium gap-2"
                        onClick={handleReset}
                    >
                        <RotateCcw className="size-4" />
                        Reset to defaults
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
