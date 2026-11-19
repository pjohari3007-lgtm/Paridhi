import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { calculateHealthCheckEstimate } from '../data/reconciliationData';

export interface SelectedScopePayload {
  erp: 'tally' | 'sap' | 'excel';
  assetBand: 'small' | 'medium' | 'large';
  vendorAddon: boolean;
  isPilot: boolean;
  feeInr: number;
}

interface HealthCheckEstimatorProps {
  onApplyScope: (scope: SelectedScopePayload) => void;
}

export function HealthCheckEstimator({ onApplyScope }: HealthCheckEstimatorProps) {
  const [erp, setErp] = useState<'tally' | 'sap' | 'excel'>('tally');
  const [assetBand, setAssetBand] = useState<'small' | 'medium' | 'large'>('small');
  const [vendorAddon, setVendorAddon] = useState(true);
  const [isPilot, setIsPilot] = useState(false);

  const estimate = calculateHealthCheckEstimate({
    erp,
    assetBand,
    vendorAddon,
    isPilot,
  });

  const formattedFee = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(estimate.feeInr);

  return (
    <section id="pricing" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-medium text-sky-700 mb-2">
            Transparent Fixed-Fee Pricing
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Estimate your reconciliation health check before committing.
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            No hourly consulting surprises. Most manufacturing plants in Haridwar and Selaqui fall
            between ₹15,000 and ₹30,000—with a discounted ₹10,000–₹15,000 introductory pilot slot
            available for first-time evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Configuration Controls */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-7">
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-3">
                1. Accounting / ERP Environment
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'tally', label: 'Tally Prime' },
                  { id: 'sap', label: 'SAP ECC / S4' },
                  { id: 'excel', label: 'Excel + Tally' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setErp(opt.id as 'tally' | 'sap' | 'excel')}
                    className={`px-4 py-2.5 min-h-[42px] text-sm font-medium rounded-lg border transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                      erp === opt.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900 mb-3">
                2. Fixed Asset Register Line Items
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'small', label: '50 – 200 Assets' },
                  { id: 'medium', label: '200 – 500 Assets' },
                  { id: 'large', label: '500+ Assets' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAssetBand(opt.id as 'small' | 'medium' | 'large')}
                    className={`px-4 py-2.5 min-h-[42px] text-sm font-medium rounded-lg border transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                      assetBand === opt.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={vendorAddon}
                  onChange={(e) => setVendorAddon(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-sky-600"
                />
                <div>
                  <span className="block text-sm font-semibold text-slate-900">
                    Include Vendor Master Review
                  </span>
                  <span className="block text-xs text-slate-600 mt-0.5">
                    Checks duplicate vendors, MSME 43B(h) payment terms &amp; FI/MM mapping.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={isPilot}
                  onChange={(e) => setIsPilot(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-sky-600"
                />
                <div>
                  <span className="block text-sm font-semibold text-slate-900">
                    Introductory Pilot Cohort
                  </span>
                  <span className="block text-xs text-slate-600 mt-0.5">
                    Discounted first-plant evaluation (₹10k–₹15k) with anonymised case consent.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Right: Summary Output */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-sky-300 mb-2">
                {isPilot ? 'Discounted Pilot Estimate' : 'Standard Fixed-Fee Health Check'}
              </p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold tracking-tight tabular-nums">
                  {formattedFee}
                </span>
                <span className="text-sm text-slate-300">one-time fixed fee</span>
              </div>
              <p className="text-xs text-slate-300 mb-6">
                Estimated turnaround: {estimate.turnaroundDays}
              </p>

              <div className="border-t border-slate-800 pt-5 space-y-2.5">
                <p className="text-xs font-semibold text-slate-300 mb-2">Included Deliverables</p>
                {estimate.deliverables.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-slate-100">
                    <Check
                      className="w-4 h-4 text-sky-400 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-800 space-y-4">
              <p className="text-xs text-slate-300">{estimate.monthlyRetainerOption}</p>
              <button
                type="button"
                onClick={() =>
                  onApplyScope({
                    erp,
                    assetBand,
                    vendorAddon,
                    isPilot,
                    feeInr: estimate.feeInr,
                  })
                }
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] text-sm font-semibold text-slate-900 bg-white rounded-lg hover:bg-slate-100 transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                <span>Apply This Scope to Request</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
