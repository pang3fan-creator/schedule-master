import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
export const locales = ["en", "es", "ar"] as const;
export const defaultLocale = "en" as const;

// RTL languages that require right-to-left layout
export const rtlLocales = ["ar"] as const;

export const isRtl = (locale: string): boolean => {
  return rtlLocales.includes(locale as (typeof rtlLocales)[number]);
};

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically comes from the [locale] segment
  let locale = await requestLocale;

  // Ensure that the incoming `locale` is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
