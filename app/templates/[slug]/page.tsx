import { notFound } from "next/navigation"
import { getTemplate, getAllTemplateSlugs } from "@/lib/templates"
import { TemplateDetailClient } from "./TemplateDetailClient"
import type { Metadata } from "next"

interface TemplatePageProps {
    params: Promise<{ slug: string }>
}

// Generate static params for all templates
export async function generateStaticParams() {
    const slugs = getAllTemplateSlugs()
    return slugs.map((slug) => ({ slug }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
    const { slug } = await params
    const template = getTemplate(slug)

    if (!template) {
        return {
            title: "Template Not Found | TrySchedule",
        }
    }

    const baseKeywords = [template.slug.replace(/-/g, ' '), 'schedule builder', 'free template', template.category.toLowerCase()]
    const aiKeywords = template.slug === 'ai-schedule-builder'
        ? ['ai schedule generator', 'automated scheduling', 'smart planner', 'productivity ai']
        : template.slug === 'construction-schedule-builder'
            ? ['construction schedule builder', 'construction project management', 'gantt chart', 'contractor tools', 'site timeline']
            : []

    return {
        title: `${template.title} | TrySchedule Templates`,
        description: template.description,
        keywords: [...baseKeywords, ...aiKeywords],
    }
}

// Generate JSON-LD structured data
function generateJsonLd(slug: string) {
    const template = getTemplate(slug)
    if (!template) return null

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tryschedule.com'

    // WebApplication Schema
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": template.title,
        "description": template.description,
        "url": `${baseUrl}/templates/${template.slug}`,
        "applicationCategory": "SchedulingApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "priceValidUntil": "2026-12-31",
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "500",
        },
        "review": [
            {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Sarah M." },
                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                "reviewBody": "Best free schedule builder I've found. The drag-and-drop is so intuitive!"
            },
            {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Mike T." },
                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                "reviewBody": "Perfect for creating my weekly class schedule. Love the instant PNG export."
            }
        ],
    }

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Templates",
                "item": `${baseUrl}/templates`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": template.title,
                "item": `${baseUrl}/templates/${template.slug}`
            }
        ]
    }

    return { webAppSchema, breadcrumbSchema }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
    const { slug } = await params
    const template = getTemplate(slug)

    if (!template) {
        notFound()
    }

    const { webAppSchema, breadcrumbSchema } = generateJsonLd(slug) || {}

    return (
        <>
            {/* JSON-LD Structured Data */}
            {webAppSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
                />
            )}
            {breadcrumbSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
                />
            )}
            <TemplateDetailClient slug={slug} />
        </>
    )
}
