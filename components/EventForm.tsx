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
import { type EventColor, EVENT_COLORS } from "@/lib/types"

interface DayOption {
    label: string
    value: number
}

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
}: EventFormProps) {
    // Available color options
    const colorOptions: EventColor[] = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'orange', 'teal']

    return (
        <div className="space-y-4 md:space-y-5">
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
                        onChange={(e) => onTitleChange(e.target.value)}
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
                    <div className="flex gap-1.5 flex-1 flex-wrap">
                        {colorOptions.map((color) => {
                            const colorConfig = EVENT_COLORS[color]
                            return (
                                <button
                                    key={color}
                                    type="button"
                                    className={`size-8 rounded-full border-2 transition-all ${colorConfig.bg} ${selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 border-gray-400' : 'border-transparent hover:scale-110'}`}
                                    onClick={() => onColorChange(color)}
                                    title={color.charAt(0).toUpperCase() + color.slice(1)}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Day(s) Field */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                    {selectionMode === 'single' ? 'Day' : 'Day(s)'}
                </Label>
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
                                onClick={() => onDayToggle(day.value)}
                            >
                                {day.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Clock className="size-4 text-gray-400" />
                        Start
                    </Label>
                    <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => onStartTimeChange(e.target.value)}
                        className="h-10 w-full"
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
                        onChange={(e) => onEndTimeChange(e.target.value)}
                        className="h-10 w-full"
                    />
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
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        className="flex-1 min-h-[80px] border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
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
        <div className="flex border-t border-gray-100">
            <Button
                variant="ghost"
                className="flex-1 h-12 rounded-none text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium border-r border-gray-100"
                onClick={onSecondary}
            >
                {secondaryText}
            </Button>
            <Button
                className="flex-1 h-12 rounded-none bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium"
                onClick={onPrimary}
                disabled={disablePrimary}
            >
                {primaryText}
            </Button>
        </div>
    )
}
