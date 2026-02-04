"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import {
  Download,
  Settings,
  RotateCcw,
  Sparkles,
  MoreHorizontal,
  HelpCircle,
  CalendarDays,
  CalendarRange,
  Cloud,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSubscription } from "@/components/SubscriptionContext";
import { useAuth } from "@clerk/nextjs";
import { type Event } from "@/lib/types";

// Dynamically import dialog components for code splitting
const AuthModal = dynamic(
  () => import("@/components/AuthModal").then((m) => m.AuthModal),
  { ssr: false },
);
const CloudSaveDialog = dynamic(
  () => import("@/components/CloudSaveDialog").then((m) => m.CloudSaveDialog),
  { ssr: false },
);
const UpgradeModal = dynamic(
  () => import("@/components/UpgradeModal").then((m) => m.UpgradeModal),
  { ssr: false },
);
const CalendarSyncDialog = dynamic(
  () =>
    import("@/components/CalendarSyncDialog").then((m) => m.CalendarSyncDialog),
  { ssr: false },
);
import { EVENTS_STORAGE_KEY } from "@/lib/storage-keys";
import { useSettings } from "@/components/SettingsContext";
import { TaskModeToggle } from "@/components/templates/TaskModeToggle";
import { AIQuickActions } from "@/components/templates/AIQuickActions";
import { ProjectDashboard } from "@/components/templates/ProjectDashboard";

const FeatureComingSoonModal = dynamic(
  () =>
    import("@/components/FeatureComingSoonModal").then(
      (m) => m.FeatureComingSoonModal,
    ),
  { ssr: false },
);
const SettingsDialog = dynamic(
  () => import("@/components/SettingsDialog").then((m) => m.SettingsDialog),
  { ssr: false },
);
const AIAutofillDialog = dynamic(
  () => import("@/components/AIAutofillDialog").then((m) => m.AIAutofillDialog),
  { ssr: false },
);

// Import FAQDialog directly (not dynamically) to ensure SEO visibility
import { FAQDialog } from "@/components/FAQDialog";
import { DEFAULT_SETTINGS } from "@/components/SettingsContext";
import { useTranslations } from "next-intl";

interface MobileToolbarProps {
  onReset: () => void;
  viewMode: "day" | "week";
  onViewModeChange: (mode: "day" | "week") => void;
  weekStart: Date;
  weekStartsOnSunday: boolean;
  onExport: () => void;
  onLoadSchedule?: (
    events: Event[],
    settings: Record<string, unknown> | null,
  ) => void;
  showSettingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
  showAIAutofillOpen?: boolean;
  onAIAutofillOpenChange?: (open: boolean) => void;
  onAddEvents?: (events: Omit<Event, "id">[]) => void;
}

