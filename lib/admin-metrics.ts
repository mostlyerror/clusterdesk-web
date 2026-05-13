export interface SubscriberMetricRow {
  signup_source: string | null;
  created_at: string;
}

export interface ClusterDistributionRow {
  ticker: string;
  score: number;
  published_at: string | null;
  twitter_post_id: string | null;
}

export interface SourceMetric {
  source: string;
  count: number;
  share: number;
}

export interface GrowthMetric {
  current: number;
  previous: number;
  delta: number;
  deltaPct: number | null;
}

export interface DistributionMetrics {
  publishedClusters: number;
  postedToX: number;
  missingXPosts: number;
  xPostRate: number;
  highScoreMissingX: string[];
}

export function summarizeSubscriberSources(rows: SubscriberMetricRow[]): SourceMetric[] {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const source = normalizeSource(row.signup_source);
    counts.set(source, (counts.get(source) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([source, count]) => ({
      source,
      count,
      share: rows.length === 0 ? 0 : count / rows.length,
    }))
    .sort((a, b) => b.count - a.count || a.source.localeCompare(b.source));
}

export function calculateGrowth(
  rows: SubscriberMetricRow[],
  now: Date = new Date()
): GrowthMetric {
  const currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const previousStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  let current = 0;
  let previous = 0;

  for (const row of rows) {
    const createdAt = new Date(row.created_at);
    if (createdAt >= currentStart && createdAt <= now) {
      current++;
    } else if (createdAt >= previousStart && createdAt < currentStart) {
      previous++;
    }
  }

  const delta = current - previous;
  const deltaPct = previous === 0 ? null : delta / previous;

  return { current, previous, delta, deltaPct };
}

export function summarizeDistribution(rows: ClusterDistributionRow[]): DistributionMetrics {
  const published = rows.filter((row) => row.published_at);
  const missingX = published.filter((row) => !row.twitter_post_id);

  return {
    publishedClusters: published.length,
    postedToX: published.length - missingX.length,
    missingXPosts: missingX.length,
    xPostRate: published.length === 0 ? 0 : (published.length - missingX.length) / published.length,
    highScoreMissingX: missingX
      .filter((row) => row.score >= 70)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((row) => row.ticker),
  };
}

function normalizeSource(source: string | null): string {
  const trimmed = source?.trim().toLowerCase();
  return trimmed || "unknown";
}
