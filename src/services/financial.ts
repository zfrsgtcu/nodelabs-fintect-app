/**
 * Financial service — dashboard summary cards.
 * Uses mock data when API is unavailable (same JSON structure as API contract).
 * @see https://case.nodelabs.dev/api/ — envelope: { success, data }
 */

import { handleApiError } from "@/utils/errorHandler";
import type { ApiSuccessResponse } from "./api";
import { apiFetch } from "./api";
import { getMockDashboardSummary } from "./mock/financial.mock";
import { MOCK_TOKEN_MISSING, MOCK_UNEXPECTED_ERROR } from "./mock/errors.mock";

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export interface DashboardSummary {
  totalBalance: {
    amount: number;
    currency: string;
    change: { percentage: number; trend: "up" | "down" };
  };
  totalExpense: {
    amount: number;
    currency: string;
    change: { percentage: number; trend: "up" | "down" };
  };
  totalSavings: {
    amount: number;
    currency: string;
    change: { percentage: number; trend: "up" | "down" };
  };
  lastUpdated: string;
}

export interface FinancialSummaryParams {
  /** Optional: date range or period */
  from?: string;
  to?: string;
}

/**
 * Dashboard summary for summary cards. Returns data from { success: true, data } envelope.
 */
export async function getDashboardSummary(
  params?: FinancialSummaryParams,
  token?: string
): Promise<DashboardSummary> {
  try {
    if (USE_MOCK) {
      await delay(350);
      if (!token) {
        throw { status: 401, ...MOCK_TOKEN_MISSING };
      }
      if (token === "mock-500") {
        throw { status: 500, ...MOCK_UNEXPECTED_ERROR };
      }
      const res = getMockDashboardSummary();
      return res.data;
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
    const res = await apiFetch<ApiSuccessResponse<DashboardSummary>>(
      `/financial/summary${search}`,
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
