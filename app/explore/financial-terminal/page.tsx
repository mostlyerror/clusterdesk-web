"use client";

import { useState } from "react";

const CLUSTERS = [
  {
    ticker: "MVST",
    name: "MICROVAST HOLDINGS",
    score: 87,
    insiders: 3,
    value: "$312K",
    roles: "CEO + CFO + DIR",
    dateRange: "MAY 01-05 2026",
    status: "ACTIVE",
  },
  {
    ticker: "AEYE",
    name: "AUDIOEYE INC",
    score: 74,
    insiders: 2,
    value: "$88K",
    roles: "CEO + DIR",
    dateRange: "MAY 06-08 2026",
    status: "ACTIVE",
  },
  {
    ticker: "ZDGE",
    name: "ZEDGE INC",
    score: 62,
    insiders: 2,
    value: "$47K",
    roles: "PRES + DIR",
    dateRange: "MAY 09-10 2026",
    status: "ACTIVE",
  },
];

const MVST_FILINGS = [
  {
    name: "YANG WU",
    title: "CEO",
    date: "2026-05-01",
    shares: "45,000",
    price: "$4.00",
    value: "$180,000",
    form: "4",
  },
  {
    name: "SASCHA KELTERBORN",
    title: "DIRECTOR",
    date: "2026-05-03",
    shares: "20,500",
    price: "$4.00",
    value: "$82,000",
    form: "4",
  },
  {
    name: "CRAIG WEBSTER",
    title: "CFO",
    date: "2026-05-05",
    shares: "12,500",
    price: "$4.00",
    value: "$50,000",
    form: "4",
  },
];

const palette = {
  bg: "#0D0D0D",
  primary: "#FF9500",
  secondary: "#CC7A00",
  dim: "#664000",
  dimmer: "#3D2600",
  border: "#1A1400",
  borderBright: "#2A2000",
  green: "#00FF41",
  red: "#FF3B30",
  headerBg: "#0A0800",
};

