import { useEffect } from "react";
import { useAuthStore } from "@healthpulse/store";
import { supabase } from "./supabase.js";

export function useAuthBridge() {
  const setSession = useAuthStore((s) => s.setSession);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(
          { id: data.session.user.id, email: data.session.user.email ?? "" },
          data.session.access_token,
        );
      } else {
        setSession(null, null);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) {
        setSession(
          { id: session.user.id, email: session.user.email ?? "" },
          session.access_token,
        );
      } else {
        setSession(null, null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [setSession]);
}
