import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  SAMPLE_MISMATCHES,
  type LedgerCategory,
  type MismatchSeverity,
} from '../data/reconciliationData';

export function AuditSampleLedger() {
  const [category, setCategory] = useState<LedgerCategory>('fixed-asset');
  const [severityFilter, setSeverityFilter] = useState<'all' | MismatchSeverity>('all');
  const [expandedId, setExpandedId] = useState<string>('fa-1');

  const rows = SAMPLE_MISMATCHES.filter((row) => {
    const matchesCategory = row.category === category;
    const matchesSeverity = severityFilter === 'all' || row.severity === severityFilter;
    return matchesCategory && matchesSeverity;
  });

  const handleCategoryChange = (next: LedgerCategory) => {
    setCategory(next);
    const first = SAMPLE_MISMATCHES.find((r) => r.category === next);
    if (first) {
      setExpandedId(first.id);
    }
  };

  return (
    <section id="audit-samples" className="py-16 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-sky-700 mb-2">
              Anonymised Sample Error Report
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
              What a SahiKhata health check actually catches before audit week.
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Representative mismatches drawn from hands-on SAP and Excel fixed asset and vendor
              master reconciliations. Select any row to inspect the root cause and accountant fix.
            </p>
          </div>

          {/* Interactive Segmented Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div
              role="tablist"
              aria-label="Ledger type"
              className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200"
            >
              <button
                type="button"
                role="tab"
                aria-selected={category === 'fixed-asset'}
                onClick={() => handleCategoryChange('fixed-asset')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  category === 'fixed-asset'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fixed Asset Register
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={category === 'vendor-master'}
                onClick={() => handleCategoryChange('vendor-master')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  category === 'vendor-master'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vendor Master
              </button>
            </div>

            <select
              aria-label="Filter by impact severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as 'all' | MismatchSeverity)}
              className="px-3.5 py-2 min-h-[38px] text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              <option value="all">All Severities</option>
              <option value="High Impact">High Impact</option>
              <option value="Compliance Risk">Compliance Risk</option>
              <option value="Record Hygiene">Record Hygiene</option>
            </select>
          </div>
        </div>

        {/* Tabular Ledger */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3.5 px-4 whitespace-nowrap">Record ID</th>
                  <th className="py-3.5 px-4">Asset / Vendor Item</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">ERP</th>
                  <th className="py-3.5 px-4">Mismatch Found</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Severity</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Book Value</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Exposure</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 px-4 text-center text-slate-500">
                      No sample findings match the selected severity filter.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    const isExpanded = expandedId === row.id;
                    const severityColor =
                      row.severity === 'High Impact'
                        ? 'text-rose-700 font-semibold'
                        : row.severity === 'Compliance Risk'
                          ? 'text-amber-700 font-semibold'
                          : 'text-slate-700 font-medium';

                    return (
                      <FragmentRow
                        key={row.id}
                        row={row}
                        isExpanded={isExpanded}
                        severityColor={severityColor}
                        onToggle={() => setExpandedId(isExpanded ? '' : row.id)}
                      />
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FragmentRowProps {
  row: (typeof SAMPLE_MISMATCHES)[number];
  isExpanded: boolean;
  severityColor: string;
  onToggle: () => void;
}

function FragmentRow({ row, isExpanded, severityColor, onToggle }: FragmentRowProps) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`cursor-pointer transition-colors duration-150 ${
          isExpanded ? 'bg-sky-50/50' : 'hover:bg-slate-50'
        }`}
      >
        <td className="py-3.5 px-4 font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
          {row.recordCode}
        </td>
        <td className="py-3.5 px-4 font-medium text-slate-900">{row.itemName}</td>
        <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">{row.erpSystem}</td>
        <td className="py-3.5 px-4 text-slate-700">{row.issueType}</td>
        <td className={`py-3.5 px-4 text-xs whitespace-nowrap ${severityColor}`}>
          {row.severity}
        </td>
        <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-800 tabular-nums whitespace-nowrap">
          {row.bookValueInr}
        </td>
        <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-900 font-medium tabular-nums whitespace-nowrap">
          {row.exposureInr}
        </td>
        <td className="py-3.5 px-4 text-right whitespace-nowrap">
          <button
            type="button"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Collapse ${row.recordCode}` : `Expand ${row.recordCode}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 cursor-pointer"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-slate-50/80">
          <td colSpan={8} className="px-4 py-4 sm:px-6 border-t border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Root Cause Identified</p>
                <p className="text-slate-700 leading-relaxed">{row.rootCause}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-sky-700 mb-1">
                  Recommended Accountant Fix
                </p>
                <p className="text-slate-800 leading-relaxed">{row.recommendedFix}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
