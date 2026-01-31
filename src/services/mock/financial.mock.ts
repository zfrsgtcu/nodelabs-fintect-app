// Dashboard özet kartları için yükseliş/düşüş tipi
export type Trend = "up" | "down";

// Para değişimi yüzdesi ve trend
export interface MoneyChange {
  percentage: number;
  trend: Trend;
}

// Miktar, para birimi ve değişim bilgisi
export interface MoneyWithChange {
  amount: number;
  currency: string;
  change: MoneyChange;
}

// Dashboard özet verileri
export interface FinancialSummaryData {
  totalBalance: MoneyWithChange;
  totalExpense: MoneyWithChange;
  totalSavings: MoneyWithChange;
  lastUpdated: string; // ISO string formatında güncelleme tarihi
}

// Mock finansal özet response yapısı
export interface FinancialSummaryMockResponse {
  success: true;
  message: string;
  data: FinancialSummaryData;
}

// Dashboard özet kartları için örnek mock veri
export function getMockDashboardSummary(): FinancialSummaryMockResponse {
  return {
    success: true,
    message: "Financial summary retrieved successfully.",
    data: {
      totalBalance: {
        amount: 5240.21,
        currency: "USD",
        change: { percentage: 12.5, trend: "up" },
      },
      totalExpense: {
        amount: 250.8,
        currency: "USD",
        change: { percentage: -8.3, trend: "down" },
      },
      totalSavings: {
        amount: 550.25,
        currency: "USD",
        change: { percentage: 15.2, trend: "up" },
      },
      lastUpdated: "2025-10-06T10:30:00.000Z", // son güncelleme zamanı
    },
  };
}

// Çalışma sermayesi grafik noktası (günlük gelir/gider)
export interface WorkingCapitalDataPoint {
  date: string; // ISO format veya "YYYY-MM-DD"
  income: number;
  expenses: number;
}

// Çalışma sermayesi için mock response tipi
export interface WorkingCapitalMockResponse {
  success: true;
  message: string;
  data: WorkingCapitalDataPoint[];
}

// Çalışma sermayesi için tarihe göre gelir/gider datası mock
export function getMockWorkingCapital(period: "7d" | "14d" | "30d" = "7d"): WorkingCapitalMockResponse {
  // Kaç günlük veri dönecek
  const dayCount = period === "7d" ? 7 : period === "14d" ? 14 : 30;
  const base = new Date();
  const points: WorkingCapitalDataPoint[] = [];

  for (let i = dayCount - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    // Tarih stringi (ISO)
    const dateStr = d.toISOString().slice(0, 10);
    points.push({
      date: dateStr,
      // Gelir rastgele oluşturuluyor
      income: 3000 + Math.round(Math.random() * 5000) + (i % 3) * 500,
      // Gider rastgele oluşturuluyor
      expenses: 2000 + Math.round(Math.random() * 3500) + (i % 2) * 400,
    });
  }

  return {
    success: true,
    message: "Working capital data retrieved successfully.",
    data: points,
  };
}
