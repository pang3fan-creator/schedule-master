import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from "next";
import { locales } from '@/i18n/request';
import { PricingPageClient } from './PricingPageClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tryschedule.com';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Pricing' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        keywords: [
            "schedule builder pricing",
            "free schedule builder",
            "scheduling software cost",
            "scheduling app pricing",
            "free online schedule builder",
        ],
        openGraph: {
            title: t('metaTitle'),
            description: t('metaDescription'),
            type: "website",
        },
        alternates: {
            canonical: locale === 'en' ? `${siteUrl}/pricing` : `${siteUrl}/${locale}/pricing`,
            languages: {
                'en': `${siteUrl}/pricing`,
                'es': `${siteUrl}/es/pricing`,
                'x-default': `${siteUrl}/pricing`,
            },
        },
    };
}

// Generate Product Schema for structured data
function generateProductSchemas(locale: string) {
    // Use locale-specific URL for proper SEO
    const pricingUrl = locale === 'en' ? `${siteUrl}/pricing` : `${siteUrl}/${locale}/pricing`;

    return [
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule Starter (Free)",
            "description": "Free schedule builder for students and personal use",
            "image": `${siteUrl}/products/tryschedule-starter.png`,
            "url": pricingUrl,
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "priceValidUntil": "2026-12-31",
                "availability": "https://schema.org/InStock",
                "hasMerchantReturnPolicy": {
                    "@type": "MerchantReturnPolicy",
                    "applicableCountry": "US",
                    "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                    "merchantReturnDays": 0,
                    "returnMethod": "https://schema.org/ReturnByMail",
                    "returnFees": "https://schema.org/FreeReturn",
                },
                "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
                    "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
                    "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
                        "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
                    },
                },
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule 7-Day Pass",
            "description": "Full pro features for one week - PDF export, AI scheduling, cloud sync",
            "image": `${siteUrl}/products/tryschedule-7day.png`,
            "url": pricingUrl,
            "offers": {
                "@type": "Offer",
                "price": "4.9",
                "priceCurrency": "USD",
                "priceValidUntil": "2026-12-31",
                "availability": "https://schema.org/InStock",
                "hasMerchantReturnPolicy": {
                    "@type": "MerchantReturnPolicy",
                    "applicableCountry": "US",
                    "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                    "merchantReturnDays": 0,
                    "returnMethod": "https://schema.org/ReturnByMail",
                    "returnFees": "https://schema.org/FreeReturn",
                },
                "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
                    "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
                    "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
                        "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
                    },
                },
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule Monthly",
            "description": "Monthly subscription with all pro features including priority support",
            "image": `${siteUrl}/products/tryschedule-monthly.png`,
            "url": pricingUrl,
            "offers": {
                "@type": "Offer",
                "price": "9.9",
                "priceCurrency": "USD",
                "priceSpecification": { "@type": "UnitPriceSpecification", "price": "9.9", "priceCurrency": "USD", "billingDuration": "P1M" },
                "priceValidUntil": "2026-12-31",
                "availability": "https://schema.org/InStock",
                "hasMerchantReturnPolicy": {
                    "@type": "MerchantReturnPolicy",
                    "applicableCountry": "US",
                    "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                    "merchantReturnDays": 0,
                    "returnMethod": "https://schema.org/ReturnByMail",
                    "returnFees": "https://schema.org/FreeReturn",
                },
                "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
                    "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
                    "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
                        "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
                    },
                },
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule Lifetime",
            "description": "One-time payment for lifetime access to all pro features",
            "image": `${siteUrl}/products/tryschedule-lifetime.png`,
            "url": pricingUrl,
            "offers": {
                "@type": "Offer",
                "price": "49.9",
                "priceCurrency": "USD",
                "priceValidUntil": "2026-12-31",
                "availability": "https://schema.org/InStock",
                "hasMerchantReturnPolicy": {
                    "@type": "MerchantReturnPolicy",
                    "applicableCountry": "US",
                    "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
                    "merchantReturnDays": 0,
                    "returnMethod": "https://schema.org/ReturnByMail",
                    "returnFees": "https://schema.org/FreeReturn",
                },
                "shippingDetails": {
                    "@type": "OfferShippingDetails",
                    "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
                    "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" },
                    "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
                        "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
                    },
                },
            },
        },
    ];
}

export default async function PricingPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const productSchemas = generateProductSchemas(locale);

    return <PricingPageClient productSchemas={productSchemas} />;
}

