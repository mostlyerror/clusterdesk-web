"use server";

import { createAdminClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };

export async function purgeTestSubscribers(): Promise<ActionResult> {
  try {
    const db = createAdminClient();

    // Delete subscribers that look like test emails
    const { data, error } = await db
      .from("email_subscribers")
      .delete()
      .or("email.ilike.%test%,email.ilike.%example.com,email.ilike.%+test%")
      .select();

    if (error) {
      return { ok: false, error: `Database error: ${error.message}` };
    }

    const count = data?.length ?? 0;
    return {
      ok: true,
      message:
        count === 0
          ? "No test subscribers found — inbox is clean."
          : `Purged ${count} test subscriber${count === 1 ? "" : "s"}. They're gone.`,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}

export async function sendTestWelcomeEmail(email: string): Promise<ActionResult> {
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Please enter a valid email address." };
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

    return {
      ok: true,
      message: `Test email sent to ${email}. Check your inbox (and spam folder).`,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error — is RESEND_API_KEY set?",
    };
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
      return { ok: false, error: `Could not fetch tickers: ${error.message}` };
    }

    const tickers = [...new Set((data ?? []).map((r) => r.ticker as string))];

    // Revalidate each ticker page
    for (const ticker of tickers) {
      revalidatePath(`/buys/${ticker}`);
    }

    // Also revalidate the home page which lists all clusters
    revalidatePath("/");
    revalidatePath("/buys");

    return {
      ok: true,
      message:
        tickers.length === 0
          ? "No ticker pages to revalidate yet."
          : `Revalidated ${tickers.length} ticker page${tickers.length === 1 ? "" : "s"} + home. ISR cache cleared.`,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
}
