"use client"

import * as React from "react"
import { useRef, useState, useEffect, useMemo, useCallback } from "react"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

import { type Event, EVENT_COLORS } from "@/lib/types"
// Utility functions imported from lib/time-utils
import {
    formatDateString,
    formatHour,
    formatTime,
    getEventPosition as getEventPositionUtil,
    groupOverlappingEvents,
    DAY_NAMES,
    SHORT_DAY_NAMES,
    getWeekStart,
    getIsoDayIndex
} from "@/lib/time-utils"
import { useSettings } from "@/components/SettingsContext"
import { useEventDrag } from "@/hooks/useEventDrag"
import { useDragToCreate } from "@/hooks/useDragToCreate"
import { useCurrentTime } from "@/hooks/useCurrentTime"
import { useIsMobile } from "@/hooks/useMediaQuery"
import {
    getDisplayMode,
    getContainerClasses,
    getTitleClasses,
    shouldShowTime,
    getTimeClasses,
    shouldShowDescription,
    getDescriptionClasses
} from "@/lib/event-display-utils"

interface DailyCalendarProps {
    events: Event[]
    selectedDate: Date
    onDateChange: (date: Date) => void
    onEventUpdate?: (updatedEvent: Event) => void
    onEventDelete?: (eventId: string) => void
    onEventClick?: (event: Event) => void  // Single click to edit
    onEventContextMenu?: (event: Event, x: number, y: number) => void
    exportMode?: boolean  // When true, renders for export (no scroll, fixed heights)
    onAddEvent?: (data: { startTime: string; endTime: string; day: number }) => void
}

const dayNames = DAY_NAMES
const shortDayNames = SHORT_DAY_NAMES



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


