"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { PageLayout } from "@/components/PageLayout"
import { Button } from "@/components/ui/button"
import { getTemplate, type TemplateData } from "@/lib/templates"
import { getTemplateTranslation } from "@/lib/templates-translations"
import { formatDateString } from "@/lib/time-utils"
import { EVENT_COLORS, type Event } from "@/lib/types"
import { Play, Crown, RotateCcw, Sparkles } from "lucide-react"
import Link from "next/link"
import { useSubscription } from "@/components/SubscriptionContext"
import { UpgradeModal } from "@/components/UpgradeModal"
import { Breadcrumb } from "@/components/Breadcrumb"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { hasDataToResetFromStorage } from "@/components/ResetButton"
import { EVENTS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from "@/lib/storage-keys"
import { useSettings, DEFAULT_SETTINGS } from "@/components/SettingsContext"

// Get the date of a specific day of the week for the current week
function getDateForDayOfWeek(dayOfWeek: number): Date {
    const today = new Date()
    const currentDayOfWeek = today.getDay()
    const diff = dayOfWeek - currentDayOfWeek
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + diff)
    targetDate.setHours(0, 0, 0, 0)
    return targetDate
}

// Convert template events to full events with dates
function generateEventsFromTemplate(template: TemplateData, events: Omit<Event, "id" | "date">[]): Event[] {
    return events.map((templateEvent, index) => {
        const eventDate = getDateForDayOfWeek(templateEvent.day)
        return {
            ...templateEvent,
            id: `template-${template.slug}-${index}`,
            date: formatDateString(eventDate),
        } as Event
    })
}

