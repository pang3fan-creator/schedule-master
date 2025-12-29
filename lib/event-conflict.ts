/**
 * Event conflict detection utilities
 */

import type { Event } from "@/lib/types"

/**
 * Check if two time ranges overlap on the same day
 */
export function doTimesOverlap(
    start1Hour: number,
    start1Minute: number,
    end1Hour: number,
    end1Minute: number,
    start2Hour: number,
    start2Minute: number,
    end2Hour: number,
    end2Minute: number
): boolean {
    const start1 = start1Hour * 60 + start1Minute
    const end1 = end1Hour * 60 + end1Minute
    const start2 = start2Hour * 60 + start2Minute
    const end2 = end2Hour * 60 + end2Minute

    return start1 < end2 && start2 < end1
}

/**
 * Check if a new event would conflict with any existing events on the same day
 * Returns the conflicting events if any
 */
export function findConflictingEvents(
    newEvent: Omit<Event, "id">,
    existingEvents: Event[],
    excludeEventId?: string
): Event[] {
    return existingEvents.filter((existing) => {
        // Skip if same event (for editing)
        if (excludeEventId && existing.id === excludeEventId) {
            return false
        }

        // Must be on the same day of week (decoupled from specific date)
        if (existing.day !== newEvent.day) {
            return false
        }

        // Check time overlap
        return doTimesOverlap(
            newEvent.startHour,
            newEvent.startMinute,
            newEvent.endHour,
            newEvent.endMinute,
            existing.startHour,
            existing.startMinute,
            existing.endHour,
            existing.endMinute
        )
    })
}

/**
 * Format event time range for display
 */
export function formatEventTimeRange(event: Event | Omit<Event, "id">, use12Hour: boolean = true): string {
    const formatTime = (hour: number, minute: number) => {
        if (use12Hour) {
            const period = hour >= 12 ? "PM" : "AM"
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
            return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`
        }
        return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    }

    return `${formatTime(event.startHour, event.startMinute)} - ${formatTime(event.endHour, event.endMinute)}`
}

/**
 * Check if an event would conflict when dragged to a new position
 */
export function wouldDragConflict(
    draggedEvent: Event,
    newStartHour: number,
    newStartMinute: number,
    newEndHour: number,
    newEndMinute: number,
    allEvents: Event[]
): Event | null {
    // Find events on the same day of week (excluding the dragged event)
    const otherEvents = allEvents.filter(
        (e) => e.id !== draggedEvent.id && e.day === draggedEvent.day
    )

    for (const other of otherEvents) {
        if (
            doTimesOverlap(
                newStartHour,
                newStartMinute,
                newEndHour,
                newEndMinute,
                other.startHour,
                other.startMinute,
                other.endHour,
                other.endMinute
            )
        ) {
            return other
        }
    }

    return null
}
