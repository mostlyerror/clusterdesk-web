"use client";

import { useState, useTransition } from "react";
import {
  purgeTestSubscribers,
  sendTestWelcomeEmail,
  revalidateAllTickerPages,
  type ActionResult,
} from "./actions";

// ─── types ────────────────────────────────────────────────────────────────────

type LogMsg = { ts: string; ok: boolean; text: string };

function nowTs() {
  return new Date().toISOString().replace("T", " ").slice(0, 19) + "Z";
}

// ─── small sub-components ─────────────────────────────────────────────────────

function ActionLog({ msgs }: { msgs: LogMsg[] }) {
  if (msgs.length === 0) return null;
  return (
    <div style={{ marginTop: 8 }}>
      {msgs.map((m, i) => (
        <div
          key={i}
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            color: m.ok ? "#22C55E" : "#EF4444",
            borderLeft: `3px solid ${m.ok ? "#22C55E" : "#EF4444"}`,
            paddingLeft: 8,
            marginBottom: 3,
          }}
        >
          [{m.ts}] [{m.ok ? "OK" : "ERR"}] {m.text}
        </div>
      ))}
    </div>
  );
}

function ActionButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "monospace",
        fontSize: 12,
        background: "transparent",
        border: "1px solid #333",
        color: disabled ? "#555" : "#ccc",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "5px 12px",
        borderRadius: 3,
        transition: "border-color 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#22C55E";
          (e.currentTarget as HTMLButtonElement).style.color = "#22C55E";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#333";
        (e.currentTarget as HTMLButtonElement).style.color = disabled ? "#555" : "#ccc";
      }}
    >
      {disabled ? "..." : label}
    </button>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function AdminControls({
  adminEmail,
}: {
  adminEmail: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [logs, setLogs] = useState<LogMsg[]>([]);

  function appendResult(result: ActionResult) {
    setLogs((prev) => [
      {
        ts: nowTs(),
        ok: result.ok,
        text: result.ok ? result.message : result.error,
      },
      ...prev,
    ]);
  }

  function handlePurge() {
    startTransition(async () => {
      const r = await purgeTestSubscribers();
      appendResult(r);
    });
  }

  function handleTestEmail() {
    startTransition(async () => {
      const r = await sendTestWelcomeEmail(adminEmail);
      appendResult(r);
    });
  }

  function handleRevalidate() {
    startTransition(async () => {
      const r = await revalidateAllTickerPages();
      appendResult(r);
    });
  }

  return (
    <div
      style={{
        background: "#0f0f0f",
        border: "1px solid #1e1e1e",
        borderRadius: 4,
        padding: "12px 16px",
        marginBottom: 24,
      }}
    >
      {/* label */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: "#555",
          letterSpacing: "0.08em",
          marginBottom: 10,
          textTransform: "uppercase",
        }}
      >
        [ACTIONS] — operator controls
      </div>

      {/* buttons row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <ActionButton
          label="purge test subscribers"
          disabled={isPending}
          onClick={handlePurge}
        />
        <ActionButton
          label={`send test welcome → ${adminEmail}`}
          disabled={isPending}
          onClick={handleTestEmail}
        />
        <ActionButton
          label="revalidate all ticker pages"
          disabled={isPending}
          onClick={handleRevalidate}
        />
      </div>

      {/* inline result log */}
      <ActionLog msgs={logs} />
    </div>
  );
}
