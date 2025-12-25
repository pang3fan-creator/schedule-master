"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Shield, Loader2, Check, X } from "lucide-react"

interface ProfileModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

/**
 * Custom profile management modal using Clerk hooks instead of Clerk's pre-built UserProfile.
 * This reduces bundle size by not loading Clerk's UserProfile UI component (~50KB+).
 */
export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
    const { user, isLoaded } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [saveSuccess, setSaveSuccess] = useState(false)

    // Initialize form when opening
    const handleOpenChange = (open: boolean) => {
        if (open && user) {
            setFirstName(user.firstName || "")
            setLastName(user.lastName || "")
        }
        if (!open) {
            setIsEditing(false)
            setSaveSuccess(false)
        }
        onOpenChange(open)
    }

    const handleSave = async () => {
        if (!user) return
        setIsSaving(true)
        try {
            await user.update({
                firstName,
                lastName,
            })
            setSaveSuccess(true)
            setIsEditing(false)
            setTimeout(() => setSaveSuccess(false), 2000)
        } catch (error) {
            console.error("Failed to update profile:", error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        if (user) {
            setFirstName(user.firstName || "")
            setLastName(user.lastName || "")
        }
        setIsEditing(false)
    }

    if (!isLoaded) {
        return null
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="size-5" />
                        Account Settings
                    </DialogTitle>
                </DialogHeader>

                {user && (
                    <div className="space-y-6 py-4">
                        {/* Profile Section */}
                        <div className="space-y-4">
                            {/* Avatar */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                                    {user.imageUrl ? (
                                        <img
                                            src={user.imageUrl}
                                            alt={user.firstName || "User"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xl font-medium">
                                            {user.firstName?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {user.primaryEmailAddress?.emailAddress}
                                    </p>
                                </div>
                            </div>

                            {/* Name Fields */}
                            {isEditing ? (
                                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor="firstName" className="text-xs">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="h-9"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="sm" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                        <Button size="sm" onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                "Save"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <User className="size-4" />
                                    Edit Profile
                                    {saveSuccess && <Check className="size-4 text-green-600 ml-auto" />}
                                </Button>
                            )}
                        </div>

                        {/* Email Section */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Mail className="size-4" />
                                Email Addresses
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                {user.emailAddresses.map((email) => (
                                    <div key={email.id} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-900">{email.emailAddress}</span>
                                        {email.id === user.primaryEmailAddressId && (
                                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Connected Accounts */}
                        {user.externalAccounts && user.externalAccounts.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Shield className="size-4" />
                                    Connected Accounts
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                                    {user.externalAccounts.map((account) => (
                                        <div key={account.id} className="flex items-center gap-2">
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                {account.provider === "google" && (
                                                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-900 capitalize">{account.provider}</span>
                                            <span className="text-xs text-gray-500">{account.emailAddress}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
