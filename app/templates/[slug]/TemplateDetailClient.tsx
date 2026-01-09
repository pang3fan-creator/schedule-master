"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageLayout } from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { getTemplate, type TemplateData } from "@/lib/templates"
import { formatDateString } from "@/lib/time-utils"
import { EVENT_COLORS, type Event } from "@/lib/types"
import { ArrowLeft, Calendar, Play, ChevronDown, Crown, RotateCcw, Sparkles } from "lucide-react"
import Link from "next/link"
import { useSubscription } from "@/components/SubscriptionContext"
import { UpgradeModal } from "@/components/UpgradeModal"
import { FAQAccordion } from "@/components/FaqAccordion"
import { Breadcrumb } from "@/components/Breadcrumb"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { hasDataToResetFromStorage } from "@/components/ResetButton"
import { EVENTS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from "@/lib/storage-keys"
import { useSettings, DEFAULT_SETTINGS } from "@/components/SettingsContext"

// Get the date of a specific day of the week for the current week
// dayOfWeek: 0=Sunday, 1=Monday, 2=Tuesday, etc. (JavaScript standard)
function getDateForDayOfWeek(dayOfWeek: number): Date {
    const today = new Date()
    const currentDayOfWeek = today.getDay() // 0=Sunday, 1=Monday, etc.
    const diff = dayOfWeek - currentDayOfWeek
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + diff)
    targetDate.setHours(0, 0, 0, 0)
    return targetDate
}

// Convert template events to full events with dates
// Template events use semantic day values: 0=Sunday, 1=Monday, 2=Tuesday, etc.
// This is the JavaScript Date.getDay() standard and works regardless of weekStartsOnSunday setting
function generateEventsFromTemplate(template: TemplateData): Event[] {
    return template.events.map((templateEvent, index) => {
        const eventDate = getDateForDayOfWeek(templateEvent.day)

        return {
            ...templateEvent,
            id: `template-${template.slug}-${index}`,
            date: formatDateString(eventDate),
        } as Event
    })
}

