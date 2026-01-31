export default function HelpPage() {
  return (
    <main data-page="help-page" className="dashboard-main mt-[30px]">
      <section className="w-full max-w-2xl min-w-0 flex flex-col gap-6">
        <section className="card-border py-[20px] px-[25px]">
          <div className="card-border-header mb-[20px]">
            <h2 className="capital-title">Frequently asked questions</h2>
          </div>
          <div className="card-border-content">
            <ul className="space-y-4 text-sm font-kumbh-sans">
              <li>
                <span className="font-semibold text-slate-dark">How do I add a new wallet?</span>
                <p className="text-slate mt-1">Go to My Wallets and use the option to add a new card or account.</p>
              </li>
              <li>
                <span className="font-semibold text-slate-dark">How can I cancel a scheduled transfer?</span>
                <p className="text-slate mt-1">Open the transfer from your dashboard and select Cancel scheduled transfer.</p>
              </li>
              <li>
                <span className="font-semibold text-slate-dark">Where can I download my invoices?</span>
                <p className="text-slate mt-1">Invoices are available under the Invoices page after each billing period.</p>
              </li>
            </ul>
          </div>
        </section>
        <section className="card-border py-[20px] px-[25px]">
          <div className="card-border-header mb-[20px]">
            <h2 className="capital-title">Contact support</h2>
          </div>
          <div className="card-border-content">
            <p className="text-sm text-slate font-kumbh-sans">
              For further assistance, contact us at support@example.com or use the in-app chat.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
