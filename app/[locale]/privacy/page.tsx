import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageLayout } from "@/components/PageLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Metadata } from "next";
import { locales } from '@/i18n/request';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tryschedule.com';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Privacy' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: locale === 'en' ? `${siteUrl}/privacy` : `${siteUrl}/${locale}/privacy`,
            languages: {
                'en': `${siteUrl}/privacy`,
                'es': `${siteUrl}/es/privacy`,
                'x-default': `${siteUrl}/privacy`,
            },
        },
    };
}

export default async function PrivacyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Privacy');

    return (
        <PageLayout>
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Breadcrumb Navigation */}
                <div className="mb-6">
                    <Breadcrumb items={[
                        { label: t('breadcrumb.home'), href: "/" },
                        { label: t('breadcrumb.privacy') }
                    ]} />
                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    {t('title')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-12 text-center">
                    {t('lastUpdated')}
                </p>

                <div className="prose prose-gray max-w-none">
                    {/* Section 1: Introduction */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.introduction.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.introduction.content')}
                        </p>
                    </section>

                    {/* Section 2: Information We Collect */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.informationCollect.title')}
                        </h2>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                            {t('sections.informationCollect.personalInfo.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.informationCollect.personalInfo.intro')}
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                            {(t.raw('sections.informationCollect.personalInfo.items') as string[]).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                            {t('sections.informationCollect.usageInfo.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.informationCollect.usageInfo.intro')}
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                            {(t.raw('sections.informationCollect.usageInfo.items') as string[]).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 3: How We Use Your Information */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.howWeUse.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.howWeUse.intro')}
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                            {(t.raw('sections.howWeUse.items') as string[]).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 4: Information Sharing */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.informationSharing.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.informationSharing.intro')}
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                            {(t.raw('sections.informationSharing.items') as string[]).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 5: Analytics and Third-Party Tools */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.analytics.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.analytics.intro')}
                        </p>

                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                            {t('sections.analytics.googleAnalytics.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.analytics.googleAnalytics.content')}{" "}
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors font-medium"
                            >
                                {t('sections.analytics.googleAnalytics.linkText')}
                            </a>.
                        </p>

                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                            {t('sections.analytics.microsoftClarity.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.analytics.microsoftClarity.content')}{" "}
                            <a
                                href="https://privacy.microsoft.com/en-us/privacystatement"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors font-medium"
                            >
                                {t('sections.analytics.microsoftClarity.linkText')}
                            </a>.
                        </p>

                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                            {t('sections.analytics.optingOut.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.analytics.optingOut.content')}
                        </p>
                    </section>

                    {/* Section 6: Google User Data */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.googleUserData.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.googleUserData.intro')}
                        </p>

                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                            {t('sections.googleUserData.infoAccess.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.googleUserData.infoAccess.intro')}
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                            {(t.raw('sections.googleUserData.infoAccess.items') as string[]).map((item, index) => (
                                <li key={index} dangerouslySetInnerHTML={{ __html: item.replace(/^([^:]+):/, '<strong>$1:</strong>') }} />
                            ))}
                        </ul>

                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                            {t('sections.googleUserData.howWeUseData.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.googleUserData.howWeUseData.content')}
                        </p>

                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">
                            {t('sections.googleUserData.limitedUse.title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.googleUserData.limitedUse.content')}{" "}
                            <a
                                href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors font-medium"
                            >
                                {t('sections.googleUserData.limitedUse.linkText')}
                            </a>
                            {t('sections.googleUserData.limitedUse.suffix')}
                        </p>
                    </section>

                    {/* Section 7: Data Security */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.dataSecurity.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.dataSecurity.content')}
                        </p>
                    </section>

                    {/* Section 8: Your Rights */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.yourRights.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.yourRights.intro')}
                        </p>
                        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                            {(t.raw('sections.yourRights.items') as string[]).map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 9: Cookies */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.cookies.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.cookies.content')}
                        </p>
                    </section>

                    {/* Section 10: Children's Privacy */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.childrenPrivacy.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.childrenPrivacy.content')}
                        </p>
                    </section>

                    {/* Section 11: Changes to This Policy */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.changes.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {t('sections.changes.content')}
                        </p>
                    </section>

                    {/* Section 12: Contact Us */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            {t('sections.contact.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            {t('sections.contact.content')}{" "}
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
