"use client"

import * as React from "react"
import { useRef, useState, useEffect, useMemo, useCallback } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Event {
  id: string
  title: string
  code: string
  day: number
  date: string // YYYY-MM-DD format for specific date filtering
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
}

interface WeeklyCalendarProps {
  events: Event[]
  onEventUpdate?: (updatedEvent: Event) => void
}

const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

// Time constraints
const MIN_HOUR = 8  // 8 AM
const MAX_HOUR = 17 // 5 PM

// Get the Monday of the week containing the given date
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  // We want Monday as the first day of the week
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

// Get array of dates for the week starting from Monday
function getWeekDates(monday: Date): Date[] {
  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
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

export function WeeklyCalendar({ events, onEventUpdate }: WeeklyCalendarProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [rowHeight, setRowHeight] = useState(58) // Default fallback height

  // State for current week's Monday - initialize to current week
  const [currentMonday, setCurrentMonday] = useState(() => getMonday(new Date()))

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

  // Calculate the week's dates based on current Monday
  const weekDates = useMemo(() => getWeekDates(currentMonday), [currentMonday])

  // Build days array with dynamic dates
  const days = useMemo(() => {
    return weekDates.map((date, index) => ({
      short: dayNames[index],
      date: date.getDate(),
    }))
  }, [weekDates])

  // Get date range string for header
  const dateRangeString = useMemo(() => {
    const sunday = weekDates[6]
    return formatDateRange(currentMonday, sunday)
  }, [currentMonday, weekDates])

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentMonday(prev => {
      const newMonday = new Date(prev)
      newMonday.setDate(prev.getDate() - 7)
      return newMonday
    })
  }

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentMonday(prev => {
      const newMonday = new Date(prev)
      newMonday.setDate(prev.getDate() + 7)
      return newMonday
    })
  }

  // Calculate actual row height based on grid dimensions
  useEffect(() => {
    const updateRowHeight = () => {
      if (gridRef.current) {
        const gridElement = gridRef.current
        const gridHeight = gridElement.clientHeight
        // Header row is 48px, we have 9 time slot rows + 1 label row (auto)
        // The 9 rows share the remaining space equally
        const headerHeight = 48
        const availableHeight = gridHeight - headerHeight
        // 9 equal rows for time slots (8AM-4PM), the 10th row (5PM label) is auto
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

  // Navigate to current week (today)
  const goToToday = () => {
    setCurrentMonday(getMonday(new Date()))
  }

  return (
    <div className="flex h-full flex-col p-6 bg-gray-100">
      {/* Header with navigation */}
      <div className="mb-4 flex items-center justify-between flex-shrink-0">
        {/* Spacer for layout balance */}
        <div className="w-20"></div>

        {/* Center navigation */}
        <div className="flex items-center">
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
            gridTemplateColumns: "60px repeat(7, 1fr)",
            gridTemplateRows: "48px repeat(9, 1fr) auto"
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

          {/* Time rows - 9 data rows (8AM-4PM) + 1 label row (5PM) */}
          {hours.map((hour, index) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="flex items-start justify-end pr-3">
                <span className="text-xs text-gray-400 -translate-y-1/2">{formatHour(hour)}</span>
              </div>

              {/* Day cells - only render for rows with actual time slots (not the last label row) */}
              {index !== hours.length - 1 && days.map((day, dayIndex) => (
                <div
                  key={`${day.short}-${hour}`}
                  className={`relative border-b border-l border-gray-300 ${dayIndex === days.length - 1 ? "border-r" : ""}`}
                >
                  {/* Render events for this cell - events are positioned relative to the first cell of each column */}
                  {hour === 8 &&
                    events
                      .filter((event) => event.date === formatDateString(weekDates[dayIndex]))
                      .map((event) => {
                        const position = getVisualPosition(event)
                        const displayTime = getDisplayTime(event)
                        const isDragging = dragState.eventId === event.id
                        return (
                          <div
                            key={event.id}
                            className={`absolute left-1 right-1 z-10 rounded-md border-l-4 border-blue-500 bg-blue-100 p-2 overflow-hidden text-center ${isDragging ? 'cursor-grabbing shadow-lg ring-2 ring-blue-400' : 'cursor-grab'}`}
                            style={{
                              top: position.top,
                              height: position.height,
                              transition: isDragging ? 'none' : 'top 0.1s ease-out, height 0.1s ease-out',
                              userSelect: 'none',
                            }}
                            onMouseDown={(e) => handleMouseDown(e, event)}
                          >
                            <p className="text-sm font-semibold text-blue-700">{event.title}</p>
                            <p className="text-xs text-blue-600">{event.code}</p>
                            <p className="absolute bottom-2 left-0 right-0 text-xs text-blue-600">
                              {formatTime(displayTime.startHour, displayTime.startMinute)} -{" "}
                              {formatTime(displayTime.endHour, displayTime.endMinute)}
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

