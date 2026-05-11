"use server";

import { createAdminClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };

export async function purgeTestSubscribers(): Promise<ActionResult> {
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("email_subscribers")
      .delete()
      .or("email.ilike.%test%,email.ilike.%example.com%,email.ilike.%mailinator%,email.ilike.%guerrillamail%,email.ilike.%temp%")
      .select("id");

    if (error) {
      return { ok: false, error: `Supabase error: ${error.message}` };
    }

    const count = data?.length ?? 0;
    return { ok: true, message: `Purged ${count} test subscriber${count !== 1 ? "s" : ""}.` };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function sendTestWelcomeEmail(email: string): Promise<ActionResult> {
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Invalid email address." };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "ClusterDesk <hey@clusterdesk.io>",
      to: email,
      subject: "Welcome to ClusterDesk (test)",
      html: "<p>Test welcome email from ClusterDesk admin.</p>",
    });

    if (error) {
      return { ok: false, error: `Resend error: ${error.message}` };
    }

    return { ok: true, message: `Test welcome email sent to ${email}.` };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function revalidateAllTickerPages(): Promise<ActionResult> {
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("clusters")
      .select("ticker")
      .not("published_at", "is", null);

    if (error) {
      return { ok: false, error: `Supabase error: ${error.message}` };
    }

    const tickers = [...new Set((data ?? []).map((r) => r.ticker as string))];
    for (const ticker of tickers) {
      revalidatePath(`/buys/${ticker}`);
    }
    revalidatePath("/buys");
    revalidatePath("/");

    return { ok: true, message: `Revalidated ${tickers.length} ticker page${tickers.length !== 1 ? "s" : ""} + home + /buys.` };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
