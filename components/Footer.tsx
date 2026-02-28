import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

export function Footer() {
  const t = useTranslations("Common");
  const locale = useLocale();

  // Generate locale-aware URLs
  const getLocalizedUrl = (path: string) =>
    locale === "en" ? path : `/${locale}${path}`;

  // Template links - /templates first
  const templateLinks = [
    { href: "/templates", label: t("nav.allTemplates") },
    { href: "/templates/work-shift-schedule-builder", label: t("nav.workShiftSchedule") },
    { href: "/templates/employee-schedule-builder", label: t("nav.employeeSchedule") },
    { href: "/templates/college-class-schedule-builder", label: t("nav.collegeClassSchedule") },
    { href: "/templates/visual-schedule-builder", label: t("nav.visualScheduleBuilder") },
    { href: "/templates/ai-schedule-builder", label: t("nav.aiScheduleBuilder") },
    { href: "/templates/homeschool-schedule-builder", label: t("nav.homeschoolSchedule") },
    { href: "/templates/construction-schedule-builder", label: t("nav.constructionSchedule") },
    { href: "/templates/cleaning-schedule-builder", label: t("nav.cleaningSchedule") },
  ];

  // Blog links - /blog first
  const blogLinks = [
    { href: "/blog", label: t("nav.blog") },
    { href: "/blog/top-10-free-roster-makers-2025", label: t("nav.freeRosterMakers") },
  ];

  // Company links
  const companyLinks = [
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/terms", label: t("footer.terms") },
    { href: "/privacy", label: t("footer.privacy") },
    { href: "/contact", label: t("footer.contact") },
  ];

  const LinkItem = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={getLocalizedUrl(href)}
      className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
    >
      {label}
    </Link>
  );

  // Tagline component to avoid code duplication
  const Tagline = () => (
    <p className="text-xs text-gray-500 dark:text-gray-500 italic text-center">
      {t.rich("footer.tagline", {
        brand: (chunks) => (
          <strong className="font-medium text-gray-700 dark:text-gray-400">
            {chunks}
          </strong>
        ),
        highlight: (chunks) => (
          <strong className="font-medium text-gray-700 dark:text-gray-400">
            {chunks}
          </strong>
        ),
      })}
    </p>
  );

  // Logo component to avoid code duplication
  const Logo = ({ size = 16 }: { size?: number }) => (
    <Link
      href="/"
      aria-label="TrySchedule Home"
      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
    >
      <Image
        src="/icon.svg"
        alt="TrySchedule - Free Online Schedule Builder"
        width={size}
        height={size}
        className="object-contain"
      />
      <span className="text-blue-600 dark:text-blue-400">
        <span className="font-bold">Try</span>
        <span className="font-normal">Schedule</span>
      </span>
    </Link>
  );

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-6 md:py-8">
      {/* Desktop Layout - 4 columns centered (hidden on mobile) */}
      <div className="hidden md:block container mx-auto px-4">
        {/* Top: 4 columns - centered */}
        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-6 max-w-5xl">
            {/* Column 1: Templates Part 1 */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {t("nav.categoryTemplates")}
              </h3>
              {templateLinks.slice(0, 5).map((link) => (
                <LinkItem key={link.href} href={link.href} label={link.label} />
              ))}
            </div>

            {/* Column 2: Templates Part 2 */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 invisible">
                {t("nav.categoryTemplates")}
              </h3>
              {templateLinks.slice(5).map((link) => (
                <LinkItem key={link.href} href={link.href} label={link.label} />
              ))}
            </div>

            {/* Column 3: Blog */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {t("nav.categoryBlog")}
              </h3>
              {blogLinks.map((link) => (
                <LinkItem key={link.href} href={link.href} label={link.label} />
              ))}
            </div>

            {/* Column 4: Company */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {t("nav.categoryCompany")}
              </h3>
              {companyLinks.map((link) => (
                <LinkItem key={link.href} href={link.href} label={link.label} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Logo + Copyright - centered */}
        <div className="flex flex-col items-center gap-1 mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Logo size={16} />
            <span className="text-gray-600 dark:text-gray-500">
              © 2025 TrySchedule. {t("footer.rights")}
            </span>
          </div>
          <Tagline />
        </div>
      </div>

      {/* Mobile Layout - links first, then brand (hidden on desktop) */}
      <div className="md:hidden container mx-auto px-4 flex flex-col items-center gap-2 text-sm">
        {/* Links Section - compact flex layout */}
        <div className="w-full flex flex-col gap-2">
          {/* Row 1: Templates - full width */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-1">
              {t("nav.categoryTemplates")}
            </h3>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-gray-600 dark:text-gray-400">
              {templateLinks.map((link) => (
                <LinkItem key={link.href} href={link.href} label={link.label} />
              ))}
            </div>
          </div>

          {/* Row 2: Blog + Company side by side */}
          <div className="flex gap-4">
            {/* Blog */}
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-1">
                {t("nav.categoryBlog")}
              </h3>
              <div className="flex flex-col gap-0.5 text-gray-600 dark:text-gray-400">
                {blogLinks.map((link) => (
                  <LinkItem key={link.href} href={link.href} label={link.label} />
                ))}
              </div>
            </div>

            {/* Company */}
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-1">
                {t("nav.categoryCompany")}
              </h3>
              <div className="flex flex-col gap-0.5 text-gray-600 dark:text-gray-400">
                {companyLinks.map((link) => (
                  <LinkItem key={link.href} href={link.href} label={link.label} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Brand Section - Logo + Copyright - LAST */}
        <div className="flex flex-col items-center gap-0.5 pt-2 border-t border-gray-200 dark:border-gray-800 w-full">
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <Logo size={14} />
            <span className="text-gray-500 dark:text-gray-500 text-xs">
              © 2025 TrySchedule. {t("footer.rights")}
            </span>
          </div>
          <Tagline />
        </div>
      </div>
    </footer>
  );
}
