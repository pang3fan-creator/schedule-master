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
    Type,
    Hash,
} from "lucide-react"
import type { Event } from "@/components/weekly-calendar"
import { formatDateString } from "@/components/weekly-calendar"

interface AddEventDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddEvent: (event: Omit<Event, "id">) => void
    currentMonday: Date // The Monday of the currently displayed week
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
    currentMonday,
}: AddEventDialogProps) {
    const [title, setTitle] = useState("")
    const [code, setCode] = useState("")
    const [selectedDays, setSelectedDays] = useState<number[]>([])
    const [startTime, setStartTime] = useState("08:00")
    const [endTime, setEndTime] = useState("09:00")
    const [description, setDescription] = useState("")

    // Calculate the week dates based on currentMonday
    const weekDates = useMemo(() => {
        return dayOptions.map((_, index) => getDateForDay(currentMonday, index))
    }, [currentMonday])

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
                code: code.trim() || "",
                description: description.trim(),
                day,
                date: formatDateString(eventDate),
                startHour: start.hour,
                startMinute: start.minute,
                endHour: end.hour,
                endMinute: end.minute,
            })
        })

        // Reset form and close dialog
        handleReset()
        onOpenChange(false)
    }

    const handleReset = () => {
        setTitle("")
        setCode("")
        setSelectedDays([])
        setStartTime("08:00")
        setEndTime("09:00")
        setDescription("")
    }

    const handleCopy = () => {
        // Copy event data to clipboard
        const eventData = {
            title,
            code,
            days: selectedDays.map((d) => dayOptions[d].label),
            startTime,
            endTime,
            description,
        }
        navigator.clipboard.writeText(JSON.stringify(eventData, null, 2))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden" showCloseButton={false}>
                {/* Header */}
                <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
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

                {/* Form Content */}
                <div className="px-6 py-5 space-y-5">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Title</Label>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center size-9 border border-gray-200 rounded-md bg-gray-50">
                                <Tag className="size-4 text-gray-500" />
                            </div>
                            <Input
                                placeholder="Event title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="flex-1 h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-3 border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                <Type className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-3 border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                <Hash className="size-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Day(s) Field */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Day(s)</Label>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center size-9 border border-gray-200 rounded-md bg-gray-50">
                                <Calendar className="size-4 text-gray-500" />
                            </div>
                            <div className="flex gap-1.5 flex-1">
                                {dayOptions.map((day) => (
                                    <Button
                                        key={day.value}
                                        variant="outline"
                                        size="sm"
                                        className={`h-9 px-3 text-xs font-medium transition-all ${selectedDays.includes(day.value)
                                            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                                            }`}
                                        onClick={() => handleDayToggle(day.value)}
                                    >
                                        {day.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Start time - End time Field */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Start time - End time
                        </Label>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center size-9 border border-gray-200 rounded-md bg-gray-50">
                                <Clock className="size-4 text-gray-500" />
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                                <div className="relative flex-1">
                                    <Input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>
                                <Clock className="size-4 text-gray-400" />
                                <div className="relative flex-1">
                                    <Input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    />
                                </div>
                                <Clock className="size-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Description
                        </Label>
                        <div className="flex gap-2">
                            <div className="flex items-start justify-center size-9 pt-2 border border-gray-200 rounded-md bg-gray-50">
                                <Info className="size-4 text-gray-500" />
                            </div>
                            <Textarea
                                placeholder="Event description (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="flex-1 min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex border-t border-gray-100">
                    <Button
                        variant="ghost"
                        className="flex-1 h-12 rounded-none text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium border-r border-gray-100"
                        onClick={handleCopy}
                    >
                        Copy
                    </Button>
                    <Button
                        className="flex-1 h-12 rounded-none bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium"
                        onClick={handleSubmit}
                        disabled={!title.trim() || selectedDays.length === 0}
                    >
                        Add
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