export function MobileToolbar({
  onReset,
  viewMode,
  onViewModeChange,
  weekStart,
  weekStartsOnSunday,
  onExport,
  onLoadSchedule,
  showSettingsOpen,
  onSettingsOpenChange,
  showAIAutofillOpen,
  onAIAutofillOpenChange,
  onAddEvents,
}: MobileToolbarProps) {
  const t = useTranslations("Common");
  const { userId } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  // Sync external state if provided
  const effectiveShowSettings =
    showSettingsOpen !== undefined ? showSettingsOpen : showSettingsDialog;
  const setEffectiveSettingsOpen = (open: boolean) => {
    if (onSettingsOpenChange) {
      onSettingsOpenChange(open);
    } else {
      setShowSettingsDialog(open);
    }
  };
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [showFAQDialog, setShowFAQDialog] = useState(false);
  const [showCloudSaveDialog, setShowCloudSaveDialog] = useState(false);
  const [showCalendarSyncDialog, setShowCalendarSyncDialog] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState("");
  const [comingSoonFeature, setComingSoonFeature] = useState("");
  const [comingSoonDescription, setComingSoonDescription] =
    useState<React.ReactNode>(null);
  const [showAIAutofillDialog, setShowAIAutofillDialog] = useState(false);

  // Sync external AI Autofill state if provided
  const effectiveShowAIAutofill =
    showAIAutofillOpen !== undefined
      ? showAIAutofillOpen
      : showAIAutofillDialog;
  const setEffectiveAIAutofillOpen = (open: boolean) => {
    if (onAIAutofillOpenChange) {
      onAIAutofillOpenChange(open);
    } else {
      setShowAIAutofillDialog(open);
    }
  };

  const { isPro, isLoading } = useSubscription();
  const { settings } = useSettings();

  const handleExportClick = () => {
    setShowMoreSheet(false);
    onExport();
  };

  const handleAIAutofillClick = () => {
    if (isLoading) return;
    setShowMoreSheet(false);

    // Requirement: Unauthenticated users see login prompt
    if (!userId) {
      setShowAuthModal(true);
      return;
    }

    // Authenticated users (Free or Pro) open the dialog
    setEffectiveAIAutofillOpen(true);
  };

  const handleResetClick = () => {
    const hasActiveTemplate = !!settings.activeTemplateSlug;
    const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
    let hasEvents = false;
    if (stored) {
      try {
        const events = JSON.parse(stored);
        hasEvents = Array.isArray(events) && events.length > 0;
      } catch (e) {
        console.error("Error parsing events for reset check", e);
      }
    }

    const isDefaultSettings = Object.keys(DEFAULT_SETTINGS).every((key) => {
      if (key === "activeTemplateSlug") return true;
      return (settings as any)[key] === (DEFAULT_SETTINGS as any)[key];
    });

    if (!hasActiveTemplate && isDefaultSettings && !hasEvents) {
      return;
    }

    setShowMoreSheet(false);
    setShowResetDialog(true);
  };

  const handleSettingsClick = () => {
    setShowMoreSheet(false);
    setEffectiveSettingsOpen(true);
  };

  const handleFAQClick = () => {
    setShowMoreSheet(false);
    setShowFAQDialog(true);
  };

  const handleCloudSaveClick = () => {
    if (isLoading) return;

    // Paywall: Non-Pro users see upgrade modal
    if (!isPro) {
      setUpgradeFeature("Cloud Save");
      setShowUpgradeModal(true);
      return;
    }

    // Pro users: Open Cloud Save dialog
    setShowCloudSaveDialog(true);
  };

  const handleCalendarSyncClick = () => {
    // Painted Door Test - Intercept all requests
    setComingSoonFeature(t("featureComingSoon.calendarSync.name"));
    setComingSoonDescription(t("featureComingSoon.calendarSync.description"));
    setShowComingSoonModal(true);
    return;

    if (isLoading) return;
    setShowMoreSheet(false);

    // Paywall: Non-Pro users see upgrade modal
    if (!isPro) {
      setUpgradeFeature("Calendar Sync");
      setShowUpgradeModal(true);
      return;
    }

    // Pro users: Open Calendar Sync dialog
    setShowCalendarSyncDialog(true);
  };

  return (
    <>
      {/* Floating Template Toggle Buttons - Stacked on the right */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-3 items-center md:hidden pointer-events-none">
        {/* Task Mode Toggle - Only for Cleaning Template */}
        {settings.activeTemplateSlug === "cleaning-schedule-builder" && (
          <div className="pointer-events-auto">
            <TaskModeToggle variant="compact" />
          </div>
        )}

        {/* AI Quick Actions - Only for AI Schedule Builder Template */}
        {settings.activeTemplateSlug === "ai-schedule-builder" && (
          <div className="pointer-events-auto">
            <AIQuickActions
              variant="compact"
              onRegenerateSchedule={() => setEffectiveAIAutofillOpen(true)}
              onClearSchedule={onReset}
            />
          </div>
        )}

        {/* Project Dashboard - Only for Construction Template */}
        {settings.activeTemplateSlug === "construction-schedule-builder" && (
          <div className="pointer-events-auto">
            <ProjectDashboard variant="compact" />
          </div>
        )}
      </div>

      {/* Fixed Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2 md:hidden safe-area-pb">
        <div className="flex items-center justify-around">
          {/* Reset Button (4) */}
          <button
            onClick={handleResetClick}
            className="flex flex-col items-center gap-0.5 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <RotateCcw className="size-5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {t("sidebar.reset")}
            </span>
          </button>

          {/* Export Button (3) */}
          <button
            onClick={handleExportClick}
            className="flex flex-col items-center gap-0.5 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Download className="size-5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {t("export")}
            </span>
          </button>

          {/* Day/Week Toggle Button (1) */}
          <button
            onClick={() =>
              onViewModeChange(viewMode === "day" ? "week" : "day")
            }
            className="flex flex-col items-center gap-0.5 p-2 w-16 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {viewMode === "day" ? (
              <CalendarDays className="size-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <CalendarRange className="size-5 text-blue-600 dark:text-blue-400" />
            )}
            <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {viewMode === "day" ? t("viewMode.day") : t("viewMode.week")}{" "}
              <span className="text-gray-400 dark:text-gray-500">↔</span>
            </span>
          </button>

          {/* Cloud Save Button (2) */}
          <button
            onClick={handleCloudSaveClick}
            className="flex flex-col items-center gap-0.5 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Cloud className="size-5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {t("cloud")}
            </span>
          </button>

          {/* More Menu (5) */}
          <Sheet open={showMoreSheet} onOpenChange={setShowMoreSheet}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center gap-0.5 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <MoreHorizontal className="size-5 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {t("more")}
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-auto rounded-t-2xl dark:bg-gray-900"
            >
              <SheetHeader className="pb-4">
                <SheetTitle>{t("moreOptions")}</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-4 gap-4 pb-6">
                {/* Sync Button (4) */}
                <button
                  onClick={handleCalendarSyncClick}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Calendar className="size-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {t("sync")}
                  </span>
                </button>

                {/* AI Fill Button (2) */}
                <button
                  onClick={handleAIAutofillClick}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="size-5 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {t("aiFill")}
                  </span>
                </button>

                {/* Settings Button (1) */}
                <button
                  onClick={handleSettingsClick}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Settings className="size-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {t("sidebar.settings")}
                  </span>
                </button>

                {/* FAQ Button (3) */}
                <button
                  onClick={handleFAQClick}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <HelpCircle className="size-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {t("faq")}
                  </span>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("reset.title")}</DialogTitle>
            <DialogDescription>{t("reset.description")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              {t("reset.cancel")}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                onReset();
                setShowResetDialog(false);
              }}
            >
              {t("reset.confirm")}
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
      <FAQDialog open={showFAQDialog} onOpenChange={setShowFAQDialog} />

      {/* Cloud Save Dialog */}
      <CloudSaveDialog
        open={showCloudSaveDialog}
        onOpenChange={setShowCloudSaveDialog}
        onLoadSchedule={(events, settings) => {
          if (onLoadSchedule) {
            onLoadSchedule(events, settings);
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
        open={effectiveShowAIAutofill}
        onOpenChange={setEffectiveAIAutofillOpen}
        onAddEvents={(events) => {
          if (onAddEvents) {
            onAddEvents(events);
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
  );
}
