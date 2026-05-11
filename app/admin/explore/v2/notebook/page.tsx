import { createAdminClient } from "@/lib/supabase-server";
import {
  PurgeTestSubscribersButton,
  SendTestEmailForm,
  RevalidateButton,
} from "./AdminControls";

export const revalidate = 0;

/* ─── types ────────────────────────────────────────────────────── */
type Cluster = {
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

type Subscriber = {
  id: string;
  email: string;
  signup_source: string | null;
  created_at: string;
};

type FeedEvent =
  | { kind: "cluster"; at: string; ticker: string; company: string; score: number; postId: string | null }
  | { kind: "signup"; at: string; email: string; source: string | null };

/* ─── data fetching ─────────────────────────────────────────────── */
async function getData() {
  const db = createAdminClient();

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    subsTotal,
    subsThisWeek,
    subsLastWeek,
    recentClusters,
    recentSubs,
    allPublished,
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
      .select("id,ticker,score,published_at,twitter_post_id,payload")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(20),
    db
      .from("email_subscribers")
      .select("id,email,signup_source,created_at")
      .order("created_at", { ascending: false })
      .limit(20),
    db
      .from("clusters")
      .select("*", { count: "exact", head: true })
      .not("published_at", "is", null),
  ]);

  const clusters = (recentClusters.data ?? []) as Cluster[];
  const subs = (recentSubs.data ?? []) as Subscriber[];

  /* merge + sort feed */
  const feed: FeedEvent[] = [
    ...clusters.map(
      (c): FeedEvent => ({
        kind: "cluster",
        at: c.published_at!,
        ticker: c.ticker,
        company: c.payload?.company_name ?? c.ticker,
        score: c.score,
        postId: c.twitter_post_id,
      })
    ),
    ...subs.map(
      (s): FeedEvent => ({
        kind: "signup",
        at: s.created_at,
        email: s.email,
        source: s.signup_source,
      })
    ),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 20);

  const lastCluster = clusters[0] ?? null;

  /* pipeline health heuristic: did anything publish in last 5 weekdays? */
  const daysSinceLastPublish = lastCluster?.published_at
    ? Math.floor(
        (now.getTime() - new Date(lastCluster.published_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 999;

  const pipelineStatus =
    daysSinceLastPublish <= 1
      ? "healthy"
      : daysSinceLastPublish <= 5
      ? "warning"
      : "unknown";

  const subscriberGrowth =
    (subsThisWeek.count ?? 0) >= (subsLastWeek.count ?? 0)
      ? "growing"
      : "shrinking";

  return {
    subscriberCount: subsTotal.count ?? 0,
    newThisWeek: subsThisWeek.count ?? 0,
    newLastWeek: subsLastWeek.count ?? 0,
    subscriberGrowth,
    totalPublished: allPublished.count ?? 0,
    lastCluster,
    daysSinceLastPublish,
    pipelineStatus,
    feed,
  };
}

/* ─── formatting helpers ────────────────────────────────────────── */
function fmt(date: string | null, style: "date" | "datetime" | "ago" = "datetime"): string {
  if (!date) return "never";
  const d = new Date(date);
  if (style === "ago") {
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }
  if (style === "date") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function usd(n: number | undefined): string {
  if (n == null) return "unknown";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

/* ─── small shared primitives ───────────────────────────────────── */
const SectionDivider = () => (
  <hr
    style={{
      border: "none",
      borderTop: "1px solid #1e1e1e",
      margin: "2.5rem 0 2rem",
    }}
  />
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      fontSize: "0.7rem",
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#555",
      marginBottom: "1.1rem",
    }}
  >
    {children}
  </h2>
);

const StatusDot = ({ status }: { status: "healthy" | "warning" | "unknown" | "ok" | "fail" }) => {
  const colors: Record<string, string> = {
    healthy: "#22C55E",
    ok: "#22C55E",
    warning: "#f59e0b",
    unknown: "#787878",
    fail: "#f87171",
  };
  return (
    <span
      style={{
        display: "inline-block",
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        backgroundColor: colors[status] ?? "#787878",
        marginRight: "0.5rem",
        flexShrink: 0,
        marginTop: "0.35rem",
      }}
    />
  );
};

const Prose = ({ children, dim }: { children: React.ReactNode; dim?: boolean }) => (
  <p
    style={{
      fontSize: "0.9rem",
      lineHeight: "1.75",
      color: dim ? "#787878" : "#d4d4d4",
      margin: "0 0 0.6rem",
    }}
  >
    {children}
  </p>
);

/* ─── page ──────────────────────────────────────────────────────── */
export default async function AdminPage() {
  const {
    subscriberCount,
    newThisWeek,
    newLastWeek,
    subscriberGrowth,
    totalPublished,
    lastCluster,
    daysSinceLastPublish,
    pipelineStatus,
    feed,
  } = await getData();

  const lastCompany = lastCluster?.payload?.company_name ?? lastCluster?.ticker ?? "—";
  const lastScore = lastCluster?.score ?? "—";

  const growthDelta = newThisWeek - newLastWeek;
  const growthSign = growthDelta >= 0 ? "+" : "";

  /* checklist items */
  const checks: { label: string; pass: boolean; note: string }[] = [
    {
      label: "Pipeline ran recently",
      pass: pipelineStatus === "healthy",
      note:
        pipelineStatus === "healthy"
          ? `Last publish was ${fmt(lastCluster?.published_at ?? null, "ago")}.`
          : daysSinceLastPublish < 999
          ? `Last publish was ${daysSinceLastPublish}d ago — check Railway logs.`
          : "No published clusters found — pipeline may never have run.",
    },
    {
      label: "Subscribers growing",
      pass: subscriberGrowth === "growing",
      note:
        subscriberGrowth === "growing"
          ? `${newThisWeek} new this week vs ${newLastWeek} last week.`
          : `${newThisWeek} new this week vs ${newLastWeek} last week — growth stalled.`,
    },
    {
      label: "Content live on site",
      pass: totalPublished > 0,
      note:
        totalPublished > 0
          ? `${totalPublished} cluster${totalPublished !== 1 ? "s" : ""} published and accessible at /buys/:ticker.`
          : "No published clusters — /buys pages will be empty.",
    },
    {
      label: "Email configured (RESEND_API_KEY)",
      pass: !!process.env.RESEND_API_KEY,
      note: process.env.RESEND_API_KEY
        ? "RESEND_API_KEY is set in the environment."
        : "RESEND_API_KEY is missing — welcome emails will fail silently.",
    },
    {
      label: "Supabase service key present",
      pass: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      note: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? "SUPABASE_SERVICE_ROLE_KEY is set."
        : "SUPABASE_SERVICE_ROLE_KEY missing — admin queries will fail.",
    },
  ];

  const allPass = checks.every((c) => c.pass);

  return (
    <div
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "3.5rem 1.5rem 6rem",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "#d4d4d4",
        background: "#0A0A0A",
        minHeight: "100vh",
      }}
    >
      {/* ── Header ── */}
      <div style={{ marginBottom: "2.75rem" }}>
        <p style={{ fontSize: "0.72rem", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          ClusterDesk — internal operator document
        </p>
        <h1
          style={{
            fontSize: "1.45rem",
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Handoff Notes
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#555", marginTop: "0.4rem" }}>
          Read this top-to-bottom when returning after time away. Every section answers &ldquo;what is this, is it healthy, what do I do if it breaks?&rdquo;
        </p>
      </div>

      {/* ── 1. Pipeline Status ── */}
      <SectionHeading>## Pipeline Status</SectionHeading>

      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <StatusDot status={pipelineStatus} />
        <Prose>
          {pipelineStatus === "healthy" && (
            <>
              The pipeline last ran{" "}
              <strong style={{ color: "#fff" }}>{fmt(lastCluster?.published_at ?? null, "ago")}</strong> and published{" "}
              <strong style={{ color: "#22C55E" }}>{lastCompany}</strong> (score {lastScore}). This is healthy.
            </>
          )}
          {pipelineStatus === "warning" && (
            <>
              The pipeline last published{" "}
              <strong style={{ color: "#f59e0b" }}>{daysSinceLastPublish} days ago</strong> ({lastCompany}, score {lastScore}).
              That is within tolerance if today is a weekend or holiday, but worth a check if it is a weekday.
            </>
          )}
          {pipelineStatus === "unknown" && (
            <>
              No recent publishes found.{" "}
              <strong style={{ color: "#f87171" }}>The pipeline may be down or has never run.</strong>{" "}
              Check Railway logs immediately.
            </>
          )}
        </Prose>
      </div>

      <details style={{ marginBottom: "1.5rem" }}>
        <summary
          style={{
            fontSize: "0.78rem",
            color: "#555",
            cursor: "pointer",
            userSelect: "none",
            marginBottom: "0.75rem",
          }}
        >
          Context &amp; troubleshooting
        </summary>
        <div
          style={{
            borderLeft: "2px solid #222",
            paddingLeft: "1rem",
            marginTop: "0.75rem",
          }}
        >
          <Prose dim>
            The Railway cron job (<code style={{ color: "#bbb", fontSize: "0.8rem" }}>clusterdesk-worker</code>) runs daily at{" "}
            <strong style={{ color: "#bbb" }}>8 am CT on weekdays</strong>. It fetches HTML from OpenInsider and parses recent Form 4 filings. It then filters for U.S. micro-cap
            stocks ($50M–$500M market cap) where at least 2 insiders bought within a 5-day window, with a total purchase value of $100K or more. That group of purchases is called a &ldquo;cluster.&rdquo;
          </Prose>
          <Prose dim>
            Each cluster is scored 0–100 (higher = more convincing cluster based on number of insiders, total value, how tightly packed the purchase dates are, and whether executives vs. directors bought).
            Clusters above the score threshold are published: a tweet goes out from @clusterdesk, and a row is written to the <code style={{ color: "#bbb", fontSize: "0.8rem" }}>clusters</code> Supabase table.
          </Prose>
          <Prose dim>
            <strong style={{ color: "#bbb" }}>If DEGRADED or DOWN:</strong> SSH into Railway, open the latest cron run, and check the logs for Python tracebacks or HTTP errors.
            The most common failure modes are (1) OpenInsider HTML structure changed — update the scraper selectors, (2) Supabase insert error — check RLS policies or schema drift,
            (3) Twitter API rate-limit or credential expiry — rotate keys in Railway env vars. Make sure <code style={{ color: "#bbb", fontSize: "0.8rem" }}>DRY_RUN=false</code> is set or nothing will actually publish.
          </Prose>
        </div>
      </details>

      <SectionDivider />

      {/* ── 2. Subscribers ── */}
      <SectionHeading>## Subscribers</SectionHeading>

      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <StatusDot status={subscriberGrowth === "growing" ? "healthy" : "warning"} />
        <Prose>
          There are currently{" "}
          <strong style={{ color: "#fff" }}>{subscriberCount.toLocaleString()} subscribers</strong>.{" "}
          This week brought in <strong style={{ color: "#fff" }}>{newThisWeek}</strong> new signups
          vs. {newLastWeek} last week (<strong style={{ color: growthDelta >= 0 ? "#22C55E" : "#f87171" }}>{growthSign}{growthDelta}</strong>).{" "}
          {subscriberGrowth === "growing"
            ? "Growth is positive — organic and social channels are working."
            : "Growth slowed this week. Not an emergency, but worth noting if it persists."}
        </Prose>
      </div>

      <details style={{ marginBottom: "1rem" }}>
        <summary style={{ fontSize: "0.78rem", color: "#555", cursor: "pointer", userSelect: "none", marginBottom: "0.75rem" }}>
          Context &amp; troubleshooting
        </summary>
        <div style={{ borderLeft: "2px solid #222", paddingLeft: "1rem", marginTop: "0.75rem" }}>
          <Prose dim>
            Subscribers come from the homepage signup form (source: <code style={{ color: "#bbb", fontSize: "0.8rem" }}>homepage</code>) and
            from individual ticker pages (source: <code style={{ color: "#bbb", fontSize: "0.8rem" }}>ticker_page</code>).
            They are stored in the <code style={{ color: "#bbb", fontSize: "0.8rem" }}>email_subscribers</code> table.
            Welcome emails are sent via Resend when a row is inserted (triggered by a Supabase edge function or the API route — check <code style={{ color: "#bbb", fontSize: "0.8rem" }}>app/api/subscribe</code>).
          </Prose>
          <Prose dim>
            <strong style={{ color: "#bbb" }}>If growth stalls for more than 2 weeks:</strong> check that the signup forms on the homepage and ticker pages are rendering correctly (not a JS error),
            that the Supabase insert is succeeding (no RLS block), and that the welcome email is not landing in spam (send a test below).
          </Prose>
        </div>
      </details>

      <div
        style={{
          borderLeft: "2px solid #222",
          paddingLeft: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <p style={{ fontSize: "0.78rem", color: "#787878", marginBottom: "0.75rem" }}>
          Actions:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div>
            <p style={{ fontSize: "0.78rem", color: "#787878", margin: "0 0 0.35rem" }}>
              Send a test welcome email to verify Resend is working end-to-end:
            </p>
            <SendTestEmailForm />
          </div>
          <div>
            <p style={{ fontSize: "0.78rem", color: "#787878", margin: "0 0 0.35rem" }}>
              Remove test/fake subscribers (emails matching test@, @test., @example., @mailinator., +test):
            </p>
            <PurgeTestSubscribersButton />
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* ── 3. Activity Feed ── */}
      <SectionHeading>## Activity Feed — last 20 events</SectionHeading>

      <Prose dim>
        Cluster publishes and subscriber signups merged and sorted by time. This is the firehose view — useful for confirming the pipeline actually fired and that signups are coming in.
      </Prose>

      {feed.length === 0 ? (
        <Prose dim>No events recorded yet. Once the pipeline runs and people subscribe, events will appear here.</Prose>
      ) : (
        <div style={{ marginTop: "0.75rem" }}>
          {feed.map((event, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "0.45rem 0",
                borderBottom: "1px solid #151515",
                gap: "1rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.83rem",
                  color: event.kind === "cluster" ? "#d4d4d4" : "#787878",
                  lineHeight: 1.5,
                }}
              >
                {event.kind === "cluster" ? (
                  <>
                    <span style={{ color: "#22C55E", fontWeight: 600, fontFamily: "monospace" }}>
                      {event.ticker}
                    </span>{" "}
                    published — {event.company}, score {event.score}
                    {event.postId && (
                      <>
                        {" "}
                        <a
                          href={`https://x.com/clusterdesk/status/${event.postId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#555", fontSize: "0.75rem", textDecoration: "none" }}
                        >
                          ↗ X
                        </a>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span style={{ color: "#555" }}>subscriber</span> {event.email}
                    {event.source && (
                      <span style={{ color: "#444", fontSize: "0.75rem" }}> via {event.source}</span>
                    )}
                  </>
                )}
              </span>
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "#444",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {fmt(event.at, "ago")}
              </span>
            </div>
          ))}
        </div>
      )}

      <SectionDivider />

      {/* ── 4. Operator Checklist ── */}
      <SectionHeading>## Operator Checklist</SectionHeading>

      <Prose dim>
        {allPass
          ? "Everything looks good. All checks pass."
          : "One or more checks failed. Read the notes and address before closing this tab."}
      </Prose>

      <div style={{ marginTop: "0.75rem", marginBottom: "1.5rem" }}>
        {checks.map((check, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              padding: "0.55rem 0",
              borderBottom: "1px solid #151515",
            }}
          >
            <StatusDot status={check.pass ? "ok" : "fail"} />
            <div>
              <p style={{ fontSize: "0.85rem", color: check.pass ? "#d4d4d4" : "#f87171", margin: 0, fontWeight: 500 }}>
                {check.label}
              </p>
              <p style={{ fontSize: "0.78rem", color: "#787878", margin: "0.15rem 0 0" }}>
                {check.note}
              </p>
            </div>
          </div>
        ))}
      </div>

      <SectionDivider />

      {/* ── 5. Content & Site ── */}
      <SectionHeading>## Content &amp; Site</SectionHeading>

      <Prose>
        <strong style={{ color: "#fff" }}>{totalPublished} clusters</strong> have been published and are live on the site.
        Each cluster has its own page at <code style={{ fontSize: "0.82rem", color: "#bbb" }}>/buys/:ticker</code> with the filing details, insider names, and purchase amounts.
        Pages are ISR-cached by Vercel — if you update a cluster row in Supabase but don&apos;t see the change live, revalidate below.
      </Prose>

      <details style={{ marginBottom: "1rem" }}>
        <summary style={{ fontSize: "0.78rem", color: "#555", cursor: "pointer", userSelect: "none", marginBottom: "0.75rem" }}>
          Context &amp; troubleshooting
        </summary>
        <div style={{ borderLeft: "2px solid #222", paddingLeft: "1rem", marginTop: "0.75rem" }}>
          <Prose dim>
            Vercel uses ISR (Incremental Static Regeneration) for ticker pages — they are statically rendered and then revalidated on a schedule or on-demand.
            The <code style={{ color: "#bbb", fontSize: "0.8rem" }}>revalidate</code> export in each page file controls the TTL.
            If you manually edit a cluster row in the Supabase dashboard, Vercel won&apos;t know until the TTL expires or you trigger a revalidation.
          </Prose>
          <Prose dim>
            The homepage (<code style={{ color: "#bbb", fontSize: "0.8rem" }}>/</code>) and the{" "}
            <code style={{ color: "#bbb", fontSize: "0.8rem" }}>/buys</code> index are also revalidated by the button below.
          </Prose>
        </div>
      </details>

      <div style={{ borderLeft: "2px solid #222", paddingLeft: "1rem", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "0.78rem", color: "#787878", margin: "0 0 0.5rem" }}>
          Force Vercel to rebuild all cached ticker pages on next request:
        </p>
        <RevalidateButton />
      </div>

      <SectionDivider />

      {/* ── 6. External Services ── */}
      <SectionHeading>## External Services</SectionHeading>

      <Prose dim>
        All the services this product depends on. Bookmark these. The descriptions explain what each one actually does and what breaks if it goes down.
      </Prose>

      {[
        {
          label: "Railway",
          href: "https://railway.app",
          desc: "Runs the Python worker cron (clusterdesk-worker). This is the engine — it scrapes OpenInsider, scores clusters, and publishes to X + Supabase. Runs daily at 8 am CT on weekdays. If this is down, no new content is published.",
        },
        {
          label: "Vercel",
          href: "https://vercel.com",
          desc: "Hosts the Next.js web app (clusterdesk-web). Handles ISR for ticker pages, all API routes, and this admin panel. If Vercel is down, the entire public site is unavailable. Check the Vercel dashboard for failed deployments or function errors.",
        },
        {
          label: "Supabase",
          href: "https://supabase.com",
          desc: "Postgres database. Stores clusters (published tickers with payload) and email_subscribers. The worker writes to it; the web app reads from it. If Supabase is degraded, ticker pages will fail to load and subscriber signups will fail silently.",
        },
        {
          label: "Resend",
          href: "https://resend.com",
          desc: "Transactional email provider. Sends welcome emails to new subscribers from hey@clusterdesk.io. Check delivery logs here if subscribers report not receiving welcome emails. Bounce and spam rates live here too.",
        },
        {
          label: "GitHub — web (clusterdesk-web)",
          href: "https://github.com/mostlyerror/clusterdesk-web",
          desc: "Source for this Next.js app. Pushing to main auto-deploys to Vercel. All admin, frontend, and API code lives here.",
        },
        {
          label: "GitHub — worker (clusterdesk-worker)",
          href: "https://github.com/mostlyerror/clusterdesk-worker",
          desc: "Source for the Python scraper + publisher. Pushing to main auto-deploys to Railway. Scraper logic, scoring algorithm, and Twitter integration all live here.",
        },
        {
          label: "X / Twitter — @clusterdesk",
          href: "https://x.com/clusterdesk",
          desc: "The public-facing account. Each cluster publish drops a tweet here with the ticker, insider count, and total value. Follower growth is a leading indicator of product-market fit. Check this after the pipeline runs to confirm tweets are going out.",
        },
      ].map((svc) => (
        <div
          key={svc.href}
          style={{
            padding: "0.75rem 0",
            borderBottom: "1px solid #151515",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.2rem" }}>
            <a
              href={svc.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "#fff",
                textDecoration: "none",
              }}
            >
              {svc.label}
              <span style={{ color: "#555", marginLeft: "0.3rem", fontWeight: 400 }}>↗</span>
            </a>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#787878", margin: 0, lineHeight: 1.65 }}>
            {svc.desc}
          </p>
        </div>
      ))}

      {/* ── Footer note ── */}
      <div style={{ marginTop: "3rem" }}>
        <p style={{ fontSize: "0.72rem", color: "#333", lineHeight: 1.7 }}>
          This document is generated fresh on every load (revalidate = 0). Numbers are live from Supabase.
          If something looks wrong, hard-refresh before debugging.
          Last rendered: {new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}.
        </p>
      </div>
    </div>
  );
}
