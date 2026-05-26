import { useState } from 'react';
import { RESOURCE_TRACKS, ResourceTrack } from '@/data/resourcesData';

const DS = {
  bg:'#0B111E', card:'#111D30', muted:'#18243A', border:'#1E2D47',
  fg:'#EDF2F7', fm:'#8596AD', fd:'#4A5E7A',
  blue:'#4A90F5', bd:'rgba(74,144,245,.14)', bb:'rgba(74,144,245,.28)',
  orange:'#F0622A',
  gold:'#F5B81A', gd:'rgba(245,184,26,.12)', gb:'rgba(245,184,26,.28)',
  green:'#22C98A', grd:'rgba(34,201,138,.12)',
};

const SCHOOL_FILTERS = [
  { label: 'All Schools', value: '' },
  { label: '⚙️ AI Engineering', value: '⚙️ AI Engineering' },
  { label: '💼 AI Business', value: '💼 AI Business' },
  { label: '⚖️ Governance & Risk', value: '⚖️ Governance & Risk' },
  { label: '🎨 Human-AI Experience', value: '🎨 Human-AI Experience' },
  { label: '🏛️ Foundation Library', value: '🏛️ Foundation Library' },
];

const TYPE_COLORS: Record<string, string> = {
  'Official Docs': DS.blue,
  'Course': DS.green,
  'Cert': DS.gold,
  'Framework': DS.orange,
  'Standard': '#A78BFA',
  'Guide': DS.blue,
  'Practice Exam': DS.green,
  'Tool': DS.orange,
  'Reference': DS.fm,
  'Community': DS.green,
  'YouTube': '#FF4444',
  'Research': '#A78BFA',
  'Regulation': DS.gold,
  'Toolkit': DS.green,
  'Tutorial': DS.blue,
};

