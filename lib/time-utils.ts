/**
 * Time utilities for calendar components
 * Shared functions for formatting, calculations, and constraints
 */

// Time constraints - can be customized via settings
export const DEFAULT_MIN_HOUR = 8  // 8 AM
export const DEFAULT_MAX_HOUR = 17 // 5 PM

// Day names for different week start configurations
export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
export const SHORT_DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
export const DAY_NAMES_MONDAY_START = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
export const DAY_NAMES_SUNDAY_START = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

import { type Event } from "@/lib/types"

export interface GroupedEvent extends Event {
    left: number
    width: number
}

/**
 * Format hour for display
 */
export function formatHour(hour: number, use12Hour: boolean): string {
    if (use12Hour) {
        if (hour === 0) return "12:00 AM"
        if (hour === 12) return "12:00 PM"
        if (hour < 12) return `${hour}:00 AM`
        return `${hour - 12}:00 PM`
    }
    return `${hour.toString().padStart(2, "0")}:00`
}

/**
 * Format time with hour and minute
 */
export function formatTime(hour: number, minute: number, use12Hour: boolean): string {
    if (use12Hour) {
        const period = hour >= 12 ? "PM" : "AM"
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`
    }
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
}

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDateString(date: Date): string {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
}

/**
 * Get the first day of the week containing the given date
 */
export function getWeekStart(date: Date, startsOnSunday: boolean = false): Date {
    const d = new Date(date)
    const day = d.getDay()
    let diff: number
    if (startsOnSunday) {
        diff = -day
    } else {
        diff = day === 0 ? -6 : 1 - day
    }
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
}

/**
 * Get array of dates for a week starting from the given date
 */
export function getWeekDates(weekStart: Date): Date[] {
    const dates: Date[] = []
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        dates.push(date)
    }
    return dates
}

/**
 * Get ISO day index (0-6, Monday-Sunday)
 */
export function getIsoDayIndex(date: Date): number {
    const day = date.getDay()
    return day === 0 ? 6 : day - 1
}

/**
 * Format date range for header (e.g., "October 21 - 27, 2025")
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const startMonth = monthNames[startDate.getMonth()]
    const endMonth = monthNames[endDate.getMonth()]
    const startDay = startDate.getDate()
    const endDay = endDate.getDate()
    const startYear = startDate.getFullYear()
    const endYear = endDate.getFullYear()

    if (startYear !== endYear) {
        return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
    } else if (startMonth !== endMonth) {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`
    } else {
        return `${startMonth} ${startDay} - ${endDay}, ${startYear}`
    }
}

/**
 * Calculate event position in pixels based on row height
 */
export function getEventPosition(
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number,
    rowHeight: number,
    minHour: number = DEFAULT_MIN_HOUR
): { top: string; height: string } {
    const startOffset = (startHour - minHour) + startMinute / 60
    const endOffset = (endHour - minHour) + endMinute / 60
    const duration = endOffset - startOffset

    return {
        top: `${startOffset * rowHeight}px`,
        height: `${Math.max(duration * rowHeight - 8, 20)}px`, // Minimum 20px height
    }
}

/**
 * Calculate new time based on drag offset
 */
