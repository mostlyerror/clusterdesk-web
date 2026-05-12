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

  const weekLabel = monday.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px" }}>
      <div style={{ padding: "48px 0 32px", borderBottom: "1px solid #1A1A1A" }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2D6A4F", marginBottom: 12 }}>Weekly digest</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 40, letterSpacing: "-0.02em", color: "#1A1A1A", lineHeight: 1.1, marginBottom: 4 }}>
          This week&apos;s cluster buys.
        </h1>
        <p style={{ fontSize: 13, color: "#9A9A9A" }}>Week of {weekLabel}</p>
      </div>
      <div style={{ padding: "40px 0" }}>
        {clusters && clusters.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {clusters.map((row, i) => (
              <div key={`${row.ticker}-${row.cluster_date}`} style={{ borderBottom: i < clusters.length - 1 ? "1px solid #F0F0EC" : "none" }}>
                <ClusterCard cluster={row.payload} publishedAt={row.published_at} featured={i === 0} />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 14, color: "#9A9A9A", fontWeight: 300 }}>No cluster buys published this week yet. Check back tomorrow.</p>
        )}
      </div>
    </div>
  );
}
