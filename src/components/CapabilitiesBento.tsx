import { ResilientImage } from './ResilientImage';

export function CapabilitiesBento() {
  return (
    <section id="services" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-sky-700 mb-2">Core Reconciliation Scope</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Built for overloaded plant finance teams before statutory audits.
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            When one or two accountants handle daily invoicing, GST, and TDS, asset registers and
            vendor masters drift out of sync. We isolate and document every discrepancy without
            disrupting daily operations.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 01: Wide Span */}
          <article className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Primary Audit Deliverable · SAP &amp; Tally
                </p>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  01. Fixed Asset Register Reconciliation
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                  We match your book asset register line-by-line against physical plant verification
                  sheets—catching missing or scrapped machinery still sitting on the balance sheet,
                  wrong depreciation keys, and Schedule II useful-life mismatches.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <span className="block font-semibold text-slate-900">Ghost &amp; Retired Assets</span>
                  <span>Flagged for clean disposal entry</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-900">Depreciation Keys</span>
                  <span>Checked against company policy</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 bg-slate-100 border-t md:border-t-0 md:border-l border-slate-200 min-h-[220px]">
              <ResilientImage
                src="/src/assets/images/reconciliation_desk_audit_1795080237091.jpg"
                alt="Finance manager comparing fixed asset ledger sheets with equipment tags"
                fallbackTitle="Asset Register Review"
                fallbackSubtitle="Line-by-line physical tag to book ledger matching."
                className="w-full h-full object-cover"
              />
            </div>
          </article>

          {/* Card 02: Single Span */}
          <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">
                Diagnostic Depth · Zero Guesswork
              </p>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                02. Root-Cause &amp; Fix List
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Unlike rushed year-end clean-ups that patch symptoms once and fail again next year,
                every finding comes with why the mismatch happened, its rupee impact, and exact
                posting steps for your accountant.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-900">Included in every health check</p>
              <p>Actionable correction workbook ready for statutory auditor sign-off.</p>
            </div>
          </article>

          {/* Card 03: Single Span */}
          <article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">
                Payables Protection · GST &amp; TDS Ready
              </p>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                03. Vendor Master Clean-Up
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Catch duplicate supplier codes created under trade vs legal names, mismatched
                payment terms (including MSME 43B(h) 45-day risks), and FI/MM mapping errors before
                payment runs.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-900">Standalone or Add-On</p>
              <p>Prevent duplicate vendor disbursements and TDS short-deduction notices.</p>
            </div>
          </article>

          {/* Card 04: Wide Span */}
          <article className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-5 bg-slate-100 border-b md:border-b-0 md:border-r border-slate-200 min-h-[220px]">
              <ResilientImage
                src="/src/assets/images/industrial_belt_plant_1795080236173.jpg"
                alt="Mid-sized manufacturing facility exterior in an industrial corridor"
                fallbackTitle="Industrial Belt Coverage"
                fallbackSubtitle="Serving Selaqui, SIDCUL Haridwar, Rudrapur, and NCR manufacturing hubs."
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">
                  Promoter Clarity · Optional Monthly Retainer
                </p>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  04. One-Page Owner Brief &amp; Power BI Visibility
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                  Promoter-owners approve fees when they see clear numbers. Every engagement ends
                  with a plain-language 1-page summary of rupee exposure at stake—plus optional
                  monthly Power BI or Excel visibility for expenses, payables, and asset disposals.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
                <span>1-Page Promoter Summary</span>
                <span aria-hidden="true">·</span>
                <span>Sample Power BI Expense &amp; Disposal View</span>
                <span aria-hidden="true">·</span>
                <span>Signed Confidentiality Note</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
