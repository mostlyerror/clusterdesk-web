"use client";

import React from "react";

const clusterData = [
  {
    ticker: "MVST",
    company: "Microvast Holdings, Inc.",
    score: 87,
    insiders: 3,
    totalAmount: "$312,000",
    windowDays: 4,
    marketCap: "$124M",
    roles: ["Chief Executive Officer", "Chief Financial Officer", "Director"],
    priceAtPurchase: "$2.14",
    postSignalReturn: "+14.2%",
    sector: "Energy Storage",
  },
  {
    ticker: "AEYE",
    company: "AudioEye, Inc.",
    score: 74,
    insiders: 2,
    totalAmount: "$88,000",
    windowDays: 7,
    marketCap: "$67M",
    roles: ["Chief Executive Officer", "Director"],
    priceAtPurchase: "$8.73",
    postSignalReturn: "+8.6%",
    sector: "Accessibility Technology",
  },
  {
    ticker: "ZDGE",
    company: "Zedge, Inc.",
    score: 62,
    insiders: 2,
    totalAmount: "$47,000",
    windowDays: 6,
    marketCap: "$41M",
    roles: ["President", "Director"],
    priceAtPurchase: "$1.92",
    postSignalReturn: "+5.3%",
    sector: "Digital Content",
  },
];

const convictionMean = 74.3;
const convictionSd = 12.8;
const totalSignals = 132;
const analysisWindow = "May 1–12, 2026";
const universeSize = 2847;

