/**
 * Working capital service — income/expense time series.
 * Uses mock data when API is unavailable (same JSON structure as API contract).
 */

import { handleApiError } from "@/utils/errorHandler";
import type { ApiSuccessResponse } from "./api";
import { apiFetch } from "./api";
import { getMockWorkingCapital, type WorkingCapitalDataPoint } from "./mock/financial.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export type WorkingCapitalPeriod = "7d" | "14d" | "30d";

export type WorkingCapitalSeriesPoint = WorkingCapitalDataPoint;

// Cache mock output so UI + Y-axis stay consistent across renders.
const mockCache = new Map<WorkingCapitalPeriod, WorkingCapitalSeriesPoint[]>();

/**
 * Working capital chart series. Returns data from { success: true, data } envelope.
 */
export async function getWorkingCapitalSeries(
  period: WorkingCapitalPeriod = "7d",
  token?: string
): Promise<WorkingCapitalSeriesPoint[]> {
  try {
    if (USE_MOCK) {
      await delay(200);
      if (!mockCache.has(period)) {
        mockCache.set(period, getMockWorkingCapital(period).data);
      }
      return mockCache.get(period) ?? [];
    }

    const search = "?" + new URLSearchParams({ period });
    const res = await apiFetch<ApiSuccessResponse<WorkingCapitalSeriesPoint[]>>(
      `/financial/working-capital${search}`,
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

