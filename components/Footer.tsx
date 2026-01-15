import Link from "next/link"
import Image from "next/image"
import PHBadge from "@/components/PHBadge"
import { useTranslations, useLocale } from "next-intl"


export function Footer() {
    const t = useTranslations('Common')
    const locale = useLocale()

    // Generate locale-aware URLs
    const getLocalizedUrl = (path: string) => locale === 'en' ? path : `/${locale}${path}`
    return (
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-6 md:py-8">

            {/* Desktop Layout - horizontal (hidden on mobile) */}
            <div className="hidden md:flex container mx-auto px-4 flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Image src="/icon.svg" alt="TrySchedule - Free Online Schedule Builder" width={16} height={16} className="object-contain" />
                            <span className="text-blue-600 dark:text-blue-400"><span className="font-bold">Try</span><span className="font-normal">Schedule</span></span>
                        </Link>
                        <span className="text-gray-600 dark:text-gray-500">© 2025 TrySchedule. {t('footer.rights')}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                        {t.rich('footer.tagline', {
                            brand: (chunks) => <strong className="font-medium text-gray-700 dark:text-gray-400">{chunks}</strong>,
                            highlight: (chunks) => <strong className="font-medium text-gray-700 dark:text-gray-400">{chunks}</strong>
                        })}
                    </p>
                </div>
                <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-4">
                        <PHBadge variant="inline" className="translate-y-0" />
                        <a href="https://www.nxgntools.com/tools/tryschedule?utm_source=tryschedule" target="_blank" rel="noopener" className="inline-block w-auto transition-transform hover:scale-105">
                            <img src="https://www.nxgntools.com/api/embed/tryschedule?type=LAUNCHING_SOON_ON" alt="NextGen Tools Badge - The #1 AI Tools Directory & Launch Platform" className="h-[38px] w-auto" />
                        </a>
                    </div>
                    <Link href={getLocalizedUrl("/pricing")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.pricing')}</Link>
                    <Link href={getLocalizedUrl("/terms")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.terms')}</Link>
                    <Link href={getLocalizedUrl("/privacy")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.privacy')}</Link>
                    <Link href={getLocalizedUrl("/contact")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.contact')}</Link>
                </div>
            </div>

            {/* Mobile Layout - stacked (hidden on desktop) */}
            <div className="md:hidden container mx-auto px-4 flex flex-col items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                {/* Row 1: Logo + Brand + Copyright */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    <Link href="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                        <Image src="/icon.svg" alt="TrySchedule - Free Online Schedule Builder" width={16} height={16} className="object-contain" />
                        <span className="text-blue-600 dark:text-blue-400"><span className="font-bold">Try</span><span className="font-normal">Schedule</span></span>
                    </Link>
                    <span className="text-gray-500 dark:text-gray-500">© 2025 TrySchedule. {t('footer.rights')}</span>
                </div>

                {/* Row 2: Navigation Links */}
                <div className="flex flex-wrap justify-center gap-4">
                    <Link href={getLocalizedUrl("/pricing")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.pricing')}</Link>
                    <Link href={getLocalizedUrl("/terms")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.terms')}</Link>
                    <Link href={getLocalizedUrl("/privacy")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.privacy')}</Link>
                    <Link href={getLocalizedUrl("/contact")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.contact')}</Link>
                </div>

                {/* Row 3: Tagline */}
                <p className="text-xs text-gray-500 dark:text-gray-500 italic text-center">
                    {t.rich('footer.tagline', {
                        brand: (chunks) => <strong className="font-medium text-gray-700 dark:text-gray-400">{chunks}</strong>,
                        highlight: (chunks) => <strong className="font-medium text-gray-700 dark:text-gray-400">{chunks}</strong>
                    })}
                </p>

                {/* Badges for Mobile */}
                <div className="mt-2 flex flex-col items-center gap-3">
                    <PHBadge variant="inline" />
                    <a href="https://www.nxgntools.com/tools/tryschedule?utm_source=tryschedule" target="_blank" rel="noopener" className="inline-block w-auto transition-transform hover:scale-105">
                        <img src="https://www.nxgntools.com/api/embed/tryschedule?type=LAUNCHING_SOON_ON" alt="NextGen Tools Badge - The #1 AI Tools Directory & Launch Platform" className="h-[42px] w-auto" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

