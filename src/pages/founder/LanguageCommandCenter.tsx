import Header from '@/components/Header';
import FounderNav from '@/components/founder/FounderNav';
import LanguageQualityDashboard from '@/components/founder/language/LanguageQualityDashboard';

/**
 * /founder/language-quality — Language Quality Command Center.
 * Founder-only via <FounderRoute>. Surface for the Global Language Adaptation
 * Agent: per-language coverage, missing-content registry, and the vocabulary
 * review funnel.
 */
const LanguageCommandCenter = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="max-w-7xl mx-auto px-4 py-8">
      <FounderNav />
      <LanguageQualityDashboard />
    </main>
  </div>
);

export default LanguageCommandCenter;