export function calculateDraggedTime(
    originalStartHour: number,
    originalStartMinute: number,
    originalEndHour: number,
    originalEndMinute: number,
    offsetPx: number,
    rowHeight: number,
    minHour: number = DEFAULT_MIN_HOUR,
    maxHour: number = DEFAULT_MAX_HOUR,
    timeIncrement: number = 5  // Snap to this many minutes (5, 15, 30, or 60)
): { startHour: number; startMinute: number; endHour: number; endMinute: number } {
    const hourOffset = offsetPx / rowHeight

    // Calculate new start time
    let newStartTotalMinutes = (originalStartHour * 60 + originalStartMinute) + (hourOffset * 60)
    const duration = (originalEndHour * 60 + originalEndMinute) - (originalStartHour * 60 + originalStartMinute)

    // Round to nearest timeIncrement for cleaner times
    newStartTotalMinutes = Math.round(newStartTotalMinutes / timeIncrement) * timeIncrement
    let newEndTotalMinutes = newStartTotalMinutes + duration

    // Constrain to boundaries
    const minMinutes = minHour * 60
    const maxMinutes = maxHour * 60

    // Ensure start time doesn't go before minHour
    if (newStartTotalMinutes < minMinutes) {
        newStartTotalMinutes = minMinutes
        newEndTotalMinutes = minMinutes + duration
    }

    // Ensure end time doesn't go after maxHour
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

/**
 * Parse time string to hour and minute
 */
export function parseTimeString(timeStr: string): { hour: number; minute: number } {
    const [h, m] = timeStr.split(":").map(Number)
    return { hour: h || 0, minute: m || 0 }
}

/**
 * Convert total minutes to hour and minute
 */
export function minutesToTime(totalMinutes: number): { hour: number; minute: number } {
    return {
        hour: Math.floor(totalMinutes / 60),
        minute: totalMinutes % 60,
    }
}

/**
 * Convert hour and minute to total minutes
 */
export function timeToMinutes(hour: number, minute: number): number {
    return hour * 60 + minute
}

/**
 * Group overlapping events to calculate their horizontal position and width
 */
export function groupOverlappingEvents(events: Event[]): GroupedEvent[] {
    if (events.length === 0) return []

    // Sort events by start time, then duration (descending)
    const sortedEvents = [...events].sort((a, b) => {
        const startA = a.startHour * 60 + a.startMinute
        const startB = b.startHour * 60 + b.startMinute
        if (startA !== startB) return startA - startB

        const endA = a.endHour * 60 + a.endMinute
        const endB = b.endHour * 60 + b.endMinute
        return (endB - startB) - (endA - startA)
    })

    const groups: GroupedEvent[][] = []

    // Group overlapping events
    sortedEvents.forEach((event) => {
        const evtStart = event.startHour * 60 + event.startMinute
        const evtEnd = event.endHour * 60 + event.endMinute

        let placed = false
        // Try to add to existing group
        for (const group of groups) {
            // Check if overlaps with ANY event in the group
            const overlaps = group.some(groupEvent => {
                const groupStart = groupEvent.startHour * 60 + groupEvent.startMinute
                const groupEnd = groupEvent.endHour * 60 + groupEvent.endMinute
                return (evtStart < groupEnd && evtEnd > groupStart)
            })

            if (overlaps) {
                group.push({ ...event, left: 0, width: 0 })
                placed = true
                break
            }
        }

        if (!placed) {
            groups.push([{ ...event, left: 0, width: 0 }])
        }
    })

    const result: GroupedEvent[] = []

    // Calculate position for each group
    groups.forEach(group => {
        // Expand width of events to fill columns
        const columns: GroupedEvent[][] = []

        group.forEach(event => {
            const evtStart = event.startHour * 60 + event.startMinute
            const evtEnd = event.endHour * 60 + event.endMinute

            let columnIndex = 0
            while (true) {
                if (!columns[columnIndex]) {
                    columns[columnIndex] = []
                    columns[columnIndex].push(event)
                    break
                }

                // Check if fits in this column (no overlap with last event in column)
                // Since sorted by start time, we only check the last added event in the column?
                // Actually need to check all events in column for overlap?
                // Since sorted by start time, checking last might be enough if we just want to avoid immediate collision
                // But simplified logic: just find first column where it fits

                const hasOverlap = columns[columnIndex].some(colEvent => {
                    const colStart = colEvent.startHour * 60 + colEvent.startMinute
                    const colEnd = colEvent.endHour * 60 + colEvent.endMinute
                    return (evtStart < colEnd && evtEnd > colStart)
                })

                if (!hasOverlap) {
                    columns[columnIndex].push(event)
                    break
                }

                columnIndex++
            }
        })

        const totalColumns = columns.length

        columns.forEach((column, colIndex) => {
            column.forEach(event => {
                event.left = (colIndex / totalColumns) * 100
                event.width = (1 / totalColumns) * 100
                result.push(event)
            })
        })
    })

    return result
}
