import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Affordable Scheduling | Pricing Plans - TrySchedule Pro",
    description: "Start for free or unlock PDF export and AI scheduling with TrySchedule Pro. Compare plans starting from $4.9/week.",
    openGraph: {
        title: "Affordable Scheduling | Pricing Plans - TrySchedule Pro",
        description: "Start for free or unlock PDF export and AI scheduling with TrySchedule Pro. Compare plans starting from $4.9/week.",
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
