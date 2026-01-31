/**
 * Mock scheduled transfers — same JSON structure as API contract.
 * @see https://case.nodelabs.dev/api-docs/#/Financial/get_financial_transfers_scheduled
 */

import type { ScheduledTransfer } from "../scheduled-transfer";

export interface ScheduledTransfersData {
  transfers: ScheduledTransfer[];
  summary?: {
    totalScheduledAmount: number;
    count: number;
  };
}

export interface ScheduledTransfersMockResponse {
  success: true;
  message?: string;
  data: ScheduledTransfersData;
}

const MOCK_SCHEDULED_TRANSFERS: ScheduledTransfer[] = [
  {
    id: "sch_001",
    name: "Saleh Ahmed",
    image: "https://ui-avatars.com/api/?name=Saleh+Ahmed&background=random&size=100",
    date: "2022-04-28T11:00:00Z",
    amount: -435,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_002",
    name: "Delowar Hossain",
    image: "https://ui-avatars.com/api/?name=Delowar+Hossain&background=random&size=100",
    date: "2022-04-25T11:00:00Z",
    amount: -132,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_003",
    name: "Moinul Hasan Nayem",
    image: "https://ui-avatars.com/api/?name=Moinul+Hasan&background=random&size=100",
    date: "2022-04-24T11:00:00Z",
    amount: -826,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_004",
    name: "Dr. Jubed Ahmed",
    image: "https://ui-avatars.com/api/?name=Jubed+Ahmed&background=random&size=100",
    date: "2022-04-22T11:00:00Z",
    amount: -228,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_005",
    name: "AR. Jakir Alp",
    image: "https://ui-avatars.com/api/?name=Jakir+Alp&background=random&size=100",
    date: "2022-04-20T11:00:00Z",
    amount: -435,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_006",
    name: "Sarah Johnson",
    image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random&size=100",
    date: "2022-04-19T14:30:00Z",
    amount: -220,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_007",
    name: "Michael Chen",
    image: "https://ui-avatars.com/api/?name=Michael+Chen&background=random&size=100",
    date: "2022-04-18T09:00:00Z",
    amount: -580,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_008",
    name: "Emma Wilson",
    image: "https://ui-avatars.com/api/?name=Emma+Wilson&background=random&size=100",
    date: "2022-04-17T16:45:00Z",
    amount: -95,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_009",
    name: "James Brown",
    image: "https://ui-avatars.com/api/?name=James+Brown&background=random&size=100",
    date: "2022-04-16T10:15:00Z",
    amount: -310,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_010",
    name: "Olivia Davis",
    image: "https://ui-avatars.com/api/?name=Olivia+Davis&background=random&size=100",
    date: "2022-04-15T13:20:00Z",
    amount: -670,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_011",
    name: "William Taylor",
    image: "https://ui-avatars.com/api/?name=William+Taylor&background=random&size=100",
    date: "2022-04-14T08:00:00Z",
    amount: -145,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_012",
    name: "Sophie Martinez",
    image: "https://ui-avatars.com/api/?name=Sophie+Martinez&background=random&size=100",
    date: "2022-04-13T11:30:00Z",
    amount: -390,
    currency: "$",
    status: "scheduled",
  },
  {
    id: "sch_013",
    name: "Liam Anderson",
    image: "https://ui-avatars.com/api/?name=Liam+Anderson&background=random&size=100",
    date: "2022-04-12T15:00:00Z",
    amount: -520,
    currency: "$",
    status: "scheduled",
  },
];

/** Simulates GET /financial/transfers/scheduled */
export function getMockScheduledTransfers(): ScheduledTransfersMockResponse {
  const transfers = MOCK_SCHEDULED_TRANSFERS;
  const totalScheduledAmount = transfers.reduce((sum, t) => sum + t.amount, 0);
  return {
    success: true,
    message: "Scheduled transfers retrieved successfully.",
    data: {
      transfers,
      summary: {
        totalScheduledAmount,
        count: transfers.length,
      },
    },
  };
}
