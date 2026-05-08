import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ClusterDesk — Methodology & Disclaimer",
  description: "How ClusterDesk detects insider cluster buys and what the signals mean.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">About ClusterDesk</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3 text-[#22C55E]">What is a cluster buy?</h2>
        <p className="text-[#787878] leading-relaxed">
          A cluster buy occurs when two or more insiders at the same company purchase shares in
          the open market within a 5-trading-day window. This pattern is considered a stronger
          signal than a single insider buying, because it suggests independent conviction across
          multiple people with inside knowledge of the company.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3 text-[#22C55E]">Our methodology</h2>
        <ul className="text-[#787878] leading-relaxed space-y-2 list-disc list-inside">
          <li>Source: SEC Form 4 filings via OpenInsider</li>
          <li>Universe: U.S. micro-cap stocks ($50M – $500M market cap)</li>
          <li>Open market purchases only (transaction code P)</li>
          <li>Minimum $25,000 per insider, $100,000 combined cluster value</li>
          <li>Excludes: 10b5-1 plans, RSU vesting, option exercises, ESPPs</li>
          <li>Scored 0–100 on cluster size, value, seniority, and recency</li>
          <li>Only clusters scoring 60+ are published</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3 text-[#22C55E]">Scoring</h2>
        <p className="text-[#787878] leading-relaxed">
          Each cluster is scored on four dimensions: number of insiders (up to 30 pts), total
          purchase value as a percentage of market cap (up to 25 pts), seniority of roles — CEOs
          and CFOs score higher than Directors (up to 25 pts), and how tightly clustered the
          trades are in time (up to 10 pts), plus trade size (up to 10 pts). Maximum score is 100.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3 text-[#22C55E]">Disclaimer</h2>
        <p className="text-[#787878] leading-relaxed text-sm">
          ClusterDesk is for informational and educational purposes only. It is not financial
          advice, investment advice, or a recommendation to buy or sell any security. Information
          is derived from publicly available SEC Form 4 filings. Past insider trading patterns
          do not guarantee future stock performance. Always conduct your own research and consult
          a licensed financial advisor before making investment decisions. ClusterDesk is not a
          registered investment adviser.
        </p>
      </section>
    </div>
  );
}
