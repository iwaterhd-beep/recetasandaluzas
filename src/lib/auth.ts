import { createClient } from "@/lib/supabase/server";
import { getAdminEmails } from "@/lib/supabase/server";

export async function getSessionUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) {
    return {
      id: user.id,
      email: user.email ?? null,
      display_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Usuario",
      avatar_url: user.user_metadata?.avatar_url ?? null,
      role: "user" as const,
      created_at: user.created_at,
      updated_at: user.created_at,
    };
  }

  const admins = getAdminEmails();
  const email = (data.email ?? user.email ?? "").toLowerCase();
  if (data.role !== "admin" && admins.includes(email)) {
    await supabase.from("profiles").update({ role: "admin" }).eq("id", user.id);
    return { ...data, role: "admin" as const };
  }

  return data;
}

export async function requireAdmin() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return null;
  return profile;
}
