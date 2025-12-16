"use client"

import * as React from "react"
import { useRef, useState, useEffect, useMemo } from "react"

import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/components/SettingsContext"
import { useEventDrag } from "@/hooks/useEventDrag"

export type EventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'orange' | 'teal'

export interface Event {
  id: string
  title: string
  description: string
  day: number
  date: string // YYYY-MM-DD format for specific date filtering
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
  color?: EventColor // Optional, defaults to 'blue'
  builderType?: string // 'schedule-builder' | 'employee-schedule' | etc.
}

// Color configuration for event styling
export const EVENT_COLORS: Record<EventColor, { bg: string; border: string; text: string; textSecondary: string }> = {
  blue: { bg: 'bg-blue-500/15', border: 'border-blue-500', text: 'text-blue-700', textSecondary: 'text-blue-600' },
  green: { bg: 'bg-green-500/15', border: 'border-green-500', text: 'text-green-700', textSecondary: 'text-green-600' },
  red: { bg: 'bg-red-500/15', border: 'border-red-500', text: 'text-red-700', textSecondary: 'text-red-600' },
  yellow: { bg: 'bg-yellow-500/15', border: 'border-yellow-500', text: 'text-yellow-700', textSecondary: 'text-yellow-600' },
  purple: { bg: 'bg-purple-500/15', border: 'border-purple-500', text: 'text-purple-700', textSecondary: 'text-purple-600' },
  pink: { bg: 'bg-pink-500/15', border: 'border-pink-500', text: 'text-pink-700', textSecondary: 'text-pink-600' },
  orange: { bg: 'bg-orange-500/15', border: 'border-orange-500', text: 'text-orange-700', textSecondary: 'text-orange-600' },
  teal: { bg: 'bg-teal-500/15', border: 'border-teal-500', text: 'text-teal-700', textSecondary: 'text-teal-600' },
}

interface WeeklyCalendarProps {
  events: Event[]
  onEventUpdate?: (updatedEvent: Event) => void
  onEventDelete?: (eventId: string) => void
  onEventDoubleClick?: (event: Event) => void
  onEventContextMenu?: (event: Event, x: number, y: number) => void
}

// Day names for different week start configurations
const DAY_NAMES_MONDAY_START = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
const DAY_NAMES_SUNDAY_START = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

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

// Format date to YYYY-MM-DD string for event matching
export function formatDateString(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
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

function formatHour(hour: number, use12Hour: boolean): string {
  if (use12Hour) {
    if (hour === 0) return "12:00 AM"
    if (hour === 12) return "12:00 PM"
    if (hour < 12) return `${hour}:00 AM`
    return `${hour - 12}:00 PM`
  }
  return `${hour.toString().padStart(2, "0")}:00`
}

function formatTime(hour: number, minute: number, use12Hour: boolean): string {
  if (use12Hour) {
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`
  }
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
}

// Calculate event position using actual row height in pixels
function getEventPosition(event: Event, rowHeight: number, minHour: number = 8) {
  const startOffset = (event.startHour - minHour) + event.startMinute / 60
  const endOffset = (event.endHour - minHour) + event.endMinute / 60
  const duration = endOffset - startOffset

  return {
    top: `${startOffset * rowHeight}px`,
    height: `${Math.max(duration * rowHeight - 8, 20)}px`,
  }
}

export function WeeklyCalendar({ events, onEventUpdate, onEventDelete, onEventDoubleClick, onEventContextMenu }: WeeklyCalendarProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [rowHeight, setRowHeight] = useState(58) // Default fallback height

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

  return (
    <div className="flex h-full flex-col p-6 bg-muted/20">
      {/* Header with navigation */}
      <div className="mb-4 flex items-center justify-between flex-shrink-0">
        {/* Spacer for layout balance */}
        <div className="w-20"></div>

        {/* Center navigation - offset by half sidebar width (115px) to align with navbar center */}
        <div className="flex items-center" style={{ marginLeft: '-115px' }}>
          <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToPreviousWeek}>
            <ChevronLeft className="size-6" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-900 min-w-[280px] text-center">{dateRangeString}</h2>
          <Button variant="ghost" size="icon" className="size-10 text-gray-500 hover:text-gray-800 hover:bg-gray-200" onClick={goToNextWeek}>
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

      {/* Calendar Grid - uses flex-1 to fill remaining space */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div
          ref={gridRef}
          className="grid min-w-[800px] h-full"
          style={{
            gridTemplateColumns: "70px repeat(7, 1fr)",
            gridTemplateRows: `48px repeat(${hours.length - 1}, minmax(50px, 1fr)) 24px`,
          }}
        >
          {/* Header Row */}
          <div /> {/* Empty corner cell */}
          {days.map((day) => (
            <div key={day.short} className="flex flex-col items-center justify-center border-b border-border/60">
              <span className="text-xs font-medium text-gray-500">{day.short}</span>
              <span className="text-sm font-semibold text-gray-900">{day.date}</span>
            </div>
          ))}

          {/* Time rows - data rows with time slots, last row is label-only */}
          {hours.map((hour, index) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="flex items-start justify-end pr-3">
                <span className="text-xs text-gray-400 -translate-y-1/2 whitespace-nowrap">{formatHour(hour, use12HourFormat)}</span>
              </div>

              {/* Day cells - only render for data rows (not the last label row) */}
              {index !== hours.length - 1 && days.map((day, dayIndex) => (
                <div
                  key={`${day.short}-${hour}`}
                  className={`relative border-b border-l border-border/60 ${dayIndex === days.length - 1 ? "border-r" : ""}`}
                >
                  {/* Render events for this cell - events are positioned relative to the first cell of each column */}
                  {index === 0 &&
                    events
                      .filter((event) => event.date === formatDateString(weekDates[dayIndex]))
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
                              // Double click to edit
                              if (!isDragging && onEventDoubleClick) {
                                e.stopPropagation()
                                onEventDoubleClick(event)
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
                            {/* Delete button - shows on hover */}
                            {onEventDelete && (
                              <button
                                type="button"
                                className="absolute top-1 right-1 size-5 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
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

