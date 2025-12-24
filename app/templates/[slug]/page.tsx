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

    return {
        title: `${template.title} | TrySchedule Templates`,
        description: template.description,
        keywords: [template.slug.replace(/-/g, ' '), 'schedule builder', 'free template', template.category.toLowerCase()],
    }
}

// Generate JSON-LD structured data
function generateJsonLd(slug: string) {
    const template = getTemplate(slug)
    if (!template) return null

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tryschedule.com'

    // FAQPage Schema
    const faqSchema = template.faq && template.faq.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": template.faq.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer,
            },
        })),
    } : null

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
        },
    }

    return { faqSchema, webAppSchema }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
    const { slug } = await params
    const template = getTemplate(slug)

    if (!template) {
        notFound()
    }

    const jsonLd = generateJsonLd(slug)

    return (
        <>
            {/* JSON-LD Structured Data */}
            {jsonLd?.faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.faqSchema) }}
                />
            )}
            {jsonLd?.webAppSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.webAppSchema) }}
                />
            )}
            <TemplateDetailClient slug={slug} />
        </>
    )
}
