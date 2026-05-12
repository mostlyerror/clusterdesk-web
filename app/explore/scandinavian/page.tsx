"use client";

const clusters = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiders: 3,
    totalValue: "$312K",
    roles: "CEO + CFO + Director",
    dateRange: "May 1–5, 2026",
    featured: true,
    detail: [
      { name: "Yang Wu", role: "CEO", shares: "45,000", price: "$4.00", total: "$180,000" },
      { name: "Sascha Kelterborn", role: "Director", shares: "20,500", price: "$4.00", total: "$82,000" },
      { name: "Craig Webster", role: "CFO", shares: "12,500", price: "$4.00", total: "$50,000" },
    ],
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    totalValue: "$88K",
    roles: "CEO + Director",
    dateRange: "May 6–8, 2026",
    featured: false,
    detail: [
      { name: "Todd Bankofier", role: "CEO", shares: "8,200", price: "$6.10", total: "$50,020" },
      { name: "James Bell", role: "Director", shares: "6,200", price: "$6.13", total: "$37,980" },
    ],
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    totalValue: "$47K",
    roles: "President + Director",
    dateRange: "May 9–10, 2026",
    featured: false,
    detail: [
      { name: "Jonathan Reich", role: "President", shares: "5,100", price: "$5.30", total: "$27,030" },
      { name: "Tom Arnoy", role: "Director", shares: "3,760", price: "$5.31", total: "$19,970" },
    ],
  },
];

