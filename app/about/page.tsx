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
      "Universe: U.S. micro-cap stocks ($50M – $500M market cap) — institutional funds face liquidity constraints below this range and cannot take meaningful positions without moving the price against themselves, leaving retail investors on equal footing with the same public SEC filing data",
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

const papers = [
  {
    authors: "Alldredge, D. M. & Blank, B.",
    year: "2019",
    title: "Do Insiders Cluster Trades With Colleagues? Evidence From Daily Insider Trading",
    journal: "Journal of Financial Research",
    vol: "Vol. 42(2), pp. 331–360",
    finding: "Insider purchases made within 2 days of a colleague's purchase generate 2.1% abnormal returns over the next month — nearly double the 1.2% from solitary insider purchases. Over 90 days, cluster buys yield 5.8% vs. 3.3% for non-cluster buys. The effect is strongest among insiders who work closely together and during periods of high information asymmetry.",
    url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/jfir.12172",
  },
  {
    authors: "Lakonishok, J. & Lee, I.",
    year: "2001",
    title: "Are Insider Trades Informative?",
    journal: "Review of Financial Studies",
    vol: "Vol. 14(1), pp. 79–111",
    finding: "Insider purchases — not sales — reliably predict future stock returns, with the effect concentrated in smaller firms where informational advantages are greatest. Purchases by multiple insiders amplify the signal. This paper established why micro-cap cluster buys are particularly information-rich.",
    url: "https://academic.oup.com/rfs/article-abstract/14/1/79/1587398",
  },
  {
    authors: "Cohen, L., Malloy, C. & Pomorski, L.",
    year: "2012",
    title: "Decoding Inside Information",
    journal: "Journal of Finance",
    vol: "Vol. 67(3), pp. 1009–1043",
    finding: "Distinguishes \"routine\" insider trades (predictable, calendar-based, uninformative) from \"opportunistic\" ones (irregular, conviction-driven). Opportunistic purchases — the kind that form cluster events — generate 82 basis points of monthly alpha. Routine trades generate none. Won the Chicago Quantitative Alliance Academic Paper Competition First Prize.",
    url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-6261.2012.01740.x",
  },
  {
    authors: "Seyhun, H. N.",
    year: "1992",
    title: "Why Does Aggregate Insider Trading Predict Future Stock Returns?",
    journal: "Quarterly Journal of Economics",
    vol: "Vol. 107(4), pp. 1303–1331",
    finding: "Aggregate net insider purchases predict 60% of one-year-ahead stock market returns across a 15-year sample (1975–1989). The more insiders buying simultaneously — across or within companies — the stronger the forward-looking signal. One of the earliest papers quantifying the information content of coordinated insider activity.",
    url: "https://academic.oup.com/qje/article-abstract/107/4/1303/1846948",
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
              <p style={{ fontSize: small ? 13 : 15, fontWeight: 300, color: "#4A4A4A", lineHeight: 1.75, maxWidth: 600 }}>{content}</p>
            )}
            {items && (
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((item) => (
                  <li key={item} style={{ fontSize: 15, color: "#4A4A4A", lineHeight: 1.55, display: "flex", gap: 12 }}>
                    <span style={{ color: "#2D6A4F", flexShrink: 0 }}>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}

      {/* Research section */}
      <div id="research" style={{ padding: "40px 0", borderBottom: "1px solid #E8E8E4", display: "grid", gridTemplateColumns: "200px 1fr", gap: 48 }}>
        <div>
          <p style={label}>Academic research</p>
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 300, color: "#4A4A4A", lineHeight: 1.75, marginBottom: 40, maxWidth: 600 }}>
            Insider cluster buying is not a novel idea — it has been studied in peer-reviewed finance journals for decades. The evidence consistently shows that coordinated insider purchases, especially in smaller firms, carry significant predictive power for future returns.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {papers.map((p) => (
              <div key={p.title} style={{ borderLeft: "2px solid #E8E8E4", paddingLeft: 24 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{p.authors} ({p.year})</span>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9A9A9A" }}>{p.journal}</span>
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 14, fontStyle: "italic", color: "#2D6A4F", textDecoration: "none", display: "block", marginBottom: 8 }}
                >
                  {p.title} ↗
                </a>
                <p style={{ fontSize: 14, fontWeight: 300, color: "#6A6A6A", lineHeight: 1.7, marginBottom: 4 }}>{p.finding}</p>
                <p style={{ fontSize: 11, color: "#C0C0C0" }}>{p.vol}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#C0C0C0", marginTop: 32, lineHeight: 1.6 }}>
            ClusterDesk does not claim to replicate or guarantee the returns described in any academic study. Past research findings do not guarantee future results. This section is provided for informational context only.
          </p>
        </div>
      </div>

    </div>
  );
}
