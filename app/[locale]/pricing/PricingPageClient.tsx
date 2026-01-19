"use client";

import { useTranslations } from 'next-intl';
import { PricingCard } from "@/components/PricingCard";
import { FAQSection } from "@/components/FAQSection";
import { PageLayout } from "@/components/PageLayout";
import { useSearchParams } from "next/navigation";
import { Suspense, Fragment as ReactFragment, useState } from "react";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";

// Creem Product IDs
const PRODUCT_IDS = {
    "7day": process.env.NEXT_PUBLIC_CREEM_PRODUCT_7DAY || "prod_7day_placeholder",
    monthly: process.env.NEXT_PUBLIC_CREEM_PRODUCT_MONTHLY || "prod_monthly_placeholder",
    lifetime: process.env.NEXT_PUBLIC_CREEM_PRODUCT_LIFETIME || "prod_lifetime_placeholder",
};

function SuccessBanner() {
    const t = useTranslations('Pricing');
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get("success") === "true";

    if (!isSuccess) return null;

    return (
        <div className="container mx-auto px-4 mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                <p className="text-green-800 dark:text-green-300 font-medium">
                    {t('successBanner')}
                </p>
            </div>
        </div>
    );
}

interface PricingPageClientProps {
    productSchemas: object[];
}

export function PricingPageClient({ productSchemas }: PricingPageClientProps) {
    const t = useTranslations('Pricing');


    const plans = [
        {
            title: t('plans.starter.title'),
            price: "$0",
            priceDetail: t('plans.starter.priceDetail'),
            description: t('plans.starter.description'),
            features: t.raw('plans.starter.features') as string[],
            buttonText: t('plans.starter.buttonText'),
            buttonVariant: "secondary" as const,
            isFree: true,
        },
        {
            title: t('plans.sevenDay.title'),
            price: "$4.9",
            priceDetail: t('plans.sevenDay.priceDetail'),
            description: t('plans.sevenDay.description'),
            features: t.raw('plans.sevenDay.features') as string[],
            buttonText: t('plans.sevenDay.buttonText'),
            buttonVariant: "secondary" as const,
            productId: PRODUCT_IDS["7day"],
        },
        {
            title: t('plans.monthly.title'),
            price: "$9.9",
            priceDetail: t('plans.monthly.priceDetail'),
            description: t('plans.monthly.description'),
            features: t.raw('plans.monthly.features') as string[],
            buttonText: t('plans.monthly.buttonText'),
            buttonVariant: "default" as const,
            popular: true,
            productId: PRODUCT_IDS.monthly,
        },
        {
            title: t('plans.lifetime.title'),
            price: "$49.9",
            priceDetail: t('plans.lifetime.priceDetail'),
            description: t('plans.lifetime.description'),
            features: t.raw('plans.lifetime.features') as string[],
            buttonText: t('plans.lifetime.buttonText'),
            buttonVariant: "default" as const,
            productId: PRODUCT_IDS.lifetime,
            isLifetime: true,
        },
    ];

    const faqs = (t.raw('faq.items') as Array<{ question: string; answer: string }>);

    const comparisonTable = [
        { category: t('comparison.categories.coreTools'), feature: t('comparison.features.dragDrop'), free: true, pass: true, pro: true, lifetime: true },
        { category: t('comparison.categories.coreTools'), feature: t('comparison.features.visualBuilder'), free: true, pass: true, pro: true, lifetime: true },
        { category: t('comparison.categories.coreTools'), feature: t('comparison.features.mobileEditor'), free: true, pass: true, pro: true, lifetime: true },
        { category: t('comparison.categories.coreTools'), feature: t('comparison.features.downloadImage'), free: true, pass: true, pro: true, lifetime: true },
        { category: t('comparison.categories.exportSharing'), feature: t('comparison.features.pdfExport'), free: false, pass: true, pro: true, lifetime: true },
        { category: t('comparison.categories.exportSharing'), feature: t('comparison.features.excelExport'), free: false, pass: true, pro: true, lifetime: true },
        { category: t('comparison.categories.exportSharing'), feature: t('comparison.features.googleSync'), free: false, pass: true, pro: true, lifetime: true },
        { category: t('comparison.categories.advancedPower'), feature: t('comparison.features.aiBuilder'), free: false, pass: true, pro: true, lifetime: true },
        { category: t('comparison.categories.advancedPower'), feature: t('comparison.features.unlimitedTemplates'), free: false, pass: true, pro: true, lifetime: true },
        { category: t('comparison.categories.advancedPower'), feature: t('comparison.features.cloudStorage'), free: false, pass: true, pro: true, lifetime: true },
        { category: t('comparison.categories.advancedPower'), feature: t('comparison.features.noWatermarks'), free: false, pass: true, pro: true, lifetime: true },
        { category: t('comparison.categories.advancedPower'), feature: t('comparison.features.prioritySupport'), free: false, pass: false, pro: true, lifetime: true },
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

    const renderStatus = (value: boolean | string) => {
        if (typeof value === "string") {
            return <span className="text-gray-900 dark:text-white font-medium">{value}</span>;
        }
        return value ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                {t('comparison.yes')}
            </span>
        ) : (
            <span className="text-gray-400 dark:text-gray-600 font-medium text-sm">{t('comparison.no')}</span>
        );
    };

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
                        { label: t('breadcrumb.home'), href: "/" },
                        { label: t('breadcrumb.pricing') }
                    ]} />
                </div>

                {/* Hero Section */}
                <div className="container mx-auto px-4 text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
                        {t('hero.title')}
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-2">
                        {t('hero.subtitle')}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic max-w-2xl mx-auto">
                        {t('hero.trust')}
                    </p>
                </div>



                {/* Pricing Cards */}
                <div className="container mx-auto px-4 mb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => (
                            <PricingCard
                                key={plan.title}
                                {...plan}
                            />
                        ))}
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="container mx-auto px-4 mb-24 max-w-5xl">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        {t('comparison.title')}
                    </h2>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white font-medium">
                                <tr>
                                    <th className="px-6 py-4 text-left w-1/3">{t('comparison.headers.feature')}</th>
                                    <th className="px-6 py-4 text-center w-1/6">{t('comparison.headers.starter')}</th>
                                    <th className="px-6 py-4 text-center w-1/6">{t('comparison.headers.sevenDay')}</th>
                                    <th className="px-6 py-4 text-center w-1/6">{t('comparison.headers.monthly')}</th>
                                    <th className="px-6 py-4 text-center w-1/6">{t('comparison.headers.lifetime')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {Object.entries(groupedTable).map(([category, rows]) => (
                                    <ReactFragment key={category}>
                                        <tr className={`bg-gray-50/80 dark:bg-gray-900/30`}>
                                            <td colSpan={5} className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-sm tracking-wide uppercase">
                                                {category}
                                            </td>
                                        </tr>
                                        {rows.map((row) => (
                                            <tr key={row.feature} className="hover:bg-violet-50/30 dark:hover:bg-gray-700/30 transition-colors duration-150">
                                                <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">{row.feature}</td>
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

                {/* FAQ Section */}
                <FAQSection items={faqs} title={t('faq.title')} />
            </PageLayout>
        </>
    );
}
