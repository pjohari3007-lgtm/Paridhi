import { COMPETITOR_MATRIX } from '../data/reconciliationData';

interface ComparisonAndPartnersProps {
  onSelectCaPartner: () => void;
}

export function ComparisonAndPartners({ onSelectCaPartner }: ComparisonAndPartnersProps) {
  return (
    <section id="ca-partners" className="py-16 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Competitor Battlefield Comparison */}
        <div>
          <div className="max-w-2xl mb-8">
            <p className="text-sm font-medium text-sky-700 mb-2">Positioning Comparison</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Why plants choose SahiKhata between an overloaded CA and a Big 4 firm.
            </h2>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="py-3.5 px-4 w-44">Evaluation Factor</th>
                    <th className="py-3.5 px-4">In-House Accountant</th>
                    <th className="py-3.5 px-4">Local CA Firm</th>
                    <th className="py-3.5 px-4">Big 4 / Mid-Tier</th>
                    <th className="py-3.5 px-4 bg-sky-50/70 text-slate-900">SahiKhata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {COMPETITOR_MATRIX.map((row) => (
                    <tr key={row.dimension}>
                      <td className="py-4 px-4 font-semibold text-slate-900">{row.dimension}</td>
                      <td className="py-4 px-4 text-slate-600">{row.inHouse}</td>
                      <td className="py-4 px-4 text-slate-600">{row.localCa}</td>
                      <td className="py-4 px-4 text-slate-600">{row.bigFour}</td>
                      <td className="py-4 px-4 bg-sky-50/40 font-medium text-slate-900">
                        {row.sahiKhata}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Channel Partner Callout for Small CA Firms */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <p className="text-xs font-semibold text-sky-700">
              Channel Partner Program · Small &amp; Mid-Sized CA Firms
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Offload fixed asset &amp; vendor clean-up without losing your client relationship.
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              SahiKhata does not offer GST/TDS filing, bookkeeping, or statutory audits. We partner
              with CA practices through referral fees or white-label reconciliation reports so your
              team saves audit-season hours while delivering cleaner schedules to manufacturing
              clients.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <button
              type="button"
              onClick={onSelectCaPartner}
              className="px-5 py-3 min-h-[44px] text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
            >
              Discuss CA Partnership Terms
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
