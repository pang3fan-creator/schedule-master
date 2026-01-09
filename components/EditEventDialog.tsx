"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Edit3,
    X,
} from "lucide-react"
import type { Event, EventColor } from "@/lib/types"
import { formatDateString, getSunday, getDateForDay, getDayIndexFromDate } from "@/lib/time-utils"
import { EventForm, EventDialogFooter, parseTimeValue, formatTimeString, validateEventTimes, DAY_OPTIONS_SUNDAY_FIRST } from "@/components/EventForm"
import { useSettings } from "@/components/SettingsContext"

interface EditEventDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    event: Event | null
    onUpdateEvent: (event: Event) => void
}

// Always use Sunday-first day options (US standard)
const dayOptions = DAY_OPTIONS_SUNDAY_FIRST

export function EditEventDialog({
    open,
    onOpenChange,
    event,
    onUpdateEvent,
}: EditEventDialogProps) {
    const { settings } = useSettings()
    const [title, setTitle] = useState("")
    const [selectedDay, setSelectedDay] = useState<number>(0)
    const [startTime, setStartTime] = useState("08:00")
    const [endTime, setEndTime] = useState("09:00")
    const [description, setDescription] = useState("")
    const [selectedColor, setSelectedColor] = useState<EventColor>("blue")
    const [selectedIcon, setSelectedIcon] = useState<string | undefined>(undefined)

    // Working hours boundaries (A and B)
    const minStartMinutes = settings.workingHoursStart * 60 // A in minutes
    const maxEndMinutes = settings.workingHoursEnd * 60     // B in minutes

    // Calculate the week dates based on event's date (Sunday-first)
    const weekDates = useMemo(() => {
        if (!event) return []
        const eventDate = new Date(event.date)
        const sunday = getSunday(eventDate)
        return dayOptions.map((_, index) => getDateForDay(sunday, index))
    }, [event])

    // Initialize form with event data when dialog opens
    useEffect(() => {
        if (event && open) {
            setTitle(event.title)
            setSelectedDay(getDayIndexFromDate(event.date))
            setStartTime(formatTimeString(event.startHour, event.startMinute))
            setEndTime(formatTimeString(event.endHour, event.endMinute))
            setDescription(event.description || "")
            setSelectedColor(event.color || "blue")
            setSelectedIcon(event.icon)
        }
    }, [event, open])

    const handleSubmit = () => {
        if (!title.trim() || !event) return

        // Validate times on submit
        const validatedTimes = validateEventTimes({
            startTime,
            endTime,
            minStartMinutes,
            maxEndMinutes
        })

        const start = parseTimeValue(validatedTimes.startTime)
        const end = parseTimeValue(validatedTimes.endTime)
        const newDate = weekDates[selectedDay]

        onUpdateEvent({
            ...event,
            title: title.trim(),
            description: description.trim(),
            day: selectedDay,
            date: formatDateString(newDate),
            startHour: start.hour,
            startMinute: start.minute,
            endHour: end.hour,
            endMinute: end.minute,
            color: selectedColor,
            icon: selectedIcon,
        })

        onOpenChange(false)
    }

    if (!event) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col bg-white dark:bg-gray-900" showCloseButton={false}>
                {/* Header */}
                <DialogHeader className="flex flex-row items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <div className="flex items-center gap-3">
                        <Edit3 className="size-5 text-blue-600 dark:text-blue-400" />
                        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Edit event
                        </DialogTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 sm:size-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
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
                        selectedDays={[selectedDay]}
                        onDayToggle={(day) => setSelectedDay(day)}
                        dayOptions={dayOptions}
                        selectionMode="single"
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

                {/* Footer */}
                <EventDialogFooter
                    primaryText="Save Changes"
                    onPrimary={handleSubmit}
                    disablePrimary={!title.trim()}
                    secondaryText="Cancel"
                    onSecondary={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

