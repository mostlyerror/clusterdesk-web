"use client";

import { useState, useRef } from "react";
import { purgeTestSubscribers, sendTestWelcomeEmail, revalidateAllTickerPages, ActionResult } from "./actions";

function StatusBadge({ ok, message }: { ok: boolean; message: string }) {
  return (
    <div
      style={{
        marginTop: "8px",
        padding: "6px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        background: ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
        border: `1px solid ${ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
        color: ok ? "#22C55E" : "#EF4444",
      }}
    >
      {ok ? "✓" : "✗"} {message}
    </div>
  );
}

export function PurgeTestSubscribersButton() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  async function handleClick() {
    const confirmed = window.confirm(
      "Delete all subscribers with 'test', 'example.com', 'mailinator', 'guerrillamail', or 'temp' in their email?\n\nThis cannot be undone."
    );
    if (!confirmed) return;

    setPending(true);
    setResult(null);
    try {
      const r = await purgeTestSubscribers();
      setResult(r);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={pending}
        style={{
          padding: "6px 14px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: pending ? "not-allowed" : "pointer",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          color: "#EF4444",
          opacity: pending ? 0.6 : 1,
          transition: "opacity 0.15s",
        }}
      >
        {pending ? "Purging…" : "Purge test subscribers"}
      </button>
      {result && <StatusBadge ok={result.ok} message={result.ok ? result.message : result.error} />}
    </div>
  );
}

export function SendTestEmailForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSend() {
    const email = inputRef.current?.value?.trim() ?? "";
    if (!email) return;

    setPending(true);
    setResult(null);
    try {
      const r = await sendTestWelcomeEmail(email);
      setResult(r);
      if (r.ok && inputRef.current) inputRef.current.value = "";
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          ref={inputRef}
          type="email"
          placeholder="you@example.com"
          style={{
            flex: 1,
            padding: "6px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            background: "#111",
            border: "1px solid #2a2a2a",
            color: "#fff",
            outline: "none",
            minWidth: 0,
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={pending}
          style={{
            padding: "6px 14px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: pending ? "not-allowed" : "pointer",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: "#22C55E",
            opacity: pending ? 0.6 : 1,
            transition: "opacity 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          {pending ? "Sending…" : "Send test email"}
        </button>
      </div>
      {result && <StatusBadge ok={result.ok} message={result.ok ? result.message : result.error} />}
    </div>
  );
}

export function RevalidateButton() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);

  async function handleClick() {
    setPending(true);
    setResult(null);
    try {
      const r = await revalidateAllTickerPages();
      setResult(r);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={pending}
        style={{
          padding: "6px 14px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: pending ? "not-allowed" : "pointer",
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.3)",
          color: "#22C55E",
          opacity: pending ? 0.6 : 1,
          transition: "opacity 0.15s",
        }}
      >
        {pending ? "Revalidating…" : "Revalidate all ticker pages"}
      </button>
      {result && <StatusBadge ok={result.ok} message={result.ok ? result.message : result.error} />}
    </div>
  );
}
