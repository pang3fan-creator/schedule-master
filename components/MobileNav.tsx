"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, Crown, Briefcase, GraduationCap, Dumbbell, Palette, Sparkles, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetPortal,
} from "@/components/ui/sheet"
import {
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs"
import { getAllTemplates } from "@/lib/templates"
import { cn } from "@/lib/utils"

// Dynamically import modals to reduce initial bundle size
const AuthModal = dynamic(() => import("@/components/AuthModal").then(m => m.AuthModal), { ssr: false })
const SubscriptionModal = dynamic(() => import("@/components/SubscriptionModal").then(m => m.SubscriptionModal), { ssr: false })

// Icon mapping for templates
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Briefcase,
    GraduationCap,
    Dumbbell,
    Palette,
    Sparkles,
}

const navLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
]

export function MobileNav() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const [open, setOpen] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in")
    const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
    const [showTemplates, setShowTemplates] = useState(false)

    const templates = getAllTemplates()

    // Ensure component is mounted before rendering Sheet to avoid hydration mismatch
    // Radix UI generates different IDs on server vs client for aria-controls
    useEffect(() => {
        setMounted(true)
    }, [])

    // Add body scroll lock when menu is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [open])

    const openAuthModal = (mode: "sign-in" | "sign-up") => {
        setOpen(false)
        setAuthMode(mode)
        setAuthModalOpen(true)
    }

    // Removed paywall check on template link click - users can now view all templates
    // Paywall is only triggered when clicking "Use This Template" button on detail page

    const isTemplatesActive = pathname.startsWith("/templates")

    // Render placeholder button during SSR to avoid hydration mismatch
    if (!mounted) {
        return (
            <>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-white hover:bg-white/10">
                    <Menu className="size-6" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </>
        )
    }

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen} modal={false}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-white hover:bg-white/10">
                        <Menu className="size-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetPortal>
                    {/* Manual Overlay to restore the background dimming lost by modal={false} */}
                    {open && (
                        <div
                            className="fixed inset-0 bg-black/50 z-[55] md:hidden animate-in fade-in duration-300"
                            onClick={() => setOpen(false)}
                            aria-hidden="true"
                        />
                    )}
                    <SheetContent side="left" className="w-[300px] p-0 z-[60]" hideClose>
                        <SheetHeader className="border-b px-4 h-16 flex items-center">
                            <SheetTitle className="flex items-center gap-2">
                                <Image src="/logo.png" alt="TrySchedule" width={28} height={28} className="object-contain" />
                                <span className="text-lg text-blue-600">
                                    <span className="font-bold">Try</span>
                                    <span className="font-normal">Schedule</span>
                                </span>
                            </SheetTitle>
                        </SheetHeader>

                        <nav className="flex flex-col gap-1 p-4">
                            {/* Home Link */}
                            <SheetClose asChild>
                                <Link
                                    href="/"
                                    className={cn(
                                        "py-3 px-2 rounded-lg font-medium",
                                        pathname === "/" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-700"
                                    )}
                                >
                                    Home
                                </Link>
                            </SheetClose>

                            {/* Templates Section */}
                            <div>
                                <button
                                    onClick={() => setShowTemplates(!showTemplates)}
                                    className={cn(
                                        "flex items-center justify-between w-full py-3 px-2 rounded-lg text-left",
                                        isTemplatesActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                                    )}
                                >
                                    <span className="font-medium">Templates</span>
                                    <ChevronRight className={cn(
                                        "size-4 transition-transform",
                                        showTemplates && "rotate-90"
                                    )} />
                                </button>

                                {showTemplates && (
                                    <div className="mt-2 ml-2 space-y-1">
                                        {templates.map((template) => {
                                            const IconComponent = template.icon ? iconMap[template.icon] : Briefcase
                                            return (
                                                <SheetClose asChild key={template.slug}>
                                                    <Link
                                                        href={`/templates/${template.slug}`}
                                                        className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50"
                                                    >
                                                        <div className="p-1 bg-blue-50 rounded shrink-0">
                                                            <IconComponent className="size-4 text-blue-600" />
                                                        </div>
                                                        <span className="text-sm text-gray-700 flex-1 truncate min-w-0">{template.title}</span>
                                                        {template.requiresPro && (
                                                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white shrink-0">
                                                                <Crown className="size-2.5" />
                                                                PRO
                                                            </span>
                                                        )}
                                                    </Link>
                                                </SheetClose>
                                            )
                                        })}
                                        <SheetClose asChild>
                                            <Link
                                                href="/templates"
                                                className="block py-2 px-3 text-sm text-blue-600 font-medium"
                                            >
                                                View All Templates
                                            </Link>
                                        </SheetClose>
                                    </div>
                                )}
                            </div>

                            {/* Other nav links */}
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href
                                return (
                                    <SheetClose asChild key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "py-3 px-2 rounded-lg font-medium",
                                                isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-700"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </SheetClose>
                                )
                            })}
                        </nav>

                        {/* Auth buttons at bottom */}
                        <div className="mt-auto border-t border-gray-200 px-4 py-2 safe-area-pb bg-white">
                            <SignedOut>
                                <div className="flex flex-col gap-2 py-2">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => openAuthModal("sign-in")}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => openAuthModal("sign-up")}
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                            </SignedOut>
                            <SignedIn>
                                <div className="flex items-center justify-between h-[54px]">
                                    <span className="text-sm text-gray-600 font-medium">Your Account</span>
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-9 h-9",
                                            },
                                        }}
                                    >
                                        <UserButton.MenuItems>
                                            <UserButton.Action
                                                label="My Subscription"
                                                labelIcon={<Crown className="h-4 w-4" />}
                                                onClick={() => {
                                                    setOpen(false)
                                                    setSubscriptionModalOpen(true)
                                                }}
                                            />
                                        </UserButton.MenuItems>
                                    </UserButton>
                                </div>
                            </SignedIn>
                        </div>
                    </SheetContent>
                </SheetPortal>
            </Sheet>

            {/* Auth Modal */}
            <AuthModal
                open={authModalOpen}
                onOpenChange={setAuthModalOpen}
                defaultMode={authMode}
            />

            {/* Subscription Modal */}
            <SubscriptionModal
                open={subscriptionModalOpen}
                onOpenChange={setSubscriptionModalOpen}
            />
        </>
    )
}
