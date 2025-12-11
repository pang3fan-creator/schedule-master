"use client"

import * as React from "react"
import { useRef, useState, useEffect, useMemo, useCallback } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Event } from "@/components/weekly-calendar"
import { formatDateString } from "@/components/weekly-calendar"

interface DailyCalendarProps {
    events: Event[]
    selectedDate: Date
    onDateChange: (date: Date) => void
    onEventUpdate?: (updatedEvent: Event) => void
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const shortDayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

// Time constraints
const MIN_HOUR = 8  // 8 AM
const MAX_HOUR = 17 // 5 PM

// Get the Monday of the week containing the given date
function getMonday(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
}

// Get day index (0-6, Monday-Sunday) for event filtering
function getDayIndex(date: Date): number {
    const day = date.getDay()
    // Convert from Sunday=0 to Monday=0
    return day === 0 ? 6 : day - 1
}

// Format date for header (e.g., "Thursday, December 11, 2025")
function formatDate(date: Date): string {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const dayName = dayNames[date.getDay()]
    const month = monthNames[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()

    return `${dayName}, ${month} ${day}, ${year}`
}

function formatHour(hour: number): string {
    return `${hour.toString().padStart(2, "0")}:00`
}

function formatTime(hour: number, minute: number): string {
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
}

// Calculate event position using actual row height in pixels
function getEventPosition(event: Event, rowHeight: number) {
    const startOffset = (event.startHour - 8) + event.startMinute / 60
    const endOffset = (event.endHour - 8) + event.endMinute / 60
    const duration = endOffset - startOffset

    return {
        top: `${startOffset * rowHeight}px`,
        height: `${duration * rowHeight - 8}px`,
    }
}

// Calculate new time based on drag offset
function calculateDraggedTime(
    originalStartHour: number,
    originalStartMinute: number,
    originalEndHour: number,
    originalEndMinute: number,
    offsetPx: number,
    rowHeight: number
): { startHour: number; startMinute: number; endHour: number; endMinute: number } {
    const hourOffset = offsetPx / rowHeight

    // Calculate new start time
    let newStartTotalMinutes = (originalStartHour * 60 + originalStartMinute) + (hourOffset * 60)
    const duration = (originalEndHour * 60 + originalEndMinute) - (originalStartHour * 60 + originalStartMinute)

    // Round to nearest 5 minutes for cleaner times (do this first)
    newStartTotalMinutes = Math.round(newStartTotalMinutes / 5) * 5
    let newEndTotalMinutes = newStartTotalMinutes + duration

    // Constrain to boundaries (apply after rounding)
    const minMinutes = MIN_HOUR * 60 // 8:00 AM = 480 minutes
    const maxMinutes = MAX_HOUR * 60 // 5:00 PM = 1020 minutes

    // Ensure start time doesn't go before MIN_HOUR
    if (newStartTotalMinutes < minMinutes) {
        newStartTotalMinutes = minMinutes
        newEndTotalMinutes = minMinutes + duration
    }

    // Ensure end time doesn't go after MAX_HOUR
    if (newEndTotalMinutes > maxMinutes) {
        newEndTotalMinutes = maxMinutes
        newStartTotalMinutes = maxMinutes - duration
    }

    return {
        startHour: Math.floor(newStartTotalMinutes / 60),
        startMinute: Math.round(newStartTotalMinutes % 60),
        endHour: Math.floor(newEndTotalMinutes / 60),
        endMinute: Math.round(newEndTotalMinutes % 60),
    }
}

export function DailyCalendar({ events, selectedDate, onDateChange, onEventUpdate }: DailyCalendarProps) {
    const gridRef = useRef<HTMLDivElement>(null)
    const [rowHeight, setRowHeight] = useState(58)

    // Drag state
    const [dragState, setDragState] = useState<{
        eventId: string | null
        startY: number
        originalEvent: Event | null
        currentOffset: number
    }>({
        eventId: null,
        startY: 0,
        originalEvent: null,
        currentOffset: 0,
    })

    // Get day index for filtering events
    const currentDayIndex = useMemo(() => getDayIndex(selectedDate), [selectedDate])

    // Get short day name for header
    const shortDayName = useMemo(() => {
        const day = selectedDate.getDay()
        return shortDayNames[day]
    }, [selectedDate])

    // Navigate to previous day
    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate)
        newDate.setDate(selectedDate.getDate() - 1)
        onDateChange(newDate)
    }

