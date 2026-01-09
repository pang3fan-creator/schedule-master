"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"
import { WeeklyCalendar } from "@/components/WeeklyCalendar"
import { type Event } from "@/lib/types"
import { DailyCalendar } from "@/components/DailyCalendar"
import { EventContextMenu } from "@/components/EventContextMenu"
import { findConflictingEvents } from "@/lib/event-conflict"
import { useSettings } from "@/components/SettingsContext"
import { MobileToolbar } from "@/components/MobileToolbar"
import { MobileEventActionSheet } from "@/components/MobileEventActionSheet"
import { useIsMobile } from "@/hooks/useMediaQuery"
import { getWeekStart } from "@/lib/time-utils"
import { homepageFAQs } from "@/components/HomepageSEOContent"
import { EVENTS_STORAGE_KEY, VIEW_MODE_STORAGE_KEY, SELECTED_DATE_STORAGE_KEY, SETTINGS_STORAGE_KEY, SHOULD_OPEN_AI_AUTOFILL_KEY } from "@/lib/storage-keys"

// Dynamically import dialog components for code splitting
// These are only loaded when the user triggers them
const ExportDialog = dynamic(() => import("@/components/ExportDialog").then(m => m.ExportDialog), { ssr: false })
const DeleteConfirmDialog = dynamic(() => import("@/components/DeleteConfirmDialog").then(m => m.DeleteConfirmDialog), { ssr: false })
const ConflictDialog = dynamic(() => import("@/components/ConflictDialog").then(m => m.ConflictDialog), { ssr: false })
const EditEventDialog = dynamic(() => import("@/components/EditEventDialog").then(m => m.EditEventDialog), { ssr: false })
const AddEventDialog = dynamic(() => import("@/components/AddEventDialog").then(m => m.AddEventDialog), { ssr: false })

// Dynamically import welcome tip components (shown once per user)
const MobileWelcomeTip = dynamic(() => import("@/components/MobileWelcomeTip").then(m => m.MobileWelcomeTip), { ssr: false })
const DesktopWelcomeTip = dynamic(() => import("@/components/DesktopWelcomeTip").then(m => m.DesktopWelcomeTip), { ssr: false })

// LocalStorage keys are now imported from @/lib/storage-keys

// Load events from localStorage
function loadEventsFromStorage(): Event[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(EVENTS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
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

// Load view mode from localStorage
function loadViewModeFromStorage(): "day" | "week" {
  if (typeof window === "undefined") return "week"

  try {
    const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY)
    if (stored === "day" || stored === "week") {
      return stored
    }
  } catch (error) {
    console.error("Error loading view mode from localStorage:", error)
  }
  return "week" // Default to week view
}

// Save view mode to localStorage
function saveViewModeToStorage(viewMode: "day" | "week"): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode)
  } catch (error) {
    console.error("Error saving view mode to localStorage:", error)
  }
}

// Load selected date from localStorage
function loadSelectedDateFromStorage(): Date {
  if (typeof window === "undefined") return new Date()

  try {
    const stored = localStorage.getItem(SELECTED_DATE_STORAGE_KEY)
    if (stored) {
      const date = new Date(stored)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
  } catch (error) {
    console.error("Error loading selected date from localStorage:", error)
  }
  return new Date()
}

// Save selected date to localStorage
function saveSelectedDateToStorage(date: Date): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(SELECTED_DATE_STORAGE_KEY, date.toISOString())
  } catch (error) {
    console.error("Error saving selected date to localStorage:", error)
  }
}

