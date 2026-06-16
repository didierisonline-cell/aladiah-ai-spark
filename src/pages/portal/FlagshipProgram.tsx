import PortalShell from '@/components/portal/PortalShell';
import FlagshipProgramView from '@/components/portal/FlagshipProgram';

/**
 * /portal/flagship — the student-facing flagship program experience.
 * Surfaces the complete AI Scrum Master Professional Certification (18 modules,
 * 54 simulations, 18 labs, 18 portfolios, 18 interview drills) with Talent
 * Score, AI Mentor, Placement, Portfolio, and Certification integrations.
 * The reference model for all future Aladiah programs.
 */
export default function FlagshipProgram() {
  return (
    <PortalShell background="#060E1C">
        <div style={{ flex: 1, minHeight: 'calc(100vh - 70px)', overflowX: 'hidden' }}>
          <FlagshipProgramView />
        </div>
    </PortalShell>
  );
}
