import { useState } from 'react';
import { RESOURCE_TRACKS } from '@/data/resourcesData';
import { useLanguage } from '@/contexts/LanguageContext';

const DS = {
  bg:'#0B111E', card:'#111D30', muted:'#18243A', border:'#1E2D47',
  fg:'#EDF2F7', fm:'#8596AD', fd:'#4A5E7A',
  blue:'#4A90F5', orange:'#F0622A', green:'#22C98A', gold:'#F5B81A',
};

const TYPE_COLORS: Record<string, string> = {
  'Official Docs': DS.blue, 'Course': DS.green, 'Cert': DS.gold,
  'Framework': DS.orange, 'Standard': '#A78BFA', 'Guide': DS.blue,
  'Practice Exam': DS.green, 'Tool': DS.orange, 'Reference': DS.fm,
  'Community': DS.green, 'YouTube': '#FF4444', 'Research': '#A78BFA',
  'Regulation': DS.gold, 'Toolkit': DS.green, 'Tutorial': DS.blue,
};

const SCHOOLS = [
  { label: '⚙️ AI Engineering', value: '⚙️ AI Engineering', color: DS.blue },
  { label: '💼 AI Business', value: '💼 AI Business', color: DS.orange },
  { label: '⚖️ Governance & Risk', value: '⚖️ Governance & Risk', color: DS.green },
  { label: '🎨 Human-AI Experience', value: '🎨 Human-AI Experience', color: '#9B59B6' },
];

function ProgramCard({ track, isSelected, onClick }: { track: any; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left', padding: '10px 14px',
        background: isSelected ? track.color + '22' : 'rgba(255,255,255,.03)',
        border: `1px solid ${isSelected ? track.color + '80' : DS.border}`,
        borderRadius: '.6rem', cursor: 'pointer', transition: 'all .15s',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.5rem',
      }}
      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = track.color + '50'; }}
      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = DS.border; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', minWidth: 0 }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>{track.icon}</span>
        <span style={{ fontSize: 12, fontWeight: isSelected ? 700 : 600, color: isSelected ? track.color : DS.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
          {track.programs[0]}
        </span>
      </div>
      <span style={{ fontSize: 10, color: DS.fm, flexShrink: 0, fontWeight: 600 }}>
        {track.resources.length}
      </span>
    </button>
  );
}

