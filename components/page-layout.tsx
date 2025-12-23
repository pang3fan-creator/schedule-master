import { ReactNode } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"

interface PageLayoutProps {
    children: ReactNode
    /** Background color class, e.g., "bg-white", "bg-gray-50", "bg-gradient-to-b from-violet-50/30 via-white to-white" */
    bgColor?: string
    /** Custom padding for the content area. Defaults to "py-16" */
    contentPadding?: string
    /** Whether to show the footer. Defaults to true */
    showFooter?: boolean
    /** Whether to show the navbar. Defaults to true */
    showNavbar?: boolean
}

/**
 * PageLayout - A reusable layout component for pages with Navbar and Footer
 * 
 * This component provides:
 * - Fixed navbar at top
 * - Scrollable content area below navbar
 * - Footer that scrolls with content and stays at bottom
 * - Consistent page structure across all pages
 * 
 * Usage:
 * ```tsx
 * <PageLayout bgColor="bg-gray-50">
 *   <div className="container mx-auto px-4">
 *     Your page content here
 *   </div>
 * </PageLayout>
 * ```
 */
export function PageLayout({
    children,
    bgColor = "bg-white",
    contentPadding = "py-16",
    showFooter = true,
    showNavbar = true,
}: PageLayoutProps) {
    return (
        <div className={cn("h-screen flex flex-col overflow-hidden", bgColor)}>
            {showNavbar && <Navbar />}

            <main className="flex-1 overflow-y-auto">
                <div className="min-h-full flex flex-col">
                    <div className={cn("flex-1", contentPadding)}>
                        {children}
                    </div>
                    {showFooter && <Footer />}
                </div>
            </main>
        </div>
    )
}
