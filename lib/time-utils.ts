/**
 * Time utilities for calendar components
 * Shared functions for formatting, calculations, and constraints
 */

// Time constraints - can be customized via settings
export const DEFAULT_MIN_HOUR = 8  // 8 AM
export const DEFAULT_MAX_HOUR = 17 // 5 PM

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
