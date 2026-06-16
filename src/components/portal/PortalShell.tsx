import React from 'react';
import Header from '@/components/Header';
import PortalSidebar from '@/components/PortalSidebar';

interface PortalShellProps {
  /** Page content — pass your own <main> (keeps per-page padding/styles). */
  children: React.ReactNode;
  /** Optional right rail (e.g. the StudentPortal dashboard widgets column). */
  rightRail?: React.ReactNode;
  /** Page background (pages use different DS backgrounds). */
  background?: string;
}

/**
 * PortalShell — THE single layout shell for every authenticated student route.
 * Header (top nav) + PortalSidebar (left nav) + responsive grid. The `.portal-shell`
 * class collapses the grid to one column and hides the sidebar at <=1024px (Header
 * provides nav on small screens). Replaces the per-page inline composition that had
 * drifted (bespoke StudentPortal nav, duplicated grids).
 */
export default function PortalShell({ children, rightRail, background = '#0B111E' }: PortalShellProps) {
  return (
    <div style={{ background, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: '#EDF2F7' }}>
      <Header />
      <div
        className="portal-shell"
        style={{
          display: 'grid',
          gridTemplateColumns: rightRail ? '260px 1fr 310px' : '260px 1fr',
          minHeight: '100vh',
          paddingTop: 70,
        }}
      >
        <PortalSidebar />
        {children}
        {rightRail}
      </div>
    </div>
  );
}
