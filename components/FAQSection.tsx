"use client"

import { FAQAccordion } from "@/components/FaqAccordion"

export interface FAQItem {
    question: string
    answer: string
}

interface FAQSectionProps {
    /** Title of the FAQ section */
    title?: string
    /** Subtitle/description below the title */
    subtitle?: string
    /** FAQ items to display */
    items: FAQItem[]
    /** Background color class, defaults to "bg-white" */
    bgColor?: string
}

/**
 * FAQSection - A reusable FAQ section component with consistent styling
 * 
 * Used across:
 * - Homepage (HomepageSEOContent)
 * - Pricing page (PricingPageClient)
 * - Template detail pages
 * 
 * Features:
 * - Consistent max-w-5xl container width
 * - Optional title and subtitle
 * - Uses FAQAccordion for the accordion behavior
 * - Configurable background color
 */
export function FAQSection({
    title = "Frequently Asked Questions",
    subtitle,
    items,
    bgColor = "bg-white",
}: FAQSectionProps) {
    if (items.length === 0) return null

    return (
        <section className={`py-16 ${bgColor} relative`}>
            {/* 顶部装饰性分隔线 */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

            <div className="container mx-auto px-4 max-w-5xl">
                <h2 className={`text-3xl font-bold text-center text-gray-900 ${subtitle ? 'mb-4' : 'mb-12'}`}>
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-center text-gray-600 mb-12">
                        {subtitle}
                    </p>
                )}
                <div className="bg-gray-50 rounded-xl border border-slate-200 p-6 md:p-8 shadow-lg">
                    <FAQAccordion items={items} />
                </div>
            </div>
        </section>
    )
}
