import type { Metadata } from "next"
import { PricingPageClient } from "./PricingPageClient"

export const metadata: Metadata = {
    title: "Affordable Scheduling | Pricing Plans - TrySchedule Pro",
    description: "Start for free or unlock PDF export and AI scheduling with TrySchedule Pro. Compare plans starting from $4.9/week.",
    keywords: [
        "schedule builder pricing",
        "free schedule maker",
        "scheduling software cost",
        "scheduling app pricing",
        "free online schedule builder",
    ],
    openGraph: {
        title: "Affordable Scheduling | Pricing Plans - TrySchedule Pro",
        description: "Start for free or unlock PDF export and AI scheduling with TrySchedule Pro.",
        type: "website",
    },
    alternates: {
        canonical: "https://www.tryschedule.com/pricing",
    },
}

// Generate Product Schema for structured data
function generateProductSchemas() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tryschedule.com'

    return [
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule Starter (Free)",
            "description": "Free schedule builder for students and personal use",
            "image": `${baseUrl}/products/tryschedule-starter.png`,
            "url": `${baseUrl}/pricing`,
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
                    "shippingRate": {
                        "@type": "MonetaryAmount",
                        "value": "0",
                        "currency": "USD",
                    },
                    "shippingDestination": {
                        "@type": "DefinedRegion",
                        "addressCountry": "US",
                    },
                    "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": {
                            "@type": "QuantitativeValue",
                            "minValue": 0,
                            "maxValue": 0,
                            "unitCode": "DAY",
                        },
                        "transitTime": {
                            "@type": "QuantitativeValue",
                            "minValue": 0,
                            "maxValue": 0,
                            "unitCode": "DAY",
                        },
                    },
                },
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule 7-Day Pass",
            "description": "Full pro features for one week - PDF export, AI scheduling, cloud sync",
            "image": `${baseUrl}/products/tryschedule-7day.png`,
            "url": `${baseUrl}/pricing`,
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
                    "shippingRate": {
                        "@type": "MonetaryAmount",
                        "value": "0",
                        "currency": "USD",
                    },
                    "shippingDestination": {
                        "@type": "DefinedRegion",
                        "addressCountry": "US",
                    },
                    "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": {
                            "@type": "QuantitativeValue",
                            "minValue": 0,
                            "maxValue": 0,
                            "unitCode": "DAY",
                        },
                        "transitTime": {
                            "@type": "QuantitativeValue",
                            "minValue": 0,
                            "maxValue": 0,
                            "unitCode": "DAY",
                        },
                    },
                },
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule Monthly",
            "description": "Monthly subscription with all pro features including priority support",
            "image": `${baseUrl}/products/tryschedule-monthly.png`,
            "url": `${baseUrl}/pricing`,
            "offers": {
                "@type": "Offer",
                "price": "9.9",
                "priceCurrency": "USD",
                "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": "9.9",
                    "priceCurrency": "USD",
                    "billingDuration": "P1M",
                },
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
                    "shippingRate": {
                        "@type": "MonetaryAmount",
                        "value": "0",
                        "currency": "USD",
                    },
                    "shippingDestination": {
                        "@type": "DefinedRegion",
                        "addressCountry": "US",
                    },
                    "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": {
                            "@type": "QuantitativeValue",
                            "minValue": 0,
                            "maxValue": 0,
                            "unitCode": "DAY",
                        },
                        "transitTime": {
                            "@type": "QuantitativeValue",
                            "minValue": 0,
                            "maxValue": 0,
                            "unitCode": "DAY",
                        },
                    },
                },
            },
        },
        {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "TrySchedule Lifetime",
            "description": "One-time payment for lifetime access to all pro features",
            "image": `${baseUrl}/products/tryschedule-lifetime.png`,
            "url": `${baseUrl}/pricing`,
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
                    "shippingRate": {
                        "@type": "MonetaryAmount",
                        "value": "0",
                        "currency": "USD",
                    },
                    "shippingDestination": {
                        "@type": "DefinedRegion",
                        "addressCountry": "US",
                    },
                    "deliveryTime": {
                        "@type": "ShippingDeliveryTime",
                        "handlingTime": {
                            "@type": "QuantitativeValue",
                            "minValue": 0,
                            "maxValue": 0,
                            "unitCode": "DAY",
                        },
                        "transitTime": {
                            "@type": "QuantitativeValue",
                            "minValue": 0,
                            "maxValue": 0,
                            "unitCode": "DAY",
                        },
                    },
                },
            },
        },
    ]
}

export default function PricingPage() {
    const productSchemas = generateProductSchemas()

    return <PricingPageClient productSchemas={productSchemas} />
}
