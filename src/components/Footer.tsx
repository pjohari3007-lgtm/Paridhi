export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <p className="text-base font-bold text-slate-900">SahiKhata</p>
          <p className="text-xs text-slate-600">
            Fixed Asset &amp; Vendor Master Reconciliation · Dehradun / Selaqui · Haridwar
            (SIDCUL) · Rudrapur
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
          <a href="#services" className="hover:text-slate-900 transition-colors">
            Services
          </a>
          <a href="#audit-samples" className="hover:text-slate-900 transition-colors">
            Audit Samples
          </a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">
            Pricing
          </a>
          <a href="#ca-partners" className="hover:text-slate-900 transition-colors">
            CA Partners
          </a>
          <a
            href="mailto:paridhi.0251mba582@dgu.ac.in"
            className="font-medium text-slate-900 hover:underline underline-offset-4"
          >
            paridhi.0251mba582@dgu.ac.in
          </a>
        </div>
      </div>
    </footer>
  );
}
