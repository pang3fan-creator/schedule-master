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
import { Calendar, Link2, Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { useUser, useClerk } from "@clerk/nextjs"
import { type Event } from "@/lib/types"
import { EVENTS_STORAGE_KEY, CALENDAR_SYNC_MAPPINGS_KEY } from "@/lib/storage-keys"

interface CalendarSyncDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    weekStart: Date
    weekStartsOnSunday: boolean
}

interface SyncStatus {
    connected: boolean
    email?: string
    hasCalendarScope?: boolean
}

interface SyncResult {
    success: boolean
    synced: number
    failed: number
    errors?: Array<{ eventId: string; error: string }>
}

export function CalendarSyncDialog({ open, onOpenChange, weekStart, weekStartsOnSunday }: CalendarSyncDialogProps) {
    const { user } = useUser()
    const { openUserProfile } = useClerk()
    const [status, setStatus] = useState<SyncStatus | null>(null)
    const [loading, setLoading] = useState(true)
    const [syncing, setSyncing] = useState(false)
    const [syncResult, setSyncResult] = useState<SyncResult | null>(null)

    // 检查 Google 连接状态
    const checkStatus = useCallback(async () => {
        if (!open) return

        setLoading(true)
        try {
            const res = await fetch("/api/calendar/status")
            if (res.ok) {
                const data = await res.json()
                console.log("[CalendarSync] Status received:", data)
                setStatus(data)
            } else {
                console.log("[CalendarSync] API error:", res.status)
                setStatus({ connected: false })
            }
        } catch (err) {
            console.log("[CalendarSync] Fetch error:", err)
            setStatus({ connected: false })
        } finally {
            setLoading(false)
        }
    }, [open])

    useEffect(() => {
        if (open) {
            checkStatus()
            setSyncResult(null)
        }
    }, [open, checkStatus])

    // 关联 Google 账号 - 打开 Clerk 用户设置页面
    const handleConnectGoogle = () => {
        // 使用 Clerk 的用户设置弹窗，自动处理验证流程
        openUserProfile()
        onOpenChange(false)
    }

    // 执行同步
    const handleSync = async () => {
        setSyncing(true)
        setSyncResult(null)

        try {
            // 获取本地事件
            const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY)
            const events: Event[] = storedEvents ? JSON.parse(storedEvents) : []

            if (events.length === 0) {
                setSyncResult({
                    success: true,
                    synced: 0,
                    failed: 0,
                })
                setSyncing(false)
                return
            }

            // 获取已有的事件映射
            const storedMappings = localStorage.getItem(CALENDAR_SYNC_MAPPINGS_KEY)
            const existingMappings: Record<string, string> = storedMappings ? JSON.parse(storedMappings) : {}

            const res = await fetch("/api/calendar/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    events,
                    weekStart: weekStart.toISOString(),
                    weekStartsOnSunday,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    existingMappings,
                }),
            })

            const result = await res.json()

            // 保存更新后的映射
            if (result.mappings) {
                localStorage.setItem(CALENDAR_SYNC_MAPPINGS_KEY, JSON.stringify(result.mappings))
            }

            setSyncResult(result)
        } catch (error) {
            console.error("Sync failed:", error)
            setSyncResult({
                success: false,
                synced: 0,
                failed: 1,
                errors: [{ eventId: "unknown", error: "Failed to sync" }],
            })
        } finally {
            setSyncing(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Calendar className="size-5 text-blue-600 dark:text-blue-400" />
                        Google Calendar Sync
                    </DialogTitle>
                    <DialogDescription className="text-left text-gray-600 dark:text-gray-400">
                        Sync your schedule to Google Calendar for easy access on all devices.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="size-6 animate-spin text-gray-400 dark:text-gray-500" />
                        </div>
                    ) : !status?.connected ? (
                        // 未关联 Google 账号
                        <div className="text-center py-6">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Link2 className="size-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Connect Your Google Account
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                Link your Google account to sync events to your calendar.
                            </p>
                            <Button
                                onClick={handleConnectGoogle}
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            >
                                <svg className="size-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Connect Google Account
                            </Button>
                        </div>
                    ) : (
                        // 已关联 Google 账号
                        <div className="space-y-4">
                            {/* 连接状态 */}
                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                                <CheckCircle className="size-5 text-green-600 dark:text-green-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-green-800 dark:text-green-100">Connected</p>
                                    <p className="text-xs text-green-600 dark:text-green-300 truncate">{status.email}</p>
                                </div>
                            </div>

                            {/* 同步结果 */}
                            {syncResult && (
                                <div
                                    className={`p-3 rounded-lg border ${syncResult.success
                                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                                        : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {syncResult.success ? (
                                            <CheckCircle className="size-4 text-blue-600 dark:text-blue-400" />
                                        ) : (
                                            <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
                                        )}
                                        <span
                                            className={`text-sm font-medium ${syncResult.success ? "text-blue-800 dark:text-blue-100" : "text-red-800 dark:text-red-100"
                                                }`}
                                        >
                                            {syncResult.success ? "Sync Complete" : "Sync Failed"}
                                        </span>
                                    </div>
                                    <p
                                        className={`text-xs mt-1 ${syncResult.success ? "text-blue-600 dark:text-blue-300" : "text-red-600 dark:text-red-300"
                                            }`}
                                    >
                                        {syncResult.synced} event(s) synced
                                        {syncResult.failed > 0 && `, ${syncResult.failed} failed`}
                                    </p>
                                </div>
                            )}

                            {/* 同步按钮 */}
                            <Button
                                onClick={handleSync}
                                disabled={syncing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            >
                                {syncing ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Syncing...
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="size-4" />
                                        Sync to Google Calendar
                                    </>
                                )}
                            </Button>

                            {/* 打开 Google Calendar */}
                            <Button
                                variant="outline"
                                className="w-full gap-2"
                                onClick={() => window.open("https://calendar.google.com", "_blank")}
                            >
                                <ExternalLink className="size-4" />
                                Open Google Calendar
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
