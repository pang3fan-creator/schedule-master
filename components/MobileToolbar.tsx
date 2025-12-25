"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ViewModeToggle } from "@/components/ViewModeToggle"
import { PlusCircle, Download, Settings, RotateCcw, Sparkles, MoreHorizontal } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useSubscription } from "@/components/SubscriptionContext"
import { type Event } from "@/lib/types"

// Dynamically import dialog components for code splitting
const AddEventDialog = dynamic(() => import("@/components/AddEventDialog").then(m => m.AddEventDialog), { ssr: false })
const FeatureComingSoonModal = dynamic(() => import("@/components/FeatureComingSoonModal").then(m => m.FeatureComingSoonModal), { ssr: false })
const SettingsDialog = dynamic(() => import("@/components/SettingsDialog").then(m => m.SettingsDialog), { ssr: false })

interface MobileToolbarProps {
    onReset: () => void
    viewMode: "day" | "week"
    onViewModeChange: (mode: "day" | "week") => void
    onAddEvent: (event: Omit<Event, "id">) => void
    weekStart: Date
    weekStartsOnSunday: boolean
    onExport: () => void
    showAddDialog?: boolean
    onAddDialogClose?: () => void
    initialData?: {
        startTime?: string
        endTime?: string
        selectedDays?: number[]
    }
}

export function MobileToolbar({
    onReset,
    viewMode,
    onViewModeChange,
    onAddEvent,
    weekStart,
    weekStartsOnSunday,
    onExport,
    showAddDialog,
    onAddDialogClose,
    initialData,
}: MobileToolbarProps) {
    const [showResetDialog, setShowResetDialog] = useState(false)
    const [showAddEventDialog, setShowAddEventDialog] = useState(false)
    const [showSettingsDialog, setShowSettingsDialog] = useState(false)
    const [showComingSoonModal, setShowComingSoonModal] = useState(false)
    const [showMoreSheet, setShowMoreSheet] = useState(false)
    const [comingSoonFeature, setComingSoonFeature] = useState("")

    const { isLoading } = useSubscription()

    const handleExportClick = () => {
        setShowMoreSheet(false)
        onExport()
    }

    const handleAIAutofillClick = () => {
        if (isLoading) return
        setShowMoreSheet(false)
        setComingSoonFeature("AI Autofill")
        setShowComingSoonModal(true)
    }

    const handleResetClick = () => {
        setShowMoreSheet(false)
        setShowResetDialog(true)
    }

    const handleSettingsClick = () => {
        setShowMoreSheet(false)
        setShowSettingsDialog(true)
    }

    return (
        <>
            {/* Fixed Bottom Toolbar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-2 md:hidden safe-area-pb">
                <div className="flex items-center justify-around gap-1">
                    {/* Day/Week Toggle */}
                    <ViewModeToggle
                        value={viewMode}
                        onValueChange={onViewModeChange}
                        size="sm"
                        className="flex-shrink-0"
                    />

                    {/* Add Button - Primary Action */}
                    <Button
                        size="lg"
                        className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg p-0"
                        onClick={() => setShowAddEventDialog(true)}
                    >
                        <PlusCircle className="size-6" />
                        <span className="sr-only">Add Event</span>
                    </Button>

                    {/* Quick Actions */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={handleExportClick}
                    >
                        <Download className="size-5 text-gray-600" />
                        <span className="sr-only">Export</span>
                    </Button>

                    {/* More Menu */}
                    <Sheet open={showMoreSheet} onOpenChange={setShowMoreSheet}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10">
                                <MoreHorizontal className="size-5 text-gray-600" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-auto rounded-t-2xl">
                            <SheetHeader className="pb-4">
                                <SheetTitle>More Options</SheetTitle>
                            </SheetHeader>
                            <div className="grid grid-cols-4 gap-4 pb-6">
                                <button
                                    onClick={handleSettingsClick}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Settings className="size-5 text-gray-600" />
                                    </div>
                                    <span className="text-xs text-gray-600">Settings</span>
                                </button>
                                <button
                                    onClick={handleResetClick}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <RotateCcw className="size-5 text-gray-600" />
                                    </div>
                                    <span className="text-xs text-gray-600">Reset</span>
                                </button>
                                <button
                                    onClick={handleAIAutofillClick}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
                                        <Sparkles className="size-5 text-white" />
                                    </div>
                                    <span className="text-xs text-gray-600">AI Fill</span>
                                </button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Add Event Dialog */}
            <AddEventDialog
                open={showAddEventDialog || showAddDialog || false}
                onOpenChange={(open) => {
                    setShowAddEventDialog(open)
                    if (!open && onAddDialogClose) {
                        onAddDialogClose()
                    }
                }}
                onAddEvent={onAddEvent}
                weekStart={weekStart}
                weekStartsOnSunday={weekStartsOnSunday}
                initialData={initialData}
            />

            {/* Reset Dialog */}
            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Schedule</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete all events from the calendar? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setShowResetDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                                onReset()
                                setShowResetDialog(false)
                            }}
                        >
                            Yes, Reset
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Settings Dialog */}
            <SettingsDialog
                open={showSettingsDialog}
                onOpenChange={setShowSettingsDialog}
            />

            {/* Feature Coming Soon Modal */}
            <FeatureComingSoonModal
                open={showComingSoonModal}
                onOpenChange={setShowComingSoonModal}
                featureName={comingSoonFeature}
            />
        </>
    )
}
