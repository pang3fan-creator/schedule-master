"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { WeeklyCalendar, type Event } from "@/components/weekly-calendar"
import { DailyCalendar } from "@/components/daily-calendar"

// Initial events data
const initialEvents: Event[] = [
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

export default function ScheduleBuilderPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())

  const handleReset = () => {
    setEvents([])
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onReset={handleReset}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <main className="flex-1 overflow-auto">
          {viewMode === "week" ? (
            <WeeklyCalendar events={events} />
          ) : (
            <DailyCalendar
              events={events}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          )}
        </main>
      </div>
    </div>
  )
}

