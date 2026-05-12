"use client";

const clusters = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiders: 3,
    totalValue: "$312,000",
    roles: "CEO + CFO + Director",
    dateRange: "May 1–5, 2026",
    featured: true,
    detail: [
      { name: "Yang Wu", role: "CEO", shares: "45,000", price: "$4.00", total: "$180,000" },
      { name: "Sascha Kelterborn", role: "Director", shares: "20,500", price: "$4.00", total: "$82,000" },
      { name: "Craig Webster", role: "CFO", shares: "12,500", price: "$4.00", total: "$50,000" },
    ],
    lede:
      "In one of the most concentrated insider accumulation events seen in the micro-cap battery sector this quarter, three senior executives at Microvast Holdings collectively deployed over $312,000 of personal capital into the company's common shares over a five-day window — a clustering pattern that ClusterDesk's proprietary signal engine flags as a high-conviction buy alert.",
    pullQuote:
      "When a CEO, CFO, and Director all buy on the open market within five days, the market is rarely listening. ClusterDesk is.",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    totalValue: "$88,000",
    roles: "CEO + Director",
    dateRange: "May 6–8, 2026",
    featured: false,
    lede:
      "Two senior insiders at digital accessibility firm AudioEye acquired shares in a tight 48-hour window, generating a cluster score of 74. The combined $88,000 purchase by the chief executive and a board director signals internal confidence ahead of the company's next earnings cycle.",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    totalValue: "$47,000",
    roles: "President + Director",
    dateRange: "May 9–10, 2026",
    featured: false,
    lede:
      "Zedge's president and a sitting director made coordinated open-market purchases of $47,000 in aggregate across consecutive trading sessions. The cluster score of 62 reflects the brevity of the window and the seniority of the buyers at the mobile content platform.",
  },
];

