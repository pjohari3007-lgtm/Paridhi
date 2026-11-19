import { ArrowRight } from 'lucide-react';
import { ResilientImage } from './ResilientImage';

interface HeroSectionProps {
  onBookClick: () => void;
}

const BENCHMARKS = [
  {
    label: 'Fixed-Fee Health Check',
    value: '₹15,000 – ₹30,000',
    note: '₹10–15k discounted pilot slot',
  },
  {
    label: 'Systems Supported',
    value: 'SAP · Tally · Excel',
    note: 'Zero ERP lock-in or integration delay',
  },
  {
    label: 'Industrial Focus',
    value: 'Haridwar · Selaqui · Rudrapur',
    note: '₹10–100 Cr turnover plants',
  },
  {
    label: 'Data Protection',
    value: 'Signed NDA First',
    note: 'Anonymised sample option available',
  },
];

export function HeroSection({ onBookClick }: HeroSectionProps) {
  return (
    <section id="top" className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 lg:pt-16 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Core Proposition */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-sm font-medium text-sky-700 mb-4">
              Uttarakhand Industrial Belt · Fixed Asset &amp; Vendor Reconciliation
            </p>

            <h1
              className="font-bold tracking-tight text-slate-900 leading-[1.1] text-balance mb-6"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
            >
              Books that match your factory floor before the auditor arrives.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
              SahiKhata helps manufacturing MSMEs running Tally or basic SAP reconcile fixed
              asset registers against physical verification and clean up vendor master errors—at a
              fixed fee, without hiring a full-time analyst or a ₹2 lakh consulting firm.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBookClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
              >
                <span>Book 15-Minute Quick Check</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <a
                href="#audit-samples"
                className="inline-flex items-center justify-center px-5 py-3 min-h-[44px] text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 hover:text-slate-900 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
              >
                Inspect Sample Error Log
              </a>
            </div>
          </div>

          {/* Right Column: Full-height 16:9 Plant Visual */}
          <div className="lg:col-span-6 flex">
            <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[280px] lg:min-h-[420px]">
              <ResilientImage
                src="/src/assets/images/hero_manufacturing_floor_1795080236175.jpg"
                alt="Precision CNC machining floor inside a mid-sized Indian manufacturing plant"
                fallbackTitle="Manufacturing Plant Floor Verification"
                fallbackSubtitle="Physical fixed asset verification reconciled directly against SAP and Tally registers."
                className="w-full h-full object-cover lg:h-full"
              />
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Summary Strip below Hero Split */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENCHMARKS.map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <p className="text-lg font-semibold text-slate-900 tabular-nums">{item.value}</p>
              <p className="text-xs text-slate-600">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