    // Navigate to next day
    const goToNextDay = () => {
        const newDate = new Date(selectedDate)
        newDate.setDate(selectedDate.getDate() + 1)
        onDateChange(newDate)
    }

    // Filter events for the selected day using date string
    const dayEvents = useMemo(() => {
        const selectedDateString = formatDateString(selectedDate)
        return events.filter(event => event.date === selectedDateString)
    }, [events, selectedDate])

    // Calculate actual row height based on grid dimensions
    useEffect(() => {
        const updateRowHeight = () => {
            if (gridRef.current) {
                const gridElement = gridRef.current
                const gridHeight = gridElement.clientHeight
                const headerHeight = 48
                const availableHeight = gridHeight - headerHeight
                const calculatedRowHeight = availableHeight / 9
                if (calculatedRowHeight > 0) {
                    setRowHeight(calculatedRowHeight)
                }
            }
        }

        updateRowHeight()
        window.addEventListener('resize', updateRowHeight)
        return () => window.removeEventListener('resize', updateRowHeight)
    }, [])

    // Handle mouse down on event card
    const handleMouseDown = useCallback((e: React.MouseEvent, event: Event) => {
        e.preventDefault()
        e.stopPropagation()
        setDragState({
            eventId: event.id,
            startY: e.clientY,
            originalEvent: { ...event },
            currentOffset: 0,
        })
    }, [])

