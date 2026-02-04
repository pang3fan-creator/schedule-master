"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Cloud,
  Upload,
  Download,
  Trash2,
  Pencil,
  Loader2,
  Check,
  X,
  AlertCircle,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { type Event, type UserSchedule } from "@/lib/types";
import { EVENTS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from "@/lib/storage-keys";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface CloudSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadSchedule: (
    events: Event[],
    settings: Record<string, unknown> | null,
  ) => void;
}

interface ScheduleListItem {
  id: string;
  name: string;
  event_count: number;
  created_at: string;
  updated_at: string;
}

type SortOption = "updated" | "created" | "name";

export function CloudSaveDialog({
  open,
  onOpenChange,
  onLoadSchedule,
}: CloudSaveDialogProps) {
  const t = useTranslations("CloudSave");
  const locale = useLocale();
  const [schedules, setSchedules] = useState<ScheduleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [maxTemplates, setMaxTemplates] = useState(50);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  // Save mode
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  // Rename mode
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<ScheduleListItem | null>(
    null,
  );

  // Load confirmation
  const [loadTarget, setLoadTarget] = useState<ScheduleListItem | null>(null);

  // Overwrite confirmation (for duplicate name)
  const [overwriteTarget, setOverwriteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Sort option
  const [sortBy, setSortBy] = useState<SortOption>("updated");

  const fetchSchedules = useCallback(
    async (pageNum: number = 1, sort: SortOption = sortBy) => {
      setIsLoading(true);
      setError(null);
      try {
        const sortOrder = sort === "name" ? "asc" : "desc";
        const res = await fetch(
          `/api/schedules?page=${pageNum}&pageSize=${pageSize}&sortBy=${sort}&sortOrder=${sortOrder}`,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch schedules");
        }
        const data = await res.json();
        setSchedules(data.schedules || []);
        setTotalCount(data.pagination?.totalCount || 0);
        setTotalPages(data.pagination?.totalPages || 1);
        setPage(data.pagination?.page || 1);
        setMaxTemplates(data.maxTemplates || 50);
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError(t("errors.fetchFailed"));
      } finally {
        setIsLoading(false);
      }
    },
    [sortBy],
  );

  useEffect(() => {
    if (open) {
      setPage(1);
      fetchSchedules(1);
      setShowSaveInput(false);
      setSaveName("");
      setSaveError(null);
      setRenamingId(null);
    }
  }, [open, fetchSchedules]);

  // Handle sort change
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setPage(1);
    fetchSchedules(1, newSort);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchSchedules(newPage);
    }
  };

  const handleSave = async () => {
    if (!saveName.trim()) {
      setSaveError(t("errors.enterName"));
      return;
    }

    if (saveName.length > 50) {
      setSaveError(t("errors.nameTooLong"));
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const eventsStr = localStorage.getItem(EVENTS_STORAGE_KEY);
      const settingsStr = localStorage.getItem(SETTINGS_STORAGE_KEY);

      const events = eventsStr ? JSON.parse(eventsStr) : [];
      const settings = settingsStr ? JSON.parse(settingsStr) : null;

      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: saveName.trim(), events, settings }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "DUPLICATE_NAME") {
          setOverwriteTarget({ id: data.existingId, name: saveName.trim() });
          return;
        }
        throw new Error(data.error || "Failed to save");
      }

      // Success
      setShowSaveInput(false);
      setSaveName("");
      fetchSchedules();
    } catch (err) {
      console.error("Error saving:", err);
      setSaveError(err instanceof Error ? err.message : t("errors.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleOverwrite = async () => {
    if (!overwriteTarget) return;

    setIsSaving(true);
    try {
      const eventsStr = localStorage.getItem(EVENTS_STORAGE_KEY);
      const settingsStr = localStorage.getItem(SETTINGS_STORAGE_KEY);

      const events = eventsStr ? JSON.parse(eventsStr) : [];
      const settings = settingsStr ? JSON.parse(settingsStr) : null;

      const res = await fetch(`/api/schedules/${overwriteTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events, settings }),
      });

      if (!res.ok) {
        throw new Error("Failed to overwrite");
      }

      setOverwriteTarget(null);
      setShowSaveInput(false);
      setSaveName("");
      fetchSchedules();
    } catch (err) {
      console.error("Error overwriting:", err);
      setSaveError(t("errors.overwriteFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async (schedule: ScheduleListItem) => {
    // Check if localStorage has events
    const eventsStr = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (eventsStr) {
      try {
        const events = JSON.parse(eventsStr);
        if (Array.isArray(events) && events.length > 0) {
          // Show confirmation
          setLoadTarget(schedule);
          return;
        }
      } catch {
        // Continue with load
      }
    }

    // Load directly
    await performLoad(schedule.id);
  };

  const performLoad = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/schedules/${id}`);
      if (!res.ok) {
        throw new Error("Failed to load template");
      }

      const data = await res.json();
      const schedule = data.schedule as UserSchedule;

      // Apply to localStorage and notify parent
      onLoadSchedule(schedule.events, schedule.settings);
      onOpenChange(false);
    } catch (err) {
      console.error("Error loading:", err);
      setError(t("errors.loadFailed"));
    } finally {
      setIsLoading(false);
      setLoadTarget(null);
    }
  };

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) return;

    if (renameValue.length > 50) {
      setError(t("errors.nameTooLong"));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/schedules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameValue.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to rename");
      }

      setRenamingId(null);
      setRenameValue("");
      fetchSchedules();
    } catch (err) {
      console.error("Error renaming:", err);
      setError(err instanceof Error ? err.message : t("errors.renameFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/schedules/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      setDeleteTarget(null);
      fetchSchedules();
    } catch (err) {
      console.error("Error deleting:", err);
      setError(t("errors.deleteFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-lg max-h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-gray-900"
          showCloseButton={false}
        >
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Cloud className="size-5 text-blue-600 dark:text-blue-400" />
                {t("title")}
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
              {t("description")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col gap-4 p-6 min-h-0">
            {/* Template count and actions */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>
                {t("templatesUsed", { count: totalCount, max: maxTemplates })}
              </span>
              <div className="flex items-center gap-2">
                {/* Sort selector */}
                {totalCount > 1 && (
                  <Select
                    value={sortBy}
                    onValueChange={(v) => handleSortChange(v as SortOption)}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <ArrowUpDown className="size-3 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated">
                        {t("sort.updated")}
                      </SelectItem>
                      <SelectItem value="created">
                        {t("sort.created")}
                      </SelectItem>
                      <SelectItem value="name">{t("sort.name")}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowSaveInput(true);
                    setSaveError(null);
                  }}
                  disabled={totalCount >= maxTemplates || showSaveInput}
                  className="gap-1"
                >
                  <Upload className="size-4" />
                  {t("saveButton")}
                </Button>
              </div>
            </div>

            {/* Save input */}
            {showSaveInput && (
              <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <Label
                  htmlFor="save-name"
                  className="text-gray-900 dark:text-gray-100"
                >
                  {t("templateName")}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="save-name"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder={t("templatePlaceholder")}
                    maxLength={50}
                    disabled={isSaving}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave();
                      if (e.key === "Escape") setShowSaveInput(false);
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving || !saveName.trim()}
                  >
                    {isSaving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSaveInput(false)}
                    disabled={isSaving}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                {saveError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    {saveError}
                  </p>
                )}
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-center gap-2 border border-red-200 dark:border-red-800">
                <AlertCircle className="size-4" />
                {error}
              </div>
            )}

            {/* Templates list */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {isLoading && schedules.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              ) : schedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="size-12 mb-2 opacity-50" />
                  <p>{t("noTemplates")}</p>
                  <p className="text-sm">{t("noTemplatesHint")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {schedules.map((schedule: ScheduleListItem) => (
                    <div
                      key={schedule.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      {renamingId === schedule.id ? (
                        <div className="flex-1 flex gap-2">
                          <Input
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            maxLength={50}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRename(schedule.id);
                              if (e.key === "Escape") setRenamingId(null);
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleRename(schedule.id)}
                            disabled={!renameValue.trim()}
                          >
                            <Check className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setRenamingId(null)}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {schedule.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t("eventsCount", {
                                count: schedule.event_count,
                              })}{" "}
                              •{" "}
                              {t("updated", {
                                date: formatDate(schedule.updated_at),
                              })}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleLoad(schedule)}
                              title={t("buttons.load")}
                            >
                              <Download className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setRenamingId(schedule.id);
                                setRenameValue(schedule.name);
                              }}
                              title={t("buttons.rename")}
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteTarget(schedule)}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                              title={t("buttons.delete")}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || isLoading}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[80px] text-center">
                  {t("pagination", { page, total: totalPages })}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || isLoading}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("deleteConfirm.title")}
        description={t("deleteConfirm.description", {
          name: deleteTarget?.name || "",
        })}
        icon={Trash2}
        iconClassName="size-5 text-red-500"
        confirmText={t("deleteConfirm.button")}
        onConfirm={handleDelete}
        variant="destructive"
      />

      {/* Load confirmation */}
      <ConfirmDialog
        open={loadTarget !== null}
        onOpenChange={(open) => !open && setLoadTarget(null)}
        title={t("loadConfirm.title")}
        description={t("loadConfirm.description")}
        icon={Download}
        iconClassName="size-5 text-blue-500"
        confirmText={t("loadConfirm.button")}
        onConfirm={() => loadTarget && performLoad(loadTarget.id)}
        variant="blue"
      />

      {/* Overwrite confirmation */}
      <ConfirmDialog
        open={overwriteTarget !== null}
        onOpenChange={(open) => !open && setOverwriteTarget(null)}
        title={t("overwriteConfirm.title")}
        description={t("overwriteConfirm.description", {
          name: overwriteTarget?.name || "",
        })}
        icon={AlertCircle}
        iconClassName="size-5 text-amber-500"
        confirmText={t("overwriteConfirm.button")}
        onConfirm={handleOverwrite}
        variant="blue"
      />
    </>
  );
}
