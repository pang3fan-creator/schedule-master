"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface FAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * FAQDialog - A dialog component that displays FAQ content and footer information
 *
 * This component does NOT use dynamic imports to ensure the FAQ content
 * is present in the initial HTML for SEO crawlers.
 */
export function FAQDialog({ open, onOpenChange }: FAQDialogProps) {
  const t = useTranslations("Common");
  const locale = useLocale();

  // Build FAQ array from translations
  const faqs = [
    { question: t("seo.faqs.q1.question"), answer: t("seo.faqs.q1.answer") },
    { question: t("seo.faqs.q2.question"), answer: t("seo.faqs.q2.answer") },
    { question: t("seo.faqs.q3.question"), answer: t("seo.faqs.q3.answer") },
    { question: t("seo.faqs.q4.question"), answer: t("seo.faqs.q4.answer") },
    { question: t("seo.faqs.q5.question"), answer: t("seo.faqs.q5.answer") },
    { question: t("seo.faqs.q6.question"), answer: t("seo.faqs.q6.answer") },
  ];

  // Helper for locale-aware links
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100%-2rem)] sm:max-w-2xl max-h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-gray-900"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row items-center justify-between px-6 pt-5 pb-2.5 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t("seo.faqTitle")}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 sm:size-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4 sm:size-5" />
          </Button>
        </DialogHeader>

        {/* Scrollable content area including FAQ and Footer */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* FAQ List */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-100 dark:border-gray-800 pb-5 last:border-b-0"
              >
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Footer Section - 3 column layout */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            {/* Links - 3 columns */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Column 1: Templates */}
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-1">
                  {t("nav.categoryTemplates")}
                </h4>
                <div className="flex flex-col gap-0.5 text-xs text-gray-600 dark:text-gray-400">
                  {templateLinks.slice(0, 5).map((link) => (
                    <LinkItem key={link.href} href={link.href} label={link.label} />
                  ))}
                </div>
              </div>

              {/* Column 2: Templates Part 2 */}
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-1 invisible">
                  {t("nav.categoryTemplates")}
                </h4>
                <div className="flex flex-col gap-0.5 text-xs text-gray-600 dark:text-gray-400">
                  {templateLinks.slice(5).map((link) => (
                    <LinkItem key={link.href} href={link.href} label={link.label} />
                  ))}
                </div>
              </div>

              {/* Column 3: Blog + Company */}
              <div className="flex flex-col gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-1">
                    {t("nav.categoryBlog")}
                  </h4>
                  <div className="flex flex-col gap-0.5 text-xs text-gray-600 dark:text-gray-400">
                    {blogLinks.map((link) => (
                      <LinkItem key={link.href} href={link.href} label={link.label} />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-1">
                    {t("nav.categoryCompany")}
                  </h4>
                  <div className="flex flex-col gap-0.5 text-xs text-gray-600 dark:text-gray-400">
                    {companyLinks.map((link) => (
                      <LinkItem key={link.href} href={link.href} label={link.label} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Section */}
            <div className="flex flex-col items-center gap-1 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <Link
                  href={getLocalizedUrl("/")}
                  className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/icon.svg"
                    alt="TrySchedule - Free Online Schedule Builder"
                    width={14}
                    height={14}
                    className="object-contain"
                  />
                  <span className="text-blue-600 dark:text-blue-400 text-xs">
                    <span className="font-bold">Try</span>
                    <span className="font-normal">Schedule</span>
                  </span>
                </Link>
                <span className="text-gray-400 dark:text-gray-500 text-xs">
                  © 2025 TrySchedule. {t("footer.rights")}
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center">
                <span className="font-medium">Try</span>Schedule{" "}
                {t("footer.taglineSimple")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
