"use client"

import { useState, useRef, useEffect } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { Crown, LogOut, Settings } from "lucide-react"
import { ProfileModal } from "@/components/ProfileModal"

interface UserAvatarProps {
    onOpenSubscription?: () => void
}

/**
 * Custom user avatar button using Clerk hooks instead of pre-built UI components.
 * This reduces bundle size by ~100KB by not loading the full Clerk UI library.
 */
export function UserAvatar({ onOpenSubscription }: UserAvatarProps) {
    const { user, isLoaded } = useUser()
    const { signOut } = useClerk()
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [menuOpen])

    if (!isLoaded) {
        // Skeleton while loading
        return <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse" />
    }

    if (!user) {
        return null
    }

    return (
        <>
            <div className="relative" ref={menuRef}>
                {/* Avatar Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="User menu"
                >
                    {user.imageUrl ? (
                        <img
                            src={user.imageUrl}
                            alt={user.firstName || "User"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                            {user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user.emailAddresses[0]?.emailAddress}
                            </p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    setMenuOpen(false)
                                    setProfileOpen(true)
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Settings className="size-4" />
                                Manage Account
                            </button>

                            {onOpenSubscription && (
                                <button
                                    onClick={() => {
                                        setMenuOpen(false)
                                        onOpenSubscription()
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Crown className="size-4" />
                                    My Subscription
                                </button>
                            )}
                        </div>

                        {/* Sign Out */}
                        <div className="border-t border-gray-100 py-1">
                            <button
                                onClick={() => signOut({ redirectUrl: "/" })}
                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="size-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Profile Modal - replaces Clerk's openUserProfile() */}
            <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} />
        </>
    )
}

