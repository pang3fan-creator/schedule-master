import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/PageLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Metadata } from "next";
import { locales } from "@/i18n/request";

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
  const t = await getTranslations({ locale, namespace: "Terms" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical:
        locale === "en" ? `${siteUrl}/terms` : `${siteUrl}/${locale}/terms`,
      languages: {
        en: `${siteUrl}/terms`,
        es: `${siteUrl}/es/terms`,
        "x-default": `${siteUrl}/terms`,
      },
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Terms");

  return (
    <PageLayout>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: t("breadcrumb.home"), href: "/" },
              { label: t("breadcrumb.terms") },
            ]}
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          {t("title")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-12 text-center">
          {t("lastUpdated")}
        </p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("sections.acceptance.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("sections.acceptance.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("sections.description.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("sections.description.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("sections.userAccounts.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("sections.userAccounts.intro")}
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
              {(t.raw("sections.userAccounts.items") as string[]).map(
                (item, index) => (
                  <li key={index}>{item}</li>
                ),
              )}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("sections.payment.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("sections.payment.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("sections.acceptableUse.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("sections.acceptableUse.intro")}
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
              {(t.raw("sections.acceptableUse.items") as string[]).map(
                (item, index) => (
                  <li key={index}>{item}</li>
                ),
              )}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("sections.thirdParty.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("sections.thirdParty.content1")}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("sections.thirdParty.content2")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("sections.intellectualProperty.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("sections.intellectualProperty.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("sections.liability.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("sections.liability.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("sections.changes.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("sections.changes.content")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {t("sections.contact.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t("sections.contact.content")}{" "}
              <a
                href="mailto:support@tryschedule.com"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors font-medium"
              >
                support@tryschedule.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
