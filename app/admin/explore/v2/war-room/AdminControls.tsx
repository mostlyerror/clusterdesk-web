"use client";

import { useRef, useState, useTransition } from "react";
import {
  purgeTestSubscribers,
  sendTestWelcomeEmail,
  revalidateAllTickerPages,
  type ActionResult,
} from "./actions";

// ── Shared inline result display ─────────────────────────────────────────────
// Renders as flowing prose text, consistent with the Field Report memo aesthetic.

function InlineResult({ result, onDismiss }: { result: ActionResult; onDismiss: () => void }) {
  return (
    <p style={{ fontSize: "0.78rem", marginTop: "6px", color: result.ok ? "#22C55E" : "#f87171", lineHeight: 1.5 }}>
      {result.ok ? "✓ " : "✗ "}
      {result.ok ? result.message : result.error}
      {" "}
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#787878",
          fontSize: "0.72rem",
          fontFamily: "inherit",
          padding: 0,
        }}
      >
        [dismiss]
      </button>
    </p>
  );
}

// ── Shared button style ───────────────────────────────────────────────────────

function actionBtn(danger = false, confirming = false): React.CSSProperties {
  return {
    padding: "6px 14px",
    borderRadius: "5px",
    border: `1px solid ${confirming ? "#7f1d1d" : danger ? "#4b1515" : "#2a2a2a"}`,
    background: confirming ? "#2d0a0a" : danger ? "#1a0808" : "#131313",
    color: confirming ? "#fca5a5" : "#d4d4d4",
    fontSize: "0.78rem",
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.15s",
  };
}

// ── §4-A: Purge test subscribers ─────────────────────────────────────────────

export function PurgeTestSubscribers() {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleClick() {
    if (!confirming) { setConfirming(true); return; }
    setConfirming(false);
    startTransition(async () => setResult(await purgeTestSubscribers()));
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <p style={{ fontSize: "0.78rem", color: "#787878", marginBottom: "6px", lineHeight: 1.6 }}>
        <strong style={{ color: "#a3a3a3" }}>Purge test subscribers</strong> — Deletes rows from{" "}
        <code style={{ fontSize: "0.75rem", color: "#787878" }}>email_subscribers</code> where the
        email matches <em>test*</em>, <em>@example.com</em>, or contains <em>+test</em>. Safe to run
        against production — it won't touch real signups. Useful after local QA runs that seeded
        dummy emails.
      </p>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          onClick={handleClick}
          disabled={pending}
          style={{ ...actionBtn(true, confirming), opacity: pending ? 0.5 : 1, cursor: pending ? "not-allowed" : "pointer" }}
        >
          {pending ? "Purging…" : confirming ? "Confirm — this is permanent" : "Purge test subscribers"}
        </button>
        {confirming && !pending && (
          <button
            onClick={() => setConfirming(false)}
            style={{ background: "none", border: "none", color: "#787878", fontSize: "0.75rem", fontFamily: "inherit", cursor: "pointer" }}
          >
            cancel
          </button>
        )}
      </div>
      {result && <InlineResult result={result} onDismiss={() => setResult(null)} />}
    </div>
  );
}

// ── §4-B: Send test welcome email ────────────────────────────────────────────

export function SendTestWelcomeEmail() {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSend() {
    const email = inputRef.current?.value?.trim() ?? "";
    if (!email) return;
    startTransition(async () => {
      const res = await sendTestWelcomeEmail(email);
      setResult(res);
      if (res.ok && inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <p style={{ fontSize: "0.78rem", color: "#787878", marginBottom: "6px", lineHeight: 1.6 }}>
        <strong style={{ color: "#a3a3a3" }}>Send test welcome email</strong> — Fires a real email
        through Resend from <em>hey@clusterdesk.io</em>. Use this to verify the{" "}
        <code style={{ fontSize: "0.75rem", color: "#787878" }}>RESEND_API_KEY</code> env var is live
        and the sending domain is verified. If it doesn't arrive, check Resend's delivery logs
        first, then domain DNS records.
      </p>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          ref={inputRef}
          type="email"
          placeholder="you@example.com"
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          style={{
            padding: "6px 10px",
            borderRadius: "5px",
            border: "1px solid #2a2a2a",
            background: "#0d0d0d",
            color: "#e8e8e8",
            fontSize: "0.78rem",
            fontFamily: "inherit",
            outline: "none",
            width: "220px",
          }}
        />
        <button
          onClick={handleSend}
          disabled={pending}
          style={{ ...actionBtn(), opacity: pending ? 0.5 : 1, cursor: pending ? "not-allowed" : "pointer" }}
        >
          {pending ? "Sending…" : "Send test email"}
        </button>
      </div>
      {result && <InlineResult result={result} onDismiss={() => setResult(null)} />}
    </div>
  );
}

// ── §4-C: Revalidate all ticker pages ────────────────────────────────────────

export function RevalidateAllTickerPages() {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => setResult(await revalidateAllTickerPages()));
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <p style={{ fontSize: "0.78rem", color: "#787878", marginBottom: "6px", lineHeight: 1.6 }}>
        <strong style={{ color: "#a3a3a3" }}>Revalidate ISR cache</strong> — Busts the Next.js
        incremental static regeneration cache for every{" "}
        <code style={{ fontSize: "0.75rem", color: "#787878" }}>/buys/[ticker]</code> page, plus{" "}
        <code style={{ fontSize: "0.75rem", color: "#787878" }}>/buys</code> and{" "}
        <code style={{ fontSize: "0.75rem", color: "#787878" }}>/</code>. Run this if the site is
        showing stale data after the pipeline published a new cluster. Vercel will re-render on the
        next request.
      </p>
      <button
        onClick={handleClick}
        disabled={pending}
        style={{ ...actionBtn(), opacity: pending ? 0.5 : 1, cursor: pending ? "not-allowed" : "pointer" }}
      >
        {pending ? "Revalidating…" : "Revalidate all pages"}
      </button>
      {result && <InlineResult result={result} onDismiss={() => setResult(null)} />}
    </div>
  );
}
