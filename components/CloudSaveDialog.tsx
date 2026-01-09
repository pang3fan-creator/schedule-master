"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { type Event, type UserSchedule } from "@/lib/types"
import { EVENTS_STORAGE_KEY, SETTINGS_STORAGE_KEY } from "@/lib/storage-keys"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CloudSaveDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onLoadSchedule: (events: Event[], settings: Record<string, unknown> | null) => void
}

interface ScheduleListItem {
    id: string
    name: string
    event_count: number
    created_at: string
    updated_at: string
}

type SortOption = "updated" | "created" | "name"

export function CloudSaveDialog({ open, onOpenChange, onLoadSchedule }: CloudSaveDialogProps) {
    const [schedules, setSchedules] = useState<ScheduleListItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [totalCount, setTotalCount] = useState(0)
    const [maxTemplates, setMaxTemplates] = useState(50)

    // Pagination
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const pageSize = 5

    // Save mode
    const [showSaveInput, setShowSaveInput] = useState(false)
    const [saveName, setSaveName] = useState("")
    const [saveError, setSaveError] = useState<string | null>(null)

    // Rename mode
    const [renamingId, setRenamingId] = useState<string | null>(null)
    const [renameValue, setRenameValue] = useState("")

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<ScheduleListItem | null>(null)

    // Load confirmation
    const [loadTarget, setLoadTarget] = useState<ScheduleListItem | null>(null)

    // Overwrite confirmation (for duplicate name)
    const [overwriteTarget, setOverwriteTarget] = useState<{ id: string; name: string } | null>(null)

    // Sort option
    const [sortBy, setSortBy] = useState<SortOption>("updated")

    const fetchSchedules = useCallback(async (pageNum: number = 1, sort: SortOption = sortBy) => {
        setIsLoading(true)
        setError(null)
        try {
            const sortOrder = sort === "name" ? "asc" : "desc"
            const res = await fetch(`/api/schedules?page=${pageNum}&pageSize=${pageSize}&sortBy=${sort}&sortOrder=${sortOrder}`)
            if (!res.ok) {
                throw new Error("Failed to fetch schedules")
            }
            const data = await res.json()
            setSchedules(data.schedules || [])
            setTotalCount(data.pagination?.totalCount || 0)
            setTotalPages(data.pagination?.totalPages || 1)
            setPage(data.pagination?.page || 1)
            setMaxTemplates(data.maxTemplates || 50)
        } catch (err) {
            console.error("Error fetching schedules:", err)
            setError("Failed to load templates")
        } finally {
            setIsLoading(false)
        }
    }, [sortBy])

    useEffect(() => {
        if (open) {
            setPage(1)
            fetchSchedules(1)
            setShowSaveInput(false)
            setSaveName("")
            setSaveError(null)
            setRenamingId(null)
        }
    }, [open, fetchSchedules])

    // Handle sort change
    const handleSortChange = (newSort: SortOption) => {
        setSortBy(newSort)
        setPage(1)
        fetchSchedules(1, newSort)
    }

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchSchedules(newPage)
        }
    }

    const handleSave = async () => {
        if (!saveName.trim()) {
            setSaveError("Please enter a name")
            return
        }

        if (saveName.length > 50) {
            setSaveError("Name must be 50 characters or less")
            return
        }

        setIsSaving(true)
        setSaveError(null)

        try {
            const eventsStr = localStorage.getItem(EVENTS_STORAGE_KEY)
            const settingsStr = localStorage.getItem(SETTINGS_STORAGE_KEY)

            const events = eventsStr ? JSON.parse(eventsStr) : []
            const settings = settingsStr ? JSON.parse(settingsStr) : null

            const res = await fetch("/api/schedules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: saveName.trim(), events, settings }),
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.code === "DUPLICATE_NAME") {
                    setOverwriteTarget({ id: data.existingId, name: saveName.trim() })
                    return
                }
                throw new Error(data.error || "Failed to save")
            }

            // Success
            setShowSaveInput(false)
            setSaveName("")
            fetchSchedules()
        } catch (err) {
            console.error("Error saving:", err)
            setSaveError(err instanceof Error ? err.message : "Failed to save")
        } finally {
            setIsSaving(false)
        }
    }

    const handleOverwrite = async () => {
        if (!overwriteTarget) return

        setIsSaving(true)
        try {
            const eventsStr = localStorage.getItem(EVENTS_STORAGE_KEY)
            const settingsStr = localStorage.getItem(SETTINGS_STORAGE_KEY)

            const events = eventsStr ? JSON.parse(eventsStr) : []
            const settings = settingsStr ? JSON.parse(settingsStr) : null

            const res = await fetch(`/api/schedules/${overwriteTarget.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ events, settings }),
            })

            if (!res.ok) {
                throw new Error("Failed to overwrite")
            }

            setOverwriteTarget(null)
            setShowSaveInput(false)
            setSaveName("")
            fetchSchedules()
        } catch (err) {
            console.error("Error overwriting:", err)
            setSaveError("Failed to overwrite template")
        } finally {
            setIsSaving(false)
        }
    }

    const handleLoad = async (schedule: ScheduleListItem) => {
        // Check if localStorage has events
        const eventsStr = localStorage.getItem(EVENTS_STORAGE_KEY)
        if (eventsStr) {
            try {
                const events = JSON.parse(eventsStr)
                if (Array.isArray(events) && events.length > 0) {
                    // Show confirmation
                    setLoadTarget(schedule)
                    return
                }
            } catch {
                // Continue with load
            }
        }

        // Load directly
        await performLoad(schedule.id)
    }

    const performLoad = async (id: string) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/schedules/${id}`)
            if (!res.ok) {
                throw new Error("Failed to load template")
            }

            const data = await res.json()
            const schedule = data.schedule as UserSchedule

            // Apply to localStorage and notify parent
            onLoadSchedule(schedule.events, schedule.settings)
            onOpenChange(false)
        } catch (err) {
            console.error("Error loading:", err)
            setError("Failed to load template")
        } finally {
            setIsLoading(false)
            setLoadTarget(null)
        }
    }

    const handleRename = async (id: string) => {
        if (!renameValue.trim()) return

        if (renameValue.length > 50) {
            setError("Name must be 50 characters or less")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch(`/api/schedules/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: renameValue.trim() }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to rename")
            }

            setRenamingId(null)
            setRenameValue("")
            fetchSchedules()
        } catch (err) {
            console.error("Error renaming:", err)
            setError(err instanceof Error ? err.message : "Failed to rename")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return

        setIsLoading(true)
        try {
            const res = await fetch(`/api/schedules/${deleteTarget.id}`, {
                method: "DELETE",
            })

            if (!res.ok) {
                throw new Error("Failed to delete")
            }

            setDeleteTarget(null)
            fetchSchedules()
        } catch (err) {
            console.error("Error deleting:", err)
            setError("Failed to delete template")
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col bg-white dark:bg-gray-900">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                            <Cloud className="size-5 text-blue-600 dark:text-blue-400" />
                            Cloud Save
                        </DialogTitle>
                        <DialogDescription className="text-left text-gray-600 dark:text-gray-400">
                            Save your schedule to the cloud or load a saved template.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-hidden flex flex-col gap-4">
                        {/* Template count and actions */}
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>{totalCount}/{maxTemplates} templates used</span>
                            <div className="flex items-center gap-2">
                                {/* Sort selector */}
                                {totalCount > 1 && (
                                    <Select value={sortBy} onValueChange={(v) => handleSortChange(v as SortOption)}>
                                        <SelectTrigger className="w-[130px] h-8 text-xs">
                                            <ArrowUpDown className="size-3 mr-1" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="updated">Updated</SelectItem>
                                            <SelectItem value="created">Created</SelectItem>
                                            <SelectItem value="name">Name</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setShowSaveInput(true)
                                        setSaveError(null)
                                    }}
                                    disabled={totalCount >= maxTemplates || showSaveInput}
                                    className="gap-1"
                                >
                                    <Upload className="size-4" />
                                    Save Current
                                </Button>
                            </div>
                        </div>

                        {/* Save input */}
                        {showSaveInput && (
                            <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                <Label htmlFor="save-name" className="text-gray-900 dark:text-gray-100">Template Name</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="save-name"
                                        value={saveName}
                                        onChange={(e) => setSaveName(e.target.value)}
                                        placeholder="My Schedule"
                                        maxLength={50}
                                        disabled={isSaving}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSave()
                                            if (e.key === "Escape") setShowSaveInput(false)
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
                                    <p>No saved templates yet</p>
                                    <p className="text-sm">Save your first schedule to the cloud!</p>
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
                                                            if (e.key === "Enter") handleRename(schedule.id)
                                                            if (e.key === "Escape") setRenamingId(null)
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
                                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{schedule.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {schedule.event_count} events • Updated {formatDate(schedule.updated_at)}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleLoad(schedule)}
                                                            title="Load template"
                                                        >
                                                            <Download className="size-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => {
                                                                setRenamingId(schedule.id)
                                                                setRenameValue(schedule.name)
                                                            }}
                                                            title="Rename"
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => setDeleteTarget(schedule)}
                                                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                            title="Delete"
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
                                    Page {page} of {totalPages}
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
                title="Delete Template"
                description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                icon={Trash2}
                iconClassName="size-5 text-red-500"
                confirmText="Delete"
                onConfirm={handleDelete}
                variant="destructive"
            />

            {/* Load confirmation */}
            <ConfirmDialog
                open={loadTarget !== null}
                onOpenChange={(open) => !open && setLoadTarget(null)}
                title="Load Template"
                description="Your current schedule will be replaced with this template. This action cannot be undone."
                icon={Download}
                iconClassName="size-5 text-blue-500"
                confirmText="Load Template"
                onConfirm={() => loadTarget && performLoad(loadTarget.id)}
                variant="blue"
            />

            {/* Overwrite confirmation */}
            <ConfirmDialog
                open={overwriteTarget !== null}
                onOpenChange={(open) => !open && setOverwriteTarget(null)}
                title="Template Already Exists"
                description={`A template named "${overwriteTarget?.name}" already exists. Do you want to overwrite it with your current schedule?`}
                icon={AlertCircle}
                iconClassName="size-5 text-amber-500"
                confirmText="Overwrite"
                onConfirm={handleOverwrite}
                variant="blue"
            />
        </>
    )
}
