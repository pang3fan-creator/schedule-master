import { useState, useEffect } from "react"

export function useCurrentTime() {
    // Initialize with null to avoid hydration mismatch, or current time
    const [currentTime, setCurrentTime] = useState<Date>(new Date())

    useEffect(() => {
        // Update immediately on mount
        setCurrentTime(new Date())

        // Update every minute
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)

        return () => clearInterval(interval)
    }, [])

    return currentTime
}
