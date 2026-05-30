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
  // If localStorage says we're in → start authed immediately, no spinner.
  // If not, start in "checking" (NOT "no-auth") so we never redirect before
  // the real auth check resolves — this prevents the redirect loop.
  const [status, setStatus] = useState<"authed" | "no-auth" | "checking">(
    hasStored ? "authed" : "checking"
  );
  const location = useLocation();

  useEffect(() => {
    let active = true;

    // Listen for live auth events (sign-in / sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setStatus(session?.user ? "authed" : "no-auth");
    });

    // Background verify — resolve the real status once.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) setStatus(session?.user ? "authed" : "no-auth");
    }).catch(() => {
      // getSession() failed (network/RLS). Fall back to what localStorage said,
      // so a transient failure does not log the user out / cause a redirect loop.
      if (active) setStatus(hasStored ? "authed" : "no-auth");
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [hasStored]);

  // While we don't yet have a definite answer, render nothing (no redirect).
  if (status === "checking") return null;

  if (status === "no-auth") {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
