import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Copy, FileText, ShieldCheck } from 'lucide-react';
import type { SelectedScopePayload } from './HealthCheckEstimator';

export interface BookingRecord {
  id: string;
  companyName: string;
  location: string;
  role: string;
  erp: string;
  contact: string;
  engagementType: string;
  notes: string;
  submittedAt: string;
}

interface BookingSectionProps {
  appliedScope: SelectedScopePayload | null;
  presetRole: string | null;
}

const STORAGE_KEY = 'sahikhata_quickcheck_requests_v1';

export function BookingSection({ appliedScope, presetRole }: BookingSectionProps) {
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('Haridwar (SIDCUL)');
  const [role, setRole] = useState('Finance Head / Accounts Manager');
  const [erp, setErp] = useState('Tally Prime');
  const [contact, setContact] = useState('');
  const [engagementType, setEngagementType] = useState('Free 15-Min Quick Check');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<BookingRecord | null>(null);
  const [copiedNda, setCopiedNda] = useState(false);

  useEffect(() => {
    if (appliedScope) {
      setErp(
        appliedScope.erp === 'sap'
          ? 'SAP ECC / S4HANA'
          : appliedScope.erp === 'tally'
            ? 'Tally Prime'
            : 'Excel + Tally'
      );
      setEngagementType(
        appliedScope.isPilot
          ? 'Discounted Pilot Health Check (₹10k–15k)'
          : 'Fixed-Fee Reconciliation Health Check'
      );
      const formattedFee = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(appliedScope.feeInr);
      setNotes(
        `Estimated scope: ${appliedScope.assetBand} asset band · Vendor Master Add-on: ${
          appliedScope.vendorAddon ? 'Yes' : 'No'
        } · Estimate: ${formattedFee}`
      );
    }
  }, [appliedScope]);

  useEffect(() => {
    if (presetRole === 'ca-partner') {
      setRole('Partner at CA Firm');
      setEngagementType('CA Firm Referral / Subcontracting');
    }
  }, [presetRole]);

  const validateContact = (value: string) => {
    const trimmed = value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+]?[\d\s-]{10,15}$/;
    return emailPattern.test(trimmed) || phonePattern.test(trimmed);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!companyName.trim()) {
      setErrorMsg('Please enter your company or CA firm name.');
      return;
    }

    if (!validateContact(contact)) {
      setErrorMsg('Please enter a valid work email address or 10-digit phone number.');
      return;
    }

    const record: BookingRecord = {
      id: `SK-${Math.floor(1000 + Math.random() * 9000)}`,
      companyName: companyName.trim(),
      location,
      role,
      erp,
      contact: contact.trim(),
      engagementType,
      notes: notes.trim(),
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    try {
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      const existing: BookingRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...existing.slice(0, 4)]));
    } catch {
      // Storage unavailable in restricted private browsing; proceed cleanly
    }

    setSubmittedRecord(record);
  };

  const ndaText = `CONFIDENTIALITY & DATA HANDLING NOTE (SAHIKHATA)
Prepared for: ${submittedRecord?.companyName || '[Client Company Name]'}
Reference: ${submittedRecord?.id || 'Standard Pilot Protocol'}

1. Purpose Limitation: Fixed asset registers, physical verification sheets, and vendor master extracts shared with SahiKhata are used solely to perform the agreed reconciliation health check.
2. No External Disclosure: Client financial records, GSTINs, pricing, or supplier lists will never be shared with third parties, competitors, or external systems.
3. Anonymised Sample Option: Clients may begin a 15-minute quick check or pilot using an anonymised extract (masked vendor names/GSTINs) before sharing full records.
4. Data Return & Deletion: All working extracts are returned or permanently deleted within 14 days of final report sign-off unless retained under an explicit written retainer.`;

  const handleCopyNda = async () => {
    try {
      await navigator.clipboard.writeText(ndaText);
      setCopiedNda(true);
      setTimeout(() => setCopiedNda(false), 2000);
    } catch {
      setCopiedNda(false);
    }
  };

  return (
    <section id="book-check" className="py-16 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
            <p className="text-sm font-medium text-sky-700 mb-2">
              Start With Zero Obligation
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              Book a free 15-minute quick check or fixed-fee pilot
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Share your plant location and ERP setup. We reply with an anonymised sample error
              report and our signed confidentiality note before any data leaves your desk.
            </p>

            {submittedRecord ? (
              <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Request Saved ({submittedRecord.id})
                    </h3>
                    <p className="text-sm text-slate-700 mt-1">
                      Thank you, <span className="font-semibold">{submittedRecord.companyName}</span>{' '}
                      ({submittedRecord.location}). Your {submittedRecord.engagementType} inquiry
                      for <span className="font-semibold">{submittedRecord.erp}</span> has been
                      logged locally. For direct scheduling, email{' '}
                      <a
                        href={`mailto:paridhi.0251mba582@dgu.ac.in?subject=${encodeURIComponent(
                          `SahiKhata Inquiry (${submittedRecord.id}) - ${submittedRecord.companyName}`
                        )}&body=${encodeURIComponent(
                          `Company: ${submittedRecord.companyName}\nLocation: ${submittedRecord.location}\nRole: ${submittedRecord.role}\nERP: ${submittedRecord.erp}\nEngagement: ${submittedRecord.engagementType}\nContact: ${submittedRecord.contact}\nNotes: ${submittedRecord.notes}`
                        )}`}
                        className="underline font-medium text-sky-800 hover:text-sky-900"
                      >
                        paridhi.0251mba582@dgu.ac.in
                      </a>{' '}
                      with one click to send your pre-filled brief.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={`mailto:paridhi.0251mba582@dgu.ac.in?subject=${encodeURIComponent(
                      `SahiKhata Quick Check (${submittedRecord.id}) - ${submittedRecord.companyName}`
                    )}&body=${encodeURIComponent(
                      `Company: ${submittedRecord.companyName}\nLocation: ${submittedRecord.location}\nRole: ${submittedRecord.role}\nERP: ${submittedRecord.erp}\nEngagement: ${submittedRecord.engagementType}\nContact: ${submittedRecord.contact}\nNotes: ${submittedRecord.notes}`
                    )}`}
                    className="inline-flex items-center justify-center px-4 py-2.5 min-h-[40px] text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Open Pre-Filled Email Brief
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRecord(null);
                      setCompanyName('');
                      setContact('');
                    }}
                    className="inline-flex items-center justify-center px-4 py-2.5 min-h-[40px] text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="sk-company"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Company / CA Firm Name
                    </label>
                    <input
                      id="sk-company"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Shivalik Precision Components"
                      className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="sk-location"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Industrial Area / City
                    </label>
                    <select
                      id="sk-location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                    >
                      <option>Haridwar (SIDCUL)</option>
                      <option>Dehradun / Selaqui</option>
                      <option>Rudrapur / Pantnagar</option>
                      <option>Ghaziabad / Noida / Greater Noida</option>
                      <option>Other Industrial Cluster</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="sk-role"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Your Role
                    </label>
                    <select
                      id="sk-role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                    >
                      <option>Finance Head / Accounts Manager</option>
                      <option>Plant Accountant</option>
                      <option>Promoter / Director</option>
                      <option>Partner at CA Firm</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="sk-erp"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Current Accounting Software
                    </label>
                    <select
                      id="sk-erp"
                      value={erp}
                      onChange={(e) => setErp(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                    >
                      <option>Tally Prime</option>
                      <option>SAP ECC / S4HANA</option>
                      <option>Excel + Tally</option>
                      <option>Other ERP</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="sk-engagement"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Request Type
                    </label>
                    <select
                      id="sk-engagement"
                      value={engagementType}
                      onChange={(e) => setEngagementType(e.target.value)}
                      className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                    >
                      <option>Free 15-Min Quick Check</option>
                      <option>Discounted Pilot Health Check (₹10k–15k)</option>
                      <option>Fixed-Fee Reconciliation Health Check</option>
                      <option>CA Firm Referral / Subcontracting</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="sk-contact"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Work Email or Phone Number
                    </label>
                    <input
                      id="sk-contact"
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="finance@company.in or +91 98..."
                      className="w-full px-3.5 py-2.5 min-h-[42px] text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="sk-notes"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Audit Timeline or Specific Concern (Optional)
                  </label>
                  <textarea
                    id="sk-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Statutory audit next month; physical verification sheet ready for ~250 machines."
                    className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                  />
                </div>

                {errorMsg && (
                  <p role="alert" className="text-xs font-medium text-rose-700">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 min-h-[44px] text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
                >
                  Request Quick Check &amp; Confidentiality Note
                </button>
              </form>
            )}
          </div>

          {/* Right: Consent & Confidentiality Note Preview */}
          <aside className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0" aria-hidden="true" />
                <h3 className="text-base font-bold text-slate-900">
                  Consent &amp; Confidentiality Note
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCopyNda}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{copiedNda ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sharing asset registers and vendor files requires trust. Every engagement starts with
              a signed confidentiality note and supports starting with anonymised extracts.
            </p>

            <pre className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {ndaText}
            </pre>

            <div className="pt-2 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Built on hands-on SAP fixed asset and vendor master reconciliation experience
                (Continental India internship &amp; academic depreciation audit project).
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
