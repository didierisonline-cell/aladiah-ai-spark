import { useState } from 'react';
import { Copy, Check, Link, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReferralCode } from '@/hooks/useReferralCode';
import { useNavigate } from 'react-router-dom';

interface Props {
  programType: 'student' | 'affiliate';
  variant?: 'primary' | 'secondary';
}

const ReferralLinkCard = ({ programType, variant = 'primary' }: Props) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { referralLink, code, loading, referralCount, user } = useReferralCode(programType);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="bg-muted/50 rounded-xl p-5 border border-border text-center space-y-3">
        <Link className="w-5 h-5 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t('referral.link.loginRequired')}</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
          <LogIn className="w-4 h-4 mr-2" />
          {t('referral.link.login')}
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-muted/50 rounded-xl p-5 border border-border animate-pulse">
        <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        <div className="h-10 bg-muted rounded mt-3" />
      </div>
    );
  }

  const accentClass = variant === 'primary' ? 'text-primary' : 'text-secondary';

  return (
    <div className="bg-muted/30 rounded-xl p-5 border border-border space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold flex items-center gap-2">
          <Link className={`w-4 h-4 ${accentClass}`} />
          {t('referral.link.title')}
        </p>
        <span className="text-xs text-muted-foreground">
          {referralCount}/5 {t('referral.link.referrals')}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={referralLink || ''}
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground truncate"
        />
        <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{t('referral.link.share')}</p>
    </div>
  );
};

export default ReferralLinkCard;
