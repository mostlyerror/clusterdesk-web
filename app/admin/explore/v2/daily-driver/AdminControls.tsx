"use client";

import { useState, useTransition } from "react";
import {
  purgeTestSubscribers,
  sendTestWelcomeEmail,
  revalidateAllTickerPages,
  type ActionResult,
} from "./actions";

function StatusBanner({ result, onDismiss }: { result: ActionResult; onDismiss: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "8px",
        backgroundColor: result.ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
        border: `1px solid ${result.ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
        marginTop: "8px",
      }}
    >
      <p style={{ fontSize: "13px", color: result.ok ? "#22C55E" : "#EF4444", margin: 0 }}>
        {result.ok ? result.message : result.error}
      </p>
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          color: "#787878",
          cursor: "pointer",
          fontSize: "16px",
          lineHeight: 1,
          flexShrink: 0,
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

function ActionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid #222",
        borderRadius: "10px",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div>
        <p style={{ fontWeight: 600, fontSize: "14px", color: "#fff", margin: "0 0 4px" }}>
          {title}
        </p>
        <p style={{ fontSize: "12px", color: "#787878", margin: 0, lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

// ── Purge Test Subscribers ────────────────────────────────────────────────────

export function PurgeTestSubscribersButton() {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    startTransition(async () => {
      const res = await purgeTestSubscribers();
      setResult(res);
    });
  }

  return (
    <ActionCard
      title="Purge test subscribers"
      description="Removes any subscriber with 'test', '+test', or '@example.com' in the address. Safe to run any time — real subscribers won't be touched."
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={handleClick}
          disabled={isPending}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: confirming ? "1px solid #EF4444" : "1px solid #333",
            backgroundColor: confirming ? "rgba(239,68,68,0.15)" : "#1a1a1a",
            color: confirming ? "#EF4444" : "#ccc",
            fontSize: "13px",
            cursor: isPending ? "not-allowed" : "pointer",
            fontWeight: confirming ? 600 : 400,
            transition: "all 0.15s",
          }}
        >
          {isPending ? "Purging…" : confirming ? "Tap again to confirm" : "Purge test subscribers"}
        </button>
        {confirming && (
          <button
            onClick={() => setConfirming(false)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #333",
              backgroundColor: "transparent",
              color: "#787878",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
      {result && <StatusBanner result={result} onDismiss={() => setResult(null)} />}
    </ActionCard>
  );
}

// ── Send Test Welcome Email ───────────────────────────────────────────────────

export function SendTestEmailButton() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    startTransition(async () => {
      const res = await sendTestWelcomeEmail(email);
      setResult(res);
      if (res.ok) setEmail("");
    });
  }

  return (
    <ActionCard
      title="Send test welcome email"
      description="Fires a real email via Resend to whatever address you enter. Use this to verify RESEND_API_KEY is working and the welcome copy looks right."
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          style={{
            flex: "1 1 200px",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #333",
            backgroundColor: "#111",
            color: "#fff",
            fontSize: "13px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={isPending || !email}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #22C55E",
            backgroundColor: "rgba(34,197,94,0.15)",
            color: "#22C55E",
            fontSize: "13px",
            cursor: isPending || !email ? "not-allowed" : "pointer",
            opacity: !email ? 0.5 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {isPending ? "Sending…" : "Send test email"}
        </button>
      </form>
      {result && <StatusBanner result={result} onDismiss={() => setResult(null)} />}
    </ActionCard>
  );
}

// ── Revalidate All Ticker Pages ───────────────────────────────────────────────

export function RevalidateButton() {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setResult(null);
    startTransition(async () => {
      const res = await revalidateAllTickerPages();
      setResult(res);
    });
  }

  return (
    <ActionCard
      title="Revalidate ticker pages"
      description="Tells Vercel to re-render every /buys/[ticker] page and the home page on next request. Use this if you updated a cluster record directly in Supabase and want the site to reflect it immediately."
    >
      <button
        onClick={handleClick}
        disabled={isPending}
        style={{
          alignSelf: "flex-start",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "1px solid #333",
          backgroundColor: "#1a1a1a",
          color: "#ccc",
          fontSize: "13px",
          cursor: isPending ? "not-allowed" : "pointer",
        }}
      >
        {isPending ? "Revalidating…" : "Revalidate all pages"}
      </button>
      {result && <StatusBanner result={result} onDismiss={() => setResult(null)} />}
    </ActionCard>
  );
}

// ── Composite AdminControls export ───────────────────────────────────────────

export default function AdminControls() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <PurgeTestSubscribersButton />
      <SendTestEmailButton />
      <RevalidateButton />
    </div>
  );
}
