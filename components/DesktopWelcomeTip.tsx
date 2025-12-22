"use client"

import { useState, useEffect } from "react"
import { X, Move, MousePointer2, MousePointerClick, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const DESKTOP_TIP_STORAGE_KEY = "schedule-desktop-tip-shown"

interface DesktopWelcomeTipProps {
    onClose?: () => void
}

export function DesktopWelcomeTip({ onClose }: DesktopWelcomeTipProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Only show on desktop
        if (typeof window === "undefined") return
        if (window.innerWidth < 768) return

        // Check if user has already seen the tip
        const hasShown = localStorage.getItem(DESKTOP_TIP_STORAGE_KEY)
        if (!hasShown) {
            // Small delay to let page load
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        localStorage.setItem(DESKTOP_TIP_STORAGE_KEY, "true")
        onClose?.()
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                >
                    <X className="size-5" />
                </button>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pr-8">
                    Welcome! 👋
                </h3>

                {/* Tips */}
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Plus className="size-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Click to create</p>
                            <p className="text-sm text-gray-500">
                                Click on an empty cell to add a new event.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <MousePointer2 className="size-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Click to edit</p>
                            <p className="text-sm text-gray-500">
                                Click an event to edit it.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <Move className="size-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Drag to move</p>
                            <p className="text-sm text-gray-500">
                                Drag events up or down to adjust time.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <MousePointerClick className="size-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Right-click for menu</p>
                            <p className="text-sm text-gray-500">
                                Right-click an event for more options.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Got it button */}
                <Button
                    onClick={handleClose}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                >
                    Got it!
                </Button>
            </div>
        </div>
    )
}
