"use client"

import * as React from "react"
import { useRef, useState, useEffect, useMemo } from "react"

import {
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Square,
} from "lucide-react"
import { EVENT_ICON_MAP } from "@/lib/icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSettings } from "@/components/SettingsContext"
import { useEventDrag } from "@/hooks/useEventDrag"

import { type Event, type EventColor, EVENT_COLORS, PRIORITY_COLORS } from "@/lib/types"

// Import all time utilities from lib/time-utils
import {
  formatHour,
  formatTime,
  formatDateString,
  getEventPosition as getEventPositionUtil,
  getWeekStart,
  getWeekDates,
  formatDateRange,
  getActualDay,
  DAY_NAMES_MONDAY_START,
  DAY_NAMES_SUNDAY_START,
  groupOverlappingEvents,
  type GroupedEvent
} from "@/lib/time-utils"
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
  getDescriptionClasses,
  // Mobile weekly view specific
  getMobileWeeklyContainerClasses,
  getMobileWeeklyTitleClasses,
  getMobileWeeklyTimeClasses,
  shouldShowMobileWeeklyDescription,
  getMobileWeeklyDescriptionClasses
} from "@/lib/event-display-utils"
import { useTranslations, useLocale } from "next-intl"

interface WeeklyCalendarProps {
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

function getEventPosition(event: Event, rowHeight: number, minHour: number = 8) {
  return getEventPositionUtil(
    event.startHour,
    event.startMinute,
    event.endHour,
    event.endMinute,
    rowHeight,
    minHour
  )
}

// Icon map for event icons
const eventIconMap = EVENT_ICON_MAP

export function WeeklyCalendar({ events, selectedDate, onDateChange, onEventUpdate, onEventDelete, onEventClick, onEventContextMenu, exportMode = false, onAddEvent }: WeeklyCalendarProps) {
  const t = useTranslations('Common')
  const locale = useLocale()
  const gridRef = useRef<HTMLDivElement>(null)
  // In export mode, use fixed row height to ensure consistent rendering
  const EXPORT_ROW_HEIGHT = 80
  const [rowHeight, setRowHeight] = useState(exportMode ? EXPORT_ROW_HEIGHT : 58)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isMobileCalendarOpen, setIsMobileCalendarOpen] = useState(false)

  // Update rowHeight when exportMode changes
  useEffect(() => {
    if (exportMode) {
      setRowHeight(EXPORT_ROW_HEIGHT)
    }
    // When returning to normal mode, the resize handler will recalculate
  }, [exportMode])

  // Get settings from context
  const { settings } = useSettings()
  const { weekStartsOnSunday, use12HourFormat, workingHoursStart, workingHoursEnd, timeIncrement, showDates, allowEventOverlap, taskModeEnabled, priorityModeEnabled } = settings

  // Generate hours array dynamically based on settings
  const hours = useMemo(() => {
    const result: number[] = []
    for (let h = workingHoursStart; h <= workingHoursEnd; h++) {
      result.push(h)
    }
    return result
  }, [workingHoursStart, workingHoursEnd])

  // Get appropriate day names based on week start setting - use translations
  const dayNamesMondayStart = useMemo(() => [
    t('calendar.days.mon'), t('calendar.days.tue'), t('calendar.days.wed'),
    t('calendar.days.thu'), t('calendar.days.fri'), t('calendar.days.sat'), t('calendar.days.sun')
  ], [t])
  const dayNamesSundayStart = useMemo(() => [
    t('calendar.days.sun'), t('calendar.days.mon'), t('calendar.days.tue'),
    t('calendar.days.wed'), t('calendar.days.thu'), t('calendar.days.fri'), t('calendar.days.sat')
  ], [t])
  const dayNames = weekStartsOnSunday ? dayNamesSundayStart : dayNamesMondayStart

  // Calculate current week start from selectedDate
  const currentWeekStart = useMemo(() => getWeekStart(selectedDate, weekStartsOnSunday), [selectedDate, weekStartsOnSunday])

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

