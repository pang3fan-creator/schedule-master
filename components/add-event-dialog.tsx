"use client"

import { useState, useMemo } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    CalendarPlus,
    X,
    Tag,
    Calendar,
    Clock,
    Info,
    Palette,
} from "lucide-react"
import type { Event, EventColor } from "@/lib/types"
import { EVENT_COLORS } from "@/lib/types"
import { formatDateString } from "@/lib/time-utils"
import { EventForm, EventDialogFooter } from "@/components/EventForm"

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

// Day options moved inside component to be dynamic


// Parse time string to hour and minute
function parseTimeValue(timeStr: string): { hour: number; minute: number } {
    const [h, m] = timeStr.split(":").map(Number)
    return { hour: h || 8, minute: m || 0 }
}

// Get the date for a specific day of the week based on Monday
function getDateForDay(monday: Date, dayIndex: number): Date {
    const date = new Date(monday)
    date.setDate(monday.getDate() + dayIndex)
    return date
}

export function AddEventDialog({
    open,
    onOpenChange,
    onAddEvent,
    weekStart,
    weekStartsOnSunday,
    initialData
}: AddEventDialogProps) {
    const [title, setTitle] = useState("")
    const [selectedDays, setSelectedDays] = useState<number[]>([])
    const [startTime, setStartTime] = useState("08:00")
    const [endTime, setEndTime] = useState("09:00")
    const [description, setDescription] = useState("")
    const [selectedColor, setSelectedColor] = useState<EventColor>("blue")

    // Update state when initialData changes or dialog opens
    useState(() => {
        if (open && initialData) {
            if (initialData.startTime) setStartTime(initialData.startTime)
            if (initialData.endTime) setEndTime(initialData.endTime)
            if (initialData.selectedDays) setSelectedDays(initialData.selectedDays)
        }
    })

    // Also sync when initialData changes while open
    // Using useEffect instead of useState initializer for updates
    const [prevInitialData, setPrevInitialData] = useState(initialData)
    if (initialData !== prevInitialData) {
        setPrevInitialData(initialData)
        if (initialData) {
            if (initialData.startTime) setStartTime(initialData.startTime)
            if (initialData.endTime) setEndTime(initialData.endTime)
            if (initialData.selectedDays) setSelectedDays(initialData.selectedDays)
        }
    }

    // Available color options
    const colorOptions: EventColor[] = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'orange', 'teal']

    // Generate day options based on week start setting
    const dayOptions = useMemo(() => {
        if (weekStartsOnSunday) {
            return [
                { label: "Sun", value: 0 },
                { label: "Mon", value: 1 },
                { label: "Tue", value: 2 },
                { label: "Wed", value: 3 },
                { label: "Thu", value: 4 },
                { label: "Fri", value: 5 },
                { label: "Sat", value: 6 },
            ]
        } else {
            return [
                { label: "Mon", value: 0 },
                { label: "Tue", value: 1 },
                { label: "Wed", value: 2 },
                { label: "Thu", value: 3 },
                { label: "Fri", value: 4 },
                { label: "Sat", value: 5 },
                { label: "Sun", value: 6 },
            ]
        }
    }, [weekStartsOnSunday])

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

        const start = parseTimeValue(startTime)
        const end = parseTimeValue(endTime)

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
                        className="size-8 text-gray-400 hover:text-gray-600"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="size-4" />
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
