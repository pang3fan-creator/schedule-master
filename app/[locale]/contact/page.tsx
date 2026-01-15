import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from "next";
import { locales } from '@/i18n/request';
import ContactPageClient from './ContactPageClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tryschedule.com';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Contact' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
        alternates: {
            canonical: locale === 'en' ? `${siteUrl}/contact` : `${siteUrl}/${locale}/contact`,
            languages: {
                'en': `${siteUrl}/contact`,
                'es': `${siteUrl}/es/contact`,
                'x-default': `${siteUrl}/contact`,
            },
        },
    };
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <ContactPageClient />;
}
