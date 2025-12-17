"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getTemplate, type TemplateData } from "@/lib/templates"
import { formatDateString } from "@/lib/time-utils"
import { EVENT_COLORS, type Event } from "@/lib/types"
import { ArrowLeft, Calendar, Play } from "lucide-react"
import Link from "next/link"

// Get week start date (Monday by default, Sunday if weekStartsOnSunday)
function getWeekStart(weekStartsOnSunday: boolean = false): Date {
    const d = new Date()
    const day = d.getDay()
    let diff: number
    if (weekStartsOnSunday) {
        diff = -day
    } else {
        diff = day === 0 ? -6 : 1 - day
    }
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
}

// Convert template events to full events with dates
function generateEventsFromTemplate(template: TemplateData): Event[] {
    const weekStart = getWeekStart(template.settings?.weekStartsOnSunday)

    return template.events.map((templateEvent, index) => {
        const eventDate = new Date(weekStart)
        eventDate.setDate(weekStart.getDate() + templateEvent.day)

        return {
            ...templateEvent,
            id: `template-${template.slug}-${index}`,
            date: formatDateString(eventDate),
        } as Event
    })
}

// Mini calendar preview component
function TemplatePreview({ template }: { template: TemplateData }) {
    const events = generateEventsFromTemplate(template)
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16]

    // Group events by day
    const eventsByDay = events.reduce((acc, event) => {
        if (!acc[event.day]) acc[event.day] = []
        acc[event.day].push(event)
        return acc
    }, {} as Record<number, Event[]>)

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="p-2 text-xs text-gray-400"></div>
                {days.map((day, i) => (
                    <div key={day} className="p-2 text-center text-xs font-medium text-gray-600 border-l border-gray-200">
                        {day}
                    </div>
                ))}
            </div>

            {/* Time grid */}
            <div className="grid grid-cols-8" style={{ gridTemplateRows: `repeat(${hours.length}, 32px)` }}>
                {hours.map((hour, hourIndex) => (
                    <>
                        {/* Hour label */}
                        <div key={`hour-${hour}`} className="p-1 text-xs text-gray-400 text-right pr-2 border-t border-gray-100">
                            {hour}:00
                        </div>

                        {/* Day cells */}
                        {days.map((_, dayIndex) => (
                            <div
                                key={`${hour}-${dayIndex}`}
                                className="relative border-l border-t border-gray-100"
                            >
                                {/* Render events that start at this hour */}
                                {hourIndex === 0 && eventsByDay[dayIndex]?.map((event) => {
                                    const startOffset = (event.startHour - 8) * 32
                                    const duration = ((event.endHour - event.startHour) + (event.endMinute - event.startMinute) / 60) * 32
                                    const colorConfig = EVENT_COLORS[event.color || 'blue']

                                    return (
                                        <div
                                            key={event.id}
                                            className={`absolute left-0.5 right-0.5 ${colorConfig.bg} ${colorConfig.border} border-l-2 rounded-sm z-10 overflow-hidden`}
                                            style={{
                                                top: `${startOffset}px`,
                                                height: `${Math.max(duration - 2, 10)}px`,
                                            }}
                                        >
                                            <span className={`text-[8px] ${colorConfig.text} p-0.5 block truncate`}>
                                                {event.title}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </>
                ))}
            </div>
        </div>
    )
}

interface TemplateDetailClientProps {
    slug: string
}

export function TemplateDetailClient({ slug }: TemplateDetailClientProps) {
    const router = useRouter()
    const [template, setTemplate] = useState<TemplateData | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const t = getTemplate(slug)
        if (t) {
            setTemplate(t)
        }
    }, [slug])

    const handleUseTemplate = () => {
        if (!template) return
        setIsLoading(true)

        // Generate events with current week dates
        const events = generateEventsFromTemplate(template)

        // Save to localStorage
        localStorage.setItem("schedule-builder-events", JSON.stringify(events))

        // Apply template settings if available
        if (template.settings) {
            const currentSettings = localStorage.getItem("schedule-builder-settings")
            const settings = currentSettings ? JSON.parse(currentSettings) : {}
            const newSettings = { ...settings, ...template.settings }
            localStorage.setItem("schedule-builder-settings", JSON.stringify(newSettings))
        }

        // Navigate to main editor
        router.push("/")
    }

    if (!template) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
                        <Link href="/templates" className="text-blue-600 hover:underline">
                            ← Back to Templates
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1">
                {/* Back link */}
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/templates"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Templates
                    </Link>
                </div>

                {/* Template header */}
                <section className="bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4 py-12">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                                    {template.category}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                                    {template.title}
                                </h1>
                                <p className="text-lg text-gray-600 mt-4 max-w-2xl">
                                    {template.longDescription}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    size="lg"
                                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                                    onClick={handleUseTemplate}
                                    disabled={isLoading}
                                >
                                    <Play className="size-5" />
                                    {isLoading ? "Loading..." : "Use This Template"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Template preview */}
                <section className="container mx-auto px-4 py-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Calendar className="size-5" />
                        Template Preview
                    </h2>
                    <TemplatePreview template={template} />

                    <p className="text-sm text-gray-500 mt-4 text-center">
                        This preview shows sample events. When you use this template, events will be scheduled for the current week.
                    </p>
                </section>

                {/* Features */}
                <section className="bg-white border-t border-gray-100">
                    <div className="container mx-auto px-4 py-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            What's Included
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="p-4 rounded-lg bg-gray-50">
                                <h3 className="font-medium text-gray-900 mb-2">Pre-configured Events</h3>
                                <p className="text-sm text-gray-600">
                                    {template.events.length} sample events with appropriate colors and timing
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50">
                                <h3 className="font-medium text-gray-900 mb-2">Optimized Settings</h3>
                                <p className="text-sm text-gray-600">
                                    Time format and working hours configured for this use case
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50">
                                <h3 className="font-medium text-gray-900 mb-2">Fully Customizable</h3>
                                <p className="text-sm text-gray-600">
                                    Edit, add, or remove events after applying the template
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
