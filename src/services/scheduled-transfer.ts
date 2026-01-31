/**
 * Scheduled transfers service — list of upcoming transfers.
 * Uses mock data when API is unavailable (same JSON structure as API contract).
 * @see https://case.nodelabs.dev/api/ — envelope: { success, data }
 */

import { handleApiError } from "@/utils/errorHandler";
import type { ApiSuccessResponse } from "./api";
import { apiFetch } from "./api";
import { getMockScheduledTransfers } from "./mock/scheduled-transfer.mock";
import { MOCK_TOKEN_MISSING } from "./mock/errors.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** GET /financial/transfers/scheduled — item shape from API */
export interface ScheduledTransfer {
  id: string;
  name: string;
  image: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
}

export interface ScheduledTransfersData {
  transfers: ScheduledTransfer[];
  summary?: {
    totalScheduledAmount: number;
    count: number;
  };
}

/**
 * Scheduled transfers for dashboard. Returns data from { success: true, data } envelope.
 * @see https://case.nodelabs.dev/api-docs/#/Financial/get_financial_transfers_scheduled
 */
export async function getScheduledTransfers(token?: string): Promise<ScheduledTransfersData> {
  try {
    if (USE_MOCK) {
      await delay(200);
      if (!token) {
        throw { status: 401, ...MOCK_TOKEN_MISSING };
      }
      const res = getMockScheduledTransfers();
      return res.data;
    }
    const res = await apiFetch<ApiSuccessResponse<ScheduledTransfersData>>(
      "/financial/transfers/scheduled",
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
