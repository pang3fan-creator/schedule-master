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
    allowEventOverlap?: boolean  // Skip collision detection when true
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
    wasRecentlyDragged: boolean  // True briefly after drag ends, to prevent click from firing
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
    allowEventOverlap = false,
}: UseEventDragOptions): UseEventDragReturn {
    const [dragState, setDragState] = useState<DragState>({
        eventId: null,
        startY: 0,
        originalEvent: null,
        currentOffset: 0,
    })

    // Track if we recently completed a drag (to prevent click from firing)
    const [wasRecentlyDragged, setWasRecentlyDragged] = useState(false)

    // Track if we're using touch
    const isTouchRef = useRef(false)
    // Track if actual dragging has occurred (moved beyond threshold)
    const hasDraggedRef = useRef(false)
    // Drag threshold in pixels - movement less than this is considered a click
    const DRAG_THRESHOLD = 5
    // Track max/min allowed offsets due to collisions
    const collisionBoundsRef = useRef<{ minOffset: number; maxOffset: number }>({
        minOffset: -Infinity,
        maxOffset: Infinity,
    })

    // Calculate collision bounds when drag starts
    // When allowEventOverlap is true, only bound by min/max hours
    const calculateCollisionBounds = useCallback((event: Event) => {
        const eventDurationMinutes = (event.endHour * 60 + event.endMinute) -
            (event.startHour * 60 + event.startMinute)
        const eventStartMinutes = event.startHour * 60 + event.startMinute

        // Start with min/max hour bounds
        let minOffset = (((minHour * 60) - eventStartMinutes) / 60) * rowHeight
        let maxOffset = ((((maxHour * 60) - eventDurationMinutes) - eventStartMinutes) / 60) * rowHeight

        // Skip event collision detection if overlap is allowed
        if (allowEventOverlap) {
            return { minOffset, maxOffset }
        }

        // Check collisions with other events on the same date
        const sameDateEvents = events.filter(
            (e) => e.id !== event.id && e.date === event.date
        )

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

        return { minOffset, maxOffset }
    }, [events, rowHeight, minHour, maxHour, allowEventOverlap])

    // Handle mouse down on event card
    const handleMouseDown = useCallback((e: React.MouseEvent, event: Event) => {
        // Don't call e.preventDefault() to allow onClick to fire for clicks
        e.stopPropagation()
        isTouchRef.current = false
        hasDraggedRef.current = false  // Reset drag tracking

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
        hasDraggedRef.current = false  // Reset drag tracking

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
            const rawOffsetY = e.clientY - dragState.startY

            // Only start dragging if moved beyond threshold
            if (!hasDraggedRef.current && Math.abs(rawOffsetY) < DRAG_THRESHOLD) {
                return  // Still within click threshold, don't update offset
            }
            hasDraggedRef.current = true  // Mark as dragging

            // Clamp to collision bounds
            let offsetY = Math.max(collisionBoundsRef.current.minOffset,
                Math.min(collisionBoundsRef.current.maxOffset, rawOffsetY))
            setDragState((prev) => ({ ...prev, currentOffset: offsetY }))
        }

        const handleTouchMove = (e: TouchEvent) => {
            if (!isTouchRef.current) return
            if (e.touches.length !== 1) return
            const touch = e.touches[0]
            const rawOffsetY = touch.clientY - dragState.startY

            // Only start dragging if moved beyond threshold
            if (!hasDraggedRef.current && Math.abs(rawOffsetY) < DRAG_THRESHOLD) {
                return  // Still within click threshold, don't update offset
            }
            hasDraggedRef.current = true  // Mark as dragging
            e.preventDefault()  // Prevent scrolling only when actually dragging

            // Clamp to collision bounds
            let offsetY = Math.max(collisionBoundsRef.current.minOffset,
                Math.min(collisionBoundsRef.current.maxOffset, rawOffsetY))
            setDragState((prev) => ({ ...prev, currentOffset: offsetY }))
        }

        const handleEnd = () => {
            // Only update event if we actually dragged (not just clicked)
            if (hasDraggedRef.current && dragState.originalEvent && dragState.currentOffset !== 0 && onEventUpdate) {
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

            // If we actually dragged, set wasRecentlyDragged to prevent click from firing
            if (hasDraggedRef.current) {
                setWasRecentlyDragged(true)
                // Reset after a short delay (click event fires synchronously after mouseup)
                setTimeout(() => {
                    setWasRecentlyDragged(false)
                }, 100)
            }

            setDragState({
                eventId: null,
                startY: 0,
                originalEvent: null,
                currentOffset: 0,
            })
            isTouchRef.current = false
            hasDraggedRef.current = false
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
        wasRecentlyDragged,
    }
}