export default function ScandinavianPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital,wght@0,400;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #FAFAF8;
        }

        .scandi-root {
          background: #FAFAF8;
          color: #1A1A1A;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 400;
          line-height: 1.6;
          min-height: 100vh;
        }

        /* NAV */
        .scandi-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px 64px;
          border-bottom: 1px solid #EBEBEB;
        }

        .scandi-wordmark {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          letter-spacing: -0.02em;
          color: #1A1A1A;
          text-decoration: none;
        }

        .scandi-nav-links {
          display: flex;
          gap: 40px;
          list-style: none;
        }

        .scandi-nav-links a {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #9A9A9A;
          text-decoration: none;
          transition: color 0.2s;
        }

        .scandi-nav-links a:hover {
          color: #1A1A1A;
        }

        /* HERO */
        .scandi-hero {
          padding: 120px 64px 120px;
          max-width: 760px;
        }

        .scandi-eyebrow {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #2D6A4F;
          margin-bottom: 28px;
        }

        .scandi-headline {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          font-size: 56px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #1A1A1A;
          margin-bottom: 28px;
        }

        .scandi-hero-body {
          font-size: 17px;
          font-weight: 300;
          line-height: 1.75;
          color: #4A4A4A;
          max-width: 520px;
          margin-bottom: 48px;
        }

        .scandi-cta {
          display: inline-block;
          background: #2D6A4F;
          color: #FFFFFF;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 16px 36px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
        }

        .scandi-cta:hover {
          background: #245a42;
        }

        /* SECTION LABELS */
        .scandi-section {
          padding: 0 64px;
        }

        .scandi-section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9A9A9A;
          padding-bottom: 32px;
          border-bottom: 1px solid #EBEBEB;
          margin-bottom: 48px;
        }

        /* CLUSTER CARDS */
        .scandi-cards {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 0 64px;
          margin-bottom: 120px;
        }

        .scandi-card {
          background: #FFFFFF;
          border: 1px solid #EBEBEB;
          padding: 32px 36px;
          position: relative;
          transition: box-shadow 0.2s;
        }

        .scandi-card:hover {
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        }

        .scandi-card-featured {
          border-left: 2px solid #2D6A4F;
        }

        .scandi-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .scandi-card-ticker {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          letter-spacing: -0.01em;
          color: #1A1A1A;
          line-height: 1;
          margin-bottom: 4px;
        }

        .scandi-card-company {
          font-size: 13px;
          font-weight: 400;
          color: #9A9A9A;
        }

        .scandi-score-block {
          text-align: right;
        }

        .scandi-score-number {
          font-family: 'DM Serif Display', serif;
          font-size: 48px;
          line-height: 1;
          color: #1A1A1A;
          letter-spacing: -0.03em;
        }

        .scandi-score-denom {
          font-size: 20px;
          color: #CCCCCC;
          font-family: 'DM Serif Display', serif;
        }

        .scandi-score-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9A9A9A;
          margin-bottom: 8px;
        }

        .scandi-score-bar-track {
          width: 80px;
          height: 2px;
          background: #EBEBEB;
          margin-left: auto;
        }

        .scandi-score-bar-fill {
          height: 2px;
          background: #2D6A4F;
        }

        .scandi-card-meta {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding-top: 28px;
          border-top: 1px solid #EBEBEB;
        }

        .scandi-meta-item {}

        .scandi-meta-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9A9A9A;
          margin-bottom: 6px;
        }

        .scandi-meta-value {
          font-size: 15px;
          font-weight: 500;
          color: #1A1A1A;
        }

        /* INSIDER TABLE */
        .scandi-table-wrap {
          padding: 0 64px;
          margin-bottom: 120px;
        }

        .scandi-table-heading {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          letter-spacing: -0.01em;
          color: #1A1A1A;
          margin-bottom: 8px;
        }

        .scandi-table-sub {
          font-size: 14px;
          font-weight: 300;
          color: #9A9A9A;
          margin-bottom: 40px;
        }

        .scandi-table {
          width: 100%;
          border-collapse: collapse;
        }

        .scandi-table thead tr {
          border-bottom: 1px solid #1A1A1A;
        }

        .scandi-table th {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9A9A9A;
          text-align: left;
          padding: 0 0 16px 0;
        }

        .scandi-table th:not(:first-child) {
          padding-left: 32px;
        }

        .scandi-table td {
          font-size: 14px;
          font-weight: 400;
          color: #1A1A1A;
          padding: 20px 0;
          border-bottom: 1px solid #EBEBEB;
          vertical-align: middle;
        }

        .scandi-table td:not(:first-child) {
          padding-left: 32px;
        }

        .scandi-table tbody tr:last-child td {
          border-bottom: none;
        }

        .scandi-table-ticker-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #2D6A4F;
          background: #EEF5F1;
          padding: 3px 8px;
          margin-right: 10px;
        }

        .scandi-table-name {
          font-weight: 500;
        }

        .scandi-table-role {
          font-size: 12px;
          color: #9A9A9A;
          margin-top: 2px;
        }

        .scandi-table-total {
          font-weight: 600;
        }

        /* HOW IT WORKS */
        .scandi-how {
          padding: 0 64px;
          margin-bottom: 120px;
        }

        .scandi-how-heading {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          font-size: 40px;
          letter-spacing: -0.02em;
          color: #1A1A1A;
          max-width: 560px;
          margin-bottom: 64px;
          line-height: 1.2;
        }

        .scandi-how-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 64px;
        }

        .scandi-how-step-num {
          font-family: 'DM Serif Display', serif;
          font-size: 48px;
          color: #EBEBEB;
          line-height: 1;
          margin-bottom: 16px;
        }

        .scandi-how-step-title {
          font-size: 14px;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }

        .scandi-how-step-body {
          font-size: 14px;
          font-weight: 300;
          color: #6A6A6A;
          line-height: 1.7;
        }

        /* SUBSCRIBE */
        .scandi-subscribe {
          padding: 120px 64px;
          border-top: 1px solid #EBEBEB;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 64px;
        }

        .scandi-subscribe-left {
          max-width: 400px;
        }

        .scandi-subscribe-heading {
          font-family: 'DM Serif Display', serif;
          font-size: 36px;
          letter-spacing: -0.02em;
          color: #1A1A1A;
          margin-bottom: 12px;
          line-height: 1.15;
        }

        .scandi-subscribe-body {
          font-size: 14px;
          font-weight: 300;
          color: #9A9A9A;
          line-height: 1.7;
        }

        .scandi-subscribe-form {
          display: flex;
          gap: 0;
          flex: 1;
          max-width: 440px;
        }

        .scandi-email-input {
          flex: 1;
          border: 1px solid #EBEBEB;
          border-right: none;
          background: #FFFFFF;
          padding: 14px 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #1A1A1A;
          outline: none;
          transition: border-color 0.2s;
        }

        .scandi-email-input::placeholder {
          color: #C0C0C0;
        }

        .scandi-email-input:focus {
          border-color: #2D6A4F;
        }

        .scandi-submit-btn {
          background: #2D6A4F;
          color: #FFFFFF;
          border: none;
          padding: 14px 28px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .scandi-submit-btn:hover {
          background: #245a42;
        }

        /* FOOTER */
        .scandi-footer {
          border-top: 1px solid #EBEBEB;
          padding: 32px 64px;
          text-align: center;
        }

        .scandi-footer-text {
          font-size: 12px;
          font-weight: 400;
          color: #C0C0C0;
          letter-spacing: 0.02em;
        }

        .scandi-footer-accent {
          color: #9A9A9A;
        }

        @media (max-width: 900px) {
          .scandi-nav { padding: 24px 32px; }
          .scandi-hero { padding: 80px 32px; }
          .scandi-headline { font-size: 38px; }
          .scandi-cards { padding: 0 32px; }
          .scandi-section { padding: 0 32px; }
          .scandi-table-wrap { padding: 0 32px; }
          .scandi-how { padding: 0 32px; }
          .scandi-subscribe { padding: 80px 32px; flex-direction: column; }
          .scandi-footer { padding: 24px 32px; }
          .scandi-card-meta { grid-template-columns: repeat(2, 1fr); }
          .scandi-how-steps { grid-template-columns: 1fr; gap: 40px; }
          .scandi-nav-links { display: none; }
        }
      `}</style>

      <div className="scandi-root">

        {/* NAV */}
        <nav className="scandi-nav">
          <a href="#" className="scandi-wordmark">ClusterDesk</a>
          <ul className="scandi-nav-links">
            <li><a href="#">Alerts</a></li>
            <li><a href="#">Methodology</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">About</a></li>
          </ul>
        </nav>

        {/* HERO */}
        <section className="scandi-hero">
          <p className="scandi-eyebrow">Insider Cluster Intelligence</p>
          <h1 className="scandi-headline">
            When executives buy together, pay attention.
          </h1>
          <p className="scandi-hero-body">
            ClusterDesk tracks when two or more insiders at the same micro-cap company
            buy their own stock within days of each other — a signal the market
            consistently underreacts to.
          </p>
          <a href="#" className="scandi-cta">View live alerts</a>
        </section>

        {/* SECTION LABEL */}
        <div className="scandi-section" style={{ marginBottom: 48 }}>
          <p className="scandi-section-label">Recent cluster alerts — May 2026</p>
        </div>

        {/* CARDS */}
        <div className="scandi-cards">
          {clusters.map((c) => (
            <div
              key={c.ticker}
              className={`scandi-card${c.featured ? " scandi-card-featured" : ""}`}
            >
              <div className="scandi-card-header">
                <div>
                  <div className="scandi-card-ticker">{c.ticker}</div>
                  <div className="scandi-card-company">{c.company}</div>
                </div>
                <div className="scandi-score-block">
                  <div className="scandi-score-label">Cluster Score</div>
                  <div>
                    <span className="scandi-score-number">{c.score}</span>
                    <span className="scandi-score-denom"> / 100</span>
                  </div>
                  <div className="scandi-score-bar-track" style={{ marginTop: 8 }}>
                    <div
                      className="scandi-score-bar-fill"
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="scandi-card-meta">
                <div className="scandi-meta-item">
                  <div className="scandi-meta-label">Insiders</div>
                  <div className="scandi-meta-value">{c.insiders}</div>
                </div>
                <div className="scandi-meta-item">
                  <div className="scandi-meta-label">Total Purchased</div>
                  <div className="scandi-meta-value">{c.totalValue}</div>
                </div>
                <div className="scandi-meta-item">
                  <div className="scandi-meta-label">Roles</div>
                  <div className="scandi-meta-value">{c.roles}</div>
                </div>
                <div className="scandi-meta-item">
                  <div className="scandi-meta-label">Date Range</div>
                  <div className="scandi-meta-value">{c.dateRange}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INSIDER TABLE */}
        <div className="scandi-table-wrap">
          <h2 className="scandi-table-heading">Individual transactions</h2>
          <p className="scandi-table-sub">All open-market purchases. Form 4 filings, SEC EDGAR.</p>
          <table className="scandi-table">
            <thead>
              <tr>
                <th>Insider</th>
                <th>Ticker</th>
                <th>Shares</th>
                <th>Avg Price</th>
                <th>Total Value</th>
                <th>Date Range</th>
              </tr>
            </thead>
            <tbody>
              {clusters.map((c) =>
                c.detail.map((row, i) => (
                  <tr key={`${c.ticker}-${i}`}>
                    <td>
                      <div className="scandi-table-name">{row.name}</div>
                      <div className="scandi-table-role">{row.role}</div>
                    </td>
                    <td>
                      <span className="scandi-table-ticker-badge">{c.ticker}</span>
                    </td>
                    <td>{row.shares}</td>
                    <td>{row.price}</td>
                    <td className="scandi-table-total">{row.total}</td>
                    <td style={{ color: "#9A9A9A", fontSize: 13 }}>{c.dateRange}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* HOW IT WORKS */}
        <div className="scandi-how">
          <h2 className="scandi-how-heading">
            A quiet signal in a noisy market.
          </h2>
          <div className="scandi-how-steps">
            <div>
              <div className="scandi-how-step-num">01</div>
              <div className="scandi-how-step-title">Cluster detection</div>
              <div className="scandi-how-step-body">
                We monitor SEC Form 4 filings in real time. When two or more
                executives at the same company buy on the open market within
                a 14-day window, a cluster event is triggered.
              </div>
            </div>
            <div>
              <div className="scandi-how-step-num">02</div>
              <div className="scandi-how-step-title">Scoring</div>
              <div className="scandi-how-step-body">
                Each cluster is scored 0–100 based on the number of insiders,
                their seniority, purchase size relative to compensation, and
                the tightness of the buying window.
              </div>
            </div>
            <div>
              <div className="scandi-how-step-num">03</div>
              <div className="scandi-how-step-title">Alert delivery</div>
              <div className="scandi-how-step-body">
                High-score clusters are delivered to subscribers within hours
                of the final Form 4 filing. No noise. No commentary.
                Just the signal.
              </div>
            </div>
          </div>
        </div>

        {/* SUBSCRIBE */}
        <section className="scandi-subscribe">
          <div className="scandi-subscribe-left">
            <h2 className="scandi-subscribe-heading">Get the next alert before the market does.</h2>
            <p className="scandi-subscribe-body">
              Free during beta. One email per cluster event. Unsubscribe any time.
            </p>
          </div>
          <div className="scandi-subscribe-form">
            <input
              type="email"
              className="scandi-email-input"
              placeholder="your@email.com"
            />
            <button className="scandi-submit-btn">Subscribe</button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="scandi-footer">
          <p className="scandi-footer-text">
            <span className="scandi-footer-accent">ClusterDesk</span>
            &nbsp;&nbsp;·&nbsp;&nbsp;
            Not investment advice. For informational purposes only.
            &nbsp;&nbsp;·&nbsp;&nbsp;
            © 2026
          </p>
        </footer>

      </div>
    </>
  );
}
