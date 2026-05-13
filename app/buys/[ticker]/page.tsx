import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ClusterCard } from "@/components/ClusterCard";
import { EmailCapture } from "@/components/EmailCapture";
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

const label: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: "0.14em",
  textTransform: "uppercase", color: "#9A9A9A",
};

export default async function TickerPage({ params }: Props) {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();
  const history = await getTickerHistory(upper);
  if (!history.length) notFound();

  const latest = history[0];

  return (
    <>
      <JsonLd ticker={upper} payload={latest.payload} />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px" }}>

        {/* Header */}
        <div style={{ padding: "48px 0 32px", borderBottom: "1px solid #1A1A1A" }}>
          <div style={{ ...label, color: "#2D6A4F", marginBottom: 12 }}>Cluster buy alert</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 40, letterSpacing: "-0.02em", color: "#1A1A1A", lineHeight: 1.1, marginBottom: 4 }}>
            {latest.payload.company_name}
          </h1>
          <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", color: "#9A9A9A" }}>${upper}</span>
            <span style={{ fontSize: 13, color: "#C0C0C0" }}>Market cap: ${Math.round(latest.payload.market_cap_usd / 1_000_000)}M</span>
          </div>
        </div>

        {/* What is a cluster buy */}
        <div style={{ padding: "40px 0", borderBottom: "1px solid #E8E8E4" }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 48 }}>
            <p style={label}>About this signal</p>
            <div>
              <p style={{ fontSize: 15, color: "#4A4A4A", lineHeight: 1.7, marginBottom: 8, maxWidth: 560 }}>
                A <strong style={{ color: "#1A1A1A" }}>cluster buy</strong> happens when two or more company insiders — executives, directors, or major shareholders — purchase stock{" "}
                <strong style={{ color: "#1A1A1A" }}>independently within a short window</strong>. Unlike a single trade, a cluster signals broad internal conviction from people with direct knowledge of the business.
              </p>
              <p style={{ fontSize: 13, color: "#9A9A9A", lineHeight: 1.6, maxWidth: 560 }}>
                The <strong style={{ color: "#6A6A6A" }}>conviction score (0–100)</strong> weighs the number of buyers, total dollars invested, insider seniority, timing tightness, and company size. Higher scores indicate stronger, more concentrated conviction.
              </p>
            </div>
          </div>
        </div>

        {/* Latest cluster */}
        <div style={{ padding: "40px 0", borderBottom: "1px solid #E8E8E4" }}>
          <p style={{ ...label, marginBottom: 20 }}>Latest cluster</p>
          <ClusterCard cluster={latest.payload} publishedAt={latest.published_at} featured />
        </div>

        {/* Insider transactions */}
        <div style={{ padding: "40px 0", borderBottom: "1px solid #E8E8E4" }}>
          <p style={{ ...label, marginBottom: 24 }}>Individual transactions</p>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1A1A1A" }}>
                {["Insider", "Title", "Date", "Value"].map((h, i) => (
                  <th key={h} style={{ ...label, textAlign: i === 3 ? "right" : "left", paddingBottom: 12, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {latest.payload.filings.map((f, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F0F0EC" }}>
                  <td style={{ padding: "16px 0", fontSize: 14, color: "#1A1A1A", fontWeight: 500, paddingRight: 24 }}>{f.insider_name}</td>
                  <td style={{ padding: "16px 0", fontSize: 13, color: "#9A9A9A", paddingRight: 24 }}>
                    {f.insider_title.toLowerCase() === "see remarks" ? (
                      <a href={f.filing_url} target="_blank" rel="noopener noreferrer" style={{ color: "#2D6A4F", textDecoration: "none" }}>
                        See SEC filing ↗
                      </a>
                    ) : f.insider_title}
                  </td>
                  <td style={{ padding: "16px 0", fontSize: 13, color: "#9A9A9A", paddingRight: 24 }}>{f.trade_date}</td>
                  <td style={{ padding: "16px 0", fontSize: 14, fontWeight: 600, color: "#2D6A4F", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    ${f.trade_value_usd.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Email capture */}
        <div style={{ padding: "40px 0", borderBottom: "1px solid #E8E8E4" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 22, color: "#1A1A1A", marginBottom: 6 }}>
            Get the top cluster buys every Friday before market open.
          </p>
          <p style={{ fontSize: 13, fontWeight: 300, color: "#9A9A9A", marginBottom: 24 }}>Free weekly digest with the strongest insider-buy signals and filing breakdowns.</p>
          <EmailCapture source="ticker" ticker={upper} variant="ticker-page-cta" />
        </div>

        {/* History */}
        {history.length > 1 && (
          <div style={{ padding: "40px 0" }}>
            <p style={{ ...label, marginBottom: 24 }}>Prior clusters</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {history.slice(1).map((row, i) => (
                <div key={row.cluster_date} style={{ borderBottom: i < history.length - 2 ? "1px solid #F0F0EC" : "none" }}>
                  <ClusterCard cluster={row.payload} publishedAt={row.published_at} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