  // Calculate the week's dates based on current week start
  // Moved before useDragToCreate so it can be used for collision detection
  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart])

  // Drag-to-create hook - pass weekDates for date-based filtering
  const { creatingEvent, handleGridMouseDown: handleCreateMouseDown, handleGridTouchStart: handleCreateTouchStart } = useDragToCreate({
    onAddEvent,
    rowHeight,
    timeIncrement,
    existingEvents: visibleEvents, // Use filtered events
    workingHoursStart,
    workingHoursEnd,
    weekDates,
    weekStartsOnSunday,
    allowEventOverlap,  // Skip collision detection when overlap is allowed
  })

  // Current Time hook
  const currentTime = useCurrentTime()

  // Mobile detection for responsive layout
  const isMobile = useIsMobile()

  // Build days array with dynamic dates
  const days = useMemo(() => {
    return weekDates.map((date, index) => ({
      short: dayNames[index],
      date: date.getDate(),
    }))
  }, [weekDates, dayNames])

  // Get date range string for header
  const dateRangeString = useMemo(() => {
    const lastDay = weekDates[6]
    return formatDateRange(currentWeekStart, lastDay, locale)
  }, [currentWeekStart, weekDates, locale])

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() - 7)
    onDateChange(newDate)
  }

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + 7)
    onDateChange(newDate)
  }

  // Calculate actual row height based on grid dimensions and hour count
  useEffect(() => {
    const updateRowHeight = () => {
      if (exportMode) return // Skip dynamic calculation in export mode to keep fixed 80px
      if (gridRef.current) {
        const gridElement = gridRef.current
        const gridHeight = gridElement.clientHeight
        const headerHeight = 40  // Matches grid template: 40px
        const labelRowHeight = 20  // Last row is label-only: 20px
        const availableHeight = gridHeight - headerHeight - labelRowHeight
        // Dynamic row count based on hours array (hours.length - 1 data rows, last is label only)
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

    // Use requestAnimationFrame to ensure DOM is fully rendered before calculating
    // This fixes the issue where rowHeight is calculated before layout is stable
    const rafId = requestAnimationFrame(() => {
      // Add a small delay to ensure grid is fully laid out
      setTimeout(updateRowHeight, 50)
    })

    window.addEventListener('resize', updateRowHeight)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', updateRowHeight)
    }
  }, [hours.length, isMobile, exportMode]) // Re-calculate when isMobile or exportMode changes

  // Navigate to current week (today)
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

  // Optimize: Group events by day index for weekly template mode (decoupled from date)
  // Use groupOverlappingEvents for side-by-side display of overlapping events
  const eventsByDay = useMemo(() => {
    // First collect events by day
    const map = new Map<number, Event[]>()
    visibleEvents.forEach(event => {
      const dayKey = event.day
      if (!map.has(dayKey)) {
        map.set(dayKey, [])
      }
      map.get(dayKey)!.push(event)
    })
    // Apply groupOverlappingEvents to each day's events for overlap layout
    const result = new Map<number, GroupedEvent[]>()
    map.forEach((dayEvents, dayKey) => {
      result.set(dayKey, groupOverlappingEvents(dayEvents))
    })
    return result
  }, [visibleEvents])

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
                <Button variant="ghost" size="icon" className="size-10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={goToPreviousWeek} aria-label={t('calendar.previousWeek')}>
                  <ChevronLeft className="size-6" />
                </Button>
              )}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 w-[450px] text-center flex justify-center">
                {exportMode ? (
                  dateRangeString
                ) : (
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 h-auto py-1 px-2"
                      >
                        {dateRangeString}
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
                <Button variant="ghost" size="icon" className="size-10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={goToNextWeek} aria-label={t('calendar.nextWeek')}>
                  <ChevronRight className="size-6" />
                </Button>
              )}
            </div>
          )}

          {/* Today button removed from here, moved to Sidebar */}
          {!exportMode && (
            <div className="w-20"></div>
          )}
        </div>

        {/* Mobile layout - stacked */}
        {showDates && (
          <div className="md:hidden flex flex-col items-center">
            {/* Navigation row */}
            {!exportMode && (
              <div className="flex items-center justify-center w-full">
                <Button variant="ghost" size="icon" className="size-10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={goToPreviousWeek} aria-label={t('calendar.previousWeek')}>
                  <ChevronLeft className="size-6" />
                </Button>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center flex-1 px-1 flex justify-center">
                  <Popover open={isMobileCalendarOpen} onOpenChange={setIsMobileCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 h-auto py-1 px-2"
                      >
                        {dateRangeString}
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
                <Button variant="ghost" size="icon" className="size-10 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={goToNextWeek} aria-label={t('calendar.nextWeek')}>
                  <ChevronRight className="size-6" />
                </Button>
              </div>
            )}
            {/* Today button - moved to MobileToolbar on mobile */}
          </div>
        )}
      </div>

      {/* Calendar Grid - in export mode, no overflow/scroll constraints */}
      <div className={exportMode ? '' : 'flex-1 min-h-0 overflow-y-auto overflow-x-hidden md:overflow-auto'}>
        <div
          ref={gridRef}
          className={`grid select-none weekly-calendar-grid ${exportMode ? 'min-w-[700px]' : 'w-full md:min-w-[700px] h-full'}`}
          style={{
            gridTemplateColumns: exportMode
              ? "70px repeat(7, minmax(80px, 1fr))"
              : isMobile
                ? "42px repeat(7, 1fr)"
                : "70px repeat(7, 1fr)",
            // In export mode, use fixed row heights instead of responsive ones
            // Mobile uses 60px min, desktop uses 80px min
            gridTemplateRows: exportMode
              ? `48px repeat(${hours.length - 1}, ${EXPORT_ROW_HEIGHT}px) 24px`
              : isMobile
                ? `40px repeat(${hours.length - 1}, minmax(60px, 1fr)) 20px`
                : `40px repeat(${hours.length - 1}, minmax(80px, 1fr)) 20px`,
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Header Row */}
          <div /> {/* Empty corner cell */}
          {days.map((day) => (
            <div key={day.short} className="flex flex-col items-center justify-center border-b border-gray-300 dark:border-gray-700">
              <span className="text-[10px] md:text-xs font-medium text-gray-500 dark:text-gray-400">{day.short}</span>
              {showDates && <span className="text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100">{day.date}</span>}
            </div>
          ))}

          {/* Time rows - data rows with time slots, last row is label-only */}
          {hours.map((hour, index) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="flex items-start justify-end pr-1 md:pr-3">
                <span className="text-[9px] md:text-xs font-medium text-gray-500 dark:text-gray-400 -translate-y-1/2 whitespace-nowrap">{formatHour(hour, use12HourFormat, locale)}</span>
              </div>

              {/* Day cells - only render for data rows (not the last label row) */}
              {index !== hours.length - 1 && days.map((day, dayIndex) => (
                <div
                  key={`${day.short}-${hour}`}
                  className={`relative border-b border-l border-gray-300 dark:border-gray-700 ${dayIndex === days.length - 1 ? "border-r" : ""}`}
                  style={{ touchAction: 'none' }}
                  onMouseDown={(e) => handleCreateMouseDown(e, hour, dayIndex, !!dragState.eventId)}
                  onTouchStart={(e) => handleCreateTouchStart(e, hour, dayIndex, !!dragState.eventId)}
                >
                  {/* Hover Effect Layer - Separate from container to avoid event bubbling triggering it */}
                  <div className="absolute inset-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" />

                  {/* Current Time Indicator - only if date matches today and within this hour */}
                  {currentTime &&
                    weekDates[dayIndex].getDate() === currentTime.getDate() &&
                    weekDates[dayIndex].getMonth() === currentTime.getMonth() &&
                    weekDates[dayIndex].getFullYear() === currentTime.getFullYear() &&
                    currentTime.getHours() === hour && (
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
                  {index === 0 && creatingEvent && creatingEvent.dayIndex === dayIndex && (
                    <div
                      className="absolute z-20 rounded-lg border-l-4 border-blue-500 bg-blue-100/50 dark:bg-blue-900/30 backdrop-blur-sm p-2 overflow-hidden shadow-lg ring-2 ring-blue-400 pointer-events-none"
                      style={{
                        top: getGhostPosition()?.top,
                        height: getGhostPosition()?.height,
                        left: '1%',
                        width: '98%',
                        transition: 'none'
                      }}
                    >
                      <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">{t('calendar.newEvent')}</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {formatTime(creatingEvent.startHour, creatingEvent.startMinute, use12HourFormat, locale)} - {formatTime(creatingEvent.endHour, creatingEvent.endMinute, use12HourFormat, locale)}
                      </div>
                    </div>
                  )}

                  {/* Render events for this cell - events are positioned relative to the first cell of each column */}
                  {index === 0 &&
                    (eventsByDay.get(getActualDay(dayIndex, weekStartsOnSunday)) || [])
                      .map((event) => {
                        const position = getVisualPosition(event)
                        const displayTime = getDisplayTime(event)
                        const isDragging = dragState.eventId === event.id
                        const colorConfig = EVENT_COLORS[event.color || 'blue']

                        // Get height in pixels for adaptive display
                        const heightPx = parseFloat(position.height)
                        const displayMode = getDisplayMode(heightPx)

                        // Use mobile-specific or desktop functions based on device
                        const containerClasses = isMobile
                          ? getMobileWeeklyContainerClasses(displayMode)
                          : getContainerClasses(displayMode)

                        return (
                          <div
                            key={event.id}
                            className={`group absolute z-10 rounded-md md:rounded-lg border-l-2 md:border-l-4 ${colorConfig.border} ${colorConfig.bg} backdrop-blur-sm overflow-hidden text-center flex flex-col ${isMobile ? 'justify-start' : displayMode === 'lg' || displayMode === 'xl' || displayMode === 'xxl' ? 'justify-center' : 'justify-between'} ${containerClasses} ${isDragging ? 'cursor-grabbing shadow-xl ring-2 ring-blue-400' : 'cursor-grab hover:shadow-lg hover:scale-[1.02] transition-all duration-200'}`}
                            style={{
                              top: position.top,
                              height: position.height,
                              left: `${event.left}%`,
                              width: `${event.width}%`,
                              transition: isDragging ? 'none' : 'top 0.1s ease-out, height 0.1s ease-out',
                              userSelect: 'none',
                            }}
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
                              // Right click for context menu
                              e.preventDefault()
                              e.stopPropagation()
                              if (onEventContextMenu) {
                                onEventContextMenu(event, e.clientX, e.clientY)
                              }
                            }}
                          >
                            {/* Delete button - hidden on mobile (use double-tap instead) */}
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
                              <div className={`absolute top-1 left-1 size-2 md:size-2.5 rounded-full ${PRIORITY_COLORS[event.priority].dot}`} title={`${PRIORITY_COLORS[event.priority].label} Priority`} />
                            )}

                            {/* Checkbox for task mode events */}
                            {taskModeEnabled && (
                              <button
                                type="button"
                                className={`absolute top-1 ${event.priority ? 'left-4' : 'left-1'} size-4 md:size-5 flex items-center justify-center rounded border transition-colors ${event.task?.isCompleted ? 'bg-green-500 border-green-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
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
                                {event.task?.isCompleted && <Check className="size-2.5 md:size-3" />}
                              </button>
                            )}

                            {/* Title - always shown, with mobile-specific wrapping */}
                            <div className="flex items-center justify-center gap-1 overflow-hidden px-1">
                              {event.icon && eventIconMap[event.icon] && (
                                <span className="shrink-0 scale-75 md:scale-90">
                                  {React.createElement(eventIconMap[event.icon], { className: `size-3 md:size-3.5 ${colorConfig.text}` })}
                                </span>
                              )}
                              <p className={`${isMobile
                                ? getMobileWeeklyTitleClasses(displayMode, colorConfig.text)
                                : getTitleClasses(displayMode, colorConfig.text)
                                } ${event.task?.isCompleted ? 'line-through opacity-60' : ''} truncate`}>{event.title}</p>
                            </div>

                            {/* Description - conditional based on mode and device */}
                            {(isMobile
                              ? shouldShowMobileWeeklyDescription(displayMode)
                              : shouldShowDescription(displayMode, isMobile)
                            ) && event.description && (
                                <p className={isMobile
                                  ? getMobileWeeklyDescriptionClasses(displayMode, colorConfig.textSecondary)
                                  : getDescriptionClasses(displayMode, colorConfig.textSecondary)
                                }>{event.description}</p>
                              )}

                            {/* Time - hidden in XS mode, with mobile-specific wrapping */}
                            {shouldShowTime(displayMode) && (
                              <p className={isMobile
                                ? getMobileWeeklyTimeClasses(displayMode, colorConfig.textSecondary)
                                : getTimeClasses(displayMode, colorConfig.textSecondary)
                              }>
                                {formatTime(displayTime.startHour, displayTime.startMinute, use12HourFormat, locale)} - {formatTime(displayTime.endHour, displayTime.endMinute, use12HourFormat, locale)}
                              </p>
                            )}
                          </div>
                        )
                      })}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

