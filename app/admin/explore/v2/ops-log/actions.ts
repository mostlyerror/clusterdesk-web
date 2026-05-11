"use server";

import { createAdminClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function purgeTestSubscribers(): Promise<ActionResult> {
  try {
    const db = createAdminClient();
    const { error, count } = await db
      .from("email_subscribers")
      .delete({ count: "exact" })
      .or(
        "email.ilike.%test%,email.ilike.%example.com,email.ilike.%+test%"
      );
    if (error) throw error;
    return { ok: true, message: `Purged ${count ?? 0} test subscriber(s).` };
  } catch (err) {
    return { ok: false, error: String(err instanceof Error ? err.message : err) };
  }
}

export async function sendTestWelcomeEmail(email: string): Promise<ActionResult> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "ClusterDesk <hey@clusterdesk.io>",
      to: email,
      subject: "Welcome to ClusterDesk (test)",
      html: "<p>Test welcome email from ClusterDesk admin.</p>",
    });
    return { ok: true, message: `Test welcome email sent to ${email}.` };
  } catch (err) {
    return { ok: false, error: String(err instanceof Error ? err.message : err) };
  }
}

export async function revalidateAllTickerPages(): Promise<ActionResult> {
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("clusters")
      .select("ticker")
      .not("published_at", "is", null);
    if (error) throw error;

    const tickers = (data ?? []).map((r) => r.ticker as string);
    for (const ticker of tickers) {
      revalidatePath(`/buys/${ticker}`);
    }
    revalidatePath("/");
    revalidatePath("/buys");
    return {
      ok: true,
      message: `Cache revalidated for ${tickers.length} ticker page(s) + home + /buys.`,
    };
  } catch (err) {
    return { ok: false, error: String(err instanceof Error ? err.message : err) };
  }
}
