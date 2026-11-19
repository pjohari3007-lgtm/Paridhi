import { useState } from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onBookClick: () => void;
}

const NAV_ITEMS = [
  { label: 'Services', href: '#services' },
  { label: 'Audit Samples', href: '#audit-samples' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'CA Partners', href: '#ca-partners' },
];

function GoogleMark() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

export function Header({ onBookClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, authReady, signingIn, signInWithGoogle, signOutUser } = useAuth();

  const firstName =
    user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Account';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded"
        >
          SahiKhata
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action (Google Sign-In / Signed-in session control) */}
        <div className="flex items-center gap-3 shrink-0">
          {!authReady ? (
            <span className="hidden sm:inline-block px-4 py-2 text-xs font-medium text-slate-400 whitespace-nowrap shrink-0">
              Checking session...
            </span>
          ) : user ? (
            <button
              type="button"
              onClick={() => void signOutUser()}
              title={`Signed in as ${user.email || firstName}. Click to sign out.`}
              className="hidden sm:inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[40px] text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              <span className="truncate max-w-[140px]">{firstName}</span>
              <span aria-hidden="true" className="text-slate-400">
                ·
              </span>
              <LogOut className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
              <span>Sign out</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={signingIn}
              onClick={() => void signInWithGoogle()}
              className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[40px] text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
            >
              <GoogleMark />
              <span>{signingIn ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>
          )}

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onBookClick();
            }}
            className="w-full mt-2 px-4 py-3 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Book Quick Check
          </button>
          {user ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                void signOutUser();
              }}
              className="w-full px-4 py-3 text-sm font-semibold text-slate-800 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Sign out ({firstName})
            </button>
          ) : (
            <button
              type="button"
              disabled={signingIn}
              onClick={() => {
                setMobileMenuOpen(false);
                void signInWithGoogle();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <GoogleMark />
              <span>{signingIn ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
