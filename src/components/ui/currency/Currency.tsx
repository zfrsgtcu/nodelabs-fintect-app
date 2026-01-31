"use client";

import type { HTMLAttributes } from "react";
import { formatCurrency } from "./formatCurrency";

export type CurrencyProps = {
  /** Amount to display. */
  value: number;
  /** ISO 4217 currency code (e.g. USD, TRY, EUR). */
  currency: string;
  /** BCP 47 locale for formatting (e.g. en-US, tr-TR). Default: en-US. */
  locale?: string;
  /** Minimum decimal places. */
  minimumFractionDigits?: number;
  /** Maximum decimal places. */
  maximumFractionDigits?: number;
  /** Wrapper element. Default: span. */
  as?: "span" | "div";
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

/**
 * Renders a formatted currency amount using Intl.NumberFormat.
 * Usage: <Currency value={1234.56} currency="USD" /> or <Currency value={125750.5} currency="TRY" locale="tr-TR" />
 */
export function Currency({
  value,
  currency,
  locale = "en-US",
  minimumFractionDigits,
  maximumFractionDigits,
  as: Comp = "span",
  className,
  ...rest
}: CurrencyProps) {
  const formatted = formatCurrency(value, currency, {
    locale,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return (
    <Comp className={className} {...rest}>
      {formatted}
    </Comp>
  );
}
