"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ViewModeToggle } from "@/components/ViewModeToggle"
import { PlusCircle, Download, Settings, RotateCcw, Sparkles, MoreHorizontal, HelpCircle, CalendarDays, CalendarRange, Cloud, Calendar } from "lucide-react"
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
import { useAuth } from "@clerk/nextjs"
import { type Event } from "@/lib/types"

// Dynamically import dialog components for code splitting
const AuthModal = dynamic(() => import("@/components/AuthModal").then(m => m.AuthModal), { ssr: false })
const CloudSaveDialog = dynamic(() => import("@/components/CloudSaveDialog").then(m => m.CloudSaveDialog), { ssr: false })
const UpgradeModal = dynamic(() => import("@/components/UpgradeModal").then(m => m.UpgradeModal), { ssr: false })
const CalendarSyncDialog = dynamic(() => import("@/components/CalendarSyncDialog").then(m => m.CalendarSyncDialog), { ssr: false })
import { EVENTS_STORAGE_KEY } from "@/lib/storage-keys"

const AddEventDialog = dynamic(() => import("@/components/AddEventDialog").then(m => m.AddEventDialog), { ssr: false })
const FeatureComingSoonModal = dynamic(() => import("@/components/FeatureComingSoonModal").then(m => m.FeatureComingSoonModal), { ssr: false })
const SettingsDialog = dynamic(() => import("@/components/SettingsDialog").then(m => m.SettingsDialog), { ssr: false })
const AIAutofillDialog = dynamic(() => import("@/components/AIAutofillDialog").then(m => m.AIAutofillDialog), { ssr: false })

// Import FAQDialog directly (not dynamically) to ensure SEO visibility
import { FAQDialog } from "@/components/FAQDialog"


interface MobileToolbarProps {
    onReset: () => void
    viewMode: "day" | "week"
    onViewModeChange: (mode: "day" | "week") => void
    onAddEvent: (event: Omit<Event, "id">) => void
    weekStart: Date
    weekStartsOnSunday: boolean
    onExport: () => void
    onLoadSchedule?: (events: Event[], settings: Record<string, unknown> | null) => void
    showAddDialog?: boolean
    onAddDialogClose?: () => void
    initialData?: {
        startTime?: string
        endTime?: string
        selectedDays?: number[]
    }
    showSettingsOpen?: boolean
    onSettingsOpenChange?: (open: boolean) => void
    onAddEvents?: (events: Omit<Event, "id">[]) => void
}

