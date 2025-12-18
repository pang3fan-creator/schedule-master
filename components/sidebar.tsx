"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Download, Settings, RotateCcw, Sparkles, Cloud, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AddEventDialog } from "@/components/add-event-dialog"
import { UpgradeModal } from "@/components/UpgradeModal"
import { FeatureComingSoonModal } from "@/components/FeatureComingSoonModal"
import { SettingsDialog } from "@/components/SettingsDialog"
import { useSubscription } from "@/components/SubscriptionContext"
import { type Event } from "@/lib/types"

interface SidebarProps {
  onReset: () => void
  viewMode: "day" | "week"
  onViewModeChange: (mode: "day" | "week") => void
  onAddEvent: (event: Omit<Event, "id">) => void
  currentMonday: Date
  onExport: () => void
  showAddDialog?: boolean  // External control to show add dialog
  onAddDialogClose?: () => void  // Callback when add dialog closes
}

export function Sidebar({ onReset, viewMode, onViewModeChange, onAddEvent, currentMonday, onExport, showAddDialog, onAddDialogClose }: SidebarProps) {
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showAddEventDialog, setShowAddEventDialog] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState("")
  const [comingSoonFeature, setComingSoonFeature] = useState("")

  const { isPro, isLoading } = useSubscription()

  const handleExportClick = () => {
    // Open export dialog in parent
    onExport()
  }

  const handleAIAutofillClick = () => {
    if (isLoading) return

    // Painted Door Test - show coming soon modal for all users
    setComingSoonFeature("AI Autofill")
    setShowComingSoonModal(true)
  }

  const handleCloudSaveClick = () => {
    if (isLoading) return

    // Painted Door Test - show coming soon modal for all users
    setComingSoonFeature("Cloud Save")
    setShowComingSoonModal(true)
  }

  const handleCalendarSyncClick = () => {
    if (isLoading) return

    // Painted Door Test - show coming soon modal for all users
    setComingSoonFeature("Calendar Sync")
    setShowComingSoonModal(true)
  }

  return (
    <aside className="hidden md:flex w-[230px] shrink-0 flex-col border-r border-gray-100/80 bg-white/50 backdrop-blur-sm p-4">
      {/* Add New Item Button */}
      <Button
        className="mb-4 w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-md hover:shadow-lg hover:glow-primary transition-all duration-300"
        onClick={() => setShowAddEventDialog(true)}
      >
        <PlusCircle className="size-5" />
        Add New Item
      </Button>

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
        currentMonday={currentMonday}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        feature={upgradeFeature}
      />

      {/* Feature Coming Soon Modal - Painted Door Test */}
      <FeatureComingSoonModal
        open={showComingSoonModal}
        onOpenChange={setShowComingSoonModal}
        featureName={comingSoonFeature}
      />

      {/* Day/Week Toggle */}
      <Tabs value={viewMode} onValueChange={(value) => onViewModeChange(value as "day" | "week")} className="mb-6">
        <TabsList className="w-full grid grid-cols-2 bg-gray-100">
          <TabsTrigger value="day" className="data-[state=active]:bg-white">
            Day
          </TabsTrigger>
          <TabsTrigger value="week" className="data-[state=active]:bg-white">
            Week
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Menu Items */}
      <nav className="flex flex-col gap-1">
        {/* Reset Dialog */}
        <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="justify-start gap-3 text-gray-600 hover:text-gray-900">
              <RotateCcw className="size-5" />
              Reset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Schedule</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete all events from the calendar? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-2">
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

        {/* Settings */}
        <Button
          variant="ghost"
          className="justify-start gap-3 text-gray-600 hover:text-gray-900"
          onClick={() => setShowSettingsDialog(true)}
        >
          <Settings className="size-5" />
          Settings
        </Button>

        {/* Settings Dialog */}
        <SettingsDialog
          open={showSettingsDialog}
          onOpenChange={setShowSettingsDialog}
        />

        {/* Cloud Save */}
        <Button
          variant="ghost"
          className="justify-start gap-3 text-gray-600 hover:text-gray-900"
          onClick={handleCloudSaveClick}
        >
          <Cloud className="size-5" />
          Cloud Save
        </Button>

        {/* Calendar Sync */}
        <Button
          variant="ghost"
          className="justify-start gap-3 text-gray-600 hover:text-gray-900"
          onClick={handleCalendarSyncClick}
        >
          <Calendar className="size-5" />
          Calendar Sync
        </Button>

        {/* Export/Download */}
        <Button
          variant="ghost"
          className="justify-start gap-3 text-gray-600 hover:text-gray-900"
          onClick={handleExportClick}
        >
          <Download className="size-5" />
          Export/Download
        </Button>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* AI Autofill Button with shimmer */}
      <Button
        className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white gap-2 shimmer hover:glow-primary transition-shadow duration-300"
        onClick={handleAIAutofillClick}
      >
        <Sparkles className="size-5" />
        AI Autofill
      </Button>
    </aside>
  )
}
