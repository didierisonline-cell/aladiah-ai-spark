import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  children: React.ReactNode;
  requireSubscription?: boolean;
};

export default function ProtectedRoute({ children, requireSubscription = true }: Props) {
  const [status, setStatus] = useState<"loading" | "authed" | "no-auth" | "no-sub">("loading");
  const [message, setMessage] = useState("Loading...");
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const checkSubscription = async (userId: string) => {
      const { data } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();
      return !!data;
    };

    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!user) return setStatus("no-auth");
      if (!requireSubscription) return setStatus("authed");

      if (await checkSubscription(user.id)) {
        if (!cancelled) setStatus("authed");
        return;
      }

      const justPaid = new URLSearchParams(location.search).get("payment") === "success"
        || document.referrer.includes("checkout.stripe.com");

      if (justPaid) {
        for (let attempt = 1; attempt <= 15; attempt++) {
          if (cancelled) return;
          setMessage(`Activating your subscription... (${attempt}s)`);
          await new Promise(r => setTimeout(r, 1000));
          if (await checkSubscription(user.id)) {
            if (!cancelled) setStatus("authed");
            return;
          }
        }
      }

      if (!cancelled) setStatus("no-sub");
    };

    run();
    return () => { cancelled = true; };
  }, [requireSubscription, location.search]);

  if (status === "loading") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0a0f1a", flexDirection: "column", gap: "16px" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid rgba(196,164,74,0.2)", borderTopColor: "#C4A44A", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <div style={{ color: "#C4A44A", fontSize: "16px" }}>{message}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (status === "no-auth") return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  if (status === "no-sub") return <Navigate to="/pricing?reason=subscription-required" replace />;

  return <>{children}</>;
}
