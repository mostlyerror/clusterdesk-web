import { createAdminClient } from "@/lib/supabase-server";
import AdminControls from "./AdminControls";

export const revalidate = 0;

// ─── constants ────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = "benjamintpoon@gmail.com";

const EXTERNAL_SERVICES = [
  { name: "Railway",       desc: "Cron scheduler + worker env vars",       href: "https://railway.app" },
  { name: "Vercel",        desc: "Web deploys + edge/function logs",        href: "https://vercel.com" },
  { name: "Supabase",      desc: "Postgres DB + auth + storage",            href: "https://supabase.com" },
  { name: "Resend",        desc: "Transactional email + delivery logs",     href: "https://resend.com" },
  { name: "GitHub (web)",  desc: "clusterdesk-web — Next.js frontend",      href: "https://github.com/mostlyerror/clusterdesk-web" },
  { name: "GitHub (worker)", desc: "clusterdesk-worker — scraper/scorer",  href: "https://github.com/mostlyerror/clusterdesk-worker" },
  { name: "X / Twitter",  desc: "@clusterdesk — published posts",          href: "https://x.com/clusterdesk" },
];

// ─── level config ─────────────────────────────────────────────────────────────

type Level =
  | "NOMINAL" | "DEGRADED" | "DOWN"
  | "INFO" | "PASS" | "FAIL"
  | "PUBLISH" | "SUB" | "SYS" | "METRIC";

const LEVEL_COLOR: Record<Level, string> = {
  NOMINAL:  "#22C55E",
  DEGRADED: "#F59E0B",
  DOWN:     "#EF4444",
  INFO:     "#444",
  PASS:     "#22C55E",
  FAIL:     "#EF4444",
  PUBLISH:  "#22C55E",
  SUB:      "#3B82F6",
  SYS:      "#787878",
  METRIC:   "#a78bfa",
};

const LEVEL_TEXT_COLOR: Record<Level, string> = {
  NOMINAL:  "#22C55E",
  DEGRADED: "#F59E0B",
  DOWN:     "#EF4444",
  INFO:     "#555",
  PASS:     "#22C55E",
  FAIL:     "#EF4444",
  PUBLISH:  "#aaa",
  SUB:      "#aaa",
  SYS:      "#787878",
  METRIC:   "#c4b5fd",
};

// ─── data fetching ─────────────────────────────────────────────────────────────

interface ClusterRow {
  id: string;
  ticker: string;
  score: number;
  published_at: string | null;
  twitter_post_id: string | null;
  created_at: string;
  payload: {
    company_name?: string;
    insider_count?: number;
    total_value_usd?: number;
  } | null;
}

interface SubscriberRow {
  id: string;
  email: string;
  signup_source: string | null;
  created_at: string;
}

async function getData() {
  const db = createAdminClient();

  const [
    subCountRes,
    subRecentRes,
    subWeekRes,
    clusterCountRes,
    clustersRes,
  ] = await Promise.all([
    db.from("email_subscribers").select("*", { count: "exact", head: true }),
    db.from("email_subscribers")
      .select("id,email,signup_source,created_at")
      .order("created_at", { ascending: false })
      .limit(20),
    db.from("email_subscribers")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    db.from("clusters")
      .select("*", { count: "exact", head: true })
      .not("published_at", "is", null),
    db.from("clusters")
      .select("id,ticker,score,published_at,twitter_post_id,created_at,payload")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(20),
  ]);

  return {
    subscriberCount:   subCountRes.count  ?? 0,
    subscriberWeekDelta: subWeekRes.count ?? 0,
    recentSubscribers: (subRecentRes.data ?? []) as SubscriberRow[],
    totalPublished:    clusterCountRes.count ?? 0,
    clusters:          (clustersRes.data  ?? []) as ClusterRow[],
  };
}

// ─── pipeline status logic ─────────────────────────────────────────────────────

