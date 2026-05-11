"use client";

import { useRef, useState, useTransition } from "react";
import {
  purgeTestSubscribers,
  sendTestWelcomeEmail,
  revalidateAllTickerPages,
  type ActionResult,
} from "./actions";

/* ─── small shared atoms ─── */
function StatusBadge({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <span
      className="font-mono text-[10px] px-2 py-0.5 rounded"
      style={{
        background: result.ok ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
        color: result.ok ? "#22C55E" : "#EF4444",
        border: `1px solid ${result.ok ? "#22C55E33" : "#EF444433"}`,
      }}
    >
      {result.ok ? `OK: ${result.message}` : `ERR: ${result.error}`}
    </span>
  );
}

/* ─── purge test subscribers ─── */
export function PurgeTestSubsButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  function handleClick() {
    const confirmed = window.confirm(
      "CONFIRM: Delete all test/example subscriber rows?\n\nMatches: +test, test+, test@*, *@test.*, *@example.*\n\nThis is irreversible."
    );
    if (!confirmed) return;
    setResult(null);
    startTransition(async () => {
      const r = await purgeTestSubscribers();
      setResult(r);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={pending}
        title="Deletes rows where email matches test/example patterns. Irreversible — confirm dialog required."
        className="font-mono text-[11px] px-3 py-1.5 border rounded transition-colors disabled:opacity-40"
        style={{
          borderColor: "#EF4444",
          color: pending ? "#787878" : "#EF4444",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          if (!pending) (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        {pending ? "PURGING..." : "PURGE TEST SUBS"}
      </button>
      <StatusBadge result={result} />
    </div>
  );
}

/* ─── send test welcome email ─── */
export function SendTestEmailForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = inputRef.current?.value?.trim() ?? "";
    if (!email) return;
    setResult(null);
    startTransition(async () => {
      const r = await sendTestWelcomeEmail(email);
      setResult(r);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <form onSubmit={handleSubmit} className="flex gap-1">
        <input
          ref={inputRef}
          type="email"
          placeholder="addr@domain.com"
          disabled={pending}
          title="Sends a test welcome email via Resend from hey@clusterdesk.io — use to verify email deliverability."
          className="font-mono text-[11px] px-2 py-1.5 rounded border bg-transparent flex-1 min-w-0 disabled:opacity-40"
          style={{ borderColor: "#333", color: "#fff", outline: "none" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#22C55E")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
        />
        <button
          type="submit"
          disabled={pending}
          title="Fire test welcome email to entered address via Resend."
          className="font-mono text-[11px] px-3 py-1.5 border rounded transition-colors disabled:opacity-40"
          style={{
            borderColor: "#22C55E",
            color: pending ? "#787878" : "#22C55E",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            if (!pending) (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          {pending ? "SENDING..." : "SEND"}
        </button>
      </form>
      <StatusBadge result={result} />
    </div>
  );
}

/* ─── revalidate all ticker pages ─── */
export function RevalidateButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  function handleClick() {
    setResult(null);
    startTransition(async () => {
      const r = await revalidateAllTickerPages();
      setResult(r);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={pending}
        title="Calls revalidatePath() for every published ticker's /buys/[ticker] page plus / and /buys index. Use after manual DB edits."
        className="font-mono text-[11px] px-3 py-1.5 border rounded transition-colors disabled:opacity-40"
        style={{
          borderColor: "#F59E0B",
          color: pending ? "#787878" : "#F59E0B",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          if (!pending) (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,158,11,0.1)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        {pending ? "REVALIDATING..." : "REVALIDATE PAGES"}
      </button>
      <StatusBadge result={result} />
    </div>
  );
}
