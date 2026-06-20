
import { useLanguage } from '@/contexts/LanguageContext';

const PortalPortfolioPanel = () => {
  const { t } = useLanguage();
  return (
  <div>
    <div style={{background:'rgba(245,184,26,0.06)',border:'1px solid rgba(245,184,26,0.28)',borderRadius:'0.75rem',padding:'1rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
      <span style={{fontSize:'20px'}}>🏆</span>
      <div><strong style={{color:'#F5B81A',fontSize:'13px'}}>{t('portpanel.capstone_title')}</strong><br/><span style={{fontSize:'12px',color:'var(--muted-foreground)'}}>{t('portpanel.capstone_sub')}</span></div>
    </div>
    {/* Honest empty state — student portfolios have no data layer yet, so we show
        no projects rather than fabricated/hardcoded demo work (claim integrity). */}
    <div style={{background:'var(--card)',border:'1px dashed var(--border)',borderRadius:'0.75rem',padding:'2.5rem 2rem',textAlign:'center',marginBottom:'1.25rem'}}>
      <div style={{fontSize:'26px',marginBottom:'0.6rem'}}>📁</div>
      <div style={{fontSize:'14px',fontWeight:700,color:'var(--foreground)',marginBottom:'0.35rem'}}>Your portfolio is empty</div>
      <div style={{fontSize:'12.5px',color:'var(--muted-foreground)',maxWidth:'440px',margin:'0 auto',lineHeight:1.6}}>Completed projects and capstone work will appear here as you finish them.</div>
    </div>
    <div style={{background:'var(--card)',border:'1px dashed var(--border)',borderRadius:'0.75rem',padding:'2rem',textAlign:'center'}}>
      <div style={{fontSize:'22px',marginBottom:'0.5rem'}}>➕</div>
      <div style={{fontSize:'13px',fontWeight:700,color:'var(--foreground)',marginBottom:'0.25rem'}}>{t('portpanel.add_title')}</div>
      <div style={{fontSize:'12px',color:'var(--muted-foreground)',marginBottom:'0.85rem'}}>{t('portpanel.add_sub')}</div>
      <button style={{padding:'0.6rem 1.4rem',borderRadius:'0.45rem',fontSize:'12px',fontWeight:700,color:'#fff',background:'#4A90F5',border:'none',cursor:'pointer'}}>{t('portpanel.add_btn')}</button>
    </div>
  </div>
  );
};
export default PortalPortfolioPanel;