// Mini calendar preview component
function TemplatePreview({ template }: { template: TemplateData }) {
    const weekStartsOnSunday = template.settings?.weekStartsOnSunday ?? true

    // Adjust days array based on weekStartsOnSunday setting
    // dayOrder maps column index to semantic day value (0=Sunday, 1=Monday, etc.)
    const dayOrder = weekStartsOnSunday
        ? [0, 1, 2, 3, 4, 5, 6]  // Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
        : [1, 2, 3, 4, 5, 6, 0]  // Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6, Sun=0
    const days = weekStartsOnSunday
        ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

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

    // Group events by semantic day value (0=Sunday, 1=Monday, etc.)
    // Use template.events directly since they contain the semantic day values
    const eventsBySemanticDay = template.events.reduce((acc, event, index) => {
        if (!acc[event.day]) acc[event.day] = []
        // Add id for rendering
        acc[event.day].push({ ...event, id: `template-${template.slug}-${index}` } as Event)
        return acc
    }, {} as Record<number, Event[]>)

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white relative">
            {/* AI Overlay for empty templates */}
            {template.events.length === 0 && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-violet-50/90 to-blue-50/90 backdrop-blur-[1px]">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
                            <Sparkles className="size-8 text-white" />
                        </div>
                        <p className="text-lg font-medium text-gray-700">Let AI create your perfect schedule</p>
                        <p className="text-sm text-gray-500 mt-1">Click "Use This Template" to get started</p>
                    </div>
                </div>
            )}

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
                        {days.map((_, dayIndex) => {
                            // Map column index to semantic day value using dayOrder
                            const semanticDay = dayOrder[dayIndex]
                            return (
                                <div
                                    key={`${hour}-${dayIndex}`}
                                    className="relative border-l border-t border-gray-100"
                                >
                                    {/* Render events that start at this hour */}
                                    {hourIndex === 0 && eventsBySemanticDay[semanticDay]?.map((event) => {
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
                            )
                        })}
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
    const { settings } = useSettings()
    const [template, setTemplate] = useState<TemplateData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

    useEffect(() => {
        const t = getTemplate(slug)
        if (t) {
            setTemplate(t)
        }
    }, [slug])

    const handleUseTemplate = () => {
        if (!template) return

        // Check if template requires Pro (paywall check BEFORE confirmation dialog)
        if (template.requiresPro && !isPro) {
            setUpgradeModalOpen(true)
            return
        }

        // Use shared reset check logic from ResetButton
        if (hasDataToResetFromStorage(settings)) {
            // Show confirmation dialog if there is data to reset
            setConfirmDialogOpen(true)
        } else {
            // Apply directly if everything is already at default/empty
            handleConfirmUseTemplate()
        }
    }

    const handleConfirmUseTemplate = () => {
        if (!template) return

        setIsLoading(true)

        // Generate events with current week dates
        const events = generateEventsFromTemplate(template)

        // Save to localStorage
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))

        // Apply template settings - start with DEFAULT_SETTINGS for a clean reset
        const newSettings = {
            ...DEFAULT_SETTINGS,
            ...template.settings,
            activeTemplateSlug: template.slug
        }
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings))

        // For AI Schedule Builder, set flag to auto-open AI Autofill dialog
        if (template.slug === 'ai-schedule-builder') {
            localStorage.setItem('schedule-builder-should-open-ai-autofill', 'true')
        }

        // Close dialog and navigate to main editor
        setConfirmDialogOpen(false)
        router.push("/")
    }

    if (!template) {
        return (
            <PageLayout contentPadding="">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
                        <Link href="/templates" className="text-blue-600 hover:underline">
                            ← Back to Templates
                        </Link>
                    </div>
                </div>
            </PageLayout>
        )
    }

    return (
        <>
            <PageLayout>
                {/* Breadcrumb Navigation */}
                <div className="container mx-auto px-4 max-w-6xl">
                    <Breadcrumb items={[
                        { label: "Home", href: "/" },
                        { label: "Templates", href: "/templates" },
                        { label: template.slug }
                    ]} />
                </div>

                {/* Page Title */}
                <div className="container mx-auto px-4 max-w-6xl text-center mt-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {template.title}
                    </h1>
                </div>

                {/* Template header and preview - combined */}
                <section className="container mx-auto px-4 max-w-6xl mt-8">
                    <div className="bg-gray-50 rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
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
                            {template.slug === 'ai-schedule-builder'
                                ? "This preview shows the AI generator canvas. When you use this template, our AI assistant will help you build your personalized schedule."
                                : "This preview shows sample events. When you use this template, events will be scheduled for the current week."
                            }
                        </p>
                    </div>
                </section>

                {/* What's Included */}
                <section className="container mx-auto px-4 py-12 max-w-6xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        What's Included
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl bg-gray-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                {template.slug === 'ai-schedule-builder' ? 'Smart AI Generation' : 'Pre-configured Events'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {template.slug === 'ai-schedule-builder'
                                    ? 'Access to the AI Autofill assistant to build your routine from scratch'
                                    : `${template.events.length} sample events with appropriate colors and timing`
                                }
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-gray-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-semibold text-gray-900 mb-2">Optimized Settings</h3>
                            <p className="text-sm text-gray-600">
                                Time format and working hours configured for this use case
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-gray-50 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
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
                    <div className="bg-gray-50 rounded-xl border border-slate-200 p-8 md:p-12 shadow-sm">
                        <div className="prose prose-gray max-w-none">
                            {template.longDescription.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="text-gray-600 mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            </PageLayout>

            {/* Upgrade Modal */}
            <UpgradeModal
                open={upgradeModalOpen}
                onOpenChange={setUpgradeModalOpen}
                feature={template.title}
            />

            {/* Confirm Use Template Dialog */}
            <ConfirmDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
                title="Reset Everything"
                description="This will clear all sidebar template features, restore your settings to default, and delete all events from the calendar. This action cannot be undone."
                icon={RotateCcw}
                confirmText="Yes, Reset"
                onConfirm={handleConfirmUseTemplate}
                variant="blue"
            />
        </>
    )
}
