import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Aladiah brand design tokens (shared with public pages e.g. Certifications.tsx)
export const DS = {
  bg: '#0B111E', card: '#111D30', border: '#1E2D47', fg: '#EDF2F7', fm: '#8596AD',
  blue: '#4A90F5', bd: 'rgba(74,144,245,.14)', bb: 'rgba(74,144,245,.28)',
  orange: '#F0622A', gold: '#F5B81A', gb: 'rgba(245,184,26,.28)', gd: 'rgba(245,184,26,.12)',
};

export type LegalSection = { h: string; body: string[] };

/**
 * Shared shell for public legal pages (Terms / Privacy / Contact).
 * Renders the brand header/footer, a mandatory draft-review banner, the
 * document title, and the section list. Copy is passed in as plain data so the
 * pages stay translation-ready (sections can later be sourced from t()).
 */
export default function LegalShell({
  title, lastUpdated, intro, sections, children,
}: {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections?: LegalSection[];
  children?: ReactNode;
}) {
  return (
    <div style={{ background: DS.bg, minHeight: '100vh', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", color: DS.fg }}>
      <Header />
      <main style={{ paddingTop: 70 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>
          {/* Draft-review banner — required until founder/legal sign-off */}
          <div role="note" style={{
            background: DS.gd, border: `1px solid ${DS.gb}`, borderRadius: '0.6rem',
            padding: '0.9rem 1.1rem', marginBottom: '2rem', fontSize: 13, lineHeight: 1.6, color: DS.gold,
          }}>
            ⚠️ <strong>Draft placeholder — requires Founder/legal review before public launch.</strong>{' '}
            <span style={{ color: DS.fm }}>This page is provided for structure only and is not legal advice.</span>
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 800, margin: '0 0 0.4rem', letterSpacing: '-0.5px' }}>{title}</h1>
          <div style={{ fontSize: 12, color: DS.fm, marginBottom: '2rem' }}>Last updated: {lastUpdated} · Draft</div>

          {intro && <p style={{ fontSize: 15, lineHeight: 1.75, color: DS.fm, marginBottom: '2rem' }}>{intro}</p>}

          {sections?.map((s, i) => (
            <section key={i} style={{ marginBottom: '1.75rem' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: DS.fg, margin: '0 0 0.5rem' }}>
                <span style={{ color: DS.blue, fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}.</span> {s.h}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} style={{ fontSize: 14, lineHeight: 1.75, color: DS.fm, margin: '0 0 0.6rem' }}>{p}</p>
              ))}
            </section>
          ))}

          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