function getPipelineStatus(lastPublishedAt: string | null): {
  level: "NOMINAL" | "DEGRADED" | "DOWN";
  message: string;
  hours: number | null;
} {
  if (!lastPublishedAt) {
    return { level: "DOWN", message: "No published clusters found — pipeline has never run or DB is empty.", hours: null };
  }
  const hours = (Date.now() - new Date(lastPublishedAt).getTime()) / 36e5;
  if (hours < 24)  return { level: "NOMINAL",  message: `Last publish ${hours.toFixed(1)}h ago — within 24h window.`, hours };
  if (hours < 72)  return { level: "DEGRADED", message: `Last publish ${hours.toFixed(1)}h ago — expected daily. Check Railway cron or DRY_RUN env.`, hours };
  return           { level: "DOWN",     message: `Last publish ${hours.toFixed(1)}h ago — pipeline likely broken. Check Railway logs immediately.`, hours };
}

// ─── operator checks ──────────────────────────────────────────────────────────

interface Check {
  name: string;
  pass: boolean;
  detail: string;
}

function buildChecklist(args: {
  subscriberCount: number;
  totalPublished: number;
  pipelineLevel: "NOMINAL" | "DEGRADED" | "DOWN";
  recentClusters: ClusterRow[];
}): Check[] {
  const { subscriberCount, totalPublished, pipelineLevel, recentClusters } = args;

  const latestHasTwitter =
    recentClusters.length > 0 && !!recentClusters[0].twitter_post_id;

  const allScoresValid = recentClusters
    .slice(0, 5)
    .every((c) => typeof c.score === "number" && c.score >= 0 && c.score <= 100);

  return [
    {
      name: "Pipeline nominal",
      pass: pipelineLevel === "NOMINAL",
      detail: pipelineLevel === "NOMINAL"
        ? "Last publish within 24h."
        : `Pipeline is ${pipelineLevel} — see pipeline status entry above.`,
    },
    {
      name: "Subscriber list non-empty",
      pass: subscriberCount > 0,
      detail: subscriberCount > 0
        ? `${subscriberCount} subscriber(s) in DB.`
        : "No subscribers found — check email_subscribers table.",
    },
    {
      name: "At least one cluster published",
      pass: totalPublished > 0,
      detail: totalPublished > 0
        ? `${totalPublished} cluster(s) published lifetime.`
        : "No published clusters — worker may not have run successfully.",
    },
    {
      name: "Latest cluster has X post ID",
      pass: latestHasTwitter,
      detail: latestHasTwitter
        ? "Most recent cluster has twitter_post_id set."
        : "Latest cluster missing twitter_post_id — X publish may have failed. Check X_API keys on Railway.",
    },
    {
      name: "Recent cluster scores in range",
      pass: allScoresValid,
      detail: allScoresValid
        ? "Last 5 cluster scores are 0–100."
        : "One or more recent clusters has an out-of-range score — scoring logic may be broken.",
    },
  ];
}

// ─── formatting helpers ────────────────────────────────────────────────────────

function fmtTs(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toISOString().replace("T", " ").slice(0, 19) + "Z";
}

