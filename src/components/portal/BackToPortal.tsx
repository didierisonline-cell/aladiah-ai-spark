import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

const BackToPortal = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <Link
      to="/portal"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      {t('nav.portal')}
    </Link>
  );
};

export default BackToPortal;
