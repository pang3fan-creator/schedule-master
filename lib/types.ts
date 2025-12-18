export type EventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'orange' | 'teal'

export interface Event {
    id: string
    title: string
    description: string
    day: number
    date: string // YYYY-MM-DD format for specific date filtering
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
    color?: EventColor // Optional, defaults to 'blue'
    builderType?: string // 'schedule-builder' | 'employee-schedule' | etc.
}

// Color configuration for event styling
export const EVENT_COLORS: Record<EventColor, { bg: string; border: string; text: string; textSecondary: string }> = {
    blue: { bg: 'bg-blue-500/15', border: 'border-blue-500', text: 'text-blue-700', textSecondary: 'text-blue-600' },
    green: { bg: 'bg-green-500/15', border: 'border-green-500', text: 'text-green-700', textSecondary: 'text-green-600' },
    red: { bg: 'bg-red-500/15', border: 'border-red-500', text: 'text-red-700', textSecondary: 'text-red-600' },
    yellow: { bg: 'bg-yellow-500/15', border: 'border-yellow-500', text: 'text-yellow-700', textSecondary: 'text-yellow-600' },
    purple: { bg: 'bg-purple-500/15', border: 'border-purple-500', text: 'text-purple-700', textSecondary: 'text-purple-600' },
    pink: { bg: 'bg-pink-500/15', border: 'border-pink-500', text: 'text-pink-700', textSecondary: 'text-pink-600' },
    orange: { bg: 'bg-orange-500/15', border: 'border-orange-500', text: 'text-orange-700', textSecondary: 'text-orange-600' },
    teal: { bg: 'bg-teal-500/15', border: 'border-teal-500', text: 'text-teal-700', textSecondary: 'text-teal-600' },
}
