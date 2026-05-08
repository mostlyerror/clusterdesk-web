import { supabase } from "@/lib/supabase";
import { ClusterCard } from "@/components/ClusterCard";
import { EmailCapture } from "@/components/EmailCapture";
import type { TickerPageRow } from "@/lib/types";

export const revalidate = 3600;

async function getLatestClusters(): Promise<TickerPageRow[]> {
  const { data } = await supabase
    .from("ticker_pages")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(3);
  return data ?? [];
}

export default async function HomePage() {
  const clusters = await getLatestClusters();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          Free daily alerts on{" "}
          <span className="text-[#22C55E]">insider cluster buys</span>{" "}
          in micro-cap stocks.
        </h1>
        <p className="text-[#787878] text-lg mb-8 max-w-2xl mx-auto">
          When 2+ insiders at the same micro-cap company buy shares within days of each other,
          that&apos;s a cluster buy. We find them. You get the alert.
        </p>
        <div className="flex justify-center">
          <EmailCapture source="landing" />
        </div>
      </div>

      {/* Latest clusters */}
      {clusters.length > 0 && (
        <div className="mb-16">
          <h2 className="text-xl font-semibold mb-6">Latest cluster buys</h2>
          <div className="grid gap-4">
            {clusters.map((row) => (
              <ClusterCard
                key={`${row.ticker}-${row.cluster_date}`}
                cluster={row.payload}
                publishedAt={row.published_at}
              />
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="mb-16">
        <h2 className="text-xl font-semibold mb-6">How it works</h2>
        <ol className="grid sm:grid-cols-3 gap-6 list-none">
          {[
            {
              step: "01",
              title: "We scrape SEC Form 4 filings daily",
              desc: "Every weekday morning we pull the latest insider purchases from public SEC data.",
            },
            {
              step: "02",
              title: "We detect cluster patterns",
              desc: "When ≥2 insiders at the same micro-cap ($50M–$500M) buy within 5 trading days, that's a signal.",
            },
            {
              step: "03",
              title: "You get the alert",
              desc: "Top-scored clusters are posted to @clusterdesk on X and emailed in a weekly digest.",
            },
          ].map(({ step, title, desc }) => (
            <li key={step} className="bg-[#111111] border border-[#222222] rounded-lg p-5">
              <div className="text-[#22C55E] font-mono text-sm mb-2">{step}</div>
              <div className="font-semibold mb-2">{title}</div>
              <div className="text-[#787878] text-sm">{desc}</div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
