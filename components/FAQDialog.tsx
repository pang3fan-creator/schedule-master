"use client"

import Link from "next/link"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useTranslations, useLocale } from "next-intl"

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
    const t = useTranslations('Common')
    const locale = useLocale()

    // Build FAQ array from translations
    const faqs = [
        { question: t('seo.faqs.q1.question'), answer: t('seo.faqs.q1.answer') },
        { question: t('seo.faqs.q2.question'), answer: t('seo.faqs.q2.answer') },
        { question: t('seo.faqs.q3.question'), answer: t('seo.faqs.q3.answer') },
        { question: t('seo.faqs.q4.question'), answer: t('seo.faqs.q4.answer') },
        { question: t('seo.faqs.q5.question'), answer: t('seo.faqs.q5.answer') },
        { question: t('seo.faqs.q6.question'), answer: t('seo.faqs.q6.answer') },
    ]

    // Helper for locale-aware links
    const getLocalizedUrl = (path: string) => locale === 'en' ? path : `/${locale}${path}`

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl max-h-[80vh] flex flex-col bg-white dark:bg-gray-900">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {t('seo.faqTitle')}
                    </DialogTitle>
                </DialogHeader>

                {/* Scrollable content area including FAQ and Footer */}
                <div className="flex-1 overflow-y-auto mt-4 pr-2">
                    {/* FAQ List */}
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-5 last:border-b-0">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer Section */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        {/* Row 1: Logo + Brand + Copyright */}
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            <Link href={getLocalizedUrl('/')} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                                <Image src="/icon.svg" alt="TrySchedule - Free Online Schedule Builder" width={18} height={18} className="object-contain" />
                                <span className="text-blue-600 dark:text-blue-400"><span className="font-bold">Try</span><span className="font-normal">Schedule</span></span>
                            </Link>
                            <span className="text-gray-400 dark:text-gray-500">© 2025 TrySchedule. {t('footer.rights')}</span>
                        </div>

                        {/* Row 2: Navigation Links */}
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link href={getLocalizedUrl('/pricing')} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t('nav.pricing')}</Link>
                            <Link href={getLocalizedUrl('/terms')} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t('footer.terms')}</Link>
                            <Link href={getLocalizedUrl('/privacy')} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t('footer.privacy')}</Link>
                            <Link href={getLocalizedUrl('/contact')} className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{t('footer.contact')}</Link>
                        </div>

                        {/* Row 3: Tagline */}
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center">
                            <span className="font-medium">Try</span>Schedule {t('footer.taglineSimple')}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

