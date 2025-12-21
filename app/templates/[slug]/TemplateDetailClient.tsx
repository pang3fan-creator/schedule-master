"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getTemplate, type TemplateData } from "@/lib/templates"
import { formatDateString } from "@/lib/time-utils"
import { EVENT_COLORS, type Event } from "@/lib/types"
import { ArrowLeft, Calendar, Play, ChevronDown, Crown } from "lucide-react"
import Link from "next/link"
import { useSubscription } from "@/components/SubscriptionContext"
import { UpgradeModal } from "@/components/UpgradeModal"
import { FAQAccordion } from "@/components/faq-accordion"

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

    // Get time range from template settings or use defaults
    const startHour = template.settings?.workingHoursStart ?? 8
    const endHour = template.settings?.workingHoursEnd ?? 17
    const use12HourFormat = template.settings?.use12HourFormat ?? false

    // Generate hours array dynamically based on settings (include endHour)
    const hours: number[] = []
    for (let h = startHour; h <= endHour; h++) {
        hours.push(h)
    }

    // Format hour based on template settings
    const formatHour = (hour: number): string => {
        if (use12HourFormat) {
            if (hour === 0) return "12 AM"
            if (hour === 12) return "12 PM"
            if (hour < 12) return `${hour} AM`
            return `${hour - 12} PM`
        }
        return `${hour}:00`
    }

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
                {days.map((day) => (
                    <div key={day} className="p-2 text-center text-xs font-medium text-gray-600 border-l border-gray-200">
                        {day}
                    </div>
                ))}
            </div>

            {/* Time grid */}
            <div className="grid grid-cols-8" style={{ gridTemplateRows: `repeat(${hours.length}, 32px)` }}>
                {hours.map((hour, hourIndex) => (
                    <React.Fragment key={hour}>
                        {/* Hour label */}
                        <div key={`hour-${hour}`} className="p-1 text-xs text-gray-400 text-right pr-2 border-t border-gray-100">
                            {formatHour(hour)}
                        </div>

                        {/* Day cells */}
                        {days.map((_, dayIndex) => (
                            <div
                                key={`${hour}-${dayIndex}`}
                                className="relative border-l border-t border-gray-100"
                            >
                                {/* Render events that start at this hour */}
                                {hourIndex === 0 && eventsByDay[dayIndex]?.map((event) => {
                                    // Use dynamic startHour for offset calculation
                                    const startOffset = (event.startHour - startHour) * 32
                                    const duration = ((event.endHour - event.startHour) + (event.endMinute - event.startMinute) / 60) * 32
                                    const colorConfig = EVENT_COLORS[event.color || 'blue']

                                    // Skip events that are outside the visible time range
                                    if (event.startHour < startHour || event.startHour >= endHour) {
                                        return null
                                    }

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
                    </React.Fragment>
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
    const { isPro } = useSubscription()
    const [template, setTemplate] = useState<TemplateData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

    useEffect(() => {
        const t = getTemplate(slug)
        if (t) {
            setTemplate(t)
        }
    }, [slug])

    const handleUseTemplate = () => {
        if (!template) return

        // Check if template requires Pro
        if (template.requiresPro && !isPro) {
            setUpgradeModalOpen(true)
            return
        }

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
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <Navbar />

            <main className="flex-1 py-16">
                {/* Back link */}
                <div className="container mx-auto px-4 max-w-6xl">
                    <Link
                        href="/templates"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Templates
                    </Link>
                </div>

                {/* Page Title */}
                <div className="container mx-auto px-4 max-w-6xl text-center mt-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {template.title}
                    </h1>
                </div>

                {/* Template header and preview - combined */}
                <section className="container mx-auto px-4 max-w-6xl mt-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                                    {template.category}
                                </span>
                                {template.requiresPro && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white ml-2">
                                        <Crown className="size-2.5" />
                                        PRO
                                    </span>
                                )}
                                <p className="text-gray-600 mt-2 max-w-2xl">
                                    {template.description}
                                </p>
                            </div>
                            <div className="shrink-0">
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

                        {/* Preview */}
                        <TemplatePreview template={template} />

                        <p className="text-sm text-gray-500 mt-4 text-center">
                            This preview shows sample events. When you use this template, events will be scheduled for the current week.
                        </p>
                    </div>
                </section>

                {/* What's Included */}
                <section className="container mx-auto px-4 py-12 max-w-6xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        What's Included
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl bg-white border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-2">Pre-configured Events</h3>
                            <p className="text-sm text-gray-600">
                                {template.events.length} sample events with appropriate colors and timing
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-white border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-2">Optimized Settings</h3>
                            <p className="text-sm text-gray-600">
                                Time format and working hours configured for this use case
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-white border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-2">Fully Customizable</h3>
                            <p className="text-sm text-gray-600">
                                Edit, add, or remove events after applying the template
                            </p>
                        </div>
                    </div>
                </section>

                {/* About This Template */}
                <section className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        About This Template
                    </h2>
                    <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
                        <div className="prose prose-gray max-w-none">
                            {template.longDescription.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="text-gray-600 mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>


            </main>

            <Footer />

            {/* Upgrade Modal */}
            <UpgradeModal
                open={upgradeModalOpen}
                onOpenChange={setUpgradeModalOpen}
                feature={template.title}
            />
        </div>
    )
}
