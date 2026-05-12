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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="text-xs font-medium uppercase tracking-widest text-[#555] whitespace-nowrap">
        {children}
      </h2>
      <div className="h-px flex-1 bg-[#1a1a1a]" />
    </div>
  );
}

function AlertPreview() {
  return (
    <div className="rounded-xl border border-[#222222] overflow-hidden text-sm">
      {/* Phone push notification */}
      <div className="bg-[#161616] px-5 py-3 flex items-start gap-3 border-b border-[#1a1a1a]">
        <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs text-black"
          style={{ background: "#22C55E" }}>
          CD
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-semibold">ClusterDesk</span>
            <span className="text-xs text-[#444]">now</span>
          </div>
          <p className="text-xs text-[#787878] leading-snug">
            $MVST cluster buy — 87/100. 3 insiders, $312K in 4 days.
          </p>
        </div>
      </div>
      {/* Email body */}
      <div className="bg-[#0d0d0d] px-5 py-5">
        <div className="flex gap-4 text-xs text-[#444] mb-4 font-mono">
          <span>From: alerts@clusterdesk.io</span>
          <span className="ml-auto text-[#333]">Subject: $MVST — Cluster Buy Alert · Score 87/100</span>
        </div>
        <div className="border border-[#1a1a1a] rounded-lg p-4 bg-[#111111]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#22C55E] font-bold">$MVST</span>
            <span className="text-[#787878] text-xs">Microvast Holdings · $180M market cap</span>
          </div>
          <p className="text-[#ccc] text-sm mb-4 leading-relaxed">
            3 insiders purchased <span className="text-white font-medium">$312,000</span> combined
            within a 4-day window. Conviction score: <span className="text-[#22C55E] font-semibold">87/100</span>.
          </p>
          <div className="space-y-2 border-t border-[#1a1a1a] pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-[#555] font-mono">CEO</span>
              <span className="text-[#787878]">$145,000</span>
              <span className="text-[#444]">May 2</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#555] font-mono">CFO</span>
              <span className="text-[#787878]">$112,000</span>
              <span className="text-[#444]">May 3</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#555] font-mono">Director</span>
              <span className="text-[#787878]">$55,000</span>
              <span className="text-[#444]">May 5</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
            <span className="text-xs text-[#22C55E]">View full breakdown → clusterdesk.io/buys/MVST</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const clusters = await getLatestClusters();

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Live signal bar */}
      <div className="flex items-center gap-3 py-3 mb-10 border-b border-[#1a1a1a]">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-[#555]">Live</span>
        <span className="text-[#333] text-xs">·</span>
        <span className="text-xs text-[#444]">Monitoring SEC Form 4 filings daily</span>
        {clusters.length > 0 && (
          <>
            <span className="text-[#333] text-xs">·</span>
            <span className="text-xs text-[#444]">
              {clusters.length} active signal{clusters.length !== 1 ? "s" : ""}
            </span>
          </>
        )}
      </div>

      {/* Hero */}
      <div className="py-10 mb-14">
        <h1 className="text-5xl sm:text-6xl font-bold mb-5 leading-[1.07] tracking-tight">
          When insiders cluster,<br />
          <span className="text-[#22C55E]">markets follow.</span>
        </h1>
        <p className="text-[#787878] text-lg mb-8 max-w-xl leading-relaxed">
          When 2+ executives at the same micro-cap buy their own stock within days of each other,
          that&apos;s a signal worth knowing about. We find it. You get the alert.
        </p>
        <EmailCapture source="landing" />
        <p className="text-xs text-[#444] mt-3">Free. Unsubscribe anytime.</p>
      </div>

      {/* What is a cluster buy */}
      <div className="mb-14 pl-5 border-l-2 border-[#22C55E]">
        <p className="text-[#ccc] text-sm leading-relaxed max-w-2xl">
          A <strong className="text-white">cluster buy</strong> happens when two or more company
          insiders — executives, directors, or major shareholders — purchase stock{" "}
          <strong className="text-white">independently within a short window</strong>. Unlike a
          single trade, which can be noise, a cluster signals broad internal conviction: multiple
          people with direct knowledge of the business are all betting their own money at the same time.
        </p>
        <p className="text-[#444] text-xs mt-2">
          Data source: SEC Form 4 filings, publicly available within 2 business days of each trade.
        </p>
      </div>

      {/* Latest signals */}
      {clusters.length > 0 && (
        <div className="mb-14">
          <SectionLabel>Latest signals</SectionLabel>
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
      <div className="mb-14">
        <SectionLabel>How it works</SectionLabel>
        <ol className="grid sm:grid-cols-3 gap-4 list-none">
          {[
            {
              n: "01",
              title: "SEC Form 4 scan",
              desc: "Every weekday we pull insider purchase filings from EDGAR — the same public data institutional investors watch.",
            },
            {
              n: "02",
              title: "Cluster detection",
              desc: "When ≥2 insiders at the same micro-cap ($50M–$500M) buy within 5 trading days of each other, we flag it.",
            },
            {
              n: "03",
              title: "Conviction scoring",
              desc: "Each cluster gets a 0–100 score weighing number of buyers, dollars invested, insider seniority, and timing tightness.",
            },
          ].map(({ n, title, desc }) => (
            <li key={n} className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-5">
              <div className="text-[#22C55E] font-mono text-xs mb-3">{n}</div>
              <div className="font-semibold text-sm mb-2">{title}</div>
              <div className="text-[#555] text-sm leading-relaxed">{desc}</div>
            </li>
          ))}
        </ol>
      </div>

      {/* What you receive */}
      <div className="mb-14">
        <SectionLabel>What you receive</SectionLabel>
        <AlertPreview />
      </div>

      {/* Bottom CTA */}
      <div className="mb-20 border border-[#222222] rounded-xl p-8 sm:p-10 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-[#555] mb-3">
          Don&apos;t miss the next signal
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Get alerted when a cluster buy is detected.
        </h2>
        <p className="text-[#555] text-sm mb-6 max-w-sm mx-auto">
          Free alerts delivered within 24 hours of detection.
        </p>
        <div className="flex justify-center">
          <EmailCapture source="landing-bottom" />
        </div>
      </div>
    </div>
  );
}
