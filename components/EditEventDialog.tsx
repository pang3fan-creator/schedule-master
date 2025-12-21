"use client"

import { useState, useEffect, useMemo } from "react"
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
    Edit3,
    X,
    Clock,
    Info,
    Type,
    Palette,
    Calendar,
} from "lucide-react"
import type { Event, EventColor } from "@/lib/types"
import { EVENT_COLORS } from "@/lib/types"
import { formatDateString } from "@/lib/time-utils"
import { EventForm, EventDialogFooter } from "@/components/EventForm"

interface EditEventDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    event: Event | null
    onUpdateEvent: (event: Event) => void
}

const dayOptions = [
    { label: "Mon", value: 0 },
    { label: "Tue", value: 1 },
    { label: "Wed", value: 2 },
    { label: "Thu", value: 3 },
    { label: "Fri", value: 4 },
    { label: "Sat", value: 5 },
    { label: "Sun", value: 6 },
]

// Format hour and minute to time string
function formatTimeString(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

// Parse time string to hour and minute
function parseTimeValue(timeStr: string): { hour: number; minute: number } {
    const [h, m] = timeStr.split(":").map(Number)
    return { hour: h || 8, minute: m || 0 }
}

// Get the Monday of the week containing the given date
function getMonday(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
}

// Get the date for a specific day of the week based on Monday
function getDateForDay(monday: Date, dayIndex: number): Date {
    const date = new Date(monday)
    date.setDate(monday.getDate() + dayIndex)
    return date
}

// Get day index from date string (0 = Monday, 6 = Sunday)
function getDayIndexFromDate(dateStr: string): number {
    const date = new Date(dateStr)
    const day = date.getDay()
    // Convert from JS day (0=Sun, 1=Mon, ..., 6=Sat) to our format (0=Mon, ..., 6=Sun)
    return day === 0 ? 6 : day - 1
}

export function EditEventDialog({
    open,
    onOpenChange,
    event,
    onUpdateEvent,
}: EditEventDialogProps) {
    const [title, setTitle] = useState("")
    const [selectedDay, setSelectedDay] = useState<number>(0)
    const [startTime, setStartTime] = useState("08:00")
    const [endTime, setEndTime] = useState("09:00")
    const [description, setDescription] = useState("")
    const [selectedColor, setSelectedColor] = useState<EventColor>("blue")

    // Available color options
    const colorOptions: EventColor[] = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'orange', 'teal']

    // Calculate the week dates based on event's date
    const weekDates = useMemo(() => {
        if (!event) return []
        const eventDate = new Date(event.date)
        const monday = getMonday(eventDate)
        return dayOptions.map((_, index) => getDateForDay(monday, index))
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
        }
    }, [event, open])

    const handleSubmit = () => {
        if (!title.trim() || !event) return

        const start = parseTimeValue(startTime)
        const end = parseTimeValue(endTime)
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
        })

        onOpenChange(false)
    }

    if (!event) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col" showCloseButton={false}>
                {/* Header */}
                <DialogHeader className="flex flex-row items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <Edit3 className="size-5 text-blue-600" />
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            Edit event
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
