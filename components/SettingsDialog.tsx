"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, X } from "lucide-react";
import {
  useSettings,
  type CalendarSettings,
} from "@/components/SettingsContext";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSettings } = useSettings();
  const t = useTranslations("Settings");
  const tCommon = useTranslations("Common");

  const handleWeekStartChange = (checked: boolean) => {
    updateSettings({ weekStartsOnSunday: checked });
  };

  const handleTimeFormatChange = (checked: boolean) => {
    updateSettings({ use12HourFormat: checked });
  };

  const handleTimeIncrementChange = (value: string) => {
    updateSettings({ timeIncrement: parseInt(value) as 5 | 15 | 30 | 60 });
  };

  const handleWorkingHoursStartChange = (value: string) => {
    const newStart = parseInt(value);
    // If current end is not valid (must be > start), adjust it to start + 1
    if (settings.workingHoursEnd <= newStart) {
      updateSettings({
        workingHoursStart: newStart,
        workingHoursEnd: newStart + 1,
      });
    } else {
      updateSettings({ workingHoursStart: newStart });
    }
  };

  const handleWorkingHoursEndChange = (value: string) => {
    updateSettings({ workingHoursEnd: parseInt(value) });
  };

  const handleShowDatesChange = (checked: boolean) => {
    updateSettings({ showDates: checked });
  };

  // Generate hour options for start time (A): 0-23 (12 AM to 11 PM)
  const startHourOptions = Array.from({ length: 24 }, (_, i) => i);

  // Generate hour options for end time (B): (A+1) to 24 (midnight)
  const endHourOptions = Array.from(
    { length: 24 - settings.workingHoursStart },
    (_, i) => settings.workingHoursStart + 1 + i,
  );

  // Format hour for display based on current time format setting
  const formatHourOption = (hour: number) => {
    if (settings.use12HourFormat) {
      const am = tCommon("calendar.time.am");
      const pm = tCommon("calendar.time.pm");
      if (hour === 0) return `12:00 ${am}`;
      if (hour === 12) return `12:00 ${pm}`;
      if (hour < 12) return `${hour}:00 ${am}`;
      return `${hour - 12}:00 ${pm}`;
    }
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[420px] p-0 gap-0 overflow-hidden bg-white dark:bg-gray-900"
        showCloseButton={false}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-6 pt-5 pb-2.5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Settings className="size-5 text-blue-600 dark:text-blue-400" />
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t("title")}
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 sm:size-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4 sm:size-5" />
          </Button>
        </DialogHeader>

        {/* Settings Content */}
        <div className="px-6 pt-3.5 pb-6 space-y-6">
          {/* Week Start Day */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("weekStart.label")}
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("weekStart.description")}
              </p>
            </div>
            <Switch
              checked={settings.weekStartsOnSunday}
              onCheckedChange={handleWeekStartChange}
            />
          </div>

          {/* Time Format */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("timeFormat.label")}
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("timeFormat.description")}
              </p>
            </div>
            <Switch
              checked={settings.use12HourFormat}
              onCheckedChange={handleTimeFormatChange}
            />
          </div>

          {/* Show Dates */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("showDates.label")}
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("showDates.description")}
              </p>
            </div>
            <Switch
              checked={settings.showDates}
              onCheckedChange={handleShowDatesChange}
            />
          </div>

          {/* Time Increment */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("timeIncrement.label")}
            </Label>
            <Select
              value={settings.timeIncrement.toString()}
              onValueChange={handleTimeIncrementChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">
                  {t("timeIncrement.minutes", { count: 5 })}
                </SelectItem>
                <SelectItem value="15">
                  {t("timeIncrement.minutes", { count: 15 })}
                </SelectItem>
                <SelectItem value="30">
                  {t("timeIncrement.minutes", { count: 30 })}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Working Hours */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("workingHours.label")}
            </Label>
            <div className="flex items-center gap-3">
              <Select
                value={settings.workingHoursStart.toString()}
                onValueChange={handleWorkingHoursStartChange}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {startHourOptions.map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {formatHourOption(hour)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-gray-400 dark:text-gray-500">
                {t("workingHours.to")}
              </span>
              <Select
                value={settings.workingHoursEnd.toString()}
                onValueChange={handleWorkingHoursEndChange}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {endHourOptions.map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {formatHourOption(hour)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
