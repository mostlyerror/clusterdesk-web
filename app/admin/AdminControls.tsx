"use client";

import { useState, useTransition } from "react";
import {
  purgeTestSubscribers,
  sendTestWelcomeEmail,
  revalidateAllTickerPages,
  type ActionResult,
} from "./actions";
import type {
  DistributionMetrics,
  GrowthMetric,
  SourceMetric,
} from "@/lib/admin-metrics";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ActivityEvent =
  | { type: "cluster"; ticker: string; score: number; published_at: string }
  | { type: "subscriber"; email: string; created_at: string };

export interface ChecklistItem {
  label: string;
  pass: boolean;
  detail: string;
}

export interface DashboardProProps {
  totalSubscribers: number;
  subsThisWeek: number;
  subsLastWeek: number;
  totalPublished: number;
  pendingClusters: number;
  lastPublishedAt: string | null;
  pipelineStatus: "NOMINAL" | "DEGRADED" | "DOWN" | "UNKNOWN";
  activity: ActivityEvent[];
  checklist: ChecklistItem[];
  sourceBreakdown: SourceMetric[];
  growth: GrowthMetric;
  distribution: DistributionMetrics;
  learningQuestions: string[];
}

// ─── Nav config ─────────────────────────────────────────────────────────────

type NavSection = "Overview" | "Growth" | "Checklist" | "Actions" | "Systems";

const NAV_ITEMS: { id: NavSection; symbol: string }[] = [
  { id: "Overview", symbol: "◉" },
  { id: "Growth", symbol: "↗" },
  { id: "Checklist", symbol: "✓" },
  { id: "Actions", symbol: "⚙" },
  { id: "Systems", symbol: "⬡" },
];

const SERVICES = [
  {
    label: "Railway",
    desc: "Python worker cron — runs daily at 8am CT weekdays. Check logs here when pipeline is DEGRADED or DOWN.",
    href: "https://railway.app",
  },
  {
    label: "Vercel",
    desc: "Next.js web host + ISR. Deploy logs and edge function traces live here.",
    href: "https://vercel.com",
  },
  {
    label: "Supabase",
    desc: "Postgres database — clusters and email_subscribers tables. Run queries + manage RLS here.",
    href: "https://supabase.com",
  },
  {
    label: "Resend",
    desc: "Transactional email (welcome emails). Check delivery logs and bounce rates here.",
    href: "https://resend.com",
  },
  {
    label: "GitHub (web)",
    desc: "clusterdesk-web — Next.js frontend source code.",
    href: "https://github.com/mostlyerror/clusterdesk-web",
  },
  {
    label: "GitHub (worker)",
    desc: "clusterdesk-worker — Python scraper + scoring pipeline source code.",
    href: "https://github.com/mostlyerror/clusterdesk-worker",
  },
  {
    label: "X @clusterdesk",
    desc: "The public-facing Twitter account. Verify posts are publishing and engagement is healthy.",
    href: "https://x.com/clusterdesk",
  },
];

const C = {
  bg: "#FAFAF8",
  panel: "#FFFFFF",
  ink: "#1A1A1A",
  body: "#4A4A4A",
  muted: "#9A9A9A",
  faint: "#F0F0EC",
  line: "#E8E8E4",
  green: "#2D6A4F",
  greenSoft: "#EEF5F1",
  warn: "#D97706",
  red: "#B42318",
};

const LABEL: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: C.muted,
};

