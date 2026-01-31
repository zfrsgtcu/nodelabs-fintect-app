/**
 * Transaction service — chart + table data.
 * Uses mock data when API is unavailable (same JSON structure as API contract).
 * @see https://case.nodelabs.dev/api/ — envelope: { success, data }
 */

import { handleApiError } from "@/utils/errorHandler";
import type { ApiSuccessResponse } from "./api";
import { apiFetch } from "./api";
import {
  getMockTransactionChart,
  getMockTransactionList,
  getMockRecentTransactions,
} from "./mock/transaction.mock";
import { MOCK_TOKEN_MISSING, MOCK_UNEXPECTED_ERROR } from "./mock/errors.mock";

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export interface Transaction {
  id: string;
  amount: number;
  type?: "income" | "expense";
  category?: string;
  date: string;
  description?: string;
  [key: string]: unknown;
}

export interface TransactionListResponse {
  transactions?: Transaction[];
  total?: number;
  [key: string]: unknown;
}

export interface ChartDataPoint {
  date: string;
  income?: number;
  expense?: number;
  label?: string;
}

export interface TransactionChartResponse {
  daily?: ChartDataPoint[];
  weekly?: ChartDataPoint[];
  [key: string]: unknown;
}

export interface TransactionParams {
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

/** Recent transaction item (GET /financial/transactions/recent) */
export interface RecentTransaction {
  id: string;
  name: string;
  business: string;
  image: string;
  type: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
}

export interface RecentTransactionsData {
  transactions: RecentTransaction[];
  summary?: {
    totalIncome: number;
    totalExpense: number;
    count: number;
  };
}

/**
 * Transaction list for table. Returns data from { success: true, data } envelope.
 */
export async function getTransactions(
  params?: TransactionParams,
  token?: string
): Promise<TransactionListResponse> {
  try {
    if (USE_MOCK) {
      await delay(300);
      if (!token) {
        throw { status: 401, ...MOCK_TOKEN_MISSING };
      }
      if (token === "mock-500") {
        throw { status: 500, ...MOCK_UNEXPECTED_ERROR };
      }
      const res = getMockTransactionList();
      return res.data as TransactionListResponse;
    }
    const search = params
      ? "?" +
        new URLSearchParams(
          Object.fromEntries(
            Object.entries(params).filter(
              (t): t is [string, string] =>
                t[1] != null && t[1] !== "" && typeof t[1] === "string"
            )
          ) as Record<string, string>
        )
      : "";
    const res = await apiFetch<ApiSuccessResponse<TransactionListResponse>>(
      `/transactions${search}`,
      {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return res.data;
  } catch (e) {
    handleApiError(e);
  }
}

/**
 * Recent transactions (GET /financial/transactions/recent). Returns list for Recent Transaction table.
 * @see https://case.nodelabs.dev/api-docs/#/Financial/get_financial_transactions_recent
 */
export async function getRecentTransactions(
  limit: number = 20,
  token?: string
): Promise<RecentTransactionsData> {
  try {
    if (USE_MOCK) {
      await delay(250);
      if (!token) {
        throw { status: 401, ...MOCK_TOKEN_MISSING };
      }
      const res = getMockRecentTransactions(limit);
      return res.data;
    }
    const res = await apiFetch<ApiSuccessResponse<RecentTransactionsData>>(
      `/financial/transactions/recent?limit=${limit}`,
      {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return res.data;
  } catch (e) {
    handleApiError(e);
  }
}

/**
 * Transaction data for chart (daily/weekly income–expense). Returns data from { success: true, data } envelope.
 */
export async function getTransactionChartData(
  params?: { from?: string; to?: string; groupBy?: "day" | "week" },
  token?: string
): Promise<TransactionChartResponse> {
  try {
    if (USE_MOCK) {
      await delay(280);
      if (!token) {
        throw { status: 401, ...MOCK_TOKEN_MISSING };
      }
      if (token === "mock-500") {
        throw { status: 500, ...MOCK_UNEXPECTED_ERROR };
      }
      const res = getMockTransactionChart();
      return res.data as TransactionChartResponse;
    }
    const search = params
      ? "?" +
        new URLSearchParams(
          Object.fromEntries(
            Object.entries(params).filter(
              (t): t is [string, string] => t[1] != null && t[1] !== ""
            )
          )
        )
      : "";
    const res = await apiFetch<ApiSuccessResponse<TransactionChartResponse>>(
      `/transactions/chart${search}`,
      {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return res.data;
  } catch (e) {
    handleApiError(e);
  }
}
