import Link from "next/link";
import { createAdminClient } from "@/lib/supabase-server";
import AdminControls from "./AdminControls";

export const revalidate = 0;

// ── External service links ────────────────────────────────────────────────────

const SERVICES = [
  {
    label: "Railway",
    desc: "Python worker cron — 8am CT weekdays. Check here first if pipeline goes DOWN.",
    href: "https://railway.app",
    icon: "🚂",
  },
  {
    label: "Vercel",
    desc: "Next.js web + ISR. Deploys, function logs, edge config.",
    href: "https://vercel.com",
    icon: "▲",
  },
  {
    label: "Supabase",
    desc: "Postgres database. Run queries, inspect tables, manage RLS.",
    href: "https://supabase.com",
    icon: "🗄",
  },
  {
    label: "Resend",
    desc: "Transactional email. Check delivery logs if welcome emails stop arriving.",
    href: "https://resend.com",
    icon: "✉",
  },
  {
    label: "GitHub (web)",
    desc: "clusterdesk-web — this Next.js repo.",
    href: "https://github.com/mostlyerror/clusterdesk-web",
    icon: "⬡",
  },
  {
    label: "GitHub (worker)",
    desc: "clusterdesk-worker — the Python scraper/scorer.",
    href: "https://github.com/mostlyerror/clusterdesk-worker",
    icon: "⬡",
  },
  {
    label: "X @clusterdesk",
    desc: "The public account. Clusters auto-post here after publish.",
    href: "https://x.com/clusterdesk",
    icon: "𝕏",
  },
];

// ── Data fetching ─────────────────────────────────────────────────────────────

type ClusterRow = {
  id: string;
  ticker: string;
  score: number;
  published_at: string;
  twitter_post_id: string | null;
  payload: {
    company_name?: string;
    insider_count?: number;
    total_value_usd?: number;
  };
};

type SubscriberRow = {
  id: string;
  email: string;
  signup_source: string | null;
  created_at: string;
};