function ResourceDetail({ track }: { track: any }) {
  const { t } = useLanguage();
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');

  const filteredGlossary = track.glossary.filter((item: any) =>
    glossarySearch === '' ||
    item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    item.def.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
      {/* Program header */}
      <div style={{
        background: track.color + '18', border: `1px solid ${track.color + '40'}`,
        borderRadius: '.75rem', padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.5rem' }}>
          <span style={{ fontSize: 28 }}>{track.icon}</span>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: DS.fg }}>{track.programs[0]}</div>
            <div style={{ fontSize: 11, color: track.color, fontWeight: 600, marginTop: 2 }}>{track.school}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '.75rem', marginTop: '.5rem' }}>
          <span style={{ fontSize: 11, color: DS.fm }}>
            <span style={{ color: track.color, fontWeight: 700 }}>{track.resources.length}</span> {t('res.resources')}
          </span>
          <span style={{ fontSize: 11, color: DS.fm }}>
            <span style={{ color: track.color, fontWeight: 700 }}>{track.glossary.length}</span> {t('res.glossary_terms')}
          </span>
          <span style={{ fontSize: 11, color: DS.fm }}>
            <span style={{ color: DS.green, fontWeight: 700 }}>{track.resources.filter((r: any) => r.free).length}</span> {t('res.free')}
          </span>
        </div>
      </div>

      {/* Resources list */}
      <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: `1px solid ${DS.border}`, background: 'rgba(255,255,255,.03)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: DS.fm, textTransform: 'uppercase' as const, letterSpacing: '.08em' }}>{t('res.resources_label')}</span>
        </div>
        <div style={{ padding: '.75rem', display: 'flex', flexDirection: 'column' as const, gap: '.4rem' }}>
          {track.resources.map((res: any, i: number) => (
            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 12px', background: 'rgba(255,255,255,.03)',
                border: `1px solid ${DS.border}`, borderRadius: '.5rem',
                textDecoration: 'none', transition: 'all .15s', gap: '.75rem',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.07)'; (e.currentTarget as HTMLElement).style.borderColor = track.color + '60'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.03)'; (e.currentTarget as HTMLElement).style.borderColor = DS.border; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: 11, color: track.color, flexShrink: 0 }}>↗</span>
                <span style={{ fontSize: 12, color: DS.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{res.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', flexShrink: 0 }}>
                {res.free && (
                  <span style={{ fontSize: 9, fontWeight: 700, color: DS.green, background: 'rgba(34,201,138,.12)', border: '1px solid rgba(34,201,138,.28)', borderRadius: 999, padding: '1px 6px' }}>{t('res.free_badge')}</span>
                )}
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, whiteSpace: 'nowrap' as const,
                  color: TYPE_COLORS[res.type] || DS.fm,
                  background: (TYPE_COLORS[res.type] || DS.fm) + '22',
                }}>{res.type}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Glossary */}
      <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', overflow: 'hidden' }}>
        <button
          onClick={() => setGlossaryOpen(!glossaryOpen)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', background: glossaryOpen ? track.color + '18' : 'transparent',
            border: 'none', cursor: 'pointer', transition: 'all .2s',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <span style={{ fontSize: 14 }}>📖</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: track.color, letterSpacing: '.05em' }}>{t('res.glossary_label')}</span>
            <span style={{ fontSize: 11, color: DS.fm }}>— {track.glossary.length} {t('res.key_terms')}</span>
          </div>
          <span style={{ fontSize: 11, color: track.color }}>{glossaryOpen ? t('res.hide') : t('res.show_terms')}</span>
        </button>

        {glossaryOpen && (
          <div style={{ padding: '.75rem', borderTop: `1px solid ${DS.border}` }}>
            <input
              value={glossarySearch}
              onChange={e => setGlossarySearch(e.target.value)}
              placeholder={`${t('res.glossary_search_pre')}${track.glossary.length}${t('res.glossary_search_post')}`}
              style={{
                width: '100%', background: DS.muted, border: `1px solid ${DS.border}`,
                borderRadius: '.5rem', padding: '7px 10px', color: DS.fg,
                fontFamily: 'inherit', fontSize: 12, outline: 'none', marginBottom: '.6rem',
                boxSizing: 'border-box' as const,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '.4rem', maxHeight: 320, overflowY: 'auto' as const }}>
              {filteredGlossary.length === 0 ? (
                <div style={{ fontSize: 12, color: DS.fm, textAlign: 'center' as const, padding: '1rem' }}>{t('res.no_terms_pre')}{glossarySearch}{t('res.no_terms_post')}</div>
              ) : filteredGlossary.map((term: any) => (
                <div key={term.term} style={{ padding: '8px 12px', background: 'rgba(255,255,255,.03)', borderRadius: '.45rem', borderLeft: `3px solid ${track.color}70` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: track.color, marginBottom: 3 }}>{term.term}</div>
                  <div style={{ fontSize: 11, color: DS.fm, lineHeight: 1.6 }}>{term.def}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props { tier?: string; onUpgrade?: () => void; }

const ResourcesLibrary = ({ tier = 'active' }: Props) => {
  const { t } = useLanguage();
  const [selectedSchool, setSelectedSchool] = useState('⚙️ AI Engineering');
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const schoolTracks = RESOURCE_TRACKS.filter(track => track.school === selectedSchool);

  const filteredTracks = search === ''
    ? schoolTracks
    : RESOURCE_TRACKS.filter(track =>
        track.programs[0].toLowerCase().includes(search.toLowerCase()) ||
        track.resources.some(r => r.label.toLowerCase().includes(search.toLowerCase())) ||
        track.glossary.some(g => g.term.toLowerCase().includes(search.toLowerCase()))
      );

  const displayTracks = search !== '' ? filteredTracks : schoolTracks;

  const selectedTrack = selectedTrackId
    ? RESOURCE_TRACKS.find(track => track.id === selectedTrackId)
    : (displayTracks.length > 0 ? displayTracks[0] : null);

  const handleSchoolChange = (school: string) => {
    setSelectedSchool(school);
    setSearch('');
    const firstInSchool = RESOURCE_TRACKS.find(track => track.school === school);
    setSelectedTrackId(firstInSchool ? firstInSchool.id : null);
  };

  const totalResources = RESOURCE_TRACKS.reduce((s, track) => s + track.resources.length, 0);
  const totalTerms = RESOURCE_TRACKS.reduce((s, track) => s + track.glossary.length, 0);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: DS.fg, margin: '0 0 .25rem 0' }}>
          {t('res.title')}
        </h2>
        <div style={{ fontSize: 12, color: DS.fm }}>
          {totalResources} {t('res.curated')} · {totalTerms} {t('res.glossary_terms')} · {t('res.organized')}
        </div>
      </div>

      {/* Search bar */}
      <input
        value={search}
        onChange={e => { setSearch(e.target.value); setSelectedTrackId(null); }}
        placeholder={t('res.search')}
        style={{
          width: '100%', background: DS.muted, border: `1px solid ${DS.border}`,
          borderRadius: '.65rem', padding: '.65rem 1rem', color: DS.fg,
          fontFamily: 'inherit', fontSize: 13, outline: 'none', marginBottom: '1rem',
          boxSizing: 'border-box' as const,
        }}
        onFocus={e => (e.target as HTMLElement).style.borderColor = DS.blue}
        onBlur={e => (e.target as HTMLElement).style.borderColor = DS.border}
      />

      {/* School tabs */}
      {search === '' && (
        <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' as const, marginBottom: '1.25rem' }}>
          {SCHOOLS.map(s => (
            <button
              key={s.value}
              onClick={() => handleSchoolChange(s.value)}
              style={{
                fontSize: 12, fontWeight: 700, padding: '.4rem 1rem', borderRadius: 999,
                cursor: 'pointer', transition: 'all .15s',
                background: selectedSchool === s.value ? s.color : DS.muted,
                color: selectedSchool === s.value ? '#fff' : DS.fm,
                border: `1px solid ${selectedSchool === s.value ? s.color : DS.border}`,
              }}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Search results notice */}
      {search !== '' && (
        <div style={{ fontSize: 12, color: DS.fm, marginBottom: '.75rem' }}>
          {filteredTracks.length} {t('res.matching')} "{search}"
          <button onClick={() => setSearch('')} style={{ marginLeft: '.5rem', fontSize: 11, color: DS.blue, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>{t('res.clear')}</button>
        </div>
      )}

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1rem', alignItems: 'start' }}>

        {/* Left: Program list */}
        <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${DS.border}`, background: 'rgba(255,255,255,.03)' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: DS.fm, textTransform: 'uppercase' as const, letterSpacing: '.1em' }}>
              {search !== '' ? t('res.search_results') : `${displayTracks.length} ${t('res.programs_label')}`}
            </span>
          </div>
          <div style={{ padding: '.5rem', display: 'flex', flexDirection: 'column' as const, gap: '.3rem', maxHeight: 600, overflowY: 'auto' as const }}>
            {displayTracks.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center' as const, color: DS.fm, fontSize: 12 }}>{t('res.no_programs')}</div>
            ) : displayTracks.map(track => (
              <ProgramCard
                key={track.id}
                track={track}
                isSelected={(selectedTrack?.id === track.id)}
                onClick={() => setSelectedTrackId(track.id)}
              />
            ))}
          </div>
        </div>

        {/* Right: Resource detail */}
        <div>
          {selectedTrack ? (
            <ResourceDetail track={selectedTrack} />
          ) : (
            <div style={{ background: DS.card, border: `1px solid ${DS.border}`, borderRadius: '.75rem', padding: '3rem', textAlign: 'center' as const, color: DS.fm }}>
              <div style={{ fontSize: 32, marginBottom: '.75rem' }}>📚</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t('res.select_program')}</div>
            </div>
          )}
        </div>
      </div>

      <p style={{ fontSize: 10, color: DS.fd, textAlign: 'center' as const, marginTop: '1.5rem', lineHeight: 1.6 }}>
        {t('res.footer')}
      </p>
    </div>
  );
};

export default ResourcesLibrary;
