"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { Event } from "@/components/weekly-calendar"
import { formatEventTimeRange } from "@/lib/event-conflict"

interface ConflictDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    conflictingEvents: Event[]
    newEventTitle: string
    onDeleteExisting: () => void
    onModifyNew: () => void
    onCancel: () => void
}

export function ConflictDialog({
    open,
    onOpenChange,
    conflictingEvents,
    newEventTitle,
    onDeleteExisting,
    onModifyNew,
    onCancel,
}: ConflictDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-amber-100">
                            <AlertTriangle className="size-5 text-amber-600" />
                        </div>
                        <div>
                            <DialogTitle>Time Conflict Detected</DialogTitle>
                            <DialogDescription className="mt-1">
                                "{newEventTitle}" conflicts with existing events.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-gray-600 mb-3">Conflicting events:</p>
                    <div className="space-y-2">
                        {conflictingEvents.map((event) => (
                            <div
                                key={event.id}
                                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <div className="font-medium text-gray-900">{event.title}</div>
                                <div className="text-sm text-gray-500">
                                    {formatEventTimeRange(event)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onModifyNew}
                        className="w-full sm:w-auto"
                    >
                        Modify New Event
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onDeleteExisting}
                        className="w-full sm:w-auto"
                    >
                        Delete Existing ({conflictingEvents.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
