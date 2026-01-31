"use client";

import Link from "next/link";
import { formatCurrency } from "@/components/ui/currency";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentTransactions } from "@/hooks/use-api";
import type { RecentTransaction } from "@/services";

const TABLE_LOADING_ROWS = 3;

function TableSkeleton() {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="text-slate text-[12px] font-[600] font-kumbh-sans text-left pl-[25px] pr-[25px] pb-[10px]">NAME/BUSINESS</th>
          <th className="text-slate text-[12px] font-[600] font-kumbh-sans text-center px-[25px] pb-[10px]">TYPE</th>
          <th className="text-slate text-[12px] font-[600] font-kumbh-sans text-center px-[25px] pb-[10px]">AMOUNT</th>
          <th className="text-slate text-[12px] font-[600] font-kumbh-sans text-center pl-[25px] pr-[25px] pb-[10px]">DATE</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: TABLE_LOADING_ROWS }).map((_, i) => (
          <tr key={i} className="border-b last:border-b-0 border-gray-light">
            <td className="py-[10px] pl-[25px] pr-[25px]">
              <div className="flex items-center gap-[14px]">
                <Skeleton width={40} height={40} rounded="lg" className="flex-shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <Skeleton width={100} height={14} />
                  <Skeleton width={80} height={12} />
                </div>
              </div>
            </td>
            <td className="py-[15px] px-[25px]">
              <div className="flex justify-center">
                <Skeleton width={60} height={14} />
              </div>
            </td>
            <td className="py-[15px] px-[25px]">
              <div className="flex justify-center">
                <Skeleton width={70} height={14} />
              </div>
            </td>
            <td className="py-[15px] pl-[25px] pr-[25px]">
              <div className="flex justify-center">
                <Skeleton width={72} height={14} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export type UiTableProps = {
  /** When true, the "View All" link is hidden (e.g. on the Transactions page). */
  hideViewAll?: boolean;
  /** When set, "View All" links to this path (e.g. "/transactions"). */
  viewAllHref?: string;
  /** Max number of rows to fetch and show (e.g. 3 on dashboard). Omit for no limit. */
  limit?: number;
};

export function UiTable({ hideViewAll, viewAllHref, limit }: UiTableProps = {}) {
  const { data, isLoading, isError } = useRecentTransactions(limit ?? 20);
  const transactions: RecentTransaction[] = data?.transactions ?? [];

  return (
    <section className="card-border recent-transaction-table py-[20px] px-[25px]">
        <div className="card-border-header">
            <h2 className="capital-title">
                Recent Transaction
            </h2>
            {!hideViewAll && (viewAllHref ? (
              <Link href={viewAllHref} className="card-redirect flex justify-between items-center">
                View All <i className="icon-arrow-right" aria-hidden />
              </Link>
            ) : (
              <a href="/transactions" className="card-redirect flex justify-between items-center">
                View All <i className="icon-arrow-right" aria-hidden />
              </a>
            ))}
        </div>
        <div className="card-border-content mt-[25px] overflow-x-auto -mx-[25px]" aria-busy={isLoading} aria-live="polite">
            {isLoading ? (
              <div role="status" aria-label="Loading transactions">
                <TableSkeleton />
              </div>
            ) : isError ? (
              <p className="py-4 text-sm text-slate font-kumbh-sans">Failed to load transactions.</p>
            ) : (
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="text-slate text-[12px] font-[600] font-kumbh-sans text-left pl-[25px] pr-[25px] pb-[10px]">NAME/BUSINESS</th>
                        <th className="text-slate text-[12px] font-[600] font-kumbh-sans text-center px-[25px] pb-[10px]">TYPE</th>
                        <th className="text-slate text-[12px] font-[600] font-kumbh-sans text-center px-[25px] pb-[10px]">AMOUNT</th>
                        <th className="text-slate text-[12px] font-[600] font-kumbh-sans text-center pl-[25px] pr-[25px] pb-[10px]">DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((row) => (
                        <tr key={row.id} className="border-b last:border-b-0 border-gray-light hover:bg-gray-light-soft">
                            <td className="py-[10px] pl-[25px] pr-[25px]">
                                <div className="flex items-center gap-[14px]">
                                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-light">
                                        <img
                                            src={row.image}
                                            alt=""
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 object-cover"
                                            onError={(e) => {
                                                const target = e.currentTarget;
                                                target.style.display = "none";
                                                const next = target.nextElementSibling as HTMLElement | null;
                                                if (next) next.style.display = "flex";
                                            }}
                                        />
                                        <span
                                            className="absolute inset-0 hidden items-center justify-center text-slate text-[12px] font-[600] font-kumbh-sans"
                                            aria-hidden
                                        >
                                            {row.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-slate-dark text-[14px] font-[600] font-kumbh-sans">{row.name}</div>
                                        <div className="text-slate text-[12px] font-[400] font-kumbh-sans">{row.business}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="text-slate text-[14px] font-[500] font-kumbh-sans text-center py-[15px] px-[25px]">{row.type}</td>
                            <td className="text-slate-dark text-[14px] font-[600] font-kumbh-sans text-center py-[15px] px-[25px]">
                                {formatCurrency(Math.abs(row.amount), row.currency, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </td>
                            <td className="text-slate text-[14px] font-[600] font-kumbh-sans text-center py-[15px] pl-[25px] pr-[25px]">
                                {formatDate(row.date)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
    </section>
  );
}
