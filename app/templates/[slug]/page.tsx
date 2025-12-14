import { notFound } from "next/navigation";

interface TemplatePageProps {
    params: Promise<{ slug: string }>;
}

export default async function TemplatePage({ params }: TemplatePageProps) {
    const { slug } = await params;

    // TODO: Implement template-specific pages
    // For now, redirect to 404 as templates are not yet implemented
    notFound();
}
