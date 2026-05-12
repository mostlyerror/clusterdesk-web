import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ClusterDesk — Methodology & Disclaimer",
  description: "How ClusterDesk detects insider cluster buys and what the signals mean.",
};

const label: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, letterSpacing: "0.14em",
  textTransform: "uppercase", color: "#9A9A9A",
};

const sections: { title: string; content?: string; items?: string[]; small?: boolean }[] = [
  {
    title: "What is a cluster buy?",
    content: "A cluster buy occurs when two or more insiders at the same company purchase shares on the open market within a 5-trading-day window. This pattern is considered a stronger signal than a single insider buying, because it suggests independent conviction across multiple people with direct knowledge of the company.",
  },
  {
    title: "Methodology",
    items: [
      "Source: SEC Form 4 filings via EDGAR",
      "Universe: U.S. micro-cap stocks ($50M – $500M market cap)",
      "Open market purchases only (transaction code P)",
      "Minimum $25,000 per insider, $100,000 combined cluster value",
      "Excludes: 10b5-1 plans, RSU vesting, option exercises, ESPPs",
      "Scored 0–100 on cluster size, value, seniority, and recency",
      "Only clusters scoring 60+ are published",
    ],
  },
  {
    title: "Scoring",
    content: "Each cluster is scored on four dimensions: number of insiders (up to 30 pts), total purchase value as a percentage of market cap (up to 25 pts), seniority of roles — CEOs and CFOs score higher than Directors (up to 25 pts), and how tightly clustered the trades are in time (up to 10 pts), plus trade size (up to 10 pts). Maximum score is 100.",
  },
  {
    title: "Disclaimer",
    content: "ClusterDesk is for informational and educational purposes only. It is not financial advice, investment advice, or a recommendation to buy or sell any security. Information is derived from publicly available SEC Form 4 filings. Past insider trading patterns do not guarantee future stock performance. Always conduct your own research and consult a licensed financial advisor before making investment decisions. ClusterDesk is not a registered investment adviser.",
    small: true,
  },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px" }}>
      <div style={{ padding: "48px 0 32px", borderBottom: "1px solid #1A1A1A" }}>
        <p style={{ ...label, color: "#2D6A4F", marginBottom: 12 }}>Methodology</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 40, letterSpacing: "-0.02em", color: "#1A1A1A", lineHeight: 1.1 }}>
          How ClusterDesk works.
        </h1>
      </div>

      {sections.map(({ title, content, items, small }) => (
        <div key={title} style={{ padding: "40px 0", borderBottom: "1px solid #E8E8E4", display: "grid", gridTemplateColumns: "200px 1fr", gap: 48 }}>
          <p style={label}>{title}</p>
          <div>
            {content && (
              <p style={{ fontSize: small ? 13 : 15, fontWeight: 300, color: "#4A4A4A", lineHeight: 1.75 }}>{content}</p>
            )}
            {items && (
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((item) => (
                  <li key={item} style={{ fontSize: 14, color: "#4A4A4A", lineHeight: 1.55, display: "flex", gap: 12 }}>
                    <span style={{ color: "#2D6A4F", flexShrink: 0 }}>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
