import Link from "next/link";
import { createAdminClient } from "@/lib/supabase-server";
import { PurgeTestSubsButton, SendTestEmailForm, RevalidateButton } from "./AdminControls";

export const revalidate = 0;

/* ─────────────────────────────────────────────
   Data fetching
───────────────────────────────────────────── */

async function getDashboardData() {
  const db = createAdminClient();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    totalSubsRes,
    newSubsThisWeekRes,
    newSubsLastWeekRes,
    totalClustersRes,
    recentClustersRes,
    recentSubsRes,
  ] = await Promise.all([
    db.from("email_subscribers").select("*", { count: "exact", head: true }),
    db
      .from("email_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString()),
    db
      .from("email_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", twoWeeksAgo.toISOString())
      .lt("created_at", weekAgo.toISOString()),
    db
      .from("clusters")
      .select("*", { count: "exact", head: true })
      .not("published_at", "is", null),
    db
      .from("clusters")
      .select(
        "id,ticker,score,published_at,twitter_post_id,payload"
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

  const totalSubs = totalSubsRes.count ?? 0;
  const newThisWeek = newSubsThisWeekRes.count ?? 0;
  const newLastWeek = newSubsLastWeekRes.count ?? 0;
  const totalClusters = totalClustersRes.count ?? 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusters = (recentClustersRes.data ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subs = (recentSubsRes.data ?? []) as any[];

  // Merge + sort activity feed
  const feed: ActivityEvent[] = [
    ...clusters.slice(0, 20).map((c) => ({
      type: "cluster" as const,
      ts: c.published_at as string,
      label: `CLUSTER: ${c.ticker} · score=${c.score}`,
      sub: c.payload?.company_name ?? "",
      tweetId: c.twitter_post_id as string | null,
      ticker: c.ticker as string,
    })),
    ...subs.slice(0, 20).map((s) => ({
      type: "sub" as const,
      ts: s.created_at as string,
      label: `SUB: ${s.email}`,
      sub: s.signup_source ?? "web",
      tweetId: null,
      ticker: null,
    })),
  ]
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, 20);

  const lastPublished = clusters[0]?.published_at ?? null;
  const hoursAgo = lastPublished
    ? Math.floor(
        (now.getTime() - new Date(lastPublished).getTime()) / (1000 * 60 * 60)
      )
    : null;

  let pipelineStatus: "NOMINAL" | "DEGRADED" | "DOWN" = "DOWN";
  if (hoursAgo !== null) {
    if (hoursAgo < 24) pipelineStatus = "NOMINAL";
    else if (hoursAgo < 72) pipelineStatus = "DEGRADED";
  }

  // Operator checklist
  const checks: Check[] = [
    {
      id: "pipeline",
      label: "PIPELINE",
      desc: "Last cluster published within 24 hours",
      pass: pipelineStatus === "NOMINAL",
      warn: pipelineStatus === "DEGRADED",
    },
    {
      id: "subs",
      label: "SUBSCRIBERS",
      desc: "At least 1 new subscriber this week",
      pass: newThisWeek > 0,
      warn: false,
    },
    {
      id: "clusters_count",
      label: "CLUSTER COUNT",
      desc: "At least 1 cluster ever published",
      pass: totalClusters > 0,
      warn: false,
    },
    {
      id: "growth",
      label: "WK/WK GROWTH",
      desc: "New subs this week >= last week",
      pass: newThisWeek >= newLastWeek,
      warn: newThisWeek > 0 && newThisWeek < newLastWeek,
    },
    {
      id: "tweet",
      label: "LAST TWEET ID",
      desc: "Most recent cluster has a twitter_post_id",
      pass: !!(clusters[0]?.twitter_post_id),
      warn: false,
    },
  ];

  return {
    totalSubs,
    newThisWeek,
    newLastWeek,
    totalClusters,
    clusters,
    feed,
    pipelineStatus,
    hoursAgo,
    checks,
    lastPublished,
  };
}

type ActivityEvent = {
  type: "cluster" | "sub";
  ts: string;
  label: string;
  sub: string;
  tweetId: string | null;
  ticker: string | null;
};

type Check = {
  id: string;
  label: string;
  desc: string;
  pass: boolean;
  warn: boolean;
};

/* ─────────────────────────────────────────────
   Utility helpers
───────────────────────────────────────────── */

function fmtAge(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h >= 24) return `${Math.floor(h / 24)}d${h % 24}h ago`;
  if (h > 0) return `${h}h${m}m ago`;
  return `${m}m ago`;
}

function fmtDate(ts: string): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
}

const GREEN = "#22C55E";
const AMBER = "#F59E0B";
const RED = "#EF4444";
const DIM = "#787878";
const BORDER = "#1E1E1E";

function pipelineColor(s: "NOMINAL" | "DEGRADED" | "DOWN") {
  if (s === "NOMINAL") return GREEN;
  if (s === "DEGRADED") return AMBER;
  return RED;
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function CheckRow({ check }: { check: Check }) {
  const color = !check.pass && !check.warn ? RED : check.warn ? AMBER : GREEN;
  const glyph = !check.pass && !check.warn ? "✗" : check.warn ? "⚠" : "✓";
  return (
    <div
      className="flex items-center justify-between py-0.5"
      title={check.desc}
    >
      <span className="font-mono text-[10px]" style={{ color: DIM }}>
        {check.label}
      </span>
      <span className="font-mono text-[11px] font-bold" style={{ color }}>
        {glyph} {check.pass ? "PASS" : check.warn ? "WARN" : "FAIL"}
      </span>
    </div>
  );
}

function Block({
  title,
  children,
  titleAttr,
}: {
  title: string;
  children: React.ReactNode;
  titleAttr?: string;
}) {
  return (
    <div
      className="p-3 rounded"
      style={{ border: `1px solid ${BORDER}`, background: "#0F0F0F" }}
    >
      <div
        className="font-mono text-[9px] tracking-widest mb-2 pb-1"
        style={{
          color: DIM,
          borderBottom: `1px solid ${BORDER}`,
          letterSpacing: "0.15em",
        }}
        title={titleAttr}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Metric({
  label,
  value,
  color,
  titleAttr,
}: {
  label: string;
  value: string | number;
  color?: string;
  titleAttr?: string;
}) {
  return (
    <div className="mb-1" title={titleAttr}>
      <span className="font-mono text-[9px]" style={{ color: DIM }}>
        {label}{" "}
      </span>
      <span
        className="font-mono text-sm font-bold"
        style={{ color: color ?? "#fff" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */

export default async function AdminPage() {
  const {
    totalSubs,
    newThisWeek,
    newLastWeek,
    totalClusters,
    clusters,
    feed,
    pipelineStatus,
    hoursAgo,
    checks,
    lastPublished,
  } = await getDashboardData();

  const subsPassCount = checks.filter((c) => c.pass).length;
  const overallOk = subsPassCount === checks.length;
  const overallWarn = !overallOk && checks.some((c) => c.warn || c.pass);

  const weekDelta =
    newLastWeek === 0
      ? newThisWeek > 0
        ? "+∞"
        : "—"
      : newThisWeek >= newLastWeek
      ? `+${newThisWeek - newLastWeek}`
      : `${newThisWeek - newLastWeek}`;

  const topScoreCluster = clusters.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (best: any, c: any) => (c.score > (best?.score ?? -1) ? c : best),
    null
  );

  return (
    <div
      className="min-h-screen font-mono"
      style={{ background: "#0A0A0A", color: "#fff" }}
    >
      {/* ── TOP CHROME ── */}
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${BORDER}`, background: "#080808" }}
      >
        <span className="text-[10px] tracking-widest" style={{ color: DIM }}>
          CLUSTERDESK ADMIN · COCKPIT
        </span>
        <span className="text-[10px]" style={{ color: DIM }}>
          {new Date().toISOString().replace("T", " ").slice(0, 19)} UTC
        </span>
      </div>

      {/* ── STATUS BAR ── */}
      <div
        className="px-4 py-2 text-sm font-bold tracking-wide flex flex-wrap gap-x-4 gap-y-1 items-center"
        style={{ background: "#111", borderBottom: `1px solid ${BORDER}` }}
        title="Top-line system status. Hover individual segments for details."
      >
        <span
          title="Total email subscribers in the database"
          style={{ color: "#fff" }}
        >
          SUBS:{" "}
          <span style={{ color: GREEN }}>{totalSubs}</span>
        </span>
        <span style={{ color: DIM }}>·</span>
        <span
          title={`New subscribers this rolling 7-day window vs previous 7 days (${newLastWeek} last week)`}
          style={{
            color:
              newThisWeek > newLastWeek
                ? GREEN
                : newThisWeek < newLastWeek
                ? AMBER
                : "#fff",
          }}
        >
          {newThisWeek > 0 ? "+" : ""}
          {newThisWeek} THIS WK ({weekDelta} WoW)
        </span>
        <span style={{ color: DIM }}>·</span>
        <span
          title="Total clusters ever published to X + Supabase"
          style={{ color: "#fff" }}
        >
          CLUSTERS:{" "}
          <span style={{ color: GREEN }}>{totalClusters}</span>
        </span>
        <span style={{ color: DIM }}>·</span>
        <span
          title="PIPELINE: Railway cron, 8am CT weekdays. Scrapes OpenInsider, filters micro-cap clusters (≥2 insiders, 5d window, ≥$100K), scores 0-100, publishes to X+Supabase. NOMINAL=<24h. DEGRADED=1-3d. DOWN=3+d — check Railway logs or DRY_RUN env var."
          style={{ color: pipelineColor(pipelineStatus) }}
        >
          PIPELINE: ●{" "}
          {pipelineStatus}
          {hoursAgo !== null ? ` (${hoursAgo}h)` : ""}
        </span>
        <span style={{ color: DIM }}>·</span>
        <span
          title={`System health: ${subsPassCount}/${checks.length} checks passing`}
          style={{
            color: overallOk ? GREEN : overallWarn ? AMBER : RED,
          }}
        >
          HEALTH:{" "}
          {overallOk ? "✓ OK" : overallWarn ? "⚠ WARN" : "✗ DEGRADED"} (
          {subsPassCount}/{checks.length})
        </span>
      </div>

      {/* ── MAIN BODY ── */}
      <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-12 gap-3">
        {/* ── LEFT 8-col: subsystems + clusters ── */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-3">
          {/* Row 1: 4 compact subsystem blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* SUBSCRIBERS */}
            <Block
              title="SUBSCRIBERS"
              titleAttr="Subscriber metrics from email_subscribers table"
            >
              <Metric
                label="TOTAL"
                value={totalSubs}
                color={GREEN}
                titleAttr="All-time email subscriber count"
              />
              <Metric
                label="NEW 7D"
                value={`+${newThisWeek}`}
                color={newThisWeek > 0 ? GREEN : DIM}
                titleAttr="Subscribers acquired in the last 7 days"
              />
              <Metric
                label="PREV 7D"
                value={`+${newLastWeek}`}
                color={DIM}
                titleAttr="Subscribers acquired in the prior 7-day window (for WoW comparison)"
              />
              <Metric
                label="WoW"
                value={weekDelta}
                color={
                  weekDelta.startsWith("+")
                    ? GREEN
                    : weekDelta.startsWith("-")
                    ? RED
                    : DIM
                }
                titleAttr="Week-over-week delta: (this week) minus (last week)"
              />
            </Block>

            {/* CLUSTERS */}
            <Block
              title="CLUSTERS"
              titleAttr="Published cluster metrics from clusters table"
            >
              <Metric
                label="TOTAL"
                value={totalClusters}
                color={GREEN}
                titleAttr="Total clusters ever published to X and Supabase"
              />
              <Metric
                label="LAST PUB"
                value={
                  lastPublished ? fmtAge(lastPublished) : "—"
                }
                color={
                  hoursAgo === null
                    ? RED
                    : hoursAgo < 24
                    ? GREEN
                    : hoursAgo < 72
                    ? AMBER
                    : RED
                }
                titleAttr={
                  lastPublished
                    ? `Published at ${fmtDate(lastPublished)}`
                    : "No clusters published yet"
                }
              />
              <Metric
                label="TOP SCORE"
                value={topScoreCluster ? `${topScoreCluster.score} ${topScoreCluster.ticker}` : "—"}
                color={AMBER}
                titleAttr="Highest scoring cluster ever published (score 0-100)"
              />
              <Metric
                label="RECENT 5"
                value={clusters.slice(0, 5).map((c) => c.ticker).join(" ") || "—"}
                color={DIM}
                titleAttr="Last 5 published tickers in order"
              />
            </Block>

            {/* PIPELINE */}
            <Block
              title="PIPELINE"
              titleAttr="PIPELINE: Railway cron, 8am CT weekdays. Scrapes OpenInsider, filters micro-cap clusters (≥2 insiders, 5d window, ≥$100K), scores 0-100, publishes to X+Supabase. NOMINAL=<24h. DEGRADED=1-3d. DOWN=3+d — check Railway logs or DRY_RUN env var."
            >
              <Metric
                label="STATUS"
                value={pipelineStatus}
                color={pipelineColor(pipelineStatus)}
                titleAttr="NOMINAL <24h · DEGRADED 1-3d · DOWN 3+d"
              />
              <Metric
                label="LAST RUN"
                value={hoursAgo !== null ? `${hoursAgo}h ago` : "UNKNOWN"}
                color={
                  hoursAgo === null
                    ? RED
                    : hoursAgo < 24
                    ? GREEN
                    : hoursAgo < 72
                    ? AMBER
                    : RED
                }
                titleAttr="Hours since most recent cluster was published — proxy for last successful pipeline run"
              />
              <Metric
                label="SCHEDULE"
                value="08:00 CT"
                color={DIM}
                titleAttr="Railway cron fires at 8am US Central Time, weekdays only"
              />
              <Metric
                label="SOURCE"
                value="OPENINSIDER"
                color={DIM}
                titleAttr="Data source: openinsider.com scrape for Form 4 filings"
              />
            </Block>

            {/* OPERATOR CHECKS */}
            <Block
              title="CHECKLIST"
              titleAttr="Binary pass/fail operator checks — hover each row for details"
            >
              {checks.map((c) => (
                <CheckRow key={c.id} check={c} />
              ))}
            </Block>
          </div>

          {/* Row 2: Recent clusters table */}
          <Block
            title="RECENT CLUSTERS (LAST 15)"
            titleAttr="Most recently published clusters, ordered by published_at desc. Score 0-100: higher = stronger cluster signal."
          >
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {[
                      ["TICKER", "Stock ticker symbol"],
                      ["COMPANY", "Company name from payload.company_name"],
                      ["SCORE", "Cluster score 0–100. Higher = more insider conviction."],
                      ["INSIDERS", "Number of insiders in the cluster (payload.insider_count)"],
                      ["VALUE", "Total aggregate buy value USD (payload.total_value_usd)"],
                      ["PUBLISHED", "Timestamp when cluster was published to X + Supabase"],
                      ["LINKS", "External links for this cluster"],
                    ].map(([h, desc]) => (
                      <th
                        key={h}
                        className="text-left pb-1 pr-3 font-normal tracking-wide"
                        style={{ color: DIM }}
                        title={desc}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clusters.slice(0, 15).map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (c: any) => (
                      <tr
                        key={`${c.ticker}-${c.published_at}`}
                        style={{ borderBottom: `1px solid #131313` }}
                        className="hover:bg-[#111] transition-colors"
                      >
                        <td className="py-1 pr-3">
                          <a
                            href={`/buys/${c.ticker}`}
                            className="hover:underline"
                            style={{ color: GREEN }}
                          >
                            {c.ticker}
                          </a>
                        </td>
                        <td
                          className="py-1 pr-3 max-w-[160px] truncate"
                          style={{ color: "#ccc" }}
                          title={c.payload?.company_name ?? ""}
                        >
                          {c.payload?.company_name ?? "—"}
                        </td>
                        <td
                          className="py-1 pr-3 font-bold"
                          style={{
                            color:
                              c.score >= 70
                                ? GREEN
                                : c.score >= 40
                                ? AMBER
                                : RED,
                          }}
                          title={`Score: ${c.score} / 100`}
                        >
                          {c.score}
                        </td>
                        <td
                          className="py-1 pr-3"
                          style={{ color: "#ccc" }}
                          title="Number of insiders in the cluster"
                        >
                          {c.payload?.insider_count ?? "—"}
                        </td>
                        <td
                          className="py-1 pr-3"
                          style={{ color: "#ccc" }}
                          title="Aggregate USD value of cluster buys"
                        >
                          {c.payload?.total_value_usd
                            ? `$${Number(c.payload.total_value_usd).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                            : "—"}
                        </td>
                        <td
                          className="py-1 pr-3"
                          style={{ color: DIM }}
                          title={c.published_at ? fmtDate(c.published_at) : ""}
                        >
                          {c.published_at ? fmtAge(c.published_at) : "—"}
                        </td>
                        <td className="py-1 flex gap-2">
                          {c.twitter_post_id && (
                            <a
                              href={`https://x.com/clusterdesk/status/${c.twitter_post_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: DIM }}
                              className="hover:text-white"
                              title="View X post"
                            >
                              X↗
                            </a>
                          )}
                        </td>
                      </tr>
                    )
                  )}
                  {clusters.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-4 text-center"
                        style={{ color: DIM }}
                      >
                        NO CLUSTERS PUBLISHED
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Block>

          {/* Row 3: Actions */}
          <Block
            title="OPERATOR ACTIONS"
            titleAttr="Destructive or operational actions — all require confirmation or valid input before executing"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div
                  className="text-[9px] tracking-widest mb-1"
                  style={{ color: DIM }}
                  title="Remove subscribers matching test/example email patterns from the database"
                >
                  PURGE TEST SUBSCRIBERS
                </div>
                <PurgeTestSubsButton />
              </div>
              <div>
                <div
                  className="text-[9px] tracking-widest mb-1"
                  style={{ color: DIM }}
                  title="Send a test welcome email via Resend to any address to verify deliverability"
                >
                  TEST WELCOME EMAIL
                </div>
                <SendTestEmailForm />
              </div>
              <div>
                <div
                  className="text-[9px] tracking-widest mb-1"
                  style={{ color: DIM }}
                  title="Trigger ISR revalidation for all published ticker pages + index routes"
                >
                  REVALIDATE TICKER PAGES
                </div>
                <RevalidateButton />
              </div>
            </div>
          </Block>
        </div>

        {/* ── RIGHT 4-col: activity feed + services ── */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
          {/* Activity feed */}
          <Block
            title="ACTIVITY FEED (LAST 20)"
            titleAttr="Merged stream of cluster publishes and subscriber signups, sorted newest first"
          >
            <div className="flex flex-col gap-0.5">
              {feed.length === 0 && (
                <div className="text-[10px]" style={{ color: DIM }}>
                  NO EVENTS
                </div>
              )}
              {feed.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 py-0.5"
                  style={{ borderBottom: `1px solid #131313` }}
                >
                  <span
                    className="text-[9px] font-bold shrink-0 mt-0.5 w-4 text-center"
                    style={{
                      color: ev.type === "cluster" ? GREEN : AMBER,
                    }}
                    title={ev.type === "cluster" ? "Cluster published" : "New subscriber"}
                  >
                    {ev.type === "cluster" ? "C" : "S"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div
                      className="text-[10px] truncate"
                      style={{ color: ev.type === "cluster" ? "#e0e0e0" : "#ccc" }}
                      title={ev.label}
                    >
                      {ev.type === "cluster" ? (
                        <>
                          <span style={{ color: GREEN }}>{ev.ticker}</span>
                          {" "}
                          <span style={{ color: DIM }}>score=</span>
                          {ev.label.split("score=")[1]}
                        </>
                      ) : (
                        <span className="truncate">{ev.label.replace("SUB: ", "")}</span>
                      )}
                    </div>
                    <div
                      className="text-[9px]"
                      style={{ color: DIM }}
                      title={`Full timestamp: ${fmtDate(ev.ts)}`}
                    >
                      {fmtAge(ev.ts)}
                      {ev.tweetId && (
                        <>
                          {" · "}
                          <a
                            href={`https://x.com/clusterdesk/status/${ev.tweetId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white"
                          >
                            X↗
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Block>

          {/* External services */}
          <Block
            title="EXTERNAL SERVICES"
            titleAttr="Quick links to operator dashboards for all integrated services"
          >
            {(
              [
                {
                  id: "railway",
                  label: "RAILWAY",
                  desc: "Worker cron host",
                  href: "https://railway.app",
                  color: GREEN,
                  title:
                    "Railway: hosts the clusterdesk-worker cron job. Check here for pipeline run logs, DRY_RUN env var, and crash alerts.",
                },
                {
                  id: "vercel",
                  label: "VERCEL",
                  desc: "Web + edge",
                  href: "https://vercel.com",
                  color: "#fff",
                  title:
                    "Vercel: hosts clusterdesk-web (Next.js). Check here for build logs, function errors, and env var configuration.",
                },
                {
                  id: "supabase",
                  label: "SUPABASE",
                  desc: "Postgres DB",
                  href: "https://supabase.com",
                  color: GREEN,
                  title:
                    "Supabase: Postgres database holding clusters and email_subscribers. Check here for query performance, RLS policies, and storage.",
                },
                {
                  id: "resend",
                  label: "RESEND",
                  desc: "Email delivery",
                  href: "https://resend.com",
                  color: AMBER,
                  title:
                    "Resend: email delivery service. Check here for bounce rates, delivery logs, and domain DNS verification status.",
                },
                {
                  id: "x",
                  label: "X / TWITTER",
                  desc: "@clusterdesk",
                  href: "https://x.com/clusterdesk",
                  color: "#1d9bf0",
                  title: "X (Twitter): @clusterdesk account. Check follower growth, post engagement, and API rate limit status.",
                },
                {
                  id: "gh-web",
                  label: "GITHUB WEB",
                  desc: "clusterdesk-web",
                  href: "https://github.com/mostlyerror/clusterdesk-web",
                  color: DIM,
                  title: "GitHub: clusterdesk-web repository (Next.js frontend + API routes).",
                },
                {
                  id: "gh-worker",
                  label: "GITHUB WRKR",
                  desc: "clusterdesk-worker",
                  href: "https://github.com/mostlyerror/clusterdesk-worker",
                  color: DIM,
                  title:
                    "GitHub: clusterdesk-worker repository (pipeline: scrape → filter → score → publish).",
                },
              ] as const
            ).map((svc) => (
              <a
                key={svc.id}
                href={svc.href}
                target="_blank"
                rel="noopener noreferrer"
                title={svc.title}
                className="flex items-center justify-between py-1 hover:bg-[#111] px-1 -mx-1 rounded transition-colors"
                style={{ borderBottom: `1px solid #131313` }}
              >
                <div>
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: svc.color }}
                  >
                    {svc.label}
                  </span>
                  <span
                    className="text-[9px] ml-2"
                    style={{ color: DIM }}
                  >
                    {svc.desc}
                  </span>
                </div>
                <span className="text-[9px]" style={{ color: DIM }}>
                  ↗
                </span>
              </a>
            ))}
          </Block>

          {/* Design gallery */}
          <Link
            href="/admin/explore"
            className="block p-3 rounded transition-colors hover:bg-[#111]"
            style={{ border: `1px solid ${BORDER}`, background: "#0F0F0F" }}
            title="Browse all 8 admin dashboard design variants"
          >
            <div
              className="text-[9px] tracking-widest mb-1"
              style={{ color: DIM }}
            >
              DESIGN GALLERY
            </div>
            <div className="text-[11px]" style={{ color: "#ccc" }}>
              8 DASHBOARD VARIANTS →
            </div>
          </Link>
        </div>
      </div>

      {/* ── FOOTNOTE KEY ── */}
      <div
        className="max-w-6xl mx-auto px-4 pb-6 pt-2"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <div
          className="text-[9px] leading-relaxed"
          style={{ color: DIM }}
        >
          <span className="tracking-widest">KEY: </span>
          <span style={{ color: GREEN }}>■</span> GOOD/PASS{" "}
          <span style={{ color: AMBER }}>■</span> WARN/DEGRADED{" "}
          <span style={{ color: RED }}>■</span> FAIL/DOWN{" "}
          ·{" "}
          <span style={{ color: GREEN }}>C</span> = cluster publish event{" "}
          <span style={{ color: AMBER }}>S</span> = subscriber signup event{" "}
          · PIPELINE NOMINAL = last publish &lt;24h ·
          DEGRADED = 1–3d · DOWN = 3+d (check Railway logs or{" "}
          DRY_RUN env var) · SCORE 0–100: ≥70{" "}
          <span style={{ color: GREEN }}>green</span>, 40–69{" "}
          <span style={{ color: AMBER }}>amber</span>, &lt;40{" "}
          <span style={{ color: RED }}>red</span> ·
          WoW = week-over-week new subscriber delta ·
          Hover any label for extended description ·
          Data refreshes on every page load (revalidate=0)
        </div>
      </div>
    </div>
  );
}
