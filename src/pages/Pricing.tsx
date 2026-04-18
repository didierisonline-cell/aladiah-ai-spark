import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { CheckCircle, Zap } from "lucide-react";

const PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || "price_1TMsDL0Ctflq2xPfzJsrXzy1";

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const monthlyPrice = 99.99;
  const annualPrice = Math.round(monthlyPrice * 12 * 0.8);

  const FEATURES = [
    t('auth.plan.f1'),
    t('pricing.t2.f4') || 'Full PM curriculum',
    t('pricing.t1.f3'),
    t('auth.plan.f3'),
    t('auth.plan.f4'),
    t('auth.plan.f5'),
    t('auth.plan.f6'),
    t('auth.plan.f7'),
    t('pricing.t2.f5') || 'Real-world simulations & labs',
    t('pricing.t1.f5'),
    t('pricing.t1.f6') || 'Academy shop access',
    t('auth.plan.f8'),
    t('pricing.t3.f7') || 'Certification prep (PMP, CSM, SAFe, ITIL)',
    t('pricing.t3.f5') || 'Early access to new features',
  ];

  const handleSelect = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: PRICE_ID,
          email,
          successUrl: `${window.location.origin}/auth?payment=success`,
          cancelUrl: `${window.location.origin}/pricing`,
        },
      });
      if (error || !data?.url) throw new Error(error?.message || "Checkout failed");
      window.location.href = data.url;
    } catch (err: any) {
      toast({ title: t('auth.error'), description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#fff" }}>
      <Header />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "120px 24px 80px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "60px" }}>
          <p style={{ color: "#f59e0b", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>
            {t('pricing.label')}
          </p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "16px" }}>
            {t('pricing.title')}{" "}
            <span style={{ color: "#f59e0b" }}>{t('pricing.subtitle')}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", maxWidth: "560px", margin: "0 auto 32px" }}>
            {t('pricing.desc')}
          </p>

          {/* Annual toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.05)", padding: "8px 20px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <button onClick={() => setAnnual(false)} style={{ padding: "6px 16px", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "13px", background: !annual ? "#1d4ed8" : "transparent", color: !annual ? "#fff" : "rgba(255,255,255,0.5)" }}>
              {t('pricing.monthly')}
            </button>
            <button onClick={() => setAnnual(true)} style={{ padding: "6px 16px", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "13px", background: annual ? "#f59e0b" : "transparent", color: annual ? "#000" : "rgba(255,255,255,0.5)" }}>
              {t('pricing.annual')}
            </button>
          </div>
        </motion.div>

        {/* Single Plan Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ position: "relative", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: "24px", padding: "48px", boxShadow: "0 0 60px rgba(245,158,11,0.15)" }}>

          <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#000", fontSize: "11px", fontWeight: 800, padding: "4px 20px", borderRadius: "100px", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
            {t('auth.plan.badge')}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap style={{ width: "22px", height: "22px", color: "#f59e0b" }} />
            </div>
            <div>
              <p style={{ color: "#f59e0b", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>ALADIAH ACADEMY</p>
              <h3 style={{ fontSize: "24px", fontWeight: 800, margin: 0 }}>{t('auth.plan.name')}</h3>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: annual ? "8px" : "32px" }}>
            <div>
              <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", verticalAlign: "top", marginTop: "8px", display: "inline-block" }}>$</span>
              <span style={{ fontSize: "72px", fontWeight: 800, lineHeight: 1, color: "#fff" }}>{annual ? annualPrice : "99.99"}</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", marginBottom: "12px" }}>/{annual ? t('pricing.year') : t('pricing.month')}</span>
          </div>
          {annual && (
            <p style={{ color: "#10b981", fontSize: "13px", fontWeight: 600, marginBottom: "32px" }}>
              ✓ {t('pricing.save')} ${Math.round(monthlyPrice * 12 * 0.2)}/{t('pricing.year')}
            </p>
          )}

          <button onClick={handleSelect} disabled={loading}
            style={{ width: "100%", padding: "18px", borderRadius: "14px", cursor: loading ? "wait" : "pointer", fontWeight: 800, fontSize: "17px", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#000", border: "none", marginBottom: "40px", opacity: loading ? 0.7 : 1, letterSpacing: "0.02em", boxShadow: "0 8px 32px rgba(245,158,11,0.3)" }}>
            {loading ? t('pricing.redirecting') : `${t('auth.plan.name')} — $99.99/${t('pricing.month')}`}
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
            {FEATURES.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <CheckCircle style={{ width: "16px", height: "16px", color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "48px", flexWrap: "wrap" }}>
          {[t('pricing.badge1'), t('pricing.badge2'), t('pricing.badge3'), t('pricing.badge4')].map((badge) => (
            <span key={badge} style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{badge}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
