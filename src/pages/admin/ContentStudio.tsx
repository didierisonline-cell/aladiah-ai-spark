import Header from '@/components/Header';
import WorkforceNav from '@/components/admin/WorkforceNav';
import ContentAuthoringCenter from '@/components/admin/content/ContentAuthoringCenter';

/** /admin/content — Founder Content Authoring Center (founder-only via FounderRoute). */
const ContentStudio = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="max-w-7xl mx-auto px-4 py-8">
      <WorkforceNav />
      <ContentAuthoringCenter />
    </main>
  </div>
);

export default ContentStudio;
