"use client";

import { useRef, useState, useTransition } from "react";
import {
  purgeTestSubscribers,
  sendTestWelcomeEmail,
  revalidateAllTickerPages,
  type ActionResult,
} from "./actions";

// ── tiny helpers ────────────────────────────────────────────────────────────

function StatusLine({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <p
      style={{
        marginTop: 6,
        fontSize: 13,
        color: result.ok ? "#22C55E" : "#ef4444",
        fontFamily: "inherit",
      }}
    >
      {result.ok ? "✓ " : "✗ "}
      {result.ok ? result.message : result.error}
    </p>
  );
}

function ActionRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}

const btnBase: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 14px",
  fontSize: 13,
  fontFamily: "inherit",
  borderRadius: 4,
  border: "1px solid #333",
  background: "#111",
  color: "#e8e8e8",
  cursor: "pointer",
  letterSpacing: "0.01em",
  transition: "border-color 0.15s",
};

const btnDanger: React.CSSProperties = {
  ...btnBase,
  border: "1px solid #7f1d1d",
  color: "#fca5a5",
};

const btnGreen: React.CSSProperties = {
  ...btnBase,
  border: "1px solid #166534",
  color: "#22C55E",
};

// ── sub-components ───────────────────────────────────────────────────────────

function PurgeTestSubscribers() {
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
      <ActionRow>
        <button
          style={confirming ? btnDanger : btnBase}
          onClick={handleClick}
          disabled={pending}
        >
          {pending
            ? "Purging…"
            : confirming
            ? "Confirm purge test subscribers?"
            : "Purge test subscribers"}
        </button>
        {confirming && (
          <button
            style={{ ...btnBase, color: "#787878" }}
            onClick={() => setConfirming(false)}
          >
            Cancel
          </button>
        )}
      </ActionRow>
      <StatusLine result={result} />
    </div>
  );
}

function SendTestEmail() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSend() {
    const email = inputRef.current?.value?.trim() ?? "";
    startTransition(async () => {
      const r = await sendTestWelcomeEmail(email);
      setResult(r);
    });
  }

  return (
    <div>
      <ActionRow>
        <input
          ref={inputRef}
          type="email"
          placeholder="you@example.com"
          style={{
            padding: "6px 10px",
            fontSize: 13,
            fontFamily: "inherit",
            borderRadius: 4,
            border: "1px solid #333",
            background: "#111",
            color: "#e8e8e8",
            width: 220,
            outline: "none",
          }}
        />
        <button style={btnGreen} onClick={handleSend} disabled={pending}>
          {pending ? "Sending…" : "Send test welcome email"}
        </button>
      </ActionRow>
      <StatusLine result={result} />
    </div>
  );
}

function RevalidateTickers() {
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
      <ActionRow>
        <button style={btnBase} onClick={handleClick} disabled={pending}>
          {pending ? "Revalidating…" : "Revalidate all ticker pages"}
        </button>
      </ActionRow>
      <StatusLine result={result} />
    </div>
  );
}

// ── main export ──────────────────────────────────────────────────────────────

export default function AdminControls() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PurgeTestSubscribers />
      <SendTestEmail />
      <RevalidateTickers />
    </div>
  );
}
