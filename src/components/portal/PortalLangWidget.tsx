import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const LANGS = [
  { code: 'en', flag: '🇺🇸', label: 'English',    short: 'EN' },
  { code: 'fr', flag: '🇫🇷', label: 'Français',   short: 'FR' },
  { code: 'es', flag: '🇪🇸', label: 'Español',    short: 'ES' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch',    short: 'DE' },
  { code: 'zh', flag: '🇨🇳', label: '中文',        short: 'ZH' },
  { code: 'ar', flag: '🇸🇦', label: 'العربية',    short: 'AR' },
  { code: 'ja', flag: '🇯🇵', label: '日本語',      short: 'JA' },
  { code: 'pt', flag: '🇧🇷', label: 'Português',  short: 'PT' },
  { code: 'hi', flag: '🇮🇳', label: 'हिन्दी',      short: 'HI' },
  { code: 'ko', flag: '🇰🇷', label: '한국어',      short: 'KO' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano',   short: 'IT' },
  { code: 'ru', flag: '🇷🇺', label: 'Русский',    short: 'RU' },
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands', short: 'NL' },
  { code: 'pl', flag: '🇵🇱', label: 'Polski',     short: 'PL' },
  { code: 'tr', flag: '🇹🇷', label: 'Türkçe',    short: 'TR' },
  { code: 'sw', flag: '🇰🇪', label: 'Kiswahili',  short: 'SW' },
  { code: 'yo', flag: '🇳🇬', label: 'Yorùbá',     short: 'YO' },
  { code: 'ha', flag: '🇳🇬', label: 'Hausa',      short: 'HA' },
  { code: 'ig', flag: '🇳🇬', label: 'Igbo',       short: 'IG' },
  { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt', short: 'VI' },
  { code: 'th', flag: '🇹🇭', label: 'ภาษาไทย',   short: 'TH' },
];

export default function PortalLangWidget() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = LANGS.find(l => l.code === language) || LANGS[0];

  return (
    <div style={{ position: 'relative', zIndex: 100 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '6px 10px',
          cursor: 'pointer', color: '#94a3b8',
          fontSize: 13, fontWeight: 600,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
      >
        <span style={{ fontSize: 16 }}>{current.flag}</span>
        <span>{current.short}</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 98 }}
          />
          {/* Dropdown */}
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: '#0f172a',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            minWidth: 160, zIndex: 99,
          }}>
            {LANGS.map(lang => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code as any); setOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 14px', border: 'none', cursor: 'pointer',
                  background: lang.code === language ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: lang.code === language ? '#60a5fa' : '#94a3b8',
                  fontSize: 13, fontWeight: lang.code === language ? 600 : 400,
                  textAlign: 'left', transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (lang.code !== language) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (lang.code !== language) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 18 }}>{lang.flag}</span>
                <span>{lang.label}</span>
                {lang.code === language && <span style={{ marginLeft: 'auto', fontSize: 11 }}>✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
