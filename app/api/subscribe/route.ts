import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const LOOPS_API_URL = "https://app.loops.so/api/v1/contacts/create";

const VALID_SOURCES = ["landing", "weekly", "ticker"] as const;
type Source = (typeof VALID_SOURCES)[number];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email: string | undefined = body?.email?.trim().toLowerCase();
  const raw = body?.source;
  const source: Source = VALID_SOURCES.includes(raw) ? raw : "landing";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // supabase-js overload resolution picks the Views overload for `from("email_subscribers" as any)`
  // because Views is Record<string, never>, causing Insert to resolve to never. Casting the
  // client itself is the only reliable narrow escape — narrower than the original `supabase as any`
  // since we immediately call .from() and .insert() inline with known types.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("email_subscribers")
    .insert({ email: email as string, signup_source: source });

  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  const loopsKey = process.env.LOOPS_API_KEY;
  const welcomeId = process.env.LOOPS_WELCOME_TEMPLATE_ID;
  if (loopsKey) {
    try {
      await fetch(LOOPS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loopsKey}`,
        },
        body: JSON.stringify({ email, source }),
      });
      if (welcomeId) {
        await fetch("https://app.loops.so/api/v1/transactional", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loopsKey}`,
          },
          body: JSON.stringify({ transactionalId: welcomeId, email }),
        });
      }
    } catch {
      // Loops sync failure is non-fatal — subscriber is in our DB
    }
  }

  return NextResponse.json({ success: true });
}
