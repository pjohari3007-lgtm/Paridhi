import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CapabilitiesBento } from './components/CapabilitiesBento';
import { AuditSampleLedger } from './components/AuditSampleLedger';
import {
  HealthCheckEstimator,
  type SelectedScopePayload,
} from './components/HealthCheckEstimator';
import { ComparisonAndPartners } from './components/ComparisonAndPartners';
import { BookingSection } from './components/BookingSection';
import { Footer } from './components/Footer';

export default function App() {
  const [appliedScope, setAppliedScope] = useState<SelectedScopePayload | null>(null);
  const [presetRole, setPresetRole] = useState<string | null>(null);

  const scrollToBooking = () => {
    const el = document.getElementById('book-check');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyScope = (scope: SelectedScopePayload) => {
    setAppliedScope(scope);
    scrollToBooking();
  };

  const handleSelectCaPartner = () => {
    setPresetRole('ca-partner');
    scrollToBooking();
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Header onBookClick={scrollToBooking} />
          <main className="flex-1">
            <HeroSection onBookClick={scrollToBooking} />
            <CapabilitiesBento />
            <AuditSampleLedger />
            <HealthCheckEstimator onApplyScope={handleApplyScope} />
            <ComparisonAndPartners onSelectCaPartner={handleSelectCaPartner} />
            <BookingSection appliedScope={appliedScope} presetRole={presetRole} />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}