// ─── Shared UI primitives ────────────────────────────────────────────────────

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderLeft: `3px solid ${C.green}`,
        background: C.greenSoft,
        padding: "14px 18px",
        color: C.body,
        fontSize: "13px",
        lineHeight: "1.6",
      }}
    >
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
  subAccent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  subAccent?: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${C.line}`,
        padding: "22px 24px",
        background: C.panel,
        minHeight: 116,
      }}
    >
      <p
        style={{ ...LABEL, marginBottom: "10px" }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "34px",
          fontWeight: 400,
          color: accent ?? C.ink,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ color: subAccent ?? C.muted, fontSize: "12px", marginTop: "8px", lineHeight: 1.4 }}>{sub}</p>
      )}
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: "24px", borderBottom: `1px solid ${C.ink}`, paddingBottom: "18px" }}>
      <p style={{ ...LABEL, color: C.green, marginBottom: "8px" }}>Operator desk</p>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "40px",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: C.ink,
          marginBottom: sub ? "8px" : 0,
        }}
      >
        {title}
      </h2>
      {sub && <p style={{ color: C.body, fontSize: "14px", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  variant = "default",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger" | "primary";
  disabled?: boolean;
}) {
  const bg = variant === "danger" ? "#FEE2E2" : variant === "primary" ? C.green : C.panel;
  const border = variant === "danger" ? "#FCA5A5" : variant === "primary" ? C.green : C.line;
  const color = variant === "danger" ? C.red : variant === "primary" ? "#FFFFFF" : C.ink;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color: disabled ? C.muted : color,
        padding: "9px 18px",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      {children}
    </button>
  );
}

function ResultBadge({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <span
      style={{
        fontSize: "12px",
        color: result.ok ? C.green : C.red,
        padding: "5px 10px",
        background: result.ok ? C.greenSoft : "#FEE2E2",
        border: `1px solid ${result.ok ? "#CFE3D6" : "#FCA5A5"}`,
      }}
    >
      {result.ok ? result.message : result.error}
    </span>
  );
}

// ─── Section: Overview ──────────────────────────────────────────────────────

function OverviewSection({
  totalSubscribers,
  subsThisWeek,
  subsLastWeek,
  totalPublished,
  pendingClusters,
  lastPublishedAt,
  pipelineStatus,
  checklist,
  distribution,
}: Pick<
  DashboardProProps,
  | "totalSubscribers"
  | "subsThisWeek"
  | "subsLastWeek"
  | "totalPublished"
  | "pendingClusters"
  | "lastPublishedAt"
  | "pipelineStatus"
  | "checklist"
  | "distribution"
>) {
  const statusColor =
    pipelineStatus === "NOMINAL"
      ? "#22C55E"
      : pipelineStatus === "DEGRADED"
      ? "#f59e0b"
      : pipelineStatus === "DOWN"
      ? "#ef4444"
      : "#787878";

  const lastPubLabel = lastPublishedAt
    ? new Date(lastPublishedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Never";

  const weekDelta = subsThisWeek - subsLastWeek;
  const deltaLabel =
    weekDelta > 0
      ? `+${weekDelta} vs last wk`
      : weekDelta < 0
      ? `${weekDelta} vs last wk`
      : "flat vs last wk";

  const checksPassed = checklist.filter((c) => c.pass).length;

  return (
    <div>
      <SectionHeader title="Overview" sub="High-level health of the ClusterDesk system." />

      <Callout>
        This section gives you a snapshot of all key metrics at a glance. Use this to quickly decide
        whether anything needs attention before reviewing individual sections.
      </Callout>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          marginTop: "28px",
        }}
      >
        <StatCard label="Total subscribers" value={totalSubscribers} sub={deltaLabel} />
        <StatCard label="New this week" value={subsThisWeek} sub={`Last week: ${subsLastWeek}`} />
        <StatCard
          label="Clusters published"
          value={totalPublished}
          sub={pendingClusters > 0 ? `${pendingClusters} pending (scored, not published)` : undefined}
          subAccent={pendingClusters > 0 ? "#f59e0b" : undefined}
        />
        <StatCard
          label="Pipeline status"
          value={pipelineStatus}
          sub={lastPubLabel}
          accent={statusColor}
        />
        <StatCard
          label="X post rate"
          value={`${Math.round(distribution.xPostRate * 100)}%`}
          sub={
            distribution.missingXPosts > 0
              ? `${distribution.missingXPosts} published cluster${distribution.missingXPosts === 1 ? "" : "s"} missing X`
              : "All published clusters posted"
          }
          accent={distribution.missingXPosts > 0 ? "#f59e0b" : "#22C55E"}
        />
      </div>

      <div style={{ marginTop: "32px" }}>
        <h3
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#555",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          Operator Checklist Summary
        </h3>
        <div style={{ border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
          {checklist.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 16px",
                borderBottom: i < checklist.length - 1 ? "1px solid #1a1a1a" : "none",
                background: "#0f0f0f",
              }}
            >
              <span
                style={{
                  color: item.pass ? "#22C55E" : "#ef4444",
                  fontSize: "14px",
                  fontWeight: 700,
                  minWidth: "16px",
                }}
              >
                {item.pass ? "✓" : "✗"}
              </span>
              <span style={{ fontSize: "13px", color: item.pass ? "#ccc" : "#fca5a5" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <p style={{ color: "#444", fontSize: "12px", marginTop: "8px" }}>
          {checksPassed}/{checklist.length} checks passing — go to Checklist section for details.
        </p>
      </div>
    </div>
  );
}

// ─── Section: Growth ────────────────────────────────────────────────────────

function GrowthSection({
  sourceBreakdown,
  growth,
  distribution,
  learningQuestions,
}: Pick<
  DashboardProProps,
  "sourceBreakdown" | "growth" | "distribution" | "learningQuestions"
>) {
  const deltaLabel =
    growth.delta > 0
      ? `+${growth.delta}`
      : growth.delta < 0
      ? String(growth.delta)
      : "flat";
  const pctLabel =
    growth.deltaPct === null
      ? "new baseline"
      : `${growth.deltaPct >= 0 ? "+" : ""}${Math.round(growth.deltaPct * 100)}%`;

  return (
    <div>
      <SectionHeader
        title="Growth"
        sub="Subscriber acquisition and distribution metrics for the current alert loop."
      />

      <Callout>
        Use this section to decide what to test next. Every new offer, page, post format, and email
        variant should either improve one of these metrics or teach us why it did not.
      </Callout>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          marginTop: "28px",
        }}
      >
        <StatCard
          label="7-day subscriber delta"
          value={deltaLabel}
          sub={`${growth.current} this week vs ${growth.previous} prior · ${pctLabel}`}
          accent={growth.delta >= 0 ? "#22C55E" : "#ef4444"}
        />
        <StatCard
          label="Published to X"
          value={`${distribution.postedToX}/${distribution.publishedClusters}`}
          sub={`${Math.round(distribution.xPostRate * 100)}% distribution coverage`}
          accent={distribution.xPostRate >= 0.8 ? "#22C55E" : "#f59e0b"}
        />
        <StatCard
          label="High-score gaps"
          value={distribution.highScoreMissingX.length}
          sub={
            distribution.highScoreMissingX.length
              ? distribution.highScoreMissingX.join(", ")
              : "No high-score clusters missing X"
          }
          accent={distribution.highScoreMissingX.length ? "#f59e0b" : "#22C55E"}
        />
      </div>

      <div style={{ marginTop: "32px" }}>
        <h3
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#555",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          Subscriber Source Breakdown
        </h3>
        <div style={{ border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
          {sourceBreakdown.length === 0 ? (
            <div style={{ padding: "24px", color: "#555", fontSize: "13px" }}>
              No subscriber source data yet.
            </div>
          ) : (
            sourceBreakdown.map((source, i) => (
              <div
                key={source.source}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 72px",
                  gap: "16px",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: i < sourceBreakdown.length - 1 ? "1px solid #1a1a1a" : "none",
                  background: i % 2 === 0 ? "#0f0f0f" : "#0b0b0b",
                }}
              >
                <span style={{ color: "#ccc", fontSize: "13px", fontFamily: "monospace" }}>
                  {source.source}
                </span>
                <div style={{ height: "6px", background: "#1a1a1a", borderRadius: "999px" }}>
                  <div
                    style={{
                      width: `${Math.max(2, Math.round(source.share * 100))}%`,
                      height: "100%",
                      background: "#22C55E",
                      borderRadius: "999px",
                    }}
                  />
                </div>
                <span style={{ color: "#787878", fontSize: "12px", textAlign: "right" }}>
                  {source.count} · {Math.round(source.share * 100)}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: "32px" }}>
        <h3
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#555",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          Questions This Data Should Answer
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {learningQuestions.map((question) => (
            <div
              key={question}
              style={{
                border: "1px solid #222",
                borderRadius: "8px",
                padding: "14px 16px",
                background: "#0f0f0f",
                color: "#aaa",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              {question}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Activity ──────────────────────────────────────────────────────

function ActivitySection({ activity }: { activity: ActivityEvent[] }) {
  function fmtTime(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <p
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#555",
          marginBottom: "16px",
        }}
      >
        Activity
      </p>

      <div
        style={{
          border: "1px solid #222",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {activity.length === 0 && (
          <div style={{ padding: "32px", textAlign: "center", color: "#555", fontSize: "13px" }}>
            No recent activity found.
          </div>
        )}
        {activity.map((event, i) => {
          const isCluster = event.type === "cluster";
          const time = isCluster ? event.published_at : event.created_at;

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "11px 16px",
                borderBottom: i < activity.length - 1 ? "1px solid #1a1a1a" : "none",
                background: i % 2 === 0 ? "#0f0f0f" : "#0b0b0b",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isCluster ? "#22C55E" : "#3b82f6",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                {isCluster ? (
                  <span style={{ fontSize: "13px" }}>
                    <span
                      style={{
                        color: "#22C55E",
                        fontFamily: "monospace",
                        fontWeight: 700,
                      }}
                    >
                      {event.ticker}
                    </span>
                    <span style={{ color: "#787878" }}> cluster published</span>
                    <span style={{ color: "#444", marginLeft: "8px", fontSize: "11px" }}>
                      score {event.score}
                    </span>
                  </span>
                ) : (
                  <span style={{ fontSize: "13px" }}>
                    <span style={{ color: "#93c5fd", fontFamily: "monospace" }}>
                      {event.email}
                    </span>
                    <span style={{ color: "#787878" }}> subscribed</span>
                  </span>
                )}
              </div>
              <span style={{ color: "#444", fontSize: "11px", flexShrink: 0 }}>{fmtTime(time)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Section: Checklist ─────────────────────────────────────────────────────

function ChecklistSection({ checklist }: { checklist: ChecklistItem[] }) {
  return (
    <div>
      <SectionHeader
        title="Checklist"
        sub="Binary pass/fail checks. Review whenever something feels off."
      />

      <Callout>
        These checks are computed from live Supabase data on each page load (no caching). A failing
        check is not always a crisis — use the detail text to decide what action is needed. Run
        through this list after any deployment or when a user reports missing data.
      </Callout>

      <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {checklist.map((item, i) => (
          <div
            key={i}
            style={{
              border: `1px solid ${item.pass ? "#1a3a22" : "#3a1a1a"}`,
              borderRadius: "8px",
              padding: "16px 20px",
              background: item.pass ? "#0a1910" : "#180a0a",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: item.pass ? "#22C55E" : "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#000",
                  flexShrink: 0,
                }}
              >
                {item.pass ? "✓" : "✗"}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: item.pass ? "#d1fae5" : "#fca5a5",
                  flex: 1,
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "4px",
                  background: item.pass ? "#14532d" : "#7f1d1d",
                  color: item.pass ? "#86efac" : "#fca5a5",
                }}
              >
                {item.pass ? "PASS" : "FAIL"}
              </span>
            </div>
            <p
              style={{
                color: "#787878",
                fontSize: "13px",
                marginLeft: "34px",
                lineHeight: "1.5",
              }}
            >
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Actions ────────────────────────────────────────────────────────

function ActionsSection() {
  const [isPending, startTransition] = useTransition();
  const [purgeResult, setPurgeResult] = useState<ActionResult | null>(null);
  const [emailResult, setEmailResult] = useState<ActionResult | null>(null);
  const [revalResult, setRevalResult] = useState<ActionResult | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [confirmPurge, setConfirmPurge] = useState(false);

  function handlePurge() {
    if (!confirmPurge) {
      setConfirmPurge(true);
      return;
    }
    setConfirmPurge(false);
    startTransition(async () => {
      const res = await purgeTestSubscribers();
      setPurgeResult(res);
    });
  }

  function handleSendEmail() {
    startTransition(async () => {
      const res = await sendTestWelcomeEmail(testEmail);
      setEmailResult(res);
    });
  }

  function handleRevalidate() {
    startTransition(async () => {
      const res = await revalidateAllTickerPages();
      setRevalResult(res);
    });
  }

  return (
    <div>
      <SectionHeader title="Actions" sub="Operator commands. Use these for maintenance and testing." />

      <Callout>
        All actions run as authenticated server actions — they use the Supabase service role key and
        only execute when you are logged in as admin. Actions are irreversible (purge especially).
        Read each description before clicking. Results are shown inline below each action.
      </Callout>

      <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Purge test subscribers */}
        <div
          style={{
            border: "1px solid #222",
            borderRadius: "8px",
            padding: "20px 24px",
            background: "#0f0f0f",
          }}
        >
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>
            Purge Test Subscribers
          </h3>
          <p
            style={{
              color: "#787878",
              fontSize: "13px",
              marginBottom: "14px",
              lineHeight: "1.5",
            }}
          >
            Deletes rows from{" "}
            <code style={{ color: "#aaa", fontSize: "12px" }}>email_subscribers</code> where the
            email contains: <em>test</em>, <em>example.com</em>, <em>mailinator</em>,{" "}
            <em>guerrillamail</em>, or <em>temp</em>. Irreversible — requires a second click to
            confirm.
          </p>
          <div
            style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}
          >
            <ActionButton
              variant={confirmPurge ? "danger" : "default"}
              onClick={handlePurge}
              disabled={isPending}
            >
              {confirmPurge ? "Click again to confirm purge" : "Purge test subscribers"}
            </ActionButton>
            {confirmPurge && (
              <button
                onClick={() => setConfirmPurge(false)}
                style={{
                  fontSize: "12px",
                  color: "#787878",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Cancel
              </button>
            )}
            <ResultBadge result={purgeResult} />
          </div>
        </div>

        {/* Send test welcome email */}
        <div
          style={{
            border: "1px solid #222",
            borderRadius: "8px",
            padding: "20px 24px",
            background: "#0f0f0f",
          }}
        >
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>
            Send Test Welcome Email
          </h3>
          <p
            style={{
              color: "#787878",
              fontSize: "13px",
              marginBottom: "14px",
              lineHeight: "1.5",
            }}
          >
            Sends a test welcome email via Resend from{" "}
            <code style={{ color: "#aaa", fontSize: "12px" }}>hey@clusterdesk.io</code>. Use this
            to verify the Resend integration is working and emails land in the inbox (not spam).
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="recipient@example.com"
              style={{
                background: "#161616",
                border: "1px solid #2a2a2a",
                borderRadius: "6px",
                padding: "7px 12px",
                color: "#fff",
                fontSize: "13px",
                width: "240px",
                outline: "none",
              }}
            />
            <ActionButton
              variant="primary"
              onClick={handleSendEmail}
              disabled={isPending || !testEmail.includes("@")}
            >
              {isPending ? "Sending…" : "Send test email"}
            </ActionButton>
            <ResultBadge result={emailResult} />
          </div>
        </div>

        {/* Revalidate ticker pages */}
        <div
          style={{
            border: "1px solid #222",
            borderRadius: "8px",
            padding: "20px 24px",
            background: "#0f0f0f",
          }}
        >
          <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>
            Revalidate All Ticker Pages
          </h3>
          <p
            style={{
              color: "#787878",
              fontSize: "13px",
              marginBottom: "14px",
              lineHeight: "1.5",
            }}
          >
            Triggers ISR revalidation for every{" "}
            <code style={{ color: "#aaa", fontSize: "12px" }}>/buys/[ticker]</code> page, plus{" "}
            <code style={{ color: "#aaa", fontSize: "12px" }}>/buys</code> and home. Run this after
            manually editing cluster data in Supabase or when pages appear stale.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ActionButton onClick={handleRevalidate} disabled={isPending}>
              {isPending ? "Revalidating…" : "Revalidate ticker pages"}
            </ActionButton>
            <ResultBadge result={revalResult} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Systems ────────────────────────────────────────────────────────

function SystemsSection() {
  return (
    <div>
      <SectionHeader title="Systems" sub="External services that power ClusterDesk." />

      <Callout>
        ClusterDesk is composed of 7 external services. Each is independent — an outage in one does
        not necessarily affect the others. When debugging, start with Railway logs (pipeline), then
        Supabase (data), then Vercel (web). Resend is checked last since email failures are often
        silent.
      </Callout>

      <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {SERVICES.map((svc) => (
          <a
            key={svc.href}
            href={svc.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              padding: "16px 20px",
              border: "1px solid #222",
              borderRadius: "8px",
              background: "#0f0f0f",
              textDecoration: "none",
              color: "inherit",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#444";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#222";
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#22C55E",
                marginTop: "5px",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#fff",
                  marginBottom: "4px",
                }}
              >
                {svc.label}{" "}
                <span style={{ color: "#444", fontSize: "12px" }}>↗</span>
              </p>
              <p style={{ color: "#787878", fontSize: "13px", lineHeight: "1.5" }}>
                {svc.desc}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────

export default function AdminControls(props: DashboardProProps) {
  const [active, setActive] = useState<NavSection>("Overview");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0A0A0A", color: "#fff" }}>
      {/* Left Sidebar */}
      <aside
        style={{
          width: "200px",
          flexShrink: 0,
          borderRight: "1px solid #1a1a1a",
          display: "flex",
          flexDirection: "column",
          background: "#080808",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1a1a1a" }}>
          <p
            style={{
              fontWeight: 800,
              fontSize: "15px",
              color: "#22C55E",
              letterSpacing: "-0.02em",
            }}
          >
            ClusterDesk
          </p>
          <p style={{ color: "#444", fontSize: "11px", marginTop: "2px" }}>Admin</p>
        </div>

        {/* Nav items */}
        <nav style={{ padding: "12px 0", flex: 1 }}>
          {NAV_ITEMS.map(({ id, symbol }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 20px",
                  background: isActive ? "#0f1f14" : "none",
                  border: "none",
                  borderLeft: isActive ? "2px solid #22C55E" : "2px solid transparent",
                  color: isActive ? "#22C55E" : "#787878",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ fontSize: "15px", minWidth: "18px" }}>{symbol}</span>
                {id}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #1a1a1a" }}>
          <a
            href="/admin/explore"
            style={{ color: "#333", fontSize: "11px", textDecoration: "none", display: "block" }}
          >
            Design gallery ↗
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: "auto", display: "flex" }}>
        {active === "Overview" ? (
          <>
            <div style={{ flex: 1, minWidth: 0, padding: "40px 48px" }}>
              <OverviewSection
                totalSubscribers={props.totalSubscribers}
                subsThisWeek={props.subsThisWeek}
                subsLastWeek={props.subsLastWeek}
                totalPublished={props.totalPublished}
                pendingClusters={props.pendingClusters}
                lastPublishedAt={props.lastPublishedAt}
                pipelineStatus={props.pipelineStatus}
                checklist={props.checklist}
                distribution={props.distribution}
              />
            </div>
            <div
              style={{
                width: "240px",
                flexShrink: 0,
                borderLeft: "1px solid #1a1a1a",
                padding: "40px 20px",
                overflowY: "auto",
                position: "sticky",
                top: 0,
                height: "100vh",
              }}
            >
              <ActivitySection activity={props.activity} />
            </div>
          </>
        ) : (
          <div style={{ maxWidth: "720px", padding: "40px 48px" }}>
            {active === "Growth" && (
              <GrowthSection
                sourceBreakdown={props.sourceBreakdown}
                growth={props.growth}
                distribution={props.distribution}
                learningQuestions={props.learningQuestions}
              />
            )}
            {active === "Checklist" && <ChecklistSection checklist={props.checklist} />}
            {active === "Actions" && <ActionsSection />}
            {active === "Systems" && <SystemsSection />}
          </div>
        )}
      </main>
    </div>
  );
}
