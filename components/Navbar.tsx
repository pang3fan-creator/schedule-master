"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Crown, ChevronDown, Briefcase, GraduationCap, Dumbbell, Palette, Sparkles, Home, SprayCan, HardHat } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import { getAllTemplates } from "@/lib/templates"
import { getTemplateTranslation } from "@/lib/templates-translations"
import { MobileNav } from "@/components/MobileNav"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useTranslations, useLocale } from "next-intl"

// Dynamically import modals to reduce initial bundle size
// These are only loaded when user triggers authentication or subscription actions
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
  HardHat,
}

const navLinks = [
  { href: "/pricing", labelKey: "nav.pricing" },
  { href: "/blog", labelKey: "nav.blog" },
]

export function Navbar() {
  const pathname = usePathname()
  const t = useTranslations('Common')
  const locale = useLocale()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in")
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false)
  const [templatesDropdownOpen, setTemplatesDropdownOpen] = useState(false)

  const templates = getAllTemplates()

  // Generate locale-aware URLs
  const getLocalizedUrl = (path: string) => locale === 'en' ? path : `/${locale}${path}`

  const openAuthModal = (mode: "sign-in" | "sign-up") => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  // Removed paywall check on template link click - users can now view all templates
  // Paywall is only triggered when clicking "Use This Template" button on detail page

  const isTemplatesActive = pathname.startsWith("/templates")

  return (
    <>
      <header className="relative z-50 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-blue-600 md:bg-white/80 md:backdrop-blur-md px-4 md:px-6 shadow-sm transition-all dark:bg-gray-900/80 dark:border-gray-800">
        {/* Mobile: Hamburger Menu */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Left: Logo - absolutely centered on mobile, left-aligned on desktop */}
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <Image src="/icon.svg" alt={t('brand.alt')} width={32} height={32} className="object-contain" priority />
          <span className="text-lg text-blue-600 hidden sm:inline dark:text-blue-400">
            <span className="font-bold">Try</span><span className="font-normal">Schedule</span>
          </span>
        </Link>


        {/* Center: Navigation Links - Hidden on mobile */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
          <Link
            href={getLocalizedUrl('/')}
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === "/" || pathname === `/${locale}`
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-0.5"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            )}
          >
            {t('nav.home')}
          </Link>
          {/* Templates Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setTemplatesDropdownOpen(true)}
            onMouseLeave={() => setTemplatesDropdownOpen(false)}
          >
            <Link
              href={getLocalizedUrl('/templates')}
              className={cn(
                "text-sm font-medium transition-colors flex items-center gap-1",
                isTemplatesActive
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-0.5"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              )}
            >
              {t('nav.templates')}
              <ChevronDown className={cn(
                "size-3 transition-transform",
                templatesDropdownOpen && "rotate-180"
              )} />
            </Link>

            {/* Dropdown Menu */}
            {templatesDropdownOpen && (
              <div className="absolute top-full left-0 pt-2 w-72">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 overflow-hidden">
                  {templates.map((template) => {
                    const IconComponent = template.icon ? iconMap[template.icon] : Briefcase
                    const translation = getTemplateTranslation(template.slug, locale)
                    const displayTitle = translation?.title || template.title
                    return (
                      <Link
                        key={template.slug}
                        href={getLocalizedUrl(`/templates/${template.slug}`)}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                          <IconComponent className="size-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {displayTitle}
                            </span>
                            {template.requiresPro && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                                <Crown className="size-2.5" />
                                {t('badge.pro')}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                  <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                    <Link
                      href={getLocalizedUrl('/templates')}
                      className="flex items-center justify-center gap-1 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      {t('nav.viewAllTemplates')}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Other nav links */}
          {navLinks.map((link) => {
            const localizedHref = getLocalizedUrl(link.href)
            const isActive = pathname === link.href || pathname === localizedHref
            return (
              <Link
                key={link.href}
                href={localizedHref}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-0.5"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                )}
              >
                {t(link.labelKey)}
              </Link>
            )
          })}
        </nav>

        {/* Right: Auth Buttons - Hidden on mobile (available in MobileNav) */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <ThemeToggle />

          <SignedOut>
            <Button
              variant="ghost"
              className="hidden md:inline-flex text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => openAuthModal("sign-in")}
            >
              {t('auth.signIn')}
            </Button>
            <Button
              className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
              onClick={() => openAuthModal("sign-up")}
            >
              {t('auth.signUp')}
            </Button>
          </SignedOut>
          <SignedIn>
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
                  onClick={() => setSubscriptionModalOpen(true)}
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </header>

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
