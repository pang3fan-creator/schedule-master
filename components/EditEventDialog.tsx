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
import type { Event, EventColor } from "@/components/weekly-calendar"
import { EVENT_COLORS, formatDateString } from "@/components/weekly-calendar"

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
            <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden" showCloseButton={false}>
                {/* Header */}
                <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
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

                {/* Form Content */}
                <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Type className="size-4 text-gray-400" />
                            Title
                        </Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Event title"
                            className="h-10"
                            style={{ wordBreak: 'break-all' }}
                        />
                    </div>

                    {/* Day Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="size-4 text-gray-400" />
                            Day
                        </Label>
                        <div className="flex gap-2">
                            {dayOptions.map((day) => (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => setSelectedDay(day.value)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedDay === day.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Clock className="size-4 text-gray-400" />
                                Start
                            </Label>
                            <Input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Clock className="size-4 text-gray-400" />
                                End
                            </Label>
                            <Input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="h-10"
                            />
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Palette className="size-4 text-gray-400" />
                            Color
                        </Label>
                        <div className="flex gap-2 flex-wrap">
                            {colorOptions.map((colorName) => {
                                const colors = EVENT_COLORS[colorName]
                                return (
                                    <button
                                        key={colorName}
                                        type="button"
                                        onClick={() => setSelectedColor(colorName)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${colors.bg} ${selectedColor === colorName
                                            ? `${colors.border} ring-2 ring-offset-2 ring-blue-500`
                                            : 'border-transparent hover:scale-110'
                                            }`}
                                        title={colorName}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Info className="size-4 text-gray-400" />
                            Description
                        </Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add notes or description..."
                            className="min-h-[80px] resize-none"
                            style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="px-4"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!title.trim()}
                        className="px-4 bg-blue-600 hover:bg-blue-700"
                    >
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
