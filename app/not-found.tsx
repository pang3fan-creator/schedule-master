"use client";

import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { useTranslations, useLocale, NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";

function NotFoundContent() {
  const t = useTranslations("NotFound");
  const locale = useLocale();

  // Helper for locale-aware links
  const getLocalizedUrl = (path: string) =>
    locale === "en" ? path : `/${locale}${path}`;

  return (
    <PageLayout contentPadding="">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 animate-pulse">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("title")}
            </h2>
            <p className="text-lg text-gray-600 mb-2">{t("description")}</p>
            <p className="text-base text-gray-500">{t("hint")}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Link href={getLocalizedUrl("/")}>
                <Home className="w-5 h-5 mr-2" />
                {t("backHome")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="shadow-sm hover:shadow-md transition-all"
            >
              <Link href={getLocalizedUrl("/templates")}>
                <Search className="w-5 h-5 mr-2" />
                {t("browseTemplates")}
              </Link>
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 opacity-20">
            <div className="flex justify-center gap-4">
              <div
                className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-violet-600 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeClerkProvider } from "@/components/ThemeClerkProvider";

export default function NotFound() {
  return (
    <ThemeProvider>
      <ThemeClerkProvider locale="en">
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <NotFoundContent />
        </NextIntlClientProvider>
      </ThemeClerkProvider>
    </ThemeProvider>
  );
}
