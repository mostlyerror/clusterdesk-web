"use client";

import React, { useState } from "react";

// ─── SAMPLE DATA ────────────────────────────────────────────────────────────

interface ClusterCase {
  caseNumber: string;
  ticker: string;
  companyName: string;
  score: number;
  insiderCount: number;
  totalAmount: string;
  dateRange: string;
  suspects: { name: string; title: string; amount: string }[];
  caption: string;
  isWanted: boolean;
}

const CASES: ClusterCase[] = [
  {
    caseNumber: "001",
    ticker: "MVST",
    companyName: "Microvast Holdings",
    score: 87,
    insiderCount: 3,
    totalAmount: "$312,000",
    dateRange: "May 1–5, 2026",
    suspects: [
      { name: "Yang Wu", title: "Chief Executive Officer", amount: "$148,000" },
      { name: "Sascha Kelterborn", title: "President & COO", amount: "$102,000" },
      { name: "Leon Shi", title: "Chief Financial Officer", amount: "$62,000" },
    ],
    caption:
      "Three men in suits walked into the SEC filing office on consecutive days. We noticed.",
    isWanted: true,
  },
  {
    caseNumber: "002",
    ticker: "AEYE",
    companyName: "AudioEye Inc",
    score: 74,
    insiderCount: 2,
    totalAmount: "$88,000",
    dateRange: "May 6–8, 2026",
    suspects: [
      { name: "David Moradi", title: "Chief Executive Officer", amount: "$51,000" },
      { name: "Kelly Georgevich", title: "Chief Financial Officer", amount: "$37,000" },
    ],
    caption:
      "Two signatories. Two filings. One story nobody else was reading.",
    isWanted: false,
  },
  {
    caseNumber: "003",
    ticker: "ZDGE",
    companyName: "Zedge Inc",
    score: 62,
    insiderCount: 2,
    totalAmount: "$47,000",
    dateRange: "May 9–10, 2026",
    suspects: [
      { name: "Jonathan Reich", title: "Chief Executive Officer", amount: "$29,000" },
      { name: "Yi Tsai", title: "Chief Operating Officer", amount: "$18,000" },
    ],
    caption:
      "They moved quietly. The paperwork was all that gave them away.",
    isWanted: false,
  },
];

// ─── STYLES ─────────────────────────────────────────────────────────────────

