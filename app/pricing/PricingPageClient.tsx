"use client";

import { PricingCard } from "@/components/PricingCard";
import { FAQSection } from "@/components/FAQSection";
import { PageLayout } from "@/components/PageLayout";
import { useSearchParams } from "next/navigation";
import { Suspense, Fragment as ReactFragment, useState } from "react";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

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

interface PricingPageClientProps {
    productSchemas: object[];
}

export function PricingPageClient({ productSchemas }: PricingPageClientProps) {
    const [promoCode, setPromoCode] = useState("");
    const [isPromoApplied, setIsPromoApplied] = useState(false);

    const handleApplyPromo = () => {
        if (promoCode.trim()) {
            setIsPromoApplied(true);
        }
    };

    const handleRemovePromo = () => {
        setPromoCode("");
        setIsPromoApplied(false);
    };

    const plans = [
        {
            title: "Starter",
            price: "$0",
            priceDetail: "/ forever",
            description: "For students & personal use",
            features: [
                "Unlimited web editing",
                "Basic templates (Weekly/Daily)",
                "Download as image (JPG/PNG)",
                "Browser-based storage (No login needed)",
            ],
            buttonText: "Start Building for Free",
            buttonVariant: "secondary" as const,
            isFree: true,
        },
        {
            title: "7-Day Pass",
            price: "$4.9",
            priceDetail: "/ week",
            description: "Perfect for one-time scheduling.",
            features: [
                "All Starter features",
                "AI Auto-Scheduler",
                "High-Res Export (PDF & Vector)",
                "Google Calendar Sync",
                "Cloud Save (Access from any device)",
                "No Watermarks on exports",
            ],
            buttonText: "Choose Pass",
            buttonVariant: "secondary" as const,
            productId: PRODUCT_IDS["7day"],
        },
        {
            title: "Monthly",
            price: "$9.9",
            priceDetail: "/ month",
            description: "Ideal for managers, HR, frequent schedulers.",
            features: [
                "All Starter features",
                "AI Auto-Scheduler",
                "High-Res Export (PDF & Vector)",
                "Google Calendar Sync",
                "Cloud Save (Access from any device)",
                "No Watermarks on exports",
                "Priority Email Support",
            ],
            buttonText: "Upgrade to Pro",
            buttonVariant: "default" as const,
            popular: true,
            productId: PRODUCT_IDS.monthly,
        },
        {
            title: "Lifetime",
            price: "$49.9",
            priceDetail: "/ one-time",
            description: "Pay once and get all pro features forever.",
            features: [
                "All previous features",
                "One-time payment with lifetime use",
                "Priority Email Support",
            ],
            buttonText: "Buy Once",
            buttonVariant: "default" as const,
            productId: PRODUCT_IDS.lifetime,
            isLifetime: true,
        },
    ];

    const faqs = [
        {
            question: "Is the schedule builder really free?",
            answer:
                "Yes! Our free online schedule builder allows you to create, edit, and download schedules as images without paying a dime. You only pay if you need advanced features like PDF export or AI automation.",
        },
        {
            question: "How does the AI schedule builder work?",
            answer:
                "Our AI scheduler analyzes your input (tasks, employees, time slots) and automatically generates an optimized roster, saving you hours of manual planning.",
        },
        {
            question: "Can I use this for employee shift scheduling?",
            answer:
                "Absolutely. The Pro plan is designed for managers. You can build work shift schedules, handle rotations, and export the final roster to Excel for payroll easily.",
        },
        {
            question: "Can I cancel my subscription anytime?",
            answer:
                "Yes, you can cancel your monthly subscription instantly from your dashboard. No questions asked. 30-day money-back guarantee.",
        },
    ];

    const comparisonTable = [
        {
            category: "Core Tools",
            feature: "Drag-and-drop Builder",
            free: true,
            pass: true,
            pro: true,
            lifetime: true
        },
        {
            category: "Core Tools",
            feature: "Visual Schedule Builder",
            free: true,
            pass: true,
            pro: true,
            lifetime: true
        },
        {
            category: "Core Tools",
            feature: "Mobile-Friendly Editor",
            free: true,
            pass: true,
            pro: true,
            lifetime: true
        },
        {
            category: "Core Tools",
            feature: "Download As Image",
            free: true,
            pass: true,
            pro: true,
            lifetime: true
        },
        {
            category: "Export & Sharing",
            feature: "Printable PDF Export",
            free: false,
            pass: true,
            pro: true,
            lifetime: true
        },
        {
            category: "Export & Sharing",
            feature: "Export to Excel / CSV",
            free: false,
            pass: true,
            pro: true,
            lifetime: true
        },
        {
            category: "Export & Sharing",
            feature: "Sync to Google Calendar",
            free: false,
            pass: true,
            pro: true,
            lifetime: true
        },
        {
            category: "Advanced Power",
            feature: "AI Schedule Builder",
            free: false,
            pass: true,
            pro: true,
            lifetime: true
        },
        {
            category: "Advanced Power",
            feature: "Unlimited Templates",
            free: false,
            pass: true,
            pro: true,
            lifetime: true
        },
        {
            category: "Advanced Power",
            feature: "Cloud Storage",
            free: false,
            pass: true,
            pro: true,
            lifetime: true
        },
        {
            category: "Advanced Power",
            feature: "No Watermarks",
            free: false,
            pass: true,
            pro: true,
            lifetime: true
        },
        {
            category: "Advanced Power",
            feature: "Priority Email Support",
            free: false,
            pass: false,
            pro: true,
            lifetime: true
        },
    ];

    // Group comparison table by category
    const groupedTable = comparisonTable.reduce((acc, row) => {
        const category = row.category || "Other";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(row);
        return acc;
    }, {} as Record<string, typeof comparisonTable>);

    return (
        <>
            {/* Product Schema JSON-LD */}
            {productSchemas.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
            <PageLayout contentPadding="pt-16">
                {/* Success Banner */}
                <Suspense fallback={null}>
                    <SuccessBanner />
                </Suspense>

                {/* Breadcrumb Navigation */}
                <div className="container mx-auto px-4 mb-4">
                    <Breadcrumb items={[
                        { label: "Home", href: "/" },
                        { label: "Pricing" }
                    ]} />
                </div>

                {/* Hero Section */}
                <div className="container mx-auto px-4 text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                        Professional Scheduling Tools
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-2">
                        Start with our free schedule builder forever, or upgrade to Pro to automate your workflow with AI, export high-res PDFs.
                    </p>
                    <p className="text-sm text-gray-400 italic max-w-2xl mx-auto">
                        Trusted by 5000+ students and managers worldwide.
                    </p>
                </div>

                {/* Promo Code Section */}
                <div className="container mx-auto px-4 mb-8">
                    <div className="max-w-md mx-auto">
                        {!isPromoApplied ? (
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Enter promo code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        className="pl-10"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleApplyPromo();
                                            }
                                        }}
                                    />
                                </div>
                                <Button
                                    onClick={handleApplyPromo}
                                    disabled={!promoCode.trim()}
                                    variant="default"
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Apply
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-green-600" />
                                    <span className="font-medium text-green-800">
                                        Promo code: {promoCode}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleRemovePromo}
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-700 hover:text-green-900 hover:bg-green-100"
                                >
                                    Remove
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="container mx-auto px-4 mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => (
                            <PricingCard
                                key={plan.title}
                                {...plan}
                                promoCode={isPromoApplied ? promoCode : undefined}
                            />
                        ))}
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="container mx-auto px-4 mb-24 max-w-5xl">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Compare Plans & Features
                    </h2>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-6 py-4 text-left w-1/3">Feature</th>
                                    <th className="px-6 py-4 text-center w-1/6">Starter</th>
                                    <th className="px-6 py-4 text-center w-1/6">7-Day Pass</th>
                                    <th className="px-6 py-4 text-center w-1/6">Monthly</th>
                                    <th className="px-6 py-4 text-center w-1/6">Lifetime</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {Object.entries(groupedTable).map(([category, rows]) => (
                                    <ReactFragment key={category}>
                                        <tr className={`bg-gray-50/80`}>
                                            <td colSpan={5} className="px-6 py-4 font-semibold text-gray-900 text-sm tracking-wide uppercase">
                                                {category}
                                            </td>
                                        </tr>
                                        {rows.map((row) => (
                                            <tr key={row.feature} className="hover:bg-violet-50/30 transition-colors duration-150">
                                                <td className="px-6 py-4 font-medium text-gray-700">{row.feature}</td>
                                                <td className="px-6 py-4 text-center">{renderStatus(row.free)}</td>
                                                <td className="px-6 py-4 text-center">{renderStatus(row.pass)}</td>
                                                <td className="px-6 py-4 text-center">{renderStatus(row.pro)}</td>
                                                <td className="px-6 py-4 text-center">{renderStatus(row.lifetime)}</td>
                                            </tr>
                                        ))}
                                    </ReactFragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ Section - using unified FAQSection component */}
                <FAQSection items={faqs} bgColor="bg-white" />
            </PageLayout>
        </>
    );
}

function renderStatus(value: boolean | string) {
    if (typeof value === "string") {
        return <span className="text-gray-900 font-medium">{value}</span>;
    }
    return value ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Yes
        </span>
    ) : (
        <span className="text-gray-400 font-medium text-sm">No</span>
    );
}
