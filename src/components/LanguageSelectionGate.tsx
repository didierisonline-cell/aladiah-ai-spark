import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface Props {
  userId: string;
  onSelected: (lang: string) => void;
}

const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', name: 'English', sub: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français', sub: 'French' },
  { code: 'es', flag: '🇪🇸', name: 'Español', sub: 'Spanish' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch', sub: 'German' },
  { code: 'zh', flag: '🇨🇳', name: '中文', sub: 'Mandarin' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية', sub: 'Arabic' },
  { code: 'ja', flag: '🇯🇵', name: '日本語', sub: 'Japanese' },
];

export const LanguageSelectionGate = ({ userId, onSelected }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    await supabase
      .from('profiles')
      .update({ preferred_language: selected })
      .eq('user_id', userId);
    onSelected(selected);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a0f1e 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Choose Your Language
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
            All your courses, emails and communications will be in this language.
            You can change it anytime in your profile.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {LANGUAGES.map(lang => (
            <div
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              style={{
                border: selected === lang.code ? '2px solid rgba(99,102,241,0.9)' : '2px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '16px',
                cursor: 'pointer',
                background: selected === lang.code ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '28px' }}>{lang.flag}</span>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>{lang.name}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{lang.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleConfirm}
          disabled={!selected || loading}
          className="w-full"
          style={{ height: '48px', fontSize: '15px', fontWeight: 700 }}
        >
          {loading ? 'Saving...' : 'Continue →'}
        </Button>

        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '12px' }}>
          Solo Excelencia · Aladiah Academy
        </p>
      </motion.div>
    </div>
  );
};

export default LanguageSelectionGate;
