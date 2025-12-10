"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Event {
  id: string
  title: string
  code: string
  day: number
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
}

const events: Event[] = [
  {
    id: "1",
    title: "Team Sync",
    code: "123456",
    day: 0, // Monday
    startHour: 10,
    startMinute: 0,
    endHour: 11,
    endMinute: 0,
  },
  {
    id: "2",
    title: "Design Review",
    code: "123456",
    day: 3, // Thursday
    startHour: 9,
    startMinute: 0,
    endHour: 11,
    endMinute: 0,
  },
  {
    id: "3",
    title: "Lunch Break",
    code: "123456",
    day: 5, // Saturday
    startHour: 12,
    startMinute: 30,
    endHour: 14,
    endMinute: 0,
  },
]

const days = [
  { short: "MON", date: 21 },
  { short: "TUE", date: 22 },
  { short: "WED", date: 23 },
  { short: "THU", date: 24 },
  { short: "FRI", date: 25 },
  { short: "SAT", date: 26 },
  { short: "SUN", date: 27 },
]

const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

function formatHour(hour: number): string {
  if (hour === 12) return "12 PM"
  if (hour > 12) return `${hour - 12} PM`
  return `${hour} AM`
}

function formatTime(hour: number, minute: number): string {
  const h = hour > 12 ? hour - 12 : hour
  const suffix = hour >= 12 ? "" : ""
  const m = minute === 0 ? ":00" : `:${minute.toString().padStart(2, "0")}`
  return `${h}${m}`
}

function getEventPosition(event: Event) {
  const startOffset = (event.startHour - 8) * 60 + event.startMinute
  const endOffset = (event.endHour - 8) * 60 + event.endMinute
  const duration = endOffset - startOffset

  return {
    top: `${(startOffset / 60) * 58 + 4}px`,
    height: `${(duration / 60) * 58 - 8}px`,
  }
}

export function WeeklyCalendar() {
  return (
    <div className="flex h-full flex-col p-6 bg-gray-100">
      {/* Header with navigation */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
          <ChevronLeft className="size-5" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-900">October 21 - 27, 2025</h2>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
          <ChevronRight className="size-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid min-w-[800px]" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
          {/* Header Row */}
          <div className="h-12" /> {/* Empty corner cell */}
          {days.map((day) => (
            <div key={day.short} className="flex h-12 flex-col items-center justify-center border-b border-gray-300">
              <span className="text-xs font-medium text-gray-500">{day.short}</span>
              <span className="text-sm font-semibold text-gray-900">{day.date}</span>
            </div>
          ))}
          {/* Time rows */}
          {hours.map((hour) => (
            <>
              {/* Time label */}
              <div key={`time-${hour}`} className="flex h-[58px] items-start justify-end pr-3 pt-0">
                <span className="text-xs text-gray-400">{formatHour(hour)}</span>
              </div>

              {/* Day cells */}
              {days.map((day, dayIndex) => (
                <div key={`${day.short}-${hour}`} className={`relative h-[58px] border-b border-l border-gray-300 ${dayIndex === days.length - 1 ? "border-r" : ""}`}>
                  {/* Render events for this cell */}
                  {hour === 8 &&
                    events
                      .filter((event) => event.day === dayIndex)
                      .map((event) => {
                        const position = getEventPosition(event)
                        return (
                          <div
                            key={event.id}
                            className="absolute left-1 right-1 z-10 rounded-md border-l-4 border-blue-500 bg-blue-100 p-2"
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
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
