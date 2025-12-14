"use client";

import { PricingCard } from "@/components/pricing-card";
import { FAQAccordion } from "@/components/faq-accordion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Creem Product IDs - 需要在 Creem Dashboard 创建产品后替换
const PRODUCT_IDS = {
    "7day": process.env.NEXT_PUBLIC_CREEM_PRODUCT_7DAY || "prod_7day_placeholder",
    monthly: process.env.NEXT_PUBLIC_CREEM_PRODUCT_MONTHLY || "prod_monthly_placeholder",
    lifetime: process.env.NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME || "prod_lifetime_placeholder",
};

function SuccessBanner() {
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get("success") === "true";

    if (!isSuccess) return null;

    return (
        <div className="container mx-auto px-4 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-800 font-medium">
                    🎉 Payment successful! Your Pro features are now active.
                </p>
            </div>
        </div>
    );
}

export default function PricingPage() {
    const plans = [
        {
            title: "Free",
            price: "$0",
            description: "Get started with our basic features for individuals.",
            features: ["Basic scheduling", "Limited templates", "Watermarked exports"],
            buttonText: "Get Started",
            buttonVariant: "secondary" as const,
            isFree: true,
        },
        {
            title: "7-Day Pass",
            price: "$4.99",
            priceDetail: "/ week",
            description: "Perfect for one-time scheduling or temporary needs.",
            features: ["All Free features", "Watermark-free exports", "Premium templates"],
            buttonText: "Choose Pass",
            buttonVariant: "secondary" as const,
            productId: PRODUCT_IDS["7day"],
        },
        {
            title: "Monthly",
            price: "$9",
            priceDetail: "/ month",
            description: "Ideal for managers, HR, and frequent schedulers.",
            features: [
                "All previous features",
                "AI-powered suggestions",
                "Cloud saving & sync",
                "Priority support",
            ],
            buttonText: "Upgrade Now",
            buttonVariant: "default" as const,
            popular: true,
            productId: PRODUCT_IDS.monthly,
        },
        {
            title: "Lifetime",
            price: "$49",
            priceDetail: "/ one-time",
            description: "Pay once and get all pro features forever.",
            features: [
                "All Monthly features",
                "One-time payment",
                "Future updates included",
            ],
            buttonText: "Buy Once",
            buttonVariant: "secondary" as const,
            productId: PRODUCT_IDS.lifetime,
        },
    ];

    const faqs = [
        {
            question: "Can I cancel my subscription anytime?",
            answer:
                "Yes, you can cancel your Monthly Subscription at any time from your account settings. Your plan will remain active until the end of the current billing period. The 7-Day Pass and Lifetime Deal are one-time payments and do not require cancellation.",
        },
        {
            question: "What is the 7-Day Pass?",
            answer:
                "The 7-Day Pass is a one-time purchase that gives you access to all Pro features for 7 days. It does not auto-renew and is perfect for users who only need to create a schedule occasionally.",
        },
        {
            question: "What happens if I downgrade my Monthly plan?",
            answer:
                "If you downgrade, you will retain access to Pro features until the end of your billing cycle. After that, your account will revert to the Free plan, and you will lose access to premium features like cloud sync and AI suggestions.",
        },
    ];

    const comparisonTable = [
        { feature: "AI Features", free: false, pass: true, pro: true, lifetime: true },
        { feature: "No Watermark Export", free: false, pass: true, pro: true, lifetime: true },
        { feature: "Cloud Save", free: false, pass: true, pro: true, lifetime: true },
        { feature: "Unlimited Schedules", free: true, pass: true, pro: true, lifetime: true },
        { feature: "Priority Support", free: false, pass: false, pro: true, lifetime: true },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50/50">
            <Navbar />

            <main className="flex-1 py-16 md:py-24">
                {/* Success Banner */}
                <Suspense fallback={null}>
                    <SuccessBanner />
                </Suspense>

                {/* Hero Section */}
                <div className="container mx-auto px-4 text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Find the perfect plan for your needs. No hidden fees, no credit card required to start.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="container mx-auto px-4 mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => (
                            <PricingCard key={plan.title} {...plan} />
                        ))}
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="container mx-auto px-4 mb-24 max-w-5xl">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Compare plans
                    </h2>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Feature</th>
                                    <th className="px-6 py-4">Free</th>
                                    <th className="px-6 py-4">7-Day Pass</th>
                                    <th className="px-6 py-4">Pro</th>
                                    <th className="px-6 py-4">Lifetime Deal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {comparisonTable.map((row) => (
                                    <tr key={row.feature} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{row.feature}</td>
                                        <td className="px-6 py-4">{renderStatus(row.free)}</td>
                                        <td className="px-6 py-4">{renderStatus(row.pass)}</td>
                                        <td className="px-6 py-4">{renderStatus(row.pro)}</td>
                                        <td className="px-6 py-4">{renderStatus(row.lifetime)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                        <FAQAccordion items={faqs} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function renderStatus(value: boolean) {
    return value ? (
        <span className="text-blue-600 font-medium">Yes</span>
    ) : (
        <span className="text-gray-400">No</span>
    );
}
