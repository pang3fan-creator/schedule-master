import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getTemplate, getAllTemplateSlugs } from "@/lib/templates"
import { TemplateDetailClient } from "./TemplateDetailClient"
import type { Metadata } from "next"
import { locales } from '@/i18n/request'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tryschedule.com'

interface TemplatePageProps {
    params: Promise<{ locale: string; slug: string }>
}

// Generate static params for all templates x all locales
export async function generateStaticParams() {
    const slugs = getAllTemplateSlugs()
    return locales.flatMap((locale) =>
        slugs.map((slug) => ({ locale, slug }))
    )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
    const { locale, slug } = await params
    const template = getTemplate(slug, locale)
    const t = await getTranslations({ locale, namespace: 'Templates' })

    if (!template) {
        return {
            title: t('detail.notFound'),
        }
    }

    const title = template.title
    const description = template.description

    const templateUrl = locale === 'en'
        ? `${baseUrl}/templates/${slug}`
        : `${baseUrl}/${locale}/templates/${slug}`

    const baseKeywords = [template.slug.replace(/-/g, ' '), 'schedule builder', 'free template', template.category.toLowerCase()]
    const aiKeywords = template.slug === 'ai-schedule-builder'
        ? ['ai schedule generator', 'automated scheduling', 'smart planner', 'productivity ai']
        : template.slug === 'construction-schedule-builder'
            ? ['construction schedule builder', 'construction project management', 'gantt chart', 'contractor tools', 'site timeline']
            : []

    return {
        title: `${title} | TrySchedule Templates`,
        description: description,
        keywords: [...baseKeywords, ...aiKeywords],
        alternates: {
            canonical: templateUrl,
            languages: {
                'en': `${baseUrl}/templates/${slug}`,
                'es': `${baseUrl}/es/templates/${slug}`,
                'x-default': `${baseUrl}/templates/${slug}`,
            },
        },
    }
}

// Generate JSON-LD structured data
async function generateJsonLd(slug: string, locale: string) {
    const template = getTemplate(slug, locale)
    if (!template) return null

    const t = await getTranslations({ locale, namespace: 'Templates' })
    const commonT = await getTranslations({ locale, namespace: 'Common' })

    const title = template.title
    const description = template.description

    const templateUrl = locale === 'en'
        ? `${baseUrl}/templates/${slug}`
        : `${baseUrl}/${locale}/templates/${slug}`

    // WebApplication Schema
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": title,
        "description": description,
        "url": templateUrl,
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
            "ratingValue": "4.9",
            "ratingCount": "126",
        },
        "review": [
            {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Sarah M." },
                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                "reviewBody": t('detail.reviews.sarah')
            },
            {
                "@type": "Review",
                "author": { "@type": "Person", "name": "Mike T." },
                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                "reviewBody": t('detail.reviews.mike')
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
                "name": t('breadcrumb.home'),
                "item": baseUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": t('breadcrumb.templates'),
                "item": locale === 'en' ? `${baseUrl}/templates` : `${baseUrl}/${locale}/templates`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": templateUrl
            }
        ]
    }

    return { webAppSchema, breadcrumbSchema }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
    const { locale, slug } = await params
    setRequestLocale(locale)

    const template = getTemplate(slug, locale)

    if (!template) {
        notFound()
    }

    const jsonLd = await generateJsonLd(slug, locale)
    const { webAppSchema, breadcrumbSchema } = jsonLd || {}

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
            <TemplateDetailClient slug={slug} locale={locale} />
        </>
    )
}
