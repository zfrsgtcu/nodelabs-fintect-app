# Fintech App

Finansal hareketleri, bakiye ve işletme sermayesini takip eden masaüstü öncelikli bir fintech uygulaması. Next.js App Router ile geliştirilmiştir.

---

## Proje Özeti

- **Auth:** Giriş / Kayıt (form validasyonu, toast, giriş yapmışsa dashboard’a yönlendirme)
- **Dashboard:** Özet kartlar (Total Balance, Spending, Saved), Working Capital grafiği, Recent Transactions tablosu, Wallet kartları, Scheduled Transfers
- **Alt sayfalar:** Transactions, Invoices, My Wallets, Settings, Help
- **Loading:** Skeleton + shimmer (case gereksinimi)
- **Hata yönetimi:** Merkezi error handler (toast) + root layout’ta Error Boundary (render hatalarını yakalar, “Tekrar dene” ile sıfırlanır)

---

## Alanlar

| Alan | Rota | Açıklama |
|------|------|----------|
| **Login** | `/login` | E-posta/şifre, validasyon, toast, giriş yapmışsa `/dashboard` yönlendirmesi |
| **Register** | `/register` | Ad, e-posta, şifre, validasyon, kayıt sonrası `/login` yönlendirmesi |
| **Dashboard** | `/dashboard` | Özet kartlar, grafik, son işlemler, cüzdan kartları, planlanan transferler |
| **Transactions** | `/transactions` | İşlem listesi (UiTable) |
| **Invoices** | `/invoices` | Faturalar placeholder |
| **My Wallets** | `/wallets` | Cüzdan kartları + planlanan transferler |
| **Settings** | `/settings` | Profil, şifre, tema (light/dark/system) |
| **Help** | `/help` | SSS ve iletişim |

---

## Kullanılan Teknolojiler

- **Framework:** Next.js 16 (App Router), React 19
- **Veri & API:** TanStack React Query (`@tanstack/react-query`), `apiFetch` (services)
- **UI / Stil:** Tailwind CSS 4, SASS (SCSS), ECharts (grafik)
- **Bildirim:** React Toastify
- **Animasyon:** GSAP (auth layout)
- **Dil:** TypeScript 5

---

## Services Nasıl Çalışıyor?

**Varsayılan davranış:** Uygulama **varsayılan olarak mock veri** kullanır; `case.nodelabs.dev` API’sine istek atılmaz. Gerçek API’yi kullanmak için `.env.local` içinde `NEXT_PUBLIC_USE_MOCK_API=false` tanımlayıp sunucuyu yeniden başlatın.

**API referansı:** İstekler **`https://case.nodelabs.dev/api/`** base URL’ine gider. Base URL override: `NEXT_PUBLIC_API_BASE_URL`.

**Yapı:**
- **`src/services/api.ts`** — `API_BASE_URL`, `apiFetch()`, response tipleri (`ApiSuccessResponse<T>`, `ApiErrorResponse`). Tüm service fonksiyonları `apiFetch` kullanır.
- **Servis modülleri:** `auth`, `financial`, `transaction`, `wallet`, `scheduled-transfer`, `working-capital` — her biri ilgili endpoint’leri çağırır; hata durumunda `handleApiError()` (toast + re-throw) kullanılır.
- **Mock:** `services/mock/` — Varsayılan olarak kullanılır; gerçek API’ye geçmek için `NEXT_PUBLIC_USE_MOCK_API=false` gerekir.

**Referans alan yerler:**
- **Hooks:** `src/hooks/use-api.ts` — `getDashboardSummary`, `getRecentTransactions`, `getScheduledTransfers`, `getWalletCards`, `getWorkingCapitalSeries`, `login`, `register`, `logout` service fonksiyonlarını React Query (`useQuery` / `useMutation`) ile sarar.
- **Sayfalar / bileşenler:** Login ve Register sayfaları doğrudan `login` / `register` (services) çağırır; Dashboard, UiTable, WalletCards, ScheduledTransfers, WorkingCapitalChart ise `use-api.ts` içindeki hook’ları kullanır.

Özet: **API (case.nodelabs.dev) → apiFetch → services → use-api hooks → sayfalar/bileşenler.**
