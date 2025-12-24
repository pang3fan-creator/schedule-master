import type { Metadata } from "next"
import { PricingPageClient } from "./PricingPageClient"

export const metadata: Metadata = {
    title: "Pricing Plans | TrySchedule - Free Schedule Builder",
    description: "Compare TrySchedule free and pro plans. Create schedules for free, or upgrade to Pro for PDF export, AI scheduling, and cloud sync from $4.9/week.",
    keywords: [
        "schedule builder pricing",
        "free schedule maker",
        "scheduling software cost",
        "scheduling app pricing",
        "free online schedule builder",
    ],
    openGraph: {
        title: "Pricing Plans | TrySchedule",
        description: "Compare TrySchedule free and pro plans. PDF export, AI scheduling from $4.9/week.",
        type: "website",
    },
    alternates: {
        canonical: "https://tryschedule.com/pricing",
    },
}

// Generate Product Schema for structured data
function generateProductSchemas() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tryschedule.com'

    return [
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule Starter (Free)",
            "description": "Free schedule builder for students and personal use",
            "url": `${baseUrl}/pricing`,
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule 7-Day Pass",
            "description": "Full pro features for one week - PDF export, AI scheduling, cloud sync",
            "url": `${baseUrl}/pricing`,
            "offers": {
                "@type": "Offer",
                "price": "4.9",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule Monthly",
            "description": "Monthly subscription with all pro features including priority support",
            "url": `${baseUrl}/pricing`,
            "offers": {
                "@type": "Offer",
                "price": "9.9",
                "priceCurrency": "USD",
                "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "9.9",
                    "priceCurrency": "USD",
                    "billingDuration": "P1M",
                },
                "availability": "https://schema.org/InStock",
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule Lifetime",
            "description": "One-time payment for lifetime access to all pro features",
            "url": `${baseUrl}/pricing`,
            "offers": {
                "@type": "Offer",
                "price": "49.9",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
            },
        },
    ]
}

export default function PricingPage() {
    const productSchemas = generateProductSchemas()

    return <PricingPageClient productSchemas={productSchemas} />
}
