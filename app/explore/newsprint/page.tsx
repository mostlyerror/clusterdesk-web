"use client";

import React, { useState } from "react";

const clusterData = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiderCount: 3,
    totalValue: "$312,000",
    dateRange: "May 1–5, 2026",
    transactions: [
      { name: "Yang Wu", title: "Chief Executive Officer", amount: "$180,000", shares: "142,857", date: "May 1, 2026" },
      { name: "Sascha Kelterborn", title: "Director", amount: "$82,000", shares: "65,079", date: "May 3, 2026" },
      { name: "Craig Webster", title: "Chief Financial Officer", amount: "$50,000", shares: "39,683", date: "May 5, 2026" },
    ],
    headline: "CEO Leads $312,000 Buying Spree at Microvast",
    deck: "Three senior executives purchase shares in coordinated cluster, signaling management conviction in battery-technology turnaround thesis amid sector headwinds.",
    body: `In a striking display of insider conviction, Microvast Holdings saw its chief executive officer, chief financial officer, and a sitting board director purchase a combined $312,000 in company shares across a four-day window ending May 5th — a pattern that ClusterDesk's proprietary scoring model flags as a high-conviction cluster event.

Yang Wu, who has led the embattled battery manufacturer since its founding, initiated the cluster with a $180,000 purchase on Monday, acquiring 142,857 shares at an average price of $1.26. Two days later, Director Sascha Kelterborn followed with an $82,000 position, before CFO Craig Webster rounded out the cluster on Friday with a $50,000 purchase.

The coordinated buying comes as Microvast trades near multi-year lows, having shed more than seventy percent of its value over the prior twelve months amid broader pressure on electric-vehicle supply-chain names. Management's willingness to commit personal capital at these levels may signal their belief that the market has overcorrected.`,
    pullQuote: "Three senior executives deployed personal capital within four days — a pattern our model has historically associated with meaningful twelve-month outperformance.",
    sector: "Clean Energy / EV Infrastructure",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiderCount: 2,
    totalValue: "$88,000",
    dateRange: "May 6–8, 2026",
    transactions: [
      { name: "David Moradi", title: "Chief Executive Officer", amount: "$55,000", shares: "18,333", date: "May 6, 2026" },
      { name: "Kelly Georgevich", title: "Director", amount: "$33,000", shares: "11,000", date: "May 8, 2026" },
    ],
    headline: "AudioEye Insiders Add $88,000 in Accessibility-Tech Play",
    deck: "CEO and director step into the market as shares retreat from recent highs, extending a pattern of management accumulation in digital accessibility software.",
    body: `AudioEye's chief executive and a board director separately acquired shares totaling $88,000 over two days last week, the latest in a series of insider purchases at the Tucson-based accessibility software company. The cluster earns a 74 conviction score on the ClusterDesk model — a meaningful signal for a company of AudioEye's market capitalization.`,
    sector: "Software / Accessibility Tech",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiderCount: 2,
    totalValue: "$47,000",
    dateRange: "May 9–10, 2026",
    transactions: [
      { name: "Jonathan Reich", title: "Chief Executive Officer", amount: "$28,000", shares: "9,333", date: "May 9, 2026" },
      { name: "Tom Arnhold", title: "Chairman", amount: "$19,000", shares: "6,333", date: "May 10, 2026" },
    ],
    headline: "Zedge Chairman, CEO Buy in Tandem as Mobile Platform Stabilizes",
    deck: "Back-to-back purchases by Zedge's top two executives suggest renewed confidence in the digital content platform's monetization trajectory.",
    body: `Zedge's chairman and chief executive made consecutive open-market purchases last Friday and Monday, amassing a combined $47,000 position in the mobile content platform. The cluster, while modest in absolute dollar terms, carries weight given the company's micro-cap status and the seniority of the buyers.`,
    sector: "Mobile / Digital Content",
  },
];