const C = {
  bg: "#0D0D0D",
  text: "#F5F5F5",
  amber: "#D4A017",
  dim: "#666666",
  border: "#222222",
  cardBg: "#111111",
};

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function NoirFilmPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          background: ${C.bg};
          color: ${C.text};
          font-family: 'Courier Prime', 'Courier New', monospace;
        }

        /* Rain texture overlay */
        .rain-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: repeating-linear-gradient(
            105deg,
            transparent 0px,
            transparent 3px,
            rgba(255,255,255,0.012) 3px,
            rgba(255,255,255,0.012) 4px
          );
        }

        /* Venetian blind hero stripes */
        .venetian {
          background-image: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 18px,
            rgba(255,255,255,0.03) 18px,
            rgba(255,255,255,0.03) 20px
          );
        }

        .page-wrapper {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        /* ── Header ── */
        .site-header {
          text-align: center;
          padding: 64px 0 48px;
          border-bottom: 1px solid ${C.border};
          position: relative;
        }

        .agency-badge {
          display: inline-block;
          border: 1px solid ${C.amber};
          padding: 4px 16px;
          font-family: 'Courier Prime', monospace;
          font-size: 11px;
          letter-spacing: 4px;
          color: ${C.amber};
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .agency-name {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(28px, 6vw, 52px);
          font-weight: 700;
          color: ${C.text};
          letter-spacing: 2px;
          line-height: 1.1;
          text-shadow: 0 0 40px rgba(212,160,23,0.15);
        }

        .agency-tagline {
          font-family: 'Courier Prime', monospace;
          font-size: 13px;
          letter-spacing: 3px;
          color: ${C.dim};
          text-transform: uppercase;
          margin-top: 12px;
        }

        .header-rule {
          width: 60px;
          height: 1px;
          background: ${C.amber};
          margin: 24px auto 0;
        }

        /* ── Intro ── */
        .intro-section {
          padding: 56px 0 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          border-bottom: 1px solid ${C.border};
        }

        @media (max-width: 620px) {
          .intro-section { grid-template-columns: 1fr; gap: 32px; }
        }

        .intro-label {
          font-size: 10px;
          letter-spacing: 3px;
          color: ${C.amber};
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .intro-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 4vw, 32px);
          font-weight: 700;
          line-height: 1.3;
          color: ${C.text};
        }

        .intro-body {
          font-size: 14px;
          line-height: 1.9;
          color: #BBBBBB;
        }

        .intro-body em {
          color: ${C.amber};
          font-style: normal;
        }

        .stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: ${C.border};
          border: 1px solid ${C.border};
          align-self: start;
          margin-top: 4px;
        }

        .stat-cell {
          background: ${C.cardBg};
          padding: 20px;
        }

        .stat-number {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: ${C.amber};
          line-height: 1;
        }

        .stat-label {
          font-size: 10px;
          letter-spacing: 2px;
          color: ${C.dim};
          text-transform: uppercase;
          margin-top: 6px;
        }

        /* ── Section heading ── */
        .section-heading {
          padding: 56px 0 32px;
        }

        .section-eyebrow {
          font-size: 10px;
          letter-spacing: 4px;
          color: ${C.amber};
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 4vw, 28px);
          font-weight: 700;
          font-style: italic;
        }

        /* ── WANTED poster ── */
        .wanted-poster {
          border: 3px solid ${C.amber};
          background: ${C.cardBg};
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.8), 0 0 60px rgba(212,160,23,0.08);
          position: relative;
        }

        .wanted-poster::before {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px solid rgba(212,160,23,0.25);
          pointer-events: none;
        }

        .wanted-banner {
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          letter-spacing: 8px;
          color: ${C.amber};
          text-transform: uppercase;
          border-bottom: 1px solid ${C.amber};
          padding-bottom: 16px;
          margin-bottom: 24px;
        }

        .wanted-company {
          text-align: center;
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 5vw, 42px);
          font-weight: 700;
          color: ${C.text};
          line-height: 1;
          margin-bottom: 4px;
        }

        .wanted-ticker {
          text-align: center;
          font-size: 13px;
          letter-spacing: 6px;
          color: ${C.dim};
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        /* ── Case file card ── */
        .case-card {
          border: 1px solid ${C.border};
          background: ${C.cardBg};
          padding: 28px 32px;
          margin-bottom: 24px;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.8);
          position: relative;
        }

        .case-card-header {
          display: flex;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid ${C.border};
          flex-wrap: wrap;
        }

        .case-number {
          font-size: 10px;
          letter-spacing: 3px;
          color: ${C.amber};
          text-transform: uppercase;
        }

        .case-status {
          font-size: 10px;
          letter-spacing: 2px;
          color: ${C.dim};
          border: 1px solid ${C.border};
          padding: 2px 8px;
        }

        .case-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 32px;
          margin-bottom: 20px;
        }

        @media (max-width: 520px) {
          .case-fields { grid-template-columns: 1fr; }
        }

        .case-field-label {
          font-size: 10px;
          letter-spacing: 2px;
          color: ${C.dim};
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .case-field-value {
          font-size: 15px;
          color: ${C.text};
          font-weight: 700;
        }

        .case-field-value.amber {
          color: ${C.amber};
        }

        .case-field-value.large {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
        }

        /* ── Suspects list ── */
        .suspects-section {
          border-top: 1px solid ${C.border};
          padding-top: 16px;
          margin-top: 4px;
        }

        .suspects-label {
          font-size: 10px;
          letter-spacing: 2px;
          color: ${C.dim};
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .suspect-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          gap: 16px;
          flex-wrap: wrap;
        }

        .suspect-row:last-child {
          border-bottom: none;
        }

        .suspect-name {
          font-size: 13px;
          color: ${C.text};
          font-weight: 700;
          flex: 1;
          min-width: 140px;
        }

        .suspect-title {
          font-size: 12px;
          color: ${C.dim};
          flex: 2;
          min-width: 180px;
        }

        .suspect-amount {
          font-size: 13px;
          color: ${C.amber};
          font-weight: 700;
          white-space: nowrap;
        }

        /* ── Noir caption ── */
        .noir-caption {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 14px;
          color: ${C.dim};
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid ${C.border};
          line-height: 1.7;
        }

        .noir-caption::before {
          content: '"';
          color: ${C.amber};
          font-size: 20px;
          line-height: 0;
          vertical-align: -4px;
          margin-right: 4px;
        }

        .noir-caption::after {
          content: '"';
          color: ${C.amber};
          font-size: 20px;
          line-height: 0;
          vertical-align: -4px;
          margin-left: 4px;
        }

        /* ── How it works ── */
        .method-section {
          border-top: 1px solid ${C.border};
          padding: 56px 0;
        }

        .method-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: ${C.border};
          border: 1px solid ${C.border};
          margin-top: 32px;
        }

        @media (max-width: 620px) {
          .method-grid { grid-template-columns: 1fr; }
        }

        .method-cell {
          background: ${C.cardBg};
          padding: 28px 24px;
        }

        .method-step {
          font-size: 11px;
          letter-spacing: 3px;
          color: ${C.amber};
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .method-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .method-body {
          font-size: 13px;
          color: ${C.dim};
          line-height: 1.8;
        }

        /* ── Hire section ── */
        .hire-section {
          border-top: 1px solid ${C.border};
          padding: 64px 0 0;
          text-align: center;
        }

        .hire-eyebrow {
          font-size: 10px;
          letter-spacing: 5px;
          color: ${C.amber};
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .hire-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(26px, 5vw, 44px);
          font-weight: 700;
          font-style: italic;
          color: ${C.text};
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .hire-subhead {
          font-size: 14px;
          color: ${C.dim};
          margin-bottom: 40px;
          line-height: 1.8;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }

        .hire-form {
          display: flex;
          gap: 0;
          max-width: 440px;
          margin: 0 auto;
          box-shadow: 8px 8px 0 rgba(0,0,0,0.8);
        }

        .hire-input {
          flex: 1;
          background: ${C.cardBg};
          border: 1px solid ${C.border};
          border-right: none;
          color: ${C.text};
          font-family: 'Courier Prime', monospace;
          font-size: 14px;
          padding: 14px 18px;
          outline: none;
          transition: border-color 0.2s;
        }

        .hire-input::placeholder {
          color: ${C.dim};
        }

        .hire-input:focus {
          border-color: ${C.amber};
        }

        .hire-button {
          background: ${C.amber};
          color: #0D0D0D;
          border: none;
          font-family: 'Courier Prime', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 14px 22px;
          cursor: pointer;
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        .hire-button:hover {
          opacity: 0.88;
        }

        .hire-confirmation {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 18px;
          color: ${C.amber};
          margin-top: 8px;
        }

        .hire-fine-print {
          font-size: 11px;
          color: ${C.dim};
          margin-top: 16px;
          letter-spacing: 1px;
        }

        /* ── Footer ── */
        .site-footer {
          border-top: 1px solid ${C.border};
          margin-top: 64px;
          padding: 32px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-name {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 15px;
          color: ${C.text};
        }

        .footer-copy {
          font-size: 11px;
          color: ${C.dim};
          letter-spacing: 1px;
        }

        /* ── Threat meter ── */
        .threat-bar-track {
          height: 3px;
          background: ${C.border};
          margin-top: 8px;
          width: 100%;
          max-width: 140px;
        }

        .threat-bar-fill {
          height: 3px;
          background: ${C.amber};
          transition: width 0.6s ease;
        }

        /* ── Divider ── */
        .ornament-divider {
          text-align: center;
          font-size: 11px;
          letter-spacing: 6px;
          color: ${C.border};
          padding: 8px 0;
          user-select: none;
        }
      `}</style>

      {/* Rain overlay */}
      <div className="rain-overlay" />

      {/* ── Hero ── */}
      <div
        className="venetian"
        style={{
          background: `linear-gradient(180deg, rgba(212,160,23,0.04) 0%, transparent 60%)`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div className="page-wrapper" style={{ paddingBottom: 0 }}>
          <header className="site-header">
            <div className="agency-badge">Est. 2024 &mdash; Licensed &amp; Bonded</div>
            <h1 className="agency-name">ClusterDesk<br />Detective Agency</h1>
            <p className="agency-tagline">We follow the money.</p>
            <div className="header-rule" />
          </header>
        </div>
      </div>

      <div className="page-wrapper">

        {/* ── Intro ── */}
        <section className="intro-section">
          <div>
            <p className="intro-label">The Brief</p>
            <h2 className="intro-headline">
              When insiders buy their own stock in clusters,<br />somebody knows something.
            </h2>
            <p style={{ marginTop: 24 }} className="intro-body">
              They file quietly. 4 a.m. on a Tuesday. SEC Form 4.
              Most people never look. We do — every day, every micro-cap,
              every <em>cluster</em> of executives moving money in the same direction
              within days of each other.
            </p>
            <p style={{ marginTop: 16 }} className="intro-body">
              Call it due diligence. Call it surveillance.
              We call it the only edge left that's still <em>legal</em>.
            </p>
          </div>

          <div className="stat-grid">
            <div className="stat-cell">
              <div className="stat-number">2+</div>
              <div className="stat-label">Insiders Required</div>
            </div>
            <div className="stat-cell">
              <div className="stat-number">7d</div>
              <div className="stat-label">Cluster Window</div>
            </div>
            <div className="stat-cell">
              <div className="stat-number">$10M</div>
              <div className="stat-label">Max Market Cap</div>
            </div>
            <div className="stat-cell">
              <div className="stat-number">Daily</div>
              <div className="stat-label">New Case Files</div>
            </div>
          </div>
        </section>

        {/* ── Active Cases ── */}
        <div className="section-heading">
          <p className="section-eyebrow">Active Investigations</p>
          <h2 className="section-title">Open Case Files — May 2026</h2>
        </div>

        <div className="ornament-divider">— — — — — — — — — —</div>

        {CASES.map((c) =>
          c.isWanted ? (
            /* WANTED poster for highest-scoring case */
            <div key={c.caseNumber} style={{ marginTop: 32, marginBottom: 16 }}>
              <div className="wanted-poster">
                <div className="wanted-banner">
                  ★ &nbsp; Wanted &nbsp; ★ &nbsp; Priority Alert &nbsp; ★ &nbsp; Wanted &nbsp; ★
                </div>
                <div className="wanted-company">{c.companyName}</div>
                <div className="wanted-ticker">{c.ticker} &nbsp;·&nbsp; NYSE</div>

                {/* Case metadata */}
                <div className="case-fields">
                  <div>
                    <div className="case-field-label">Case No.</div>
                    <div className="case-field-value">CASE #{c.caseNumber} — OPEN</div>
                  </div>
                  <div>
                    <div className="case-field-label">Threat Assessment</div>
                    <div className="case-field-value large amber">{c.score} / 100</div>
                    <div className="threat-bar-track">
                      <div className="threat-bar-fill" style={{ width: `${c.score}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="case-field-label">Evidence</div>
                    <div className="case-field-value amber">{c.totalAmount}</div>
                  </div>
                  <div>
                    <div className="case-field-label">Activity Window</div>
                    <div className="case-field-value">{c.dateRange}</div>
                  </div>
                </div>

                <div className="suspects-section">
                  <div className="suspects-label">Suspects ({c.insiderCount} identified)</div>
                  {c.suspects.map((s) => (
                    <div className="suspect-row" key={s.name}>
                      <span className="suspect-name">{s.name}</span>
                      <span className="suspect-title">{s.title}</span>
                      <span className="suspect-amount">{s.amount}</span>
                    </div>
                  ))}
                </div>

                <div className="noir-caption">{c.caption}</div>
              </div>
            </div>
          ) : (
            /* Standard case card */
            <div key={c.caseNumber} className="case-card" style={{ marginTop: 16 }}>
              <div className="case-card-header">
                <span className="case-number">Case #{c.caseNumber}</span>
                <span className="case-status">— OPEN</span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: 11,
                    letterSpacing: 2,
                    color: C.dim,
                    textTransform: "uppercase",
                  }}
                >
                  {c.dateRange}
                </span>
              </div>

              <div className="case-fields">
                <div>
                  <div className="case-field-label">Subject</div>
                  <div className="case-field-value">{c.companyName}</div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: 2,
                      color: C.dim,
                      marginTop: 3,
                      textTransform: "uppercase",
                    }}
                  >
                    {c.ticker}
                  </div>
                </div>
                <div>
                  <div className="case-field-label">Threat Assessment</div>
                  <div className="case-field-value large amber">{c.score} / 100</div>
                  <div className="threat-bar-track">
                    <div className="threat-bar-fill" style={{ width: `${c.score}%` }} />
                  </div>
                </div>
                <div>
                  <div className="case-field-label">Evidence</div>
                  <div className="case-field-value amber">{c.totalAmount}</div>
                </div>
                <div>
                  <div className="case-field-label">Suspects</div>
                  <div className="case-field-value">{c.insiderCount} Executives</div>
                </div>
              </div>

              <div className="suspects-section">
                <div className="suspects-label">Suspects Identified</div>
                {c.suspects.map((s) => (
                  <div className="suspect-row" key={s.name}>
                    <span className="suspect-name">{s.name}</span>
                    <span className="suspect-title">{s.title}</span>
                    <span className="suspect-amount">{s.amount}</span>
                  </div>
                ))}
              </div>

              <div className="noir-caption">{c.caption}</div>
            </div>
          )
        )}

        <div className="ornament-divider" style={{ marginTop: 32 }}>— — — — — — — — — —</div>

        {/* ── Method ── */}
        <section className="method-section">
          <p className="section-eyebrow">The Method</p>
          <h2 className="section-title">How the Agency Works</h2>

          <div className="method-grid">
            <div className="method-cell">
              <div className="method-step">Step I &mdash; Surveillance</div>
              <div className="method-title">We Watch the Filings</div>
              <div className="method-body">
                Every SEC Form 4 filed at micro-cap companies. Every name.
                Every dollar. Catalogued before the market opens.
              </div>
            </div>
            <div className="method-cell">
              <div className="method-step">Step II &mdash; Pattern</div>
              <div className="method-title">We Find the Clusters</div>
              <div className="method-body">
                When two or more executives buy within seven days,
                we flag it. Coincidence is one executive.
                A cluster is a signal.
              </div>
            </div>
            <div className="method-cell">
              <div className="method-step">Step III &mdash; Report</div>
              <div className="method-title">You Get the Brief</div>
              <div className="method-body">
                Every morning, a clean case file. Ticker. Names.
                Amounts. Score. You decide what to do with the intelligence.
              </div>
            </div>
          </div>
        </section>

        {/* ── Hire the Detective ── */}
        <section className="hire-section">
          <p className="hire-eyebrow">Hire the Detective</p>
          <h2 className="hire-headline">Leave your email.<br />We'll be in touch.</h2>
          <p className="hire-subhead">
            Daily case files. No noise. Only clusters worth watching.
            The kind of intelligence that used to cost real money.
          </p>

          {submitted ? (
            <div>
              <p className="hire-confirmation">You're on the list.</p>
              <p className="hire-fine-print">
                Watch your inbox. We work nights.
              </p>
            </div>
          ) : (
            <form className="hire-form" onSubmit={handleSubmit}>
              <input
                className="hire-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <button className="hire-button" type="submit">
                Retain
              </button>
            </form>
          )}

          <p className="hire-fine-print" style={{ marginTop: submitted ? 0 : 16 }}>
            No spam. Unsubscribe anytime. We keep your details in the vault.
          </p>
        </section>

        {/* ── Footer ── */}
        <footer className="site-footer">
          <span className="footer-name">ClusterDesk Detective Agency</span>
          <span className="footer-copy">
            &copy; 2024 &nbsp;·&nbsp; Not investment advice &nbsp;·&nbsp; EST. 2024
          </span>
        </footer>

      </div>
    </>
  );
}
