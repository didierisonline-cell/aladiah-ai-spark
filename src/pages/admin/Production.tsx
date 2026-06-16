import FounderShell from '@/components/founder/FounderShell';
import AcademyProduction from '@/components/admin/curriculum/AcademyProduction';

/** /admin/production — Academy Production (founder-only via FounderRoute). */
const Production = () => (
  <FounderShell>
      <AcademyProduction />
    </FounderShell>
);

export default Production;
