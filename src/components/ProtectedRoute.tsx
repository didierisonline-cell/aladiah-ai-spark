import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  children: React.ReactNode;
  requireSubscription?: boolean;
};

function getStoredSession(): boolean {
  try {
    const key = Object.keys(localStorage).find(
      k => k.startsWith("sb-") && k.endsWith("-auth-token")
    );
    if (!key) return false;
    const stored = JSON.parse(localStorage.getItem(key) || "");
    return !!(stored?.user?.id || stored?.access_token);
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children }: Props) {
  const hasStored = getStoredSession();
  // If localStorage says we're in → start authed immediately, no spinner ever
  const [status, setStatus] = useState<"authed" | "no-auth">(
    hasStored ? "authed" : "no-auth"
  );
  const location = useLocation();

  useEffect(() => {
    // Listen for live auth events (sign-in / sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session?.user ? "authed" : "no-auth");
    });

    // Background verify — update status when it resolves, but never block the UI
    supabase.auth.getSession().then(({ data: { session } }) => {
      setStatus(session?.user ? "authed" : "no-auth");
    }).catch(() => {
      // getSession() failed — keep whatever localStorage told us
    });

    return () => subscription.unsubscribe();
  }, []);

  if (status === "no-auth") return <Navigate to="/auth" state={{ from: location.pathname }} replace />;

  return <>{children}</>;
}
