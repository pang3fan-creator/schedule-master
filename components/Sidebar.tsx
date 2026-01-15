"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ViewModeToggle } from "@/components/ViewModeToggle"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Download, Settings, Sparkles, Cloud, Calendar, HelpCircle } from "lucide-react"
import { useSettings } from "@/components/SettingsContext"
import { TaskModeToggle } from "@/components/templates/TaskModeToggle"
import { AIQuickActions } from "@/components/templates/AIQuickActions"
import { ProjectDashboard } from "@/components/templates/ProjectDashboard"

import { useSubscription } from "@/components/SubscriptionContext"
import { ResetButton } from "@/components/ResetButton"
import { useAuth } from "@clerk/nextjs"
import { type Event } from "@/lib/types"
import { useTranslations } from "next-intl"



const AuthModal = dynamic(() => import("@/components/AuthModal").then(m => m.AuthModal), { ssr: false })
const UpgradeModal = dynamic(() => import("@/components/UpgradeModal").then(m => m.UpgradeModal), { ssr: false })
const FeatureComingSoonModal = dynamic(() => import("@/components/FeatureComingSoonModal").then(m => m.FeatureComingSoonModal), { ssr: false })
const SettingsDialog = dynamic(() => import("@/components/SettingsDialog").then(m => m.SettingsDialog), { ssr: false })
const CloudSaveDialog = dynamic(() => import("@/components/CloudSaveDialog").then(m => m.CloudSaveDialog), { ssr: false })
const CalendarSyncDialog = dynamic(() => import("@/components/CalendarSyncDialog").then(m => m.CalendarSyncDialog), { ssr: false })
const AIAutofillDialog = dynamic(() => import("@/components/AIAutofillDialog").then(m => m.AIAutofillDialog), { ssr: false })

// Import FAQDialog directly (not dynamically) to ensure SEO visibility
import { FAQDialog } from "@/components/FAQDialog"

interface SidebarProps {
  events: Event[]
  onReset: () => void
  viewMode: "day" | "week"
  onViewModeChange: (mode: "day" | "week") => void
  weekStart: Date
  weekStartsOnSunday: boolean
  onExport: () => void
  showSettingsOpen?: boolean
  onSettingsOpenChange?: (open: boolean) => void
  onLoadSchedule?: (events: Event[], settings: Record<string, unknown> | null) => void
  onAddEvents?: (events: Omit<Event, "id">[]) => void
  showAIAutofillOpen?: boolean
  onAIAutofillOpenChange?: (open: boolean) => void
}

