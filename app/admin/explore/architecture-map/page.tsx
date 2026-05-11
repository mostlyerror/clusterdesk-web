import { createAdminClient } from "@/lib/supabase-server";

export const revalidate = 0;

async function getArchData() {
  const db = createAdminClient();

  const now = Date.now();

  const [latestClusterRes, totalClustersRes, publishedClustersRes, totalSubsRes] =
    await Promise.all([
      db
        .from("clusters")
        .select("ticker, published_at, score, created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      db.from("clusters").select("*", { count: "exact", head: true }),
      db
        .from("clusters")
        .select("*", { count: "exact", head: true })
        .not("published_at", "is", null),
      db.from("email_subscribers").select("*", { count: "exact", head: true }),
    ]);

  const latestCluster = latestClusterRes.data;
  const totalRows = totalClustersRes.count ?? 0;
  const publishedCount = publishedClustersRes.count ?? 0;
  const totalSubs = totalSubsRes.count ?? 0;

  const draftCount = Math.max(0, totalRows - publishedCount);

  let pipelineLastRun = "Never";
  let pipelineHealthy = false;
  if (latestCluster?.created_at) {
    const hoursAgo =
      (now - new Date(latestCluster.created_at).getTime()) / (1000 * 60 * 60);
    pipelineLastRun =
      hoursAgo < 24
        ? `${Math.round(hoursAgo)}h ago`
        : `${Math.round(hoursAgo / 24)}d ago`;
    pipelineHealthy = hoursAgo < 48;
  }

  let publisherLastRun = "Never";
  let publisherHealthy = false;
  if (latestCluster?.published_at) {
    const hoursAgo =
      (now - new Date(latestCluster.published_at).getTime()) /
      (1000 * 60 * 60);
    publisherLastRun =
      hoursAgo < 24
        ? `${Math.round(hoursAgo)}h ago`
        : `${Math.round(hoursAgo / 24)}d ago`;
    publisherHealthy = hoursAgo < 72;
  }

  return {
    totalRows,
    publishedCount,
    draftCount,
    totalSubs,
    pipelineLastRun,
    pipelineHealthy,
    publisherLastRun,
    publisherHealthy,
    latestCluster,
  };
}

function Stage({
  label,
  sub,
  metric,
  healthy,
  arrow = true,
}: {
  label: string;
  sub: string;
  metric?: string;
  healthy?: boolean;
  arrow?: boolean;
}) {
  const dotColor =
    healthy === undefined ? "#555" : healthy ? "#22C55E" : "#EF4444";

  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-xl border px-4 py-3 text-center min-w-[100px]"
        style={{ borderColor: "#1f1f1f", background: "#0f0f0f" }}
      >
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: dotColor,
              boxShadow: healthy ? `0 0 4px ${dotColor}` : "none",
            }}
          />
          <p className="text-xs font-semibold">{label}</p>
        </div>
        <p className="text-xs" style={{ color: "#555" }}>
          {sub}
        </p>
        {metric && (
          <p
            className="text-xs font-medium mt-1 tabular-nums"
            style={{ color: "#22C55E" }}
          >
            {metric}
          </p>
        )}
      </div>
      {arrow && (
        <span className="text-xs flex-shrink-0" style={{ color: "#333" }}>
          →
        </span>
      )}
    </div>
  );
}

function Sink({
  label,
  sub,
  metric,
}: {
  label: string;
  sub: string;
  metric?: string;
}) {
  return (
    <div
      className="rounded-xl border px-4 py-3 text-center"
      style={{ borderColor: "#1f1f1f", background: "#0f0f0f" }}
    >
      <p className="text-xs font-semibold mb-0.5">{label}</p>
      <p className="text-xs" style={{ color: "#555" }}>
        {sub}
      </p>
      {metric && (
        <p
          className="text-xs font-medium mt-1 tabular-nums"
          style={{ color: "#22C55E" }}
        >
          {metric}
        </p>
      )}
    </div>
  );
}

export default async function ArchitectureMapPage() {
  const {
    totalRows,
    publishedCount,
    draftCount,
    totalSubs,
    pipelineLastRun,
    pipelineHealthy,
    publisherLastRun,
    publisherHealthy,
    latestCluster,
  } = await getArchData();

  return (
    <div className="text-white">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight">
            Architecture Map
          </h1>
          <p className="text-sm mt-1" style={{ color: "#787878" }}>
            Live pipeline flow with stage metrics
          </p>
        </div>

        {/* Pipeline row */}
        <div className="mb-3">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#555" }}>
            Data pipeline — Railway cron, 8am CT weekdays
          </p>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-0 min-w-max">
              <Stage
                label="OpenInsider"
                sub="HTML scrape"
                healthy={pipelineHealthy}
                metric={pipelineLastRun}
              />
              <Stage label="Scraper" sub="parse filings" healthy={pipelineHealthy} />
              <Stage
                label="Filter"
                sub="micro-cap"
                metric="$50M–$500M"
                healthy={pipelineHealthy}
              />
              <Stage
                label="Cluster"
                sub="≥2 insiders, 5d"
                healthy={pipelineHealthy}
                metric={`${totalRows} rows`}
              />
              <Stage
                label="Scorer"
                sub="0–100"
                healthy={pipelineHealthy}
                metric={`${draftCount} drafts`}
              />
              <Stage
                label="Publisher"
                sub="DRY_RUN guard"
                healthy={publisherHealthy}
                metric={publisherLastRun}
                arrow={false}
              />
            </div>
          </div>
        </div>

        {/* Publisher outputs */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#555" }}>
            Publisher outputs
          </p>
          <div className="flex flex-wrap gap-3">
            <Sink
              label="X Post"
              sub="@clusterdesk"
              metric={publisherHealthy ? "active" : "check account"}
            />
            <Sink
              label="Email (Resend)"
              sub="weekly digest"
              metric={`${totalSubs} subs`}
            />
            <Sink
              label="Ticker Page"
              sub="Supabase + Vercel ISR"
              metric={`${publishedCount} live`}
            />
          </div>
        </div>

        {/* Services */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#555" }}>
            Infrastructure
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: "Railway", role: "Python worker cron", href: "https://railway.app" },
              { name: "Vercel", role: "Next.js web + ISR", href: "https://vercel.com" },
              { name: "Supabase", role: "Postgres database", href: "https://supabase.com" },
              { name: "Resend", role: "Transactional email", href: "https://resend.com" },
              { name: "Porkbun", role: "DNS / domain", href: "https://porkbun.com" },
              { name: "X (Twitter)", role: "@clusterdesk", href: "https://x.com/clusterdesk" },
            ].map((svc) => (
              <a
                key={svc.name}
                href={svc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border px-4 py-3 flex items-start gap-3 group hover:border-[#333] transition-colors"
                style={{ borderColor: "#1a1a1a", background: "#0f0f0f" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold group-hover:text-white transition-colors">
                    {svc.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                    {svc.role}
                  </p>
                </div>
                <span className="text-xs mt-0.5" style={{ color: "#333" }}>
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Database stats */}
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "#1a1a1a", background: "#0f0f0f" }}
        >
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#555" }}>
            Supabase — live counts
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Cluster rows", value: totalRows },
              { label: "Published", value: publishedCount },
              { label: "Drafts", value: draftCount },
              { label: "Subscribers", value: totalSubs },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold tabular-nums">{value}</p>
                <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
          {latestCluster && (
            <div
              className="mt-4 pt-4 border-t text-xs"
              style={{ borderColor: "#1a1a1a", color: "#555" }}
            >
              Last scraped: {latestCluster.ticker} &middot;{" "}
              {new Date(latestCluster.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
