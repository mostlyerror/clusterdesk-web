import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const LOOPS_API_URL = "https://app.loops.so/api/v1/contacts/create";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email: string | undefined = body?.email?.trim().toLowerCase();
  const source: string = body?.source ?? "landing";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("email_subscribers")
    .insert({ email, signup_source: source });

  if (error && error.code !== "23505") {
    // 23505 = unique violation (already subscribed) — treat as success
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // Sync to Loops (non-fatal)
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
