import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

/**
 * Get the date-fns locale object for a given locale string
 */
function getDateLocale(locale: string) {
  switch (locale) {
    case "es":
      return es;
    case "en":
    default:
      return enUS;
  }
}

/**
 * Format a date string according to the specified locale
 * @param dateString - ISO date string or date-like string
 * @param locale - The locale code ('en', 'es')
 * @param formatStr - Optional custom format string (default: 'PPP' for long date)
 * @returns Formatted date string
 *
 * @example
 * formatDate('2025-12-25', 'en') // "December 25, 2025"
 * formatDate('2025-12-25', 'es') // "25 de diciembre de 2025"
 */
export function formatDate(
  dateString: string,
  locale: string = "en",
  formatStr: string = "PPP",
): string {
  try {
    const date = new Date(dateString);
    return format(date, formatStr, { locale: getDateLocale(locale) });
  } catch (error) {
    // Fallback to original string if parsing fails
    return dateString;
  }
}

/**
 * Format a date with short format (e.g., "Dec 25, 2025" or "25 dic 2025")
 */
export function formatDateShort(
  dateString: string,
  locale: string = "en",
): string {
  return formatDate(dateString, locale, "PP");
}

/**
 * Format a date with numeric format (e.g., "12/25/2025" or "25/12/2025")
 */
export function formatDateNumeric(
  dateString: string,
  locale: string = "en",
): string {
  return formatDate(dateString, locale, "P");
}
