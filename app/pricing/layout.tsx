import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing | TrySchedule - Free & Pro Plans",
    description: "Start with our free schedule builder forever, or upgrade to Pro for AI automation, PDF export, and unlimited rosters. Professional scheduling tools for everyone.",
    openGraph: {
        title: "Pricing | TrySchedule",
        description: "Start with our free schedule builder forever, or upgrade to Pro for AI automation, PDF export, and unlimited rosters.",
        type: "website",
    },
};

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}



