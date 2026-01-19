"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Crown, Sparkles, X, Loader2, CheckCircle2, AlertCircle, Trash2, AlertTriangle, Lock } from "lucide-react"
import { type Event, type EventColor, EVENT_COLORS } from "@/lib/types"
import { useSettings } from "@/components/SettingsContext"
import { formatDateString, getDateForDay } from "@/lib/time-utils"
import { cn } from "@/lib/utils"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { EVENTS_STORAGE_KEY } from "@/lib/storage-keys"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface GeneratedEvent {
    title: string
    description: string
    day: number
    startHour: number
    startMinute: number
    endHour: number
    endMinute: number
    color: EventColor
}

interface AIAutofillDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAddEvents: (events: Omit<Event, "id">[]) => void
    weekStart: Date
    weekStartsOnSunday: boolean
    onReset: () => void
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function formatTime(hour: number, minute: number, t: any): string {
    const h = hour % 12 || 12
    const m = minute.toString().padStart(2, "0")
    const ampm = hour < 12 ? t('calendar.time.am') : t('calendar.time.pm')
    return `${h}:${m} ${ampm}`
}

export function AIAutofillDialog({
    open,
    onOpenChange,
    onAddEvents,
    weekStart,
    weekStartsOnSunday,
    onReset,
}: AIAutofillDialogProps) {
    const { settings, updateSettings } = useSettings()
    const t = useTranslations('AIAutofill')
    const tCommon = useTranslations('Common')
    const [prompt, setPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [generatedEvents, setGeneratedEvents] = useState<GeneratedEvent[]>([])
    const [inferredSettings, setInferredSettings] = useState<any>(null)
    const [usage, setUsage] = useState<{ used: number; limit: number; remaining: number; isPro: boolean } | null>(null)
    const [step, setStep] = useState<"input" | "preview">("input")
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    // Fetch usage on mount
    useEffect(() => {
        if (open) {
            fetchUsage()
        }
    }, [open])

    const fetchUsage = async () => {
        try {
            const res = await fetch("/api/ai/usage")
            if (res.ok) {
                const data = await res.json()
                setUsage({
                    ...data.usage,
                    isPro: data.isPro
                })
            }
        } catch (e) {
            console.error("Failed to fetch AI usage:", e)
        }
    }

    const handleGenerateClick = () => {
        if (!prompt.trim() || isLoading) return

        // Check for existing events to show confirmation
        const stored = localStorage.getItem(EVENTS_STORAGE_KEY)
        if (stored) {
            try {
                const events = JSON.parse(stored)
                if (Array.isArray(events) && events.length > 0) {
                    setShowConfirmDialog(true)
                    return
                }
            } catch (e) {
                console.error("Error parsing events for AI check", e)
            }
        }

        // No events, proceed directly
        generateSchedule()
    }

    const generateSchedule = async () => {
        if (!prompt.trim() || isLoading) return

        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/ai/autofill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: prompt.trim(),
                    workingHoursStart: settings.workingHoursStart,
                    workingHoursEnd: settings.workingHoursEnd,
                    weekStartsOnSunday: settings.weekStartsOnSunday,
                    use12HourFormat: settings.use12HourFormat,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.code === "USAGE_LIMIT_EXCEEDED") {
                    setError(usage?.isPro
                        ? t('errors.usageLimitExceededPro', { limit: data.limit || 100 })
                        : t('errors.usageLimitExceededFree')
                    )
                } else {
                    setError(data.error || t('errors.generationFailed'))
                }
                return
            }

            setGeneratedEvents(data.events || [])
            setInferredSettings(data.settings || null)
            setUsage({
                ...data.usage,
                isPro: usage?.isPro || false
            })
            setStep("preview")
        } catch (e) {
            console.error("AI generation error:", e)
            setError(t('errors.connectionError'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveEvent = (index: number) => {
        setGeneratedEvents(prev => prev.filter((_, i) => i !== index))
    }

    const handleConfirm = () => {
        if (generatedEvents.length === 0) return

        // Apply inferred settings if available
        if (inferredSettings) {
            updateSettings({
                weekStartsOnSunday: inferredSettings.weekStartsOnSunday,
                use12HourFormat: inferredSettings.use12HourFormat,
                showDates: inferredSettings.showDates,
                workingHoursStart: inferredSettings.workingHoursStart,
                workingHoursEnd: inferredSettings.workingHoursEnd,
                timeIncrement: inferredSettings.timeIncrement,
            })
        }

        // Convert generated events to the format expected by onAddEvents
        const eventsToAdd: Omit<Event, "id">[] = generatedEvents.map(event => {
            const eventDate = getDateForDay(weekStart, event.day)
            return {
                title: event.title,
                description: event.description,
                day: event.day,
                date: formatDateString(eventDate),
                startHour: event.startHour,
                startMinute: event.startMinute,
                endHour: event.endHour,
                endMinute: event.endMinute,
                color: event.color,
            }
        })

        onAddEvents(eventsToAdd)
        handleClose()
    }

    const handleClose = () => {
        setPrompt("")
        setError(null)
        setGeneratedEvents([])
        setInferredSettings(null)
        setStep("input")
        onOpenChange(false)
    }

    const handleBack = () => {
        setStep("input")
        setGeneratedEvents([])
        setInferredSettings(null)
    }

    // Group events by day for preview
    const eventsByDay = useMemo(() => {
        const grouped: Record<number, GeneratedEvent[]> = {}
        for (const event of generatedEvents) {
            if (!grouped[event.day]) grouped[event.day] = []
            grouped[event.day].push(event)
        }
        // Sort events by start time within each day
        for (const day of Object.keys(grouped)) {
            grouped[Number(day)].sort((a, b) => {
                return a.startHour * 60 + a.startMinute - (b.startHour * 60 + b.startMinute)
            })
        }
        return grouped
    }, [generatedEvents])

    const isLimitReached = usage?.remaining === 0

    const dayNames = [
        tCommon('calendar.daysShort.sun'),
        tCommon('calendar.daysShort.mon'),
        tCommon('calendar.daysShort.tue'),
        tCommon('calendar.daysShort.wed'),
        tCommon('calendar.daysShort.thu'),
        tCommon('calendar.daysShort.fri'),
        tCommon('calendar.daysShort.sat'),
    ]

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[520px] max-h-[85vh] p-0 gap-0 overflow-hidden flex flex-col bg-white dark:bg-gray-900" showCloseButton={false}>
                    {/* Header */}
                    <DialogHeader className="flex flex-row items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center text-white">
                                <Sparkles className="size-4" />
                            </div>
                            <div className="text-left">
                                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {t('title')}
                                </DialogTitle>
                                {usage && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {usage.isPro ? (
                                            t('usageRemaining', { remaining: usage.remaining, limit: usage.limit })
                                        ) : (
                                            <span className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
                                                <Sparkles className="size-3" />
                                                {t('trialRemaining', { remaining: usage.remaining })}
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 sm:size-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
                            onClick={handleClose}
                        >
                            <X className="size-4 sm:size-5" />
                        </Button>
                    </DialogHeader>

                    {/* Content */}
                    <div className="px-4 md:px-6 py-4 md:py-5 overflow-y-auto flex-1">
                        {step === "input" ? (
                            <div className="space-y-4">
                                {isLimitReached && !usage?.isPro ? (
                                    /* Trial Reached Paywall */
                                    <div className="py-6 text-center space-y-5">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                            <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="space-y-2 max-w-[320px] mx-auto">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('trialLimitReachedTitle')}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {t('trialLimitReachedDescription')}
                                            </p>
                                        </div>
                                        <div className="pt-2">
                                            <Button asChild className="w-full max-w-[280px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md text-white">
                                                <Link href="/pricing" className="flex items-center gap-2">
                                                    <Crown className="size-4" />
                                                    {t('upgradeToPro')}
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Normal Input */
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t('inputLabel')}
                                            </label>
                                            <Textarea
                                                placeholder={t('inputPlaceholder')}
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                className="min-h-[140px] resize-none bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                                maxLength={2000}
                                                disabled={isLimitReached}
                                            />
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                                                {prompt.length} / 2000
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-100 dark:border-red-800">
                                                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                        )}

                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-400">
                                            <p className="font-medium mb-1 text-gray-900 dark:text-gray-200">{t('tipsTitle')}</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs">
                                                <li>{t('tips.durations')}</li>
                                                <li>{t('tips.days')}</li>
                                                <li>{t('tips.ranges')}</li>
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
                                    <CheckCircle2 className="size-5" />
                                    <span className="font-medium">{t('previewTitle', { count: generatedEvents.length })}</span>
                                </div>

                                {Object.keys(eventsByDay).length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        {t('noEvents')}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {[0, 1, 2, 3, 4, 5, 6].map(day => {
                                            const events = eventsByDay[day]
                                            if (!events || events.length === 0) return null

                                            return (
                                                <div key={day}>
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {dayNames[day]}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {events.map((event, idx) => {
                                                            const colorStyles = EVENT_COLORS[event.color]
                                                            const globalIdx = generatedEvents.findIndex(e => e === event)

                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className={cn(
                                                                        "flex items-center justify-between p-3 rounded-lg border-l-4",
                                                                        colorStyles.bg,
                                                                        colorStyles.border
                                                                    )}
                                                                >
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className={cn("font-medium text-sm truncate", colorStyles.text)}>
                                                                            {event.title}
                                                                        </p>
                                                                        <p className={cn("text-xs", colorStyles.textSecondary)}>
                                                                            {formatTime(event.startHour, event.startMinute, tCommon)} - {formatTime(event.endHour, event.endMinute, tCommon)}
                                                                        </p>
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="size-7 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 shrink-0"
                                                                        onClick={() => handleRemoveEvent(globalIdx)}
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </Button>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
                        {step === "input" ? (
                            <>
                                <Button variant="outline" onClick={handleClose} className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    {isLimitReached && !usage?.isPro ? t('closeButton') : t('cancelButton')}
                                </Button>
                                {!isLimitReached || usage?.isPro ? (
                                    <Button
                                        onClick={handleGenerateClick}
                                        disabled={!prompt.trim() || isLoading || isLimitReached}
                                        className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white shadow-sm dark:from-violet-600 dark:to-blue-600 dark:hover:from-violet-500 dark:hover:to-blue-500"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="size-4 mr-2 animate-spin" />
                                                {t('generatingButton')}
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="size-4 mr-2" />
                                                {t('generateButton')}
                                            </>
                                        )}
                                    </Button>
                                ) : null}
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={handleBack} className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                                    {t('backButton')}
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    disabled={generatedEvents.length === 0}
                                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    <CheckCircle2 className="size-4 mr-2" />
                                    {t('addButton', { count: generatedEvents.length })}
                                </Button>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title={t('startFreshTitle')}
                description={t('startFreshDescription')}
                icon={AlertTriangle}
                iconClassName="size-5 text-amber-500"
                confirmText={t('startFreshConfirm')}
                onConfirm={() => {
                    onReset()
                    generateSchedule()
                }}
                variant="blue"
            />
        </>
    )
}
