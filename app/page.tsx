"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { type Event } from "@/lib/types"
import { DailyCalendar } from "@/components/daily-calendar"
import { ExportDialog } from "@/components/ExportDialog"
import { EventContextMenu } from "@/components/EventContextMenu"
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog"
import { ConflictDialog } from "@/components/ConflictDialog"
import { EditEventDialog } from "@/components/EditEventDialog"
import { findConflictingEvents } from "@/lib/event-conflict"
import { useSettings } from "@/components/SettingsContext"
import { MobileToolbar } from "@/components/MobileToolbar"
import { MobileEventActionSheet } from "@/components/MobileEventActionSheet"
import { MobileWelcomeTip } from "@/components/MobileWelcomeTip"
import { useIsMobile } from "@/hooks/useMediaQuery"

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
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [isExporting, setIsExporting] = useState(false)  // Export mode for calendar rendering

  // Get settings from context for PDF export
  const { settings, reloadSettings } = useSettings()

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
    setIsLoaded(true)
    // Reload settings in case template was just applied
    reloadSettings()
  }, [reloadSettings])

  // Save events to localStorage whenever events change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveEventsToStorage(events)
    }
  }, [events, isLoaded])

  // Set initial view mode to daily on mobile (after isMobile is determined)
  const [hasSetInitialView, setHasSetInitialView] = useState(false)
  useEffect(() => {
    // Only set once, after we know if it's mobile
    if (!hasSetInitialView && typeof window !== 'undefined') {
      // Check screen width directly for initial load
      const isMobileScreen = window.innerWidth < 768
      if (isMobileScreen) {
        setViewMode("day")
      }
      setHasSetInitialView(true)
    }
  }, [hasSetInitialView])

  const handleReset = () => {
    setEvents([])
    clearEventsFromStorage()
  }

  // Handle event update when dragged or edited (with conflict detection)
  // skipConflictCheck is true when called from drag operations (conflict already prevented during drag)
  const handleEventUpdate = useCallback((updatedEvent: Event, skipConflictCheck?: boolean) => {
    // For drag operations, skip conflict check since we already prevented conflicts during drag
    if (skipConflictCheck) {
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
  }, [events])

  // Handle adding a new event (with conflict detection)
  const handleAddEvent = useCallback((eventData: Omit<Event, "id">) => {
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
  }, [events])

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

  // Handle double-click on an event (for edit)
  const handleEventDoubleClick = useCallback((event: Event) => {
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

  // Handle mobile long press on event
  const handleEventLongPress = useCallback((event: Event) => {
    setMobileActionEvent(event)
  }, [])

  // Handle mobile action sheet edit
  const handleMobileActionEdit = useCallback((event: Event) => {
    setEditEvent(event)
  }, [])

  // Handle mobile action sheet delete
  const handleMobileActionDelete = useCallback((event: Event) => {
    setDeleteConfirm({ event })
  }, [])

  return (
    <div className={`flex flex-col bg-white ${isExporting ? '' : 'h-screen'}`}>
      {!isExporting && <Navbar />}
      <div className={`flex flex-1 ${isExporting ? '' : 'overflow-hidden'}`}>
        {/* Desktop Sidebar - Hidden on mobile */}
        {!isExporting && !isMobile && (
          <Sidebar
            onReset={handleReset}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddEvent={handleAddEvent}
            currentMonday={currentMonday}
            onExport={handleExport}
            showAddDialog={showAddDialog}
            onAddDialogClose={handleAddDialogClose}
            initialData={addDialogInitialData}
          />
        )}
        <main className={`flex-1 ${isExporting ? '' : 'overflow-auto'} ${!isExporting && isMobile ? 'pb-20' : ''}`} ref={calendarRef}>
          {viewMode === "week" ? (
            <WeeklyCalendar
              events={events}
              onEventUpdate={handleEventUpdate}
              onEventDelete={handleEventDelete}
              onEventDoubleClick={handleEventDoubleClick}
              onEventContextMenu={handleEventContextMenu}
              onEventLongPress={handleEventLongPress}
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
              onEventDoubleClick={handleEventDoubleClick}
              onEventContextMenu={handleEventContextMenu}
              onEventLongPress={handleEventLongPress}
              exportMode={isExporting}
              onAddEvent={handleOpenAddDialog}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Toolbar */}
      {!isExporting && isMobile && (
        <MobileToolbar
          onReset={handleReset}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddEvent={handleAddEvent}
          currentMonday={currentMonday}
          onExport={handleExport}
          showAddDialog={showAddDialog}
          onAddDialogClose={handleAddDialogClose}
          initialData={addDialogInitialData}
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
        currentWeekStart={currentMonday}
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
    </div>
  )
}
