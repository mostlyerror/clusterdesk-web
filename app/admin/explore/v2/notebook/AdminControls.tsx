"use client";

import { useRef, useState, useTransition } from "react";
import {
  purgeTestSubscribers,
  sendTestWelcomeEmail,
  revalidateAllTickerPages,
  type ActionResult,
} from "./actions";

/* ─── tiny prose-style status line ────────────────────────────── */
function Result({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <p
      style={{
        marginTop: "0.5rem",
        fontSize: "0.82rem",
        lineHeight: "1.5",
        color: result.ok ? "#22C55E" : "#f87171",
      }}
    >
      {result.ok ? result.message : `Error: ${result.error}`}
    </p>
  );
}

/* ─── Purge test subscribers ───────────────────────────────────── */
export function PurgeTestSubscribersButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    startTransition(async () => {
      const r = await purgeTestSubscribers();
      setResult(r);
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={pending}
        style={{
          fontSize: "0.8rem",
          padding: "0.25rem 0.75rem",
          border: confirming ? "1px solid #f87171" : "1px solid #333",
          borderRadius: "4px",
          background: "transparent",
          color: confirming ? "#f87171" : "#bbb",
          cursor: pending ? "not-allowed" : "pointer",
          opacity: pending ? 0.5 : 1,
          transition: "all 0.15s",
        }}
      >
        {pending ? "Purging…" : confirming ? "Confirm — delete test rows?" : "Purge test subscribers"}
      </button>
      {confirming && !pending && (
        <button
          onClick={() => setConfirming(false)}
          style={{
            marginLeft: "0.5rem",
            fontSize: "0.8rem",
            padding: "0.25rem 0.75rem",
            border: "1px solid #333",
            borderRadius: "4px",
            background: "transparent",
            color: "#787878",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      )}
      <Result result={result} />
    </div>
  );
}

/* ─── Send test welcome email ──────────────────────────────────── */
export function SendTestEmailForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = inputRef.current?.value ?? "";
    startTransition(async () => {
      const r = await sendTestWelcomeEmail(email);
      setResult(r);
      if (r.ok && inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          ref={inputRef}
          type="email"
          placeholder="you@example.com"
          required
          style={{
            fontSize: "0.82rem",
            padding: "0.25rem 0.6rem",
            background: "#111",
            border: "1px solid #333",
            borderRadius: "4px",
            color: "#fff",
            outline: "none",
            width: "220px",
          }}
        />
        <button
          type="submit"
          disabled={pending}
          style={{
            fontSize: "0.8rem",
            padding: "0.25rem 0.75rem",
            border: "1px solid #333",
            borderRadius: "4px",
            background: "transparent",
            color: "#bbb",
            cursor: pending ? "not-allowed" : "pointer",
            opacity: pending ? 0.5 : 1,
          }}
        >
          {pending ? "Sending…" : "Send test email"}
        </button>
      </form>
      <Result result={result} />
    </div>
  );
}

/* ─── Revalidate all ticker pages ──────────────────────────────── */
export function RevalidateButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  function handleClick() {
    startTransition(async () => {
      const r = await revalidateAllTickerPages();
      setResult(r);
    });
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={pending}
        style={{
          fontSize: "0.8rem",
          padding: "0.25rem 0.75rem",
          border: "1px solid #333",
          borderRadius: "4px",
          background: "transparent",
          color: "#bbb",
          cursor: pending ? "not-allowed" : "pointer",
          opacity: pending ? 0.5 : 1,
        }}
      >
        {pending ? "Revalidating…" : "Revalidate all ticker pages"}
      </button>
      <Result result={result} />
    </div>
  );
}
