import {
  calculateGrowth,
  summarizeDistribution,
  summarizeSubscriberSources,
} from "@/lib/admin-metrics";

test("summarizes subscriber sources by count and share", () => {
  const result = summarizeSubscriberSources([
    { signup_source: "ticker", created_at: "2026-05-10T00:00:00.000Z" },
    { signup_source: "landing", created_at: "2026-05-10T00:00:00.000Z" },
    { signup_source: "ticker", created_at: "2026-05-10T00:00:00.000Z" },
    { signup_source: null, created_at: "2026-05-10T00:00:00.000Z" },
  ]);

  expect(result).toEqual([
    { source: "ticker", count: 2, share: 0.5 },
    { source: "landing", count: 1, share: 0.25 },
    { source: "unknown", count: 1, share: 0.25 },
  ]);
});

test("calculates current versus previous week subscriber growth", () => {
  const now = new Date("2026-05-12T12:00:00.000Z");
  const result = calculateGrowth(
    [
      { signup_source: "landing", created_at: "2026-05-11T12:00:00.000Z" },
      { signup_source: "ticker", created_at: "2026-05-08T12:00:00.000Z" },
      { signup_source: "x", created_at: "2026-05-02T12:00:00.000Z" },
    ],
    now
  );

  expect(result).toEqual({ current: 2, previous: 1, delta: 1, deltaPct: 1 });
});

test("summarizes X distribution health for published clusters", () => {
  const result = summarizeDistribution([
    {
      ticker: "ACME",
      score: 82,
      published_at: "2026-05-12T12:00:00.000Z",
      twitter_post_id: null,
    },
    {
      ticker: "BETA",
      score: 68,
      published_at: "2026-05-11T12:00:00.000Z",
      twitter_post_id: "123",
    },
    {
      ticker: "DRAFT",
      score: 91,
      published_at: null,
      twitter_post_id: null,
    },
  ]);

  expect(result).toEqual({
    publishedClusters: 2,
    postedToX: 1,
    missingXPosts: 1,
    xPostRate: 0.5,
    highScoreMissingX: ["ACME"],
  });
});
