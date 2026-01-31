/**
 * Mock transaction + chart data — same JSON structure as API contract.
 * Envelope: { success: true, data: T }
 */

import type { Transaction, ChartDataPoint, RecentTransaction } from "../transaction";

export interface TransactionListData {
  transactions: Transaction[];
  total: number;
}

export interface TransactionChartData {
  daily?: ChartDataPoint[];
  weekly?: ChartDataPoint[];
}

export interface TransactionListMockResponse {
  success: true;
  data: TransactionListData;
}

export interface TransactionChartMockResponse {
  success: true;
  data: TransactionChartData;
}

export interface RecentTransactionsMockResponse {
  success: true;
  message: string;
  data: {
    transactions: RecentTransaction[];
    summary: { totalIncome: number; totalExpense: number; count: number };
  };
}

const MOCK_RECENT_TRANSACTIONS: RecentTransaction[] = [
  {
    id: "trx_001",
    name: "Iphone 13 Pro MAX",
    business: "Apple. Inc",
    image: "/images/company-logos/apple.png",
    type: "Mobile",
    amount: -420.84,
    currency: "USD",
    date: "2022-04-14T10:30:00.000Z",
    status: "completed",
  },
  {
    id: "trx_002",
    name: "Netflix Subscription",
    business: "Netflix",
    image: "/images/company-logos/netflix.png",
    type: "Entertainment",
    amount: -100,
    currency: "USD",
    date: "2022-04-05T04:30:00.000Z",
    status: "completed",
  },
  {
    id: "trx_003",
    name: "Figma Subscription",
    business: "Figma. Inc",
    image: "/images/company-logos/figma.png",
    type: "Software",
    amount: -244.2,
    currency: "USD",
    date: "2022-04-02T22:30:00.000Z",
    status: "completed",
  },
  {
    id: "trx_004",
    name: "Amazon Purchase",
    business: "Amazon",
    image: "/images/company-logos/apple.png",
    type: "Shopping",
    amount: -89.99,
    currency: "USD",
    date: "2022-04-01T14:00:00.000Z",
    status: "completed",
  },
  {
    id: "trx_005",
    name: "Spotify Premium",
    business: "Spotify",
    image: "/images/company-logos/netflix.png",
    type: "Entertainment",
    amount: -9.99,
    currency: "USD",
    date: "2022-03-30T08:15:00.000Z",
    status: "completed",
  },
  {
    id: "trx_006",
    name: "Office Rent",
    business: "Property Co.",
    image: "/images/company-logos/figma.png",
    type: "Rent",
    amount: -1200,
    currency: "USD",
    date: "2022-03-28T00:00:00.000Z",
    status: "completed",
  },
  {
    id: "trx_007",
    name: "Freelance Payment",
    business: "Client Inc",
    image: "/images/company-logos/apple.png",
    type: "Income",
    amount: 550,
    currency: "USD",
    date: "2022-03-25T12:00:00.000Z",
    status: "completed",
  },
  {
    id: "trx_008",
    name: "Electric Bill",
    business: "Power Corp",
    image: "/images/company-logos/netflix.png",
    type: "Utilities",
    amount: -75.5,
    currency: "USD",
    date: "2022-03-22T09:30:00.000Z",
    status: "completed",
  },
  {
    id: "trx_009",
    name: "Grocery Store",
    business: "SuperMart",
    image: "/images/company-logos/figma.png",
    type: "Food",
    amount: -156.32,
    currency: "USD",
    date: "2022-03-20T18:45:00.000Z",
    status: "completed",
  },
  {
    id: "trx_010",
    name: "Consulting Fee",
    business: "Consult Co",
    image: "/images/company-logos/apple.png",
    type: "Income",
    amount: 800,
    currency: "USD",
    date: "2022-03-18T11:00:00.000Z",
    status: "completed",
  },
  {
    id: "trx_011",
    name: "Internet Service",
    business: "ISP Ltd",
    image: "/images/company-logos/netflix.png",
    type: "Utilities",
    amount: -49.99,
    currency: "USD",
    date: "2022-03-15T00:00:00.000Z",
    status: "completed",
  },
];

/** Simulates GET /financial/transactions/recent response */
export function getMockRecentTransactions(limit: number = 20): RecentTransactionsMockResponse {
  const transactions = MOCK_RECENT_TRANSACTIONS.slice(0, limit);
  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = Math.abs(
    transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0)
  );
  return {
    success: true,
    message: "Recent transactions retrieved successfully.",
    data: {
      transactions,
      summary: { totalIncome, totalExpense, count: transactions.length },
    },
  };
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_001",
    amount: 1250.0,
    type: "income",
    category: "Salary",
    date: "2025-01-20",
    description: "Monthly salary",
  },
  {
    id: "tx_002",
    amount: -320.5,
    type: "expense",
    category: "Utilities",
    date: "2025-01-19",
    description: "Electricity & gas",
  },
  {
    id: "tx_003",
    amount: -89.99,
    type: "expense",
    category: "Subscription",
    date: "2025-01-18",
    description: "Software license",
  },
  {
    id: "tx_004",
    amount: 450.0,
    type: "income",
    category: "Freelance",
    date: "2025-01-17",
    description: "Project payment",
  },
  {
    id: "tx_005",
    amount: -156.0,
    type: "expense",
    category: "Office",
    date: "2025-01-16",
    description: "Supplies",
  },
  {
    id: "tx_006",
    amount: -42.0,
    type: "expense",
    category: "Meals",
    date: "2025-01-15",
    description: "Team lunch",
  },
  {
    id: "tx_007",
    amount: 800.0,
    type: "income",
    category: "Consulting",
    date: "2025-01-14",
    description: "Consulting fee",
  },
];

const MOCK_CHART_DAILY: ChartDataPoint[] = [
  { date: "2025-01-14", income: 800, expense: 0, label: "Jan 14" },
  { date: "2025-01-15", income: 0, expense: 42, label: "Jan 15" },
  { date: "2025-01-16", income: 0, expense: 156, label: "Jan 16" },
  { date: "2025-01-17", income: 450, expense: 0, label: "Jan 17" },
  { date: "2025-01-18", income: 0, expense: 89.99, label: "Jan 18" },
  { date: "2025-01-19", income: 0, expense: 320.5, label: "Jan 19" },
  { date: "2025-01-20", income: 1250, expense: 0, label: "Jan 20" },
];

const MOCK_CHART_WEEKLY: ChartDataPoint[] = [
  { date: "2025-W02", income: 1250, expense: 320.5, label: "Week 2" },
  { date: "2025-W03", income: 1250, expense: 608.49, label: "Week 3" },
  { date: "2025-W04", income: 2500, expense: 468.49, label: "Week 4" },
];

/** Simulates GET /transactions response (table) */
export function getMockTransactionList(): TransactionListMockResponse {
  return {
    success: true,
    data: {
      transactions: MOCK_TRANSACTIONS,
      total: MOCK_TRANSACTIONS.length,
    },
  };
}

/** Simulates GET /transactions/chart response (chart) */
export function getMockTransactionChart(): TransactionChartMockResponse {
  return {
    success: true,
    data: {
      daily: MOCK_CHART_DAILY,
      weekly: MOCK_CHART_WEEKLY,
    },
  };
}
