"use client";

import React, { useState } from "react";

const clusters = [
  {
    ticker: "MVST",
    name: "Microvast Holdings",
    score: 87,
    insiders: 3,
    totalBought: "$312K",
    transactions: [
      { name: "Yang Wu", title: "CEO", shares: 120000, value: "$141,600", date: "2024-11-04" },
      { name: "Shane Smith", title: "CFO", shares: 85000, value: "$100,300", date: "2024-11-06" },
      { name: "Jiang Li", title: "Director", shares: 59500, value: "$70,210", date: "2024-11-07" },
    ],
  },
  {
    ticker: "AEYE",
    name: "AudioEye Inc",
    score: 74,
    insiders: 2,
    totalBought: "$88K",
    transactions: [
      { name: "David Moradi", title: "CEO", shares: 22000, value: "$55,000", date: "2024-11-08" },
      { name: "Kelly Georgevich", title: "Director", shares: 13200, value: "$33,000", date: "2024-11-09" },
    ],
  },
  {
    ticker: "ZDGE",
    name: "Zedge Inc",
    score: 62,
    insiders: 2,
    totalBought: "$47K",
    transactions: [
      { name: "Jonathan Reich", title: "CEO", shares: 18000, value: "$27,000", date: "2024-11-10" },
      { name: "Tom Arnoy", title: "COO", shares: 13400, value: "$20,100", date: "2024-11-11" },
    ],
  },
];

