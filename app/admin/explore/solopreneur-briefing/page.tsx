import { createAdminClient } from "@/lib/supabase-server";

export const revalidate = 0;

async function getBriefingData() {
  const db = createAdminClient();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [
    totalSubsRes,
    thisWeekSubsRes,
    lastWeekSubsRes,
    thisWeekClustersRes,
    lastWeekClustersRes,
    recentClustersRes,
  ] = await Promise.all([
    db.from("email_subscribers").select("*", { count: "exact", head: true }),
    db
      .from("email_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    db
      .from("email_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", fourteenDaysAgo)
      .lt("created_at", sevenDaysAgo),
    db
      .from("clusters")
      .select("*", { count: "exact", head: true })
      .not("published_at", "is", null)
      .gte("published_at", sevenDaysAgo),
    db
      .from("clusters")
      .select("*", { count: "exact", head: true })
      .not("published_at", "is", null)
      .gte("published_at", fourteenDaysAgo)
      .lt("published_at", sevenDaysAgo),
    db
      .from("clusters")
      .select("ticker, score, published_at, payload")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(5),
  ]);

  const totalSubs = totalSubsRes.count ?? 0;
  const thisWeekSubs = thisWeekSubsRes.count ?? 0;
  const lastWeekSubs = lastWeekSubsRes.count ?? 0;
  const thisWeekClusters = thisWeekClustersRes.count ?? 0;
  const lastWeekClusters = lastWeekClustersRes.count ?? 0;
  const recentClusters = recentClustersRes.data ?? [];

  const subDelta = thisWeekSubs - lastWeekSubs;
  const clusterDelta = thisWeekClusters - lastWeekClusters;

  // Action items
  const actions: string[] = [];
  if (totalSubs < 50) actions.push("Grow email list — share the subscribe link on X");
  if (thisWeekClusters === 0) actions.push("No clusters published this week — check if pipeline is running");
  if (thisWeekSubs === 0 && totalSubs > 0) actions.push("No new subscribers this week — consider posting content on X");
  if (totalSubs >= 250) actions.push("Consider launching the weekly email digest");

  return {
    totalSubs,
    thisWeekSubs,
    lastWeekSubs,
    subDelta,
    thisWeekClusters,
    lastWeekClusters,
    clusterDelta,
    recentClusters,
    actions,
    briefingDate: now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

function delta(n: number) {
  if (n > 0) return <span style={{ color: "#22C55E" }}>↑{n}</span>;
  if (n < 0) return <span style={{ color: "#EF4444" }}>↓{Math.abs(n)}</span>;
  return <span style={{ color: "#787878" }}>flat</span>;
}

export default async function SolopreneurBriefingPage() {
  const {
    totalSubs,
    thisWeekSubs,
    subDelta,
    thisWeekClusters,
    clusterDelta,
    recentClusters,
    actions,
    briefingDate,
  } = await getBriefingData();

  return (
    <div className="text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#555" }}>
            {briefingDate}
          </p>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            ClusterDesk Briefing
          </h1>
          <p style={{ color: "#787878" }} className="text-sm">
            Your daily snapshot.
          </p>
        </div>

        {/* The numbers */}
        <section className="mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#555" }}
          >
            Your numbers
          </p>
          <div className="space-y-4">
            <div
              className="rounded-xl border px-5 py-4 flex items-center justify-between"
              style={{ borderColor: "#1a1a1a", background: "#0f0f0f" }}
            >
              <div>
                <p className="text-3xl font-bold tabular-nums">{totalSubs}</p>
                <p className="text-sm mt-0.5" style={{ color: "#787878" }}>
                  email subscribers
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm tabular-nums">{delta(subDelta)}</p>
                <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                  {thisWeekSubs} new this week
                </p>
              </div>
            </div>

            <div
              className="rounded-xl border px-5 py-4 flex items-center justify-between"
              style={{ borderColor: "#1a1a1a", background: "#0f0f0f" }}
            >
              <div>
                <p className="text-3xl font-bold tabular-nums">
                  {thisWeekClusters}
                </p>
                <p className="text-sm mt-0.5" style={{ color: "#787878" }}>
                  clusters published this week
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm tabular-nums">{delta(clusterDelta)}</p>
                <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                  vs last week
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Goal tracker */}
        <section className="mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#555" }}
          >
            Progress toward launch goals
          </p>
          <div className="space-y-3">
            <GoalBar label="X followers" current={0} target={500} note="Target: 500 by week 8" />
            <GoalBar label="Email subscribers" current={totalSubs} target={250} note="Target: 250 by week 8" />
          </div>
        </section>

        {/* What went out */}
        {recentClusters.length > 0 && (
          <section className="mb-8">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#555" }}
            >
              Recent publishes
            </p>
            <div className="space-y-2">
              {recentClusters.map((c, i) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const payload = c.payload as any;
                const company =
                  typeof payload?.company_name === "string"
                    ? payload.company_name
                    : c.ticker;
                return (
                  <div
                    key={`${c.ticker}-${i}`}
                    className="flex items-center gap-3 text-sm"
                  >
                    <a
                      href={`/buys/${c.ticker}`}
                      className="font-mono font-semibold hover:underline"
                      style={{ color: "#22C55E" }}
                    >
                      {c.ticker}
                    </a>
                    <span style={{ color: "#555" }}>—</span>
                    <span style={{ color: "#ccc" }}>{company}</span>
                    <span style={{ color: "#555" }} className="ml-auto text-xs tabular-nums">
                      score {c.score}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Action items */}
        {actions.length > 0 && (
          <section className="mb-8">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#555" }}
            >
              Today&apos;s action items
            </p>
            <div className="space-y-2">
              {actions.map((action, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="text-xs mt-0.5 flex-shrink-0 font-mono"
                    style={{ color: "#F59E0B" }}
                  >
                    →
                  </span>
                  <p className="text-sm" style={{ color: "#ccc" }}>
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {actions.length === 0 && (
          <div
            className="rounded-xl border px-5 py-4 text-center"
            style={{ borderColor: "rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.05)" }}
          >
            <p className="text-sm font-medium" style={{ color: "#22C55E" }}>
              Nothing urgent today — keep shipping.
            </p>
          </div>
        )}

        {/* Service links */}
        <div className="mt-10 pt-6 border-t" style={{ borderColor: "#1a1a1a" }}>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Railway", href: "https://railway.app" },
              { label: "Vercel", href: "https://vercel.com" },
              { label: "Supabase", href: "https://supabase.com" },
              { label: "Resend", href: "https://resend.com" },
              { label: "@clusterdesk", href: "https://x.com/clusterdesk" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs transition-colors hover:text-white"
                style={{ color: "#444" }}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalBar({
  label,
  current,
  target,
  note,
}: {
  label: string;
  current: number;
  target: number;
  note?: string;
}) {
  const pct = Math.min((current / target) * 100, 100);
  const color = pct >= 100 ? "#22C55E" : pct >= 60 ? "#F59E0B" : "#3B82F6";

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm">{label}</span>
        <span className="text-sm tabular-nums" style={{ color }}>
          {current} / {target}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 6, background: "#1a1a1a" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {note && (
        <p className="text-xs mt-1" style={{ color: "#555" }}>
          {note}
        </p>
      )}
    </div>
  );
}
