export default function InvoicesPage() {
  return (
    <main data-page="invoices-page" className="dashboard-main mt-[30px]">
      <section className="w-full max-w-3xl min-w-0">
        <section className="card-border py-[20px] px-[25px]">
          <div className="card-border-header mb-[20px]">
            <h2 className="capital-title">Invoices</h2>
          </div>
          <div className="card-border-content">
            <p className="text-sm text-slate font-kumbh-sans mb-4">
              View and download your invoices. New invoices will appear here after each billing cycle.
            </p>
            <div className="border border-gray-light rounded-lg divide-y divide-gray-light">
              <div className="px-4 py-3 text-sm text-slate font-kumbh-sans">
                No invoices yet. Invoices will be listed here when available.
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
