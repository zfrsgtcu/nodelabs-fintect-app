/**
 * Mock data — same JSON structure as API contract ({ success, data }).
 * Used when Swagger/API is unavailable. Set NEXT_PUBLIC_USE_MOCK_API=false to use real API.
 */

export {
  getMockLoginResponse,
  getMockRegisterResponse,
  MOCK_AUTH_ERROR,
  MOCK_MISSING_FIELDS,
  MOCK_ACCOUNT_DEACTIVATED,
  MOCK_RATE_LIMIT,
  type AuthData,
  type AuthErrorMockResponse,
  type AuthMockResponse,
} from "./auth.mock";
export {
  MOCK_TOKEN_MISSING,
  MOCK_UNEXPECTED_ERROR,
  MOCK_USER_NOT_FOUND,
  type SwaggerErrorMock,
} from "./errors.mock";
export {
  getMockDashboardSummary,
  getMockWorkingCapital,
  type FinancialSummaryData,
  type FinancialSummaryMockResponse,
  type WorkingCapitalDataPoint,
  type WorkingCapitalMockResponse,
} from "./financial.mock";
export {
  getMockTransactionChart,
  getMockTransactionList,
  getMockRecentTransactions,
  type RecentTransactionsMockResponse,
  type TransactionChartData,
  type TransactionChartMockResponse,
  type TransactionListData,
  type TransactionListMockResponse,
} from "./transaction.mock";
export {
  getMockWalletCards,
  type WalletData,
  type WalletMockResponse,
} from "./wallet.mock";
export {
  getMockScheduledTransfers,
  type ScheduledTransfersData,
  type ScheduledTransfersMockResponse,
} from "./scheduled-transfer.mock";
