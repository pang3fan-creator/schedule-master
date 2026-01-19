"use client"

import * as React from "react"
import { useRef, useState, useEffect, useMemo, useCallback } from "react"

import {
    ChevronLeft,
    ChevronRight,
    X,
    Check,
} from "lucide-react"
import { EVENT_ICON_MAP } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { type Event, EVENT_COLORS, PRIORITY_COLORS } from "@/lib/types"
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
import { useTranslations, useLocale } from "next-intl"

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

// Icon map for event icons
const eventIconMap = EVENT_ICON_MAP



// Format date for header (e.g., "Thursday, December 11, 2025")
export function formatDate(date: Date, locale: string): string {
    return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date)
}


export function DailyCalendar({ events, selectedDate, onDateChange, onEventUpdate, onEventDelete, onEventClick, onEventContextMenu, exportMode = false, onAddEvent }: DailyCalendarProps) {
    const t = useTranslations('Common')
    const locale = useLocale()
    const gridRef = useRef<HTMLDivElement>(null)
    // In export mode, use fixed row height
    const EXPORT_ROW_HEIGHT = 80
    const [rowHeight, setRowHeight] = useState(exportMode ? EXPORT_ROW_HEIGHT : 58)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [isMobileCalendarOpen, setIsMobileCalendarOpen] = useState(false)
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
    const { use12HourFormat, workingHoursStart, workingHoursEnd, timeIncrement, showDates, allowEventOverlap, taskModeEnabled, priorityModeEnabled } = settings

    // Generate hours array dynamically based on settings
    const hours = useMemo(() => {
        const result: number[] = []
        for (let h = workingHoursStart; h <= workingHoursEnd; h++) {
            result.push(h)
        }
        return result
    }, [workingHoursStart, workingHoursEnd])



    // Filter events based on working hours visibility
    // d <= a: event end <= working start -> hidden
    // c >= b: event start >= working end -> hidden
    const visibleEvents = useMemo(() => {
        return events.filter(event => {
            const eventStart = event.startHour + (event.startMinute / 60)
            const eventEnd = event.endHour + (event.endMinute / 60)

            if (eventEnd <= workingHoursStart) return false
            if (eventStart >= workingHoursEnd) return false

            return true
        })
    }, [events, workingHoursStart, workingHoursEnd])

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
        events: visibleEvents,  // Pass filtered events for collision detection
        timeIncrement,  // Pass time increment for drag snapping
        allowEventOverlap,  // Skip collision detection when overlap is allowed
    })

    // Filter events for the selected day using day index (weekly template mode - decoupled from date)
    // Moved before useDragToCreate so it can be used for collision detection
    const dayEvents = useMemo(() => {
        const dayIndex = selectedDate.getDay()
        return visibleEvents.filter(event => event.day === dayIndex) // Use visibleEvents
    }, [visibleEvents, selectedDate])

    // Drag-to-create hook - pass dayEvents (already filtered) for collision detection
    const { creatingEvent, handleGridMouseDown: handleCreateMouseDown, handleGridTouchStart: handleCreateTouchStart } = useDragToCreate({
        onAddEvent,
        rowHeight,
        timeIncrement,
        existingEvents: dayEvents,  // Use filtered events for this day
        workingHoursStart,
        workingHoursEnd,
        allowEventOverlap,  // Skip collision detection when overlap is allowed
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



    // Get short day name for header - use translations based on day of week
    const shortDayName = useMemo(() => {
        const day = selectedDate.getDay()
        const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        return t(`calendar.days.${dayKeys[day]}`)
    }, [selectedDate, t])

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

    // Calculate actual row height based on grid dimensions and hour count
    useEffect(() => {
        const updateRowHeight = () => {
            if (exportMode) return
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
    }, [hours.length, isMobile, exportMode])  // Re-calculate when hours, mobile status, or export mode changes

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
        <div className={`flex flex-col p-2 md:p-6 bg-gray-50 dark:bg-gray-900/20 ${exportMode ? '' : 'h-full'}`}>
            {/* Header with navigation - responsive layout */}
            <div className="mb-1 md:mb-4 flex-shrink-0">
                {/* Desktop layout */}
                <div className="hidden md:flex items-center justify-between relative">
                    {/* Spacer for layout balance - hidden in export mode */}
                    {!exportMode && <div className="w-20"></div>}

                    {/* Center navigation - absolute positioned for true centering */}
                    {showDates && (
                        <div className={`flex items-center ${exportMode ? 'flex-1 justify-center' : 'absolute left-1/2 -translate-x-1/2'}`}>
                            {!exportMode && (
                                <Button variant="ghost" size="icon" className="size-10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={goToPreviousDay} aria-label={t('calendar.previousDay')}>
                                    <ChevronLeft className="size-6" />
                                </Button>
                            )}
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 w-[450px] text-center flex justify-center">
                                {exportMode ? (
                                    formatDate(selectedDate, locale)
                                ) : (
                                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 h-auto py-1 px-2"
                                            >
                                                {formatDate(selectedDate, locale)}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="center">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                defaultMonth={selectedDate}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        onDateChange(date)
                                                        setIsCalendarOpen(false)
                                                    }
                                                }}
                                                initialFocus
                                            />
                                            <div className="border-t p-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full text-sm font-medium hover:bg-muted"
                                                    onClick={() => {
                                                        onDateChange(new Date())
                                                        setIsCalendarOpen(false)
                                                    }}
                                                >
                                                    {t('calendar.today')}
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </h2>
                            {!exportMode && (
                                <Button variant="ghost" size="icon" className="size-10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={goToNextDay} aria-label={t('calendar.nextDay')}>
                                    <ChevronRight className="size-6" />
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Spacer for layout balance - already implicitly balanced by removing button on right? No, we need an empty div to balance the left spacer if the left spacer exists. 
                        Wait, lines 231 has a spacer: {!exportMode && <div className="w-20"></div>}
                        So I should put an empty div here too.
                    */}
                    {!exportMode && <div className="w-20"></div>}
                </div>

                {/* Mobile layout - stacked */}
                {showDates && (
                    <div className="md:hidden flex flex-col items-center">
                        {/* Navigation row */}
                        {!exportMode && (
                            <div className="flex items-center justify-center w-full">
                                <Button variant="ghost" size="icon" className="size-10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={goToPreviousDay} aria-label={t('calendar.previousDay')}>
                                    <ChevronLeft className="size-6" />
                                </Button>
                                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 text-center flex-1 px-2 flex justify-center">
                                    <Popover open={isMobileCalendarOpen} onOpenChange={setIsMobileCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="text-base font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 h-auto py-1 px-2"
                                            >
                                                {formatDate(selectedDate, locale)}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="center">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                defaultMonth={selectedDate}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        onDateChange(date)
                                                        setIsMobileCalendarOpen(false)
                                                    }
                                                }}
                                                initialFocus
                                            />
                                            <div className="border-t p-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full text-sm font-medium hover:bg-muted"
                                                    onClick={() => {
                                                        onDateChange(new Date())
                                                        setIsMobileCalendarOpen(false)
                                                    }}
                                                >
                                                    {t('calendar.today')}
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </h2>
                                <Button variant="ghost" size="icon" className="size-10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={goToNextDay} aria-label={t('calendar.nextDay')}>
                                    <ChevronRight className="size-6" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
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
                        <div className="flex flex-col items-center justify-center border-b border-gray-300 dark:border-gray-700">
                            {showDates ? (
                                <>
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{shortDayName}</span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedDate.getDate()}</span>
                                </>
                            ) : (
                                <div className="flex items-center gap-16">
                                    <button
                                        onClick={goToPreviousDay}
                                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                        aria-label={t('calendar.previousDay')}
                                    >
                                        <ChevronLeft className="size-6" />
                                    </button>
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-10 text-center">{shortDayName}</span>
                                    <button
                                        onClick={goToNextDay}
                                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                        aria-label={t('calendar.nextDay')}
                                    >
                                        <ChevronRight className="size-6" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Time rows - data rows with time slots, last row is label-only */}
                        {hours.map((hour, index) => (
                            <React.Fragment key={hour}>
                                <div className="flex items-start justify-end pr-3">
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 -translate-y-1/2 whitespace-nowrap">{formatHour(hour, use12HourFormat, locale)}</span>
                                </div>

                                {/* Day cell - only render for data rows (not the last label row) */}
                                {index !== hours.length - 1 && (
                                    <div className="relative border-b border-l border-r border-gray-300 dark:border-gray-700"
                                        style={{ touchAction: 'none' }}
                                        onMouseDown={(e) => handleCreateMouseDown(e, hour, currentDayIndex, !!dragState.eventId)}
                                        onTouchStart={(e) => handleCreateTouchStart(e, hour, currentDayIndex, !!dragState.eventId)}
                                    >
                                        {/* Hover Effect Layer - Separate from container to avoid event bubbling triggering it */}
                                        <div className="absolute inset-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" />

                                        {/* Current Time Indicator - only if today and within this hour */}
                                        {isToday && currentTime && currentTime.getHours() === hour && (
                                            <div
                                                className="absolute z-30 w-full pointer-events-none"
                                                style={{
                                                    top: `${(currentTime.getMinutes() / 60) * 100}%`,
                                                }}
                                            >
                                                <div className="absolute -left-[6px] -top-[5px] size-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
                                                <div className="border-t-2 border-red-500 w-full opacity-60" />
                                            </div>
                                        )}

                                        {/* Creating Ghost Event */}
                                        {index === 0 && creatingEvent && (
                                            <div
                                                className="absolute z-20 rounded-lg border-l-4 border-blue-500 bg-blue-100/50 dark:bg-blue-900/30 backdrop-blur-sm p-2 overflow-hidden shadow-lg ring-2 ring-blue-400 pointer-events-none"
                                                style={{
                                                    top: getGhostPosition()?.top,
                                                    height: getGhostPosition()?.height,
                                                    left: '2%',
                                                    width: '96%',
                                                    transition: 'none'
                                                }}
                                            >
                                                <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">{t('calendar.newEvent')}</div>
                                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                                    {formatTime(creatingEvent.startHour, creatingEvent.startMinute, use12HourFormat, locale)} - {formatTime(creatingEvent.endHour, creatingEvent.endMinute, use12HourFormat, locale)}
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

                                                        {/* Priority Indicator - colored dot in top-left (only when priorityModeEnabled and event has priority) */}
                                                        {priorityModeEnabled && event.priority && (
                                                            <div className={`absolute top-1 left-1 size-2.5 rounded-full ${PRIORITY_COLORS[event.priority].dot}`} title={`${PRIORITY_COLORS[event.priority].label} Priority`} />
                                                        )}

                                                        {/* Checkbox for task mode events */}
                                                        {taskModeEnabled && (
                                                            <button
                                                                type="button"
                                                                className={`absolute top-1 ${event.priority ? 'left-5' : 'left-1'} size-5 flex items-center justify-center rounded border transition-colors ${event.task?.isCompleted ? 'bg-green-500 border-green-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    if (onEventUpdate) {
                                                                        onEventUpdate({
                                                                            ...event,
                                                                            task: {
                                                                                isCheckable: true,
                                                                                isCompleted: !event.task?.isCompleted
                                                                            }
                                                                        })
                                                                    }
                                                                }}
                                                                onMouseDown={(e) => e.stopPropagation()}
                                                                onTouchStart={(e) => e.stopPropagation()}
                                                            >
                                                                {event.task?.isCompleted && <Check className="size-3" />}
                                                            </button>
                                                        )}

                                                        {/* Title - always shown */}
                                                        <div className="flex items-center justify-center gap-1 overflow-hidden px-1">
                                                            {event.icon && eventIconMap[event.icon] && (
                                                                <span className="shrink-0 scale-75 md:scale-90">
                                                                    {React.createElement(eventIconMap[event.icon], { className: `size-3 md:size-3.5 ${colorConfig.text}` })}
                                                                </span>
                                                            )}
                                                            <p className={`${getTitleClasses(displayMode, colorConfig.text)} ${event.task?.isCompleted ? 'line-through opacity-60' : ''} truncate`}>{event.title}</p>
                                                        </div>


                                                        {/* Description - conditional based on mode */}
                                                        {shouldShowDescription(displayMode, false) && event.description && (
                                                            <p className={getDescriptionClasses(displayMode, colorConfig.textSecondary)}>{event.description}</p>
                                                        )}

                                                        {/* Time - hidden in XS mode */}
                                                        {shouldShowTime(displayMode) && (
                                                            <p className={getTimeClasses(displayMode, colorConfig.textSecondary)}>
                                                                {formatTime(displayTime.startHour, displayTime.startMinute, use12HourFormat, locale)} -{" "}
                                                                {formatTime(displayTime.endHour, displayTime.endMinute, use12HourFormat, locale)}
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
