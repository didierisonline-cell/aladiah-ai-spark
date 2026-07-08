import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import WaitlistModal from '@/components/WaitlistModal';

const SEAL_SVG = `<svg width="460" height="460" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="248" fill="none" stroke="#C4A44A" stroke-width="3.5"/><circle cx="250" cy="250" r="243" fill="none" stroke="#C4A44A" stroke-width="1.2"/><circle cx="250" cy="250" r="230" fill="none" stroke="#C4A44A" stroke-width="2"/><circle cx="250" cy="250" r="160" fill="none" stroke="#C4A44A" stroke-width="1.5"/><text x="250" y="450" text-anchor="middle" dominant-baseline="central" fill="#C4A44A" font-family="Times New Roman, serif" font-weight="700" font-size="28" letter-spacing="5">2026</text><path d="M 188,160 L 188,280 Q 188,330 218,353 Q 234,365 250,373 Q 266,365 282,353 Q 312,330 312,280 L 312,160 Z" fill="none" stroke="#C4A44A" stroke-width="2.5"/><path d="M 190,162 L 190,197 Q 220,210 250,197 Q 280,210 310,197 L 310,162 Z" fill="#C4A44A" opacity="0.6"/></svg>`;

const PLAN_DEFS = [
  { id: 'foundation',  tier: 'TIER 1', color: '#3b82f6', price: 99,  featureCount: 6 },
  { id: 'accelerator', tier: 'TIER 2', color: '#f59e0b', price: 299, featureCount: 7, popular: true },
  { id: 'elite',       tier: 'TIER 3', color: '#8b5cf6', price: 499, featureCount: 7 },
] as const;

const enrollmentSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20),
  company: z.string().trim().max(100).optional(),
  jobTitle: z.string().trim().max(100).optional(),
  country: z.string().trim().min(1).max(100),
});

const countries = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium','Bolivia','Brazil',
  'Cambodia','Cameroon','Canada','Chile','China','Colombia','Costa Rica','Croatia','Cuba','Czech Republic',
  'Denmark','Dominican Republic','Ecuador','Egypt','Ethiopia','Finland','France','Germany','Ghana','Greece',
  'Guatemala','Haiti','Honduras','Hungary','India','Indonesia','Iran','Iraq','Ireland','Israel',
  'Italy','Jamaica','Japan','Jordan','Kenya','South Korea','Lebanon','Malaysia','Mexico','Morocco',
  'Netherlands','New Zealand','Nigeria','Norway','Pakistan','Panama','Peru','Philippines','Poland','Portugal',
  'Romania','Russia','Saudi Arabia','Senegal','Singapore','South Africa','Spain','Sri Lanka','Sweden','Switzerland',
  'Taiwan','Tanzania','Thailand','Trinidad and Tobago','Tunisia','Turkey','Uganda','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Uruguay','Venezuela','Vietnam','Zambia','Zimbabwe',
];

