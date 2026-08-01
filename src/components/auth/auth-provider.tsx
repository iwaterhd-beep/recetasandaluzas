"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type ProfileLite = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
};

type AuthContextValue = {
  ready: boolean;
  configured: boolean;
  user: User | null;
  profile: ProfileLite | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  ready: false,
  configured: false,
  user: null,
  profile: null,
  refresh: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [ready, setReady] = useState(!configured);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileLite | null>(null);

  const refresh = async () => {
    const supabase = createClient();
    if (!supabase) {
      setReady(true);
      return;
    }
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    setUser(u);
    if (!u) {
      setProfile(null);
      setReady(true);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, email, display_name, avatar_url, role")
      .eq("id", u.id)
      .maybeSingle();
    setProfile(
      data ?? {
        id: u.id,
        email: u.email ?? null,
        display_name: u.user_metadata?.full_name ?? u.email?.split("@")[0] ?? null,
        avatar_url: u.user_metadata?.avatar_url ?? null,
        role: "user",
      },
    );
    setReady(true);
  };

  useEffect(() => {
    void refresh();
    const supabase = createClient();
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      configured,
      user,
      profile,
      refresh,
      signOut: async () => {
        const supabase = createClient();
        await supabase?.auth.signOut();
        setUser(null);
        setProfile(null);
      },
    }),
    [ready, configured, user, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
