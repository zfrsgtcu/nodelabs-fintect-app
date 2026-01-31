/**
 * Mock wallet/card data — same JSON structure as API contract.
 * Envelope: { success: true, data: T }
 */

import type { WalletCard } from "../wallet";

export interface WalletData {
  cards: WalletCard[];
}

export interface WalletMockResponse {
  success: true;
  message?: string;
  data: WalletData;
}

const MOCK_WALLET_CARDS: WalletCard[] = [
  {
    id: "card_001",
    brand: "Fintech.",
    bankName: "Universal Bank",
    cardNumber: "5495738137592321",
    expiry: null,
    theme: "dark",
    cardBrand: "mastercard",
  },
  {
    id: "card_002",
    brand: "Fintech.",
    bankName: "Commercial Bank",
    cardNumber: "8595254812345678",
    expiry: "09/25",
    theme: "light",
    cardBrand: "visa",
  },
];

/** Simulates GET /financial/wallet/cards or similar wallet endpoint */
export function getMockWalletCards(): WalletMockResponse {
  return {
    success: true,
    message: "Wallet cards retrieved successfully.",
    data: {
      cards: MOCK_WALLET_CARDS,
    },
  };
}
