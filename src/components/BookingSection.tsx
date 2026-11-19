import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Copy, FileText, ShieldCheck, Trash2, XCircle } from 'lucide-react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import type { SelectedScopePayload } from './HealthCheckEstimator';

export interface FirestoreBookingRecord {
  id: string;
  ownerId: string;
  ownerEmail: string;
  companyName: string;
  location: string;
  role: string;
  erp: string;
  contact: string;
  engagementType: string;
  notes: string;
  status: 'submitted' | 'cancelled';
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
}

interface BookingSectionProps {
  appliedScope: SelectedScopePayload | null;
  presetRole: string | null;
}

export function BookingSection({ appliedScope, presetRole }: BookingSectionProps) {
  const { user, authReady, signingIn, authError, signInWithGoogle, clearAuthError } = useAuth();

  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('Haridwar (SIDCUL)');
  const [role, setRole] = useState('Finance Head / Accounts Manager');
  const [erp, setErp] = useState('Tally Prime');
  const [contact, setContact] = useState('');
  const [engagementType, setEngagementType] = useState('Free 15-Min Quick Check');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);
  const [savedRequests, setSavedRequests] = useState<FirestoreBookingRecord[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [copiedNda, setCopiedNda] = useState(false);

  useEffect(() => {
    if (user?.email && !contact) {
      setContact(user.email);
    }
  }, [user, contact]);

  useEffect(() => {
    if (!authReady || !user) {
      setSavedRequests([]);
      setLoadingRequests(false);
      return;
    }

    setLoadingRequests(true);
    const reqQuery = query(
      collection(db, 'requests'),
      where('ownerId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      reqQuery,
      (snapshot) => {
        const items: FirestoreBookingRecord[] = snapshot.docs.map((d) => ({
          ...(d.data() as Omit<FirestoreBookingRecord, 'id'>),
          id: d.id,
        }));
        items.sort((a, b) => {
          const aMs = a.createdAt?.toMillis?.() ?? 0;
          const bMs = b.createdAt?.toMillis?.() ?? 0;
          return bMs - aMs;
        });
        setSavedRequests(items);
        setLoadingRequests(false);
      },
      (error) => {
        setLoadingRequests(false);
        handleFirestoreError(error, OperationType.LIST, 'requests');
      }
    );

    return () => unsubscribe();
  }, [authReady, user]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    clearAuthError();

    if (!companyName.trim()) {
      setErrorMsg('Please enter your company or CA firm name.');
      return;
    }

    const contactToSave = contact.trim() || user?.email || '';
    if (!validateContact(contactToSave)) {
      setErrorMsg('Please enter a valid work email address or 10-digit phone number.');
      return;
    }

    if (!user) {
      await signInWithGoogle();
    }

    const activeUser = auth.currentUser;
    if (!activeUser || !activeUser.email) {
      setErrorMsg('Please complete Google Sign-In to save your health-check request.');
      return;
    }

    setSubmitting(true);
    const requestId = `SK-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      100 + Math.random() * 900
    )}`;
    const docPath = `requests/${requestId}`;

    try {
      await setDoc(doc(db, 'requests', requestId), {
        id: requestId.slice(0, 64),
        ownerId: activeUser.uid,
        ownerEmail: activeUser.email.slice(0, 254),
        companyName: companyName.trim().slice(0, 160),
        location: location.slice(0, 120),
        role: role.slice(0, 100),
        erp: erp.slice(0, 80),
        contact: contactToSave.slice(0, 160),
        engagementType: engagementType.slice(0, 120),
        notes: notes.trim().slice(0, 1000),
        status: 'submitted',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setLastCreatedId(requestId);
      setCompanyName('');
      setNotes('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, docPath);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (req: FirestoreBookingRecord) => {
    const docPath = `requests/${req.id}`;
    try {
      await updateDoc(doc(db, 'requests', req.id), {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    }
  };

  const handleDeleteRequest = async (req: FirestoreBookingRecord) => {
    const docPath = `requests/${req.id}`;
    try {
      await deleteDoc(doc(db, 'requests', req.id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, docPath);
    }
  };

  const latestRequest = savedRequests[0] || null;
  const ndaText = `CONFIDENTIALITY & DATA HANDLING NOTE (SAHIKHATA)
Prepared for: ${latestRequest?.companyName || companyName || '[Client Company Name]'}
Reference: ${lastCreatedId || latestRequest?.id || 'Standard Pilot Protocol'}

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
          {/* Left: Form + Saved Requests */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
                <div>
                  <p className="text-sm font-medium text-sky-700 mb-1">
                    Start With Zero Obligation
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Book a free 15-minute quick check or pilot
                  </h2>
                </div>

                {authReady && !user && (
                  <button
                    type="button"
                    disabled={signingIn}
                    onClick={() => void signInWithGoogle()}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
                  >
                    <span>{signingIn ? 'Signing in...' : 'Sign in with Google'}</span>
                  </button>
                )}
              </div>

              {authError && (
                <p
                  role="alert"
                  className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800"
                >
                  {authError}
                </p>
              )}

              {user && (
                <p className="mb-5 text-xs text-slate-600">
                  Signed in as <span className="font-semibold text-slate-900">{user.email}</span>{' '}
                  · Requests are saved privately to your account.
                </p>
              )}

              {lastCreatedId && (
                <div className="mb-6 border border-emerald-200 bg-emerald-50/50 rounded-xl p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Request Saved ({lastCreatedId})
                      </h3>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        Your inquiry has been saved to your Google-authenticated workspace. You can
                        also send the details directly to{' '}
                        <a
                          href={`mailto:paridhi.0251mba582@dgu.ac.in?subject=${encodeURIComponent(
                            `SahiKhata Quick Check (${lastCreatedId})`
                          )}`}
                          className="underline font-medium text-sky-800 hover:text-sky-900"
                        >
                          paridhi.0251mba582@dgu.ac.in
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={(e) => void handleSubmit(e)} noValidate className="space-y-4">
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
                      maxLength={160}
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
                      maxLength={160}
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
                    maxLength={1000}
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
                  disabled={submitting || signingIn}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 min-h-[44px] text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors duration-150 cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
                >
                  {submitting
                    ? 'Saving Request...'
                    : user
                      ? 'Save Request & Confidentiality Note'
                      : 'Sign in with Google & Submit Request'}
                </button>
              </form>
            </div>

            {/* Authenticated User Saved Requests */}
            {user && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Your Saved Requests
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  Synced across devices for {user.email}
                </p>

                {loadingRequests ? (
                  <p className="text-sm text-slate-500">Loading your saved requests...</p>
                ) : savedRequests.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No requests submitted yet. Use the form above to book a 15-minute quick check
                    or pilot health check.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {savedRequests.map((req) => (
                      <div
                        key={req.id}
                        className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-mono text-slate-700 tabular-nums">
                              {req.id}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={
                                req.status === 'cancelled'
                                  ? 'text-slate-500 font-medium'
                                  : 'text-emerald-700 font-semibold'
                              }
                            >
                              {req.status === 'cancelled' ? 'Cancelled' : 'Submitted'}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{req.erp}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">
                            {req.companyName} — {req.location}
                          </p>
                          <p className="text-xs text-slate-600">{req.engagementType}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {req.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => void handleCancelRequest(req)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Cancel</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => void handleDeleteRequest(req)}
                            aria-label={`Delete request ${req.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 min-h-[36px] text-xs font-medium text-rose-700 bg-rose-50 rounded-md hover:bg-rose-100 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                onClick={() => void handleCopyNda()}
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
