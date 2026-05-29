import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { useAuthStore } from "@healthpulse/store";
import { supabase } from "./supabase.js";

function toAuthUser(u: User) {
  const meta = (u.user_metadata ?? {}) as {
    display_name?: string;
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
  };
  return {
    id: u.id,
    email: u.email ?? "",
    display_name: meta.display_name ?? meta.full_name ?? meta.name,
    avatar_url: meta.avatar_url ?? meta.picture,
  };
}

export function useAuthBridge() {
  const setSession = useAuthStore((s) => s.setSession);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(toAuthUser(data.session.user), data.session.access_token);
      } else {
        setSession(null, null);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) {
        setSession(toAuthUser(session.user), session.access_token);
      } else {
        setSession(null, null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [setSession]);
}