export default function AcademicPaperPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Source+Code+Pro:wght@400&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #ffffff;
          color: #000000;
        }

        .paper-root {
          font-family: 'Source Serif 4', 'Georgia', serif;
          font-size: 10.5pt;
          line-height: 1.55;
          background: #ffffff;
          color: #000000;
          min-height: 100vh;
          padding: 48px 24px 80px;
        }

        .paper-container {
          max-width: 860px;
          margin: 0 auto;
        }

        /* ---- HEADER ---- */
        .paper-header {
          text-align: center;
          border-bottom: 2px solid #000000;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }

        .paper-journal-line {
          font-size: 8.5pt;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 14px;
        }

        .paper-title {
          font-size: 18pt;
          font-weight: 600;
          line-height: 1.25;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .paper-subtitle-line {
          font-size: 9pt;
          color: #555;
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }

        .paper-authors {
          font-size: 10pt;
          margin-bottom: 4px;
        }

        .paper-affiliation {
          font-size: 8.5pt;
          font-style: italic;
          color: #555;
          margin-bottom: 10px;
        }

        .paper-dates {
          font-size: 8pt;
          color: #666;
          letter-spacing: 0.03em;
        }

        /* ---- ABSTRACT ---- */
        .abstract-block {
          background: #F8F8F8;
          border-left: 3px solid #000;
          padding: 16px 20px;
          margin: 22px 0;
          font-size: 9.5pt;
          line-height: 1.6;
        }

        .abstract-block p {
          margin-bottom: 0;
        }

        .abstract-label {
          font-weight: 600;
          font-style: normal;
        }

        .keywords-line {
          margin-top: 10px;
          font-size: 8.5pt;
          color: #333;
        }

        .keywords-label {
          font-style: italic;
        }

        /* ---- TWO COLUMN BODY ---- */
        .paper-body {
          column-count: 2;
          column-gap: 28px;
          column-rule: 1px solid #ddd;
          margin-top: 8px;
        }

        .break-avoid {
          break-inside: avoid;
        }

        /* ---- SECTIONS ---- */
        .section {
          margin-bottom: 18px;
          break-inside: avoid-column;
        }

        .section-heading {
          font-size: 11pt;
          font-weight: 600;
          margin-bottom: 6px;
          margin-top: 18px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 2px;
        }

        .section-heading:first-child {
          margin-top: 0;
        }

        .subsection-heading {
          font-size: 10pt;
          font-weight: 600;
          font-style: italic;
          margin-top: 12px;
          margin-bottom: 4px;
        }

        p {
          margin-bottom: 8px;
          text-align: justify;
          hyphens: auto;
        }

        /* ---- INLINE ELEMENTS ---- */
        a {
          color: #0066CC;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        sup.ref {
          font-size: 7pt;
          color: #0066CC;
          cursor: default;
        }

        .mono {
          font-family: 'Source Code Pro', 'Courier New', monospace;
          font-size: 9pt;
          background: #f4f4f4;
          padding: 1px 4px;
          border-radius: 2px;
        }

        .highlight-score {
          color: #0066CC;
          font-weight: 600;
        }

        /* ---- TABLES ---- */
        .table-wrapper {
          margin: 14px 0;
          break-inside: avoid;
        }

        .paper-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8.5pt;
          font-family: 'Source Serif 4', 'Georgia', serif;
        }

        .paper-table thead tr {
          border-top: 1.5px solid #000;
          border-bottom: 1px solid #000;
        }

        .paper-table th {
          padding: 4px 6px;
          text-align: left;
          font-weight: 600;
          font-size: 8pt;
          letter-spacing: 0.03em;
        }

        .paper-table th.right,
        .paper-table td.right {
          text-align: right;
        }

        .paper-table td {
          padding: 4px 6px;
          vertical-align: top;
          border-bottom: 0.5px solid #e0e0e0;
        }

        .paper-table tbody tr:last-child td {
          border-bottom: 1.5px solid #000;
        }

        .table-caption {
          font-size: 8pt;
          color: #666;
          text-align: center;
          margin-top: 5px;
          font-style: italic;
          line-height: 1.4;
        }

        .table-caption strong {
          font-style: normal;
          font-weight: 600;
          color: #333;
        }

        /* ---- FORMULA / EQUATION ---- */
        .equation-block {
          text-align: center;
          font-family: 'Source Serif 4', 'Georgia', serif;
          font-style: italic;
          font-size: 10pt;
          padding: 10px 0;
          color: #111;
        }

        .equation-label {
          float: right;
          font-style: normal;
          font-size: 9pt;
          color: #555;
          margin-top: 2px;
        }

        /* ---- CALLOUT / FIGURE ---- */
        .figure-block {
          border: 1px solid #ccc;
          padding: 12px 14px;
          margin: 14px 0;
          break-inside: avoid;
          background: #fafafa;
        }

        .figure-caption {
          font-size: 8pt;
          color: #666;
          text-align: center;
          margin-top: 8px;
          font-style: italic;
        }

        .figure-caption strong {
          font-style: normal;
          color: #333;
        }

        .score-bar-row {
          display: flex;
          align-items: center;
          margin-bottom: 7px;
          font-size: 8.5pt;
          gap: 8px;
        }

        .score-bar-label {
          width: 36px;
          font-family: 'Source Code Pro', monospace;
          font-size: 8pt;
          flex-shrink: 0;
        }

        .score-bar-track {
          flex: 1;
          height: 8px;
          background: #e8e8e8;
          border-radius: 1px;
          overflow: hidden;
        }

        .score-bar-fill {
          height: 100%;
          background: #0066CC;
          border-radius: 1px;
        }

        .score-bar-value {
          width: 26px;
          text-align: right;
          font-size: 8pt;
          font-weight: 600;
          flex-shrink: 0;
        }

        /* ---- FOOTNOTES ---- */
        .footnotes-section {
          margin-top: 24px;
          border-top: 1px solid #000;
          padding-top: 8px;
          column-count: 2;
          column-gap: 28px;
        }

        .footnote-item {
          font-size: 8pt;
          line-height: 1.45;
          margin-bottom: 5px;
          color: #333;
          break-inside: avoid;
        }

        .footnote-num {
          color: #0066CC;
          font-size: 7pt;
          vertical-align: super;
          margin-right: 2px;
        }

        /* ---- SUBSCRIBE ---- */
        .subscribe-block {
          border: 1.5px solid #000;
          padding: 14px 18px;
          margin: 18px 0;
          break-inside: avoid;
          text-align: center;
          background: #fff;
        }

        .subscribe-block p {
          margin-bottom: 6px;
          text-align: center;
        }

        .subscribe-link {
          font-size: 10pt;
          color: #0066CC;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.02em;
        }

        .subscribe-link:hover {
          text-decoration: underline;
        }

        .subscribe-citation-note {
          font-size: 8pt;
          color: #666;
          font-style: italic;
          margin-top: 4px;
        }

        /* ---- PAGE FOOTER ---- */
        .paper-page-footer {
          max-width: 860px;
          margin: 24px auto 0;
          border-top: 2px solid #000;
          padding-top: 6px;
          display: flex;
          justify-content: space-between;
          font-size: 8pt;
          color: #555;
        }

        /* ---- COLUMN BREAK HELPER ---- */
        .column-break {
          break-before: column;
        }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 600px) {
          .paper-body {
            column-count: 1;
          }
          .footnotes-section {
            column-count: 1;
          }
          .paper-title {
            font-size: 14pt;
          }
        }
      `}</style>

      <div className="paper-root">
        <div className="paper-container">

          {/* ================================================================
              HEADER
          ================================================================ */}
          <header className="paper-header">
            <div className="paper-journal-line">
              ClusterDesk Intelligence &mdash; Market Microstructure Series
            </div>
            <h1 className="paper-title">
              Cluster Buy Signal Detection in Micro-Cap Securities:<br />
              A Real-Time Analysis
            </h1>
            <div className="paper-subtitle-line">
              ClusterDesk Intelligence &middot; Vol.&nbsp;1, Issue&nbsp;{totalSignals} &middot; May&nbsp;12,&nbsp;2026
            </div>
            <div className="paper-authors">
              ClusterDesk Quantitative Research Group
            </div>
            <div className="paper-affiliation">
              ClusterDesk, Inc. &mdash; Insider Signal Intelligence Platform
            </div>
            <div className="paper-dates">
              Received: May 1, 2026 &nbsp;|&nbsp; Accepted: May 10, 2026 &nbsp;|&nbsp; Published: May 12, 2026
            </div>
          </header>

          {/* ================================================================
              ABSTRACT (single column)
          ================================================================ */}
          <div className="abstract-block">
            <p>
              <span className="abstract-label">Abstract: </span>
              We present a systematic analysis of coordinated insider purchase activity in micro-capitalization
              U.S. equities for the period {analysisWindow}, covering a universe of {universeSize.toLocaleString()} securities.
              Cluster buy signals&mdash;defined as two or more corporate insiders purchasing open-market shares
              within a rolling 10-day window&mdash;are identified and scored using a proprietary conviction
              metric (μ={convictionMean}, σ={convictionSd}) that weights role seniority, capital deployment,
              and temporal clustering. Our methodology surfaces {totalSignals} active signals across the
              observation period, with the highest-conviction events concentrated in energy storage,
              accessibility technology, and digital content verticals. The dataset is made available
              in real time to subscribers and is updated at market close each trading session.
            </p>
            <div className="keywords-line">
              <span className="keywords-label">Keywords: </span>
              insider trading signals, cluster buy detection, micro-cap equities, Form&nbsp;4 filings,
              conviction scoring, market microstructure
            </div>
          </div>

          {/* ================================================================
              BODY — TWO COLUMNS
          ================================================================ */}
          <div className="paper-body">

            {/* ---- 1. INTRODUCTION ---- */}
            <div className="section">
              <h2 className="section-heading">1. Introduction</h2>
              <p>
                Corporate insiders&mdash;officers, directors, and beneficial owners holding more than
                10% of outstanding shares&mdash;are required to disclose open-market transactions within
                two business days via SEC Form&nbsp;4 filings.<sup className="ref">[1]</sup> While individual
                insider purchases have been widely studied in the academic literature
                (Seyhun 1986; Lakonishok &amp; Lee 2001), the phenomenon of <em>coordinated</em> purchase
                activity by multiple insiders within a compressed time window has received comparatively
                little systematic attention.
              </p>
              <p>
                This paper presents a real-time framework for identifying such cluster buy events in
                micro-capitalization securities (defined here as market capitalizations below $300M),
                a segment where information asymmetry between insiders and the general investing public
                is empirically largest.<sup className="ref">[2]</sup> We argue that concurrent multi-insider
                buying constitutes a stronger signal than single-insider activity because it implies
                either (a)&nbsp;independent convergence on shared valuation views, or (b)&nbsp;coordinated
                conviction following a material internal development not yet reflected in the share price.
              </p>
              <p>
                The remainder of this paper is organized as follows. Section&nbsp;2 describes the data
                sources and signal construction methodology. Section&nbsp;3 presents detected cluster
                buy events for the current observation window. Section&nbsp;4 discusses implications
                and recommended uses of the data.
              </p>
            </div>

            {/* ---- 2. METHODOLOGY ---- */}
            <div className="section">
              <h2 className="section-heading">2. Methodology</h2>

              <h3 className="subsection-heading">2.1 Data Sources</h3>
              <p>
                Raw transaction data are sourced from SEC EDGAR Form&nbsp;4 filings, parsed in
                near-real-time via EDGAR&rsquo;s SGML feed.<sup className="ref">[3]</sup> Transaction records
                are cross-referenced against company master files to extract market capitalization at
                the time of filing. The universe is restricted to securities with market caps below
                $300M and average daily volume exceeding 50,000 shares to ensure minimum liquidity
                for signal actionability.
              </p>

              <h3 className="subsection-heading">2.2 Cluster Detection Algorithm</h3>
              <p>
                A cluster event is defined as two or more distinct insider purchases in the same
                issuer within a rolling 10-calendar-day window. Purchases by the same individual
                across multiple sessions are consolidated into a single position event. The detection
                algorithm operates as follows:
              </p>

              <div className="equation-block break-avoid">
                <span className="equation-label">(1)</span>
                C(t) = {"{i ∈ I : p"}&#x1D456; &isin; [t &minus; 10, t]{"}"}
              </div>

              <p>
                where <em>I</em> denotes the set of distinct insiders and <em>p</em><sub>i</sub> the
                purchase date for insider <em>i</em>. A cluster signal is triggered when |C(t)|&nbsp;&ge;&nbsp;2.
              </p>

              <h3 className="subsection-heading">2.3 Conviction Score Construction</h3>
              <p>
                The conviction score (μ={convictionMean}, σ={convictionSd}) reflects a weighted composite
                of four sub-components, each normalized to a 0–100 scale:
              </p>

              <div className="table-wrapper break-avoid">
                <table className="paper-table">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th className="right">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Role seniority (CEO/CFO vs. Director)</td><td className="right">35%</td></tr>
                    <tr><td>Total capital deployed</td><td className="right">30%</td></tr>
                    <tr><td>Temporal compression (window width)</td><td className="right">20%</td></tr>
                    <tr><td>Market-cap-relative purchase size</td><td className="right">15%</td></tr>
                  </tbody>
                </table>
                <div className="table-caption">
                  <strong>Table 1:</strong> Conviction score sub-component weights used in the composite scoring model.
                </div>
              </div>

              <p>
                Final scores above&nbsp;80 are classified as <em>high conviction</em>; 60–79 as
                <em> moderate conviction</em>; below&nbsp;60 as <em>watch-list</em> candidates.
                This classification mirrors the quartile structure observed in back-tested samples
                spanning 2018–2025 ({totalSignals}&nbsp;total signals in current issue).
              </p>
            </div>

            {/* ---- 3. RESULTS ---- */}
            <div className="section column-break">
              <h2 className="section-heading">3. Results</h2>

              <h3 className="subsection-heading">3.1 Detected Cluster Buy Events</h3>
              <p>
                Table&nbsp;2 presents all cluster buy events detected during the current observation
                window ({analysisWindow}), ranked in descending order by conviction score. As demonstrated
                in Table&nbsp;2, the highest-conviction event involves {clusterData[0].insiders}&nbsp;insiders
                at <span className="mono">{clusterData[0].ticker}</span> ({clusterData[0].company}) with
                aggregate purchases totaling {clusterData[0].totalAmount}.
              </p>

              <div className="table-wrapper break-avoid">
                <table className="paper-table">
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Issuer</th>
                      <th className="right">Score</th>
                      <th className="right">n</th>
                      <th className="right">Capital</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusterData.map((row) => (
                      <tr key={row.ticker}>
                        <td><span className="mono">{row.ticker}</span></td>
                        <td style={{ fontSize: "8pt" }}>{row.company}</td>
                        <td className="right">
                          <span className="highlight-score">{row.score}</span>
                        </td>
                        <td className="right">{row.insiders}</td>
                        <td className="right">{row.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="table-caption">
                  <strong>Table 2:</strong> Cluster buy events detected during {analysisWindow},
                  ranked by conviction score. Column&nbsp;<em>n</em> denotes number of distinct insiders.
                </div>
              </div>

              <h3 className="subsection-heading">3.2 Conviction Score Distribution</h3>
              <p>
                Figure&nbsp;1 illustrates the relative conviction scores across all three detected
                events. The distribution is consistent with historical patterns for high-conviction
                signals (μ={convictionMean}, σ={convictionSd}) observed in prior issues.
              </p>

              <div className="figure-block break-avoid">
                {clusterData.map((row) => (
                  <div key={row.ticker} className="score-bar-row">
                    <span className="score-bar-label">{row.ticker}</span>
                    <div className="score-bar-track">
                      <div
                        className="score-bar-fill"
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                    <span className="score-bar-value">{row.score}</span>
                  </div>
                ))}
                <div className="figure-caption">
                  <strong>Figure 1:</strong> Conviction scores for detected cluster buy events.
                  Horizontal axis normalized to 0–100 scale.
                </div>
              </div>

              <h3 className="subsection-heading">3.3 Extended Event Detail</h3>
              <p>
                Table&nbsp;3 provides supplemental data for each event, including market capitalization,
                average purchase price, and 5-day post-signal price change where available. Post-signal
                returns are reported for informational purposes only and do not constitute evidence of
                predictive validity for any individual event.<sup className="ref">[4]</sup>
              </p>

              <div className="table-wrapper break-avoid">
                <table className="paper-table">
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Sector</th>
                      <th className="right">Mkt Cap</th>
                      <th className="right">Price</th>
                      <th className="right">+5d</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusterData.map((row) => (
                      <tr key={row.ticker}>
                        <td><span className="mono">{row.ticker}</span></td>
                        <td style={{ fontSize: "7.5pt" }}>{row.sector}</td>
                        <td className="right">{row.marketCap}</td>
                        <td className="right">{row.priceAtPurchase}</td>
                        <td className="right" style={{ color: "#0066CC" }}>{row.postSignalReturn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="table-caption">
                  <strong>Table 3:</strong> Supplemental characteristics for detected cluster buy events.
                  5-day post-signal returns (column +5d) are preliminary and subject to revision.
                </div>
              </div>

              <h3 className="subsection-heading">3.4 Insider Role Composition</h3>
              <p>
                Across the three detected events, purchasing roles include Chief Executive Officers
                in all three cases (100%), Chief Financial Officers in one case (33.3%), and Directors
                in two cases (66.7%). The participation of C-suite officers&mdash;who are presumed to
                possess superior non-public information about near-term operational performance&mdash;is
                weighted heavily in the role seniority sub-component described in Section&nbsp;2.3.
              </p>
            </div>

            {/* ---- 4. CONCLUSION ---- */}
            <div className="section">
              <h2 className="section-heading">4. Conclusion</h2>
              <p>
                This issue presents {clusterData.length}&nbsp;cluster buy signals for the period
                {analysisWindow}, with conviction scores ranging from {clusterData[clusterData.length - 1].score}
                &nbsp;(<span className="mono">{clusterData[clusterData.length - 1].ticker}</span>) to&nbsp;
                <span className="highlight-score">{clusterData[0].score}</span>&nbsp;
                (<span className="mono">{clusterData[0].ticker}</span>). The high-conviction signal at
                &nbsp;<span className="mono">{clusterData[0].ticker}</span>&nbsp;merits priority attention:
                three insiders, including the CEO and CFO, deployed {clusterData[0].totalAmount} in aggregate
                within a {clusterData[0].windowDays}-day window at a market capitalization of only
                &nbsp;{clusterData[0].marketCap}.
              </p>
              <p>
                Practitioners using this dataset should treat cluster buy signals as a starting-point
                for further due diligence rather than standalone trade recommendations. The conviction
                score is a relative ranking mechanism within the micro-cap universe; it does not
                constitute investment advice.<sup className="ref">[5]</sup> We recommend cross-referencing
                detected events against recent 8-K filings, earnings guidance, and debt covenant
                disclosures before acting on any signal.
              </p>
              <p>
                Future issues will incorporate options flow data as an additional corroborating
                sub-component and extend coverage to small-cap securities (market cap $300M–$2B).
                Feedback and methodological critiques may be directed to the corresponding author
                via the subscriber portal.
              </p>

              <div className="subscribe-block break-avoid">
                <p style={{ fontSize: "9pt", color: "#444", marginBottom: "8px" }}>
                  ClusterDesk Intelligence is published on each trading day at market close.
                </p>
                <a className="subscribe-link" href="https://clusterdesk.io/subscribe">
                  [Subscribe to receive preprints]
                </a>
                <p className="subscribe-citation-note">
                  Cite as: ClusterDesk Research Group. (2026). <em>Cluster Buy Signal Detection in
                  Micro-Cap Securities: A Real-Time Analysis.</em> ClusterDesk Intelligence,
                  Vol.&nbsp;1(132). https://clusterdesk.io/reports/vol1-132
                </p>
              </div>
            </div>

          </div>
          {/* end paper-body */}

          {/* ================================================================
              FOOTNOTES
          ================================================================ */}
          <div className="footnotes-section">
            <div className="footnote-item">
              <span className="footnote-num">[1]</span>
              Securities Exchange Act of 1934, Section&nbsp;16(a); amended by Sarbanes-Oxley Act of 2002,
              Section&nbsp;403 (accelerating the filing deadline from 10 days to 2 business days).
            </div>
            <div className="footnote-item">
              <span className="footnote-num">[2]</span>
              Lakonishok, J., &amp; Lee, I. (2001). Are insider trades informative? <em>Review of Financial Studies</em>,
              14(1), 79–111.
            </div>
            <div className="footnote-item">
              <span className="footnote-num">[3]</span>
              EDGAR Full-Text Search and SGML bulk data feed: https://www.sec.gov/cgi-bin/browse-edgar.
              Data latency is typically under 15 minutes following SEC acceptance.
            </div>
            <div className="footnote-item">
              <span className="footnote-num">[4]</span>
              Post-signal returns are computed from the later of the cluster completion date or
              the first available market-close price following the final Form&nbsp;4 filing in the cluster.
            </div>
            <div className="footnote-item">
              <span className="footnote-num">[5]</span>
              Past signal performance does not guarantee future results. ClusterDesk, Inc. is not a
              registered investment advisor. All content is for informational purposes only.
            </div>
          </div>

          {/* ================================================================
              PAGE FOOTER
          ================================================================ */}
          <footer className="paper-page-footer">
            <span>ClusterDesk Intelligence &middot; Vol.&nbsp;1, Issue&nbsp;{totalSignals}</span>
            <span>clusterdesk.io &middot; May&nbsp;12,&nbsp;2026</span>
            <span>&copy; 2026 ClusterDesk, Inc.</span>
          </footer>

        </div>
      </div>
    </>
  );
}
