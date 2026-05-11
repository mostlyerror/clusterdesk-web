import { createAdminClient } from "@/lib/supabase-server";

export const revalidate = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClusterPayload = Record<string, any>;

interface Filing {
  insider_name?: string;
  title?: string;
  trade_date?: string;
  value?: number;
}

interface Cluster {
  id: string;
  ticker: string;
  score: number;
  published_at: string;
  twitter_post_id: string | null;
  payload: ClusterPayload;
}

async function getClusters(): Promise<{
  clusters: Cluster[];
  totalPublished: number;
  avgScore: number;
  bestScore: number;
}> {
  const db = createAdminClient();

  const { data, count } = await db
    .from("clusters")
    .select("id, ticker, score, published_at, twitter_post_id, payload", {
      count: "exact",
    })
    .not("published_at", "is", null)
    .order("score", { ascending: false })
    .limit(100);

  const clusters = (data ?? []) as Cluster[];
  const totalPublished = count ?? 0;
  const scores = clusters.map((c) => Number(c.score ?? 0));
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

  return { clusters, totalPublished, avgScore, bestScore };
}

function fmt(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ScoreBar({ score }: { score: number }) {
  const clamped = Math.min(100, Math.max(0, score));
  const color = clamped >= 70 ? "#22C55E" : clamped >= 40 ? "#EAB308" : "#EF4444";
  return (
    <div className="flex items-center gap-3">
      <span className="text-4xl font-bold tabular-nums" style={{ color }}>
        {score}
      </span>
      <div className="flex-1 min-w-0">
        <div
          className="rounded-full overflow-hidden"
          style={{ height: 6, background: "#1a1a1a" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${clamped}%`, background: color }}
          />
        </div>
        <p className="text-xs mt-1" style={{ color: "#787878" }}>
          score / 100
        </p>
      </div>
    </div>
  );
}

function FilingRow({ filing }: { filing: Filing }) {
  return (
    <div
      className="flex items-start justify-between gap-3 py-2 border-b"
      style={{ borderColor: "#1a1a1a" }}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">
          {filing.insider_name ?? "Unknown insider"}
        </p>
        {filing.title && (
          <p className="text-xs truncate" style={{ color: "#787878" }}>
            {filing.title}
          </p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        {filing.value != null && (
          <p className="text-sm font-medium tabular-nums" style={{ color: "#22C55E" }}>
            {fmt(filing.value)}
          </p>
        )}
        {filing.trade_date && (
          <p className="text-xs tabular-nums" style={{ color: "#787878" }}>
            {fmtDate(filing.trade_date)}
          </p>
        )}
      </div>
    </div>
  );
}

function ClusterCard({ cluster }: { cluster: Cluster }) {
  const p = cluster.payload ?? {};
  const companyName: string =
    typeof p.company_name === "string" ? p.company_name : cluster.ticker;
  const insiderCount: number = Number(p.insider_count ?? 0);
  const totalValue: number = Number(p.total_value_usd ?? 0);
  const clusterStart: string | null =
    typeof p.cluster_start_date === "string" ? p.cluster_start_date : null;
  const clusterEnd: string | null =
    typeof p.cluster_end_date === "string" ? p.cluster_end_date : null;
  const filings: Filing[] = Array.isArray(p.filings) ? p.filings : [];

  const dateRange =
    clusterStart && clusterEnd
      ? `${fmtDate(clusterStart)} – ${fmtDate(clusterEnd)}`
      : clusterStart
      ? `From ${fmtDate(clusterStart)}`
      : null;

  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: "#1e1e1e", background: "#111" }}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <a
              href={`/buys/${cluster.ticker}`}
              className="font-mono text-lg font-bold hover:underline"
              style={{ color: "#22C55E" }}
            >
              {cluster.ticker}
            </a>
            <span
              className="text-xs px-1.5 py-0.5 rounded font-medium"
              style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E" }}
            >
              Published
            </span>
          </div>
          <p className="text-sm truncate" style={{ color: "#ccc" }}>
            {companyName}
          </p>
          {dateRange && (
            <p className="text-xs mt-0.5" style={{ color: "#787878" }}>
              {dateRange}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0 text-xs">
          <a
            href={`/buys/${cluster.ticker}`}
            className="hover:text-white transition-colors"
            style={{ color: "#787878" }}
          >
            Page ↗
          </a>
          {cluster.twitter_post_id && (
            <a
              href={`https://x.com/clusterdesk/status/${cluster.twitter_post_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: "#787878" }}
            >
              X post ↗
            </a>
          )}
        </div>
      </div>

      <div className="mb-4">
        <ScoreBar score={Number(cluster.score ?? 0)} />
      </div>

      <div
        className="flex gap-4 text-sm mb-4 pb-4 border-b"
        style={{ borderColor: "#1a1a1a" }}
      >
        <div>
          <p className="text-xs" style={{ color: "#787878" }}>Insiders</p>
          <p className="font-medium tabular-nums">{insiderCount}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "#787878" }}>Total value</p>
          <p className="font-medium tabular-nums">{fmt(totalValue)}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "#787878" }}>Published</p>
          <p className="font-medium">{fmtDate(cluster.published_at)}</p>
        </div>
      </div>

      {filings.length > 0 ? (
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: "#787878" }}>
            Filings ({filings.length})
          </p>
          <div>
            {filings.map((f, i) => (
              <FilingRow
                key={`${f.insider_name ?? "unknown"}-${f.trade_date ?? i}`}
                filing={f}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs" style={{ color: "#787878" }}>
          No filing detail available
        </p>
      )}
    </div>
  );
}

export default async function DeepClustersPage() {
  const { clusters, totalPublished, avgScore, bestScore } = await getClusters();

  return (
    <div className="text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight">Deep Clusters</h1>
          <p className="text-sm mt-1" style={{ color: "#787878" }}>
            Quality review — published signals sorted by score
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total published", value: totalPublished },
            { label: "Avg score", value: avgScore },
            { label: "Best score", value: bestScore },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border px-4 py-4"
              style={{ borderColor: "#1e1e1e", background: "#111" }}
            >
              <p className="text-xs mb-1" style={{ color: "#787878" }}>
                {label}
              </p>
              <p className="text-2xl font-bold tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        {clusters.length === 0 ? (
          <p className="text-sm" style={{ color: "#787878" }}>
            No published clusters yet.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {clusters.map((cluster) => (
              <ClusterCard key={cluster.id} cluster={cluster} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
