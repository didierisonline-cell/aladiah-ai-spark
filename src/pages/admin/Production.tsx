import Header from '@/components/Header';
import WorkforceNav from '@/components/admin/WorkforceNav';
import AcademyProduction from '@/components/admin/curriculum/AcademyProduction';

/** /admin/production — Academy Production (founder-only via FounderRoute). */
const Production = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="max-w-7xl mx-auto px-4 py-8">
      <WorkforceNav />
      <AcademyProduction />
    </main>
  </div>
);

export default Production;
