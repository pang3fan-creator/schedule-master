import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  setRequestLocale,
  getTranslations,
} from "next-intl/server";
import { locales } from "@/i18n/request";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
      languages: {
        en: "/",
        es: "/es",
        "x-default": "/",
      },
    },
  };
}

import { SubscriptionProvider } from "@/components/SubscriptionContext";
import { SettingsProvider } from "@/components/SettingsContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeClerkProvider } from "@/components/ThemeClerkProvider";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.tryschedule.com";

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const tMetadata = await getTranslations({ locale, namespace: "Metadata" });
  const tReviews = await getTranslations({
    locale,
    namespace: "Templates.detail.reviews",
  });

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TrySchedule",
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    description: tMetadata("organizationDescription"),
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@tryschedule.com",
    },
  };

  // SoftwareApplication Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TrySchedule",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      priceValidUntil: "2026-12-31",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      ratingCount: "526",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Sarah M." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody: tReviews("sarah"),
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Mike T." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody: tReviews("mike"),
      },
    ],
  };

  return (
    <ThemeProvider>
      <ThemeClerkProvider locale={locale}>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* SoftwareApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <NextIntlClientProvider messages={messages}>
          <SettingsProvider>
            <SubscriptionProvider>{children}</SubscriptionProvider>
          </SettingsProvider>
        </NextIntlClientProvider>
      </ThemeClerkProvider>
    </ThemeProvider>
  );
}
