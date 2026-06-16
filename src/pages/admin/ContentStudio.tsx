import FounderShell from '@/components/founder/FounderShell';
import ContentAuthoringCenter from '@/components/admin/content/ContentAuthoringCenter';

/** /admin/content — Founder Content Authoring Center (founder-only via FounderRoute). */
const ContentStudio = () => (
  <FounderShell>
      <ContentAuthoringCenter />
    </FounderShell>
);

export default ContentStudio;
