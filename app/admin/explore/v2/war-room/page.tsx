import Link from "next/link";
import { createAdminClient } from "@/lib/supabase-server";
import {
  PurgeTestSubscribers,
  SendTestWelcomeEmail,
  RevalidateAllTickerPages,
} from "./AdminControls";

export const revalidate = 0;

/* ─── Types ─── */

type StatusLevel = "NOMINAL" | "DEGRADED" | "DOWN";

type FeedEvent =
  | { kind: "publish"; timestamp: string; ticker: string; companyName: string; score: number }
  | { kind: "subscriber"; timestamp: string; email: string };

/* ─── Status helpers ─── */

const STATUS_COLOR: Record<StatusLevel, string> = {
  NOMINAL: "#22C55E",
  DEGRADED: "#F59E0B",
  DOWN:     "#EF4444",
};

const STATUS_GLOW: Record<StatusLevel, string> = {
  NOMINAL: "0 0 10px #22C55E99",
  DEGRADED: "0 0 10px #F59E0B99",
  DOWN:     "0 0 10px #EF444499",
};

const STATUS_BG: Record<StatusLevel, string> = {
  NOMINAL: "#052e16",
  DEGRADED: "#1c1002",
  DOWN:     "#1f0707",
};

const STATUS_BORDER: Record<StatusLevel, string> = {
  NOMINAL: "#16653480",
  DEGRADED: "#7849008f",
  DOWN:     "#7f1d1d80",
};

/* ─── Relative time ─── */

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

/* ─── Data fetching ─── */

async function getWarRoomData() {
  const db = createAdminClient();

  const now = Date.now();
  const sevenDaysAgo  = new Date(now - 7  * 24 * 60 * 60 * 1000).toISOString();
  const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [
    latestClusterRes,
    totalPublishedRes,
    totalSubsRes,
    weekSubsRes,
    prevWeekSubsRes,
    recentClustersRes,
    recentSubsRes,
  ] = await Promise.all([
    db.from("clusters")
      .select("ticker, score, published_at, payload")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    db.from("clusters")
      .select("*", { count: "exact", head: true })
      .not("published_at", "is", null),
    db.from("email_subscribers")
      .select("*", { count: "exact", head: true }),
    db.from("email_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    db.from("email_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", fourteenDaysAgo)
      .lt("created_at", sevenDaysAgo),
    db.from("clusters")
      .select("ticker, score, published_at, payload")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(20),
    db.from("email_subscribers")
      .select("email, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  /* Pipeline status */
  const latest = latestClusterRes.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const latestPayload = latest?.payload as any;
  let pipelineStatus: StatusLevel = "DOWN";
  let pipelineAgo = "No data";
  let pipelineTicker = "—";
  let pipelineHoursAgo = Infinity;

  if (latest?.published_at) {
    pipelineHoursAgo = (now - new Date(latest.published_at).getTime()) / 3_600_000;
    pipelineAgo = relTime(latest.published_at);
    pipelineTicker = latest.ticker as string;
    if (pipelineHoursAgo <= 24) pipelineStatus = "NOMINAL";
    else if (pipelineHoursAgo <= 72) pipelineStatus = "DEGRADED";
    else pipelineStatus = "DOWN";
  }

  /* Subscriber deltas */
  const totalSubs   = totalSubsRes.count   ?? 0;
  const weekSubs    = weekSubsRes.count    ?? 0;
  const prevWeekSubs = prevWeekSubsRes.count ?? 0;

  let subStatus: StatusLevel = "NOMINAL";
  if (totalSubs === 0) subStatus = "DOWN";
  else if (weekSubs === 0) subStatus = "DEGRADED";

  /* Activity feed — merge + sort */
  const events: FeedEvent[] = [];

  for (const row of recentClustersRes.data ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = row.payload as any;
    events.push({
      kind: "publish",
      timestamp: row.published_at as string,
      ticker: row.ticker as string,
      companyName: typeof p?.company_name === "string" ? p.company_name : row.ticker as string,
      score: typeof row.score === "number" ? row.score : Number(row.score ?? 0),
    });
  }
  for (const row of recentSubsRes.data ?? []) {
    events.push({
      kind: "subscriber",
      timestamp: row.created_at as string,
      email: row.email as string,
    });
  }
  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const feed = events.slice(0, 20);

  /* Operator checklist */
  const totalPublished = totalPublishedRes.count ?? 0;
  const resendConfigured = !!process.env.RESEND_API_KEY;

  const checks = [
    {
      label: "Pipeline ran within 24h",
      pass: pipelineStatus === "NOMINAL",
      detail: pipelineStatus === "NOMINAL"
        ? `Last: ${pipelineTicker} · ${pipelineAgo}`
        : `Last run: ${pipelineAgo} — check Railway logs`,
    },
    {
      label: "Subscribers growing",
      pass: weekSubs > 0,
      detail: weekSubs > 0
        ? `+${weekSubs} this week (${prevWeekSubs > 0 ? (weekSubs > prevWeekSubs ? `↑ vs ${prevWeekSubs} last week` : `↓ vs ${prevWeekSubs} last week`) : "first week with data"})`
        : `0 new this week — check signup form & landing page`,
    },
    {
      label: "Content live (≥1 published cluster)",
      pass: totalPublished > 0,
      detail: totalPublished > 0
        ? `${totalPublished} cluster${totalPublished !== 1 ? "s" : ""} published`
        : "No clusters published yet — run the Railway worker",
    },
    {
      label: "Resend API key set",
      pass: resendConfigured,
      detail: resendConfigured
        ? "RESEND_API_KEY found in env"
        : "RESEND_API_KEY missing — add to Vercel env vars",
    },
    {
      label: "X account linked to latest publish",
      pass: !!(latestClusterRes.data?.published_at),
      detail: latest?.published_at
        ? `@clusterdesk last posted ${pipelineAgo}`
        : "No posts yet — pipeline hasn't run",
    },
  ];

  /* Overall health */
  const allNominal =
    pipelineStatus === "NOMINAL" && subStatus === "NOMINAL" && checks.every((c) => c.pass);
  const anyDown =
    pipelineStatus === "DOWN" || subStatus === "DOWN" || checks.filter((c) => !c.pass).length >= 2;
  const overallStatus: StatusLevel = anyDown ? "DOWN" : allNominal ? "NOMINAL" : "DEGRADED";

  return {
    pipelineStatus, pipelineAgo, pipelineTicker, pipelineHoursAgo,
    totalSubs, weekSubs, prevWeekSubs, subStatus,
    totalPublished, latestPayload,
    feed, checks, overallStatus, resendConfigured,
  };
}

/* ─── Sub-components ─── */

function StatusDot({ status, size = 10 }: { status: StatusLevel; size?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: STATUS_COLOR[status],
        boxShadow: STATUS_GLOW[status],
        flexShrink: 0,
      }}
    />
  );
}

function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: 8,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontFamily: "monospace",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#787878",
      }}
    >
      {children}
    </span>
  );
}

