"use client"

import * as React from "react"
import { useRef, useState, useEffect, useMemo } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Event {
    id: string
    title: string
    code: string
    day: number
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
}

interface DailyCalendarProps {
    events: Event[]
    selectedDate: Date
    onDateChange: (date: Date) => void
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const shortDayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

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
    if (hour === 12) return "12 PM"
    if (hour > 12) return `${hour - 12} PM`
    return `${hour} AM`
}

function formatTime(hour: number, minute: number): string {
    const h = hour > 12 ? hour - 12 : hour
    const m = minute === 0 ? ":00" : `:${minute.toString().padStart(2, "0")}`
    return `${h}${m}`
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

export function DailyCalendar({ events, selectedDate, onDateChange }: DailyCalendarProps) {
    const gridRef = useRef<HTMLDivElement>(null)
    const [rowHeight, setRowHeight] = useState(58)

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

    // Filter events for the selected day
    const dayEvents = useMemo(() => {
        return events.filter(event => event.day === currentDayIndex)
    }, [events, currentDayIndex])

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

    return (
        <div className="flex h-full flex-col p-6 bg-gray-100">
            {/* Header with navigation */}
            <div className="mb-4 flex items-center justify-center flex-shrink-0">
                <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToPreviousDay}>
                    <ChevronLeft className="size-6" />
                </Button>
                <h2 className="text-xl font-semibold text-gray-900 min-w-[320px] text-center">{formatDate(selectedDate)}</h2>
                <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToNextDay}>
                    <ChevronRight className="size-6" />
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
                                            const position = getEventPosition(event, rowHeight)
                                            return (
                                                <div
                                                    key={event.id}
                                                    className="absolute left-1 right-1 z-10 rounded-md border-l-4 border-blue-500 bg-blue-100 p-2 overflow-hidden"
                                                    style={{
                                                        top: position.top,
                                                        height: position.height,
                                                    }}
                                                >
                                                    <p className="text-sm font-semibold text-blue-700">{event.title}</p>
                                                    <p className="text-xs text-blue-600">{event.code}</p>
                                                    <p className="absolute bottom-2 left-2 text-xs text-blue-600">
                                                        {formatTime(event.startHour, event.startMinute)} -{" "}
                                                        {formatTime(event.endHour, event.endMinute)}
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
