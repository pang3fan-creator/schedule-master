import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact Us | TrySchedule - Get Support & Feedback",
    description: "Have questions or feedback about TrySchedule? Contact our support team for help.",
    openGraph: {
        title: "Contact Us | TrySchedule - Get Support & Feedback",
        description: "Have questions or feedback about TrySchedule? Contact our support team for help.",
    },
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    },
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
