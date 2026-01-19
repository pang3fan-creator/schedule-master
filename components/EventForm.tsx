"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Tag,
    Calendar,
    Clock,
    Info,
    Palette,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import React from "react"
import { ICON_OPTIONS } from "@/lib/icons"
import { type EventColor, type EventPriority, EVENT_COLORS, PRIORITY_COLORS } from "@/lib/types"
import { useTranslations } from "next-intl"

// ============== Time Utility Functions ==============

// Parse time string to hour and minute
export function parseTimeValue(timeStr: string): { hour: number; minute: number } {
    const [h, m] = timeStr.split(":").map(Number)
    return { hour: h || 8, minute: m || 0 }
}

// Format hour and minute to time string
export function formatTimeString(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// Convert time string to total minutes
export function timeToMinutes(timeStr: string): number {
    const { hour, minute } = parseTimeValue(timeStr)
    return hour * 60 + minute
}

// Convert total minutes to time string
export function minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

// ============== Time Validation (On Submit) ==============

interface ValidateEventTimesProps {
    startTime: string  // C
    endTime: string    // D
    minStartMinutes: number  // A in minutes (workingHoursStart * 60)
    maxEndMinutes: number    // B in minutes (workingHoursEnd * 60)
}

interface ValidatedTimes {
    startTime: string
    endTime: string
}

/**
 * Validates and adjusts event times on submit.
 * Rules:
 * 1. A ≤ C ≤ B-15min (clamp C to this range)
 * 2. A+15min ≤ D ≤ B (clamp D to this range)
 * 3. C ≤ D-15min (if C > D-15min, set D = C+15min)
 */
export function validateEventTimes({
    startTime,
    endTime,
    minStartMinutes,
    maxEndMinutes
}: ValidateEventTimesProps): ValidatedTimes {
    let cMinutes = timeToMinutes(startTime)
    let dMinutes = timeToMinutes(endTime)

    // Step 1: Clamp C to [A, B-15min]
    const maxCMinutes = maxEndMinutes - 15
    if (cMinutes < minStartMinutes) cMinutes = minStartMinutes
    if (cMinutes > maxCMinutes) cMinutes = maxCMinutes

    // Step 2: Clamp D to [A+15min, B]
    const minDMinutes = minStartMinutes + 15
    if (dMinutes < minDMinutes) dMinutes = minDMinutes
    if (dMinutes > maxEndMinutes) dMinutes = maxEndMinutes

    // Step 3: Ensure C ≤ D-15min (if not, set D = C+15min)
    if (cMinutes > dMinutes - 15) {
        dMinutes = cMinutes + 15
        // Re-clamp D to max if needed
        if (dMinutes > maxEndMinutes) dMinutes = maxEndMinutes
    }

    return {
        startTime: minutesToTime(cMinutes),
        endTime: minutesToTime(dMinutes)
    }
}

// ============== Shared Day Options ==============

export interface DayOption {
    label: string
    value: number
}

// Day options always starting with Sunday (US standard)
export const DAY_OPTIONS_SUNDAY_FIRST: DayOption[] = [
    { label: "Sun", value: 0 },
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
]

interface EventFormProps {
    title: string
    onTitleChange: (value: string) => void

    selectedDays: number[]
    onDayToggle: (day: number) => void
    dayOptions: DayOption[]
    selectionMode?: 'single' | 'multiple'

    startTime: string
    onStartTimeChange: (value: string) => void

    endTime: string
    onEndTimeChange: (value: string) => void

    description: string
    onDescriptionChange: (value: string) => void

    selectedColor: EventColor
    onColorChange: (color: EventColor) => void

    selectedIcon?: string
    onIconChange: (icon: string | undefined) => void
}

export function EventForm({
    title,
    onTitleChange,
    selectedDays,
    onDayToggle,
    dayOptions,
    selectionMode = 'multiple',
    startTime,
    onStartTimeChange,
    endTime,
    onEndTimeChange,
    description,
    onDescriptionChange,
    selectedColor,
    onColorChange,
    selectedIcon,
    onIconChange,
}: EventFormProps) {
    const t = useTranslations('Common')
    // Available color options
    const colorOptions: EventColor[] = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'orange', 'teal']

    // Available icon options (preceded by a "None" option)
    const iconOptions = [
        { name: 'None', icon: Tag },
        ...ICON_OPTIONS
    ]

    const SelectedIconComponent = iconOptions.find(i => i.name === selectedIcon)?.icon || Tag

    return (
        <div className="space-y-4 md:space-y-5">
            {/* Title Field */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('eventDialog.form.title')}</Label>
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center size-9 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                        <Tag className="size-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex gap-2 flex-1">
                        <Input
                            placeholder={t('eventDialog.form.titlePlaceholder')}
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="flex-1 h-9 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            style={{ wordBreak: 'break-all' }}
                        />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-9 shrink-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"
                                >
                                    <SelectedIconComponent className="size-4 text-gray-500 dark:text-gray-400" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-2 grid grid-cols-6 gap-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700" align="end">
                                {iconOptions.map((opt) => (
                                    <Button
                                        key={opt.name}
                                        variant="ghost"
                                        size="icon"
                                        className={`size-9 rounded-md ${selectedIcon === opt.name || (!selectedIcon && opt.name === 'None') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                        onClick={() => onIconChange(opt.name === 'None' ? undefined : opt.name)}
                                        title={t(`eventDialog.form.icons.${opt.name.toLowerCase() === 'none' ? 'none' : opt.name}`)}
                                    >
                                        <opt.icon className="size-4" />
                                    </Button>
                                ))}
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* Color Field */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('eventDialog.form.color')}</Label>
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center size-9 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                        <Palette className="size-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex gap-1.5 flex-1 flex-wrap">
                        {colorOptions.map((color) => {
                            const colorConfig = EVENT_COLORS[color]
                            return (
                                <button
                                    key={color}
                                    type="button"
                                    className={`size-8 rounded-full border-2 transition-all dark:ring-offset-gray-900 ${colorConfig.bg} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 border-gray-400 dark:border-gray-500' : 'border-transparent hover:scale-110'}`}
                                    onClick={() => onColorChange(color)}
                                    title={t(`eventDialog.form.colors.${color}`)}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Day(s) Field */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {selectionMode === 'single' ? t('eventDialog.form.day') : t('eventDialog.form.days')}
                </Label>
                <div className="flex items-start gap-2">
                    <div className="flex items-center justify-center size-9 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 shrink-0">
                        <Calendar className="size-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                        {dayOptions.map((day) => {
                            const dayLabelKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
                            const translatedLabel = t(`eventDialog.form.dayLabels.${dayLabelKeys[day.value]}`)
                            return (
                                <Button
                                    key={day.value}
                                    variant="outline"
                                    size="sm"
                                    className={`h-9 px-2 md:px-3 text-xs font-medium transition-all ${selectedDays.includes(day.value)
                                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                                        }`}
                                    onClick={() => onDayToggle(day.value)}
                                >
                                    {translatedLabel}
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Clock className="size-4 text-gray-400 dark:text-gray-500" />
                        {t('eventDialog.form.start')}
                    </Label>
                    <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => onStartTimeChange(e.target.value)}
                        className="h-10 w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Clock className="size-4 text-gray-400 dark:text-gray-500" />
                        {t('eventDialog.form.end')}
                    </Label>
                    <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => onEndTimeChange(e.target.value)}
                        className="h-10 w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t('eventDialog.form.description')}
                </Label>
                <div className="flex gap-2">
                    <div className="flex items-start justify-center size-9 pt-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                        <Info className="size-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <Textarea
                        placeholder={t('eventDialog.form.descriptionPlaceholder')}
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        className="flex-1 min-h-[80px] border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}
                    />
                </div>
            </div>
        </div>
    )
}

interface EventDialogFooterProps {
    onPrimary: () => void
    primaryText: string
    onSecondary: () => void
    secondaryText: string
    disablePrimary?: boolean
}

export function EventDialogFooter({
    onPrimary,
    primaryText,
    onSecondary,
    secondaryText,
    disablePrimary = false
}: EventDialogFooterProps) {
    return (
        <div className="flex border-t border-gray-200 dark:border-gray-700">
            <Button
                variant="ghost"
                className="flex-1 h-12 rounded-none text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium border-r border-gray-200 dark:border-gray-700"
                onClick={onSecondary}
            >
                {secondaryText}
            </Button>
            <Button
                className="flex-1 h-12 rounded-none bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-medium"
                onClick={onPrimary}
                disabled={disablePrimary}
            >
                {primaryText}
            </Button>
        </div>
    )
}