export default function NewsprintPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featured = clusterData[0];
  const secondary = clusterData.slice(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Oswald:wght@400;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          background: #F4F1E8;
          color: #1A1208;
          font-family: 'Libre Baskerville', Georgia, serif;
        }

        .newsprint-page {
          min-height: 100vh;
          background-color: #F4F1E8;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeBlend in='SourceGraphic' mode='multiply'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
          color: #1A1208;
        }

        .page-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 48px;
        }

        /* ── MASTHEAD ── */
        .masthead-top-rule {
          border: none;
          border-top: 1px solid #1A1208;
          margin-top: 20px;
          margin-bottom: 6px;
        }

        .masthead-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Oswald', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #1A1208;
          margin-bottom: 4px;
        }

        .masthead-title {
          text-align: center;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(48px, 8vw, 80px);
          font-weight: 900;
          letter-spacing: -0.01em;
          line-height: 1;
          color: #1A1208;
          padding: 8px 0 10px;
        }

        .masthead-double-rule {
          border: none;
          border-top: 3px solid #1A1208;
          box-shadow: 0 2px 0 0 #1A1208;
          margin-bottom: 0;
          padding-bottom: 3px;
        }

        .edition-bar {
          border-top: 1px solid #1A1208;
          border-bottom: 1px solid #1A1208;
          margin-top: 6px;
          padding: 4px 0;
          text-align: center;
          font-family: 'Oswald', sans-serif;
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #1A1208;
        }

        /* ── SECTION LABEL ── */
        .section-kicker {
          display: inline-block;
          font-family: 'Oswald', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8B1A1A;
          border-bottom: 2px solid #8B1A1A;
          padding-bottom: 2px;
        }

        .section-header-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          margin-bottom: 12px;
        }

        .section-header-rule {
          flex: 1;
          height: 1px;
          background: #C8C0A8;
        }

        /* ── FOLD LABELS ── */
        .fold-label {
          font-family: 'Oswald', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #8B1A1A;
          text-align: center;
          margin: 0;
          padding: 3px 0;
        }

        .fold-rule-thick {
          border: none;
          border-top: 4px double #1A1208;
          margin: 4px 0 16px;
        }

        /* ── ABOVE THE FOLD GRID ── */
        .above-fold-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 0;
          border-top: 1px solid #1A1208;
          border-bottom: 1px solid #C8C0A8;
        }

        .col-featured {
          padding: 16px 20px 16px 0;
          border-right: 1px solid #C8C0A8;
        }

        .col-secondary {
          padding: 16px 16px 16px 16px;
        }

        .col-secondary + .col-secondary {
          border-left: 1px solid #C8C0A8;
        }

        /* ── FEATURED STORY ── */
        .story-kicker {
          font-family: 'Oswald', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8B1A1A;
          margin-bottom: 6px;
        }

        .featured-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 900;
          font-style: italic;
          line-height: 1.1;
          color: #1A1208;
          margin-bottom: 10px;
        }

        .story-deck {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 15px;
          font-weight: 400;
          font-style: italic;
          line-height: 1.5;
          color: #2A2010;
          border-top: 1px solid #C8C0A8;
          border-bottom: 1px solid #C8C0A8;
          padding: 8px 0;
          margin-bottom: 10px;
        }

        .byline {
          font-family: 'Oswald', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #5A4A30;
          margin-bottom: 10px;
        }

        .body-copy {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 13.5px;
          line-height: 1.7;
          color: #1A1208;
          text-align: justify;
          hyphens: auto;
        }

        .body-copy p + p {
          text-indent: 1.5em;
          margin-top: 0;
        }

        /* ── PULL QUOTE ── */
        .pull-quote {
          border-top: 2px solid #8B1A1A;
          border-bottom: 2px solid #8B1A1A;
          padding: 12px 16px;
          margin: 16px 0;
        }

        .pull-quote-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 16px;
          font-style: italic;
          font-weight: 700;
          line-height: 1.4;
          color: #8B1A1A;
          text-align: center;
        }

        .pull-quote-attribution {
          font-family: 'Oswald', sans-serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #5A4A30;
          text-align: center;
          margin-top: 6px;
        }

        /* ── SCORE BADGE ── */
        .conviction-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #8B1A1A;
          padding: 4px 10px;
          margin-bottom: 12px;
        }

        .conviction-label {
          font-family: 'Oswald', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8B1A1A;
        }

        .conviction-score {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px;
          font-weight: 900;
          color: #8B1A1A;
          line-height: 1;
        }

        .conviction-max {
          font-family: 'Oswald', sans-serif;
          font-size: 10px;
          color: #8B1A1A;
          align-self: flex-end;
          margin-bottom: 2px;
        }

        /* ── SECONDARY STORY ── */
        .secondary-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 18px;
          font-weight: 700;
          font-style: italic;
          line-height: 1.2;
          color: #1A1208;
          margin-bottom: 8px;
        }

        .secondary-deck {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 12.5px;
          font-style: italic;
          line-height: 1.5;
          color: #3A2A15;
          margin-bottom: 8px;
          border-bottom: 1px solid #C8C0A8;
          padding-bottom: 8px;
        }

        .secondary-body {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 12.5px;
          line-height: 1.65;
          color: #1A1208;
          text-align: justify;
          hyphens: auto;
        }

        .stats-row {
          display: flex;
          gap: 10px;
          margin: 10px 0;
          flex-wrap: wrap;
        }

        .stat-chip {
          font-family: 'Oswald', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5A4A30;
          background: rgba(26, 18, 8, 0.05);
          border: 1px solid #C8C0A8;
          padding: 2px 7px;
        }

        /* ── BELOW THE FOLD ── */
        .below-fold-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        .below-col {
          padding: 16px 20px 16px 0;
        }

        .below-col + .below-col {
          padding: 16px 0 16px 20px;
          border-left: 1px solid #C8C0A8;
        }

        /* ── DATA TABLE ── */
        .table-header {
          font-family: 'Oswald', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #1A1208;
          border-top: 2px solid #1A1208;
          border-bottom: 1px solid #1A1208;
          padding: 5px 0;
          margin-bottom: 0;
        }

        .transactions-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 11.5px;
          color: #1A1208;
        }

        .transactions-table thead tr th {
          font-family: 'Oswald', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #5A4A30;
          border-bottom: 1px solid #1A1208;
          padding: 6px 4px 4px;
          text-align: left;
        }

        .transactions-table tbody tr td {
          padding: 5px 4px;
          border-bottom: 1px solid #C8C0A8;
          vertical-align: top;
          line-height: 1.4;
        }

        .transactions-table tbody tr:last-child td {
          border-bottom: 1px solid #1A1208;
        }

        .transactions-table tfoot tr td {
          font-family: 'Oswald', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 4px;
          color: #8B1A1A;
        }

        .td-name {
          font-weight: 700;
        }

        .td-title {
          font-size: 10.5px;
          color: #5A4A30;
          font-style: italic;
        }

        .td-amount {
          font-weight: 700;
          color: #8B1A1A;
          white-space: nowrap;
        }

        /* ── SUBSCRIPTION BOX ── */
        .subscribe-box {
          border: 2px dashed #1A1208;
          padding: 20px 24px;
          text-align: center;
        }

        .subscribe-kicker {
          font-family: 'Oswald', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #8B1A1A;
          margin-bottom: 6px;
        }

        .subscribe-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px;
          font-weight: 900;
          color: #1A1208;
          margin-bottom: 6px;
          line-height: 1.15;
        }

        .subscribe-subtext {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 12px;
          font-style: italic;
          color: #3A2A15;
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .subscribe-form {
          display: flex;
          gap: 0;
          max-width: 420px;
          margin: 0 auto;
        }

        .subscribe-input {
          flex: 1;
          padding: 8px 12px;
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 12px;
          background: transparent;
          border: 1px solid #1A1208;
          border-right: none;
          color: #1A1208;
          outline: none;
        }

        .subscribe-input::placeholder {
          color: #8A7A60;
          font-style: italic;
        }

        .subscribe-btn {
          padding: 8px 18px;
          font-family: 'Oswald', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: #1A1208;
          color: #F4F1E8;
          border: 1px solid #1A1208;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }

        .subscribe-btn:hover {
          background: #8B1A1A;
          border-color: #8B1A1A;
        }

        .subscribe-disclaimer {
          font-family: 'Oswald', sans-serif;
          font-size: 8.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8A7A60;
          margin-top: 10px;
        }

        .subscribed-msg {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 16px;
          font-style: italic;
          color: #1A1208;
        }

        /* ── FOOTER ── */
        .page-footer {
          border-top: 3px double #1A1208;
          margin-top: 24px;
          padding-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .footer-left {
          font-family: 'Libre Baskerville', Georgia, serif;
          font-size: 10px;
          color: #5A4A30;
          font-style: italic;
          max-width: 480px;
          line-height: 1.5;
        }

        .footer-right {
          font-family: 'Oswald', sans-serif;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8A7A60;
          text-align: right;
        }

        /* ── CLUSTER SUMMARY ROW ── */
        .cluster-summary {
          display: flex;
          gap: 0;
          border: 1px solid #1A1208;
          margin-bottom: 14px;
        }

        .cluster-summary-cell {
          flex: 1;
          padding: 8px 12px;
          border-right: 1px solid #C8C0A8;
          text-align: center;
        }

        .cluster-summary-cell:last-child {
          border-right: none;
        }

        .cluster-summary-label {
          font-family: 'Oswald', sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8A7A60;
          display: block;
          margin-bottom: 2px;
        }

        .cluster-summary-value {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 16px;
          font-weight: 700;
          color: #1A1208;
          line-height: 1.1;
        }

        .cluster-summary-value.red {
          color: #8B1A1A;
        }

        @media (max-width: 768px) {
          .above-fold-grid {
            grid-template-columns: 1fr;
          }
          .col-featured {
            border-right: none;
            padding-right: 0;
            border-bottom: 1px solid #C8C0A8;
          }
          .col-secondary + .col-secondary {
            border-left: none;
            border-top: 1px solid #C8C0A8;
          }
          .below-fold-grid {
            grid-template-columns: 1fr;
          }
          .below-col + .below-col {
            border-left: none;
            border-top: 1px solid #C8C0A8;
            padding: 16px 0 16px 0;
          }
          .page-footer {
            flex-direction: column;
            gap: 10px;
          }
          .footer-right {
            text-align: left;
          }
        }
      `}</style>

      <div className="newsprint-page">
        <div className="page-wrapper">

          {/* ── MASTHEAD ── */}
          <hr className="masthead-top-rule" />
          <div className="masthead-meta-row">
            <span>Est. 2026 · ClusterDesk.io</span>
            <span>Price: Complimentary</span>
          </div>

          <h1 className="masthead-title">THE CLUSTER DESK</h1>

          <hr className="masthead-double-rule" />

          <div className="edition-bar">
            Vol. MMXXVI &nbsp;·&nbsp; No. 132 &nbsp;·&nbsp; Tuesday, May 12, 2026
            &nbsp;·&nbsp; Daily Intelligence on Insider Conviction &nbsp;·&nbsp; Complimentary
          </div>

          {/* ── ABOVE THE FOLD ── */}
          <div className="section-header-row" style={{ marginTop: 18 }}>
            <span className="section-kicker">Markets</span>
            <div className="section-header-rule" />
            <span className="fold-label">Above the Fold</span>
            <div className="section-header-rule" />
          </div>

          <div className="above-fold-grid">
            {/* FEATURED: MVST */}
            <div className="col-featured">
              <div className="story-kicker">Cluster Alert &mdash; High Conviction</div>
              <h2 className="featured-headline">{featured.headline}</h2>

              <div className="conviction-badge">
                <span className="conviction-label">Conviction Score</span>
                <span className="conviction-score">{featured.score}</span>
                <span className="conviction-max">/100</span>
              </div>

              <p className="story-deck">{featured.deck}</p>

              <div className="byline">
                By the ClusterDesk Intelligence Desk &nbsp;|&nbsp; {featured.dateRange}
              </div>

              <div className="cluster-summary">
                <div className="cluster-summary-cell">
                  <span className="cluster-summary-label">Ticker</span>
                  <span className="cluster-summary-value red">{featured.ticker}</span>
                </div>
                <div className="cluster-summary-cell">
                  <span className="cluster-summary-label">Insiders</span>
                  <span className="cluster-summary-value">{featured.insiderCount}</span>
                </div>
                <div className="cluster-summary-cell">
                  <span className="cluster-summary-label">Total Purchased</span>
                  <span className="cluster-summary-value">{featured.totalValue}</span>
                </div>
                <div className="cluster-summary-cell">
                  <span className="cluster-summary-label">Sector</span>
                  <span className="cluster-summary-value" style={{ fontSize: 11, lineHeight: 1.3 }}>{featured.sector}</span>
                </div>
              </div>

              <div className="body-copy">
                {featured.body.trim().split("\n\n").map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>

              <div className="pull-quote">
                <p className="pull-quote-text">&#8220;{featured.pullQuote}&#8221;</p>
                <p className="pull-quote-attribution">&#8212; ClusterDesk Analysis, May 2026</p>
              </div>

              <div className="body-copy">
                <p>
                  Microvast reported its last quarterly earnings in March, posting revenue of $68 million, slightly ahead of consensus expectations. Management reiterated full-year guidance, citing improving margins on its European battery contracts. With three officers now holding larger positions, the June earnings report will be closely watched.
                </p>
              </div>
            </div>

            {/* SECONDARY: AEYE */}
            <div className="col-secondary">
              <div className="story-kicker" style={{ fontSize: 9 }}>Cluster Alert &mdash; Moderate</div>
              <h3 className="secondary-headline">{secondary[0].headline}</h3>
              <p className="secondary-deck">{secondary[0].deck}</p>
              <div className="byline" style={{ marginBottom: 6 }}>
                ClusterDesk Desk &nbsp;|&nbsp; {secondary[0].dateRange}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div className="conviction-badge" style={{ marginBottom: 0 }}>
                  <span className="conviction-label">Score</span>
                  <span className="conviction-score" style={{ fontSize: 18 }}>{secondary[0].score}</span>
                  <span className="conviction-max">/100</span>
                </div>
              </div>
              <div className="stats-row">
                <span className="stat-chip">{secondary[0].ticker}</span>
                <span className="stat-chip">{secondary[0].totalValue}</span>
                <span className="stat-chip">{secondary[0].insiderCount} insiders</span>
              </div>
              <p className="secondary-body">{secondary[0].body}</p>

              <table className="transactions-table" style={{ marginTop: 14 }}>
                <thead>
                  <tr>
                    <th>Executive</th>
                    <th>Role</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {secondary[0].transactions.map((tx, i) => (
                    <tr key={i}>
                      <td className="td-name">{tx.name}</td>
                      <td className="td-title">{tx.title}</td>
                      <td className="td-amount">{tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}>Total Cluster</td>
                    <td className="td-amount">{secondary[0].totalValue}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* SECONDARY: ZDGE */}
            <div className="col-secondary">
              <div className="story-kicker" style={{ fontSize: 9 }}>Cluster Alert &mdash; Moderate</div>
              <h3 className="secondary-headline">{secondary[1].headline}</h3>
              <p className="secondary-deck">{secondary[1].deck}</p>
              <div className="byline" style={{ marginBottom: 6 }}>
                ClusterDesk Desk &nbsp;|&nbsp; {secondary[1].dateRange}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div className="conviction-badge" style={{ marginBottom: 0 }}>
                  <span className="conviction-label">Score</span>
                  <span className="conviction-score" style={{ fontSize: 18 }}>{secondary[1].score}</span>
                  <span className="conviction-max">/100</span>
                </div>
              </div>
              <div className="stats-row">
                <span className="stat-chip">{secondary[1].ticker}</span>
                <span className="stat-chip">{secondary[1].totalValue}</span>
                <span className="stat-chip">{secondary[1].insiderCount} insiders</span>
              </div>
              <p className="secondary-body">{secondary[1].body}</p>

              <table className="transactions-table" style={{ marginTop: 14 }}>
                <thead>
                  <tr>
                    <th>Executive</th>
                    <th>Role</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {secondary[1].transactions.map((tx, i) => (
                    <tr key={i}>
                      <td className="td-name">{tx.name}</td>
                      <td className="td-title">{tx.title}</td>
                      <td className="td-amount">{tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2}>Total Cluster</td>
                    <td className="td-amount">{secondary[1].totalValue}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── BELOW THE FOLD ── */}
          <div style={{ marginTop: 24 }}>
            <div className="section-header-row">
              <div className="section-header-rule" />
              <span className="fold-label">Below the Fold</span>
              <div className="section-header-rule" />
            </div>
            <hr className="fold-rule-thick" />
          </div>

          <div className="below-fold-grid">
            {/* Transaction Detail Table */}
            <div className="below-col">
              <div className="section-header-row" style={{ marginTop: 0, marginBottom: 10 }}>
                <span className="section-kicker">Transaction Register</span>
                <div className="section-header-rule" />
              </div>

              <div className="table-header">
                All Cluster Transactions &mdash; Week of May 1–10, 2026
              </div>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Executive</th>
                    <th>Title</th>
                    <th>Amount</th>
                    <th>Shares</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {clusterData.flatMap((cluster) =>
                    cluster.transactions.map((tx, i) => (
                      <tr key={`${cluster.ticker}-${i}`}>
                        <td style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: "#8B1A1A", fontSize: 12, letterSpacing: "0.05em" }}>
                          {cluster.ticker}
                        </td>
                        <td className="td-name" style={{ fontSize: 11.5 }}>{tx.name}</td>
                        <td className="td-title">{tx.title}</td>
                        <td className="td-amount">{tx.amount}</td>
                        <td style={{ fontSize: 11, color: "#5A4A30", whiteSpace: "nowrap" }}>{tx.shares}</td>
                        <td style={{ fontSize: 10.5, color: "#5A4A30", whiteSpace: "nowrap" }}>{tx.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} style={{ borderTop: "1px solid #1A1208" }}>Week Total</td>
                    <td className="td-amount" style={{ borderTop: "1px solid #1A1208" }}>$447,000</td>
                    <td colSpan={2} style={{ borderTop: "1px solid #1A1208" }}>7 Transactions</td>
                  </tr>
                </tfoot>
              </table>

              <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 10, fontStyle: "italic", color: "#8A7A60", marginTop: 8, lineHeight: 1.5 }}>
                All transactions sourced from SEC Form 4 filings. Shares acquired via open-market purchases unless otherwise noted. ClusterDesk compiles and scores cluster events; this does not constitute investment advice.
              </p>
            </div>

            {/* Subscribe box */}
            <div className="below-col">
              <div className="section-header-row" style={{ marginTop: 0, marginBottom: 10 }}>
                <span className="section-kicker">Daily Edition</span>
                <div className="section-header-rule" />
              </div>

              <div className="subscribe-box">
                <p className="subscribe-kicker">Subscribe</p>
                <h3 className="subscribe-headline">
                  Subscribe to<br />The Daily Edition
                </h3>
                <p className="subscribe-subtext">
                  Receive the ClusterDesk morning briefing before market open — every trading day. Fresh cluster alerts, conviction scores, and transaction registers delivered in the format you are reading now.
                </p>

                {subscribed ? (
                  <p className="subscribed-msg">
                    Your subscription has been confirmed. The first edition arrives tomorrow morning.
                  </p>
                ) : (
                  <>
                    <div className="subscribe-form">
                      <input
                        type="email"
                        className="subscribe-input"
                        placeholder="Your electronic address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && email) setSubscribed(true);
                        }}
                      />
                      <button
                        className="subscribe-btn"
                        onClick={() => { if (email) setSubscribed(true); }}
                      >
                        Subscribe
                      </button>
                    </div>
                    <p className="subscribe-disclaimer">
                      No charge &nbsp;·&nbsp; No spam &nbsp;·&nbsp; Unsubscribe at any time
                    </p>
                  </>
                )}
              </div>

              {/* Cluster scoreboard */}
              <div style={{ marginTop: 20 }}>
                <div className="section-header-row" style={{ marginTop: 0, marginBottom: 10 }}>
                  <span className="section-kicker">Conviction Scoreboard</span>
                  <div className="section-header-rule" />
                </div>

                <div style={{ border: "1px solid #1A1208" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #1A1208" }}>
                        <th style={{ fontFamily: "'Oswald', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A4A30", padding: "6px 10px", textAlign: "left" }}>Ticker</th>
                        <th style={{ fontFamily: "'Oswald', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A4A30", padding: "6px 10px", textAlign: "left" }}>Company</th>
                        <th style={{ fontFamily: "'Oswald', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A4A30", padding: "6px 10px", textAlign: "right" }}>Score</th>
                        <th style={{ fontFamily: "'Oswald', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A4A30", padding: "6px 10px", textAlign: "right" }}>Value</th>
                        <th style={{ fontFamily: "'Oswald', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A4A30", padding: "6px 10px", textAlign: "right" }}>Insiders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clusterData.map((c, i) => (
                        <tr key={c.ticker} style={{ borderBottom: i < clusterData.length - 1 ? "1px solid #C8C0A8" : "none" }}>
                          <td style={{ padding: "7px 10px", fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: "#8B1A1A", fontSize: 13, letterSpacing: "0.05em" }}>{c.ticker}</td>
                          <td style={{ padding: "7px 10px", fontSize: 11.5 }}>{c.company}</td>
                          <td style={{ padding: "7px 10px", textAlign: "right", fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 15, color: i === 0 ? "#8B1A1A" : "#1A1208" }}>{c.score}</td>
                          <td style={{ padding: "7px 10px", textAlign: "right", fontSize: 11.5 }}>{c.totalValue}</td>
                          <td style={{ padding: "7px 10px", textAlign: "right", fontSize: 11.5 }}>{c.insiderCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Methodology note */}
              <div style={{ marginTop: 18, borderTop: "1px solid #C8C0A8", paddingTop: 12 }}>
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#8B1A1A", marginBottom: 6 }}>Methodology Note</p>
                <p style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 11.5, lineHeight: 1.6, color: "#1A1208", fontStyle: "italic" }}>
                  The ClusterDesk conviction score weighs cluster size (number of distinct insiders), aggregate dollar value, seniority of participants, time compression, and historical forward-return data for similar patterns. A score above 70 indicates a statistically unusual accumulation event warranting further research.
                </p>
              </div>
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div className="page-footer">
            <p className="footer-left">
              The Cluster Desk is an independent financial intelligence publication. Nothing herein constitutes investment advice, a solicitation to buy or sell any security, or a recommendation of any kind. All Form 4 data sourced from public SEC filings. Past cluster patterns are no guarantee of future performance. Read with appropriate skepticism and consult a qualified adviser before acting.
            </p>
            <div className="footer-right">
              <div>ClusterDesk.io</div>
              <div style={{ marginTop: 4 }}>Tuesday, May 12, 2026</div>
              <div style={{ marginTop: 4 }}>All Rights Reserved</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
