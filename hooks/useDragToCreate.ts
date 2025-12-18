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
    const dragStartRef = useRef<{ y: number; hour: number; minute: number; dayIndex: number } | null>(null)

    const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
        if (!dragStartRef.current) return

        const start = dragStartRef.current
        const pixelsPerMinute = rowHeight / 60
        const deltaY = e.clientY - start.y
        const deltaMinutes = Math.round((deltaY / pixelsPerMinute) / timeIncrement) * timeIncrement

        let endTotal = (start.hour * 60 + start.minute) + deltaMinutes
        const startTotal = start.hour * 60 + start.minute

        // Ensure end is at least start + increment (default to 60 mins if dragged backwards/clicked)
        if (endTotal <= startTotal) {
            endTotal = startTotal + 60
        }

        const endHour = Math.floor(endTotal / 60)
        const endMinute = Math.floor(endTotal % 60)

        setCreatingEvent(prev => prev ? { ...prev, endHour, endMinute } : null)

    }, [rowHeight, timeIncrement])

    const handleGlobalMouseUp = useCallback((e: MouseEvent) => {
        if (dragStartRef.current && onAddEvent) {
            const start = dragStartRef.current
            // Recalculate final times to avoid stale state closure issues
            const pixelsPerMinute = rowHeight / 60
            const deltaY = e.clientY - start.y
            const deltaMinutes = Math.round((deltaY / pixelsPerMinute) / timeIncrement) * timeIncrement

            let endTotal = (start.hour * 60 + start.minute) + deltaMinutes
            const startTotal = start.hour * 60 + start.minute

            if (endTotal <= startTotal) {
                endTotal = startTotal + 60
            }

            const endHour = Math.floor(endTotal / 60)
            const endMinute = Math.floor(endTotal % 60)

            // Format times
            const f = (n: number) => n.toString().padStart(2, '0')
            onAddEvent({
                startTime: `${f(start.hour)}:${f(start.minute)}`,
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
        if (!onAddEvent || isDraggingEvent) return

        // Calculate minute based on click position within the cell
        const rect = e.currentTarget.getBoundingClientRect()
        const clickY = e.clientY - rect.top
        const pixelsPerMinute = rowHeight / 60
        // Snap to increment
        const rawMinute = clickY / pixelsPerMinute
        const minute = Math.floor(rawMinute / timeIncrement) * timeIncrement

        const startH = hour
        const startM = minute

        dragStartRef.current = { y: e.clientY, hour: startH, minute: startM, dayIndex }

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
