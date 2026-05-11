"use client";

import { useState, useTransition } from "react";
import type { AdminStats } from "./page";
import {
  purgeTestSubscribers,
  sendTestWelcomeEmail,
  revalidateAllTickerPages,
} from "./actions";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-5 mb-4"
      style={{ background: "#111", border: "1px solid #1f1f1f" }}
    >
      <h2
        className="text-xs font-semibold uppercase tracking-widest mb-4"
        style={{ color: "#787878" }}
      >
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm" style={{ color: "#787878" }}>
        {label}
      </span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

function Toast({
  message,
  ok,
  onDismiss,
}: {
  message: string;
  ok: boolean;
  onDismiss: () => void;
}) {
  return (
    <div
      className="fixed bottom-6 right-6 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg z-50"
      style={{
        background: ok ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
        border: `1px solid ${ok ? "#22C55E" : "#EF4444"}`,
        color: ok ? "#22C55E" : "#EF4444",
      }}
    >
      <span>{message}</span>
      <button onClick={onDismiss} className="opacity-60 hover:opacity-100 text-xs">
        ✕
      </button>
    </div>
  );
}

export function AdminControls({ stats }: { stats: AdminStats }) {
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  function showToast(message: string, ok: boolean) {
    setToast({ message, ok });
    setTimeout(() => setToast(null), 5000);
  }

  async function handlePurgeTest() {
    if (
      !window.confirm(
        "DANGER: This will permanently delete all subscribers whose email contains '+test'. Are you sure?"
      )
    )
      return;
    setPendingAction("purge");
    startTransition(async () => {
      const result = await purgeTestSubscribers();
      setPendingAction(null);
      showToast(result.ok ? result.message : result.error, result.ok);
    });
  }

  async function handleSendWelcome() {
    const email = testEmail.trim();
    if (!email || !email.includes("@")) {
      showToast("Enter a valid email address.", false);
      return;
    }
    setPendingAction("welcome");
    startTransition(async () => {
      const result = await sendTestWelcomeEmail(email);
      setPendingAction(null);
      showToast(result.ok ? result.message : result.error, result.ok);
    });
  }

  async function handleRevalidate() {
    setPendingAction("revalidate");
    startTransition(async () => {
      const result = await revalidateAllTickerPages();
      setPendingAction(null);
      showToast(result.ok ? result.message : result.error, result.ok);
    });
  }

  const sourceEntries = Object.entries(stats.sourceCounts).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <>
      <SectionCard title="Pipeline">
        <StatusRow
          label="Last published ticker"
          value={
            stats.lastPublishedTicker ? (
              <a
                href={`/buys/${stats.lastPublishedTicker}`}
                className="font-mono hover:underline"
                style={{ color: "#22C55E" }}
              >
                {stats.lastPublishedTicker}
              </a>
            ) : (
              <span style={{ color: "#787878" }}>none</span>
            )
          }
        />
        <StatusRow
          label="Published at"
          value={
            stats.lastPublishedAt ? (
              <span style={{ color: "#ccc" }}>
                {relativeTime(stats.lastPublishedAt)}
              </span>
            ) : (
              <span style={{ color: "#787878" }}>—</span>
            )
          }
        />
        <StatusRow
          label="DRY_RUN"
          value={
            <span
              className="text-xs font-semibold uppercase px-2 py-0.5 rounded"
              style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}
            >
              check env
            </span>
          }
        />
        <div className="pt-2">
          <button
            disabled
            title="Trigger manually via the pipeline script"
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: "#1a1a1a",
              color: "#787878",
              border: "1px solid #2a2a2a",
            }}
          >
            Run preview
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ background: "#222", color: "#555" }}
            >
              not wired
            </span>
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Subscribers">
        <StatusRow
          label="Total count"
          value={
            <span className="font-semibold text-white">{stats.subscriberCount}</span>
          }
        />
        {sourceEntries.length > 0 && (
          <div>
            <p className="text-xs mb-2" style={{ color: "#787878" }}>
              Source breakdown
            </p>
            <div className="space-y-1.5">
              {sourceEntries.map(([src, count]) => (
                <div key={src} className="flex justify-between text-sm">
                  <span className="capitalize" style={{ color: "#ccc" }}>
                    {src}
                  </span>
                  <span style={{ color: "#787878" }}>
                    {count}{" "}
                    <span className="text-xs">
                      (
                      {stats.subscriberCount > 0
                        ? Math.round((count / stats.subscriberCount) * 100)
                        : 0}
                      %)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t" style={{ borderColor: "#1f1f1f" }}>
          <p className="text-xs mb-2" style={{ color: "#787878" }}>
            Purge all rows where email contains{" "}
            <code
              className="px-1 py-0.5 rounded text-xs"
              style={{ background: "#1a1a1a", color: "#EF4444" }}
            >
              +test
            </code>
          </p>
          <button
            onClick={handlePurgeTest}
            disabled={isPending && pendingAction === "purge"}
            className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background: "rgba(239,68,68,0.12)",
              color: "#EF4444",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            {isPending && pendingAction === "purge"
              ? "Purging..."
              : "Purge test subscribers"}
          </button>
        </div>

        <div className="pt-2 border-t" style={{ borderColor: "#1f1f1f" }}>
          <p className="text-xs mb-2" style={{ color: "#787878" }}>
            Send a test welcome email
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
              style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                color: "#e5e5e5",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendWelcome();
              }}
            />
            <button
              onClick={handleSendWelcome}
              disabled={isPending && pendingAction === "welcome"}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 whitespace-nowrap"
              style={{
                background: "rgba(34,197,94,0.12)",
                color: "#22C55E",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              {isPending && pendingAction === "welcome" ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Cache">
        <p className="text-sm" style={{ color: "#787878" }}>
          Force-revalidate all ticker pages, /weekly, and home.
        </p>
        <button
          onClick={handleRevalidate}
          disabled={isPending && pendingAction === "revalidate"}
          className="w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{
            background: "rgba(34,197,94,0.1)",
            color: "#22C55E",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          {isPending && pendingAction === "revalidate"
            ? "Revalidating..."
            : "Revalidate all ticker pages"}
        </button>
      </SectionCard>

      <SectionCard title="System">
        <StatusRow
          label="Total cluster rows"
          value={
            <span className="font-semibold text-white">
              {stats.filingCount.toLocaleString()}
            </span>
          }
        />
        <StatusRow
          label="Unique tickers tracked"
          value={
            <span className="font-semibold text-white">
              {stats.clusterCount.toLocaleString()}
            </span>
          }
        />
        <StatusRow
          label="Last scrape"
          value={
            stats.lastScrapeAt ? (
              <span style={{ color: "#ccc" }}>{relativeTime(stats.lastScrapeAt)}</span>
            ) : (
              <span style={{ color: "#787878" }}>no data</span>
            )
          }
        />
      </SectionCard>

      {toast && (
        <Toast
          message={toast.message}
          ok={toast.ok}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}
