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
import { Download, Image, FileText, Loader2, Crown } from "lucide-react"
import { useSubscription } from "@/components/SubscriptionContext"
import { exportScheduleToImage, generateFilename } from "@/lib/export"
import Link from "next/link"

interface ExportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    calendarRef: React.RefObject<HTMLDivElement | null>
}

type ExportFormat = "png" | "jpg" | "pdf"

export function ExportDialog({ open, onOpenChange, calendarRef }: ExportDialogProps) {
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("png")
    const [isExporting, setIsExporting] = useState(false)
    const { isPro } = useSubscription()

    const handleExport = async () => {
        if (!calendarRef.current) {
            console.error("Calendar reference not found")
            return
        }

        setIsExporting(true)

        try {
            if (selectedFormat === "pdf") {
                // PDF export for Pro users
                if (!isPro) {
                    return
                }
                // TODO: Implement PDF export
                console.log("PDF export coming soon for Pro users")
            } else {
                // PNG/JPG export for everyone (with watermark for free users)
                await exportScheduleToImage({
                    element: calendarRef.current,
                    filename: generateFilename("schedule"),
                    format: selectedFormat,
                    scale: 2,
                    watermark: !isPro ? "schedulebuilder.app" : undefined,
                })
            }
            onOpenChange(false)
        } catch (error) {
            console.error("Export failed:", error)
        } finally {
            setIsExporting(false)
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
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Download className="size-5" />
                        Export Schedule
                    </DialogTitle>
                    <DialogDescription>
                        Choose a format to download your schedule.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Format selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Format</Label>
                        <div className="grid gap-2">
                            {formatOptions.map((option) => {
                                const Icon = option.icon
                                const isSelected = selectedFormat === option.format
                                const isDisabled = !option.available

                                return (
                                    <button
                                        key={option.format}
                                        type="button"
                                        className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${isSelected
                                                ? "border-blue-500 bg-blue-50"
                                                : isDisabled
                                                    ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                        onClick={() => !isDisabled && setSelectedFormat(option.format)}
                                        disabled={isDisabled}
                                    >
                                        <div className={`p-2 rounded-md ${isSelected ? "bg-blue-100" : "bg-gray-100"}`}>
                                            <Icon className={`size-5 ${isSelected ? "text-blue-600" : "text-gray-500"}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                                                    {option.label}
                                                </span>
                                                {option.proOnly && (
                                                    <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                                                        <Crown className="size-3" />
                                                        Pro
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">{option.description}</p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Watermark notice for free users */}
                    {!isPro && selectedFormat !== "pdf" && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600">
                                Free exports include a small watermark.{" "}
                                <Link href="/pricing" className="text-blue-600 hover:underline">
                                    Upgrade to Pro
                                </Link>{" "}
                                for watermark-free exports and PDF support.
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleExport}
                        disabled={isExporting || (selectedFormat === "pdf" && !isPro)}
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
