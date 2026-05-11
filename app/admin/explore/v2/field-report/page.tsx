import AdminControls from "./AdminControls";
import { createAdminClient } from "@/lib/supabase-server";

export const revalidate = 0;

// ── types ─────────────────────────────────────────────────────────────────────

type ClusterRow = {
  id: string;
  ticker: string;
  score: number;
  published_at: string | null;
  created_at: string;
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

// ── data fetch ────────────────────────────────────────────────────────────────

async function fetchReportData() {
  const db = createAdminClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [subAllRes, subThisWeekRes, subLastWeekRes, clustersRes, recentSubsRes] =
    await Promise.all([
      db
        .from("email_subscribers")
        .select("*", { count: "exact", head: true }),
      db
        .from("email_subscribers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString()),
      db
        .from("email_subscribers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", fourteenDaysAgo.toISOString())
        .lt("created_at", sevenDaysAgo.toISOString()),
      db
        .from("clusters")
        .select(
          "id,ticker,score,published_at,created_at,twitter_post_id,payload"
        )
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
    subscriberTotal: subAllRes.count ?? 0,
    subscriberThisWeek: subThisWeekRes.count ?? 0,
    subscriberLastWeek: subLastWeekRes.count ?? 0,
    clusters: (clustersRes.data ?? []) as ClusterRow[],
    recentSubs: (recentSubsRes.data ?? []) as SubscriberRow[],
  };
}

// ── helpers ───────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function pipelineStatus(lastPublishedAt: string | null): {
  label: string;
  color: string;
  daysAgo: number | null;
} {
  if (!lastPublishedAt) {
    return { label: "NO DATA", color: "#ef4444", daysAgo: null };
  }
  const daysAgo =
    (Date.now() - new Date(lastPublishedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysAgo <= 1) return { label: "HEALTHY", color: "#22C55E", daysAgo };
  if (daysAgo <= 3) return { label: "RECENT", color: "#facc15", daysAgo };
  return { label: "STALE", color: "#ef4444", daysAgo };
}

// ── operator checklist ────────────────────────────────────────────────────────

type CheckItem = { label: string; pass: boolean; note?: string };

function buildChecklist(
  lastPublishedAt: string | null,
  subscriberTotal: number,
  clusters: ClusterRow[]
): CheckItem[] {
  const pipelineDaysAgo = lastPublishedAt
    ? (Date.now() - new Date(lastPublishedAt).getTime()) /
      (1000 * 60 * 60 * 24)
    : Infinity;

  const latestScore = clusters[0]?.score ?? 0;
  const allHaveTwitter = clusters
    .slice(0, 5)
    .every((c) => !!c.twitter_post_id);

  return [
    {
      label: "Pipeline ran within 3 days",
      pass: pipelineDaysAgo <= 3,
      note:
        pipelineDaysAgo <= 3
          ? `Last run ${Math.floor(pipelineDaysAgo * 24)}h ago`
          : "Check Railway logs — DRY_RUN may be set to true",
    },
    {
      label: "At least one published cluster",
      pass: clusters.length > 0,
      note: clusters.length > 0 ? `${clusters.length} total` : "No clusters found",
    },
    {
      label: "Latest cluster score is reasonable (≥ 40)",
      pass: latestScore >= 40,
      note: `Latest score: ${latestScore}`,
    },
    {
      label: "Recent clusters have X post IDs",
      pass: allHaveTwitter,
      note: allHaveTwitter
        ? "All 5 most recent clusters posted"
        : "Some recent clusters missing twitter_post_id",
    },
    {
      label: "Subscriber list non-empty",
      pass: subscriberTotal > 0,
      note: `${subscriberTotal} subscriber${subscriberTotal !== 1 ? "s" : ""}`,
    },
  ];
}

// ── opening paragraph ─────────────────────────────────────────────────────────

function buildOpeningParagraph({
  subscriberTotal,
  subscriberThisWeek,
  subscriberLastWeek,
  clusters,
}: {
  subscriberTotal: number;
  subscriberThisWeek: number;
  subscriberLastWeek: number;
  clusters: ClusterRow[];
}): string {
  const lastCluster = clusters[0];
  const pipelinePart = lastCluster?.published_at
    ? `Pipeline last ran ${timeAgo(lastCluster.published_at)}.`
    : "Pipeline has not published any clusters yet.";

  const delta = subscriberThisWeek - subscriberLastWeek;
  const deltaStr =
    delta === 0
      ? "flat week-over-week"
      : delta > 0
      ? `up ${delta} from last week`
      : `down ${Math.abs(delta)} from last week`;
  const subPart = `Subscriber count stands at ${subscriberTotal}, ${deltaStr}.`;

  const clusterPart = lastCluster
    ? `Most recent cluster: ${
        lastCluster.payload?.company_name ?? lastCluster.ticker
      } (${lastCluster.ticker}), score ${lastCluster.score}.`
    : "";

  const { daysAgo } = pipelineStatus(lastCluster?.published_at ?? null);
  const attentionPart =
    daysAgo !== null && daysAgo > 3
      ? "Pipeline is stale — check Railway logs or verify DRY_RUN=false."
      : "No critical issues.";

  return [pipelinePart, subPart, clusterPart, attentionPart]
    .filter(Boolean)
    .join(" ");
}

// ── styles ────────────────────────────────────────────────────────────────────

const PAGE: React.CSSProperties = {
  maxWidth: 760,
  margin: "0 auto",
  padding: "48px 24px 80px",
  color: "#e8e8e8",
  fontFamily:
    '"Georgia", "Times New Roman", Times, serif',
  background: "#0A0A0A",
  minHeight: "100vh",
};

const MONO: React.CSSProperties = {
  fontFamily: '"SFMono-Regular", "Consolas", "Liberation Mono", Courier, monospace',
};

const SECTION_TITLE: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#787878",
  marginBottom: 12,
  marginTop: 0,
  ...MONO,
};

const RULE: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #1e1e1e",
  margin: "36px 0",
};

const CONTEXT_PARA: React.CSSProperties = {
  fontSize: 13,
  color: "#555",
  lineHeight: 1.65,
  marginBottom: 16,
  marginTop: 0,
  fontStyle: "italic",
};

const DATA_PARA: React.CSSProperties = {
  fontSize: 15,
  color: "#e8e8e8",
  lineHeight: 1.75,
  margin: "0 0 8px",
};

const NUMBERED_LIST: React.CSSProperties = {
  margin: 0,
  padding: 0,
  listStyle: "none",
};

// ── page component ────────────────────────────────────────────────────────────

export default async function FieldReportPage() {
  const {
    subscriberTotal,
    subscriberThisWeek,
    subscriberLastWeek,
    clusters,
    recentSubs,
  } = await fetchReportData();

  const generatedAt = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const lastCluster = clusters[0] ?? null;
  const pipeline = pipelineStatus(lastCluster?.published_at ?? null);
  const checklist = buildChecklist(
    lastCluster?.published_at ?? null,
    subscriberTotal,
    clusters
  );
  const openingParagraph = buildOpeningParagraph({
    subscriberTotal,
    subscriberThisWeek,
    subscriberLastWeek,
    clusters,
  });

  // merge activity feed
  type FeedEvent =
    | { kind: "cluster"; ts: string; cluster: ClusterRow }
    | { kind: "subscriber"; ts: string; sub: SubscriberRow };

  const feed: FeedEvent[] = [
    ...clusters.map(
      (c) =>
        ({
          kind: "cluster" as const,
          ts: c.published_at!,
          cluster: c,
        } satisfies FeedEvent)
    ),
    ...recentSubs.map(
      (s) =>
        ({
          kind: "subscriber" as const,
          ts: s.created_at,
          sub: s,
        } satisfies FeedEvent)
    ),
  ]
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, 20);

  const passCount = checklist.filter((c) => c.pass).length;

  return (
    <div style={PAGE}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ ...MONO, fontSize: 11, color: "#555", margin: "0 0 6px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Internal Memo
        </p>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.04em",
            margin: "0 0 6px",
            color: "#ffffff",
            textTransform: "uppercase",
            ...MONO,
          }}
        >
          ClusterDesk Status Report
        </h1>
        <p style={{ ...MONO, fontSize: 12, color: "#555", margin: 0 }}>
          {generatedAt}
        </p>
      </div>

      {/* ── Opening paragraph ──────────────────────────────── */}
      <p
        style={{
          fontSize: 16,
          lineHeight: 1.8,
          color: "#e8e8e8",
          margin: "0 0 8px",
          padding: "20px 24px",
          background: "#0e0e0e",
          borderLeft: "3px solid #22C55E",
          borderRadius: "0 4px 4px 0",
        }}
      >
        {openingParagraph}
      </p>

      <hr style={RULE} />

      {/* ── §1. Pipeline ───────────────────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <p style={SECTION_TITLE}>§1. Pipeline</p>
        <p style={CONTEXT_PARA}>
          The pipeline is a Railway cron job that runs daily at 8am CT on
          weekdays. It scrapes OpenInsider, identifies micro-cap insider
          clusters, scores them 0–100, and publishes the best result to X. If
          the pipeline appears stale (3+ days), check Railway logs or verify
          that <code style={{ ...MONO, fontSize: 12 }}>DRY_RUN=false</code> is set in Railway environment variables.
        </p>

        <p style={DATA_PARA}>
          Status:{" "}
          <span style={{ color: pipeline.color, fontWeight: 600, ...MONO }}>
            {pipeline.label}
          </span>
          {pipeline.daysAgo !== null && (
            <span style={{ color: "#787878", fontSize: 14 }}>
              {" "}
              — last publish{" "}
              {pipeline.daysAgo < 1
                ? `${Math.floor(pipeline.daysAgo * 24)}h ago`
                : `${pipeline.daysAgo.toFixed(1)} days ago`}
            </span>
          )}
        </p>

        {lastCluster && (
          <p style={{ ...DATA_PARA, fontSize: 14, color: "#aaa" }}>
            Last cluster:{" "}
            <span style={{ color: "#22C55E", ...MONO }}>
              {lastCluster.ticker}
            </span>{" "}
            &mdash;{" "}
            {lastCluster.payload?.company_name ?? lastCluster.ticker}, score{" "}
            <strong style={{ color: "#e8e8e8" }}>{lastCluster.score}</strong>,
            published{" "}
            {lastCluster.published_at
              ? formatDate(lastCluster.published_at)
              : "—"}
            {lastCluster.twitter_post_id && (
              <>
                {" "}
                &bull;{" "}
                <a
                  href={`https://x.com/clusterdesk/status/${lastCluster.twitter_post_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#555", fontSize: 13 }}
                >
                  view on X ↗
                </a>
              </>
            )}
          </p>
        )}

        {/* last 5 clusters mini-table */}
        {clusters.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p style={{ ...MONO, fontSize: 11, color: "#555", marginBottom: 8, letterSpacing: "0.08em" }}>
              RECENT CLUSTERS
            </p>
            <ol style={NUMBERED_LIST}>
              {clusters.slice(0, 5).map((c, i) => (
                <li
                  key={c.id}
                  style={{
                    padding: "7px 0",
                    borderBottom: "1px solid #141414",
                    fontSize: 13,
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                  }}
                >
                  <span style={{ color: "#444", ...MONO, minWidth: 18 }}>
                    {i + 1}.
                  </span>
                  <span style={{ color: "#22C55E", ...MONO, minWidth: 60 }}>
                    {c.ticker}
                  </span>
                  <span style={{ color: "#aaa", flex: 1 }}>
                    {c.payload?.company_name ?? "—"}
                  </span>
                  <span style={{ color: "#787878", ...MONO, fontSize: 12 }}>
                    score {c.score}
                  </span>
                  <span style={{ color: "#444", fontSize: 12 }}>
                    {c.published_at ? timeAgo(c.published_at) : "—"}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <hr style={RULE} />

      {/* ── §2. Subscribers ────────────────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <p style={SECTION_TITLE}>§2. Subscribers</p>
        <p style={CONTEXT_PARA}>
          Email subscribers are collected via the site&apos;s signup form and
          stored in <code style={{ ...MONO, fontSize: 12 }}>email_subscribers</code>. The
          delta compares this calendar week to the same 7-day window from the
          previous week.
        </p>

        <p style={DATA_PARA}>
          Total:{" "}
          <span style={{ color: "#e8e8e8", fontWeight: 700, fontSize: 20, ...MONO }}>
            {subscriberTotal}
          </span>{" "}
          <span style={{ color: "#787878", fontSize: 14 }}>subscribers</span>
        </p>

        <p style={{ ...DATA_PARA, fontSize: 14, color: "#aaa" }}>
          This week:{" "}
          <span
            style={{
              color:
                subscriberThisWeek > subscriberLastWeek
                  ? "#22C55E"
                  : subscriberThisWeek < subscriberLastWeek
                  ? "#ef4444"
                  : "#787878",
              fontWeight: 600,
              ...MONO,
            }}
          >
            +{subscriberThisWeek}
          </span>{" "}
          &bull; Last week:{" "}
          <span style={{ color: "#787878", ...MONO }}>
            +{subscriberLastWeek}
          </span>{" "}
          &bull; Net change:{" "}
          <span
            style={{
              color:
                subscriberThisWeek - subscriberLastWeek > 0
                  ? "#22C55E"
                  : subscriberThisWeek - subscriberLastWeek < 0
                  ? "#ef4444"
                  : "#787878",
              ...MONO,
            }}
          >
            {subscriberThisWeek - subscriberLastWeek > 0 ? "+" : ""}
            {subscriberThisWeek - subscriberLastWeek}
          </span>
        </p>
      </section>

      <hr style={RULE} />

      {/* ── §3. Recent Activity ────────────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <p style={SECTION_TITLE}>§3. Recent Activity</p>
        <p style={CONTEXT_PARA}>
          Merged feed of cluster publishes and subscriber signups, sorted newest
          first. Limited to the 20 most recent events across both tables.
        </p>

        {feed.length === 0 ? (
          <p style={{ ...DATA_PARA, color: "#555" }}>No activity on record.</p>
        ) : (
          <ol style={NUMBERED_LIST}>
            {feed.map((event, i) => (
              <li
                key={`${event.kind}-${event.ts}-${i}`}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #141414",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                }}
              >
                <span style={{ color: "#444", ...MONO, minWidth: 24 }}>
                  {i + 1}.
                </span>
                <span
                  style={{
                    color: event.kind === "cluster" ? "#22C55E" : "#60a5fa",
                    ...MONO,
                    fontSize: 11,
                    minWidth: 80,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {event.kind === "cluster" ? "cluster" : "signup"}
                </span>
                <span style={{ color: "#e8e8e8", flex: 1 }}>
                  {event.kind === "cluster" ? (
                    <>
                      <span style={{ color: "#22C55E", ...MONO }}>
                        {event.cluster.ticker}
                      </span>{" "}
                      &mdash;{" "}
                      {event.cluster.payload?.company_name ??
                        event.cluster.ticker}
                      , score {event.cluster.score}
                    </>
                  ) : (
                    <span style={{ color: "#aaa" }}>
                      {event.sub.email.replace(
                        /^(.{2}).*(@.*)$/,
                        "$1***$2"
                      )}
                    </span>
                  )}
                </span>
                <span style={{ color: "#444", fontSize: 12, whiteSpace: "nowrap" }}>
                  {timeAgo(event.ts)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <hr style={RULE} />

      {/* ── Operator Checklist ─────────────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <p style={SECTION_TITLE}>
          Operator Checklist &mdash;{" "}
          <span style={{ color: passCount === checklist.length ? "#22C55E" : "#facc15" }}>
            {passCount}/{checklist.length} pass
          </span>
        </p>
        <p style={CONTEXT_PARA}>
          Binary health checks evaluated server-side on each page load.
        </p>

        <ol style={NUMBERED_LIST}>
          {checklist.map((item, i) => (
            <li
              key={i}
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #141414",
                fontSize: 14,
                display: "flex",
                alignItems: "baseline",
                gap: 12,
              }}
            >
              <span
                style={{
                  color: item.pass ? "#22C55E" : "#ef4444",
                  ...MONO,
                  fontSize: 13,
                  minWidth: 18,
                }}
              >
                {item.pass ? "✓" : "✗"}
              </span>
              <span style={{ color: item.pass ? "#e8e8e8" : "#fca5a5", flex: 1 }}>
                {item.label}
              </span>
              {item.note && (
                <span style={{ color: "#555", fontSize: 12 }}>{item.note}</span>
              )}
            </li>
          ))}
        </ol>
      </section>

      <hr style={RULE} />

      {/* ── §4. Actions ────────────────────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <p style={SECTION_TITLE}>§4. Actions</p>
        <p style={CONTEXT_PARA}>
          Administrative operations. &ldquo;Purge test subscribers&rdquo; removes
          addresses matching common test patterns (test@, @test., @example.,
          +test). &ldquo;Revalidate ticker pages&rdquo; triggers Next.js ISR
          revalidation for all published ticker pages without a full deploy.
        </p>

        <AdminControls />
      </section>

      <hr style={RULE} />

      {/* ── §5. External Systems ───────────────────────────── */}
      <section>
        <p style={SECTION_TITLE}>§5. External Systems</p>
        <p style={CONTEXT_PARA}>
          Quick links to all services that keep ClusterDesk running.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 10,
          }}
        >
          {[
            {
              name: "Railway",
              desc: "Cron job + worker env vars. Check here first if the pipeline is stale.",
              href: "https://railway.app",
            },
            {
              name: "Vercel",
              desc: "Web deploy logs, Next.js function invocations, and ISR status.",
              href: "https://vercel.com",
            },
            {
              name: "Supabase",
              desc: "Postgres database. clusters and email_subscribers tables live here.",
              href: "https://supabase.com",
            },
            {
              name: "Resend",
              desc: "Transactional email provider. Check delivery logs for bounce issues.",
              href: "https://resend.com",
            },
            {
              name: "GitHub (web)",
              desc: "clusterdesk-web — the Next.js frontend you are looking at.",
              href: "https://github.com/mostlyerror/clusterdesk-web",
            },
            {
              name: "GitHub (worker)",
              desc: "clusterdesk-worker — Railway cron that scrapes OpenInsider.",
              href: "https://github.com/mostlyerror/clusterdesk-worker",
            },
            {
              name: "X / Twitter",
              desc: "@clusterdesk — the public account this pipeline posts to.",
              href: "https://x.com/clusterdesk",
            },
          ].map((svc) => (
            <a
              key={svc.href}
              href={svc.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "12px 14px",
                border: "1px solid #1e1e1e",
                borderRadius: 4,
                textDecoration: "none",
                transition: "border-color 0.15s",
              }}
            >
              <p
                style={{
                  ...MONO,
                  fontSize: 12,
                  color: "#e8e8e8",
                  margin: "0 0 4px",
                  fontWeight: 600,
                }}
              >
                {svc.name} ↗
              </p>
              <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.5 }}>
                {svc.desc}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div
        style={{
          marginTop: 48,
          borderTop: "1px solid #141414",
          paddingTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ ...MONO, fontSize: 11, color: "#333", margin: 0 }}>
          CLUSTERDESK ADMIN &mdash; INTERNAL USE ONLY
        </p>
        <p style={{ ...MONO, fontSize: 11, color: "#333", margin: 0 }}>
          Generated {generatedAt}
        </p>
      </div>
    </div>
  );
}
