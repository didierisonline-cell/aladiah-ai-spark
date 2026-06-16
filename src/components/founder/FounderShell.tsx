import React from 'react';
import Header from '@/components/Header';
import FounderNav from '@/components/founder/FounderNav';

interface FounderShellProps {
  children: React.ReactNode;
  /** Use the wider (max-w-[88rem]) content column for dense dashboards. */
  wide?: boolean;
}

/**
 * FounderShell — THE single layout shell for every founder + admin route.
 * Header + the one founder navigation bar (FounderNav, which renders the shared
 * FOUNDER_NAV_ITEMS). Replaces the per-page composition that split into FounderNav
 * (founder pages) vs WorkforceNav (admin pages) — both now resolve to one nav.
 */
export default function FounderShell({ children, wide = false }: FounderShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={`${wide ? 'max-w-[88rem]' : 'max-w-7xl'} mx-auto px-4 py-8`}>
        <FounderNav />
        {children}
      </main>
    </div>
  );
}
