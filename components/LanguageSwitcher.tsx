"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"

import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const t = useTranslations('Common')

    const handleLanguageChange = (newLocale: string) => {
        // Set cookie to persist language preference
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`

        // Basic path modification logic for proxy/middleware setup
        // Remove current locale prefix if present
        let path = pathname
        if (path.startsWith(`/${locale}`)) {
            path = path.replace(`/${locale}`, '')
        }

        // Add new locale prefix (unless it's the default 'en')
        // Note: Since we want explicit /es for Spanish and / for English (default)
        if (newLocale === 'es') {
            router.push(`/es${path}`)
        } else {
            // For english, we use root path
            router.push(path || '/')
        }

        // Refresh to ensure middleware picks up the cookie if staying on same route (edge case)
        router.refresh()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 dark:hover:bg-gray-800", className)}>
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">{t('nav.language')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[100]">
                <DropdownMenuItem onClick={() => handleLanguageChange('en')} className={locale === 'en' ? "bg-accent" : ""}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('es')} className={locale === 'es' ? "bg-accent" : ""}>
                    Español
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
