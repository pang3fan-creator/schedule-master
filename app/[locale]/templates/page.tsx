import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { locales } from "@/i18n/request";
import { TemplatesPageClient } from "./templates-page-client";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.tryschedule.com";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Templates" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: [
      "schedule templates",
      "free templates",
      "employee schedule template",
      "work schedule builder",
      "class schedule maker",
    ],
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
    },
    alternates: {
      canonical:
        locale === "en"
          ? `${siteUrl}/templates`
          : `${siteUrl}/${locale}/templates`,
      languages: {
        en: `${siteUrl}/templates`,
        es: `${siteUrl}/es/templates`,
        "x-default": `${siteUrl}/templates`,
      },
    },
  };
}

export default async function TemplatesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TemplatesPageClient locale={locale} />;
}