const Enroll = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const plans = PLAN_DEFS.map(p => ({
    ...p,
    name: t(`enroll.plan.${p.id}.name`),
    features: Array.from({ length: p.featureCount }, (_, i) => t(`enroll.plan.${p.id}.f${i + 1}`)),
  }));

  const [selectedPlanId, setSelectedPlanId] = useState<string>('accelerator');
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', company: '', jobTitle: '', country: '' });

  const selectedPlan = plans.find(p => p.id === selectedPlanId) ?? plans[1];

  const updateField = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = enrollmentSchema.safeParse(form);
    if (!result.success) {
      toast({ title: result.error.errors[0].message, variant: 'destructive' });
      return;
    }
    const PLAN_PRICE_IDS: Record<string, string> = {
      foundation:  import.meta.env.VITE_STRIPE_PRICE_FOUNDATION  || '',
      accelerator: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || 'price_1TW7U21wgazWak4Atj7TblB3',
      elite:       import.meta.env.VITE_STRIPE_PRICE_ELITE       || '',
    };
    const priceId = PLAN_PRICE_IDS[selectedPlan.id];
    if (!priceId) {
      toast({ title: 'Plan not available', description: 'Please contact support.', variant: 'destructive' });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({
          priceId,
          email: result.data.email,
          successUrl: `${window.location.origin}/auth?payment=success`,
          cancelUrl: window.location.href,
        }),
      });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({ title: t('enroll.toast.received'), description: t('enroll.toast.contact') });
      }
    } catch (err: any) {
      toast({ title: err.message || t('enroll.toast.received'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1535 40%, #0f1f3d 100%)' }}>

      {/* Seal watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.06 }}>
        <div style={{ width: 600, height: 600 }} dangerouslySetInnerHTML={{ __html: SEAL_SVG }} />
      </div>

      {/* Gold top border */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #C4A44A, #f0d060, #C4A44A, transparent)' }} />

      {/* Header */}
      <div className="relative z-10 py-6 px-4 border-b" style={{ borderColor: 'rgba(196,164,74,0.2)' }}>
        <div className="container mx-auto max-w-6xl">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-4 transition-colors" style={{ color: 'rgba(196,164,74,0.7)' }}>
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{t('enroll.back')}</span>
          </button>
          <div className="flex items-center gap-4">
            <div dangerouslySetInnerHTML={{ __html: SEAL_SVG }} style={{ width: 56, height: 56, opacity: 0.9 }} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#f0d060', fontFamily: 'Playfair Display, Times New Roman, serif' }}>
                Aladiah Academy
              </h1>
              <p style={{ color: 'rgba(196,164,74,0.7)', fontSize: 13 }}>{t('enroll.app_subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-10 max-w-6xl">

        {/* Plan selector */}
        <div className="mb-10">
          <h2 className="text-center text-white font-bold text-xl mb-2">{t('enroll.select_plan')}</h2>
          <p className="text-center mb-6" style={{ color: 'rgba(196,164,74,0.7)', fontSize: 13 }}>{t('enroll.save_annual')}</p>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <motion.div
                key={plan.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPlanId(plan.id)}
                className="relative rounded-2xl p-5 cursor-pointer transition-all duration-300"
                style={{
                  border: selectedPlan.id === plan.id ? `2px solid ${plan.color}` : '2px solid rgba(255,255,255,0.08)',
                  background: selectedPlan.id === plan.id ? `${plan.color}18` : 'rgba(255,255,255,0.03)',
                  boxShadow: selectedPlan.id === plan.id ? `0 0 24px ${plan.color}33` : 'none',
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ background: plan.color, color: '#fff' }}>
                    {t('enroll.popular')}
                  </div>
                )}
                <div className="text-xs font-bold mb-1" style={{ color: plan.color }}>{plan.tier}</div>
                <div className="text-white font-bold text-lg mb-2">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span style={{ color: plan.color, fontSize: 36, fontWeight: 800 }}>${plan.price}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{t('enroll.per_month')}</span>
                </div>
                <div className="space-y-1.5">
                  {plan.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: plan.color }} />
                      {f}
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <div className="text-xs" style={{ color: plan.color }}>+{plan.features.length - 4} {t('enroll.more_benefits')}</div>
                  )}
                </div>
                {selectedPlan.id === plan.id && (
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color: plan.color }}>
                    <CheckCircle className="w-3.5 h-3.5" /> {t('enroll.selected')}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(196,164,74,0.2)' }}>
              <h2 className="text-white font-bold text-xl mb-6">{t('enroll.your_info')}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">{t('enroll.label.fullname')} *</Label>
                    <Input value={form.fullName} onChange={e => updateField('fullName', e.target.value)} placeholder={t('enroll.ph.name')} required maxLength={100} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">{t('enroll.label.email')} *</Label>
                    <Input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} placeholder={t('enroll.ph.email')} required maxLength={255} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">{t('enroll.label.phone')} *</Label>
                    <Input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+1 (555) 123-4567" required maxLength={20} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">{t('enroll.label.country')} *</Label>
                    <Select value={form.country} onValueChange={v => updateField('country', v)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder={t('enroll.ph.country')} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">{t('enroll.label.company')} <span className="text-white/30 text-xs">{t('enroll.optional')}</span></Label>
                    <Input value={form.company} onChange={e => updateField('company', e.target.value)} placeholder={t('enroll.ph.company')} maxLength={100} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm">{t('enroll.label.jobtitle')} <span className="text-white/30 text-xs">{t('enroll.optional')}</span></Label>
                    <Input value={form.jobTitle} onChange={e => updateField('jobTitle', e.target.value)} placeholder={t('enroll.ph.role')} maxLength={100} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-bold text-base text-white transition-all duration-300 flex items-center justify-center gap-2"
                    style={{ background: loading ? 'rgba(196,164,74,0.3)' : 'linear-gradient(135deg, #C4A44A, #f0d060, #C4A44A)', color: '#0a0f1e', boxShadow: loading ? 'none' : '0 4px 24px rgba(196,164,74,0.4)' }}>
                    {loading ? t('enroll.processing') : <>{t('enroll.proceed')} — ${selectedPlan.price}/mo <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-5">
            {/* Selected plan summary */}
            <div className="rounded-2xl p-5" style={{ background: `${selectedPlan.color}12`, border: `1px solid ${selectedPlan.color}40` }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: 40, height: 40 }} dangerouslySetInnerHTML={{ __html: SEAL_SVG.replace('width="460" height="460"', 'width="40" height="40"') }} />
                <div>
                  <div className="text-white font-bold text-sm">{selectedPlan.name}</div>
                  <div className="text-xs" style={{ color: selectedPlan.color }}>{selectedPlan.tier}</div>
                </div>
              </div>
              <div className="flex justify-between items-center py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{t('enroll.monthly_total')}</span>
                <span className="font-bold text-2xl" style={{ color: selectedPlan.color }}>${selectedPlan.price}/mo</span>
              </div>
              <div className="text-xs mt-1" style={{ color: 'rgba(196,164,74,0.6)' }}>✓ {t('enroll.save_annual_plan')}</div>
            </div>

            {/* What's included */}
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h4 className="text-white font-semibold text-sm mb-3">{t('enroll.whats_included')}</h4>
              <div className="space-y-2">
                {selectedPlan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: selectedPlan.color }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="flex items-center gap-3 text-xs px-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <Shield className="w-4 h-4 flex-shrink-0" style={{ color: '#C4A44A' }} />
              {t('enroll.security')}
            </div>

            {/* Outcome disclaimer (WO-P0-001) */}
            <div className="text-xs px-2" style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
              Aladiah provides career-focused training and portfolio building. It does not guarantee employment, placement, or salary outcomes.
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gold bottom border */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #C4A44A, #f0d060, #C4A44A, transparent)', marginTop: 40 }} />

      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </div>
  );
};

export default Enroll;
