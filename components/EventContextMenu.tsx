"use client"

import { useEffect, useRef, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

interface EventContextMenuProps {
    x: number
    y: number
    onEdit: () => void
    onDelete: () => void
    onClose: () => void
}

export function EventContextMenu({
    x,
    y,
    onEdit,
    onDelete,
    onClose,
}: EventContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x, y })

    // Adjust position to keep menu in viewport
    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect()
            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight

            let newX = x
            let newY = y

            // Adjust if menu would go off right edge
            if (x + rect.width > viewportWidth) {
                newX = viewportWidth - rect.width - 10
            }

            // Adjust if menu would go off bottom edge
            if (y + rect.height > viewportHeight) {
                newY = viewportHeight - rect.height - 10
            }

            setPosition({ x: newX, y: newY })
        }
    }, [x, y])

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose()
            }
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [onClose])

    return (
        <div
            ref={menuRef}
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]"
            style={{ left: position.x, top: position.y }}
        >
            <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => {
                    onEdit()
                    onClose()
                }}
            >
                <Pencil className="size-4" />
                Edit
            </button>
            <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => {
                    onDelete()
                    onClose()
                }}
            >
                <Trash2 className="size-4" />
                Delete
            </button>
        </div>
    )
}
