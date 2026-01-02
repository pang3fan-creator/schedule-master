"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    CalendarPlus,
    X,
} from "lucide-react"
import type { Event, EventColor } from "@/lib/types"
import { formatDateString, getDateForDay } from "@/lib/time-utils"
import { EventForm, EventDialogFooter, parseTimeValue, validateEventTimes, DAY_OPTIONS_SUNDAY_FIRST } from "@/components/EventForm"
import { useSettings } from "@/components/SettingsContext"

interface AddEventDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddEvent: (event: Omit<Event, "id">) => void
    weekStart: Date // The start of the currently displayed week
    weekStartsOnSunday: boolean
    initialData?: {
        startTime?: string
        endTime?: string
        selectedDays?: number[]
    }
}

export function AddEventDialog({
    open,
    onOpenChange,
    onAddEvent,
    weekStart,
    weekStartsOnSunday,
    initialData
}: AddEventDialogProps) {
    const { settings } = useSettings()
    const [title, setTitle] = useState("")
    const [selectedDays, setSelectedDays] = useState<number[]>([])
    const [startTime, setStartTime] = useState("08:00")
    const [endTime, setEndTime] = useState("09:00")
    const [description, setDescription] = useState("")
    const [selectedColor, setSelectedColor] = useState<EventColor>("blue")
    const [selectedIcon, setSelectedIcon] = useState<string | undefined>(undefined)

    // Working hours boundaries (A and B)
    const minStartMinutes = settings.workingHoursStart * 60 // A in minutes
    const maxEndMinutes = settings.workingHoursEnd * 60     // B in minutes

    // Sync state when initialData changes or dialog opens
    useEffect(() => {
        if (open && initialData) {
            if (initialData.startTime) setStartTime(initialData.startTime)
            if (initialData.endTime) setEndTime(initialData.endTime)
            if (initialData.selectedDays) setSelectedDays(initialData.selectedDays)
        }
    }, [open, initialData])

    // Always use Sunday-first day options (US standard)
    const dayOptions = DAY_OPTIONS_SUNDAY_FIRST

    // Calculate the week dates based on weekStart
    // The index from dayOptions directly maps to the visual day index (0-6)
    // where 0 is the first day of the week (either Sun or Mon)
    const weekDates = useMemo(() => {
        return Array.from({ length: 7 }, (_, index) => getDateForDay(weekStart, index))
    }, [weekStart])

    const handleDayToggle = (dayValue: number) => {
        setSelectedDays((prev) =>
            prev.includes(dayValue)
                ? prev.filter((d) => d !== dayValue)
                : [...prev, dayValue]
        )
    }

    const handleSubmit = () => {
        if (!title.trim() || selectedDays.length === 0) return

        // Validate times on submit
        const validatedTimes = validateEventTimes({
            startTime,
            endTime,
            minStartMinutes,
            maxEndMinutes
        })

        const start = parseTimeValue(validatedTimes.startTime)
        const end = parseTimeValue(validatedTimes.endTime)

        // Create an event for each selected day with specific date
        selectedDays.forEach((day) => {
            const eventDate = weekDates[day]
            onAddEvent({
                title: title.trim(),
                description: description.trim(),
                day,
                date: formatDateString(eventDate),
                startHour: start.hour,
                startMinute: start.minute,
                endHour: end.hour,
                endMinute: end.minute,
                color: selectedColor,
                icon: selectedIcon,
                // Add template-specific features automatically
                ...(settings.activeTemplateSlug === 'cleaning-schedule-builder' ? {
                    task: { isCheckable: true, isCompleted: false }
                } : {}),
                ...(settings.activeTemplateSlug === 'ai-schedule-builder' ? {
                    priority: 'medium' as const
                } : {}),
            })
        })

        // Reset form and close dialog
        handleReset()
        onOpenChange(false)
    }

    const handleReset = () => {
        setTitle("")
        setSelectedDays([])
        setStartTime("08:00")
        setEndTime("09:00")
        setDescription("")
        setSelectedColor("blue")
        setSelectedIcon(undefined)
    }

    const handleCopy = () => {
        // Copy event data to clipboard
        const eventData = {
            title,
            days: selectedDays.map((d) => {
                const day = dayOptions.find(opt => opt.value === d)
                return day ? day.label : ""
            }),
            startTime,
            endTime,
            description,
        }
        navigator.clipboard.writeText(JSON.stringify(eventData, null, 2))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col" showCloseButton={false}>
                {/* Header */}
                <DialogHeader className="flex flex-row items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <CalendarPlus className="size-5 text-blue-600" />
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            Add event
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

                {/* Form Content - scrollable */}
                <div className="px-4 md:px-6 py-4 md:py-5 overflow-y-auto flex-1">
                    <EventForm
                        title={title}
                        onTitleChange={setTitle}
                        selectedDays={selectedDays}
                        onDayToggle={handleDayToggle}
                        dayOptions={dayOptions}
                        selectionMode="multiple"
                        startTime={startTime}
                        onStartTimeChange={setStartTime}
                        endTime={endTime}
                        onEndTimeChange={setEndTime}
                        description={description}
                        onDescriptionChange={setDescription}
                        selectedColor={selectedColor}
                        onColorChange={setSelectedColor}
                        selectedIcon={selectedIcon}
                        onIconChange={setSelectedIcon}
                    />
                </div>

                {/* Footer Buttons */}
                <EventDialogFooter
                    primaryText="Add"
                    onPrimary={handleSubmit}
                    disablePrimary={!title.trim() || selectedDays.length === 0}
                    secondaryText="Copy"
                    onSecondary={handleCopy}
                />
            </DialogContent>
        </Dialog>
    )
}