export default function EditorialPage() {
  const featured = clusters.find((c) => c.featured)!;
  const secondary = clusters.filter((c) => !c.featured);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Source+Serif+4:wght@400;600&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #FDF0E8;
        }

        .editorial-root {
          min-height: 100vh;
          background: #FDF0E8;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          color: #1A1A1A;
          font-family: 'Source Serif 4', Georgia, serif;
        }

        .masthead {
          border-top: 4px solid #1A1A1A;
          border-bottom: 2px solid #1A1A1A;
          padding: 18px 48px 14px;
          text-align: center;
          position: relative;
        }

        .masthead-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          font-size: clamp(48px, 8vw, 96px);
          letter-spacing: -1px;
          line-height: 1;
          color: #1A1A1A;
        }

        .masthead-tagline {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #8A7A6A;
          margin-top: 6px;
        }

        .masthead-meta {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #D4C4B4;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: #8A7A6A;
          font-family: 'Source Serif 4', Georgia, serif;
          letter-spacing: 0.5px;
        }

        .edition-badge {
          background: #F2A25C;
          color: #1A1A1A;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 3px 8px;
          font-family: 'Source Serif 4', Georgia, serif;
        }

        .section-rule {
          border: none;
          border-top: 1px solid #D4C4B4;
          margin: 0;
        }

        .section-header {
          padding: 8px 48px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #D4C4B4;
        }

        .section-label {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #1A1A1A;
        }

        .section-line {
          flex: 1;
          height: 1px;
          background: #D4C4B4;
        }

        .content-area {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 0;
          border-bottom: 1px solid #D4C4B4;
        }

        .featured-article {
          padding: 36px 36px 36px 0;
          border-right: 1px solid #D4C4B4;
        }

        .article-kicker {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #F2A25C;
          margin-bottom: 10px;
        }

        .article-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          font-size: clamp(28px, 4vw, 46px);
          line-height: 1.08;
          color: #1A1A1A;
          margin-bottom: 16px;
        }

        .article-subhead {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 17px;
          font-weight: 400;
          line-height: 1.5;
          color: #3A3028;
          margin-bottom: 20px;
          font-style: italic;
        }

        .article-byline {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #8A7A6A;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid #D4C4B4;
        }

        .article-byline span {
          color: #1A1A1A;
        }

        .article-body {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.72;
          color: #1A1A1A;
          margin-bottom: 24px;
        }

        .pull-quote {
          border-left: 4px solid #F2A25C;
          padding: 16px 20px;
          margin: 28px 0;
          background: rgba(242, 162, 92, 0.06);
        }

        .pull-quote blockquote {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: 19px;
          line-height: 1.4;
          color: #1A1A1A;
          font-style: italic;
        }

        .pull-quote cite {
          display: block;
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #8A7A6A;
          margin-top: 10px;
          font-style: normal;
        }

        .insider-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 13px;
        }

        .insider-table th {
          font-weight: 600;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #8A7A6A;
          border-bottom: 2px solid #D4C4B4;
          padding: 8px 0;
          text-align: left;
        }

        .insider-table td {
          padding: 9px 0;
          border-bottom: 1px solid #EDE0D4;
          color: #1A1A1A;
          vertical-align: top;
        }

        .insider-table td:last-child {
          text-align: right;
          font-weight: 600;
        }

        .featured-sidebar {
          padding: 36px 0 36px 36px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .score-display {
          text-align: center;
          padding: 24px;
          border: 1px solid #D4C4B4;
          background: rgba(242, 162, 92, 0.04);
        }

        .score-label {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #8A7A6A;
          margin-bottom: 8px;
        }

        .score-number {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          font-size: 72px;
          line-height: 1;
          color: #F2A25C;
        }

        .score-max {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 13px;
          color: #8A7A6A;
          margin-top: 4px;
        }

        .stat-block {
          border-top: 2px solid #1A1A1A;
          padding-top: 16px;
        }

        .stat-block-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 14px;
          color: #1A1A1A;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 7px 0;
          border-bottom: 1px solid #EDE0D4;
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 13px;
        }

        .stat-key {
          color: #8A7A6A;
          font-size: 11px;
          letter-spacing: 0.5px;
        }

        .stat-val {
          font-weight: 600;
          color: #1A1A1A;
        }

        .three-col-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          padding: 36px 0;
          border-bottom: 1px solid #D4C4B4;
        }

        .col-article {
          padding: 0 28px;
          position: relative;
        }

        .col-article:first-child {
          padding-left: 0;
        }

        .col-article:last-child {
          padding-right: 0;
        }

        .col-article + .col-article::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background: #D4C4B4;
        }

        .col-ticker {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          font-size: 32px;
          color: #1A1A1A;
          line-height: 1;
          margin-bottom: 2px;
        }

        .col-company {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #8A7A6A;
          margin-bottom: 12px;
        }

        .col-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: 20px;
          line-height: 1.2;
          color: #1A1A1A;
          margin-bottom: 12px;
        }

        .col-body {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 14px;
          line-height: 1.65;
          color: #3A3028;
        }

        .col-meta {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #D4C4B4;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .col-meta-score {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: 22px;
          color: #F2A25C;
        }

        .col-meta-label {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #8A7A6A;
        }

        .col-meta-date {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 11px;
          color: #8A7A6A;
          font-style: italic;
        }

        .subscription-box {
          margin: 48px 0 0;
          padding: 36px 48px;
          border-top: 4px solid #1A1A1A;
          border-bottom: 1px solid #D4C4B4;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 32px;
          align-items: center;
          background: rgba(26, 26, 26, 0.03);
        }

        .sub-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          font-size: 26px;
          color: #1A1A1A;
          margin-bottom: 8px;
        }

        .sub-body {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 14px;
          line-height: 1.6;
          color: #8A7A6A;
        }

        .sub-form {
          display: flex;
          gap: 0;
          flex-shrink: 0;
        }

        .sub-input {
          border: 1px solid #1A1A1A;
          border-right: none;
          background: #FDF0E8;
          padding: 10px 16px;
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 14px;
          color: #1A1A1A;
          outline: none;
          width: 220px;
        }

        .sub-input::placeholder {
          color: #8A7A6A;
        }

        .sub-button {
          background: #1A1A1A;
          color: #FDF0E8;
          border: 1px solid #1A1A1A;
          padding: 10px 20px;
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
        }

        .sub-button:hover {
          background: #F2A25C;
          border-color: #F2A25C;
          color: #1A1A1A;
        }

        .footer {
          padding: 24px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #D4C4B4;
          margin-top: 0;
        }

        .footer-brand {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          font-size: 18px;
          color: #1A1A1A;
        }

        .footer-copy {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 11px;
          color: #8A7A6A;
          letter-spacing: 0.5px;
        }

        .footer-links {
          display: flex;
          gap: 20px;
        }

        .footer-links a {
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 11px;
          color: #8A7A6A;
          text-decoration: none;
          letter-spacing: 0.5px;
        }

        .footer-links a:hover {
          color: #1A1A1A;
          text-decoration: underline;
        }

        .ticker-pill {
          display: inline-block;
          background: #1A1A1A;
          color: #F2A25C;
          font-family: 'Source Serif 4', Georgia, serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          padding: 2px 8px;
          margin-bottom: 8px;
        }

        @media (max-width: 900px) {
          .masthead { padding: 16px 24px 12px; }
          .masthead-meta { flex-direction: column; gap: 6px; text-align: center; }
          .content-area { padding: 0 24px; }
          .section-header { padding: 8px 24px; }
          .featured-grid { grid-template-columns: 1fr; }
          .featured-article { padding: 24px 0; border-right: none; border-bottom: 1px solid #D4C4B4; }
          .featured-sidebar { padding: 24px 0; }
          .three-col-grid { grid-template-columns: 1fr; }
          .col-article { padding: 24px 0 !important; }
          .col-article + .col-article::before { left: 0; top: 0; bottom: auto; width: 100%; height: 1px; }
          .subscription-box { grid-template-columns: 1fr; padding: 24px; }
          .sub-form { flex-direction: column; }
          .sub-input { width: 100%; border-right: 1px solid #1A1A1A; border-bottom: none; }
          .footer { flex-direction: column; gap: 12px; text-align: center; padding: 20px 24px; }
        }
      `}</style>

      <div className="editorial-root">
        {/* Masthead */}
        <header className="masthead">
          <div className="masthead-name">ClusterDesk</div>
          <div className="masthead-tagline">Insider Cluster Intelligence &mdash; Since 2026</div>
          <div className="masthead-meta">
            <span>Monday, 12 May 2026</span>
            <span className="edition-badge">Morning Edition</span>
            <span>Vol. I, No. 14 &mdash; Insider Intelligence</span>
          </div>
        </header>

        {/* Section label */}
        <div className="section-header">
          <span className="section-label">Cluster Alerts</span>
          <span className="section-line" />
          <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 11, color: "#8A7A6A", fontStyle: "italic" }}>
            Three clusters detected this week across U.S. micro-cap equities
          </span>
        </div>

        <div className="content-area">
          {/* Featured article + sidebar */}
          <div className="featured-grid">
            <article className="featured-article">
              <div className="article-kicker">High-Conviction Cluster &mdash; Score {featured.score}</div>
              <h1 className="article-headline">
                Three Microvast Executives Converge on Open-Market Purchases in Five-Day Window
              </h1>
              <p className="article-subhead">
                C-suite alignment at battery maker signals internal conviction; $312,000 deployed by CEO, CFO, and Director at identical price of $4.00 per share.
              </p>
              <div className="article-byline">
                By <span>ClusterDesk Intelligence</span> &mdash; {featured.dateRange}
              </div>
              <p className="article-body">{featured.lede}</p>

              <div className="pull-quote">
                <blockquote>&ldquo;{featured.pullQuote}&rdquo;</blockquote>
                <cite>ClusterDesk Editorial Desk</cite>
              </div>

              <p className="article-body">
                The coordinated nature of the purchases &mdash; all executed at the same price point of $4.00 per share &mdash; suggests that executives may be responding to information that has not yet been fully reflected in the public market. Under SEC Rule 10b-5, all transactions were reported on Form 4 filings within the required two-business-day window.
              </p>

              <table className="insider-table">
                <thead>
                  <tr>
                    <th>Executive</th>
                    <th>Role</th>
                    <th>Shares</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {featured.detail!.map((row) => (
                    <tr key={row.name}>
                      <td style={{ fontWeight: 600 }}>{row.name}</td>
                      <td style={{ color: "#8A7A6A", fontSize: 12 }}>{row.role}</td>
                      <td>{row.shares}</td>
                      <td>{row.price}</td>
                      <td>{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>

            <aside className="featured-sidebar">
              <div className="score-display">
                <div className="score-label">Cluster Score</div>
                <div className="score-number">{featured.score}</div>
                <div className="score-max">out of 100</div>
              </div>

              <div className="stat-block">
                <div className="stat-block-title">By the Numbers</div>
                <div className="stat-row">
                  <span className="stat-key">Ticker</span>
                  <span className="stat-val">{featured.ticker}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-key">Insiders</span>
                  <span className="stat-val">{featured.insiders} executives</span>
                </div>
                <div className="stat-row">
                  <span className="stat-key">Combined Value</span>
                  <span className="stat-val">{featured.totalValue}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-key">Window</span>
                  <span className="stat-val">5 trading days</span>
                </div>
                <div className="stat-row">
                  <span className="stat-key">Buyers</span>
                  <span className="stat-val" style={{ fontSize: 12 }}>{featured.roles}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-key">Period</span>
                  <span className="stat-val" style={{ fontSize: 12 }}>{featured.dateRange}</span>
                </div>
              </div>

              <div style={{ paddingTop: 8 }}>
                <p style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: "#8A7A6A",
                  fontStyle: "italic",
                  borderLeft: "3px solid #D4C4B4",
                  paddingLeft: 14,
                }}>
                  ClusterDesk scores are proprietary signals based on insider seniority, purchase window compression, aggregate deal size, and historical pattern matching.
                </p>
              </div>
            </aside>
          </div>

          {/* Secondary cluster articles — 3-col grid */}
          <div className="section-header" style={{ padding: "8px 0", marginTop: 0 }}>
            <span className="section-label">Further Alerts</span>
            <span className="section-line" />
          </div>

          <div className="three-col-grid">
            {/* Replay the featured article summary in col 1 for visual balance */}
            <div className="col-article">
              <div className="ticker-pill">{featured.ticker}</div>
              <div className="col-company">{featured.company}</div>
              <h2 className="col-headline">C-Suite Conviction at Microvast</h2>
              <p className="col-body">
                Three senior executives at the battery manufacturer purchased shares simultaneously. The $312,000 cluster at $4.00/share across a five-day window earns the highest score in this week&apos;s report.
              </p>
              <div className="col-meta">
                <div>
                  <div className="col-meta-score">{featured.score}</div>
                  <div className="col-meta-label">Score</div>
                </div>
                <div className="col-meta-date">{featured.dateRange}</div>
              </div>
            </div>

            {secondary.map((c) => (
              <div className="col-article" key={c.ticker}>
                <div className="ticker-pill">{c.ticker}</div>
                <div className="col-company">{c.company}</div>
                <h2 className="col-headline">
                  {c.roles} Buy Into {c.ticker} in Coordinated Move
                </h2>
                <p className="col-body">{c.lede}</p>
                <div className="col-meta">
                  <div>
                    <div className="col-meta-score">{c.score}</div>
                    <div className="col-meta-label">Score</div>
                  </div>
                  <div className="col-meta-date">{c.dateRange}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription box */}
        <div className="subscription-box">
          <div>
            <div className="sub-headline">Subscribe to the ClusterDesk Daily Briefing</div>
            <p className="sub-body">
              Receive every cluster alert the moment it&apos;s detected &mdash; before the market moves. Delivered each morning at 7:00 AM ET. Free for qualified readers.
            </p>
          </div>
          <div className="sub-form">
            <input
              className="sub-input"
              type="email"
              placeholder="your@email.com"
            />
            <button className="sub-button" type="button">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-brand">ClusterDesk</div>
          <div className="footer-copy">&copy; 2026 ClusterDesk Inc. &mdash; For informational purposes only. Not investment advice.</div>
          <nav className="footer-links">
            <a href="/explore">Explore</a>
            <a href="#">Disclosures</a>
            <a href="#">Methodology</a>
          </nav>
        </footer>
      </div>
    </>
  );
}
