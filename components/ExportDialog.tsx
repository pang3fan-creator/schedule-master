"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Download, Image, FileText, Loader2, Crown, Table, X } from "lucide-react"
import { useSubscription } from "@/components/SubscriptionContext"
import { exportScheduleToImage, exportScheduleToPdf, exportScheduleToCsv, generateFilename, PdfEvent, PdfExportSettings } from "@/lib/export"
import { sendGAEvent } from "@next/third-parties/google"
import Link from "next/link"

interface ExportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    calendarRef: React.RefObject<HTMLDivElement | null>
    onExportStart?: () => void
    onExportEnd?: () => void
    // Data for vector PDF export
    events?: PdfEvent[]
    settings?: PdfExportSettings
    currentWeekStart?: Date
    viewMode?: 'week' | 'day'
    selectedDate?: Date
}

type ExportFormat = "png" | "jpg" | "pdf" | "csv"

export function ExportDialog({
    open,
    onOpenChange,
    calendarRef,
    onExportStart,
    onExportEnd,
    events = [],
    settings,
    currentWeekStart,
    viewMode = 'week',
    selectedDate
}: ExportDialogProps) {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("png")
    const [isExporting, setIsExporting] = useState(false)
    const { isPro } = useSubscription()
    const t = useTranslations('Export')

    const handleExport = async () => {
        if (!calendarRef.current) {
            console.error("Calendar reference not found")
            return
        }

        setIsExporting(true)

        // Trigger export mode in parent to re-render calendar without scroll constraints
        onExportStart?.()

        // Wait slightly longer for layout to stabilize (e.g. from 300ms to 500ms)
        await new Promise(resolve => setTimeout(resolve, 500))

        try {
            if (selectedFormat === "pdf") {
                // PDF export for Pro users only - Vector format
                if (!isPro) {
                    return
                }

                // Use vector PDF export with events data
                if (settings && currentWeekStart) {
                    await exportScheduleToPdf({
                        filename: generateFilename("schedule"),
                        events,
                        settings,
                        currentWeekStart,
                        viewMode,
                        selectedDate,
                    })
                } else {
                    console.error("Missing settings or currentWeekStart for PDF export")
                }
            } else if (selectedFormat === "csv") {
                // CSV/Excel export for Pro users only
                if (!isPro) {
                    return
                }

                if (settings) {
                    exportScheduleToCsv({
                        filename: generateFilename("schedule"),
                        events,
                        settings,
                    })
                } else {
                    console.error("Missing settings for CSV export")
                }
            } else {
                // PNG/JPG export for everyone (with watermark for free users)
                await exportScheduleToImage({
                    element: calendarRef.current,
                    filename: generateFilename("schedule"),
                    format: selectedFormat,
                    scale: 2,
                    watermark: !isPro ? "Created with TrySchedule.com" : undefined,
                })
            }
            onOpenChange(false)
            // Track export event in Google Analytics
            sendGAEvent('event', 'export_schedule', { format: selectedFormat, isPro: isPro })
        } catch (error) {
            console.error("Export failed:", error)
        } finally {
            setIsExporting(false)
            // Restore normal mode
            onExportEnd?.()
        }
    }

    const formatOptions = [
        {
            format: "png" as ExportFormat,
            label: "PNG",
            description: t('formats.png.description'),
            icon: Image,
            available: true,
        },
        {
            format: "jpg" as ExportFormat,
            label: "JPG",
            description: t('formats.jpg.description'),
            icon: Image,
            available: true,
        },
        {
            format: "pdf" as ExportFormat,
            label: "PDF",
            description: t('formats.pdf.description'),
            icon: FileText,
            available: isPro,
            proOnly: true,
        },
        {
            format: "csv" as ExportFormat,
            label: "CSV",
            description: t('formats.csv.description'),
            icon: Table,
            available: isPro,
            proOnly: true,
        },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-white dark:bg-gray-900" showCloseButton={false}>
                <DialogHeader className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <Download className="size-5" />
                            {t('title')}
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 sm:size-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="size-4 sm:size-5" />
                        </Button>
                    </div>
                    <DialogDescription className="text-left text-gray-600 dark:text-gray-400">
                        {t('description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-6">
                    <div className="space-y-4 pb-6">
                        <Label className="text-gray-900 dark:text-gray-100">{t('format')}</Label>
                        <div className="space-y-2">
                            {formatOptions.map((option) => (
                                <div
                                    key={option.format}
                                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${selectedFormat === option.format
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                        }`}
                                    onClick={() => setSelectedFormat(option.format)}
                                >
                                    <option.icon className={`size-5 ${selectedFormat === option.format ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                                        }`} />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-medium ${selectedFormat === option.format ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-gray-100"
                                                }`}>
                                                {option.label}
                                            </span>
                                            {option.proOnly && (
                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                                    <Crown className="size-2.5" />
                                                    PRO
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{option.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pro upgrade prompt for non-pro users */}
                        {!isPro && (selectedFormat === "pdf" || selectedFormat === "csv") && (
                            <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800 p-4">
                                <div className="flex items-start gap-3">
                                    <Crown className="size-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-amber-900 dark:text-amber-100">{t('upgradePrompt.title')}</p>
                                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                            {t('upgradePrompt.description')}
                                        </p>
                                        <Link href="/pricing">
                                            <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700">
                                                {t('upgradePrompt.button')}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            {t('buttons.cancel')}
                        </Button>
                        <Button
                            onClick={handleExport}
                            disabled={isExporting || (!isPro && (selectedFormat === "pdf" || selectedFormat === "csv"))}
                            className="gap-2 text-white"
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    {t('buttons.exporting')}
                                </>
                            ) : (
                                <>
                                    <Download className="size-4" />
                                    {t('buttons.download', { format: selectedFormat.toUpperCase() })}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
