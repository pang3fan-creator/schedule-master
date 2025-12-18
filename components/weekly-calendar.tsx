"use client"

import * as React from "react"
import { useRef, useState, useEffect, useMemo } from "react"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/components/SettingsContext"
import { useEventDrag } from "@/hooks/useEventDrag"

import { type Event, type EventColor, EVENT_COLORS } from "@/lib/types"

interface WeeklyCalendarProps {
  events: Event[]
  onEventUpdate?: (updatedEvent: Event) => void
  onEventDelete?: (eventId: string) => void
  onEventDoubleClick?: (event: Event) => void
  onEventContextMenu?: (event: Event, x: number, y: number) => void
  onEventLongPress?: (event: Event) => void  // For mobile long-press action
  exportMode?: boolean  // When true, renders for export (no scroll, fixed heights)
  onAddEvent?: (data: { startTime: string; endTime: string; day: number }) => void
}



// Get the first day of the week containing the given date
function getWeekStart(date: Date, startsOnSunday: boolean): Date {
  const d = new Date(date)
  const day = d.getDay()
  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  let diff: number
  if (startsOnSunday) {
    // Sunday start: go back to previous Sunday (or stay if already Sunday)
    diff = -day
  } else {
    // Monday start: go back to previous Monday
    diff = day === 0 ? -6 : 1 - day
  }
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

// Get array of dates for the week starting from the given start date
function getWeekDates(weekStart: Date): Date[] {
  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    dates.push(date)
  }
  return dates
}



