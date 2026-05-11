"use server";

import { createAdminClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function purgeTestSubscribers(): Promise<ActionResult> {
  const db = createAdminClient();
  const { error } = await db
    .from("email_subscribers")
    .delete()
    .like("email", "%+test%");

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/explore/levers-knobs");
  return { ok: true, message: "Test subscribers purged." };
}

export async function sendTestWelcomeEmail(
  email: string
): Promise<ActionResult> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return { ok: false, error: "RESEND_API_KEY not configured." };

  const resend = new Resend(resendKey);
  const { error } = await resend.emails.send({
    from: "ClusterDesk <hey@clusterdesk.io>",
    to: email,
    subject: "Welcome to ClusterDesk (test)",
    html: "<p>This is a test welcome email from ClusterDesk admin panel.</p>",
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, message: `Test welcome email sent to ${email}.` };
}

export async function revalidateAllTickerPages(): Promise<ActionResult> {
  revalidatePath("/buys/[ticker]", "page");
  revalidatePath("/weekly");
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, message: "All ticker pages and home revalidated." };
}
