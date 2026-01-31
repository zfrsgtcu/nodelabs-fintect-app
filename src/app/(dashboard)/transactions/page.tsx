import { UiTable } from "@/components/ui/table";

export default function TransactionsPage() {
  return (
    <main data-page="transactions-page" className="dashboard-main mt-[30px]">
      <section className="w-full min-w-0">
        <UiTable hideViewAll />
      </section>
    </main>
  );
}