export default function ScheduleBuilderPage() {
  // Initialize with empty array, will load from localStorage in useEffect
  const [events, setEvents] = useState<Event[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [viewMode, setViewMode] = useState<"day" | "week">("week")
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())
  // Get settings from context
  const { settings, reloadSettings, resetSettings } = useSettings()

  // Calculate current week start based on selected date and settings
  // This ensures the "Add Event" dialog uses the correct week reference
  const currentWeekStart = getWeekStart(selectedDate, settings.weekStartsOnSunday)

  const [showExportDialog, setShowExportDialog] = useState(false)
  const [isExporting, setIsExporting] = useState(false)  // Export mode for calendar rendering

  // Detect mobile for conditional rendering
  const isMobile = useIsMobile()

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    event: Event
    x: number
    y: number
  } | null>(null)

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    event: Event
  } | null>(null)

  // Conflict dialog state (for both add and edit)
  const [conflictState, setConflictState] = useState<{
    newEventData: Omit<Event, "id">
    conflictingEvents: Event[]
    isEdit?: boolean  // Flag to differentiate edit vs add conflict
    editEventId?: string  // Original event ID for edit conflicts
  } | null>(null)

  // Edit event state
  const [editEvent, setEditEvent] = useState<Event | null>(null)

  // Settings state (controlled from here to allow jumping from other pages)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)

  // Mobile action sheet state
  const [mobileActionEvent, setMobileActionEvent] = useState<Event | null>(null)

  // State for reopening add dialog after conflict
  const [showAddDialog, setShowAddDialog] = useState(false)

  // State for initial data when opening add dialog (e.g. from drag interaction)
  const [addDialogInitialData, setAddDialogInitialData] = useState<{
    startTime?: string
    endTime?: string
    selectedDays?: number[]
  } | undefined>(undefined)

  // AI Autofill dialog state (can be triggered externally by AI template)
  const [showAIAutofillDialog, setShowAIAutofillDialog] = useState(false)

  // Handle opening add dialog with specific data
  const handleOpenAddDialog = useCallback((data: { startTime: string; endTime: string; day: number }) => {
    setAddDialogInitialData({
      startTime: data.startTime,
      endTime: data.endTime,
      selectedDays: [data.day]
    })
    setShowAddDialog(true)
  }, [])

  // Reset initial data when dialog closes
  const handleAddDialogClose = useCallback(() => {
    setShowAddDialog(false)
    setAddDialogInitialData(undefined)
  }, [])

  // Ref for the calendar container (for export)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Load events from localStorage on mount and reload settings
  // (in case a template was just applied)
  useEffect(() => {
    const storedEvents = loadEventsFromStorage()
    setEvents(storedEvents)
    // Load saved view mode
    const storedViewMode = loadViewModeFromStorage()
    setViewMode(storedViewMode)
    // Load saved selected date
    const storedDate = loadSelectedDateFromStorage()
    setSelectedDate(storedDate)

    setIsLoaded(true)
    // Reload settings in case template was just applied
    reloadSettings()

    // Check if AI Autofill should be opened (from AI template application)
    const shouldOpenAIAutofill = localStorage.getItem(SHOULD_OPEN_AI_AUTOFILL_KEY)
    if (shouldOpenAIAutofill === 'true') {
      localStorage.removeItem(SHOULD_OPEN_AI_AUTOFILL_KEY)
      // Delay slightly to ensure page is fully loaded
      setTimeout(() => {
        setShowAIAutofillDialog(true)
      }, 100)
    }
  }, [reloadSettings])

  // Save events to localStorage whenever events change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveEventsToStorage(events)
    }
  }, [events, isLoaded])

  // Save view mode to localStorage whenever it changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveViewModeToStorage(viewMode)
    }
  }, [viewMode, isLoaded])

  // Save selected date to localStorage whenever it changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveSelectedDateToStorage(selectedDate)
    }
  }, [selectedDate, isLoaded])

  const handleReset = useCallback(() => {
    setEvents([])
    clearEventsFromStorage()
    resetSettings()
  }, [resetSettings])

  // Handle event update when dragged or edited (with conflict detection)
  // skipConflictCheck is true when called from drag operations (conflict already prevented during drag)
  const handleEventUpdate = useCallback((updatedEvent: Event, skipConflictCheck?: boolean) => {
    // For drag operations, skip conflict check since we already prevented conflicts during drag
    // Also skip if allowEventOverlap is enabled
    if (skipConflictCheck || settings.allowEventOverlap) {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      )
      return
    }

    // Check for conflicts, excluding the event being updated
    const conflicts = findConflictingEvents(updatedEvent, events, updatedEvent.id)

    if (conflicts.length > 0) {
      // Show conflict dialog for edit
      setConflictState({
        newEventData: updatedEvent,
        conflictingEvents: conflicts,
        isEdit: true,
        editEventId: updatedEvent.id,
      })
    } else {
      // No conflict, update directly
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      )
    }
  }, [events, settings.allowEventOverlap])

  // Handle adding a new event (with conflict detection)
  const handleAddEvent = useCallback((eventData: Omit<Event, "id">) => {
    // Skip conflict check if allowEventOverlap is enabled
    if (settings.allowEventOverlap) {
      const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }
      setEvents(prevEvents => [...prevEvents, newEvent])
      return
    }

    // Check for conflicts
    const conflicts = findConflictingEvents(eventData, events)

    if (conflicts.length > 0) {
      // Show conflict dialog
      setConflictState({
        newEventData: eventData,
        conflictingEvents: conflicts,
      })
    } else {
      // No conflict, add directly
      const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }
      setEvents(prevEvents => [...prevEvents, newEvent])
    }
  }, [events, settings.allowEventOverlap])

  // Handle adding multiple events at once (from AI Autofill)
  const handleAddEvents = useCallback((eventsData: Omit<Event, "id">[]) => {
    const newEvents: Event[] = eventsData.map((eventData, index) => ({
      ...eventData,
      id: `event-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    }))
    setEvents(prevEvents => [...prevEvents, ...newEvents])
  }, [])

  // Handle conflict dialog actions
  const handleConflictDeleteExisting = useCallback(() => {
    if (!conflictState) return

    // Delete conflicting events
    const conflictIds = conflictState.conflictingEvents.map(e => e.id)
    setEvents(prevEvents => prevEvents.filter(e => !conflictIds.includes(e.id)))

    if (conflictState.isEdit && conflictState.editEventId) {
      // For edit conflicts, update the existing event
      const updatedEvent = { ...conflictState.newEventData, id: conflictState.editEventId } as Event
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === conflictState.editEventId ? updatedEvent : event
        )
      )
    } else {
      // For new event conflicts, add the new event
      const newEvent: Event = {
        ...conflictState.newEventData,
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }
      setEvents(prevEvents => [...prevEvents, newEvent])
    }

    setConflictState(null)
  }, [conflictState])

  const handleConflictModifyNew = useCallback(() => {
    if (conflictState?.isEdit && conflictState.editEventId) {
      // For edit conflicts, reopen edit dialog with the event data
      const eventToEdit = { ...conflictState.newEventData, id: conflictState.editEventId } as Event
      setEditEvent(eventToEdit)
    } else {
      // For add conflicts, reopen add dialog
      setShowAddDialog(true)
      // Keep existing initial data if any
    }
    setConflictState(null)
  }, [conflictState])

  const handleConflictCancel = useCallback(() => {
    setConflictState(null)
  }, [])

  // Handle deleting an event (with confirmation)
  const handleEventDelete = useCallback((eventId: string) => {
    const event = events.find(e => e.id === eventId)
    if (event) {
      setDeleteConfirm({ event })
    }
  }, [events])

  // Confirm delete
  const handleConfirmDelete = useCallback(() => {
    if (deleteConfirm) {
      setEvents(prevEvents => prevEvents.filter(e => e.id !== deleteConfirm.event.id))
      setDeleteConfirm(null)
    }
  }, [deleteConfirm])

  // Handle click on an event (for edit)
  const handleEventClick = useCallback((event: Event) => {
    setEditEvent(event)
  }, [])

  // Handle right-click context menu
  const handleEventContextMenu = useCallback((event: Event, x: number, y: number) => {
    setContextMenu({ event, x, y })
  }, [])

  // Context menu actions
  const handleContextMenuEdit = useCallback(() => {
    if (contextMenu) {
      setEditEvent(contextMenu.event)
    }
    setContextMenu(null)
  }, [contextMenu])

  const handleContextMenuDelete = useCallback(() => {
    if (contextMenu) {
      setDeleteConfirm({ event: contextMenu.event })
    }
    setContextMenu(null)
  }, [contextMenu])

  // Handle export button click
  const handleExport = useCallback(() => {
    setShowExportDialog(true)
  }, [])



  // Handle mobile action sheet edit
  const handleMobileActionEdit = useCallback((event: Event) => {
    setEditEvent(event)
  }, [])

  // Handle mobile action sheet delete
  const handleMobileActionDelete = useCallback((event: Event) => {
    setDeleteConfirm({ event })
  }, [])

  // Generate FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": homepageFAQs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  }

  return (
    <>
      {/* FAQ Schema JSON-LD for SEO */}
      {!isExporting && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <div className={`flex flex-col bg-gray-50 dark:bg-gray-950 ${isExporting ? '' : 'h-screen overflow-hidden'}`}>
        {/* Fixed navbar with transparency - content scrolls behind it */}
        {!isExporting && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar />
          </div>
        )}
        {/* SEO: H1 Title - visually hidden but accessible for search engines */}
        {!isExporting && (
          <h1 className="sr-only">Free Online Schedule Builder</h1>
        )}
        {/* Main content area - fills remaining screen height, no overflow */}
        <div className={`flex flex-1 min-h-0 ${isExporting ? '' : 'pt-16'}`}>
          {/* Desktop Sidebar - Hidden on mobile */}
          {!isExporting && !isMobile && (
            <Sidebar
              events={events}
              onReset={handleReset}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              weekStart={currentWeekStart}
              weekStartsOnSunday={settings.weekStartsOnSunday}
              onExport={handleExport}
              showSettingsOpen={showSettingsDialog}
              onSettingsOpenChange={setShowSettingsDialog}
              onLoadSchedule={(loadedEvents, loadedSettings) => {
                // Update events
                setEvents(loadedEvents)
                saveEventsToStorage(loadedEvents)
                // Update settings if provided
                if (loadedSettings) {
                  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(loadedSettings))
                  reloadSettings()
                }
              }}
              onAddEvents={handleAddEvents}
              showAIAutofillOpen={showAIAutofillDialog}
              onAIAutofillOpenChange={setShowAIAutofillDialog}
            />
          )}
          <main className={`flex-1 min-h-0 overflow-auto ${!isExporting && isMobile ? 'pb-20' : ''}`} ref={calendarRef}>
            {viewMode === "week" ? (
              <WeeklyCalendar
                events={events}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onEventUpdate={handleEventUpdate}
                onEventDelete={handleEventDelete}
                onEventClick={handleEventClick}
                onEventContextMenu={handleEventContextMenu}
                exportMode={isExporting}
                onAddEvent={handleOpenAddDialog}
              />
            ) : (
              <DailyCalendar
                events={events}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onEventUpdate={handleEventUpdate}
                onEventDelete={handleEventDelete}
                onEventClick={handleEventClick}
                onEventContextMenu={handleEventContextMenu}
                exportMode={isExporting}
                onAddEvent={handleOpenAddDialog}
              />
            )}
          </main>
        </div>

        {/* SEO Content - hidden from users but accessible to crawlers */}
        {!isExporting && (
          <div className="sr-only" aria-hidden="false">
            <h2>Frequently Asked Questions about TrySchedule</h2>
            {homepageFAQs.map((faq, index) => (
              <div key={index}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        )}

        {/* Mobile Bottom Toolbar */}
        {!isExporting && isMobile && (
          <MobileToolbar
            onReset={handleReset}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            weekStart={currentWeekStart}
            weekStartsOnSunday={settings.weekStartsOnSunday}
            onExport={handleExport}
            onLoadSchedule={(loadedEvents, loadedSettings) => {
              // Update events
              setEvents(loadedEvents)
              saveEventsToStorage(loadedEvents)
              // Update settings if provided
              if (loadedSettings) {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(loadedSettings))
                reloadSettings()
              }
            }}
            showSettingsOpen={showSettingsDialog}
            onSettingsOpenChange={setShowSettingsDialog}
            showAIAutofillOpen={showAIAutofillDialog}
            onAIAutofillOpenChange={setShowAIAutofillDialog}
            onAddEvents={handleAddEvents}
          />
        )}

        {/* Export Dialog */}
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          calendarRef={calendarRef}
          onExportStart={() => setIsExporting(true)}
          onExportEnd={() => setIsExporting(false)}
          events={events}
          settings={{
            workingHoursStart: settings.workingHoursStart,
            workingHoursEnd: settings.workingHoursEnd,
            weekStartsOnSunday: settings.weekStartsOnSunday,
            use12HourFormat: settings.use12HourFormat,
          }}
          currentWeekStart={currentWeekStart}
          viewMode={viewMode}
          selectedDate={selectedDate}
        />

        {/* Context Menu */}
        {contextMenu && (
          <EventContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onEdit={handleContextMenuEdit}
            onDelete={handleContextMenuDelete}
            onClose={() => setContextMenu(null)}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={deleteConfirm !== null}
          onOpenChange={(open) => !open && setDeleteConfirm(null)}
          eventTitle={deleteConfirm?.event.title || ""}
          onConfirm={handleConfirmDelete}
        />

        {/* Conflict Dialog */}
        <ConflictDialog
          open={conflictState !== null}
          onOpenChange={(open) => !open && setConflictState(null)}
          conflictingEvents={conflictState?.conflictingEvents || []}
          newEventTitle={conflictState?.newEventData.title || ""}
          onDeleteExisting={handleConflictDeleteExisting}
          onModifyNew={handleConflictModifyNew}
          onCancel={handleConflictCancel}
        />

        {/* Edit Event Dialog */}
        <EditEventDialog
          open={editEvent !== null}
          onOpenChange={(open) => !open && setEditEvent(null)}
          event={editEvent}
          onUpdateEvent={handleEventUpdate}
        />

        {/* Add Event Dialog (for click/drag on calendar grid) */}
        <AddEventDialog
          open={showAddDialog}
          onOpenChange={(open) => {
            if (!open) handleAddDialogClose()
          }}
          onAddEvent={handleAddEvent}
          weekStart={currentWeekStart}
          weekStartsOnSunday={settings.weekStartsOnSunday}
          initialData={addDialogInitialData}
        />

        {/* Mobile Event Action Sheet */}
        <MobileEventActionSheet
          open={mobileActionEvent !== null}
          onOpenChange={(open) => !open && setMobileActionEvent(null)}
          event={mobileActionEvent}
          onEdit={handleMobileActionEdit}
          onDelete={handleMobileActionDelete}
        />

        {/* Mobile Welcome Tip - shows once on first mobile visit */}
        <MobileWelcomeTip />

        {/* Desktop Welcome Tip - shows once on first desktop visit */}
        <DesktopWelcomeTip />
      </div>
    </>
  )
}
