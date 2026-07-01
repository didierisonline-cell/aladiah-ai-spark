import { useState } from 'react';
import PortalShell from '@/components/portal/PortalShell';
import { AVIS_ASSETS, AVIS_SVG_REGISTRY, AVIS_STUDIO_SECTIONS } from '@/data/avisAssets';
import type { AvisAsset } from '@/types/avis';

const DS = {
  bg: '#0B111E', card: '#111D30', border: '#1E2D47', fg: '#EDF2F7', fm: '#8596AD',
  blue: '#4A90F5', bb: 'rgba(74,144,245,.28)',
  orange: '#F0622A', ob: 'rgba(240,98,42,.28)',
  green: '#22C98A',
};

const TYPE_COLORS: Record<string, string> = {
  hero_diagram: '#4A90F5',
  framework: '#9B59B6',
  process_flow: '#22C98A',
  architecture: '#4A90F5',
  attack_chain: '#F0622A',
  roadmap: '#F59E0B',
  timeline: '#00B4D8',
  decision_tree: '#22C98A',
  knowledge_map: '#9B59B6',
};

function AssetCard({ asset, onSelect }: { asset: AvisAsset; onSelect: (a: AvisAsset) => void }) {
  const [hovered, setHovered] = useState(false);
  const svgUrl = AVIS_SVG_REGISTRY[asset.svgKey];
  const accent = TYPE_COLORS[asset.type] ?? DS.blue;

  return (
    <div
      onClick={() => onSelect(asset)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: DS.card,
        border: `1px solid ${hovered ? accent + '66' : DS.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all .18s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,.3), 0 0 0 1px ${accent}22` : 'none',
      }}
    >
      {/* Thumbnail */}
      <div style={{ background: '#080E1A', borderBottom: `1px solid ${DS.border}`, overflow: 'hidden', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {svgUrl ? (
          <img src={svgUrl} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ fontSize: 32, opacity: .3 }}>🖼</div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: accent, background: `${accent}18`, border: `1px solid ${accent}44`, borderRadius: 5, padding: '2px 6px', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            {asset.type.replace(/_/g, ' ')}
          </span>
          {asset.lessonIndex && (
            <span style={{ fontSize: 9, color: DS.fm, fontWeight: 600 }}>M{asset.moduleIndex} · L{asset.lessonIndex}</span>
          )}
          {!asset.lessonIndex && (
            <span style={{ fontSize: 9, color: DS.fm, fontWeight: 600 }}>M{asset.moduleIndex}</span>
          )}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: DS.fg, lineHeight: 1.35, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
          {asset.title}
        </div>
        <div style={{ fontSize: 11, color: DS.fm, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
          {asset.description}
        </div>
      </div>
    </div>
  );
}

function AssetModal({ asset, onClose }: { asset: AvisAsset; onClose: () => void }) {
  const svgUrl = AVIS_SVG_REGISTRY[asset.svgKey];

  const handleDownload = () => {
    if (!svgUrl) return;
    const a = document.createElement('a');
    a.href = svgUrl;
    a.download = `avis-${asset.svgKey}.svg`;
    a.click();
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: 16, maxWidth: 960, width: '100%', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,.7)' }}
      >
        {/* Modal header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${DS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: DS.blue, background: 'rgba(74,144,245,.1)', border: `1px solid ${DS.bb}`, borderRadius: 5, padding: '2px 7px', letterSpacing: '.1em' }}>AVIS™</span>
              <span style={{ fontSize: 10, color: DS.fm, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>{asset.type.replace(/_/g, ' ')}</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: DS.fg }}>{asset.title}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleDownload} style={{ padding: '7px 14px', background: 'rgba(74,144,245,.12)', border: `1px solid ${DS.bb}`, borderRadius: 8, color: DS.blue, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              ⬇ Download SVG
            </button>
            <button onClick={onClose} style={{ padding: '7px 14px', background: 'rgba(255,255,255,.05)', border: `1px solid ${DS.border}`, borderRadius: 8, color: DS.fm, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              ✕ Close
            </button>
          </div>
        </div>
        {/* SVG */}
        <div style={{ background: '#080E1A', padding: 24 }}>
          {svgUrl && <img src={svgUrl} alt={asset.title} style={{ width: '100%', height: 'auto', borderRadius: 8 }} />}
        </div>
        {/* Metadata */}
        <div style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: DS.fm, marginBottom: 12 }}>{asset.description}</div>
          <div style={{ padding: '10px 14px', background: 'rgba(74,144,245,.05)', border: `1px solid ${DS.bb}`, borderRadius: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: DS.blue, textTransform: 'uppercase', letterSpacing: '.06em' }}>Learning objective · </span>
            <span style={{ fontSize: 12, color: DS.fm }}>{asset.learningObjective}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {asset.tags.map(tag => (
              <span key={tag} style={{ fontSize: 10, color: DS.fm, background: 'rgba(255,255,255,.05)', border: `1px solid ${DS.border}`, borderRadius: 99, padding: '3px 8px' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortalAvis() {
  const [selected, setSelected] = useState<AvisAsset | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const visibleAssets = activeSection
    ? AVIS_ASSETS.filter(a => {
        const section = AVIS_STUDIO_SECTIONS.find(s => s.title === activeSection);
        return section ? section.filter(a) : true;
      })
    : AVIS_ASSETS;

  return (
    <PortalShell background={DS.bg}>
      <main style={{ padding: '2rem', background: DS.bg }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: DS.blue, background: 'rgba(74,144,245,.1)', border: `1px solid ${DS.bb}`, borderRadius: 6, padding: '3px 10px', letterSpacing: '.12em' }}>AVIS™</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: DS.fm, textTransform: 'uppercase', letterSpacing: '.08em' }}>Aladiah Visual Intelligence System</span>
          </div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: DS.fg, marginBottom: '.3rem' }}>AVIS™ Studio</h1>
          <div style={{ fontSize: 13, color: DS.fm }}>
            {AVIS_ASSETS.length} visual assets · AI Enterprise Cybersecurity program
          </div>
        </div>

        {/* Section filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          <button
            onClick={() => setActiveSection(null)}
            style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${!activeSection ? DS.blue : DS.border}`, background: !activeSection ? 'rgba(74,144,245,.12)' : 'transparent', color: !activeSection ? DS.blue : DS.fm }}
          >
            All
          </button>
          {AVIS_STUDIO_SECTIONS.map(s => (
            <button
              key={s.title}
              onClick={() => setActiveSection(activeSection === s.title ? null : s.title)}
              style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${activeSection === s.title ? DS.blue : DS.border}`, background: activeSection === s.title ? 'rgba(74,144,245,.12)' : 'transparent', color: activeSection === s.title ? DS.blue : DS.fm }}
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Grid */}
        {activeSection ? (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: DS.fg, marginBottom: 16 }}>{activeSection}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {visibleAssets.map(asset => (
                <AssetCard key={asset.id} asset={asset} onSelect={setSelected} />
              ))}
            </div>
          </div>
        ) : (
          AVIS_STUDIO_SECTIONS.map(section => {
            const sectionAssets = AVIS_ASSETS.filter(section.filter);
            if (sectionAssets.length === 0) return null;
            return (
              <div key={section.title} style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DS.fg }}>{section.title}</div>
                  <button onClick={() => setActiveSection(section.title)} style={{ fontSize: 12, color: DS.blue, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>See all →</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                  {sectionAssets.slice(0, 4).map(asset => (
                    <AssetCard key={asset.id} asset={asset} onSelect={setSelected} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </main>

      {selected && <AssetModal asset={selected} onClose={() => setSelected(null)} />}
    </PortalShell>
  );
}
