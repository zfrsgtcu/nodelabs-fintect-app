/**
 * Wallet service — credit card list for Wallet section.
 * Uses mock data when API is unavailable (same JSON structure as API contract).
 * @see https://case.nodelabs.dev/api/ — envelope: { success, data }
 */

import { handleApiError } from "@/utils/errorHandler";
import type { ApiSuccessResponse } from "./api";
import { apiFetch } from "./api";
import { getMockWalletCards } from "./mock/wallet.mock";
import { MOCK_TOKEN_MISSING } from "./mock/errors.mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export interface WalletCard {
  id: string;
  brand: string;
  bankName: string;
  cardNumber: string;
  /** MM/YY or null if not shown */
  expiry: string | null;
  theme: "dark" | "light";
  /** visa | mastercard | null */
  cardBrand: "visa" | "mastercard" | null;
}

export interface WalletData {
  cards: WalletCard[];
}

/**
 * Wallet cards for Wallet section. Returns data from { success: true, data } envelope.
 */
export async function getWalletCards(token?: string): Promise<WalletData> {
  try {
    if (USE_MOCK) {
      await delay(200);
      if (!token) {
        throw { status: 401, ...MOCK_TOKEN_MISSING };
      }
      const res = getMockWalletCards();
      return res.data;
    }
    const res = await apiFetch<ApiSuccessResponse<WalletData>>(
      "/financial/wallet/cards",
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