export function Sidebar({ events, onReset, viewMode, onViewModeChange, weekStart, weekStartsOnSunday, onExport, showSettingsOpen, onSettingsOpenChange, onLoadSchedule, onAddEvents, showAIAutofillOpen, onAIAutofillOpenChange }: SidebarProps) {
  const t = useTranslations('Common')
  const { userId } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
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
  const [showFAQDialog, setShowFAQDialog] = useState(false)
  const [showCloudSaveDialog, setShowCloudSaveDialog] = useState(false)
  const [showCalendarSyncDialog, setShowCalendarSyncDialog] = useState(false)
  const [showAIAutofillDialog, setShowAIAutofillDialog] = useState(false)

  // Sync external AI Autofill state if provided
  const effectiveShowAIAutofill = showAIAutofillOpen !== undefined ? showAIAutofillOpen : showAIAutofillDialog
  const setEffectiveAIAutofillOpen = (open: boolean) => {
    if (onAIAutofillOpenChange) {
      onAIAutofillOpenChange(open)
    } else {
      setShowAIAutofillDialog(open)
    }
  }
  const [upgradeFeature, setUpgradeFeature] = useState("")
  const [comingSoonFeature, setComingSoonFeature] = useState("")
  const [comingSoonDescription, setComingSoonDescription] = useState<React.ReactNode>(null)

  const { isPro, isLoading } = useSubscription()
  const { settings, updateSettings } = useSettings()

  const handleExportClick = () => {
    // Open export dialog in parent
    onExport()
  }

  const handleAIAutofillClick = () => {
    if (isLoading) return

    // Requirement: Unauthenticated users see login prompt
    if (!userId) {
      setShowAuthModal(true)
      return
    }

    // Authenticated users (Free or Pro) open the dialog
    // The dialog itself will handle tiered usage and trial paywalls
    setEffectiveAIAutofillOpen(true)
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
    <aside className="hidden md:flex w-[230px] h-full shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 p-4 overflow-hidden">
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
        description={comingSoonDescription}
      />

      {/* Day/Week Toggle */}
      <ViewModeToggle
        value={viewMode}
        onValueChange={onViewModeChange}
        className="w-full mb-3"
      />

      {/* Menu Items */}
      <nav className="flex flex-col gap-1">

        {/* Reset Button */}
        <ResetButton events={events} onReset={onReset} />


        {/* Cloud Save */}
        <Button
          variant="ghost"
          className="justify-start gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          onClick={handleCloudSaveClick}
        >
          <Cloud className="size-5" />
          {t('sidebar.cloudSave')}
        </Button>

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

        {/* Calendar Sync */}
        <Button
          variant="ghost"
          className="justify-start gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          onClick={handleCalendarSyncClick}
        >
          <Calendar className="size-5" />
          {t('sidebar.calendarSync')}
        </Button>

        {/* Calendar Sync Dialog */}
        <CalendarSyncDialog
          open={showCalendarSyncDialog}
          onOpenChange={setShowCalendarSyncDialog}
          weekStart={weekStart}
          weekStartsOnSunday={weekStartsOnSunday}
        />

        {/* Export/Download */}
        <Button
          variant="ghost"
          className="justify-start gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          onClick={handleExportClick}
        >
          <Download className="size-5" />
          {t('sidebar.exportDownload')}
        </Button>

        {/* Help & FAQ */}
        <Button
          variant="ghost"
          className="justify-start gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          onClick={() => setShowFAQDialog(true)}
        >
          <HelpCircle className="size-5" />
          {t('sidebar.helpFaq')}
        </Button>

        {/* FAQ Dialog */}
        <FAQDialog
          open={showFAQDialog}
          onOpenChange={setShowFAQDialog}
        />

        {/* Settings */}
        <Button
          variant="ghost"
          className="justify-start gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          onClick={() => setEffectiveSettingsOpen(true)}
        >
          <Settings className="size-5" />
          {t('sidebar.settings')}
        </Button>

        <div className="h-px bg-gray-100 my-2 mx-1 dark:bg-gray-800" />

        {/* Task Mode Toggle - Only for Cleaning Template */}
        {settings.activeTemplateSlug === 'cleaning-schedule-builder' && <TaskModeToggle />}

        {/* AI Quick Actions - Only for AI Schedule Builder Template */}
        {settings.activeTemplateSlug === 'ai-schedule-builder' && (
          <AIQuickActions
            onRegenerateSchedule={() => setEffectiveAIAutofillOpen(true)}
            onClearSchedule={onReset}
          />
        )}

        {/* Project Dashboard - Only for Construction Template */}
        {settings.activeTemplateSlug === 'construction-schedule-builder' && (
          <ProjectDashboard />
        )}



        {/* Settings Dialog */}
        <SettingsDialog
          open={effectiveShowSettings}
          onOpenChange={setEffectiveSettingsOpen}
        />
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* AI Autofill Button with shimmer */}
      <Button
        className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white gap-2 shimmer hover:glow-primary transition-shadow duration-300"
        onClick={handleAIAutofillClick}
      >
        <Sparkles className="size-5" />
        {t('sidebar.aiAutofill')}
      </Button>



      <AIAutofillDialog
        open={effectiveShowAIAutofill}
        onOpenChange={setEffectiveAIAutofillOpen}
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
    </aside >
  )
}
