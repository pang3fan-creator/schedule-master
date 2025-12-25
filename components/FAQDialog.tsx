"use client"

import Link from "next/link"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FAQAccordion } from "@/components/FaqAccordion"
import { homepageFAQs } from "@/components/HomepageSEOContent"

interface FAQDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

/**
 * FAQDialog - A dialog component that displays FAQ content and footer information
 * 
 * This component does NOT use dynamic imports to ensure the FAQ content
 * is present in the initial HTML for SEO crawlers.
 */
export function FAQDialog({ open, onOpenChange }: FAQDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        Frequently Asked Questions
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <FAQAccordion items={homepageFAQs} />
                </div>

                {/* Footer Section */}
                <div className="mt-6 pt-6 flex flex-col items-center gap-2 text-sm text-gray-500">
                    {/* Row 1: Logo + Brand + Copyright */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <Link href="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                            <Image src="/logo.png" alt="TrySchedule - Free Online Schedule Builder" width={18} height={18} className="object-contain" />
                            <span className="text-blue-600"><span className="font-bold">Try</span><span className="font-normal">Schedule</span></span>
                        </Link>
                        <span className="text-gray-400">© 2025 TrySchedule. All rights reserved.</span>
                    </div>

                    {/* Row 2: Tagline */}
                    <p className="text-xs text-gray-400 italic text-center">
                        <span className="font-medium">Try</span>Schedule is the easiest free online schedule builder for students, managers, and teams.
                    </p>

                    {/* Row 3: Navigation Links */}
                    <div className="flex flex-wrap justify-center gap-6 mt-1">
                        <Link href="/pricing" className="hover:text-violet-600 transition-colors">Pricing</Link>
                        <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy</Link>
                        <Link href="/contact" className="hover:text-violet-600 transition-colors">Contact</Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
