"use client"

import { useState, useCallback, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { WeeklyCalendar, type Event } from "@/components/weekly-calendar"
import { DailyCalendar } from "@/components/daily-calendar"

// LocalStorage key for events
const EVENTS_STORAGE_KEY = "schedule-builder-events"

// Get the Monday of the week containing the given date
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

// Load events from localStorage
function loadEventsFromStorage(): Event[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(EVENTS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Validate that it's an array
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error("Error loading events from localStorage:", error)
  }
  return []
}

// Save events to localStorage
function saveEventsToStorage(events: Event[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))
  } catch (error) {
    console.error("Error saving events to localStorage:", error)
  }
}

// Clear events from localStorage
function clearEventsFromStorage(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(EVENTS_STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing events from localStorage:", error)
  }
}

export default function ScheduleBuilderPage() {
  // Initialize with empty array, will load from localStorage in useEffect
  const [events, setEvents] = useState<Event[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())
  const [currentMonday, setCurrentMonday] = useState<Date>(() => getMonday(new Date()))

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = loadEventsFromStorage()
    setEvents(storedEvents)
    setIsLoaded(true)
  }, [])

  // Save events to localStorage whenever events change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveEventsToStorage(events)
    }
  }, [events, isLoaded])

  const handleReset = () => {
    setEvents([])
    clearEventsFromStorage()
  }

  // Handle event update when dragged
  const handleEventUpdate = useCallback((updatedEvent: Event) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    )
  }, [])

  // Handle adding a new event
  const handleAddEvent = useCallback((eventData: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setEvents(prevEvents => [...prevEvents, newEvent])
  }, [])

  return (
    <div className="flex h-screen flex-col bg-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onReset={handleReset}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddEvent={handleAddEvent}
          currentMonday={currentMonday}
        />
        <main className="flex-1 overflow-auto">
          {viewMode === "week" ? (
            <WeeklyCalendar events={events} onEventUpdate={handleEventUpdate} />
          ) : (
            <DailyCalendar
              events={events}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onEventUpdate={handleEventUpdate}
            />
          )}
        </main>
      </div>
    </div>
  )
}
