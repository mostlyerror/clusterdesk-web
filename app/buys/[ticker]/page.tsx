import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ClusterCard } from "@/components/ClusterCard";
import type { TickerPageRow } from "@/lib/types";

export const revalidate = 3600;

interface Props {
  params: Promise<{ ticker: string }>;
}

async function getTickerHistory(ticker: string): Promise<TickerPageRow[]> {
  const { data } = await supabase
    .from("ticker_pages")
    .select("*")
    .eq("ticker", ticker.toUpperCase())
    .order("cluster_date", { ascending: false });
  return data ?? [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();
  const history = await getTickerHistory(upper);
  if (!history.length) return { title: "ClusterDesk" };

  const latest = history[0].payload;
  return {
    title: `${upper} Insider Buying — Cluster Buy Alerts | ClusterDesk`,
    description: `${latest.insider_count} insiders at ${latest.company_name} bought $${Math.round(latest.total_value_usd / 1000)}K combined. Score: ${latest.score}/100.`,
    openGraph: {
      title: `$${upper} Cluster Buy Alert — ClusterDesk`,
      description: `${latest.insider_count} insiders at ${latest.company_name} bought $${Math.round(latest.total_value_usd / 1000)}K.`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `$${upper} cluster buy — ${latest.insider_count} insiders, $${Math.round(latest.total_value_usd / 1000)}K`,
      site: "@clusterdesk",
    },
  };
}

function JsonLd({ ticker, payload }: { ticker: string; payload: TickerPageRow["payload"] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${ticker} Insider Cluster Buy Alert`,
    description: `${payload.insider_count} insiders at ${payload.company_name} purchased shares totaling $${payload.total_value_usd.toLocaleString()} within a 5-day window.`,
    provider: { "@type": "Organization", name: "ClusterDesk", url: "https://clusterdesk.io" },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function TickerPage({ params }: Props) {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();
  const history = await getTickerHistory(upper);
  if (!history.length) notFound();

  const latest = history[0];

  return (
    <>
      <JsonLd ticker={upper} payload={latest.payload} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
            <span className="text-[#22C55E]">${upper}</span> — {latest.payload.company_name}
          </h1>
          <p className="text-[#787878]">
            Market cap: ${Math.round(latest.payload.market_cap_usd / 1_000_000)}M
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Latest cluster</h2>
          <ClusterCard cluster={latest.payload} publishedAt={latest.published_at} />
        </div>

        {/* Filings table */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Insider transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#787878] border-b border-[#222]">
                  <th className="text-left py-2 pr-4">Insider</th>
                  <th className="text-left py-2 pr-4">Title</th>
                  <th className="text-left py-2 pr-4">Date</th>
                  <th className="text-right py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {latest.payload.filings.map((f, i) => (
                  <tr key={i} className="border-b border-[#1a1a1a]">
                    <td className="py-3 pr-4">{f.insider_name}</td>
                    <td className="py-3 pr-4 text-[#787878]">{f.insider_title}</td>
                    <td className="py-3 pr-4 text-[#787878]">{f.trade_date}</td>
                    <td className="py-3 text-right text-[#22C55E]">
                      ${f.trade_value_usd.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* History */}
        {history.length > 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">History</h2>
            <div className="grid gap-3">
              {history.slice(1).map((row) => (
                <ClusterCard
                  key={row.cluster_date}
                  cluster={row.payload}
                  publishedAt={row.published_at}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
