import { supabase } from "@/lib/supabase";
import { ClusterCard } from "@/components/ClusterCard";
import type { Metadata } from "next";
import type { TickerPageRow } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Weekly Cluster Buy Digest | ClusterDesk",
  description: "This week's top insider cluster buys in micro-cap stocks.",
};

export default async function WeeklyPage() {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon…6=Sat
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() - daysFromMonday,
  ));

  const { data: clusters } = await supabase
    .from("ticker_pages")
    .select("*")
    .gte("published_at", monday.toISOString())
    .order("score", { ascending: false }) as { data: TickerPageRow[] | null };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">This week&apos;s cluster buys</h1>
      <p className="text-[#787878] mb-8">
        Week of {monday.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}
      </p>
      {clusters && clusters.length > 0 ? (
        <div className="grid gap-4">
          {clusters.map((row) => (
            <ClusterCard
              key={`${row.ticker}-${row.cluster_date}`}
              cluster={row.payload}
              publishedAt={row.published_at}
            />
          ))}
        </div>
      ) : (
        <p className="text-[#787878]">No cluster buys published this week yet. Check back tomorrow.</p>
      )}
    </div>
  );
}
