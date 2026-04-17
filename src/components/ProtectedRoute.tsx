import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  children: React.ReactNode;
  requireSubscription?: boolean;
};

export default function ProtectedRoute({ children, requireSubscription = true }: Props) {
  const [status, setStatus] = useState<"loading" | "authed" | "no-auth" | "no-sub">("loading");
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setStatus("no-auth");
      if (!requireSubscription) return setStatus("authed");

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      setStatus(sub ? "authed" : "no-sub");
    };
    check();
  }, [requireSubscription]);

  if (status === "loading") return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0f1a" }}>
      <div style={{ color: "#C4A44A", fontSize: "18px" }}>Loading...</div>
    </div>
  );

  if (status === "no-auth") return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  if (status === "no-sub") return <Navigate to="/pricing?reason=subscription-required" replace />;

  return <>{children}</>;
}