async function getAdminData() {
  const db = createAdminClient();

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    allSubsRes,
    thisWeekSubsRes,
    lastWeekSubsRes,
    totalClustersRes,
    recentClustersRes,
    recentSubsRes,
  ] = await Promise.all([
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
      .select("*", { count: "exact", head: true })
      .not("published_at", "is", null),
    db
      .from("clusters")
      .select("id,ticker,score,published_at,twitter_post_id,payload")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(20),
    db
      .from("email_subscribers")
      .select("id,email,signup_source,created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    subscriberCount: allSubsRes.count ?? 0,
    thisWeekSubs: thisWeekSubsRes.count ?? 0,
    lastWeekSubs: lastWeekSubsRes.count ?? 0,
    totalPublished: totalClustersRes.count ?? 0,
    recentClusters: (recentClustersRes.data ?? []) as ClusterRow[],
    recentSubs: (recentSubsRes.data ?? []) as SubscriberRow[],
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hoursAgo(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60);
}

function formatRelativeTime(dateStr: string): string {
  const h = hoursAgo(dateStr);
  if (h < 1) return "just now";
  if (h < 24) return `${Math.floor(h)}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

type PipelineStatus = "NOMINAL" | "DEGRADED" | "DOWN";

function getPipelineStatus(lastPublishedAt: string | null): {
  status: PipelineStatus;
  color: string;
  dot: string;
  headline: string;
  detail: string;
} {
  if (!lastPublishedAt) {
    return {
      status: "DOWN",
      color: "#EF4444",
      dot: "#EF4444",
      headline: "No clusters published yet.",
      detail:
        "The Railway cron runs daily at 8am CT on weekdays. Nothing has been published. Check Railway logs and make sure the worker ran.",
    };
  }

  const h = hoursAgo(lastPublishedAt);
  const ago = formatRelativeTime(lastPublishedAt);

  if (h < 24) {
    return {
      status: "NOMINAL",
      color: "#22C55E",
      dot: "#22C55E",
      headline: `Pipeline ran ${ago} — you're good.`,
      detail:
        "NOMINAL means a cluster was published within the last 24 hours. The Railway cron runs at 8am CT on weekdays — if today is a weekday you should see something by 9am.",
    };
  }

  if (h < 72) {
    return {
      status: "DEGRADED",
      color: "#F59E0B",
      dot: "#F59E0B",
      headline: `Last cluster was ${ago}. Could be a weekend, could be drift.`,
      detail:
        "DEGRADED means it's been 1–3 days. This is normal over weekends. If it's a weekday, check Railway logs — the cron may have failed silently or found no qualifying clusters.",
    };
  }

  return {
    status: "DOWN",
    color: "#EF4444",
    dot: "#EF4444",
    headline: `Pipeline hasn't run in ${ago}. Something needs your attention.`,
    detail:
      "DOWN means 3+ days with no publish. Check Railway logs immediately — the cron may have crashed, lost env vars, or hit an API rate limit. The worker repo is at GitHub (worker) below.",
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  const {
    subscriberCount,
    thisWeekSubs,
    lastWeekSubs,
    totalPublished,
    recentClusters,
    recentSubs,
  } = await getAdminData();

  const lastPublished = recentClusters[0]?.published_at ?? null;
  const pipeline = getPipelineStatus(lastPublished);

  const subDelta = thisWeekSubs - lastWeekSubs;
  const subDeltaSign = subDelta >= 0 ? "+" : "";

  // Build operator checklist
  const checks: Array<{ pass: boolean; label: string; detail: string }> = [
    {
      pass: pipeline.status === "NOMINAL",
      label:
        pipeline.status === "NOMINAL"
          ? `Pipeline ran ${formatRelativeTime(lastPublished!)} — you're good.`
          : pipeline.headline,
      detail: pipeline.detail,
    },
    {
      pass: subscriberCount > 0,
      label:
        subscriberCount > 0
          ? `${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"} — list is live.`
          : "No subscribers yet — the email list is empty.",
      detail:
        subscriberCount > 0
          ? "Your email list has real people on it. They signed up voluntarily."
          : "No one has signed up yet. Make sure the signup form is live on the landing page.",
    },
    {
      pass: thisWeekSubs > 0,
      label:
        thisWeekSubs > 0
          ? `${thisWeekSubs} new subscriber${thisWeekSubs === 1 ? "" : "s"} this week${subDelta !== 0 ? ` (${subDeltaSign}${subDelta} vs last week)` : ""}.`
          : "No new subscribers this week — growth has stalled.",
      detail:
        thisWeekSubs > 0
          ? "People are still finding you. Keep posting on X — that's the primary acquisition channel right now."
          : "Zero new signups this week. Try posting a cluster thread on X or mentioning ClusterDesk in a comment.",
    },
    {
      pass: (recentClusters[0]?.twitter_post_id ?? null) !== null,
      label:
        recentClusters[0]?.twitter_post_id
          ? `Last cluster posted to X — ${recentClusters[0].ticker} is live.`
          : "Last cluster has no X post ID — social distribution may be broken.",
      detail:
        recentClusters[0]?.twitter_post_id
          ? "The worker successfully posted to X after publishing. The Twitter API integration is working."
          : "The most recent cluster was published but twitter_post_id is null. Check if the worker's X API credentials are still valid — they expire occasionally.",
    },
    {
      pass: !!process.env.RESEND_API_KEY,
      label: process.env.RESEND_API_KEY
        ? "Resend API key is configured — emails will send."
        : "RESEND_API_KEY is missing — welcome emails won't send.",
      detail: process.env.RESEND_API_KEY
        ? "RESEND_API_KEY is present in the environment. Use the test button below to verify it actually works end-to-end."
        : "Add RESEND_API_KEY to your Vercel environment variables and redeploy. Until then, no welcome emails go out.",
    },
  ];

  const passCount = checks.filter((c) => c.pass).length;
  const allGood = passCount === checks.length;

  // Merged activity feed: clusters + subscribers, sorted newest first
  type FeedItem =
    | { type: "cluster"; ts: string; cluster: ClusterRow }
    | { type: "subscriber"; ts: string; sub: SubscriberRow };

  const feed: FeedItem[] = [
    ...recentClusters.map((c) => ({
      type: "cluster" as const,
      ts: c.published_at,
      cluster: c,
    })),
    ...recentSubs.map((s) => ({
      type: "subscriber" as const,
      ts: s.created_at,
      sub: s,
    })),
  ]
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, 20);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
    <style>{`.svc-link:hover { border-color: #333 !important; }`}</style>
    <div
      style={{
        backgroundColor: "#0A0A0A",
        minHeight: "100vh",
        color: "#FFFFFF",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ color: "#787878", fontSize: "13px", marginBottom: "8px", letterSpacing: "0.02em" }}>
            {today}
          </p>
          <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            {allGood ? "All good — nothing urgent." : `Here's what needs your attention.`}
          </h1>
          <p style={{ color: "#787878", fontSize: "14px", margin: 0 }}>
            {allGood
              ? `${passCount}/${checks.length} checks passing. Have a coffee.`
              : `${passCount}/${checks.length} checks passing. Scroll down for details.`}
          </p>
        </div>

        {/* ── Operator Checklist ── */}
        <section style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {checks.map((check, i) => (
              <ChecklistItem key={i} pass={check.pass} label={check.label} detail={check.detail} />
            ))}
          </div>
        </section>

        {/* ── KPI Strip ── */}
        <section style={{ marginBottom: "40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <KpiCard
              label="Subscribers"
              value={subscriberCount.toLocaleString()}
              sub={
                subDelta === 0
                  ? "flat this week"
                  : `${subDeltaSign}${subDelta} this week`
              }
              subColor={subDelta > 0 ? "#22C55E" : subDelta < 0 ? "#EF4444" : "#787878"}
            />
            <KpiCard
              label="New this week"
              value={thisWeekSubs.toLocaleString()}
              sub={lastWeekSubs > 0 ? `${lastWeekSubs} last week` : "no data last week"}
              subColor="#787878"
            />
            <KpiCard
              label="Clusters live"
              value={totalPublished.toLocaleString()}
              sub={
                lastPublished
                  ? `last ${formatRelativeTime(lastPublished)}`
                  : "none yet"
              }
              subColor="#787878"
            />
          </div>
        </section>

        {/* ── Pipeline Detail ── */}
        <section style={{ marginBottom: "40px" }}>
          <SectionLabel>Pipeline Status</SectionLabel>
          <div
            style={{
              border: `1px solid ${pipeline.status === "NOMINAL" ? "rgba(34,197,94,0.25)" : pipeline.status === "DEGRADED" ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)"}`,
              borderRadius: "10px",
              padding: "18px 20px",
              backgroundColor:
                pipeline.status === "NOMINAL"
                  ? "rgba(34,197,94,0.05)"
                  : pipeline.status === "DEGRADED"
                  ? "rgba(245,158,11,0.05)"
                  : "rgba(239,68,68,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: pipeline.dot,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: 600, fontSize: "13px", color: pipeline.color, letterSpacing: "0.08em" }}>
                {pipeline.status}
              </span>
              {lastPublished && (
                <span style={{ color: "#787878", fontSize: "12px" }}>
                  · Last publish {formatDateShort(lastPublished)}
                </span>
              )}
            </div>
            <p style={{ color: "#ccc", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>
              {pipeline.detail}
            </p>
          </div>
        </section>

        {/* ── Activity Feed ── */}
        <section style={{ marginBottom: "40px" }}>
          <SectionLabel>Recent Activity</SectionLabel>
          {feed.length === 0 ? (
            <p style={{ color: "#787878", fontSize: "13px" }}>
              No activity yet — the feed will populate as clusters get published and subscribers sign up.
            </p>
          ) : (
            <div
              style={{
                border: "1px solid #1e1e1e",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {feed.map((item, i) => (
                <FeedRow
                  key={`${item.type}-${item.ts}-${i}`}
                  item={item}
                  isLast={i === feed.length - 1}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Actions ── */}
        <section style={{ marginBottom: "40px" }}>
          <SectionLabel>Toolbox</SectionLabel>
          <p style={{ color: "#787878", fontSize: "13px", marginBottom: "16px", lineHeight: 1.5 }}>
            One-off actions for maintenance. These hit live data — use with care.
          </p>
          <AdminControls />
        </section>

        {/* ── External Services ── */}
        <section style={{ marginBottom: "40px" }}>
          <SectionLabel>Services</SectionLabel>
          <p style={{ color: "#787878", fontSize: "13px", marginBottom: "16px", lineHeight: 1.5 }}>
            Everything that keeps ClusterDesk running. Bookmark these — you'll need them when something breaks.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {SERVICES.map((svc) => (
              <a
                key={svc.href}
                href={svc.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  border: "1px solid #1e1e1e",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color 0.15s",
                }}
                className="svc-link"
              >
                <p style={{ fontWeight: 600, fontSize: "13px", margin: "0 0 4px", color: "#fff" }}>
                  {svc.label} ↗
                </p>
                <p style={{ fontSize: "12px", color: "#787878", margin: 0, lineHeight: 1.5 }}>
                  {svc.desc}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* ── Design Gallery ── */}
        <div>
          <Link
            href="/admin/explore"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #1e1e1e",
              borderRadius: "8px",
              padding: "14px 18px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div>
              <p style={{ fontWeight: 600, fontSize: "13px", margin: "0 0 3px", color: "#fff" }}>
                Design Gallery
              </p>
              <p style={{ fontSize: "12px", color: "#787878", margin: 0 }}>
                8 different admin views — find the one that fits how you think
              </p>
            </div>
            <span style={{ color: "#555", fontSize: "18px" }}>→</span>
          </Link>
        </div>

      </div>
    </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.1em",
        color: "#787878",
        textTransform: "uppercase",
        marginBottom: "14px",
      }}
    >
      {children}
    </p>
  );
}

function ChecklistItem({
  pass,
  label,
  detail,
}: {
  pass: boolean;
  label: string;
  detail: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        border: "1px solid #1e1e1e",
        borderRadius: "10px",
        padding: "16px 18px",
        backgroundColor: pass ? "rgba(34,197,94,0.03)" : "rgba(239,68,68,0.03)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          flexShrink: 0,
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          backgroundColor: pass ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: 700,
          color: pass ? "#22C55E" : "#EF4444",
        }}
      >
        {pass ? "✓" : "✗"}
      </div>
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: pass ? "#e5e5e5" : "#f87171",
            margin: "0 0 5px",
            lineHeight: 1.4,
          }}
        >
          {label}
        </p>
        <p style={{ fontSize: "12px", color: "#787878", margin: 0, lineHeight: 1.5 }}>
          {detail}
        </p>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  subColor,
}: {
  label: string;
  value: string;
  sub: string;
  subColor: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #1e1e1e",
        borderRadius: "10px",
        padding: "16px 18px",
      }}
    >
      <p style={{ fontSize: "11px", color: "#787878", marginBottom: "8px", letterSpacing: "0.05em" }}>
        {label}
      </p>
      <p style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
        {value}
      </p>
      <p style={{ fontSize: "12px", color: subColor, margin: 0 }}>{sub}</p>
    </div>
  );
}

type FeedItem =
  | {
      type: "cluster";
      ts: string;
      cluster: {
        id: string;
        ticker: string;
        score: number;
        published_at: string;
        twitter_post_id: string | null;
        payload: { company_name?: string; insider_count?: number; total_value_usd?: number };
      };
    }
  | {
      type: "subscriber";
      ts: string;
      sub: { id: string; email: string; signup_source: string | null; created_at: string };
    };

function FeedRow({ item, isLast }: { item: FeedItem; isLast: boolean }) {
  const relTime = formatRelativeTime(item.ts);
  const absTime = formatDateShort(item.ts);

  if (item.type === "cluster") {
    const c = item.cluster;
    const companyName = c.payload?.company_name ?? "";
    const usd = c.payload?.total_value_usd;
    const insiders = c.payload?.insider_count;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          padding: "14px 18px",
          borderBottom: isLast ? "none" : "1px solid #1a1a1a",
        }}
      >
        {/* Dot */}
        <div style={{ paddingTop: "4px", flexShrink: 0 }}>
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#22C55E",
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
            <a
              href={`/buys/${c.ticker}`}
              style={{ fontWeight: 600, fontSize: "13px", color: "#22C55E", textDecoration: "none" }}
            >
              {c.ticker}
            </a>
            {companyName && (
              <span style={{ fontSize: "12px", color: "#ccc" }}>{companyName}</span>
            )}
            <span style={{ fontSize: "11px", color: "#555" }}>· cluster published</span>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "4px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#787878" }}>Score {c.score}</span>
            {insiders != null && (
              <span style={{ fontSize: "12px", color: "#787878" }}>{insiders} insiders</span>
            )}
            {usd != null && (
              <span style={{ fontSize: "12px", color: "#787878" }}>
                ${(usd / 1_000_000).toFixed(1)}M
              </span>
            )}
            {c.twitter_post_id && (
              <a
                href={`https://x.com/clusterdesk/status/${c.twitter_post_id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "12px", color: "#555", textDecoration: "none" }}
              >
                X post ↗
              </a>
            )}
          </div>
        </div>
        <div style={{ flexShrink: 0, textAlign: "right" }}>
          <span style={{ fontSize: "11px", color: "#555" }} title={absTime}>
            {relTime}
          </span>
        </div>
      </div>
    );
  }

  // subscriber
  const s = item.sub;
  const masked = s.email.replace(/(.{2}).*@/, "$1***@");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        padding: "14px 18px",
        borderBottom: isLast ? "none" : "1px solid #1a1a1a",
      }}
    >
      <div style={{ paddingTop: "4px", flexShrink: 0 }}>
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#3B82F6",
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "13px", margin: "0 0 3px", color: "#ccc" }}>
          <span style={{ fontWeight: 500 }}>{masked}</span>
          <span style={{ color: "#555", fontSize: "11px" }}> · new subscriber</span>
        </p>
        {s.signup_source && (
          <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>via {s.signup_source}</p>
        )}
      </div>
      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <span style={{ fontSize: "11px", color: "#555" }} title={absTime}>
          {relTime}
        </span>
      </div>
    </div>
  );
}
