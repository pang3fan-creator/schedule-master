import { useState, useRef, useCallback, useEffect } from "react"

interface UseDragToCreateProps {
    onAddEvent?: (data: { startTime: string; endTime: string; day: number }) => void
    rowHeight: number
    timeIncrement: number
}

interface CreatingEvent {
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
    dayIndex: number
}

export function useDragToCreate({ onAddEvent, rowHeight, timeIncrement }: UseDragToCreateProps) {
    const [creatingEvent, setCreatingEvent] = useState<CreatingEvent | null>(null)
    const dragStartRef = useRef<{ y: number; originalClickY: number; hour: number; minute: number; dayIndex: number } | null>(null)

    const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
        if (!dragStartRef.current) return

        // Prevent jitter/shrinking on small moves (threshold 10px)
        if (Math.abs(e.clientY - dragStartRef.current.originalClickY) < 10) return

        const start = dragStartRef.current
        const pixelsPerMinute = rowHeight / 60
        const deltaY = e.clientY - start.y
        const deltaMinutes = Math.round((deltaY / pixelsPerMinute) / timeIncrement) * timeIncrement

        const originalStartTotal = start.hour * 60 + start.minute
        const currentTotal = originalStartTotal + deltaMinutes

        let startTotal: number
        let endTotal: number

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

        // Clamp to valid hours (0-24)
        if (startTotal < 0) startTotal = 0
        if (endTotal > 24 * 60) endTotal = 24 * 60

        setCreatingEvent(prev => prev ? {
            ...prev,
            startHour: Math.floor(startTotal / 60),
            startMinute: Math.floor(startTotal % 60),
            endHour: Math.floor(endTotal / 60),
            endMinute: Math.floor(endTotal % 60),
        } : null)

    }, [rowHeight, timeIncrement])

    const handleGlobalMouseUp = useCallback((e: MouseEvent) => {
        if (dragStartRef.current && onAddEvent) {
            const start = dragStartRef.current
            const pixelsPerMinute = rowHeight / 60
            const deltaY = e.clientY - start.y
            const deltaMinutes = Math.round((deltaY / pixelsPerMinute) / timeIncrement) * timeIncrement

            const originalStartTotal = start.hour * 60 + start.minute
            const currentTotal = originalStartTotal + deltaMinutes

            let startTotal: number
            let endTotal: number

            // Check if it was a click (small movement) or drag
            const isClick = Math.abs(e.clientY - start.originalClickY) < 10

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

            // Clamp to valid hours (0-24)
            if (startTotal < 0) startTotal = 0
            if (endTotal > 24 * 60) endTotal = 24 * 60

            const endHour = Math.floor(endTotal / 60)
            const endMinute = Math.floor(endTotal % 60)
            const startHour = Math.floor(startTotal / 60)
            const startMinute = Math.floor(startTotal % 60)

            // Format times
            const f = (n: number) => n.toString().padStart(2, '0')
            onAddEvent({
                startTime: `${f(startHour)}:${f(startMinute)}`,
                endTime: `${f(endHour)}:${f(endMinute)}`,
                day: start.dayIndex
            })
        }
        setCreatingEvent(null)
        dragStartRef.current = null
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
    }, [onAddEvent, rowHeight, timeIncrement, handleGlobalMouseMove])

    // Clean up event listeners
    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove)
            document.removeEventListener('mouseup', handleGlobalMouseUp)
        }
    }, [handleGlobalMouseMove, handleGlobalMouseUp])

    const handleGridMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, hour: number, dayIndex: number, isDraggingEvent: boolean) => {
        // Only allow left click (button 0)
        if (e.button !== 0 || !onAddEvent || isDraggingEvent) return

        // Always snap to start of hour
        const startH = hour
        const startM = 0

        // Calculate minute based on click position within the cell
        const rect = e.currentTarget.getBoundingClientRect()

        // Adjust drag start Y to be the top of the cell (start of the hour)
        // This ensures dragging matches the cursor position relative to the start time
        dragStartRef.current = { y: rect.top, originalClickY: e.clientY, hour: startH, minute: startM, dayIndex }

        // Initial state with 1 hour duration
        const startTotal = startH * 60 + startM
        const endTotal = startTotal + 60 // Default to 1 hour

        setCreatingEvent({
            startHour: startH,
            startMinute: startM,
            endHour: Math.floor(endTotal / 60),
            endMinute: Math.floor(endTotal % 60),
            dayIndex
        })

        // Global listeners for drag and drop
        document.addEventListener('mousemove', handleGlobalMouseMove)
        document.addEventListener('mouseup', handleGlobalMouseUp)
    }, [onAddEvent, rowHeight, timeIncrement, handleGlobalMouseMove, handleGlobalMouseUp])

    return {
        creatingEvent,
        handleGridMouseDown
    }
}
