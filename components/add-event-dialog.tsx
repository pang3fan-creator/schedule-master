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

interface AddEventDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddEvent: (event: Omit<Event, "id">) => void
    currentMonday: Date // The Monday of the currently displayed week
    initialData?: {
        startTime?: string
        endTime?: string
        selectedDays?: number[]
    }
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
            days: selectedDays.map((d) => dayOptions[d].label),
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
                <div className="px-4 md:px-6 py-4 md:py-5 space-y-4 md:space-y-5 overflow-y-auto flex-1">
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
                                style={{ wordBreak: 'break-all' }}
                            />
                        </div>
                    </div>

                    {/* Color Field */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Color</Label>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center size-9 border border-gray-200 rounded-md bg-gray-50">
                                <Palette className="size-4 text-gray-500" />
                            </div>
                            <div className="flex gap-1.5 flex-1">
                                {colorOptions.map((color) => {
                                    const colorConfig = EVENT_COLORS[color]
                                    return (
                                        <button
                                            key={color}
                                            type="button"
                                            className={`size-8 rounded-full border-2 transition-all ${colorConfig.bg} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 border-gray-400' : 'border-transparent hover:scale-110'}`}
                                            onClick={() => setSelectedColor(color)}
                                            title={color.charAt(0).toUpperCase() + color.slice(1)}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Day(s) Field */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Day(s)</Label>
                        <div className="flex items-start gap-2">
                            <div className="flex items-center justify-center size-9 border border-gray-200 rounded-md bg-gray-50 shrink-0">
                                <Calendar className="size-4 text-gray-500" />
                            </div>
                            <div className="flex flex-wrap gap-1.5 flex-1">
                                {dayOptions.map((day) => (
                                    <Button
                                        key={day.value}
                                        variant="outline"
                                        size="sm"
                                        className={`h-9 px-2 md:px-3 text-xs font-medium transition-all ${selectedDays.includes(day.value)
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
                                style={{ wordBreak: 'break-all', overflowWrap: 'break-word' }}
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
