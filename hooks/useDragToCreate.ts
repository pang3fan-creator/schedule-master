import { useState, useRef, useCallback, useEffect } from "react"
import { type Event } from "@/lib/types"
import { getActualDay } from "@/lib/time-utils"

interface UseDragToCreateProps {
    onAddEvent?: (data: { startTime: string; endTime: string; day: number }) => void
    rowHeight: number
    timeIncrement: number
    existingEvents?: Event[]     // Events for collision detection
    workingHoursStart?: number   // View start hour boundary
    workingHoursEnd?: number     // View end hour boundary
    weekDates?: Date[]           // Optional: week dates array for filtering (weekly view)
    weekStartsOnSunday?: boolean // Week start setting for dayIndex to day mapping
    allowEventOverlap?: boolean  // Skip collision detection when true
}

interface CreatingEvent {
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
    dayIndex: number
}

export function useDragToCreate({
    onAddEvent,
    rowHeight,
    timeIncrement,
    existingEvents = [],
    workingHoursStart = 0,
    workingHoursEnd = 24,
    weekDates,
    weekStartsOnSunday = true,
    allowEventOverlap = false
}: UseDragToCreateProps) {
    const [creatingEvent, setCreatingEvent] = useState<CreatingEvent | null>(null)
    const dragStartRef = useRef<{ y: number; originalClickY: number; hour: number; minute: number; dayIndex: number } | null>(null)
    // Track if we're using touch (to prevent mouse events from firing on touch devices)
    const isTouchRef = useRef(false)

    /**
     * Find collision boundaries for the current drag operation
     * Returns the nearest event boundary that would block the drag
     * When allowEventOverlap is true, returns working hours boundaries only
     */
    const findCollisionBoundary = useCallback((
        originalStartTotal: number,
        currentTotal: number,
        dayIndex: number
    ): { minStart: number; maxEnd: number } => {
        // Default boundaries from working hours
        let minStart = workingHoursStart * 60
        let maxEnd = workingHoursEnd * 60

        // Skip event collision detection if overlap is allowed
        if (allowEventOverlap) {
            return { minStart, maxEnd }
        }

        // Filter events for the specific day (weekly template mode - decoupled from date)
        const eventsToCheck = existingEvents.filter(event => event.day === dayIndex)

        // Iterate through events to find blocking boundaries
        for (const event of eventsToCheck) {
            const eventStart = event.startHour * 60 + event.startMinute
            const eventEnd = event.endHour * 60 + event.endMinute

            const isDraggingDown = currentTotal >= originalStartTotal
            const isDraggingUp = currentTotal < originalStartTotal

            if (isDraggingDown) {
                // Dragging down: check if event is below our start point
                // If event starts after our original start, it's a potential blocker
                if (eventStart >= originalStartTotal && eventStart < maxEnd) {
                    maxEnd = eventStart
                }
            }

            if (isDraggingUp) {
                // Dragging up: check if event is above our end point
                // The end point when dragging up is originalStart + 60 (1 hour)
                const ourEndPoint = originalStartTotal + 60
                if (eventEnd <= ourEndPoint && eventEnd > minStart) {
                    minStart = eventEnd
                }
            }
        }

        return { minStart, maxEnd }
    }, [existingEvents, workingHoursStart, workingHoursEnd, allowEventOverlap])

    // Common function to calculate event times based on current Y position
    const calculateEventTimes = useCallback((clientY: number, isEnd: boolean = false) => {
        if (!dragStartRef.current) return null

        const start = dragStartRef.current
        const pixelsPerMinute = rowHeight / 60
        const deltaY = clientY - start.y
        const deltaMinutes = Math.round((deltaY / pixelsPerMinute) / timeIncrement) * timeIncrement

        const originalStartTotal = start.hour * 60 + start.minute
        const currentTotal = originalStartTotal + deltaMinutes

        let startTotal: number
        let endTotal: number

        // Check if it was a click (small movement) or drag - only relevant for end
        const isClick = isEnd && Math.abs(clientY - start.originalClickY) < 10

        if (isClick) {
            // Click: Force 1 hour default from start of hour
            startTotal = originalStartTotal
            endTotal = startTotal + 60
        } else {
            // Drag: Use calculated position
            if (currentTotal < originalStartTotal) {
                // Dragging upwards: end time is the END of the original grid cell (N+1 hour)
                startTotal = currentTotal
                endTotal = originalStartTotal + 60
            } else {
                // Dragging downwards: start time is the START of the original grid cell (N)
                startTotal = originalStartTotal
                endTotal = currentTotal
            }

            // Ensure minimum duration (timeIncrement)
            if (endTotal - startTotal < timeIncrement) {
                if (currentTotal < originalStartTotal) {
                    startTotal = endTotal - timeIncrement
                } else {
                    endTotal = startTotal + timeIncrement
                }
            }
        }

        // Apply collision detection limits
        const { minStart, maxEnd } = findCollisionBoundary(originalStartTotal, currentTotal, start.dayIndex)

        // Clamp to collision boundaries
        if (startTotal < minStart) startTotal = minStart
        if (endTotal > maxEnd) endTotal = maxEnd

        // Also clamp to valid hours (0-24) as fallback
        if (startTotal < 0) startTotal = 0
        if (endTotal > 24 * 60) endTotal = 24 * 60

        // Ensure minimum duration after clamping
        if (endTotal - startTotal < timeIncrement) {
            if (currentTotal < originalStartTotal) {
                // Dragging up but hit boundary - adjust start instead
                startTotal = Math.max(minStart, endTotal - timeIncrement)
            } else {
                // Dragging down but hit boundary - adjust end instead
                endTotal = Math.min(maxEnd, startTotal + timeIncrement)
            }
        }

        return {
            startHour: Math.floor(startTotal / 60),
            startMinute: Math.floor(startTotal % 60),
            endHour: Math.floor(endTotal / 60),
            endMinute: Math.floor(endTotal % 60),
        }
    }, [rowHeight, timeIncrement, findCollisionBoundary])

    // Mouse move handler
    const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
        if (!dragStartRef.current || isTouchRef.current) return

        // Prevent jitter/shrinking on small moves (threshold 10px)
        if (Math.abs(e.clientY - dragStartRef.current.originalClickY) < 10) return

        const times = calculateEventTimes(e.clientY)
        if (times) {
            setCreatingEvent(prev => prev ? { ...prev, ...times } : null)
        }
    }, [calculateEventTimes])

    // Touch move handler
    const handleGlobalTouchMove = useCallback((e: TouchEvent) => {
        if (!dragStartRef.current || !isTouchRef.current) return
        if (e.touches.length !== 1) return

        const touch = e.touches[0]

        // Prevent jitter/shrinking on small moves (threshold 10px)
        if (Math.abs(touch.clientY - dragStartRef.current.originalClickY) < 10) return

        // Prevent scrolling while dragging
        e.preventDefault()

        const times = calculateEventTimes(touch.clientY)
        if (times) {
            setCreatingEvent(prev => prev ? { ...prev, ...times } : null)
        }
    }, [calculateEventTimes])

    // Common end handler logic
    const handleEnd = useCallback((clientY: number) => {
        if (dragStartRef.current && onAddEvent) {
            const times = calculateEventTimes(clientY, true)
            if (times) {
                const f = (n: number) => n.toString().padStart(2, '0')
                onAddEvent({
                    startTime: `${f(times.startHour)}:${f(times.startMinute)}`,
                    endTime: `${f(times.endHour)}:${f(times.endMinute)}`,
                    day: getActualDay(dragStartRef.current.dayIndex, weekStartsOnSunday)
                })
            }
        }
        setCreatingEvent(null)
        dragStartRef.current = null
        isTouchRef.current = false
    }, [onAddEvent, calculateEventTimes])

    // Mouse up handler
    const handleGlobalMouseUp = useCallback((e: MouseEvent) => {
        if (isTouchRef.current) return
        handleEnd(e.clientY)
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
    }, [handleEnd, handleGlobalMouseMove])

    // Touch end handler
    const handleGlobalTouchEnd = useCallback((e: TouchEvent) => {
        if (!isTouchRef.current) return
        // Use the last known touch position or the original position
        const clientY = e.changedTouches[0]?.clientY ?? dragStartRef.current?.originalClickY ?? 0
        handleEnd(clientY)
        document.removeEventListener('touchmove', handleGlobalTouchMove)
        document.removeEventListener('touchend', handleGlobalTouchEnd)
        document.removeEventListener('touchcancel', handleGlobalTouchEnd)
    }, [handleEnd, handleGlobalTouchMove])

    // Clean up event listeners
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove)
            document.removeEventListener('mouseup', handleGlobalMouseUp)
            document.removeEventListener('touchmove', handleGlobalTouchMove)
            document.removeEventListener('touchend', handleGlobalTouchEnd)
            document.removeEventListener('touchcancel', handleGlobalTouchEnd)
        }
    }, [handleGlobalMouseMove, handleGlobalMouseUp, handleGlobalTouchMove, handleGlobalTouchEnd])

    // Common start handler logic
    const initDrag = useCallback((clientY: number, cellTop: number, hour: number, dayIndex: number) => {
        const startH = hour
        const startM = 0

        dragStartRef.current = { y: cellTop, originalClickY: clientY, hour: startH, minute: startM, dayIndex }

        // Initial state with 1 hour duration
        const startTotal = startH * 60 + startM
        const endTotal = startTotal + 60

        setCreatingEvent({
            startHour: startH,
            startMinute: startM,
            endHour: Math.floor(endTotal / 60),
            endMinute: Math.floor(endTotal % 60),
            dayIndex
        })
    }, [])

    // Mouse down handler
    const handleGridMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, hour: number, dayIndex: number, isDraggingEvent: boolean) => {
        // Only allow left click (button 0)
        if (e.button !== 0 || !onAddEvent || isDraggingEvent) return

        isTouchRef.current = false
        const rect = e.currentTarget.getBoundingClientRect()
        initDrag(e.clientY, rect.top, hour, dayIndex)

        // Global listeners for drag and drop
        document.addEventListener('mousemove', handleGlobalMouseMove)
        document.addEventListener('mouseup', handleGlobalMouseUp)
    }, [onAddEvent, initDrag, handleGlobalMouseMove, handleGlobalMouseUp])

    // Touch start handler
    const handleGridTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>, hour: number, dayIndex: number, isDraggingEvent: boolean) => {
        if (e.touches.length !== 1 || !onAddEvent || isDraggingEvent) return

        isTouchRef.current = true
        const touch = e.touches[0]
        const rect = e.currentTarget.getBoundingClientRect()
        initDrag(touch.clientY, rect.top, hour, dayIndex)

        // Global listeners for touch drag
        document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
        document.addEventListener('touchend', handleGlobalTouchEnd)
        document.addEventListener('touchcancel', handleGlobalTouchEnd)
    }, [onAddEvent, initDrag, handleGlobalTouchMove, handleGlobalTouchEnd])

    return {
        creatingEvent,
        handleGridMouseDown,
        handleGridTouchStart
    }
}
