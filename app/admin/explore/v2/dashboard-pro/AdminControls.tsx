"use client";

import { useState, useTransition } from "react";
import {
  purgeTestSubscribers,
  sendTestWelcomeEmail,
  revalidateAllTickerPages,
  type ActionResult,
} from "./actions";

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
  lastPublishedAt: string | null;
  pipelineStatus: "NOMINAL" | "DEGRADED" | "DOWN" | "UNKNOWN";
  activity: ActivityEvent[];
  checklist: ChecklistItem[];
}

// ─── Nav config ─────────────────────────────────────────────────────────────

type NavSection = "Overview" | "Activity" | "Checklist" | "Actions" | "Systems";

const NAV_ITEMS: { id: NavSection; symbol: string }[] = [
  { id: "Overview", symbol: "◉" },
  { id: "Activity", symbol: "≡" },
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

// ─── Shared UI primitives ────────────────────────────────────────────────────

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderLeft: "3px solid #22C55E",
        background: "#0f1a14",
        padding: "12px 16px",
        borderRadius: "0 6px 6px 0",
        color: "#787878",
        fontSize: "13px",
        fontStyle: "italic",
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
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #222",
        borderRadius: "8px",
        padding: "20px 24px",
        background: "#0f0f0f",
      }}
    >
      <p
        style={{
          color: "#787878",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "8px",
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: "28px", fontWeight: 700, color: accent ?? "#fff", lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ color: "#555", fontSize: "12px", marginTop: "6px" }}>{sub}</p>
      )}
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: sub ? "4px" : 0 }}>{title}</h2>
      {sub && <p style={{ color: "#787878", fontSize: "14px" }}>{sub}</p>}
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
  const bg = variant === "danger" ? "#2a0f0f" : variant === "primary" ? "#0f2a1a" : "#161616";
  const border = variant === "danger" ? "#5a1a1a" : variant === "primary" ? "#1a4a2a" : "#2a2a2a";
  const color = variant === "danger" ? "#f87171" : variant === "primary" ? "#22C55E" : "#ccc";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color: disabled ? "#444" : color,
        padding: "8px 18px",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 0.15s",
        whiteSpace: "nowrap",
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
        color: result.ok ? "#22C55E" : "#f87171",
        padding: "4px 10px",
        background: result.ok ? "#0a1f12" : "#1f0a0a",
        border: `1px solid ${result.ok ? "#1a3a22" : "#3a1a1a"}`,
        borderRadius: "4px",
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
  lastPublishedAt,
  pipelineStatus,
  checklist,
}: Pick<
  DashboardProProps,
  | "totalSubscribers"
  | "subsThisWeek"
  | "subsLastWeek"
  | "totalPublished"
  | "lastPublishedAt"
  | "pipelineStatus"
  | "checklist"
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
        <StatCard label="Clusters published" value={totalPublished} />
        <StatCard
          label="Pipeline status"
          value={pipelineStatus}
          sub={lastPubLabel}
          accent={statusColor}
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
      <SectionHeader
        title="Activity"
        sub="Last 30 events — cluster publishes and subscriber signups, newest first."
      />

      <Callout>
        This feed combines cluster publish events and email subscriber signups into a single
        chronological timeline. A healthy system shows a steady mix of both. Green dots are cluster
        publishes; blue dots are new subscribers. No events in the last 24h could indicate a
        pipeline or marketing problem.
      </Callout>

      <div
        style={{
          marginTop: "28px",
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
          <p style={{ color: "#2a2a2a", fontSize: "11px" }}>v2 · Dashboard Pro</p>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: "720px", padding: "40px 48px" }}>
          {active === "Overview" && (
            <OverviewSection
              totalSubscribers={props.totalSubscribers}
              subsThisWeek={props.subsThisWeek}
              subsLastWeek={props.subsLastWeek}
              totalPublished={props.totalPublished}
              lastPublishedAt={props.lastPublishedAt}
              pipelineStatus={props.pipelineStatus}
              checklist={props.checklist}
            />
          )}
          {active === "Activity" && <ActivitySection activity={props.activity} />}
          {active === "Checklist" && <ChecklistSection checklist={props.checklist} />}
          {active === "Actions" && <ActionsSection />}
          {active === "Systems" && <SystemsSection />}
        </div>
      </main>
    </div>
  );
}
