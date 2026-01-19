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
import { AlertCircle, Trash2, Edit2, X } from "lucide-react"
import type { Event } from "@/lib/types"
import { useTranslations } from "next-intl"
import { formatEventTimeRange } from "@/lib/event-conflict"

interface ConflictDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    conflictingEvents: Event[]
    newEventTitle: string
    onDeleteExisting: () => void
    onEditNew: () => void // Changed from onModifyNew
    onCancel: () => void
}

export function ConflictDialog({
    open,
    onOpenChange,
    conflictingEvents,
    newEventTitle,
    onDeleteExisting,
    onEditNew, // Changed from onModifyNew
    onCancel,
}: ConflictDialogProps) {
    const t = useTranslations('EventConflict')

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                            <AlertCircle className="size-6 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {t('title')}
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                        {t('description', { title: newEventTitle })}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
                        {t('listTitle')}
                    </h4>
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
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="sm:flex-1">
                        <X className="size-4 mr-2" />
                        {t('buttons.cancel')}
                    </Button>
                    <Button variant="outline" onClick={onEditNew} className="sm:flex-1">
                        <Edit2 className="size-4 mr-2" />
                        {t('buttons.modify')}
                    </Button>
                    <Button variant="destructive" onClick={onDeleteExisting} className="sm:flex-1">
                        <Trash2 className="size-4 mr-2" />
                        {t('buttons.delete', { count: conflictingEvents.length })}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
