"use client";

import { useWalletCards } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import type { WalletCard } from "@/services";

function WalletCardsSkeleton() {
  return (
    <div className="wallet-cards flex flex-wrap gap-4" aria-busy="true" aria-label="Loading wallets">
      <Skeleton width={354} height={180} rounded="lg" className="flex-shrink-0" />
      <Skeleton width={324} height={140} rounded="lg" className="flex-shrink-0 -mt-[67px]" />
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

function formatExpiry(expiry: string | null): string {
  return expiry ?? "";
}

function SingleCard({ card, isDetail }: { card: WalletCard; isDetail: boolean }) {
  const masked = isDetail && !!card.expiry;
  const displayNumber = formatCardNumber(card.cardNumber, masked);

  return (
    <div
      className={`credit-card ${isDetail ? "credit-card-detail" : ""}`}
      key={card.id}
    >
      <div className={`credit-card-header ${isDetail ? "detail-header" : ""}`}>
        <div className="flex flex-row justify-start w-full align-center">
          <div className="logo">{card.brand}</div>
          <span className="vr" aria-hidden />
          <p>{card.bankName}</p>
        </div>
      </div>
      <div className={`credit-card-center ${isDetail ? "detail-center mt-[16px]" : "mt-[25px]"}`}>
        <div
          className={`flex flex-row justify-between w-full items-center`}
        >
          <i
            className={`icon-card-sim ${isDetail ? "text-[25px]" : "text-[34px]"}`}
            aria-hidden
          />
          <i
            className="icon-wifi text-slate-light-3 text-[27px]"
            aria-hidden
          />
        </div>
        <div className={`card-number ${isDetail ? "detail-number" : ""}`}>
          <p>{displayNumber}</p>
        </div>
      </div>
      <div
        className={`credit-card-footer flex justify-between items-center ${isDetail ? "detail-footer" : ""}`}
      >
        <div className={`credit-card-left ${isDetail ? "detail-left" : ""}`}>
          {isDetail && card.expiry && (
            <small className="text-slate font-[500] text-[12px] letter-spacing-[2px] font-gordita">
              {formatExpiry(card.expiry)}
            </small>
          )}
        </div>
        <div className={`credit-card-right ${isDetail ? "detail-right" : ""}`}>
          {card.cardBrand === "mastercard" && (
            <i className="icon-mastercard text-[55px]" aria-hidden />
          )}
          {card.cardBrand === "visa" && (
            <i className="icon-visa text-[33px]" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}

export function WalletCards() {
  const { data, isLoading, isError } = useWalletCards();
  const cards: WalletCard[] = data?.cards ?? [];

  return (
    <section>
      <div className="flex justify-between items-center mb-[15px]">
        <h2 className="head-md font-[600] font-kumbh-sans text-slate-dark">
          Wallet
        </h2>
        <button
          type="button"
          className="cursor-pointer p-0 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-green-primary/30 rounded"
          aria-label="Wallet options"
        >
          <i className="icon-more text-slate text-[20px]" aria-hidden />
        </button>
      </div>
      <div className="wallet-cards">
        {isLoading ? (
          <WalletCardsSkeleton />
        ) : isError ? (
          <p className="text-slate text-sm">Failed to load cards.</p>
        ) : (
          cards.map((card, index) => (
            <SingleCard
              key={card.id}
              card={card}
              isDetail={index > 0}
            />
          ))
        )}
      </div>
    </section>
  );
}
