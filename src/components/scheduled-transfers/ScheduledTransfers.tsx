"use client";

import Link from "next/link";
import { formatCurrency } from "@/components/ui/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { useScheduledTransfers } from "@/hooks/use-api";
import type { ScheduledTransfer } from "@/services";

const SCHEDULED_LOADING_ITEMS = 5;

function ScheduledTransfersSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading scheduled transfers">
      {Array.from({ length: SCHEDULED_LOADING_ITEMS }).map((_, i) => (
        <div
          key={i}
          className="flex flex-row justify-between items-center py-[10px] -mx-[10px] px-[10px] rounded-lg border-b border-gray-light last:border-b-0"
        >
          <div className="gap-[15px] flex flex-row items-center min-w-0 flex-1">
            <Skeleton width={40} height={40} rounded="full" className="flex-shrink-0" />
            <div className="flex flex-col gap-[7px]">
              <Skeleton width={120} height={14} />
              <Skeleton width={160} height={12} />
            </div>
          </div>
          <Skeleton width={72} height={18} className="shrink-0" />
        </div>
      ))}
    </div>
  );
}

function formatScheduledAt(isoDate: string): string {
  const d = new Date(isoDate);
  const datePart = d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${datePart} at ${timePart}`;
}

/** API returns currency as "$"; formatCurrency expects code like "USD" */
function currencyCode(currency: string): string {
  return currency === "$" ? "USD" : currency;
}

function TransferItem({ transfer }: { transfer: ScheduledTransfer }) {
  return (
    <div className="flex flex-row justify-between items-center py-[10px] -mx-[10px] px-[10px] rounded-lg border-b border-gray-light last:border-b-0 transition-colors duration-200 hover:bg-gray-light-soft">
      <div className="gap-[15px] flex flex-row items-center min-w-0 flex-1">
        <div className="relative rounded-full overflow-hidden h-10 w-10 flex-shrink-0 bg-gray-light">
          <img
            src={transfer.image}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <span
            className="absolute inset-0 hidden items-center justify-center text-slate text-sm font-[600] font-kumbh-sans"
            aria-hidden
          >
            {transfer.name.charAt(0)}
          </span>
        </div>
        <div className="flex flex-col gap-[7px] min-w-0">
          <p className="text-sm text-slate-dark">
            <strong>{transfer.name}</strong>
          </p>
          <p className="text-xs text-slate">
            {formatScheduledAt(transfer.date)}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-[7px] shrink-0">
        <span className="vr-horizontal text-[25px]" aria-hidden>
          -
        </span>
        <p className="font-[600] text-slate-dark">
          {formatCurrency(Math.abs(transfer.amount), currencyCode(transfer.currency), {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}

export type ScheduledTransfersProps = {
  /** When true, the "View All" link is hidden (e.g. on the My Wallets page). */
  hideViewAll?: boolean;
  /** When set, "View All" links to this path (e.g. "/wallets"). */
  viewAllHref?: string;
  /** Max number of items to show (e.g. 5 on dashboard). Omit for all. */
  limit?: number;
};

export function ScheduledTransfers({ hideViewAll, viewAllHref, limit }: ScheduledTransfersProps = {}) {
  const { data, isLoading, isError } = useScheduledTransfers();
  const transfers: ScheduledTransfer[] = data?.transfers ?? [];

  return (
    <section className="flex flex-col">
      <div className="flex justify-between items-center mb-[15px]">
        <h2 className="head-md font-[600] font-kumbh-sans text-slate-dark">
          Scheduled Transfers
        </h2>
        {!hideViewAll && (viewAllHref ? (
          <Link href={viewAllHref} className="card-redirect flex justify-between items-center">
            View All <i className="icon-arrow-right" aria-hidden />
          </Link>
        ) : (
          <a href="/wallets" className="card-redirect flex justify-between items-center">
            View All <i className="icon-arrow-right" aria-hidden />
          </a>
        ))}
      </div>
      <div className="flex flex-col">
        {isLoading ? (
          <ScheduledTransfersSkeleton />
        ) : isError ? (
          <p className="text-slate text-sm">Failed to load scheduled transfers.</p>
        ) : transfers.length === 0 ? (
          <p className="text-slate text-sm">No scheduled transfers</p>
        ) : (
          (limit ? transfers.slice(0, limit) : transfers).map((transfer) => (
            <TransferItem key={transfer.id} transfer={transfer} />
          ))
        )}
      </div>
    </section>
  );
}