function fmtUsd(v: number | undefined): string {
  if (!v) return "";
  if (v >= 1_000_000) return ` $${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return ` $${Math.round(v / 1000)}K`;
  return ` $${v}`;
}

function nowIso(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19) + "Z";
}

// ─── log entry component ──────────────────────────────────────────────────────

function LogEntry({
  ts,
  level,
  children,
}: {
  ts: string;
  level: Level;
  children: React.ReactNode;
}) {
  const isInfo = level === "INFO";
  const borderColor = LEVEL_COLOR[level];
  const textColor   = LEVEL_TEXT_COLOR[level];

  return (
    <div
      style={{
        borderLeft: `3px solid ${borderColor}`,
        paddingLeft: 12,
        paddingTop: 6,
        paddingBottom: 6,
        paddingRight: 8,
        background: isInfo ? "#0d0d0d" : "transparent",
        marginBottom: 2,
      }}
    >
      <span style={{ color: "#444", fontStyle: isInfo ? "italic" : "normal" }}>
        [{ts}]{" "}
      </span>
      <span
        style={{
          color: borderColor,
          fontStyle: isInfo ? "italic" : "normal",
          fontWeight: isInfo ? "normal" : 600,
        }}
      >
        [{level}]
      </span>{" "}
      <span
        style={{
          color: textColor,
          fontStyle: isInfo ? "italic" : "normal",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div
      style={{
        borderTop: "1px solid #1a1a1a",
        marginTop: 16,
        marginBottom: 8,
        paddingTop: 8,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: "#333",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        ── {label} ──
      </span>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  const {
    subscriberCount,
    subscriberWeekDelta,
    recentSubscribers,
    totalPublished,
    clusters,
  } = await getData();

  const lastPublishedAt = clusters[0]?.published_at ?? null;
  const pipeline        = getPipelineStatus(lastPublishedAt);

  const checklist = buildChecklist({
    subscriberCount,
    totalPublished,
    pipelineLevel: pipeline.level,
    recentClusters: clusters,
  });

  const failCount = checklist.filter((c) => !c.pass).length;
  const overallLevel: Level =
    pipeline.level === "DOWN"      ? "DOWN"     :
    failCount > 0                  ? "DEGRADED" :
    pipeline.level === "DEGRADED"  ? "DEGRADED" :
    "NOMINAL";

  // Build merged activity feed (clusters + subscribers), sorted newest first
  type ActivityEvent =
    | { kind: "publish"; ts: string; cluster: ClusterRow }
    | { kind: "sub";     ts: string; sub: SubscriberRow };

  const activity: ActivityEvent[] = [
    ...clusters.map((c) => ({
      kind: "publish" as const,
      ts: c.published_at!,
      cluster: c,
    })),
    ...recentSubscribers.map((s) => ({
      kind: "sub" as const,
      ts: s.created_at,
      sub: s,
    })),
  ]
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, 20);

  const pageTs = nowIso();

  return (
    <div
      style={{
        maxWidth: 768,
        margin: "0 auto",
        padding: "40px 24px 80px",
        fontFamily: "monospace",
        background: "#0A0A0A",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      {/* ── HEADER ── */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <h1
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#fff",
              margin: 0,
            }}
          >
            CLUSTERDESK OPS LOG
          </h1>
          <span
            style={{
              fontSize: 11,
              color: "#555",
              letterSpacing: "0.05em",
            }}
          >
            {pageTs}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: LEVEL_COLOR[overallLevel],
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: LEVEL_COLOR[overallLevel],
              letterSpacing: "0.06em",
            }}
          >
            OVERALL: {overallLevel}
            {failCount > 0 ? ` — ${failCount} check(s) failing` : ""}
          </span>
        </div>
      </div>

      {/* ── ACTIONS PANEL (client component, before the log) ── */}
      <AdminControls adminEmail={ADMIN_EMAIL} />

      {/* ── LOG BODY ── */}
      <div>

        {/* ──── PIPELINE STATUS ──── */}
        <Divider label="pipeline" />

        <LogEntry ts={pageTs} level={pipeline.level}>
          PIPELINE: {pipeline.message}
        </LogEntry>

        <LogEntry ts={pageTs} level="INFO">
          PIPELINE: Railway cron, 8am CT weekdays. Scrapes OpenInsider, filters
          micro-cap clusters (≥2 insiders, 5d window, ≥$100K), scores 0-100,
          publishes to X+Supabase. NOMINAL=&lt;24h. DEGRADED=1-3d. DOWN=3+d —
          check Railway logs or DRY_RUN env var.
        </LogEntry>

        {lastPublishedAt && (
          <LogEntry ts={fmtTs(lastPublishedAt)} level="INFO">
            Last successful pipeline run at {fmtTs(lastPublishedAt)}.
            Ticker: {clusters[0]?.ticker ?? "—"} | Score: {clusters[0]?.score ?? "—"}
          </LogEntry>
        )}

        {/* ──── METRICS ──── */}
        <Divider label="metrics" />

        <LogEntry ts={pageTs} level="METRIC">
          SUBSCRIBERS: {subscriberCount} total | +{subscriberWeekDelta} this week
        </LogEntry>

        <LogEntry ts={pageTs} level="INFO">
          SUBSCRIBERS: Captured via website sign-up form. signup_source field
          records entry point (e.g. "homepage", "post-page"). +N/week is a
          rolling 7d count. Use purge action to remove test addresses before
          reviewing real numbers.
        </LogEntry>

        <LogEntry ts={pageTs} level="METRIC">
          CLUSTERS: {totalPublished} published lifetime
        </LogEntry>

        <LogEntry ts={pageTs} level="INFO">
          CLUSTERS: Each cluster = one batch of insider buys on a single ticker
          within a 5-day window. Score reflects insider count, total $ value,
          and recency. Published to X and stored in Supabase clusters table.
        </LogEntry>

        {/* ──── OPERATOR CHECKLIST ──── */}
        <Divider label="checklist" />

        <LogEntry ts={pageTs} level="INFO">
          CHECKLIST: Run through this before shipping anything or after an alert.
          All [PASS] = system healthy. Any [FAIL] = investigate before continuing.
        </LogEntry>

        {checklist.map((check) => (
          <LogEntry
            key={check.name}
            ts={pageTs}
            level={check.pass ? "PASS" : "FAIL"}
          >
            {check.name.toUpperCase().replace(/ /g, "_")}: {check.detail}
          </LogEntry>
        ))}

        {/* ──── ACTIVITY FEED ──── */}
        <Divider label="activity (last 20 events)" />

        <LogEntry ts={pageTs} level="INFO">
          ACTIVITY: Merged feed of cluster publishes [PUBLISH] and new
          subscriber sign-ups [SUB], newest first. Shows last 20 events across
          both tables. twitter_post_id links to the X post.
        </LogEntry>

        {activity.length === 0 && (
          <LogEntry ts={pageTs} level="INFO">
            No activity yet — DB tables are empty.
          </LogEntry>
        )}

        {activity.map((ev) => {
          if (ev.kind === "publish") {
            const c = ev.cluster;
            const company = c.payload?.company_name ?? "";
            const insiders = c.payload?.insider_count;
            const usd = fmtUsd(c.payload?.total_value_usd);
            const xLink = c.twitter_post_id
              ? ` → x.com/clusterdesk/status/${c.twitter_post_id}`
              : "";
            return (
              <LogEntry key={`pub-${c.id}`} ts={fmtTs(c.published_at)} level="PUBLISH">
                ${c.ticker}
                {company ? ` (${company})` : ""}
                {" "}score={c.score}
                {insiders ? ` insiders=${insiders}` : ""}
                {usd}
                {xLink}
              </LogEntry>
            );
          } else {
            const s = ev.sub;
            const masked = s.email.replace(/(?<=.{3}).(?=.*@)/, "·");
            return (
              <LogEntry key={`sub-${s.id}`} ts={fmtTs(s.created_at)} level="SUB">
                NEW_SUBSCRIBER: {masked}
                {s.signup_source ? ` source=${s.signup_source}` : ""}
              </LogEntry>
            );
          }
        })}

        {/* ──── EXTERNAL SERVICES ──── */}
        <Divider label="external services" />

        <LogEntry ts={pageTs} level="INFO">
          SYS: Links to dashboards for every external dependency.
          Check these first when diagnosing incidents.
        </LogEntry>

        {EXTERNAL_SERVICES.map((svc) => (
          <LogEntry key={svc.href} ts={pageTs} level="SYS">
            {svc.name.toUpperCase().replace(/ /g, "_")}:{" "}
            {svc.desc}{" "}
            <a
              href={svc.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#787878", textDecoration: "underline" }}
            >
              {svc.href}
            </a>
          </LogEntry>
        ))}

        {/* ──── END OF LOG ──── */}
        <Divider label="end of log" />
        <LogEntry ts={pageTs} level="INFO">
          EOF: Page rendered at {pageTs}. revalidate=0 — always fresh.
          To force a full revalidate, use the action button above.
        </LogEntry>

      </div>
    </div>
  );
}
