import { useState, useRef } from 'react';
import type { AvisAsset } from '@/types/avis';
import { getAvisUrl } from '@/data/avisAssets';
import { useNavigate } from 'react-router-dom';

interface AvisHeroVisualProps {
  asset: AvisAsset;
  lessonTitle: string;
  moduleTitle: string;
  onExplainWithDidier?: () => void;
}

const DS = {
  bg: '#0B111E',
  card: '#111D30',
  border: '#1E2D47',
  fg: '#EDF2F7',
  fm: '#8596AD',
  blue: '#4A90F5',
  bb: 'rgba(74,144,245,.28)',
  orange: '#F0622A',
  green: '#22C98A',
};

export default function AvisHeroVisual({ asset, lessonTitle, moduleTitle, onExplainWithDidier }: AvisHeroVisualProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const svgUrl = getAvisUrl(asset.svgKey);

  if (!svgUrl) return null;

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = svgUrl;
    a.download = `avis-${asset.svgKey}.svg`;
    a.click();
  };

  const typeLabel: Record<string, string> = {
    hero_diagram: 'DIAGRAM',
    framework: 'FRAMEWORK',
    process_flow: 'PROCESS',
    knowledge_map: 'MAP',
    timeline: 'TIMELINE',
    decision_tree: 'DECISION TREE',
    architecture: 'ARCHITECTURE',
    attack_chain: 'ATTACK CHAIN',
    roadmap: 'ROADMAP',
  };

  return (
    <div style={{ marginBottom: 32 }}>
      {/* AVIS header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: DS.blue, background: 'rgba(74,144,245,.1)', border: `1px solid ${DS.bb}`, borderRadius: 6, padding: '3px 8px', letterSpacing: '.1em' }}>
            AVIS™
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: DS.fm, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {typeLabel[asset.type] ?? asset.type.toUpperCase()}
          </span>
        </div>
        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={onExplainWithDidier}
            title="Explain with Prof. Didier™"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'linear-gradient(135deg,rgba(240,98,42,.18),rgba(240,98,42,.08))', border: `1px solid ${DS.orange}44`, borderRadius: 8, color: DS.orange, fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            🎓 Explain with Prof. Didier™
          </button>
          <button
            onClick={handleDownload}
            title="Download SVG"
            style={{ padding: '5px 10px', background: 'rgba(255,255,255,.04)', border: `1px solid ${DS.border}`, borderRadius: 8, color: DS.fm, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          >
            ⬇ Download
          </button>
          <button
            onClick={() => navigate('/portal/avis')}
            title="Open in AVIS™ Studio"
            style={{ padding: '5px 10px', background: 'rgba(255,255,255,.04)', border: `1px solid ${DS.border}`, borderRadius: 8, color: DS.fm, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          >
            🖼 Studio
          </button>
          <button
            onClick={toggleFullscreen}
            title="Fullscreen"
            style={{ padding: '5px 10px', background: 'rgba(255,255,255,.04)', border: `1px solid ${DS.border}`, borderRadius: 8, color: DS.fm, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          >
            ⛶ Fullscreen
          </button>
        </div>
      </div>

      {/* Visual container */}
      <div
        ref={containerRef}
        style={{
          background: DS.card,
          border: `1px solid ${DS.border}`,
          borderRadius: 14,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: `0 0 0 1px ${DS.bb}, 0 12px 40px rgba(0,0,0,.45)`,
        }}
        onFullscreenChange={() => setIsFullscreen(!!document.fullscreenElement)}
      >
        <img
          src={svgUrl}
          alt={asset.title}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          loading="lazy"
        />
        {/* AVIS watermark */}
        <div style={{ position: 'absolute', bottom: 10, right: 14, fontSize: 9, color: 'rgba(133,150,173,.35)', fontWeight: 700, letterSpacing: '.1em' }}>
          AVIS™ · ALADIAH ACADEMY
        </div>
      </div>

      {/* Learning objective */}
      <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(74,144,245,.05)', border: `1px solid ${DS.bb}`, borderRadius: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: DS.blue, textTransform: 'uppercase', letterSpacing: '.06em' }}>Learning objective · </span>
        <span style={{ fontSize: 12, color: DS.fm }}>{asset.learningObjective}</span>
      </div>
    </div>
  );
}
