"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import type { Event } from "@/lib/types"
import { calculateDraggedTime } from "@/lib/time-utils"

interface DragState {
    eventId: string | null
    startY: number
    originalEvent: Event | null
    currentOffset: number
}

interface UseEventDragOptions {
    onEventUpdate?: (updatedEvent: Event, skipConflictCheck?: boolean) => void
    rowHeight: number
    minHour?: number
    maxHour?: number
    events?: Event[]  // All events for collision detection
    timeIncrement?: number  // Snap to this many minutes (5, 15, 30, or 60)
}

interface UseEventDragReturn {
    dragState: DragState
    handleMouseDown: (e: React.MouseEvent, event: Event) => void
    handleTouchStart: (e: React.TouchEvent, event: Event) => void
    getVisualPosition: (event: Event) => { top: string; height: string }
    getDisplayTime: (event: Event) => {
        startHour: number
        startMinute: number
        endHour: number
        endMinute: number
    }
}


/**
 * Custom hook for handling event drag operations
 * Supports both mouse and touch events with real-time collision prevention
 */
export function useEventDrag({
    onEventUpdate,
    rowHeight,
    minHour = 8,
    maxHour = 17,
    events = [],
    timeIncrement = 5,
}: UseEventDragOptions): UseEventDragReturn {
    const [dragState, setDragState] = useState<DragState>({
        eventId: null,
        startY: 0,
        originalEvent: null,
        currentOffset: 0,
    })

    // Track if we're using touch
    const isTouchRef = useRef(false)
    // Track max/min allowed offsets due to collisions
    const collisionBoundsRef = useRef<{ minOffset: number; maxOffset: number }>({
        minOffset: -Infinity,
        maxOffset: Infinity,
    })

    // Calculate collision bounds when drag starts
    const calculateCollisionBounds = useCallback((event: Event) => {
        const sameDateEvents = events.filter(
            (e) => e.id !== event.id && e.date === event.date
        )

        let minOffset = -Infinity
        let maxOffset = Infinity
        const eventDurationMinutes = (event.endHour * 60 + event.endMinute) -
            (event.startHour * 60 + event.startMinute)
        const eventStartMinutes = event.startHour * 60 + event.startMinute

        for (const other of sameDateEvents) {
            const otherStartMinutes = other.startHour * 60 + other.startMinute
            const otherEndMinutes = other.endHour * 60 + other.endMinute

            if (otherEndMinutes <= eventStartMinutes) {
                // This event is above the dragged event
                // Can't drag up past where our start would overlap with their end
                const minStartMinutes = otherEndMinutes
                const minOffsetMinutes = minStartMinutes - eventStartMinutes
                const offsetPx = (minOffsetMinutes / 60) * rowHeight
                minOffset = Math.max(minOffset, offsetPx)
            } else if (otherStartMinutes >= eventStartMinutes + eventDurationMinutes) {
                // This event is below the dragged event
                // Can't drag down past where our end would overlap with their start
                const maxEndMinutes = otherStartMinutes
                const maxStartMinutes = maxEndMinutes - eventDurationMinutes
                const maxOffsetMinutes = maxStartMinutes - eventStartMinutes
                const offsetPx = (maxOffsetMinutes / 60) * rowHeight
                maxOffset = Math.min(maxOffset, offsetPx)
            }
        }

        // Also clamp to min/max hours
        const minStartOffsetMinutes = (minHour * 60) - eventStartMinutes
        const maxStartOffsetMinutes = ((maxHour * 60) - eventDurationMinutes) - eventStartMinutes
        minOffset = Math.max(minOffset, (minStartOffsetMinutes / 60) * rowHeight)
        maxOffset = Math.min(maxOffset, (maxStartOffsetMinutes / 60) * rowHeight)

        return { minOffset, maxOffset }
    }, [events, rowHeight, minHour, maxHour])

    // Handle mouse down on event card
    const handleMouseDown = useCallback((e: React.MouseEvent, event: Event) => {
        e.preventDefault()
        e.stopPropagation()
        isTouchRef.current = false

        // Calculate collision bounds when drag starts
        collisionBoundsRef.current = calculateCollisionBounds(event)

        setDragState({
            eventId: event.id,
            startY: e.clientY,
            originalEvent: event,
            currentOffset: 0,
        })
    }, [calculateCollisionBounds])

    // Handle touch start on event card
    const handleTouchStart = useCallback((e: React.TouchEvent, event: Event) => {
        if (e.touches.length !== 1) return
        e.stopPropagation()
        isTouchRef.current = true

        // Calculate collision bounds when drag starts
        collisionBoundsRef.current = calculateCollisionBounds(event)

        const touch = e.touches[0]
        setDragState({
            eventId: event.id,
            startY: touch.clientY,
            originalEvent: event,
            currentOffset: 0,
        })
    }, [calculateCollisionBounds])

    // Handle mouse/touch move
    useEffect(() => {
        if (!dragState.eventId) return

        const handleMouseMove = (e: MouseEvent) => {
            if (isTouchRef.current) return
            let offsetY = e.clientY - dragState.startY
            // Clamp to collision bounds
            offsetY = Math.max(collisionBoundsRef.current.minOffset,
                Math.min(collisionBoundsRef.current.maxOffset, offsetY))
            setDragState((prev) => ({ ...prev, currentOffset: offsetY }))
        }

        const handleTouchMove = (e: TouchEvent) => {
            if (!isTouchRef.current) return
            if (e.touches.length !== 1) return
            e.preventDefault() // Prevent scrolling while dragging
            const touch = e.touches[0]
            let offsetY = touch.clientY - dragState.startY
            // Clamp to collision bounds
            offsetY = Math.max(collisionBoundsRef.current.minOffset,
                Math.min(collisionBoundsRef.current.maxOffset, offsetY))
            setDragState((prev) => ({ ...prev, currentOffset: offsetY }))
        }

        const handleEnd = () => {
            if (dragState.originalEvent && dragState.currentOffset !== 0 && onEventUpdate) {
                const newTimes = calculateDraggedTime(
                    dragState.originalEvent.startHour,
                    dragState.originalEvent.startMinute,
                    dragState.originalEvent.endHour,
                    dragState.originalEvent.endMinute,
                    dragState.currentOffset,
                    rowHeight,
                    minHour,
                    maxHour,
                    timeIncrement
                )
                // Pass true to skip conflict check since we already prevented conflicts during drag
                onEventUpdate({
                    ...dragState.originalEvent,
                    ...newTimes,
                }, true)
            }
            setDragState({
                eventId: null,
                startY: 0,
                originalEvent: null,
                currentOffset: 0,
            })
            isTouchRef.current = false
        }

        // Add listeners
        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleEnd)
        window.addEventListener("touchmove", handleTouchMove, { passive: false })
        window.addEventListener("touchend", handleEnd)
        window.addEventListener("touchcancel", handleEnd)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleEnd)
            window.removeEventListener("touchmove", handleTouchMove)
            window.removeEventListener("touchend", handleEnd)
            window.removeEventListener("touchcancel", handleEnd)
        }
    }, [dragState.eventId, dragState.startY, dragState.originalEvent, dragState.currentOffset, onEventUpdate, rowHeight, minHour, maxHour, timeIncrement])

    // Get visual position during drag
    const getVisualPosition = useCallback(
        (event: Event): { top: string; height: string } => {
            const startOffset = (event.startHour - minHour) + event.startMinute / 60
            const endOffset = (event.endHour - minHour) + event.endMinute / 60
            const duration = endOffset - startOffset
            const verticalOffset = 4  // Small offset for better visual alignment

            if (dragState.eventId === event.id && dragState.originalEvent) {
                const newTimes = calculateDraggedTime(
                    dragState.originalEvent.startHour,
                    dragState.originalEvent.startMinute,
                    dragState.originalEvent.endHour,
                    dragState.originalEvent.endMinute,
                    dragState.currentOffset,
                    rowHeight,
                    minHour,
                    maxHour,
                    timeIncrement
                )
                const tempEvent = { ...event, ...newTimes }
                const newStartOffset = (tempEvent.startHour - minHour) + tempEvent.startMinute / 60
                const newEndOffset = (tempEvent.endHour - minHour) + tempEvent.endMinute / 60
                const newDuration = newEndOffset - newStartOffset
                return {
                    top: `${newStartOffset * rowHeight + verticalOffset}px`,
                    height: `${Math.max(newDuration * rowHeight - 8, 20)}px`,
                }
            }

            return {
                top: `${startOffset * rowHeight + verticalOffset}px`,
                height: `${Math.max(duration * rowHeight - 8, 20)}px`,
            }
        },
        [dragState, rowHeight, minHour, maxHour, timeIncrement]
    )

    // Get display time (for showing during drag)
    const getDisplayTime = useCallback(
        (event: Event) => {
            if (dragState.eventId === event.id && dragState.originalEvent) {
                return calculateDraggedTime(
                    dragState.originalEvent.startHour,
                    dragState.originalEvent.startMinute,
                    dragState.originalEvent.endHour,
                    dragState.originalEvent.endMinute,
                    dragState.currentOffset,
                    rowHeight,
                    minHour,
                    maxHour,
                    timeIncrement
                )
            }
            return {
                startHour: event.startHour,
                startMinute: event.startMinute,
                endHour: event.endHour,
                endMinute: event.endMinute,
            }
        },
        [dragState, rowHeight, minHour, maxHour, timeIncrement]
    )

    return {
        dragState,
        handleMouseDown,
        handleTouchStart,
        getVisualPosition,
        getDisplayTime,
    }
}