/* ─── Page ─── */

export default async function AdminPage() {
  const {
    pipelineStatus, pipelineAgo, pipelineTicker,
    totalSubs, weekSubs, prevWeekSubs, subStatus,
    totalPublished,
    feed, checks, overallStatus,
  } = await getWarRoomData();

  const overallColor  = STATUS_COLOR[overallStatus];
  const overallGlow   = STATUS_GLOW[overallStatus];
  const overallBg     = STATUS_BG[overallStatus];
  const overallBorder = STATUS_BORDER[overallStatus];

  const weekDelta = weekSubs - prevWeekSubs;

  /* ── services list ── */
  const SERVICES = [
    {
      label: "Railway",
      href: "https://railway.app",
      desc: "Python worker cron — 8am CT weekdays. Check logs here if pipeline is DEGRADED/DOWN.",
    },
    {
      label: "Vercel",
      href: "https://vercel.com",
      desc: "Next.js web + ISR. Check deploy logs + function errors here.",
    },
    {
      label: "Supabase",
      href: "https://supabase.com",
      desc: "Postgres — clusters + email_subscribers tables. Query editor for ad-hoc inspection.",
    },
    {
      label: "Resend",
      href: "https://resend.com",
      desc: "Transactional email. Check delivery logs + bounce rate here.",
    },
    {
      label: "GitHub (web)",
      href: "https://github.com/mostlyerror/clusterdesk-web",
      desc: "clusterdesk-web repo — Next.js frontend.",
    },
    {
      label: "GitHub (worker)",
      href: "https://github.com/mostlyerror/clusterdesk-worker",
      desc: "clusterdesk-worker repo — Python SEC scraper + X publisher.",
    },
    {
      label: "X @clusterdesk",
      href: "https://x.com/clusterdesk",
      desc: "Public account. Verify latest post matches most recent cluster publish.",
    },
  ];

  return (
    <div
      style={{
        background: "#0A0A0A",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        padding: "16px 20px",
        boxSizing: "border-box",
      }}
    >
      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "monospace", fontSize: 13, color: "#555", letterSpacing: "0.05em" }}>
            CLUSTERDESK
          </span>
          <span style={{ color: "#333" }}>›</span>
          <span style={{ fontFamily: "monospace", fontSize: 13, color: "#787878", letterSpacing: "0.05em" }}>
            WAR ROOM
          </span>
        </div>
        <Link
          href="/admin/explore"
          style={{
            fontSize: 11,
            fontFamily: "monospace",
            color: "#555",
            textDecoration: "none",
            padding: "3px 8px",
            border: "1px solid #222",
            borderRadius: 4,
          }}
        >
          Design gallery →
        </Link>
      </div>

      {/* ── GLOBAL STATUS PILL ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: overallBg,
          border: `1px solid ${overallBorder}`,
          borderRadius: 8,
          padding: "12px 18px",
          marginBottom: 14,
        }}
      >
        <StatusDot status={overallStatus} size={14} />
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 15,
              fontWeight: 700,
              color: overallColor,
              textShadow: overallGlow,
              letterSpacing: "0.08em",
            }}
          >
            {overallStatus === "NOMINAL"
              ? "ALL SYSTEMS NOMINAL"
              : overallStatus === "DEGRADED"
              ? "ATTENTION REQUIRED — DEGRADED"
              : "ATTENTION REQUIRED — SYSTEM DOWN"}
          </span>
          <p style={{ fontSize: 11, color: "#787878", margin: "2px 0 0", lineHeight: 1.4 }}>
            {overallStatus === "NOMINAL"
              ? "Pipeline ran within 24h. Subscribers growing. All checks passing."
              : overallStatus === "DEGRADED"
              ? "One or more subsystems are degraded. Review the cards below."
              : "Critical issue detected. Check pipeline logs and database connectivity."}
          </p>
        </div>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#555" }}>
          {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} UTC
        </span>
      </div>

      {/* ── MAIN GRID ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 280px",
          gridTemplateRows: "auto auto auto",
          gap: 10,
          alignItems: "start",
        }}
      >
        {/* ── PIPELINE card ── */}
        <SectionCard>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <CardLabel>Pipeline</CardLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <StatusDot status={pipelineStatus} />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: STATUS_COLOR[pipelineStatus],
                  letterSpacing: "0.06em",
                }}
              >
                {pipelineStatus}
              </span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 22, fontWeight: 700, margin: 0, fontFamily: "monospace", color: STATUS_COLOR[pipelineStatus] }}>
              {pipelineAgo}
            </p>
            {pipelineTicker !== "—" && (
              <p style={{ fontSize: 11, color: "#787878", margin: "2px 0 0", fontFamily: "monospace" }}>
                last: {pipelineTicker}
              </p>
            )}
          </div>

          <p style={{ fontSize: 11, color: "#787878", margin: 0, lineHeight: 1.5 }}>
            Railway cron publishes a cluster to X every weekday at 8am CT.{" "}
            <strong style={{ color: "#555" }}>NOMINAL</strong> = ran within 24h.{" "}
            <strong style={{ color: "#555" }}>DEGRADED</strong> = 1–3 days.{" "}
            <strong style={{ color: "#555" }}>DOWN</strong> = 3+ days — open Railway logs.
          </p>

          <div
            style={{
              paddingTop: 8,
              borderTop: "1px solid #1e1e1e",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <RevalidateAllTickerPages />
          </div>
        </SectionCard>

        {/* ── SUBSCRIBERS card ── */}
        <SectionCard>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <CardLabel>Subscribers</CardLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <StatusDot status={subStatus} />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: STATUS_COLOR[subStatus],
                  letterSpacing: "0.06em",
                }}
              >
                {subStatus}
              </span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 22, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>
              {totalSubs.toLocaleString()}
            </p>
            <p style={{ fontSize: 11, color: "#787878", margin: "2px 0 0", fontFamily: "monospace" }}>
              {weekSubs > 0
                ? `+${weekSubs} this week${weekDelta > 0 ? ` (↑${weekDelta} vs prior)` : weekDelta < 0 ? ` (↓${Math.abs(weekDelta)} vs prior)` : ""}`
                : "0 new this week"}
            </p>
          </div>

          <p style={{ fontSize: 11, color: "#787878", margin: 0, lineHeight: 1.5 }}>
            Total email_subscribers. Week delta compares current 7-day window to the prior 7 days.{" "}
            <strong style={{ color: "#555" }}>DEGRADED</strong> = 0 new this week (check landing page + X).{" "}
            <strong style={{ color: "#555" }}>DOWN</strong> = no subscribers at all.
          </p>

          <div
            style={{
              paddingTop: 8,
              borderTop: "1px solid #1e1e1e",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <PurgeTestSubscribers />
          </div>
        </SectionCard>

        {/* ── EMAIL / WEB card ── */}
        <SectionCard>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <CardLabel>Email + Web</CardLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <StatusDot status="NOMINAL" />
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "#22C55E", letterSpacing: "0.06em" }}>
                LIVE
              </span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 22, fontWeight: 700, margin: 0, fontFamily: "monospace" }}>
              {totalPublished}
            </p>
            <p style={{ fontSize: 11, color: "#787878", margin: "2px 0 0", fontFamily: "monospace" }}>
              clusters published
            </p>
          </div>

          <p style={{ fontSize: 11, color: "#787878", margin: 0, lineHeight: 1.5 }}>
            Vercel serves the site. Resend handles welcome emails. No live telemetry — verify email delivery in{" "}
            <a href="https://resend.com" target="_blank" rel="noopener noreferrer" style={{ color: "#555" }}>
              Resend dashboard
            </a>
            .
          </p>

          <div
            style={{
              paddingTop: 8,
              borderTop: "1px solid #1e1e1e",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <SendTestWelcomeEmail />
          </div>
        </SectionCard>

        {/* ── ACTIVITY FEED (right column, spans all rows) ── */}
        <SectionCard
          style={{
            gridRow: "1 / 4",
            padding: "12px 14px",
            gap: 6,
            maxHeight: "calc(100vh - 160px)",
            overflowY: "auto",
          }}
        >
          <CardLabel>Activity feed — last 20 events</CardLabel>
          <p style={{ fontSize: 10, color: "#555", margin: "0 0 6px", lineHeight: 1.4 }}>
            Merged view of cluster publishes (green) and subscriber signups (blue). Most recent first.
          </p>

          {feed.length === 0 && (
            <p style={{ fontSize: 11, color: "#555", textAlign: "center", padding: "20px 0" }}>
              No events yet. Run the pipeline or sign up.
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {feed.map((ev, i) => {
              const isPub = ev.kind === "publish";
              const dotColor = isPub ? "#22C55E" : "#3B82F6";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    padding: "5px 6px",
                    borderRadius: 5,
                    background: "#0d0d0d",
                    border: "1px solid #1a1a1a",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: dotColor,
                      boxShadow: `0 0 5px ${dotColor}88`,
                      marginTop: 3,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {isPub ? (
                      <>
                        <p style={{ margin: 0, fontSize: 11, fontFamily: "monospace", color: "#22C55E", lineHeight: 1.3 }}>
                          {(ev as { ticker: string }).ticker}
                          <span style={{ color: "#555", fontWeight: 400 }}>
                            {" "}· {(ev as { score: number }).score} pts
                          </span>
                        </p>
                        <p style={{ margin: 0, fontSize: 10, color: "#555", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {(ev as { companyName: string }).companyName}
                        </p>
                      </>
                    ) : (
                      <p style={{ margin: 0, fontSize: 11, color: "#3B82F6", fontFamily: "monospace", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        +sub {(ev as { email: string }).email.replace(/(?<=.{3}).+(?=@)/, "…")}
                      </p>
                    )}
                    <p style={{ margin: 0, fontSize: 10, color: "#444", lineHeight: 1.2 }}>
                      {relTime(ev.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* ── OPERATOR CHECKLIST ── */}
        <SectionCard style={{ gridColumn: "1 / 4" }}>
          <CardLabel>Operator checklist — binary pass/fail. Fix any red items before calling it a day.</CardLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {checks.map((check) => (
              <div
                key={check.label}
                style={{
                  background: check.pass ? "#052e16" : "#1f0707",
                  border: `1px solid ${check.pass ? "#16653480" : "#7f1d1d80"}`,
                  borderRadius: 6,
                  padding: "8px 10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 13,
                      fontWeight: 700,
                      color: check.pass ? "#22C55E" : "#EF4444",
                      textShadow: check.pass ? "0 0 6px #22C55E88" : "0 0 6px #EF444488",
                    }}
                  >
                    {check.pass ? "PASS" : "FAIL"}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: "#ccc", fontWeight: 600, lineHeight: 1.4, marginBottom: 3 }}>
                  {check.label}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: "#787878", lineHeight: 1.4 }}>
                  {check.detail}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── EXTERNAL SERVICES ── */}
        <SectionCard style={{ gridColumn: "1 / 4" }}>
          <CardLabel>External services — click to open. Bookmarks for when something breaks.</CardLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {SERVICES.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  background: "#0d0d0d",
                  border: "1px solid #1e1e1e",
                  borderRadius: 6,
                  padding: "8px 10px",
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#444"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1e1e1e"; }}
              >
                <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 600, color: "#fff" }}>
                  {s.label} ↗
                </p>
                <p style={{ margin: 0, fontSize: 10, color: "#787878", lineHeight: 1.4 }}>
                  {s.desc}
                </p>
              </a>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
