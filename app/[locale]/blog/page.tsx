import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { locales } from "@/i18n/request";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import { BlogPageClient } from "./blog-page-client";

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
  const t = await getTranslations({ locale, namespace: "Blog" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords")
      .split(",")
      .map((k) => k.trim()),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
    },
    alternates: {
      canonical:
        locale === "en" ? `${siteUrl}/blog` : `${siteUrl}/${locale}/blog`,
      languages: {
        en: `${siteUrl}/blog`,
        es: `${siteUrl}/es/blog`,
        "x-default": `${siteUrl}/blog`,
      },
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getAllPosts(locale);
  const categories = getAllCategories(locale);

  return (
    <BlogPageClient posts={posts} categories={categories} locale={locale} />
  );
}
