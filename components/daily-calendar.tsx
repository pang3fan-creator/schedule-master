"use client"

import * as React from "react"
import { useRef, useState, useEffect, useMemo } from "react"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

import { type Event, EVENT_COLORS } from "@/lib/types"
// Utility functions imported from lib/time-utils
import {
    formatDateString,
    formatHour as formatHourUtil,
    formatTime as formatTimeUtil,
    getEventPosition as getEventPositionUtil
} from "@/lib/time-utils"
import { useSettings } from "@/components/SettingsContext"
import { useEventDrag } from "@/hooks/useEventDrag"

interface DailyCalendarProps {
    events: Event[]
    selectedDate: Date
    onDateChange: (date: Date) => void
    onEventUpdate?: (updatedEvent: Event) => void
    onEventDelete?: (eventId: string) => void
    onEventDoubleClick?: (event: Event) => void
    onEventContextMenu?: (event: Event, x: number, y: number) => void
    onEventLongPress?: (event: Event) => void  // For mobile long-press action
    exportMode?: boolean  // When true, renders for export (no scroll, fixed heights)
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const shortDayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

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

// Wrapper to match existing usage
function formatHour(hour: number, use12Hour: boolean): string {
    return formatHourUtil(hour, use12Hour)
}

function formatTime(hour: number, minute: number, use12Hour: boolean): string {
    return formatTimeUtil(hour, minute, use12Hour)
}

function getEventPosition(event: Event, rowHeight: number) {
    return getEventPositionUtil(
        event.startHour,
        event.startMinute,
        event.endHour,
        event.endMinute,
        rowHeight,
        8 // Default minHour
    )
}


export function DailyCalendar({ events, selectedDate, onDateChange, onEventUpdate, onEventDelete, onEventDoubleClick, onEventContextMenu, onEventLongPress, exportMode = false }: DailyCalendarProps) {
    const gridRef = useRef<HTMLDivElement>(null)
    // In export mode, use fixed row height
    const EXPORT_ROW_HEIGHT = 80
    const [rowHeight, setRowHeight] = useState(exportMode ? EXPORT_ROW_HEIGHT : 58)

    // Update rowHeight when exportMode changes
    useEffect(() => {
        if (exportMode) {
            setRowHeight(EXPORT_ROW_HEIGHT)
        }
        // When returning to normal mode, the resize handler will recalculate
    }, [exportMode])

    // Get settings from context
    const { settings } = useSettings()
    const { use12HourFormat, workingHoursStart, workingHoursEnd, timeIncrement } = settings

    // Generate hours array dynamically based on settings
    const hours = useMemo(() => {
        const result: number[] = []
        for (let h = workingHoursStart; h <= workingHoursEnd; h++) {
            result.push(h)
        }
        return result
    }, [workingHoursStart, workingHoursEnd])

    // Use the event drag hook for drag-and-drop with touch support
    const {
        dragState,
        handleMouseDown,
        handleTouchStart,
        getVisualPosition,
        getDisplayTime,
    } = useEventDrag({
        onEventUpdate,
        rowHeight,
        minHour: workingHoursStart,
        maxHour: workingHoursEnd,
        events,  // Pass events for collision detection during drag
        timeIncrement,  // Pass time increment for drag snapping
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

    // Calculate actual row height based on grid dimensions and hour count
    useEffect(() => {
        const updateRowHeight = () => {
            if (gridRef.current) {
                const gridElement = gridRef.current
                const gridHeight = gridElement.clientHeight
                const headerHeight = 48
                const labelRowHeight = 24  // Last row is label-only
                const availableHeight = gridHeight - headerHeight - labelRowHeight
                // Dynamic row count based on hours array
                const dataRowCount = hours.length - 1
                const calculatedRowHeight = availableHeight / dataRowCount
                // Set minimum row height to prevent compression
                const finalRowHeight = Math.max(calculatedRowHeight, 50)
                if (finalRowHeight > 0) {
                    setRowHeight(finalRowHeight)
                }
            }
        }

        updateRowHeight()
        window.addEventListener('resize', updateRowHeight)
        return () => window.removeEventListener('resize', updateRowHeight)
    }, [hours.length])

    // Navigate to today
    const goToToday = () => {
        onDateChange(new Date())
    }

    return (
        <div className={`flex flex-col p-4 md:p-6 bg-muted/20 ${exportMode ? '' : 'h-full'}`}>
            {/* Header with navigation - responsive layout */}
            <div className="mb-4 flex-shrink-0">
                {/* Desktop layout */}
                <div className="hidden md:flex items-center justify-between relative">
                    {/* Spacer for layout balance - hidden in export mode */}
                    {!exportMode && <div className="w-20"></div>}

                    {/* Center navigation - absolute positioned for true centering */}
                    <div className={`flex items-center ${exportMode ? 'flex-1 justify-center' : 'absolute left-1/2 -translate-x-1/2'}`}>
                        {!exportMode && (
                            <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToPreviousDay}>
                                <ChevronLeft className="size-6" />
                            </Button>
                        )}
                        <h2 className="text-xl font-semibold text-gray-900 min-w-[320px] text-center">{formatDate(selectedDate)}</h2>
                        {!exportMode && (
                            <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToNextDay}>
                                <ChevronRight className="size-6" />
                            </Button>
                        )}
                    </div>

                    {/* Today button - hidden in export mode */}
                    {!exportMode && (
                        <Button
                            variant="outline"
                            className="w-20 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium"
                            onClick={goToToday}
                        >
                            Today
                        </Button>
                    )}
                </div>

                {/* Mobile layout - stacked */}
                <div className="md:hidden flex flex-col items-center gap-2">
                    {/* Navigation row */}
                    {!exportMode && (
                        <div className="flex items-center justify-center w-full">
                            <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToPreviousDay}>
                                <ChevronLeft className="size-6" />
                            </Button>
                            <h2 className="text-base font-semibold text-gray-900 text-center flex-1 px-2">{formatDate(selectedDate)}</h2>
                            <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToNextDay}>
                                <ChevronRight className="size-6" />
                            </Button>
                        </div>
                    )}
                    {/* Today button - below date on mobile */}
                    {!exportMode && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium"
                            onClick={goToToday}
                        >
                            Today
                        </Button>
                    )}
                </div>
            </div>

            {/* Calendar Grid - responsive width */}
            <div className={exportMode ? '' : 'flex-1 min-h-0 overflow-auto'}>
                <div className="mx-auto max-w-4xl h-full">
                    <div
                        ref={gridRef}
                        className={`grid w-full ${exportMode ? '' : 'h-full'}`}
                        style={{
                            gridTemplateColumns: "60px 1fr",
                            gridTemplateRows: exportMode
                                ? `48px repeat(${hours.length - 1}, ${EXPORT_ROW_HEIGHT}px) 24px`
                                : `48px repeat(${hours.length - 1}, minmax(50px, 1fr)) 24px`,
                        }}
                    >
                        {/* Header Row */}
                        <div /> {/* Empty corner cell */}
                        <div className="flex flex-col items-center justify-center border-b border-gray-300">
                            <span className="text-xs font-medium text-gray-500">{shortDayName}</span>
                            <span className="text-sm font-semibold text-gray-900">{selectedDate.getDate()}</span>
                        </div>

                        {/* Time rows - data rows with time slots, last row is label-only */}
                        {hours.map((hour, index) => (
                            <React.Fragment key={hour}>
                                <div className="flex items-start justify-end pr-3">
                                    <span className="text-xs font-medium text-gray-500 -translate-y-1/2 whitespace-nowrap">{formatHour(hour, use12HourFormat)}</span>
                                </div>

                                {/* Day cell - only render for data rows (not the last label row) */}
                                {index !== hours.length - 1 && (
                                    <div className="relative border-b border-l border-r border-gray-300">
                                        {/* Render events for this cell */}
                                        {index === 0 &&
                                            dayEvents.map((event) => {
                                                const position = getVisualPosition(event)
                                                const displayTime = getDisplayTime(event)
                                                const isDragging = dragState.eventId === event.id
                                                const colorConfig = EVENT_COLORS[event.color || 'blue']
                                                return (
                                                    <div
                                                        key={event.id}
                                                        className={`group absolute left-1 right-1 z-10 rounded-lg border-l-4 ${colorConfig.border} ${colorConfig.bg} backdrop-blur-sm p-2 overflow-hidden text-center flex flex-col justify-between ${isDragging ? 'cursor-grabbing shadow-xl ring-2 ring-blue-400' : 'cursor-grab hover:shadow-lg hover:scale-[1.02] transition-all duration-200'}`}
                                                        style={{
                                                            top: position.top,
                                                            height: position.height,
                                                            transition: isDragging ? 'none' : 'top 0.1s ease-out, height 0.1s ease-out',
                                                            userSelect: 'none',
                                                        }}
                                                        onMouseDown={(e) => handleMouseDown(e, event)}
                                                        onTouchStart={(e) => handleTouchStart(e, event)}
                                                        onDoubleClick={(e) => {
                                                            if (!isDragging) {
                                                                e.stopPropagation()
                                                                // On mobile, use action sheet; on desktop, use edit dialog
                                                                if (onEventLongPress && window.innerWidth < 768) {
                                                                    onEventLongPress(event)
                                                                } else if (onEventDoubleClick) {
                                                                    onEventDoubleClick(event)
                                                                }
                                                            }
                                                        }}
                                                        onContextMenu={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            if (onEventContextMenu) {
                                                                onEventContextMenu(event, e.clientX, e.clientY)
                                                            }
                                                        }}
                                                    >
                                                        {/* Delete button - hidden on mobile (use double-tap instead) */}
                                                        {onEventDelete && (
                                                            <button
                                                                type="button"
                                                                className="absolute top-1 right-1 size-5 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hidden md:flex"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    e.preventDefault()
                                                                    onEventDelete(event.id)
                                                                }}
                                                                onMouseDown={(e) => e.stopPropagation()}
                                                            >
                                                                <X className="size-3" />
                                                            </button>
                                                        )}
                                                        <p className={`text-sm font-semibold ${colorConfig.text}`}>{event.title}</p>
                                                        <p className={`text-xs ${colorConfig.textSecondary}`}>{event.description}</p>
                                                        <p className={`text-xs ${colorConfig.textSecondary}`}>
                                                            {formatTime(displayTime.startHour, displayTime.startMinute, use12HourFormat)} -{" "}
                                                            {formatTime(displayTime.endHour, displayTime.endMinute, use12HourFormat)}
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
        </div>
    )
}

