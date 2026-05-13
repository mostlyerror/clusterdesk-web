import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { Resend } from "resend";
import { WeeklyDigestEmail } from "@/emails/WeeklyDigestEmail";
import { supabase } from "@/lib/supabase";

interface ClusterPayload {
  ticker: string;
  company_name: string;
  score: number;
  insider_count?: number;
  total_value_usd?: number;
  market_cap_usd?: number;
  cluster_start_date?: string;
  cluster_end_date?: string;
  roles?: string[];
}

function verifySecret(provided: string): boolean {
  const expected = process.env.REVALIDATE_SECRET ?? "";
  if (!provided || provided.length !== expected.length || expected.length === 0) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret") ?? "";
  if (!verifySecret(secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const clusters: ClusterPayload[] = body?.clusters ?? [];

  if (clusters.length === 0) {
    return NextResponse.json({ error: "No clusters provided" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (supabase as any)
    .from("email_subscribers")
    .select("email");

  if (result.error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }

  const subscribers: string[] = result.data.map((r: { email: string }) => r.email);
  if (subscribers.length === 0) {
    return NextResponse.json({ sent: 0, message: "No subscribers" });
  }

  const resend = new Resend(resendKey);
  const weekOf = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Chicago",
  });

  let sent = 0;
  let failed = 0;

  for (const email of subscribers) {
    try {
      await resend.emails.send({
        from: "ClusterDesk <hey@clusterdesk.io>",
        to: email,
        subject: `Friday's top insider cluster buys — ${weekOf}`,
        react: WeeklyDigestEmail({ clusters, weekOf }),
      });
      sent++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ sent, failed });
}
