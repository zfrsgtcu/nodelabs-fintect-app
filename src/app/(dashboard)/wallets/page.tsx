import { WalletCards } from "@/components/wallet";
import { ScheduledTransfers } from "@/components/scheduled-transfers";

export default function WalletsPage() {
  return (
    <main data-page="wallets-page" className="dashboard-main mt-[30px] flex flex-col gap-[30px]">
      <section className="w-full min-w-0 max-w-2xl">
        <WalletCards />
      </section>
      <section className="w-full min-w-0 max-w-2xl">
        <ScheduledTransfers hideViewAll />
      </section>
    </main>
  );
}
