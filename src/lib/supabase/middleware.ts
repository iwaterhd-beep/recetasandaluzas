import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return supabaseResponse;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    if (!user) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/";
      redirect.searchParams.set("login", "1");
      redirect.searchParams.set("next", path);
      return NextResponse.redirect(redirect);
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, email")
      .eq("id", user.id)
      .maybeSingle();

    const adminEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const email = (profile?.email ?? user.email ?? "").toLowerCase();
    const isAdmin =
      profile?.role === "admin" ||
      (email !== "" && adminEmails.includes(email));

    if (!isAdmin) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/cuenta";
      return NextResponse.redirect(redirect);
    }
  }

  if (path.startsWith("/cuenta") && !user) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/";
    redirect.searchParams.set("login", "1");
    redirect.searchParams.set("next", "/cuenta");
    return NextResponse.redirect(redirect);
  }

  return supabaseResponse;
}