// Format date range for header (e.g., "October 21 - 27, 2025" or "October 28 - November 3, 2025")
function formatDateRange(monday: Date, sunday: Date): string {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const startMonth = monthNames[monday.getMonth()]
  const endMonth = monthNames[sunday.getMonth()]
  const startDay = monday.getDate()
  const endDay = sunday.getDate()
  const startYear = monday.getFullYear()
  const endYear = sunday.getFullYear()

  if (startYear !== endYear) {
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
  } else if (startMonth !== endMonth) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`
  } else {
    return `${startMonth} ${startDay} - ${endDay}, ${startYear}`
  }
}

// Utility functions imported from lib/time-utils
import {
  formatHour,
  formatTime,
  formatDateString,
  getEventPosition as getEventPositionUtil,
  DAY_NAMES_MONDAY_START,
  DAY_NAMES_SUNDAY_START
} from "@/lib/time-utils"
import { useDragToCreate } from "@/hooks/useDragToCreate"
import { useCurrentTime } from "@/hooks/useCurrentTime"

// Wrapper to match existing usage or replace usages directly
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

export function WeeklyCalendar({ events, onEventUpdate, onEventDelete, onEventDoubleClick, onEventContextMenu, onEventLongPress, exportMode = false, onAddEvent }: WeeklyCalendarProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  // In export mode, use fixed row height to ensure consistent rendering
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
  const { weekStartsOnSunday, use12HourFormat, workingHoursStart, workingHoursEnd, timeIncrement } = settings

  // Generate hours array dynamically based on settings
  const hours = useMemo(() => {
    const result: number[] = []
    for (let h = workingHoursStart; h <= workingHoursEnd; h++) {
      result.push(h)
    }
    return result
  }, [workingHoursStart, workingHoursEnd])

  // Get appropriate day names based on week start setting
  const dayNames = weekStartsOnSunday ? DAY_NAMES_SUNDAY_START : DAY_NAMES_MONDAY_START

  // State for current week's start - initialize to current week
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date(), weekStartsOnSunday))

  // Update week start when settings change
  useEffect(() => {
    setCurrentWeekStart(getWeekStart(new Date(), weekStartsOnSunday))
  }, [weekStartsOnSunday])


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

  // Drag-to-create hook
  const { creatingEvent, handleGridMouseDown: handleCreateMouseDown } = useDragToCreate({
    onAddEvent,
    rowHeight,
    timeIncrement
  })

  // Current Time hook
  const currentTime = useCurrentTime()

  // Calculate the week's dates based on current week start
  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart])

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
    return formatDateRange(currentWeekStart, lastDay)
  }, [currentWeekStart, weekDates])

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev: Date) => {
      const newStart = new Date(prev)
      newStart.setDate(prev.getDate() - 7)
      return newStart
    })
  }

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekStart((prev: Date) => {
      const newStart = new Date(prev)
      newStart.setDate(prev.getDate() + 7)
      return newStart
    })
  }

  // Calculate actual row height based on grid dimensions and hour count
  useEffect(() => {
    const updateRowHeight = () => {
      if (gridRef.current) {
        const gridElement = gridRef.current
        const gridHeight = gridElement.clientHeight
        const headerHeight = 48
        const labelRowHeight = 24  // Last row is label-only
        const availableHeight = gridHeight - headerHeight - labelRowHeight
        // Dynamic row count based on hours array (hours.length - 1 data rows, last is label only)
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

  // Navigate to current week (today)
  const goToToday = () => {
    setCurrentWeekStart(getWeekStart(new Date(), weekStartsOnSunday))
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

  // Optimize: Group events by date string to avoid repeated filtering
  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>()
    events.forEach(event => {
      const dateKey = event.date
      if (!map.has(dateKey)) {
        map.set(dateKey, [])
      }
      map.get(dateKey)!.push(event)
    })
    return map
  }, [events])

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
              <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToPreviousWeek}>
                <ChevronLeft className="size-6" />
              </Button>
            )}
            <h2 className="text-xl font-semibold text-gray-900 min-w-[280px] text-center">{dateRangeString}</h2>
            {!exportMode && (
              <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToNextWeek}>
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
              <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToPreviousWeek}>
                <ChevronLeft className="size-6" />
              </Button>
              <h2 className="text-sm font-semibold text-gray-900 text-center flex-1 px-1">{dateRangeString}</h2>
              <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToNextWeek}>
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
          {/* Mobile scroll hint */}
          <p className="text-xs text-gray-400">← Scroll horizontally to see all days →</p>
        </div>
      </div>

      {/* Calendar Grid - in export mode, no overflow/scroll constraints */}
      <div className={exportMode ? '' : 'flex-1 min-h-0 overflow-auto'}>
        <div
          ref={gridRef}
          className={`grid min-w-[700px] ${exportMode ? '' : 'h-full'}`}
          style={{
            gridTemplateColumns: "60px repeat(7, minmax(80px, 1fr))",
            // In export mode, use fixed row heights instead of responsive ones
            gridTemplateRows: exportMode
              ? `48px repeat(${hours.length - 1}, ${EXPORT_ROW_HEIGHT}px) 24px`
              : `48px repeat(${hours.length - 1}, minmax(50px, 1fr)) 24px`,
          }}
        >
          {/* Header Row */}
          <div /> {/* Empty corner cell */}
          {days.map((day) => (
            <div key={day.short} className="flex flex-col items-center justify-center border-b border-gray-300">
              <span className="text-xs font-medium text-gray-500">{day.short}</span>
              <span className="text-sm font-semibold text-gray-900">{day.date}</span>
            </div>
          ))}

          {/* Time rows - data rows with time slots, last row is label-only */}
          {hours.map((hour, index) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="flex items-start justify-end pr-3">
                <span className="text-xs font-medium text-gray-500 -translate-y-1/2 whitespace-nowrap">{formatHour(hour, use12HourFormat)}</span>
              </div>

              {/* Day cells - only render for data rows (not the last label row) */}
              {index !== hours.length - 1 && days.map((day, dayIndex) => (
                <div
                  key={`${day.short}-${hour}`}
                  className={`relative border-b border-l border-gray-300 ${dayIndex === days.length - 1 ? "border-r" : ""}`}
                  onMouseDown={(e) => handleCreateMouseDown(e, hour, dayIndex, !!dragState.eventId)}
                >
                  {/* Current Time Indicator - only if date matches today and within this hour */}
                  {weekDates[dayIndex].getDate() === currentTime.getDate() &&
                    weekDates[dayIndex].getMonth() === currentTime.getMonth() &&
                    weekDates[dayIndex].getFullYear() === currentTime.getFullYear() &&
                    currentTime.getHours() === hour && (
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
                  {index === 0 && creatingEvent && creatingEvent.dayIndex === dayIndex && (
                    <div
                      className="absolute z-20 rounded-lg border-l-4 border-blue-500 bg-blue-100/50 backdrop-blur-sm p-2 overflow-hidden shadow-lg ring-2 ring-blue-400 pointer-events-none"
                      style={{
                        top: getGhostPosition()?.top,
                        height: getGhostPosition()?.height,
                        left: '1%',
                        width: '98%',
                        transition: 'none'
                      }}
                    >
                      <div className="text-xs font-semibold text-blue-700">New Event</div>
                      <div className="text-xs text-blue-600">
                        {formatTime(creatingEvent.startHour, creatingEvent.startMinute, use12HourFormat)} - {formatTime(creatingEvent.endHour, creatingEvent.endMinute, use12HourFormat)}
                      </div>
                    </div>
                  )}

                  {/* Render events for this cell - events are positioned relative to the first cell of each column */}
                  {index === 0 &&
                    (eventsByDate.get(formatDateString(weekDates[dayIndex])) || [])
                      .map((event) => {
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
                              // Double click/tap to edit
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
                              // Right click for context menu
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
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

