"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import { ReactNode, useEffect, useState } from "react"
import { enUS, esES } from "@clerk/localizations"

type ThemeClerkProviderProps = {
    children: ReactNode
    locale: string
}

export function ThemeClerkProvider({ children, locale }: ThemeClerkProviderProps) {
    const { theme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Determine if we should use dark theme
    // We check both theme and resolvedTheme to handle system preference
    // We only apply dark theme after mounting to avoid hydration mismatch
    const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark')

    return (
        <ClerkProvider
            localization={locale === 'es' ? esES : enUS}
            appearance={{
                baseTheme: isDark ? dark : undefined,
                variables: {
                    colorPrimary: '#3b82f6', // blue-500 matching app theme
                },
                elements: {
                    // Start of Selection
                    card: "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800",
                    headerTitle: "text-gray-900 dark:text-gray-100",
                    headerSubtitle: "text-gray-600 dark:text-gray-400",
                    socialButtonsBlockButton: "text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    socialButtonsBlockButtonText: "text-gray-600 dark:text-gray-300",
                    formFieldLabel: "text-gray-700 dark:text-gray-300",
                    formFieldInput: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
                    identityPreviewText: "text-gray-700 dark:text-gray-300",
                    identityPreviewEditButtonIcon: "text-gray-500 dark:text-gray-400",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm",
                    userButtonPopoverCard: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
                    userButtonPopoverActions: "border-gray-100 dark:border-gray-800",
                    userButtonPopoverActionButton: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
                    userButtonPopoverActionButtonIcon: "text-gray-500 dark:text-blue-400", // Make icons more visible in dark
                    userButtonPopoverFooter: "border-gray-100 dark:border-gray-800",
                    // End of Selection
                }
            }}
        >
            {children}
        </ClerkProvider>
    )
}