export function DailyCalendar({ events, selectedDate, onDateChange, onEventUpdate, onEventDelete, onEventClick, onEventContextMenu, exportMode = false, onAddEvent }: DailyCalendarProps) {
    const gridRef = useRef<HTMLDivElement>(null)
    // In export mode, use fixed row height
    const EXPORT_ROW_HEIGHT = 80
    const [rowHeight, setRowHeight] = useState(exportMode ? EXPORT_ROW_HEIGHT : 58)
    const isMobile = useIsMobile()

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
        wasRecentlyDragged,
    } = useEventDrag({
        onEventUpdate,
        rowHeight,
        minHour: workingHoursStart,
        maxHour: workingHoursEnd,
        events,  // Pass events for collision detection during drag
        timeIncrement,  // Pass time increment for drag snapping
    })

    // Drag-to-create hook
    const { creatingEvent, handleGridMouseDown: handleCreateMouseDown, handleGridTouchStart: handleCreateTouchStart } = useDragToCreate({
        onAddEvent,
        rowHeight,
        timeIncrement
    })

    // Current Time hook
    const currentTime = useCurrentTime()

    // Check if selected date is today
    const isToday = useMemo(() => {
        const today = new Date()
        return selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear()
    }, [selectedDate, currentTime]) // Re-check if day changes (unlikely but safe)

    // Get day index for filtering events
    const currentDayIndex = useMemo(() => getIsoDayIndex(selectedDate), [selectedDate])

    // ... rest of logic ...



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
                // Mobile uses 60px, desktop uses 80px
                const minRowHeight = isMobile ? 60 : 80
                const finalRowHeight = Math.max(calculatedRowHeight, minRowHeight)
                if (finalRowHeight > 0) {
                    setRowHeight(finalRowHeight)
                }
            }
        }

        updateRowHeight()
        window.addEventListener('resize', updateRowHeight)
        return () => window.removeEventListener('resize', updateRowHeight)
    }, [hours.length, isMobile])  // Re-calculate when isMobile changes

    // Navigate to today
    const goToToday = () => {
        onDateChange(new Date())
    }


    // Helper for ghost event position
    const getGhostPosition = () => {
        if (!creatingEvent) return undefined
        return getEventPositionUtil(
            creatingEvent.startHour,
            creatingEvent.startMinute,
            creatingEvent.endHour,
            creatingEvent.endMinute,
            rowHeight,
            settings.workingHoursStart
        )
    }

    // Memoize grouped events to avoid recalculation on every render
    const groupedDayEvents = useMemo(() => groupOverlappingEvents(dayEvents), [dayEvents])

    return (
        <div className={`flex flex-col p-2 md:p-6 bg-muted/20 ${exportMode ? '' : 'h-full'}`}>
            {/* Header with navigation - responsive layout */}
            <div className="mb-1 md:mb-4 flex-shrink-0">
                {/* Desktop layout */}
                <div className="hidden md:flex items-center justify-between relative">
                    {/* Spacer for layout balance - hidden in export mode */}
                    {!exportMode && <div className="w-20"></div>}

                    {/* Center navigation - absolute positioned for true centering */}
                    <div className={`flex items-center ${exportMode ? 'flex-1 justify-center' : 'absolute left-1/2 -translate-x-1/2'}`}>
                        {!exportMode && (
                            <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToPreviousDay} aria-label="Go to previous day">
                                <ChevronLeft className="size-6" />
                            </Button>
                        )}
                        <h2 className="text-xl font-semibold text-gray-900 min-w-[320px] text-center">{formatDate(selectedDate)}</h2>
                        {!exportMode && (
                            <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToNextDay} aria-label="Go to next day">
                                <ChevronRight className="size-6" />
                            </Button>
                        )}
                    </div>

                    {/* Spacer for layout balance - already implicitly balanced by removing button on right? No, we need an empty div to balance the left spacer if the left spacer exists. 
                        Wait, lines 231 has a spacer: {!exportMode && <div className="w-20"></div>}
                        So I should put an empty div here too.
                    */}
                    {!exportMode && <div className="w-20"></div>}
                </div>

                {/* Mobile layout - stacked */}
                <div className="md:hidden flex flex-col items-center">
                    {/* Navigation row */}
                    {!exportMode && (
                        <div className="flex items-center justify-center w-full">
                            <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToPreviousDay} aria-label="Go to previous day">
                                <ChevronLeft className="size-6" />
                            </Button>
                            <h2 className="text-base font-semibold text-gray-900 text-center flex-1 px-2">{formatDate(selectedDate)}</h2>
                            <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToNextDay} aria-label="Go to next day">
                                <ChevronRight className="size-6" />
                            </Button>
                        </div>
                    )}
                    {/* Today button - moved to MobileToolbar on mobile */}
                </div>
            </div>

            {/* Calendar Grid - responsive width */}
            <div className={exportMode ? '' : 'flex-1 min-h-0 overflow-auto'}>
                <div className="mx-auto max-w-4xl h-full">
                    <div
                        ref={gridRef}
                        className={`grid w-full select-none ${exportMode ? '' : 'h-full'}`}
                        style={{
                            gridTemplateColumns: "70px 1fr",
                            // Mobile uses 60px min, desktop uses 80px min
                            gridTemplateRows: exportMode
                                ? `48px repeat(${hours.length - 1}, ${EXPORT_ROW_HEIGHT}px) 24px`
                                : isMobile
                                    ? `48px repeat(${hours.length - 1}, minmax(60px, 1fr)) 24px`
                                    : `48px repeat(${hours.length - 1}, minmax(80px, 1fr)) 24px`,
                        }}
                        onContextMenu={(e) => e.preventDefault()}
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
                                    <div className="relative border-b border-l border-r border-gray-300"
                                        onMouseDown={(e) => handleCreateMouseDown(e, hour, currentDayIndex, !!dragState.eventId)}
                                        onTouchStart={(e) => handleCreateTouchStart(e, hour, currentDayIndex, !!dragState.eventId)}
                                    >
                                        {/* Hover Effect Layer - Separate from container to avoid event bubbling triggering it */}
                                        <div className="absolute inset-0 hover:bg-gray-100 transition-colors" />

                                        {/* Current Time Indicator - only if today and within this hour */}
                                        {isToday && currentTime && currentTime.getHours() === hour && (
                                            <div
                                                className="absolute z-30 w-full pointer-events-none"
                                                style={{
                                                    top: `${(currentTime.getMinutes() / 60) * 100}%`,
                                                }}
                                            >
                                                <div className="absolute -left-[6px] -top-[5px] size-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                                                <div className="border-t-2 border-red-500 w-full opacity-60" />
                                            </div>
                                        )}

                                        {/* Creating Ghost Event */}
                                        {index === 0 && creatingEvent && (
                                            <div
                                                className="absolute z-20 rounded-lg border-l-4 border-blue-500 bg-blue-100/50 backdrop-blur-sm p-2 overflow-hidden shadow-lg ring-2 ring-blue-400 pointer-events-none"
                                                style={{
                                                    top: getGhostPosition()?.top,
                                                    height: getGhostPosition()?.height,
                                                    left: '2%',
                                                    width: '96%',
                                                    transition: 'none'
                                                }}
                                            >
                                                <div className="text-xs font-semibold text-blue-700">New Event</div>
                                                <div className="text-xs text-blue-600">
                                                    {formatTime(creatingEvent.startHour, creatingEvent.startMinute, use12HourFormat)} - {formatTime(creatingEvent.endHour, creatingEvent.endMinute, use12HourFormat)}
                                                </div>
                                            </div>
                                        )}

                                        {/* Render events for this cell */}
                                        {index === 0 &&
                                            groupedDayEvents.map((event) => {
                                                const position = getVisualPosition(event)
                                                const displayTime = getDisplayTime(event)
                                                const isDragging = dragState.eventId === event.id
                                                const colorConfig = EVENT_COLORS[event.color || 'blue']

                                                // Get height in pixels for adaptive display
                                                const heightPx = parseFloat(position.height)
                                                const displayMode = getDisplayMode(heightPx)
                                                const containerClasses = getContainerClasses(displayMode)

                                                // Dynamic style for overlap handling
                                                const style = {
                                                    top: position.top,
                                                    height: position.height,
                                                    left: `${event.left}%`,
                                                    width: `${event.width}%`,
                                                    transition: isDragging ? 'none' : 'top 0.1s ease-out, height 0.1s ease-out',
                                                    userSelect: 'none' as const,
                                                }

                                                return (
                                                    <div
                                                        key={event.id}
                                                        className={`group absolute z-10 rounded-lg border-l-4 ${colorConfig.border} ${colorConfig.bg} backdrop-blur-sm overflow-hidden text-center flex flex-col ${displayMode === 'lg' || displayMode === 'xl' || displayMode === 'xxl' ? 'justify-center' : 'justify-between'} ${containerClasses} ${isDragging ? 'cursor-grabbing shadow-xl ring-2 ring-blue-400' : 'cursor-grab hover:shadow-lg hover:scale-[1.02] transition-all duration-200'}`}
                                                        style={style}
                                                        onMouseDown={(e) => handleMouseDown(e, event)}
                                                        onTouchStart={(e) => handleTouchStart(e, event)}
                                                        onClick={(e) => {
                                                            // Single click to edit (only if not dragging and didn't just finish dragging)
                                                            if (!isDragging && !wasRecentlyDragged && onEventClick) {
                                                                e.stopPropagation()
                                                                onEventClick(event)
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
                                                        {/* Delete button - hidden on mobile and in XS mode */}
                                                        {onEventDelete && displayMode !== 'xs' && (
                                                            <button
                                                                type="button"
                                                                className="absolute top-0.5 right-0.5 md:top-1 md:right-1 size-4 md:size-5 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hidden md:flex"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    e.preventDefault()
                                                                    onEventDelete(event.id)
                                                                }}
                                                                onMouseDown={(e) => e.stopPropagation()}
                                                            >
                                                                <X className="size-2.5 md:size-3" />
                                                            </button>
                                                        )}

                                                        {/* Title - always shown */}
                                                        <p className={getTitleClasses(displayMode, colorConfig.text)}>{event.title}</p>

                                                        {/* Description - conditional based on mode */}
                                                        {shouldShowDescription(displayMode, false) && event.description && (
                                                            <p className={getDescriptionClasses(displayMode, colorConfig.textSecondary)}>{event.description}</p>
                                                        )}

                                                        {/* Time - hidden in XS mode */}
                                                        {shouldShowTime(displayMode) && (
                                                            <p className={getTimeClasses(displayMode, colorConfig.textSecondary)}>
                                                                {formatTime(displayTime.startHour, displayTime.startMinute, use12HourFormat)} -{" "}
                                                                {formatTime(displayTime.endHour, displayTime.endMinute, use12HourFormat)}
                                                            </p>
                                                        )}
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
