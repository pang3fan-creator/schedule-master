"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, X } from "lucide-react"
import { type Event, EVENT_COLORS } from "@/lib/types"

interface MobileEventActionSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    event: Event | null
    onEdit: (event: Event) => void
    onDelete: (event: Event) => void
}

export function MobileEventActionSheet({
    open,
    onOpenChange,
    event,
    onEdit,
    onDelete,
}: MobileEventActionSheetProps) {
    if (!event) return null

    const colorConfig = EVENT_COLORS[event.color || "blue"]

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader className="pb-4">
                    <SheetTitle className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colorConfig.bg}`} />
                        {event.title}
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 pb-6">
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-3 h-12"
                        onClick={() => {
                            onEdit(event)
                            onOpenChange(false)
                        }}
                    >
                        <Edit2 className="size-5 text-blue-600" />
                        <span>Edit Event</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                            onDelete(event)
                            onOpenChange(false)
                        }}
                    >
                        <Trash2 className="size-5" />
                        <span>Delete Event</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="size-5 text-gray-500" />
                        <span>Cancel</span>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
