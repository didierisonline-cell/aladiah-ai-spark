import PortalShell from '@/components/portal/PortalShell';
import { color, space } from '../tokens';

interface PortalPageLayoutProps {
  children: React.ReactNode;
  rightRail?: React.ReactNode;
  /** Override default page padding (default: 32px) */
  padding?: number | string;
}

/**
 * Standard portal page wrapper.
 * Replaces the manual pattern:
 *   <PortalShell background={DS.bg}><main style={{ padding: '2rem' }}>...</main></PortalShell>
 *
 * Usage:
 *   <PortalPageLayout>
 *     <PageHeader title="..." />
 *     ...
 *   </PortalPageLayout>
 */
export default function PortalPageLayout({ children, rightRail, padding }: PortalPageLayoutProps) {
  return (
    <PortalShell background={color.bg} rightRail={rightRail}>
      <main
        style={{
          padding: padding ?? space[8],
          background: color.bg,
          minHeight: '100%',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          color: color.fg,
        }}
      >
        {children}
      </main>
    </PortalShell>
  );
}