const TrackCard = ({ track }: { track: ResourceTrack }) => {
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');

  const filteredGlossary = track.glossary.filter(t =>
    glossarySearch === '' ||
    t.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    t.def.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', overflow: 'hidden', transition: 'border-color .2s' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = track.color + '60'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = DS.border}>

      {/* Header */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${DS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: track.color + '10' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <div style={{ width: 4, height: 20, background: track.color, borderRadius: 2 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: DS.fg }}>{track.icon} {track.id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</div>
            <div style={{ fontSize: 10, color: track.color, fontWeight: 600, marginTop: 1 }}>{track.school}</div>
          </div>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, color: DS.fm, background: DS.muted, border: `1px solid ${DS.border}`, borderRadius: 999, padding: '2px 8px' }}>
          {track.resources.length} resources · {track.glossary.length} terms
        </div>
      </div>

      {/* Programs covered */}
      <div style={{ padding: '.6rem 1.25rem', borderBottom: `1px solid ${DS.border}`, display: 'flex', flexWrap: 'wrap' as const, gap: '.3rem' }}>
        {track.programs.map(p => (
          <span key={p} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: track.color + '18', color: track.color, border: `1px solid ${track.color}40` }}>{p}</span>
        ))}
      </div>

      {/* Resources */}
      <div style={{ padding: '.75rem 1.25rem', display: 'flex', flexDirection: 'column' as const, gap: '.35rem' }}>
        {track.resources.map((res, i) => (
          <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255,255,255,.03)', border: `1px solid ${DS.border}`, borderRadius: '.45rem', textDecoration: 'none', transition: 'all .15s', gap: '.5rem' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.07)'; (e.currentTarget as HTMLElement).style.borderColor = track.color + '50'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.03)'; (e.currentTarget as HTMLElement).style.borderColor = DS.border; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', minWidth: 0 }}>
              <span style={{ fontSize: 11, color: DS.fm, flexShrink: 0 }}>↗</span>
              <span style={{ fontSize: 12, color: DS.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{res.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', flexShrink: 0 }}>
              {res.free && <span style={{ fontSize: 9, fontWeight: 700, color: DS.green, background: DS.grd, border: '1px solid rgba(34,201,138,.28)', borderRadius: 999, padding: '1px 6px' }}>FREE</span>}
              <span style={{ fontSize: 10, fontWeight: 700, color: TYPE_COLORS[res.type] || DS.fm, background: (TYPE_COLORS[res.type] || DS.fm) + '20', padding: '2px 7px', borderRadius: 4, whiteSpace: 'nowrap' as const }}>{res.type}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Glossary toggle */}
      <div style={{ padding: '0 1.25rem 1rem' }}>
        <button onClick={() => setGlossaryOpen(!glossaryOpen)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: glossaryOpen ? track.color + '20' : 'rgba(255,255,255,.03)', border: `1px solid ${track.color}40`, borderRadius: '.5rem', cursor: 'pointer', transition: 'all .2s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontSize: 13 }}>📖</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: track.color, letterSpacing: '.5px' }}>GLOSSARY</span>
            <span style={{ fontSize: 10, color: DS.fm }}>— {track.glossary.length} key terms</span>
          </div>
          <span style={{ fontSize: 12, color: track.color }}>{glossaryOpen ? '▲ Hide' : '▼ Show'}</span>
        </button>

        {glossaryOpen && (
          <div style={{ marginTop: '.5rem' }}>
            {/* Glossary search */}
            <input
              value={glossarySearch}
              onChange={e => setGlossarySearch(e.target.value)}
              placeholder={`Search ${track.glossary.length} terms...`}
              style={{ width: '100%', background: DS.muted, border: `1px solid ${DS.border}`, borderRadius: '.5rem', padding: '7px 10px', color: DS.fg, fontFamily: 'inherit', fontSize: 12, outline: 'none', marginBottom: '.5rem', boxSizing: 'border-box' as const }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '.35rem', maxHeight: 360, overflowY: 'auto' as const, paddingRight: 4 }}>
              {filteredGlossary.length === 0 ? (
                <div style={{ fontSize: 12, color: DS.fm, textAlign: 'center' as const, padding: '1rem' }}>No terms matching "{glossarySearch}"</div>
              ) : filteredGlossary.map(term => (
                <div key={term.term} style={{ padding: '8px 10px', background: 'rgba(255,255,255,.03)', borderRadius: '.45rem', borderLeft: `3px solid ${track.color}60` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: track.color, marginBottom: 2 }}>{term.term}</div>
                  <div style={{ fontSize: 11, color: DS.fm, lineHeight: 1.55 }}>{term.def}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface Props { tier?: string; onUpgrade?: () => void; }

const ResourcesLibrary = ({ tier = 'active', onUpgrade }: Props) => {
  const [schoolFilter, setSchoolFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = RESOURCE_TRACKS.filter(t => {
    const matchSchool = schoolFilter === '' || t.school === schoolFilter;
    const matchSearch = search === '' ||
      t.programs.some(p => p.toLowerCase().includes(search.toLowerCase())) ||
      t.resources.some(r => r.label.toLowerCase().includes(search.toLowerCase())) ||
      t.glossary.some(g => g.term.toLowerCase().includes(search.toLowerCase()));
    return matchSchool && matchSearch;
  });

  const totalResources = RESOURCE_TRACKS.reduce((s, t) => s + t.resources.length, 0);
  const totalTerms = RESOURCE_TRACKS.reduce((s, t) => s + t.glossary.length, 0);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '1rem', marginBottom: '.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: DS.fg, margin: 0 }}>📚 Resources Library</h2>
            <div style={{ fontSize: 12, color: DS.fm, marginTop: 3 }}>
              {totalResources} curated resources · {totalTerms} glossary terms · {RESOURCE_TRACKS.length} tracks · Official sources only
            </div>
          </div>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search programs, resources, or glossary terms..."
          style={{ width: '100%', background: DS.muted, border: `1px solid ${DS.border}`, borderRadius: '.65rem', padding: '.65rem 1rem', color: DS.fg, fontFamily: 'inherit', fontSize: 13, outline: 'none', marginBottom: '.75rem', boxSizing: 'border-box' as const }}
          onFocus={e => (e.target as HTMLElement).style.borderColor = DS.blue}
          onBlur={e => (e.target as HTMLElement).style.borderColor = DS.border}
        />

        {/* School filter tabs */}
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' as const }}>
          {SCHOOL_FILTERS.map(f => (
            <button key={f.value} onClick={() => setSchoolFilter(f.value)}
              style={{ fontSize: 11, fontWeight: 700, padding: '.3rem .85rem', borderRadius: 999, cursor: 'pointer', transition: 'all .15s',
                background: schoolFilter === f.value ? DS.blue : DS.muted,
                color: schoolFilter === f.value ? '#fff' : DS.fm,
                border: `1px solid ${schoolFilter === f.value ? DS.blue : DS.border}`,
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(search || schoolFilter) && (
        <div style={{ fontSize: 12, color: DS.fm, marginBottom: '1rem' }}>
          Showing {filtered.length} of {RESOURCE_TRACKS.length} tracks
          {search && ` matching "${search}"`}
        </div>
      )}

      {/* Track cards grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center' as const, padding: '3rem', color: DS.fm }}>
          <div style={{ fontSize: 32, marginBottom: '.75rem' }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>No tracks found</div>
          <div style={{ fontSize: 12, marginTop: '.35rem' }}>Try a different search term or filter</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(track => <TrackCard key={track.id} track={track} />)}
        </div>
      )}

      <p style={{ fontSize: 10, color: DS.fd, textAlign: 'center' as const, marginTop: '1.5rem', lineHeight: 1.6 }}>
        © AWS, Google, Microsoft, NIST, ISO, EU, IIBA, PMI, Scrum.org, SAFe, ACM. All resources link to official sources. Educational reference only.
      </p>
    </div>
  );
};

export default ResourcesLibrary;
