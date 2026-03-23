import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Star, Zap, Crown, Shield, Globe } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PLANS = [
  {
    id: "foundation",
    name: "Foundation Builder",
    tier: "TIER 1",
    price: 99,
    priceId: import.meta.env.VITE_STRIPE_PRICE_FOUNDATION || "price_1TEFgA0CtfIq2xPfWJdun1vH",
    icon: Shield,
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.3)",
    cta: "Get Started",
    popular: false,
    features: [
      "Full Scrum Master curriculum",
      "Full PM curriculum",
      "AI-powered personalized lessons",
      "Progress tracker + homework",
      "Community access",
      "Academy shop access",
      "Available in 7 languages",
    ],
    missing: ["AI Interview Coach", "Resume Builder", "1-on-1 mentorship"],
  },
  {
    id: "accelerator",
    name: "Career Accelerator",
    tier: "TIER 2",
    price: 299,
    priceId: import.meta.env.VITE_STRIPE_PRICE_ACCELERATOR || "price_1TEFgm0CtfIq2xPfkuYGY5sI",
    icon: Zap,
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.3)",
    cta: "Accelerate My Career",
    popular: true,
    features: [
      "Everything in Foundation",
      "AI Interview Coach (unlimited)",
      "AI Resume Builder",
      "Career Advisor (AI-guided)",
      "Real-world simulations",
      "Advanced strategies",
      "Priority community access",
      "Available in 7 languages",
    ],
    missing: ["Weekly 1-on-1 with Didier"],
  },
  {
    id: "elite",
    name: "Elite Mentorship",
    tier: "TIER 3",
    price: 499,
    priceId: import.meta.env.VITE_STRIPE_PRICE_ELITE || "price_1TEFhA0CtfIq2xPfZOXBhYlN",
    icon: Crown,
    color: "#10b981",
    glow: "rgba(16,185,129,0.3)",
    cta: "Apply for Elite",
    popular: false,
    features: [
      "Everything in Accelerator",
      "Weekly 1-on-1 with Didier (1hr)",
      "Personalized strategy session",
      "Direct feedback on your work",
      "Job search accountability",
      "VIP community status",
      "Early access to new features",
      "Certification prep support",
      "Placement support network",
    ],
    missing: [],
  },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getPrice = (base: number) =>
    annual ? Math.round(base * 12 * 0.8) : base;

  const handleSelect = async (plan: typeof PLANS[0]) => {
    setLoading(plan.id);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: plan.priceId,
          email,
          successUrl: `${window.location.origin}/auth?payment=success`,
          cancelUrl: `${window.location.origin}/pricing`,
        },
      });

      if (error || !data?.url) throw new Error(error?.message || "Checkout failed");
      window.location.href = data.url;
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", color: "#fff" }}>
      <Header />
      <div style={{ paddingTop: "120px", paddingBottom: "80px", maxWidth: "1200px", margin: "0 auto", padding: "120px 24px 80px" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: "60px" }}>
          <p style={{ color: "#f59e0b", fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "16px" }}>
            PRICING
          </p>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "16px" }}>
            Invest in Your Future.{" "}
            <span style={{ color: "#f59e0b" }}>Start at $99/month.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px", maxWidth: "560px", margin: "0 auto 32px" }}>
            Project Managers earn $80K–$150K+ globally. Your monthly subscription is the highest ROI investment you will ever make. Period.
          </p>

          {/* Annual toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.05)", padding: "8px 20px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <button
              onClick={() => setAnnual(false)}
              style={{ padding: "6px 16px", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "13px", background: !annual ? "#1d4ed8" : "transparent", color: !annual ? "#fff" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{ padding: "6px 16px", borderRadius: "100px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "13px", background: annual ? "#f59e0b" : "transparent", color: annual ? "#000" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}
            >
              Annual — Save 20%
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "start" }}>
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  position: "relative",
                  background: plan.popular ? "rgba(245,158,11,0.05)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${plan.popular ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "20px",
                  padding: "32px",
                  boxShadow: plan.popular ? `0 0 40px ${plan.glow}` : "none",
                }}
              >
                {plan.popular && (
                  <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#000", fontSize: "11px", fontWeight: 800, padding: "4px 16px", borderRadius: "100px", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                    MOST POPULAR
                  </div>
                )}

                {/* Tier + name */}
                <p style={{ color: plan.color, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
                  {plan.tier}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${plan.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon style={{ width: "18px", height: "18px", color: plan.color }} />
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, margin: 0 }}>{plan.name}</h3>
                </div>

                {/* Price */}
                <div style={{ marginBottom: "8px" }}>
                  <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", verticalAlign: "top", marginTop: "8px", display: "inline-block" }}>$</span>
                  <span style={{ fontSize: "56px", fontWeight: 800, lineHeight: 1, color: "#fff" }}>{getPrice(plan.price)}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginLeft: "4px" }}>/{annual ? "year" : "month"}</span>
                </div>
                {annual && (
                  <p style={{ color: "#10b981", fontSize: "12px", fontWeight: 600, marginBottom: "24px" }}>
                    ✓ Save ${Math.round(plan.price * 12 * 0.2)}/year with annual plan
                  </p>
                )}

                {/* CTA */}
                <button
                  onClick={() => handleSelect(plan)}
                  disabled={!!loading}
                  style={{
                    width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                    cursor: loading ? "wait" : "pointer", fontWeight: 700, fontSize: "15px",
                    background: plan.popular ? "#f59e0b" : `${plan.color}22`,
                    color: plan.popular ? "#000" : plan.color,
                    border: plan.popular ? "none" : `1px solid ${plan.color}44`,
                    marginBottom: "28px", transition: "all 0.2s",
                    opacity: loading === plan.id ? 0.7 : 1,
                  }}
                >
                  {loading === plan.id ? "Redirecting..." : plan.cta}
                </button>

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <CheckCircle style={{ width: "16px", height: "16px", color: plan.color, flexShrink: 0, marginTop: "2px" }} />
                      <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <div style={{ width: "16px", height: "1px", background: "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: "10px" }} />
                      <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.25)", textDecoration: "line-through" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "60px", flexWrap: "wrap" }}>
          {["🔒 Secure payment via Stripe", "📧 Cancel anytime", "🌍 Available in 7 languages", "✅ 7-day money back guarantee"].map((badge) => (
            <span key={badge} style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{badge}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
