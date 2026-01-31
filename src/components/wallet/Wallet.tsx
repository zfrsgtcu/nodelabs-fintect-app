"use client";

import { useWalletCards } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { WalletCard as WalletCardType } from "@/services";

function WalletPageSkeleton() {
  return (
    <div className="flex flex-col gap-4 relative" style={{ minHeight: 240 }} aria-busy="true" aria-label="Loading wallets">
      <Skeleton width="100%" height={200} rounded="lg" className="max-w-[380px]" />
      <Skeleton width="100%" height={180} rounded="lg" className="max-w-[360px] ml-5 -mt-8" />
    </div>
  );
}

function formatCardNumber(cardNumber: string, masked: boolean): string {
  const digits = cardNumber.replace(/\D/g, "");
  if (masked && digits.length >= 8) {
    return `${digits.slice(0, 8)}****`;
  }
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function ChipIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={40}
      height={32}
      viewBox="0 0 40 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="1"
        y="1"
        width="38"
        height="30"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M12 1v30M20 1v30M28 1v30M1 12h38M1 20h38"
        stroke="currentColor"
        strokeWidth="1"
        opacity={0.6}
      />
    </svg>
  );
}

function ContactlessIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
        fill="currentColor"
      />
      <path
        d="M8.5 14.5c.28-.28.28-.72 0-1-.85-.85-1.35-2-.1-3.1.28-.44.89-.56 1.33-.28.44.28.56.89.28 1.33-1.56 1.92-1.18 3.75.28 5.05.28.28.28.72 0 1-.28.28-.72.28-1 0-.28z"
        fill="currentColor"
      />
      <path
        d="M11 16.5c.28-.28.28-.72 0-1 .28-.28.72-.28 1 0 .28.28.28.72 0 1-.28.28-.72.28-1 0-.28z"
        fill="currentColor"
      />
      <path
        d="M13.5 14.5c1.17-1.17 1.17-3.07 0-4.24-.28-.28-.72-.28-1 0s-.28.72 0 1c.59.59.59 1.54 0 2.12-.28.28-.28.72 0 1 .28.28.72.28 1 0 .28z"
        fill="currentColor"
      />
    </svg>
  );
}

function VisaLogo({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white bg-[#1A1F71] font-kumbh-sans ${className ?? ""}`}
      aria-hidden
    >
      VISA
    </span>
  );
}

function SingleCard({ card, index }: { card: WalletCardType; index: number }) {
  const isDark = card.theme === "dark";
  const masked = card.theme === "light" && !!card.expiry;
  const displayNumber = formatCardNumber(card.cardNumber, masked);
  const isBack = index > 0;

  return (
    <article
      className={`absolute rounded-xl overflow-hidden shadow-md min-h-[200px] ${
        isBack
          ? "top-[20px] left-[20px] right-0 z-0 bg-white/95 backdrop-blur-sm border border-gray-light"
          : "top-0 left-0 right-0 z-10"
      }`}
      style={
        !isBack
          ? {
              background:
                "linear-gradient(180deg, #2A3441 0%, #1B212D 50%, #0F1419 100%)",
            }
          : undefined
      }
    >
      <div
        className={`flex flex-col justify-between p-6 h-full min-h-[200px] ${
          isDark ? "text-white" : "text-slate-dark"
        }`}
      >
        <div className="flex items-center gap-2 font-kumbh-sans">
          <span
            className={`text-[16px] font-[600] ${isDark ? "text-white" : "text-slate-dark"}`}
          >
            {card.brand}
          </span>
          <span
            className={`w-px h-4 ${isDark ? "bg-white/50" : "bg-slate/50"}`}
            aria-hidden
          />
          <span
            className={`text-[14px] font-[400] ${isDark ? "text-white/80" : "text-slate"}`}
          >
            {card.bankName}
          </span>
        </div>

        <div className="flex items-center justify-between mt-6">
          <ChipIcon
            className={isDark ? "text-white/70" : "text-slate"}
          />
          <ContactlessIcon
            className={isDark ? "text-white/70" : "text-slate"}
          />
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p
              className={`font-kumbh-sans text-[18px] font-[600] tracking-[0.2em] ${
                isDark ? "text-white" : "text-slate-dark"
              }`}
            >
              {displayNumber}
            </p>
            {card.expiry && (
              <p className="font-kumbh-sans text-[12px] font-[500] text-slate mt-1">
                {card.expiry}
              </p>
            )}
          </div>
          {card.cardBrand === "visa" && (
            <VisaLogo className="shrink-0" />
          )}
        </div>
      </div>
    </article>
  );
}

export function Wallet() {
  const { data, isLoading, isError } = useWalletCards();
  const cards: WalletCardType[] = data?.cards ?? [];

  return (
    <section className="flex flex-col">
      <header className="flex items-center justify-between mb-5">
        <h2 className="text-slate-dark text-[20px] font-[700] font-kumbh-sans">
          Wallet
        </h2>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-light-soft text-slate-dark focus:outline-none focus:ring-2 focus:ring-green-primary/30"
          aria-label="Wallet options"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle cx="12" cy="6" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="18" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </header>

      <div className="relative mt-0" style={{ minHeight: 240 }}>
        {isLoading ? (
          <WalletPageSkeleton />
        ) : isError ? (
          <p className="text-slate text-sm">Failed to load cards.</p>
        ) : (
          cards.map((card, index) => (
            <SingleCard key={card.id} card={card} index={index} />
          ))
        )}
      </div>
    </section>
  );
}