export default function FinancialTerminalPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .terminal-root {
          font-family: 'IBM Plex Mono', 'Courier New', monospace;
          background-color: #0D0D0D;
          color: #FF9500;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
          position: relative;
        }

        .scanlines {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
          z-index: 9999;
        }

        .terminal-content {
          position: relative;
          z-index: 1;
          padding: 0;
        }

        /* Header */
        .header-bar {
          background-color: #0A0800;
          border-bottom: 2px solid #FF9500;
          padding: 6px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .terminal-title {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #FF9500;
        }

        .header-badge {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #0D0D0D;
          background-color: #FF9500;
          padding: 2px 6px;
        }

        .header-meta {
          font-size: 10px;
          color: #CC7A00;
          letter-spacing: 0.08em;
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .header-right {
          font-size: 10px;
          color: #664000;
          letter-spacing: 0.08em;
          text-align: right;
        }

        /* Status bar */
        .status-bar {
          background-color: #FF9500;
          padding: 3px 16px;
          display: flex;
          align-items: center;
          gap: 24px;
          overflow-x: auto;
        }

        .status-item {
          font-size: 10px;
          font-weight: 700;
          font-family: 'IBM Plex Mono', 'Courier New', monospace;
          color: #0D0D0D;
          white-space: nowrap;
          letter-spacing: 0.06em;
        }

        .status-sep {
          color: #3D2600;
          font-size: 12px;
        }

        /* Section */
        .section {
          padding: 0 16px 16px;
          border-bottom: 1px solid #1A1400;
        }

        .section-header {
          padding: 8px 0 6px;
          border-bottom: 1px solid #2A2000;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #FF9500;
        }

        .section-sub {
          font-size: 9px;
          color: #664000;
          letter-spacing: 0.1em;
        }

        /* Cluster quote grid */
        .cluster-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background-color: #1A1400;
          border: 1px solid #1A1400;
          margin-bottom: 2px;
        }

        .cluster-card {
          background-color: #0D0D0D;
          padding: 10px 12px;
          cursor: default;
          transition: background-color 0.1s;
        }

        .cluster-card:hover {
          background-color: #100D00;
        }

        .cluster-ticker {
          font-size: 18px;
          font-weight: 700;
          color: #FF9500;
          letter-spacing: 0.06em;
          line-height: 1;
          margin-bottom: 2px;
        }

        .cluster-name {
          font-size: 9px;
          color: #664000;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cluster-score-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 6px;
        }

        .cluster-score-val {
          font-size: 28px;
          font-weight: 700;
          color: #FF9500;
          line-height: 1;
        }

        .cluster-score-label {
          font-size: 9px;
          color: #664000;
          letter-spacing: 0.1em;
        }

        .cluster-stat-row {
          display: flex;
          gap: 0;
          flex-direction: column;
          gap: 2px;
        }

        .cluster-kv {
          font-size: 10px;
          color: #CC7A00;
          letter-spacing: 0.04em;
          display: flex;
          gap: 6px;
        }

        .kv-key {
          color: #664000;
          min-width: 60px;
          flex-shrink: 0;
        }

        .kv-val {
          color: #CC7A00;
        }

        .cluster-status {
          display: inline-block;
          margin-top: 8px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #00FF41;
          border: 1px solid #00FF41;
          padding: 1px 5px;
        }

        /* Quote bar row */
        .quote-bar {
          border: 1px solid #1A1400;
          border-top: none;
          display: flex;
          align-items: stretch;
          overflow-x: auto;
        }

        .quote-bar-label {
          background-color: #FF9500;
          color: #0D0D0D;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 3px 8px;
          display: flex;
          align-items: center;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .quote-bar-items {
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 0;
          overflow-x: auto;
          flex: 1;
        }

        .quote-bar-item {
          font-size: 10px;
          color: #CC7A00;
          padding: 4px 16px 4px 0;
          white-space: nowrap;
          border-right: 1px solid #1A1400;
          margin-right: 16px;
          letter-spacing: 0.04em;
        }

        .quote-bar-item:last-child {
          border-right: none;
        }

        .qb-ticker {
          color: #FF9500;
          font-weight: 700;
        }

        .qb-score {
          color: #00FF41;
        }

        /* Expanded cluster */
        .expanded-header {
          display: flex;
          align-items: flex-start;
          gap: 32px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .exp-ticker-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .exp-ticker {
          font-size: 32px;
          font-weight: 700;
          color: #FF9500;
          line-height: 1;
          letter-spacing: 0.04em;
        }

        .exp-name {
          font-size: 11px;
          color: #664000;
          letter-spacing: 0.08em;
        }

        .exp-score-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid #FF9500;
          padding: 6px 14px;
          gap: 2px;
        }

        .exp-score-num {
          font-size: 36px;
          font-weight: 700;
          color: #FF9500;
          line-height: 1;
        }

        .exp-score-lbl {
          font-size: 8px;
          letter-spacing: 0.15em;
          color: #664000;
        }

        .exp-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, auto);
          gap: 2px 24px;
          align-content: start;
        }

        .exp-kv {
          display: flex;
          gap: 8px;
          font-size: 11px;
        }

        .exp-kv-key {
          color: #664000;
          letter-spacing: 0.08em;
          min-width: 100px;
        }

        .exp-kv-val {
          color: #FF9500;
          font-weight: 500;
        }

        /* Filings table */
        .filings-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          font-family: 'IBM Plex Mono', 'Courier New', monospace;
        }

        .filings-table thead tr {
          border-bottom: 1px solid #FF9500;
        }

        .filings-table th {
          text-align: left;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #664000;
          padding: 4px 12px 4px 0;
          white-space: nowrap;
        }

        .filings-table th:last-child,
        .filings-table td:last-child {
          text-align: right;
          padding-right: 0;
        }

        .filings-table tbody tr {
          border-bottom: 1px solid #1A1400;
        }

        .filings-table tbody tr:hover {
          background-color: #100D00;
        }

        .filings-table td {
          padding: 6px 12px 6px 0;
          color: #CC7A00;
          white-space: nowrap;
        }

        .td-name {
          color: #FF9500 !important;
          font-weight: 500;
        }

        .td-title {
          color: #664000 !important;
          font-size: 10px;
          letter-spacing: 0.06em;
        }

        .td-value {
          color: #00FF41 !important;
          font-weight: 700;
        }

        .td-form {
          color: #3D2600 !important;
          font-size: 10px;
        }

        /* Cluster summary footer */
        .cluster-summary {
          margin-top: 12px;
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          border-top: 1px solid #1A1400;
          padding-top: 10px;
        }

        .summary-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .summary-label {
          font-size: 8px;
          letter-spacing: 0.14em;
          color: #3D2600;
        }

        .summary-value {
          font-size: 14px;
          font-weight: 700;
          color: #FF9500;
          letter-spacing: 0.04em;
        }

        /* Alert section */
        .alert-section {
          padding: 16px;
          border-top: 1px solid #1A1400;
        }

        .alert-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .alert-dot {
          color: #00FF41;
          font-size: 10px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .alert-text {
          font-size: 11px;
          color: #CC7A00;
          letter-spacing: 0.04em;
          line-height: 1.4;
        }

        .alert-ticker {
          color: #FF9500;
          font-weight: 700;
        }

        /* Subscribe form */
        .subscribe-section {
          padding: 16px;
          border-top: 2px solid #FF9500;
          background-color: #0A0800;
        }

        .prompt-line {
          font-size: 11px;
          color: #664000;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .prompt-desc {
          font-size: 10px;
          color: #3D2600;
          letter-spacing: 0.06em;
          margin-bottom: 12px;
          line-height: 1.5;
        }

        .prompt-input-row {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid #FF9500;
          max-width: 520px;
        }

        .prompt-symbol {
          background-color: #FF9500;
          color: #0D0D0D;
          font-size: 12px;
          font-weight: 700;
          font-family: 'IBM Plex Mono', 'Courier New', monospace;
          padding: 8px 10px;
          flex-shrink: 0;
          letter-spacing: 0.04em;
        }

        .prompt-input {
          flex: 1;
          background-color: transparent;
          border: none;
          outline: none;
          font-family: 'IBM Plex Mono', 'Courier New', monospace;
          font-size: 12px;
          color: #FF9500;
          padding: 8px 10px;
          letter-spacing: 0.04em;
        }

        .prompt-input::placeholder {
          color: #3D2600;
        }

        .prompt-submit {
          background-color: #FF9500;
          color: #0D0D0D;
          border: none;
          font-family: 'IBM Plex Mono', 'Courier New', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 8px 16px;
          cursor: pointer;
          flex-shrink: 0;
          transition: background-color 0.1s;
        }

        .prompt-submit:hover {
          background-color: #CC7A00;
        }

        .prompt-confirm {
          font-size: 11px;
          color: #00FF41;
          letter-spacing: 0.08em;
          margin-top: 8px;
        }

        .prompt-note {
          font-size: 9px;
          color: #3D2600;
          letter-spacing: 0.06em;
          margin-top: 6px;
        }

        /* Footer bar */
        .footer-bar {
          background-color: #0A0800;
          border-top: 1px solid #1A1400;
          padding: 5px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 4px;
        }

        .footer-item {
          font-size: 9px;
          color: #3D2600;
          letter-spacing: 0.08em;
        }

        .footer-sep {
          color: #1A1400;
        }

        /* Divider */
        .divider {
          border: none;
          border-top: 1px solid #1A1400;
          margin: 0;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #0D0D0D;
        }
        ::-webkit-scrollbar-thumb {
          background: #2A2000;
        }

        @media (max-width: 700px) {
          .cluster-grid {
            grid-template-columns: 1fr;
          }
          .expanded-header {
            flex-direction: column;
            gap: 12px;
          }
          .exp-stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="terminal-root">
        <div className="scanlines" aria-hidden="true" />

        <div className="terminal-content">

          {/* ── HEADER BAR ── */}
          <div className="header-bar">
            <div className="header-left">
              <span className="terminal-title">CLUSTERDESK TERMINAL</span>
              <span className="header-badge">BETA</span>
              <div className="header-meta">
                <span>INSIDER CLUSTER INTELLIGENCE</span>
                <span style={{ color: palette.dimmer }}>|</span>
                <span>FORM-4 SURVEILLANCE</span>
                <span style={{ color: palette.dimmer }}>|</span>
                <span>REAL-TIME</span>
              </div>
            </div>
            <div className="header-right">
              <div>2026-05-12 &nbsp; 09:31:04 EST</div>
              <div style={{ color: palette.dimmer }}>SESSION: CDT-4819-A</div>
            </div>
          </div>

          {/* ── STATUS BAR ── */}
          <div className="status-bar">
            <span className="status-item">MKTSTAT: OPEN</span>
            <span className="status-sep">|</span>
            <span className="status-item">ALERTS TODAY: 3</span>
            <span className="status-sep">|</span>
            <span className="status-item">NEW FILINGS: 7</span>
            <span className="status-sep">|</span>
            <span className="status-item">ACTIVE CLUSTERS: 3</span>
            <span className="status-sep">|</span>
            <span className="status-item">LAST SCAN: 09:30:55</span>
            <span className="status-sep">|</span>
            <span className="status-item">COVERAGE: 8,400+ MICRO-CAPS</span>
          </div>

          {/* ── QUOTE BAR ── */}
          <div className="quote-bar">
            <span className="quote-bar-label">CLUSTER QUOTES</span>
            <div className="quote-bar-items">
              {CLUSTERS.map((c) => (
                <span key={c.ticker} className="quote-bar-item">
                  <span className="qb-ticker">{c.ticker}</span>
                  &nbsp;
                  <span className="qb-score">{c.score}</span>
                  &nbsp;
                  <span style={{ color: palette.dim }}>{c.insiders}I</span>
                  &nbsp;
                  <span style={{ color: palette.secondary }}>{c.value}</span>
                </span>
              ))}
              <span className="quote-bar-item" style={{ color: palette.dimmer }}>
                <span style={{ color: palette.dim }}>SCORE</span>=CLUSTER STRENGTH 0-100
              </span>
            </div>
          </div>

          {/* ── CLUSTER OVERVIEW CARDS ── */}
          <div className="section" style={{ paddingTop: 0, paddingBottom: 0, borderBottom: "none" }}>
            <div className="section-header" style={{ marginTop: 10 }}>
              <span className="section-title">ACTIVE CLUSTER ALERTS</span>
              <span className="section-sub">SORTED BY CLUSTER SCORE DESC &nbsp;|&nbsp; UPDATED: 09:31:00</span>
            </div>

            {/* Column headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1px",
              marginBottom: "1px",
              backgroundColor: palette.border,
            }}>
              {["TICKER / SCORE", "INSIDERS / VALUE", "WINDOW / STATUS"].map((h) => (
                <div key={h} style={{
                  backgroundColor: palette.headerBg,
                  padding: "3px 12px",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: palette.dim,
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  {h}
                </div>
              ))}
            </div>

            <div className="cluster-grid">
              {CLUSTERS.map((c, i) => (
                <div key={c.ticker} className="cluster-card">
                  <div className="cluster-ticker">{c.ticker}</div>
                  <div className="cluster-name">{c.name}</div>

                  <div className="cluster-score-row">
                    <span className="cluster-score-val">{c.score}</span>
                    <span className="cluster-score-label">CLUSTER SCORE</span>
                  </div>

                  <div className="cluster-stat-row">
                    <div className="cluster-kv">
                      <span className="kv-key">INSIDERS</span>
                      <span className="kv-val">{c.insiders} &nbsp;({c.roles})</span>
                    </div>
                    <div className="cluster-kv">
                      <span className="kv-key">VALUE</span>
                      <span className="kv-val">{c.value}</span>
                    </div>
                    <div className="cluster-kv">
                      <span className="kv-key">WINDOW</span>
                      <span className="kv-val">{c.dateRange}</span>
                    </div>
                    <div className="cluster-kv">
                      <span className="kv-key">RANK</span>
                      <span className="kv-val">#{i + 1} OF 3 TODAY</span>
                    </div>
                  </div>

                  <div>
                    <span className="cluster-status">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="divider" style={{ marginBottom: 0, borderColor: palette.border }} />

          {/* ── EXPANDED CLUSTER DETAIL ── */}
          <div className="section" style={{ paddingTop: 12 }}>
            <div className="section-header">
              <span className="section-title">CLUSTER DETAIL &mdash; EXPANDED VIEW</span>
              <span className="section-sub">SEC FORM-4 FILINGS &nbsp;|&nbsp; OPEN MARKET PURCHASES ONLY</span>
            </div>

            <div className="expanded-header">
              <div className="exp-ticker-block">
                <div className="exp-ticker">MVST</div>
                <div className="exp-name">MICROVAST HOLDINGS INC</div>
                <div style={{ fontSize: "9px", color: palette.dimmer, letterSpacing: "0.08em", marginTop: 2 }}>
                  NASDAQ &nbsp;|&nbsp; BATTERY TECHNOLOGY &nbsp;|&nbsp; MICRO-CAP
                </div>
              </div>

              <div className="exp-score-block">
                <div className="exp-score-num">87</div>
                <div className="exp-score-lbl">CLUSTER SCORE</div>
              </div>

              <div className="exp-stats-grid">
                <div className="exp-kv">
                  <span className="exp-kv-key">CLUSTER WINDOW:</span>
                  <span className="exp-kv-val">MAY 01–05 2026</span>
                </div>
                <div className="exp-kv">
                  <span className="exp-kv-key">INSIDERS:</span>
                  <span className="exp-kv-val">3 (CEO + CFO + DIR)</span>
                </div>
                <div className="exp-kv">
                  <span className="exp-kv-key">TOTAL VALUE:</span>
                  <span className="exp-kv-val" style={{ color: "#00FF41" }}>$312,000</span>
                </div>
                <div className="exp-kv">
                  <span className="exp-kv-key">TOTAL SHARES:</span>
                  <span className="exp-kv-val">78,000</span>
                </div>
                <div className="exp-kv">
                  <span className="exp-kv-key">AVG PRICE:</span>
                  <span className="exp-kv-val">$4.00</span>
                </div>
                <div className="exp-kv">
                  <span className="exp-kv-key">FILING TYPE:</span>
                  <span className="exp-kv-val">SEC FORM 4</span>
                </div>
                <div className="exp-kv">
                  <span className="exp-kv-key">TRANSACTION:</span>
                  <span className="exp-kv-val">OPEN MARKET BUY</span>
                </div>
                <div className="exp-kv">
                  <span className="exp-kv-key">STATUS:</span>
                  <span className="exp-kv-val" style={{ color: "#00FF41" }}>ACTIVE ALERT</span>
                </div>
              </div>
            </div>

            {/* Filings table */}
            <table className="filings-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>INSIDER NAME</th>
                  <th>TITLE</th>
                  <th>FILING DATE</th>
                  <th>SHARES</th>
                  <th>PRICE</th>
                  <th>FORM</th>
                  <th>TOTAL VALUE</th>
                </tr>
              </thead>
              <tbody>
                {MVST_FILINGS.map((f, i) => (
                  <tr key={i}>
                    <td style={{ color: palette.dimmer, fontSize: "10px" }}>{i + 1}</td>
                    <td className="td-name">{f.name}</td>
                    <td className="td-title">{f.title}</td>
                    <td>{f.date}</td>
                    <td style={{ textAlign: "right", paddingRight: "12px" }}>{f.shares}</td>
                    <td style={{ textAlign: "right", paddingRight: "12px" }}>{f.price}</td>
                    <td className="td-form">{f.form}</td>
                    <td className="td-value">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cluster-summary">
              <div className="summary-block">
                <div className="summary-label">TOTAL CLUSTER VALUE</div>
                <div className="summary-value" style={{ color: "#00FF41" }}>$312,000</div>
              </div>
              <div className="summary-block">
                <div className="summary-label">TOTAL SHARES ACQUIRED</div>
                <div className="summary-value">78,000</div>
              </div>
              <div className="summary-block">
                <div className="summary-label">CLUSTER WINDOW</div>
                <div className="summary-value">4 DAYS</div>
              </div>
              <div className="summary-block">
                <div className="summary-label">CONVICTION LEVEL</div>
                <div className="summary-value" style={{ color: "#00FF41" }}>HIGH</div>
              </div>
              <div className="summary-block">
                <div className="summary-label">C-SUITE PARTICIPATION</div>
                <div className="summary-value">CEO + CFO</div>
              </div>
            </div>
          </div>

          {/* ── RECENT ALERTS FEED ── */}
          <div className="alert-section" style={{ borderTop: "1px solid #1A1400", borderBottom: "1px solid #1A1400", padding: "12px 16px" }}>
            <div className="section-header" style={{ marginBottom: 8 }}>
              <span className="section-title">ALERT FEED</span>
              <span className="section-sub">LAST 24H &nbsp;|&nbsp; 3 NEW</span>
            </div>

            {[
              {
                ticker: "MVST",
                time: "09:12:04",
                msg: "CLUSTER CONFIRMED — 3 insiders, $312K, 4-day window. CEO Yang Wu largest buyer at $180K. Score: 87.",
              },
              {
                ticker: "AEYE",
                time: "08:55:17",
                msg: "CLUSTER CONFIRMED — 2 insiders, $88K, 2-day window. CEO purchase leads Director follow-on. Score: 74.",
              },
              {
                ticker: "ZDGE",
                time: "07:41:33",
                msg: "CLUSTER CONFIRMED — 2 insiders, $47K, 1-day window. President + Director same-day buys. Score: 62.",
              },
            ].map((a) => (
              <div key={a.ticker} className="alert-row">
                <span className="alert-dot">&#9654;</span>
                <div className="alert-text">
                  <span style={{ color: palette.dim }}>{a.time} &nbsp;</span>
                  <span className="alert-ticker">[{a.ticker}]</span>
                  &nbsp;{a.msg}
                </div>
              </div>
            ))}
          </div>

          {/* ── SUBSCRIBE ── */}
          <div className="subscribe-section">
            <div className="section-header" style={{ marginBottom: 10 }}>
              <span className="section-title">SUBSCRIBE TO CLUSTER ALERTS</span>
              <span className="section-sub">RECEIVE ALERTS WITHIN MINUTES OF CLUSTER DETECTION</span>
            </div>

            <div className="prompt-desc">
              &gt; ENTER EMAIL ADDRESS TO RECEIVE REAL-TIME CLUSTER BUY ALERTS.<br />
              &gt; ALERTS DISPATCHED WHEN 2+ INSIDERS BUY WITHIN 7 DAYS AT THE SAME COMPANY.<br />
              &gt; FREE TIER: 3 ALERTS/MONTH &nbsp;|&nbsp; PRO: UNLIMITED + DAILY BRIEFING
            </div>

            {submitted ? (
              <div className="prompt-confirm">
                &#10003; &nbsp; SUBSCRIPTION CONFIRMED: {email} &nbsp;|&nbsp; WELCOME TO CLUSTERDESK
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="prompt-input-row">
                  <span className="prompt-symbol">&gt;_</span>
                  <input
                    className="prompt-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@domain.com"
                    required
                    autoComplete="email"
                  />
                  <button type="submit" className="prompt-submit">
                    SUBSCRIBE
                  </button>
                </div>
                <div className="prompt-note">
                  &gt; NO SPAM. UNSUBSCRIBE ANYTIME. FREE TO START.
                </div>
              </form>
            )}
          </div>

          {/* ── FOOTER BAR ── */}
          <div className="footer-bar">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span className="footer-item">CLUSTERDESK &copy; 2026</span>
              <span className="footer-sep">|</span>
              <span className="footer-item">NOT INVESTMENT ADVICE</span>
              <span className="footer-sep">|</span>
              <span className="footer-item">SEC FORM-4 DATA</span>
              <span className="footer-sep">|</span>
              <span className="footer-item">INSIDER TRADING IS LEGAL WHEN DISCLOSED</span>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span className="footer-item">TERMINAL v0.9.1</span>
              <span className="footer-sep">|</span>
              <span className="footer-item">CDT-4819-A</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