// Mini calendar preview component
function TemplatePreview({ template, events }: { template: TemplateData, events: Omit<Event, "id" | "date">[] }) {
    const t = useTranslations('Templates')
    const weekStartsOnSunday = template.settings?.weekStartsOnSunday ?? true

    const dayOrder = weekStartsOnSunday
        ? [0, 1, 2, 3, 4, 5, 6]
        : [1, 2, 3, 4, 5, 6, 0]
    const days = weekStartsOnSunday
        ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const startHour = template.settings?.workingHoursStart ?? 8
    const endHour = template.settings?.workingHoursEnd ?? 17
    const use12HourFormat = template.settings?.use12HourFormat ?? false

    const hours: number[] = []
    for (let h = startHour; h <= endHour; h++) {
        hours.push(h)
    }

    const formatHour = (hour: number): string => {
        if (use12HourFormat) {
            if (hour === 0) return "12 AM"
            if (hour === 12) return "12 PM"
            if (hour < 12) return `${hour} AM`
            return `${hour - 12} PM`
        }
        return `${hour}:00`
    }

    const eventsBySemanticDay = events.reduce((acc, event, index) => {
        if (!acc[event.day]) acc[event.day] = []
        acc[event.day].push({ ...event, id: `template-${template.slug}-${index}` } as Event)
        return acc
    }, {} as Record<number, Event[]>)

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800/80 relative">
            {/* AI Overlay for empty templates */}
            {events.length === 0 && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-violet-50/90 dark:from-violet-950/90 to-blue-50/90 dark:to-blue-950/90 backdrop-blur-[1px]">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
                            <Sparkles className="size-8 text-white" />
                        </div>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">{t('preview.aiTitle')}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('preview.aiSubtitle')}</p>
                    </div>
                </div>
            )}

            {/* Day headers */}
            <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
                <div className="p-2 text-xs text-gray-400 dark:text-gray-500"></div>
                {days.map((day) => (
                    <div key={day} className="p-2 text-center text-xs font-medium text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700">
                        {day}
                    </div>
                ))}
            </div>

            {/* Time grid */}
            <div className="grid grid-cols-8" style={{ gridTemplateRows: `repeat(${hours.length}, 32px)` }}>
                {hours.map((hour, hourIndex) => (
                    <React.Fragment key={hour}>
                        <div key={`hour-${hour}`} className="p-1 text-xs text-gray-400 dark:text-gray-500 text-right pr-2 border-t border-gray-200 dark:border-gray-700">
                            {formatHour(hour)}
                        </div>

                        {days.map((_, dayIndex) => {
                            const semanticDay = dayOrder[dayIndex]
                            return (
                                <div
                                    key={`${hour}-${dayIndex}`}
                                    className="relative border-l border-t border-gray-200 dark:border-gray-700"
                                >
                                    {hourIndex === 0 && eventsBySemanticDay[semanticDay]?.map((event) => {
                                        const startOffset = (event.startHour - startHour) * 32
                                        const duration = ((event.endHour - event.startHour) + (event.endMinute - event.startMinute) / 60) * 32
                                        const colorConfig = EVENT_COLORS[event.color || 'blue']

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
    locale: string
}

export function TemplateDetailClient({ slug, locale }: TemplateDetailClientProps) {
    const router = useRouter()
    const t = useTranslations('Templates')
    const { isPro } = useSubscription()
    const { settings } = useSettings()
    const [template, setTemplate] = useState<TemplateData | null>(null)
    const [translatedEvents, setTranslatedEvents] = useState<Omit<Event, "id" | "date">[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

    useEffect(() => {
        const t = getTemplate(slug)
        if (t) {
            setTemplate(t)
            // Merge translations
            const translation = getTemplateTranslation(slug, locale)
            if (translation?.events && translation.events.length === t.events.length) {
                const merged = t.events.map((event, index) => ({
                    ...event,
                    title: translation.events![index].title || event.title,
                    description: translation.events![index].description || event.description
                }))
                setTranslatedEvents(merged)
            } else {
                setTranslatedEvents(t.events)
            }
        }
    }, [slug, locale])

    // Generate URLs based on locale
    const getTemplatesUrl = () => locale === 'en' ? '/templates' : `/${locale}/templates`
    const getHomeUrl = () => '/'

    const handleUseTemplate = () => {
        if (!template) return

        if (template.requiresPro && !isPro) {
            setUpgradeModalOpen(true)
            return
        }

        if (hasDataToResetFromStorage(settings)) {
            setConfirmDialogOpen(true)
        } else {
            handleConfirmUseTemplate()
        }
    }

    const handleConfirmUseTemplate = () => {
        if (!template) return

        setIsLoading(true)

        const events = generateEventsFromTemplate(template, translatedEvents)
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))

        const newSettings = {
            ...DEFAULT_SETTINGS,
            ...template.settings,
            activeTemplateSlug: template.slug
        }
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings))

        if (template.slug === 'ai-schedule-builder') {
            localStorage.setItem('schedule-builder-should-open-ai-autofill', 'true')
        }

        setConfirmDialogOpen(false)
        router.push("/")
    }

    if (!template) {
        return (
            <PageLayout contentPadding="">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            {t('detail.notFound')}
                        </h1>
                        <Link href={getTemplatesUrl()} className="text-blue-600 dark:text-blue-400 hover:underline">
                            ← {t('detail.backToTemplates')}
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
                        { label: t('breadcrumb.home'), href: getHomeUrl() },
                        { label: t('breadcrumb.templates'), href: getTemplatesUrl() },
                        { label: getTemplateTranslation(template.slug, locale)?.title || template.title }
                    ]} />
                </div>

                {/* Page Title */}
                <div className="container mx-auto px-4 max-w-6xl text-center mt-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                        {getTemplateTranslation(template.slug, locale)?.title || template.title}
                    </h1>
                </div>

                {/* Template header and preview */}
                <section className="container mx-auto px-4 max-w-6xl mt-8">
                    <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div>
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                    {template.category}
                                </span>
                                {template.requiresPro && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white ml-2">
                                        <Crown className="size-2.5" />
                                        {t('badge.pro')}
                                    </span>
                                )}
                                <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
                                    {getTemplateTranslation(template.slug, locale)?.description || template.description}
                                </p>
                            </div>
                            <div className="shrink-0">
                                <Button
                                    size="lg"
                                    className="gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                    onClick={handleUseTemplate}
                                    disabled={isLoading}
                                >
                                    <Play className="size-5" />
                                    {isLoading ? t('detail.loading') : t('detail.useTemplate')}
                                </Button>
                            </div>
                        </div>

                        <TemplatePreview template={template} events={translatedEvents} />

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                            {template.slug === 'ai-schedule-builder'
                                ? t('detail.previewNoteAI')
                                : t('detail.previewNote')
                            }
                        </p>
                    </div>
                </section>

                {/* What's Included */}
                <section className="container mx-auto px-4 py-12 max-w-6xl">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
                        {t('detail.whatsIncluded')}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                {template.slug === 'ai-schedule-builder' ? t('detail.featureAIGeneration') : t('detail.featurePreConfigured')}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {template.slug === 'ai-schedule-builder'
                                    ? t('detail.featureAIGenerationDesc')
                                    : t('detail.featurePreConfiguredDesc', { count: translatedEvents.length })
                                }
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('detail.featureSettings')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t('detail.featureSettingsDesc')}
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('detail.featureCustomizable')}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t('detail.featureCustomizableDesc')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* About This Template */}
                <section className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
                        {t('detail.aboutTemplate')}
                    </h2>
                    <div className="bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 shadow-sm">
                        <div className="prose prose-gray max-w-none">
                            {(getTemplateTranslation(template.slug, locale)?.longDescription || template.longDescription).split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="text-gray-600 dark:text-gray-300 mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </section>
            </PageLayout>

            <UpgradeModal
                open={upgradeModalOpen}
                onOpenChange={setUpgradeModalOpen}
                feature={template.title}
            />

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
