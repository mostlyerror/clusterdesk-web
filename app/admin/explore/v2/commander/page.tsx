import { createAdminClient } from "@/lib/supabase-server";
import { PurgeTestSubscribersButton, SendTestEmailForm, RevalidateButton } from "./AdminControls";

export const revalidate = 0;

// ─── Types ────────────────────────────────────────────────────────────────────

type ClusterRow = {
  id: string;
  ticker: string;
  score: number;
  published_at: string | null;
  twitter_post_id: string | null;
  payload: {
    company_name?: string;
    insider_count?: number;
    total_value_usd?: number;
  } | null;
};

type SubscriberRow = {
  id: string;
  email: string;
  signup_source: string | null;
  created_at: string;
};

type ActivityEvent =
  | { kind: "cluster"; ts: string; ticker: string; company: string; score: number; post_id: string | null }
  | { kind: "subscriber"; ts: string; email: string; source: string | null };

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getDashboardData() {
  const db = createAdminClient();

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [allSubsRes, newSubsRes, prevSubsRes, recentClustersRes, recentSubsRes] = await Promise.all([
    db.from("email_subscribers").select("*", { count: "exact", head: true }),
    db
      .from("email_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", oneWeekAgo.toISOString()),
    db
      .from("email_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", twoWeeksAgo.toISOString())
      .lt("created_at", oneWeekAgo.toISOString()),
    db
      .from("clusters")
      .select("id,ticker,score,published_at,twitter_post_id,payload")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(30),
    db
      .from("email_subscribers")
      .select("id,email,signup_source,created_at")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const totalSubs = allSubsRes.count ?? 0;
  const newThisWeek = newSubsRes.count ?? 0;
  const newLastWeek = prevSubsRes.count ?? 0;

  const clusters: ClusterRow[] = (recentClustersRes.data ?? []) as ClusterRow[];
  const subscribers: SubscriberRow[] = (recentSubsRes.data ?? []) as SubscriberRow[];

  // Build mixed activity feed sorted newest-first
  const events: ActivityEvent[] = [
    ...clusters.map(
      (c): ActivityEvent => ({
        kind: "cluster",
        ts: c.published_at!,
        ticker: c.ticker,
        company: c.payload?.company_name ?? c.ticker,
        score: c.score,
        post_id: c.twitter_post_id,
      })
    ),
    ...subscribers.map(
      (s): ActivityEvent => ({
        kind: "subscriber",
        ts: s.created_at,
        email: s.email,
        source: s.signup_source,
      })
    ),
  ]
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, 30);

  const lastPublished = clusters[0]?.published_at ?? null;
  const hoursSincePublished = lastPublished
    ? (now.getTime() - new Date(lastPublished).getTime()) / (1000 * 60 * 60)
    : Infinity;

  const pipelineStatus: "NOMINAL" | "DEGRADED" | "DOWN" =
    hoursSincePublished <= 24
      ? "NOMINAL"
      : hoursSincePublished <= 72
      ? "DEGRADED"
      : "DOWN";

  // Operator checklist
  const checks = [
    {
      label: "Pipeline ran in last 24h",
      pass: pipelineStatus === "NOMINAL",
      note: pipelineStatus === "NOMINAL"
        ? "Last publish was within 24h."
        : `Last publish was ${hoursSincePublished === Infinity ? "never" : `${Math.round(hoursSincePublished)}h ago`}. Check Railway logs.`,
    },
    {
      label: "Subscribers growing (this week vs last)",
      pass: newThisWeek >= newLastWeek,
      note:
        newThisWeek >= newLastWeek
          ? `${newThisWeek} this week vs ${newLastWeek} last week.`
          : `${newThisWeek} this week vs ${newLastWeek} last week — growth stalled. Check landing page + X posts.`,
    },
    {
      label: "Content live on X",
      pass: clusters.length > 0 && !!clusters[0]?.twitter_post_id,
      note:
        clusters.length > 0 && clusters[0]?.twitter_post_id
          ? "Most recent cluster has an X post ID."
          : "Most recent cluster has no X post ID. Check Railway DRY_RUN env var — set to 'false' to enable live posting.",
    },
    {
      label: "Email configured (RESEND_API_KEY set)",
      pass: !!process.env.RESEND_API_KEY,
      note: process.env.RESEND_API_KEY
        ? "RESEND_API_KEY is present in environment."
        : "RESEND_API_KEY is not set. Welcome emails will fail. Add it in Vercel env vars.",
    },
    {
      label: "Supabase reachable",
      pass: allSubsRes.count !== null,
      note:
        allSubsRes.count !== null
          ? "Supabase query returned successfully."
          : "Supabase query failed. Check SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL.",
    },
  ];

  const overallStatus: "NOMINAL" | "DEGRADED" | "DOWN" =
    checks.every((c) => c.pass)
      ? "NOMINAL"
      : pipelineStatus === "DOWN"
      ? "DOWN"
      : "DEGRADED";

  return {
    totalSubs,
    newThisWeek,
    newLastWeek,
    lastPublished,
    pipelineStatus,
    overallStatus,
    hoursSincePublished,
    events,
    checks,
    clusters,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(ts: string): string {
  const diffMs = Date.now() - new Date(ts).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function fmtDateTime(ts: string): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function fmtUsd(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const STATUS_COLORS = {
  NOMINAL: "#22C55E",
  DEGRADED: "#F59E0B",
  DOWN: "#EF4444",
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ status }: { status: "NOMINAL" | "DEGRADED" | "DOWN" }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 10px",
        borderRadius: "9999px",
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        fontFamily: "monospace",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}`,
          flexShrink: 0,
        }}
      />
      {status}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        color: "#555",
        textTransform: "uppercase",
        marginBottom: "10px",
        fontFamily: "monospace",
      }}
    >
      {children}
    </p>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#0f0f0f",
        border: "1px solid #1e1e1e",
        borderRadius: "6px",
        padding: "16px",
        marginBottom: "12px",
      }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "#1a1a1a", margin: "16px 0" }} />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminCommanderPage() {
  const {
    totalSubs,
    newThisWeek,
    newLastWeek,
    lastPublished,
    pipelineStatus,
    overallStatus,
    hoursSincePublished,
    events,
    checks,
    clusters,
  } = await getDashboardData();

  const PANE_HEIGHT = "calc(100vh - 48px)";

  const EXTERNAL_SERVICES = [
    {
      label: "Railway",
      href: "https://railway.app",
      desc: "Python worker cron",
      detail: "Runs daily at 8am CT weekdays. Check logs here if pipeline is DOWN or DEGRADED.",
    },
    {
      label: "Vercel",
      href: "https://vercel.com",
      desc: "Next.js web + ISR",
      detail: "Deploys this dashboard. Check function logs if pages aren't updating.",
    },
    {
      label: "Supabase",
      href: "https://supabase.com",
      desc: "Postgres DB",
      detail: "Stores clusters + email_subscribers tables. Query directly here to debug data issues.",
    },
    {
      label: "Resend",
      href: "https://resend.com",
      desc: "Transactional email",
      detail: "Sends welcome emails. Check delivery logs here if subscribers aren't receiving emails.",
    },
    {
      label: "GitHub (web)",
      href: "https://github.com/mostlyerror/clusterdesk-web",
      desc: "clusterdesk-web",
      detail: "Next.js frontend source. Deploy via Vercel git integration.",
    },
    {
      label: "GitHub (worker)",
      href: "https://github.com/mostlyerror/clusterdesk-worker",
      desc: "clusterdesk-worker",
      detail: "Python scraper + scorer + publisher. Deployed on Railway.",
    },
    {
      label: "X @clusterdesk",
      href: "https://x.com/clusterdesk",
      desc: "Public feed",
      detail: "Live Twitter account. Verify posts are appearing after pipeline runs.",
    },
  ];

  return (
    <>
    <style>{`.svc-link:hover { border-color: #333 !important; }`}</style>
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0A0A0A",
        color: "#FFFFFF",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── Sticky top bar ── */}
      <header
        style={{
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          background: "#0A0A0A",
          borderBottom: "1px solid #1a1a1a",
          position: "sticky",
          top: 0,
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "13px",
              fontWeight: 700,
              color: "#22C55E",
              letterSpacing: "0.04em",
            }}
          >
            CLUSTERDESK
          </span>
          <span style={{ color: "#333", fontSize: "13px" }}>/</span>
          <span style={{ color: "#787878", fontSize: "13px", fontFamily: "monospace" }}>ADMIN</span>
        </div>
        <StatusPill status={overallStatus} />
      </header>

      {/* ── Two-pane body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ══ LEFT PANE ══ */}
        <div
          style={{
            width: "55%",
            height: PANE_HEIGHT,
            overflowY: "auto",
            padding: "20px",
            flexShrink: 0,
          }}
        >
          {/* ── Pipeline status card ── */}
          <SectionLabel>01 / Pipeline</SectionLabel>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <p style={{ fontSize: "11px", color: "#555", marginBottom: "4px", fontFamily: "monospace" }}>
                  LAST PUBLISH
                </p>
                <p style={{ fontSize: "22px", fontWeight: 700, fontFamily: "monospace", color: "#fff" }}>
                  {lastPublished
                    ? hoursSincePublished < 24
                      ? `${Math.round(hoursSincePublished)}h ago`
                      : `${Math.floor(hoursSincePublished / 24)}d ago`
                    : "Never"}
                </p>
                {lastPublished && (
                  <p style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
                    {fmtDateTime(lastPublished)}
                    {clusters[0]?.ticker && (
                      <span style={{ color: "#22C55E", marginLeft: "8px" }}>{clusters[0].ticker}</span>
                    )}
                  </p>
                )}
              </div>
              <StatusPill status={pipelineStatus} />
            </div>

            <div
              style={{
                background: "#0A0A0A",
                border: "1px solid #1e1e1e",
                borderRadius: "4px",
                padding: "10px 12px",
                fontSize: "11px",
                lineHeight: "1.6",
                color: "#787878",
              }}
            >
              <span style={{ color: "#22C55E", fontWeight: 700, fontFamily: "monospace" }}>PIPELINE: </span>
              Railway cron runs daily at 8am CT weekdays. Scrapes OpenInsider, filters micro-cap clusters
              (≥2 insiders, 5-day window, ≥$100K), scores 0–100, publishes to X + Supabase.{" "}
              <span style={{ color: "#22C55E" }}>NOMINAL</span> = ran within 24h.{" "}
              <span style={{ color: "#F59E0B" }}>DEGRADED</span> = 1–3 days.{" "}
              <span style={{ color: "#EF4444" }}>DOWN</span> = 3+ days — check Railway logs or{" "}
              <code style={{ background: "#1a1a1a", padding: "1px 4px", borderRadius: "3px", fontSize: "10px" }}>DRY_RUN</code>{" "}
              env var.
            </div>
          </Card>

          {/* ── Subscriber status card ── */}
          <SectionLabel>02 / Subscribers</SectionLabel>
          <Card>
            <div style={{ display: "flex", gap: "24px", marginBottom: "12px", alignItems: "flex-end" }}>
              <div>
                <p style={{ fontSize: "11px", color: "#555", marginBottom: "4px", fontFamily: "monospace" }}>TOTAL</p>
                <p style={{ fontSize: "28px", fontWeight: 700, fontFamily: "monospace" }}>{totalSubs}</p>
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "#555", marginBottom: "4px", fontFamily: "monospace" }}>THIS WEEK</p>
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: newThisWeek >= newLastWeek ? "#22C55E" : "#F59E0B",
                  }}
                >
                  +{newThisWeek}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "11px", color: "#555", marginBottom: "4px", fontFamily: "monospace" }}>LAST WEEK</p>
                <p style={{ fontSize: "22px", fontWeight: 700, fontFamily: "monospace", color: "#787878" }}>
                  +{newLastWeek}
                </p>
              </div>
              {newThisWeek > newLastWeek && (
                <div
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    fontSize: "11px",
                    color: "#22C55E",
                    fontFamily: "monospace",
                    marginBottom: "4px",
                  }}
                >
                  +{newThisWeek - newLastWeek} WoW
                </div>
              )}
            </div>
            <p style={{ fontSize: "11px", color: "#555", lineHeight: "1.6" }}>
              Week-over-week delta shows growth health. If{" "}
              <span style={{ color: "#F59E0B" }}>this week &lt; last week</span>, check X post engagement and
              landing page conversion. Purge test emails below before trusting counts.
            </p>
            <Divider />
            <p style={{ fontSize: "11px", color: "#787878", marginBottom: "8px" }}>Remove fake/test entries before trusting subscriber counts.</p>
            <PurgeTestSubscribersButton />
          </Card>

          {/* ── Email config card ── */}
          <SectionLabel>03 / Email (Resend)</SectionLabel>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600 }}>Welcome email delivery</p>
                <p style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>
                  from: hey@clusterdesk.io via Resend
                </p>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: process.env.RESEND_API_KEY ? "#22C55E" : "#EF4444",
                  background: process.env.RESEND_API_KEY ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${process.env.RESEND_API_KEY ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                  padding: "3px 8px",
                  borderRadius: "4px",
                }}
              >
                {process.env.RESEND_API_KEY ? "API KEY SET" : "API KEY MISSING"}
              </span>
            </div>
            <p style={{ fontSize: "11px", color: "#555", lineHeight: "1.6", marginBottom: "12px" }}>
              Sends a welcome email to new subscribers. If{" "}
              <code style={{ background: "#1a1a1a", padding: "1px 4px", borderRadius: "3px" }}>RESEND_API_KEY</code>{" "}
              is missing, add it in Vercel project settings. Check Resend dashboard for delivery
              failures or bounce rates.
            </p>
            <SendTestEmailForm />
          </Card>

          {/* ── Operator checklist ── */}
          <SectionLabel>04 / Operator Checklist</SectionLabel>
          <Card>
            <p style={{ fontSize: "11px", color: "#555", marginBottom: "14px", lineHeight: "1.6" }}>
              Binary pass/fail health checks. All should be green on a healthy weekday morning after 8am CT.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {checks.map((check, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "4px",
                    background: check.pass ? "rgba(34,197,94,0.04)" : "rgba(239,68,68,0.04)",
                    border: `1px solid ${check.pass ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.15)"}`,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: check.pass ? "#22C55E" : "#EF4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "9px",
                      color: "#000",
                      fontWeight: 900,
                      marginTop: "1px",
                    }}
                  >
                    {check.pass ? "✓" : "✗"}
                  </span>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: check.pass ? "#fff" : "#ccc" }}>
                      {check.label}
                    </p>
                    <p style={{ fontSize: "11px", color: "#555", marginTop: "2px", lineHeight: "1.5" }}>
                      {check.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Revalidate ── */}
          <SectionLabel>05 / Cache</SectionLabel>
          <Card>
            <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>ISR cache revalidation</p>
            <p style={{ fontSize: "11px", color: "#555", lineHeight: "1.6", marginBottom: "12px" }}>
              Ticker pages are statically generated and cached by Vercel ISR. After a new cluster publish,
              pages update automatically — but if you see stale data, force-revalidate here. This calls
              Next.js <code style={{ background: "#1a1a1a", padding: "1px 4px", borderRadius: "3px" }}>revalidatePath</code>{" "}
              for every published ticker.
            </p>
            <RevalidateButton />
          </Card>

          {/* ── External services ── */}
          <SectionLabel>06 / External Services</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
            {EXTERNAL_SERVICES.map((svc) => (
              <a
                key={svc.href}
                href={svc.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "10px 14px",
                  borderRadius: "4px",
                  background: "#0f0f0f",
                  border: "1px solid #1e1e1e",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color 0.15s",
                  gap: "12px",
                }}
                className="svc-link"
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#22C55E" }}>{svc.label}</span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#555",
                        background: "#1a1a1a",
                        padding: "1px 6px",
                        borderRadius: "3px",
                        fontFamily: "monospace",
                      }}
                    >
                      {svc.desc}
                    </span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#555", lineHeight: "1.5" }}>{svc.detail}</p>
                </div>
                <span style={{ color: "#333", fontSize: "12px", flexShrink: 0 }}>↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* ══ RIGHT PANE ══ */}
        <div
          style={{
            width: "45%",
            height: PANE_HEIGHT,
            overflowY: "auto",
            borderLeft: "1px solid #1a1a1a",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sticky feed header */}
          <div
            style={{
              padding: "14px 20px 12px",
              borderBottom: "1px solid #1a1a1a",
              position: "sticky",
              top: 0,
              background: "#0A0A0A",
              zIndex: 5,
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#555",
                    textTransform: "uppercase",
                    fontFamily: "monospace",
                    marginBottom: "2px",
                  }}
                >
                  Live Activity
                </p>
                <p style={{ fontSize: "11px", color: "#555" }}>
                  Last 30 events — cluster publishes + subscriber signups
                </p>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  color: "#555",
                  background: "#111",
                  border: "1px solid #222",
                  padding: "3px 8px",
                  borderRadius: "4px",
                }}
              >
                {events.length} events
              </span>
            </div>
          </div>

          {/* Feed */}
          <div style={{ flex: 1, padding: "0" }}>
            {events.length === 0 && (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#555",
                  fontSize: "12px",
                }}
              >
                No activity yet.
              </div>
            )}
            {events.map((ev, i) => {
              const isCluster = ev.kind === "cluster";
              const accentColor = isCluster ? "#22C55E" : "#3B82F6";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px 20px",
                    borderBottom: "1px solid #111",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Dot + line */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      paddingTop: "4px",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: accentColor,
                        boxShadow: i === 0 ? `0 0 8px ${accentColor}` : "none",
                        flexShrink: 0,
                      }}
                    />
                    {i < events.length - 1 && (
                      <span
                        style={{
                          width: "1px",
                          flex: 1,
                          minHeight: "20px",
                          background: "#1a1a1a",
                          marginTop: "4px",
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {isCluster && ev.kind === "cluster" ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              color: "#22C55E",
                              background: "rgba(34,197,94,0.08)",
                              border: "1px solid rgba(34,197,94,0.15)",
                              padding: "1px 6px",
                              borderRadius: "3px",
                              fontFamily: "monospace",
                            }}
                          >
                            CLUSTER
                          </span>
                          <a
                            href={`/buys/${ev.ticker}`}
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "#fff",
                              textDecoration: "none",
                              fontFamily: "monospace",
                            }}
                          >
                            {ev.ticker}
                          </a>
                          <span style={{ fontSize: "12px", color: "#787878", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
                            {ev.company}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: "monospace",
                              color: "#22C55E",
                              background: "#111",
                              border: "1px solid #1e1e1e",
                              padding: "1px 6px",
                              borderRadius: "3px",
                            }}
                          >
                            score {ev.score}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "11px", color: "#444" }}>{timeAgo(ev.ts)}</span>
                          <span style={{ color: "#2a2a2a" }}>·</span>
                          <span style={{ fontSize: "11px", color: "#333" }}>{fmtDateTime(ev.ts)}</span>
                          {ev.post_id && (
                            <>
                              <span style={{ color: "#2a2a2a" }}>·</span>
                              <a
                                href={`https://x.com/clusterdesk/status/${ev.post_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: "11px", color: "#555", textDecoration: "none" }}
                              >
                                X post ↗
                              </a>
                            </>
                          )}
                        </div>
                      </>
                    ) : ev.kind === "subscriber" ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              color: "#3B82F6",
                              background: "rgba(59,130,246,0.08)",
                              border: "1px solid rgba(59,130,246,0.15)",
                              padding: "1px 6px",
                              borderRadius: "3px",
                              fontFamily: "monospace",
                            }}
                          >
                            SUBSCRIBER
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#ccc",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "200px",
                              fontFamily: "monospace",
                            }}
                          >
                            {ev.email.replace(/(.{2}).*(@.*)/, "$1***$2")}
                          </span>
                          {ev.source && (
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#555",
                                background: "#111",
                                border: "1px solid #1e1e1e",
                                padding: "1px 6px",
                                borderRadius: "3px",
                              }}
                            >
                              via {ev.source}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "11px", color: "#444" }}>{timeAgo(ev.ts)}</span>
                          <span style={{ color: "#2a2a2a" }}>·</span>
                          <span style={{ fontSize: "11px", color: "#333" }}>{fmtDateTime(ev.ts)}</span>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
