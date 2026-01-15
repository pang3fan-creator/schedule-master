"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, Crown, Briefcase, GraduationCap, Dumbbell, Palette, Sparkles, ChevronRight, Home, SprayCan, Calendar, HardHat } from "lucide-react"
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
import { getTemplateTranslation } from "@/lib/templates-translations"
import { cn } from "@/lib/utils"
import { useTranslations, useLocale } from "next-intl"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

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
    Home,
    SprayCan,
    Calendar,
    HardHat,
}

const navLinks = [
    { href: "/pricing", labelKey: "nav.pricing" },
    { href: "/blog", labelKey: "nav.blog" },
]

export function MobileNav() {
    const pathname = usePathname()
    const t = useTranslations('Common')
    const locale = useLocale()
    const [mounted, setMounted] = useState(false)
    const [open, setOpen] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in")
    const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
    const [showTemplates, setShowTemplates] = useState(false)

    const templates = getAllTemplates()

    // Generate locale-aware URLs
    const getLocalizedUrl = (path: string) => locale === 'en' ? path : `/${locale}${path}`

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
                    <span className="sr-only">{t('nav.openMenu')}</span>
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
                        <span className="sr-only">{t('nav.openMenu')}</span>
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
                    <SheetContent side="left" className="w-[300px] p-0 z-[60] gap-0 flex flex-col h-full dark:bg-gray-900" hideClose>
                        <SheetHeader className="border-b px-4 h-16 flex items-center shrink-0 dark:border-gray-800">
                            <SheetTitle className="flex items-center gap-2">
                                <Image src="/icon.svg" alt={t('brand.alt')} width={28} height={28} className="object-contain" />
                                <span className="text-lg text-blue-600 dark:text-blue-400">
                                    <span className="font-bold">Try</span>
                                    <span className="font-normal">Schedule</span>
                                </span>
                            </SheetTitle>
                            <div className="ml-auto mr-2">
                                <LanguageSwitcher />
                            </div>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto overscroll-contain">
                            <nav className="flex flex-col gap-1 p-4">
                                {/* Home Link */}
                                <SheetClose asChild>
                                    <Link
                                        href={getLocalizedUrl('/')}
                                        className={cn(
                                            "py-3 px-2 rounded-lg font-medium",
                                            pathname === "/" || pathname === `/${locale}` ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        )}
                                    >
                                        {t('nav.home')}
                                    </Link>
                                </SheetClose>

                                {/* Templates Section */}
                                <div>
                                    <button
                                        onClick={() => setShowTemplates(!showTemplates)}
                                        className={cn(
                                            "flex items-center justify-between w-full py-3 px-2 rounded-lg text-left",
                                            isTemplatesActive ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                        )}
                                    >
                                        <span className="font-medium">{t('nav.templates')}</span>
                                        <ChevronRight className={cn(
                                            "size-4 transition-transform",
                                            showTemplates && "rotate-90"
                                        )} />
                                    </button>

                                    {showTemplates && (
                                        <div className="mt-2 ml-2 space-y-1">
                                            {templates.map((template) => {
                                                const IconComponent = template.icon ? iconMap[template.icon] : Briefcase
                                                const translation = getTemplateTranslation(template.slug, locale)
                                                const displayTitle = translation?.title || template.title
                                                return (
                                                    <SheetClose asChild key={template.slug}>
                                                        <Link
                                                            href={getLocalizedUrl(`/templates/${template.slug}`)}
                                                            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                                                        >
                                                            <div className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded shrink-0">
                                                                <IconComponent className="size-4 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate min-w-0">{displayTitle}</span>
                                                            {template.requiresPro && (
                                                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white shrink-0">
                                                                    <Crown className="size-2.5" />
                                                                    {t('badge.pro')}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </SheetClose>
                                                )
                                            })}
                                            <SheetClose asChild>
                                                <Link
                                                    href={getLocalizedUrl('/templates')}
                                                    className="block py-2 px-3 text-sm text-blue-600 dark:text-blue-400 font-medium"
                                                >
                                                    {t('nav.viewAllTemplates')}
                                                </Link>
                                            </SheetClose>
                                        </div>
                                    )}
                                </div>

                                {/* Other nav links */}
                                {navLinks.map((link) => {
                                    const localizedHref = getLocalizedUrl(link.href)
                                    const isActive = pathname === link.href || pathname === localizedHref
                                    return (
                                        <SheetClose asChild key={link.href}>
                                            <Link
                                                href={localizedHref}
                                                className={cn(
                                                    "py-3 px-2 rounded-lg font-medium",
                                                    isActive ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                                )}
                                            >
                                                {t(link.labelKey)}
                                            </Link>
                                        </SheetClose>
                                    )
                                })}
                            </nav>
                        </div>

                        {/* Auth buttons at bottom */}
                        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-2 safe-area-pb bg-white dark:bg-gray-900 shrink-0">
                            <SignedOut>
                                <div className="flex flex-col gap-2 py-2">
                                    <Button
                                        variant="outline"
                                        className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                                        onClick={() => openAuthModal("sign-in")}
                                    >
                                        {t('auth.signIn')}
                                    </Button>
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                                        onClick={() => openAuthModal("sign-up")}
                                    >
                                        {t('auth.signUp')}
                                    </Button>
                                </div>
                            </SignedOut>
                            <SignedIn>
                                <div className="flex items-center justify-between h-[54px]">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('auth.yourAccount')}</span>
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
                                                label={t('auth.mySubscription')}
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