export function MobileToolbar({
    onReset,
    viewMode,
    onViewModeChange,
    onAddEvent,
    weekStart,
    weekStartsOnSunday,
    onExport,
    onLoadSchedule,
    showAddDialog,
    onAddDialogClose,
    initialData,
    showSettingsOpen,
    onSettingsOpenChange,
    onAddEvents,
}: MobileToolbarProps) {
    const { userId } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [showResetDialog, setShowResetDialog] = useState(false)
    const [showAddEventDialog, setShowAddEventDialog] = useState(false)
    const [showSettingsDialog, setShowSettingsDialog] = useState(false)

    // Sync external state if provided
    const effectiveShowSettings = showSettingsOpen !== undefined ? showSettingsOpen : showSettingsDialog
    const setEffectiveSettingsOpen = (open: boolean) => {
        if (onSettingsOpenChange) {
            onSettingsOpenChange(open)
        } else {
            setShowSettingsDialog(open)
        }
    }
    const [showComingSoonModal, setShowComingSoonModal] = useState(false)
    const [showMoreSheet, setShowMoreSheet] = useState(false)
    const [showFAQDialog, setShowFAQDialog] = useState(false)
    const [showCloudSaveDialog, setShowCloudSaveDialog] = useState(false)
    const [showCalendarSyncDialog, setShowCalendarSyncDialog] = useState(false)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [upgradeFeature, setUpgradeFeature] = useState("")
    const [comingSoonFeature, setComingSoonFeature] = useState("")
    const [comingSoonDescription, setComingSoonDescription] = useState<React.ReactNode>(null)
    const [showAIAutofillDialog, setShowAIAutofillDialog] = useState(false)

    const { isPro, isLoading } = useSubscription()

    const handleExportClick = () => {
        setShowMoreSheet(false)
        onExport()
    }

    const handleAIAutofillClick = () => {
        if (isLoading) return
        setShowMoreSheet(false)

        // Requirement: Unauthenticated users see login prompt
        if (!userId) {
            setShowAuthModal(true)
            return
        }

        // Authenticated users (Free or Pro) open the dialog
        setShowAIAutofillDialog(true)
    }

    const handleResetClick = () => {
        const stored = localStorage.getItem(EVENTS_STORAGE_KEY)
        if (stored) {
            try {
                const events = JSON.parse(stored)
                if (Array.isArray(events) && events.length > 0) {
                    setShowMoreSheet(false)
                    setShowResetDialog(true)
                }
            } catch (e) {
                console.error("Error parsing events for reset check", e)
            }
        }
    }

    const handleSettingsClick = () => {
        setShowMoreSheet(false)
        setEffectiveSettingsOpen(true)
    }

    const handleFAQClick = () => {
        setShowMoreSheet(false)
        setShowFAQDialog(true)
    }

    const handleCloudSaveClick = () => {
        if (isLoading) return

        // Paywall: Non-Pro users see upgrade modal
        if (!isPro) {
            setUpgradeFeature("Cloud Save")
            setShowUpgradeModal(true)
            return
        }

        // Pro users: Open Cloud Save dialog
        setShowCloudSaveDialog(true)
    }

    const handleCalendarSyncClick = () => {
        // Painted Door Test - Intercept all requests
        setComingSoonFeature("Calendar Sync")
        setComingSoonDescription("This feature is included in the Pro version and will be available soon! Enter your email to get notified first when it launches.")
        setShowComingSoonModal(true)
        return

        if (isLoading) return
        setShowMoreSheet(false)

        // Paywall: Non-Pro users see upgrade modal
        if (!isPro) {
            setUpgradeFeature("Calendar Sync")
            setShowUpgradeModal(true)
            return
        }

        // Pro users: Open Calendar Sync dialog
        setShowCalendarSyncDialog(true)
    }

    return (
        <>
            {/* Floating Add Button (FAB) - above the toolbar */}
            <Button
                size="lg"
                className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg p-0 md:hidden"
                onClick={() => setShowAddEventDialog(true)}
            >
                <PlusCircle className="size-7" />
                <span className="sr-only">Add Event</span>
            </Button>

            {/* Fixed Bottom Toolbar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-2 md:hidden safe-area-pb">
                <div className="flex items-center justify-around">
                    {/* Reset Button (4) */}
                    <button
                        onClick={handleResetClick}
                        className="flex flex-col items-center gap-0.5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <RotateCcw className="size-5 text-gray-600" />
                        <span className="text-xs text-gray-600">Reset</span>
                    </button>

                    {/* Export Button (3) */}
                    <button
                        onClick={handleExportClick}
                        className="flex flex-col items-center gap-0.5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Download className="size-5 text-gray-600" />
                        <span className="text-xs text-gray-600">Export</span>
                    </button>

                    {/* Day/Week Toggle Button (1) */}
                    <button
                        onClick={() => onViewModeChange(viewMode === "day" ? "week" : "day")}
                        className="flex flex-col items-center gap-0.5 p-2 w-16 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {viewMode === "day" ? (
                            <CalendarDays className="size-5 text-blue-600" />
                        ) : (
                            <CalendarRange className="size-5 text-blue-600" />
                        )}
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                            {viewMode === "day" ? "Day" : "Week"} <span className="text-gray-400">↔</span>
                        </span>
                    </button>

                    {/* Cloud Save Button (2) */}
                    <button
                        onClick={handleCloudSaveClick}
                        className="flex flex-col items-center gap-0.5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Cloud className="size-5 text-gray-600" />
                        <span className="text-xs text-gray-600">Cloud</span>
                    </button>

                    {/* More Menu (5) */}
                    <Sheet open={showMoreSheet} onOpenChange={setShowMoreSheet}>
                        <SheetTrigger asChild>
                            <button className="flex flex-col items-center gap-0.5 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <MoreHorizontal className="size-5 text-gray-600" />
                                <span className="text-xs text-gray-600">More</span>
                            </button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-auto rounded-t-2xl">
                            <SheetHeader className="pb-4">
                                <SheetTitle>More Options</SheetTitle>
                            </SheetHeader>
                            <div className="grid grid-cols-4 gap-4 pb-6">
                                {/* Sync Button (4) */}
                                <button
                                    onClick={handleCalendarSyncClick}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Calendar className="size-5 text-gray-600" />
                                    </div>
                                    <span className="text-xs text-gray-600">Sync</span>
                                </button>

                                {/* AI Fill Button (2) */}
                                <button
                                    onClick={handleAIAutofillClick}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
                                        <Sparkles className="size-5 text-white" />
                                    </div>
                                    <span className="text-xs text-gray-600">AI Fill</span>
                                </button>

                                {/* Settings Button (1) */}
                                <button
                                    onClick={handleSettingsClick}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Settings className="size-5 text-gray-600" />
                                    </div>
                                    <span className="text-xs text-gray-600">Settings</span>
                                </button>

                                {/* FAQ Button (3) */}
                                <button
                                    onClick={handleFAQClick}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                        <HelpCircle className="size-5 text-gray-600" />
                                    </div>
                                    <span className="text-xs text-gray-600">FAQ</span>
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
                open={effectiveShowSettings}
                onOpenChange={setEffectiveSettingsOpen}
            />

            {/* Feature Coming Soon Modal */}
            <FeatureComingSoonModal
                open={showComingSoonModal}
                onOpenChange={setShowComingSoonModal}
                featureName={comingSoonFeature}
                description={comingSoonDescription}
            />

            {/* FAQ Dialog */}
            <FAQDialog
                open={showFAQDialog}
                onOpenChange={setShowFAQDialog}
            />

            {/* Cloud Save Dialog */}
            <CloudSaveDialog
                open={showCloudSaveDialog}
                onOpenChange={setShowCloudSaveDialog}
                onLoadSchedule={(events, settings) => {
                    if (onLoadSchedule) {
                        onLoadSchedule(events, settings)
                    }
                }}
            />

            {/* Upgrade Modal */}
            <UpgradeModal
                open={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                feature={upgradeFeature}
            />

            {/* Calendar Sync Dialog */}
            <CalendarSyncDialog
                open={showCalendarSyncDialog}
                onOpenChange={setShowCalendarSyncDialog}
                weekStart={weekStart}
                weekStartsOnSunday={weekStartsOnSunday}
            />



            {/* AI Autofill Dialog */}
            <AIAutofillDialog
                open={showAIAutofillDialog}
                onOpenChange={setShowAIAutofillDialog}
                onAddEvents={(events) => {
                    if (onAddEvents) {
                        onAddEvents(events)
                    }
                }}
                weekStart={weekStart}
                weekStartsOnSunday={weekStartsOnSunday}
                onReset={onReset}
            />

            {/* Auth Modal */}
            <AuthModal
                open={showAuthModal}
                onOpenChange={setShowAuthModal}
                defaultMode="sign-up"
            />
        </>
    )
}
