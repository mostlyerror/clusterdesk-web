import { createAdminClient } from "@/lib/supabase-server";
import { AdminControls } from "./AdminControls";

export const revalidate = 0;

async function getAdminStats() {
  const db = createAdminClient();

  const [subscribersRes, clustersRes, publishedClustersRes] = await Promise.all(
    [
      db
        .from("email_subscribers")
        .select("email, signup_source, created_at")
        .order("created_at", { ascending: false }),
      db
        .from("clusters")
        .select("id, ticker, published_at, created_at")
        .order("created_at", { ascending: false })
        .limit(1000),
      db
        .from("clusters")
        .select("ticker, published_at")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .limit(1),
    ]
  );

  const subscribers = subscribersRes.data ?? [];
  const allClusters = clustersRes.data ?? [];
  const lastPublished = publishedClustersRes.data?.[0] ?? null;

  const sourceCounts: Record<string, number> = {};
  for (const s of subscribers) {
    const src = (s.signup_source as string | null) ?? "unknown";
    sourceCounts[src] = (sourceCounts[src] ?? 0) + 1;
  }

  const filingCount = allClusters.length;
  const lastScrapeAt = allClusters[0]?.created_at ?? null;
  const uniqueTickers = new Set(allClusters.map((c) => c.ticker)).size;

  return {
    subscriberCount: subscribers.length,
    sourceCounts,
    lastPublishedTicker: lastPublished?.ticker ?? null,
    lastPublishedAt: lastPublished?.published_at ?? null,
    filingCount,
    clusterCount: uniqueTickers,
    lastScrapeAt,
  };
}

export type AdminStats = Awaited<ReturnType<typeof getAdminStats>>;

export default async function LeversKnobsPage() {
  const stats = await getAdminStats();

  return (
    <div className="text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight">
            Levers &amp; Knobs
          </h1>
          <p className="text-sm mt-1" style={{ color: "#787878" }}>
            Control panel &mdash; actions, not observations
          </p>
        </div>
        <AdminControls stats={stats} />
      </div>
    </div>
  );
}