export default function SwissPage() {
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState<string | null>("MVST");

  const primary = clusters[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Arimo:wght@400;500;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Arimo', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background: #FFFFFF;
          color: #000000;
          -webkit-font-smoothing: antialiased;
        }

        .swiss-page {
          font-family: 'Arimo', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background: #FFFFFF;
          color: #000000;
          min-height: 100vh;
        }

        /* 8-column grid */
        .grid-8 {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          column-gap: 24px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 48px;
        }

        /* Header */
        .site-header {
          padding: 0 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-inner {
          padding: 24px 0 22px;
        }

        .header-wordmark {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #000000;
          display: block;
          line-height: 1;
        }

        .header-rule {
          width: 100%;
          height: 2px;
          background: #E8001D;
          border: none;
          margin: 0;
        }

        /* Section label */
        .section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999999;
          line-height: 1;
        }

        /* Hero section */
        .hero-section {
          padding: 64px 0 56px;
          border-bottom: 1px solid #000000;
        }

        .hero-number {
          font-size: clamp(120px, 14vw, 200px);
          font-weight: 700;
          line-height: 0.88;
          letter-spacing: -0.03em;
          color: #000000;
          grid-column: 1 / 4;
          display: flex;
          align-items: flex-start;
        }

        .hero-meta {
          grid-column: 4 / 9;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-bottom: 8px;
          gap: 24px;
        }

        .hero-company-name {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.1;
        }

        .hero-ticker {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #E8001D;
        }

        .hero-description {
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
          color: #000000;
          max-width: 440px;
        }

        .hero-stats {
          display: flex;
          gap: 48px;
        }

        .hero-stat-value {
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .hero-stat-label {
          font-size: 11px;
          font-weight: 400;
          color: #999999;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        /* Cluster list */
        .clusters-section {
          padding: 56px 0;
          border-bottom: 1px solid #000000;
        }

        .clusters-header {
          padding-bottom: 16px;
          border-bottom: 1px solid #000000;
          margin-bottom: 0;
        }

        .clusters-col-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #999999;
        }

        .cluster-row {
          border-bottom: 1px solid #F0F0F0;
          cursor: pointer;
          transition: background 0.1s;
        }

        .cluster-row:hover {
          background: #F0F0F0;
        }

        .cluster-row-inner {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          column-gap: 24px;
          padding: 20px 0;
          align-items: center;
        }

        .cluster-score {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .cluster-score-red {
          color: #E8001D;
        }

        .cluster-ticker {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .cluster-name {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
        }

        .cluster-insiders {
          font-size: 15px;
          font-weight: 500;
        }

        .cluster-amount {
          font-size: 15px;
          font-weight: 700;
        }

        .expand-indicator {
          font-size: 18px;
          font-weight: 400;
          color: #999999;
          justify-self: end;
          line-height: 1;
          transition: transform 0.2s;
        }

        .expand-indicator.open {
          transform: rotate(45deg);
        }

        /* Insider table */
        .insider-table-wrap {
          padding: 0 0 24px;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.3s ease, padding 0.3s ease;
        }

        .insider-table-wrap.open {
          max-height: 400px;
          padding-bottom: 24px;
        }

        .insider-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }

        .insider-table th {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #999999;
          text-align: left;
          padding: 0 0 12px;
          border-bottom: 1px solid #000000;
        }

        .insider-table td {
          font-size: 13px;
          font-weight: 400;
          padding: 12px 0;
          border-bottom: 1px solid #F0F0F0;
          vertical-align: middle;
        }

        .insider-table td:nth-child(3),
        .insider-table td:nth-child(4),
        .insider-table td:nth-child(5) {
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }

        .insider-table tr:last-child td {
          border-bottom: none;
        }

        /* Methodology section */
        .method-section {
          padding: 56px 0;
          border-bottom: 1px solid #000000;
        }

        .method-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          grid-column: 1 / 3;
        }

        .method-body {
          grid-column: 3 / 9;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .method-rule-item {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 24px;
          align-items: start;
        }

        .method-rule-num {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #999999;
          padding-top: 2px;
        }

        .method-rule-text {
          font-size: 15px;
          font-weight: 400;
          line-height: 1.55;
        }

        .method-rule-text strong {
          font-weight: 700;
        }

        /* Subscribe section */
        .subscribe-section {
          padding: 56px 0 64px;
        }

        .subscribe-label {
          grid-column: 1 / 3;
          display: flex;
          flex-direction: column;
          gap: 8px;
          justify-content: center;
        }

        .subscribe-heading {
          font-size: 20px;
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .subscribe-sub {
          font-size: 13px;
          font-weight: 400;
          color: #999999;
          line-height: 1.4;
        }

        .subscribe-form-wrap {
          grid-column: 3 / 7;
          display: flex;
          align-items: center;
          gap: 0;
        }

        .subscribe-input {
          flex: 1;
          height: 48px;
          border: 1px solid #000000;
          border-right: none;
          padding: 0 16px;
          font-family: 'Arimo', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          background: #FFFFFF;
          outline: none;
          appearance: none;
        }

        .subscribe-input::placeholder {
          color: #999999;
        }

        .subscribe-input:focus {
          border-color: #000000;
        }

        .subscribe-btn {
          width: 48px;
          height: 48px;
          background: #E8001D;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 20px;
          font-weight: 400;
          transition: background 0.15s;
          flex-shrink: 0;
        }

        .subscribe-btn:hover {
          background: #C50019;
        }

        /* Footer */
        .site-footer {
          border-top: 1px solid #000000;
          padding: 24px 48px;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-copy {
          font-size: 11px;
          font-weight: 400;
          color: #999999;
          letter-spacing: 0.04em;
        }

        .footer-disclaimer {
          font-size: 11px;
          font-weight: 400;
          color: #999999;
          max-width: 480px;
          text-align: right;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .grid-8 {
            grid-template-columns: repeat(4, 1fr);
            padding: 0 24px;
          }
          .site-header,
          .site-footer {
            padding: 0 24px;
          }
          .hero-number {
            grid-column: 1 / 3;
            font-size: 96px;
          }
          .hero-meta {
            grid-column: 3 / 5;
            gap: 16px;
          }
          .hero-stats {
            gap: 24px;
          }
          .method-title {
            grid-column: 1 / 5;
            margin-bottom: 24px;
          }
          .method-body {
            grid-column: 1 / 5;
          }
          .subscribe-label {
            grid-column: 1 / 5;
            margin-bottom: 16px;
          }
          .subscribe-form-wrap {
            grid-column: 1 / 5;
          }
          .site-footer {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
          .footer-disclaimer {
            text-align: left;
          }
        }
      `}</style>

      <div className="swiss-page">
        {/* ── HEADER ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
          <div className="header-inner">
            <span className="header-wordmark">ClusterDesk</span>
          </div>
        </div>
        <hr className="header-rule" style={{ maxWidth: "100%", borderRadius: 0 }} />

        {/* ── HERO ── */}
        <section className="hero-section">
          <div className="grid-8">
            <div className="hero-number">87</div>
            <div className="hero-meta">
              <div>
                <div className="hero-ticker">MVST</div>
                <div className="hero-company-name" style={{ marginTop: 8 }}>
                  Microvast Holdings
                </div>
              </div>
              <p className="hero-description">
                Three executives purchased shares within a 4-day window — the highest cluster
                signal score this week. CEO-led buying with CFO and director confirmation.
              </p>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-value">3</div>
                  <div className="hero-stat-label">Insiders</div>
                </div>
                <div>
                  <div className="hero-stat-value">$312K</div>
                  <div className="hero-stat-label">Total bought</div>
                </div>
                <div>
                  <div className="hero-stat-value">4 days</div>
                  <div className="hero-stat-label">Window</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CLUSTER LIST ── */}
        <section className="clusters-section">
          <div className="grid-8" style={{ marginBottom: 16 }}>
            <div style={{ gridColumn: "1 / 9" }}>
              <span className="section-label">Active clusters — week of Nov 4, 2024</span>
            </div>
          </div>

          {/* Column headers */}
          <div className="grid-8 clusters-header">
            <div style={{ gridColumn: "1 / 2" }}>
              <span className="clusters-col-label">Score</span>
            </div>
            <div style={{ gridColumn: "2 / 3" }}>
              <span className="clusters-col-label">Ticker</span>
            </div>
            <div style={{ gridColumn: "3 / 6" }}>
              <span className="clusters-col-label">Company</span>
            </div>
            <div style={{ gridColumn: "6 / 7" }}>
              <span className="clusters-col-label">Insiders</span>
            </div>
            <div style={{ gridColumn: "7 / 8" }}>
              <span className="clusters-col-label">Bought</span>
            </div>
            <div style={{ gridColumn: "8 / 9" }} />
          </div>

          {clusters.map((c, i) => (
            <div key={c.ticker} className="cluster-row">
              {/* Row summary */}
              <div
                className="cluster-row-inner"
                style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}
                onClick={() => setExpanded(expanded === c.ticker ? null : c.ticker)}
              >
                <div style={{ gridColumn: "1 / 2" }}>
                  <span
                    className={`cluster-score${i === 0 ? " cluster-score-red" : ""}`}
                  >
                    {c.score}
                  </span>
                </div>
                <div style={{ gridColumn: "2 / 3" }}>
                  <span className="cluster-ticker">{c.ticker}</span>
                </div>
                <div style={{ gridColumn: "3 / 6" }}>
                  <span className="cluster-name">{c.name}</span>
                </div>
                <div style={{ gridColumn: "6 / 7" }}>
                  <span className="cluster-insiders">{c.insiders}</span>
                </div>
                <div style={{ gridColumn: "7 / 8" }}>
                  <span className="cluster-amount">{c.totalBought}</span>
                </div>
                <div style={{ gridColumn: "8 / 9", textAlign: "right" }}>
                  <span className={`expand-indicator${expanded === c.ticker ? " open" : ""}`}>
                    +
                  </span>
                </div>
              </div>

              {/* Expandable insider table */}
              <div
                className={`insider-table-wrap${expanded === c.ticker ? " open" : ""}`}
                style={{ maxWidth: 1200, margin: "0 auto", padding: `0 48px` }}
              >
                <table className="insider-table">
                  <thead>
                    <tr>
                      <th style={{ width: "24%" }}>Name</th>
                      <th style={{ width: "20%" }}>Title</th>
                      <th style={{ width: "18%" }}>Shares</th>
                      <th style={{ width: "18%" }}>Value</th>
                      <th style={{ width: "20%" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.transactions.map((t) => (
                      <tr key={t.name}>
                        <td style={{ fontWeight: 500 }}>{t.name}</td>
                        <td style={{ color: "#999999" }}>{t.title}</td>
                        <td>{t.shares.toLocaleString()}</td>
                        <td>{t.value}</td>
                        <td style={{ color: "#999999" }}>{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* ── METHODOLOGY ── */}
        <section className="method-section">
          <div className="grid-8">
            <div className="method-title">How the score works</div>
            <div className="method-body">
              <div className="method-rule-item">
                <span className="method-rule-num">01</span>
                <p className="method-rule-text">
                  <strong>Cluster detection.</strong> Two or more insiders at the same company
                  must file Form 4 purchases within a 10-day window. Single buys are excluded.
                </p>
              </div>
              <div className="method-rule-item">
                <span className="method-rule-num">02</span>
                <p className="method-rule-text">
                  <strong>Seniority weighting.</strong> CEO and CFO purchases carry 2× weight.
                  Director and VP purchases carry 1× weight. Clusters with C-suite participation
                  score higher.
                </p>
              </div>
              <div className="method-rule-item">
                <span className="method-rule-num">03</span>
                <p className="method-rule-text">
                  <strong>Size filter.</strong> Only micro-cap companies (market cap under $300M)
                  are included. Large-cap insider buys are statistically weaker signals.
                </p>
              </div>
              <div className="method-rule-item">
                <span className="method-rule-num">04</span>
                <p className="method-rule-text">
                  <strong>Dollar conviction.</strong> The aggregate purchase value is normalised
                  against the insider's known compensation. A $50K purchase by an executive
                  earning $200K is weighted more heavily than a $500K purchase by a billionaire.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SUBSCRIBE ── */}
        <section className="subscribe-section">
          <div className="grid-8">
            <div className="subscribe-label">
              <div className="subscribe-heading">
                Weekly alert.
                <br />
                No noise.
              </div>
              <p className="subscribe-sub">
                Every Monday, 06:00 ET.
                <br />
                Top 5 clusters only.
              </p>
            </div>
            <div className="subscribe-form-wrap">
              <input
                className="subscribe-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setEmail("")}
              />
              <button
                className="subscribe-btn"
                onClick={() => setEmail("")}
                aria-label="Subscribe"
              >
                →
              </button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div style={{ borderTop: "1px solid #000000" }}>
          <div className="site-footer">
            <span className="footer-copy">© 2026 ClusterDesk</span>
            <span className="footer-disclaimer">
              Not investment advice. All data sourced from SEC Form 4 filings.
              Past insider activity does not guarantee future returns.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
