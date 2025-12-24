"use client"

import { useState } from "react"
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
import { Download, Image, FileText, Loader2, Crown, Table } from "lucide-react"
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

    const handleExport = async () => {
        if (!calendarRef.current) {
            console.error("Calendar reference not found")
            return
        }

        setIsExporting(true)

        // Trigger export mode in parent to re-render calendar without scroll constraints
        onExportStart?.()

        // Wait for React to re-render with export mode (needs time for rowHeight to update)
        await new Promise(resolve => setTimeout(resolve, 300))

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
                    watermark: !isPro ? "www.TrySchedule.com" : undefined,
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
            description: "High quality image with transparency",
            icon: Image,
            available: true,
        },
        {
            format: "jpg" as ExportFormat,
            label: "JPG",
            description: "Compressed image, smaller file size",
            icon: Image,
            available: true,
        },
        {
            format: "pdf" as ExportFormat,
            label: "PDF",
            description: "Vector format, perfect for printing",
            icon: FileText,
            available: isPro,
            proOnly: true,
        },
        {
            format: "csv" as ExportFormat,
            label: "CSV",
            description: "Spreadsheet format for data analysis",
            icon: Table,
            available: isPro,
            proOnly: true,
        },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="size-5" />
                        Export Schedule
                    </DialogTitle>
                    <DialogDescription className="text-left">
                        Choose a format to download your schedule.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Label>Format</Label>
                    <div className="space-y-2">
                        {formatOptions.map((option) => (
                            <div
                                key={option.format}
                                className={`flex items-center gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${selectedFormat === option.format
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                                onClick={() => setSelectedFormat(option.format)}
                            >
                                <option.icon className={`size-5 ${selectedFormat === option.format ? "text-blue-600" : "text-gray-500"
                                    }`} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium ${selectedFormat === option.format ? "text-blue-900" : "text-gray-900"
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
                                    <span className="text-sm text-gray-500">{option.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pro upgrade prompt for non-pro users */}
                    {!isPro && (selectedFormat === "pdf" || selectedFormat === "csv") && (
                        <div className="rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4">
                            <div className="flex items-start gap-3">
                                <Crown className="size-5 text-amber-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-amber-900">Upgrade to Pro</p>
                                    <p className="text-sm text-amber-700 mt-1">
                                        Unlock PDF and CSV exports, plus remove watermarks from images.
                                    </p>
                                    <Link href="/pricing">
                                        <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700">
                                            View Plans
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleExport}
                        disabled={isExporting || (!isPro && (selectedFormat === "pdf" || selectedFormat === "csv"))}
                        className="gap-2"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="size-4" />
                                Download {selectedFormat.toUpperCase()}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
