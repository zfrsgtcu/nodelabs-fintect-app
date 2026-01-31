"use client";

import { CardStat } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/components/ui/currency";
import { UiTable } from "@/components/ui/table";
import { WorkingCapitalChart } from "@/components/charts";
import { WalletCards } from "@/components/wallet";
import { ScheduledTransfers } from "@/components/scheduled-transfers";
import { useDashboardSummary } from "@/hooks/use-api";

function localeForCurrency(currency: string): string {
  return currency === "TRY" ? "tr-TR" : "en-US";
}

/** Skeleton for dashboard stat cards (shimmer effect during API load). */
function StatCardSkeleton({ title }: { title: string }) {
  return (
    <div className="card-ui flex-1 min-w-0">
      <div className="card-icon">
        <i className="icon-wallet-close text-[20px]" aria-hidden />
      </div>
      <dl className="min-w-0 flex flex-col gap-[10px]">
        <dt className="text-sm font-[400] text-sm text-slate-dark">
          {title}
        </dt>
        <dd className="font-[700] text-[24px] flex items-center">
          <Skeleton width="70%" height={30} aria-hidden />
        </dd>
      </dl>
    </div>
  );
}

export default function DashboardPage() {
  const { data: summary, isLoading, isError } = useDashboardSummary(undefined, "mock-token");

  const totalBalance = summary?.totalBalance ?? { amount: 0, currency: "USD" };
  const totalExpense = summary?.totalExpense ?? { amount: 0, currency: "USD" };
  const totalSavings = summary?.totalSavings ?? { amount: 0, currency: "USD" };

  const currencyFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  const balanceFormatted = formatCurrency(totalBalance.amount, totalBalance.currency, {
    locale: localeForCurrency(totalBalance.currency),
    ...currencyFormatOptions,
  });
  const expenseFormatted = formatCurrency(totalExpense.amount, totalExpense.currency, {
    locale: localeForCurrency(totalExpense.currency),
    ...currencyFormatOptions,
  });
  const savingsFormatted = formatCurrency(totalSavings.amount, totalSavings.currency, {
    locale: localeForCurrency(totalSavings.currency),
    ...currencyFormatOptions,
  });

  return (
    <main data-page="dashboard-page" className="dashboard-main flex flex-row gap-[39px] mt-[30px]">
      <section className="dashboard-left-content w-full flex flex-col gap-[30px] min-w-0">
        <section className="dashboard-stats-row flex flex-row gap-[25px]" aria-label="Özet kartlar">
          {isLoading ? (
            <>
              <StatCardSkeleton title="Total Balance" />
              <StatCardSkeleton title="Total spending" />
              <StatCardSkeleton title="Total saved" />
            </>
          ) : (
            <>
              <CardStat
                title="Total Balance"
                className="flex-1"
                value={isError ? "—" : balanceFormatted}
                icon={<i className="icon-wallet-close text-[20px]" aria-hidden />}
              />
              <CardStat
                title="Total spending"
                className="flex-1"
                value={isError ? "—" : expenseFormatted}
                icon={<i className="icon-wallet-close text-[20px]" aria-hidden />}
              />
              <CardStat
                title="Total saved"
                className="flex-1"
                value={isError ? "—" : savingsFormatted}
                icon={<i className="icon-wallet-add text-[20px]" aria-hidden />}
              />
            </>
          )}
        </section>
        <WorkingCapitalChart />
        <UiTable viewAllHref="/transactions" limit={3} />
      </section>
      <section className="dashboard-right-content flex flex-col gap-[30px] min-w-0 flex-shrink-0">
        <WalletCards />
        <ScheduledTransfers viewAllHref="/wallets" limit={5} />
      </section>
    </main>
  );
}