    // Handle mouse move (global)
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (dragState.eventId && dragState.originalEvent) {
                const offset = e.clientY - dragState.startY
                setDragState(prev => ({ ...prev, currentOffset: offset }))
            }
        }

        const handleMouseUp = () => {
            if (dragState.eventId && dragState.originalEvent && onEventUpdate) {
                const newTimes = calculateDraggedTime(
                    dragState.originalEvent.startHour,
                    dragState.originalEvent.startMinute,
                    dragState.originalEvent.endHour,
                    dragState.originalEvent.endMinute,
                    dragState.currentOffset,
                    rowHeight
                )

                onEventUpdate({
                    ...dragState.originalEvent,
                    ...newTimes,
                })
            }

            setDragState({
                eventId: null,
                startY: 0,
                originalEvent: null,
                currentOffset: 0,
            })
        }

        if (dragState.eventId) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [dragState.eventId, dragState.originalEvent, dragState.startY, dragState.currentOffset, rowHeight, onEventUpdate])

    // Get display time for an event (considering drag state)
    const getDisplayTime = useCallback((event: Event) => {
        if (dragState.eventId === event.id && dragState.originalEvent) {
            const newTimes = calculateDraggedTime(
                dragState.originalEvent.startHour,
                dragState.originalEvent.startMinute,
                dragState.originalEvent.endHour,
                dragState.originalEvent.endMinute,
                dragState.currentOffset,
                rowHeight
            )
            return {
                startHour: newTimes.startHour,
                startMinute: newTimes.startMinute,
                endHour: newTimes.endHour,
                endMinute: newTimes.endMinute,
            }
        }
        return {
            startHour: event.startHour,
            startMinute: event.startMinute,
            endHour: event.endHour,
            endMinute: event.endMinute,
        }
    }, [dragState, rowHeight])

    // Get visual position for an event (considering drag state)
    const getVisualPosition = useCallback((event: Event) => {
        if (dragState.eventId === event.id && dragState.originalEvent) {
            const newTimes = calculateDraggedTime(
                dragState.originalEvent.startHour,
                dragState.originalEvent.startMinute,
                dragState.originalEvent.endHour,
                dragState.originalEvent.endMinute,
                dragState.currentOffset,
                rowHeight
            )
            const tempEvent = { ...event, ...newTimes }
            return getEventPosition(tempEvent, rowHeight)
        }
        return getEventPosition(event, rowHeight)
    }, [dragState, rowHeight])

    // Navigate to today
    const goToToday = () => {
        onDateChange(new Date())
    }

    return (
        <div className="flex h-full flex-col p-6 bg-gray-100">
            {/* Header with navigation */}
            <div className="mb-4 flex items-center justify-between flex-shrink-0">
                {/* Spacer for layout balance */}
                <div className="w-20"></div>

                {/* Center navigation */}
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToPreviousDay}>
                        <ChevronLeft className="size-6" />
                    </Button>
                    <h2 className="text-xl font-semibold text-gray-900 min-w-[320px] text-center">{formatDate(selectedDate)}</h2>
                    <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToNextDay}>
                        <ChevronRight className="size-6" />
                    </Button>
                </div>

                {/* Today button */}
                <Button
                    variant="outline"
                    className="w-20 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium"
                    onClick={goToToday}
                >
                    Today
                </Button>
            </div>

            {/* Calendar Grid - single day view */}
            <div className="flex-1 min-h-0 overflow-auto">
                <div
                    ref={gridRef}
                    className="grid min-w-[400px] h-full"
                    style={{
                        gridTemplateColumns: "60px 1fr",
                        gridTemplateRows: "48px repeat(9, 1fr) auto"
                    }}
                >
                    {/* Header Row */}
                    <div /> {/* Empty corner cell */}
                    <div className="flex flex-col items-center justify-center border-b border-gray-300">
                        <span className="text-xs font-medium text-gray-500">{shortDayName}</span>
                        <span className="text-sm font-semibold text-gray-900">{selectedDate.getDate()}</span>
                    </div>

                    {/* Time rows - 9 data rows (8AM-4PM) + 1 label row (5PM) */}
                    {hours.map((hour, index) => (
                        <React.Fragment key={hour}>
                            {/* Time label */}
                            <div className="flex items-start justify-end pr-3">
                                <span className="text-xs text-gray-400 -translate-y-1/2">{formatHour(hour)}</span>
                            </div>

                            {/* Day cell - only render for rows with actual time slots (not the last label row) */}
                            {index !== hours.length - 1 && (
                                <div className="relative border-b border-l border-r border-gray-300">
                                    {/* Render events for this cell */}
                                    {hour === 8 &&
                                        dayEvents.map((event) => {
                                            const position = getVisualPosition(event)
                                            const displayTime = getDisplayTime(event)
                                            const isDragging = dragState.eventId === event.id
                                            return (
                                                <div
                                                    key={event.id}
                                                    className={`absolute left-1 right-1 z-10 rounded-md border-l-4 border-blue-500 bg-blue-100 p-2 overflow-hidden text-center flex flex-col justify-between ${isDragging ? 'cursor-grabbing shadow-lg ring-2 ring-blue-400' : 'cursor-grab'}`}
                                                    style={{
                                                        top: position.top,
                                                        height: position.height,
                                                        transition: isDragging ? 'none' : 'top 0.1s ease-out, height 0.1s ease-out',
                                                        userSelect: 'none',
                                                    }}
                                                    onMouseDown={(e) => handleMouseDown(e, event)}
                                                >
                                                    <p className="text-sm font-semibold text-blue-700">{event.title}</p>
                                                    <p className="text-xs text-blue-600">{event.description}</p>
                                                    <p className="text-xs text-blue-600">
                                                        {formatTime(displayTime.startHour, displayTime.startMinute)} -{" "}
                                                        {formatTime(displayTime.endHour, displayTime.endMinute)}
                                                    </p>
                                                </div>
                                            )
                                        })}
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    )
}

