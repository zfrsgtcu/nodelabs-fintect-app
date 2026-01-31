"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getToken } from "@/lib/auth-session";
import {
  getDashboardSummary,
  type FinancialSummaryParams,
} from "@/services/financial";
import {
  getRecentTransactions,
  type RecentTransactionsData,
} from "@/services/transaction";
import { getScheduledTransfers } from "@/services/scheduled-transfer";
import { getWalletCards } from "@/services/wallet";
import {
  getWorkingCapitalSeries,
  type WorkingCapitalPeriod,
} from "@/services/working-capital";
import {
  login,
  register,
  logout,
  type LoginPayload,
  type RegisterPayload,
} from "@/services/auth";

const DEFAULT_TOKEN = "mock-token";

function tokenOrDefault(): string {
  if (typeof window === "undefined") return DEFAULT_TOKEN;
  return getToken() ?? DEFAULT_TOKEN;
}

/** Dashboard summary (Total Balance, Total spending, Total saved) */
export function useDashboardSummary(
  params?: FinancialSummaryParams,
  token?: string
) {
  const t = token ?? tokenOrDefault();
  return useQuery({
    queryKey: ["financial", "summary", params ?? {}, t],
    queryFn: () => getDashboardSummary(params, t),
  });
}

/** Recent transactions for table */
export function useRecentTransactions(limit: number = 20, token?: string) {
  const t = token ?? tokenOrDefault();
  return useQuery({
    queryKey: ["transactions", "recent", limit, t],
    queryFn: (): Promise<RecentTransactionsData> =>
      getRecentTransactions(limit, t),
  });
}

/** Scheduled transfers list */
export function useScheduledTransfers(token?: string) {
  const t = token ?? tokenOrDefault();
  return useQuery({
    queryKey: ["scheduled-transfers", t],
    queryFn: () => getScheduledTransfers(t),
  });
}

/** Wallet cards */
export function useWalletCards(token?: string) {
  const t = token ?? tokenOrDefault();
  return useQuery({
    queryKey: ["wallet", "cards", t],
    queryFn: () => getWalletCards(t),
  });
}

/** Working capital chart series (income/expense by period) */
export function useWorkingCapitalSeries(
  period: WorkingCapitalPeriod = "7d",
  token?: string
) {
  const t = token ?? tokenOrDefault();
  return useQuery({
    queryKey: ["working-capital", period, t],
    queryFn: () => getWorkingCapitalSeries(period, t),
  });
}

/** Login mutation */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["financial"] });
      queryClient.removeQueries({ queryKey: ["transactions"] });
      queryClient.removeQueries({ queryKey: ["scheduled-transfers"] });
      queryClient.removeQueries({ queryKey: ["wallet"] });
      queryClient.removeQueries({ queryKey: ["working-capital"] });
    },
  });
}

/** Register mutation */
export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
  });
}

/** Logout mutation */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      queryClient.clear();
    },
  });
}
