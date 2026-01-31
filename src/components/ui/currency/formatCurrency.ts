/**
 * Pure currency formatter using Intl.NumberFormat.
 * Safe to use in both server and client (no "use client").
 */

export type FormatCurrencyOptions = {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

/**
 * Formats a number as currency using Intl.NumberFormat.
 * Use in components or when you only need the string (e.g. tooltips, aria-labels).
 */
export function formatCurrency(
  value: number,
  currency: string,
  options: FormatCurrencyOptions = {}
): string {
  const { locale = "en-US", minimumFractionDigits, maximumFractionDigits } = options;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}
