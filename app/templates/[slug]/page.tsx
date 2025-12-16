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
            title: "Template Not Found | Schedule Builder",
        }
    }

    return {
        title: `${template.title} | Schedule Builder Templates`,
        description: template.longDescription,
    }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
    const { slug } = await params
    const template = getTemplate(slug)

    if (!template) {
        notFound()
    }

    return <TemplateDetailClient slug={slug} />
}
