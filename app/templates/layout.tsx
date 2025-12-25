import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Free Schedule Templates Library | TrySchedule",
    description: "Browse our collection of 20+ free printable schedule templates. Find the perfect template for work, class, and workout. Customize and download easily.",
    openGraph: {
        title: "Free Schedule Templates Library | TrySchedule",
        description: "Browse our collection of 20+ free printable schedule templates for work, class, and workout.",
    },
}

export default function TemplatesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
