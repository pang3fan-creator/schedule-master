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
    /** Background color class, defaults to "bg-gray-50" */
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
    bgColor = "bg-gray-50",
}: FAQSectionProps) {
    if (items.length === 0) return null

    return (
        <section className={`py-16 ${bgColor}`}>
            <div className="container mx-auto px-4 max-w-5xl">
                <h2 className={`text-3xl font-bold text-center text-gray-900 ${subtitle ? 'mb-4' : 'mb-12'}`}>
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-center text-gray-600 mb-12">
                        {subtitle}
                    </p>
                )}
                <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                    <FAQAccordion items={items} />
                </div>
            </div>
        </section>
    )
}
