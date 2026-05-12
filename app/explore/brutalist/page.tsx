"use client";

import React, { useState } from "react";

const clusters = [
  {
    ticker: "MVST",
    company: "MICROVAST HOLDINGS",
    score: 87,
    insiders: 3,
    amount: "$312K",
    roles: "CEO + CFO + DIRECTOR",
    daysAgo: 4,
    priceChange: "+14.2%",
  },
  {
    ticker: "AEYE",
    company: "AUDIOEYE INC",
    score: 74,
    insiders: 2,
    amount: "$88K",
    roles: "CEO + DIRECTOR",
    daysAgo: 7,
    priceChange: "+8.6%",
  },
  {
    ticker: "ZDGE",
    company: "ZEDGE INC",
    score: 62,
    insiders: 2,
    amount: "$47K",
    roles: "PRESIDENT + DIRECTOR",
    daysAgo: 12,
    priceChange: "+5.1%",
  },
];

export default function BrutalistPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          background: #ffffff;
          font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
          color: #000000;
          overflow-x: hidden;
        }

        .brut-page {
          background: #ffffff;
          min-height: 100vh;
          font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
        }

        .brut-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 32px;
          border-bottom: 4px solid #000000;
          background: #ffffff;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .brut-nav-logo {
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #000000;
          text-decoration: none;
        }

        .brut-nav-btn {
          background: #000000;
          color: #ffffff;
          border: 3px solid #000000;
          font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
          font-size: 18px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 10px 28px;
          cursor: pointer;
          transition: background 0.1s, color 0.1s;
        }

        .brut-nav-btn:hover {
          background: #FFFF00;
          color: #000000;
          border-color: #000000;
        }

        .brut-hr {
          border: none;
          border-top: 4px solid #000000;
          margin: 0;
        }

        .brut-hr-thin {
          border: none;
          border-top: 3px solid #000000;
          margin: 0;
        }

        .brut-section {
          padding: 48px 32px;
        }

        .brut-hero {
          padding: 64px 32px 48px 32px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0;
          align-items: start;
        }

        .brut-hero-text {
          display: flex;
          flex-direction: column;
        }

        .brut-hero-line {
          font-size: clamp(72px, 12vw, 140px);
          font-weight: 900;
          line-height: 0.88;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #000000;
          display: block;
        }

        .brut-hero-line-yellow {
          font-size: clamp(72px, 12vw, 140px);
          font-weight: 900;
          line-height: 0.88;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: #000000;
          display: block;
          background: #FFFF00;
          padding: 0 8px;
          margin-left: -8px;
          display: inline-block;
        }

        .brut-score-block {
          border: 3px solid #000000;
          padding: 24px 32px;
          text-align: center;
          min-width: 220px;
          background: #ffffff;
        }

        .brut-score-label {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #000000;
          margin-bottom: 4px;
          display: block;
        }

        .brut-score-number {
          font-size: 200px;
          font-weight: 900;
          line-height: 1;
          color: #000000;
          letter-spacing: -0.04em;
          display: block;
        }

        .brut-score-sub {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #000000;
          display: block;
          margin-top: 4px;
          border-top: 3px solid #000000;
          padding-top: 8px;
        }

        .brut-manifesto {
          background: #FFFF00;
          border: 3px solid #000000;
          padding: 32px;
          margin: 0 32px;
        }

        .brut-manifesto-text {
          font-size: clamp(18px, 2.4vw, 26px);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          line-height: 1.4;
          color: #000000;
        }

        .brut-section-label {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #000000;
          margin-bottom: 32px;
          display: block;
        }

        .brut-cards {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .brut-card {
          border: 3px solid #000000;
          border-top: none;
          padding: 32px;
          background: #ffffff;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 32px;
          align-items: start;
        }

        .brut-card:first-child {
          border-top: 3px solid #000000;
        }

        .brut-card-left {
          min-width: 140px;
        }

        .brut-card-ticker {
          font-size: 64px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1;
          color: #000000;
          display: block;
        }

        .brut-card-company {
          font-size: 14px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #000000;
          display: block;
          margin-top: 4px;
          max-width: 240px;
        }

        .brut-card-center {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 32px;
          border-left: 3px solid #000000;
          padding-left: 32px;
        }

        .brut-stat {
          display: flex;
          flex-direction: column;
        }

        .brut-stat-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #000000;
          margin-bottom: 2px;
        }

        .brut-stat-value {
          font-size: 28px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0;
          color: #000000;
          line-height: 1;
        }

        .brut-stat-value-yellow {
          font-size: 28px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0;
          color: #000000;
          line-height: 1;
          background: #FFFF00;
          padding: 0 4px;
          display: inline-block;
        }

        .brut-card-right {
          text-align: right;
          border-left: 3px solid #000000;
          padding-left: 32px;
        }

        .brut-card-score-num {
          font-size: 80px;
          font-weight: 900;
          line-height: 1;
          color: #000000;
          letter-spacing: -0.04em;
          display: block;
        }

        .brut-card-score-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #000000;
          display: block;
          border-top: 3px solid #000000;
          padding-top: 6px;
          margin-top: 4px;
        }

        .brut-roles {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #000000;
          display: block;
          margin-top: 4px;
          grid-column: 1 / -1;
          border-top: 3px solid #000000;
          padding-top: 12px;
        }

        .brut-how {
          padding: 48px 32px;
        }

        .brut-how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
        }

        .brut-how-item {
          border: 3px solid #000000;
          border-right: none;
          padding: 32px;
        }

        .brut-how-item:last-child {
          border-right: 3px solid #000000;
        }

        .brut-how-num {
          font-size: 72px;
          font-weight: 900;
          line-height: 1;
          color: #000000;
          letter-spacing: -0.04em;
          display: block;
          border-bottom: 3px solid #000000;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .brut-how-title {
          font-size: 22px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #000000;
          display: block;
          margin-bottom: 8px;
        }

        .brut-how-body {
          font-size: 15px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #000000;
          line-height: 1.5;
        }

        .brut-email {
          padding: 48px 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          align-items: stretch;
        }

        .brut-email-left {
          border: 3px solid #000000;
          border-right: none;
          padding: 40px;
          background: #000000;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .brut-email-headline {
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 0.9;
          color: #FFFF00;
          display: block;
          margin-bottom: 16px;
        }

        .brut-email-sub {
          font-size: 16px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #ffffff;
          display: block;
        }

        .brut-email-right {
          border: 3px solid #000000;
          padding: 40px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
        }

        .brut-input {
          background: #ffffff;
          border: 3px solid #000000;
          font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #000000;
          padding: 14px 18px;
          outline: none;
          width: 100%;
        }

        .brut-input::placeholder {
          color: #999999;
          font-style: normal;
        }

        .brut-input:focus {
          border-color: #000000;
          background: #FFFF00;
        }

        .brut-submit-btn {
          background: #000000;
          color: #ffffff;
          border: 3px solid #000000;
          font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif;
          font-size: 22px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          padding: 16px 32px;
          cursor: pointer;
          transition: background 0.1s, color 0.1s;
          width: 100%;
        }

        .brut-submit-btn:hover {
          background: #FFFF00;
          color: #000000;
        }

        .brut-success {
          font-size: 24px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #000000;
          background: #FFFF00;
          border: 3px solid #000000;
          padding: 20px 24px;
          display: block;
        }

        .brut-stats-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border-bottom: 4px solid #000000;
        }

        .brut-stat-bar-item {
          padding: 24px 32px;
          border-right: 3px solid #000000;
        }

        .brut-stat-bar-item:last-child {
          border-right: none;
        }

        .brut-stat-bar-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          display: block;
          color: #000000;
          margin-bottom: 4px;
        }

        .brut-stat-bar-value {
          font-size: 40px;
          font-weight: 900;
          line-height: 1;
          color: #000000;
          letter-spacing: -0.02em;
          display: block;
        }

        .brut-footer {
          border-top: 4px solid #000000;
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brut-footer-logo {
          font-size: 24px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #000000;
        }

        .brut-footer-legal {
          font-size: 12px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #000000;
          max-width: 480px;
          text-align: right;
        }

        .brut-ticker-tape {
          background: #000000;
          color: #FFFF00;
          padding: 10px 0;
          overflow: hidden;
          white-space: nowrap;
          border-bottom: 4px solid #000000;
        }

        .brut-ticker-inner {
          display: inline-block;
          animation: ticker 18s linear infinite;
        }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .brut-ticker-text {
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          padding: 0 32px;
        }

        @media (max-width: 900px) {
          .brut-hero {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .brut-score-block {
            width: 100%;
          }
          .brut-card {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .brut-card-center {
            border-left: none;
            border-top: 3px solid #000000;
            padding-left: 0;
            padding-top: 16px;
          }
          .brut-card-right {
            border-left: none;
            border-top: 3px solid #000000;
            padding-left: 0;
            padding-top: 16px;
            text-align: left;
          }
          .brut-how-grid {
            grid-template-columns: 1fr;
          }
          .brut-how-item {
            border-right: 3px solid #000000;
            border-bottom: none;
          }
          .brut-how-item:last-child {
            border-bottom: 3px solid #000000;
          }
          .brut-email {
            grid-template-columns: 1fr;
          }
          .brut-email-left {
            border-right: 3px solid #000000;
            border-bottom: none;
          }
          .brut-stats-bar {
            grid-template-columns: repeat(2, 1fr);
          }
          .brut-stats-bar > *:nth-child(2) {
            border-right: none;
          }
          .brut-stats-bar > *:nth-child(3) {
            border-top: 3px solid #000000;
          }
          .brut-stats-bar > *:nth-child(4) {
            border-top: 3px solid #000000;
            border-right: none;
          }
          .brut-footer {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          .brut-footer-legal {
            text-align: left;
          }
        }
      `}</style>

      <div className="brut-page">
        {/* NAV */}
        <nav className="brut-nav">
          <span className="brut-nav-logo">CLUSTERDESK</span>
          <button className="brut-nav-btn">SUBSCRIBE</button>
        </nav>

        {/* TICKER TAPE */}
        <div className="brut-ticker-tape">
          <div className="brut-ticker-inner">
            {[
              "MVST — 3 INSIDERS — $312K",
              "AEYE — 2 INSIDERS — $88K",
              "ZDGE — 2 INSIDERS — $47K",
              "CLUSTER ALERT ACTIVE",
              "INSIDER CONVICTION SCORE: 87",
              "MVST — 3 INSIDERS — $312K",
              "AEYE — 2 INSIDERS — $88K",
              "ZDGE — 2 INSIDERS — $47K",
              "CLUSTER ALERT ACTIVE",
              "INSIDER CONVICTION SCORE: 87",
            ].map((item, i) => (
              <span key={i} className="brut-ticker-text">
                {item} ///
              </span>
            ))}
          </div>
        </div>

        {/* HERO */}
        <div className="brut-hero">
          <div className="brut-hero-text">
            <span className="brut-hero-line">INSIDERS</span>
            <span className="brut-hero-line">ARE</span>
            <span className="brut-hero-line-yellow">BUYING.</span>
            <div
              style={{
                marginTop: "32px",
                borderTop: "3px solid #000000",
                paddingTop: "20px",
              }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#000000",
                }}
              >
                LIVE CLUSTER ALERTS — UPDATED DAILY
              </span>
            </div>
          </div>
          <div className="brut-score-block">
            <span className="brut-score-label">TODAY&apos;S TOP SCORE</span>
            <span className="brut-score-number">87</span>
            <span className="brut-score-sub">CONVICTION SCORE</span>
          </div>
        </div>

        <hr className="brut-hr" />

        {/* STATS BAR */}
        <div className="brut-stats-bar">
          <div className="brut-stat-bar-item">
            <span className="brut-stat-bar-label">ACTIVE CLUSTERS</span>
            <span className="brut-stat-bar-value">3</span>
          </div>
          <div className="brut-stat-bar-item">
            <span className="brut-stat-bar-label">TOTAL INSIDER BUY $</span>
            <span className="brut-stat-bar-value">$447K</span>
          </div>
          <div className="brut-stat-bar-item">
            <span className="brut-stat-bar-label">TOTAL INSIDERS</span>
            <span className="brut-stat-bar-value">7</span>
          </div>
          <div className="brut-stat-bar-item">
            <span className="brut-stat-bar-label">AVG DAYS ACTIVE</span>
            <span className="brut-stat-bar-value">7.7</span>
          </div>
        </div>

        {/* MANIFESTO */}
        <div style={{ padding: "48px 32px 0 32px" }}>
          <div className="brut-manifesto">
            <p className="brut-manifesto-text">
              WHEN EXECUTIVES BUY THEIR OWN STOCK, THEY&apos;RE BETTING WITH
              THEIR OWN MONEY. WE TRACK WHEN THEY CLUSTER.
            </p>
          </div>
        </div>

        <hr className="brut-hr" style={{ marginTop: "48px" }} />

        {/* CLUSTER CARDS */}
        <section className="brut-section">
          <span className="brut-section-label">
            /// ACTIVE CLUSTER ALERTS — 3 SIGNALS
          </span>
          <div className="brut-cards">
            {clusters.map((c, i) => (
              <div key={c.ticker} className="brut-card">
                {/* LEFT: TICKER */}
                <div className="brut-card-left">
                  <span className="brut-card-ticker">{c.ticker}</span>
                  <span className="brut-card-company">{c.company}</span>
                  <div
                    style={{
                      marginTop: "16px",
                      borderTop: "3px solid #000",
                      paddingTop: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.18em",
                        color: "#000",
                        display: "block",
                        marginBottom: "2px",
                      }}
                    >
                      RANK
                    </span>
                    <span
                      style={{
                        fontSize: "36px",
                        fontWeight: 900,
                        color: "#000",
                        lineHeight: 1,
                      }}
                    >
                      #{i + 1}
                    </span>
                  </div>
                </div>

                {/* CENTER: STATS */}
                <div className="brut-card-center">
                  <div className="brut-stat">
                    <span className="brut-stat-label">INSIDERS</span>
                    <span
                      className={
                        i === 0 ? "brut-stat-value-yellow" : "brut-stat-value"
                      }
                    >
                      {c.insiders}
                    </span>
                  </div>
                  <div className="brut-stat">
                    <span className="brut-stat-label">TOTAL BOUGHT</span>
                    <span className="brut-stat-value">{c.amount}</span>
                  </div>
                  <div className="brut-stat">
                    <span className="brut-stat-label">DAYS AGO</span>
                    <span className="brut-stat-value">{c.daysAgo}D</span>
                  </div>
                  <div className="brut-stat">
                    <span className="brut-stat-label">SINCE CLUSTER</span>
                    <span
                      className={
                        i === 1 ? "brut-stat-value-yellow" : "brut-stat-value"
                      }
                    >
                      {c.priceChange}
                    </span>
                  </div>
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      borderTop: "3px solid #000",
                      paddingTop: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        color: "#000",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      WHO BOUGHT
                    </span>
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#000",
                        display: "block",
                      }}
                    >
                      {c.roles}
                    </span>
                  </div>
                </div>

                {/* RIGHT: SCORE */}
                <div className="brut-card-right">
                  <span className="brut-card-score-num">{c.score}</span>
                  <span className="brut-card-score-label">CONVICTION</span>
                  <div
                    style={{
                      marginTop: "16px",
                      borderTop: "3px solid #000",
                      paddingTop: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.18em",
                        color: "#000",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      ACTION
                    </span>
                    <button
                      style={{
                        background: i === 0 ? "#FFFF00" : "#000000",
                        color: i === 0 ? "#000000" : "#ffffff",
                        border: "3px solid #000000",
                        fontFamily:
                          "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
                        fontSize: "15px",
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        padding: "10px 20px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      VIEW DETAIL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="brut-hr" />

        {/* HOW IT WORKS */}
        <section className="brut-how">
          <span className="brut-section-label">/// HOW IT WORKS</span>
          <div className="brut-how-grid">
            <div className="brut-how-item">
              <span className="brut-how-num">01</span>
              <span className="brut-how-title">WE SCAN SEC FILINGS</span>
              <p className="brut-how-body">
                EVERY FORM 4 FILED WITH THE SEC IS PARSED IN REAL TIME. NO
                MANUAL WORK. NO DELAYS.
              </p>
            </div>
            <div className="brut-how-item">
              <span className="brut-how-num">02</span>
              <span className="brut-how-title">WE DETECT CLUSTERS</span>
              <p className="brut-how-body">
                WHEN 2 OR MORE EXECUTIVES BUY WITHIN 10 DAYS OF EACH OTHER, A
                CLUSTER IS FLAGGED.
              </p>
            </div>
            <div className="brut-how-item">
              <span className="brut-how-num">03</span>
              <span className="brut-how-title">YOU GET THE SIGNAL</span>
              <p className="brut-how-body">
                DAILY BRIEFING. RAW DATA. NO NOISE. THE CONVICTION SCORE RANKS
                EVERY CLUSTER BY STRENGTH.
              </p>
            </div>
          </div>
        </section>

        <hr className="brut-hr" />

        {/* EMAIL CAPTURE */}
        <section className="brut-email">
          <div className="brut-email-left">
            <span className="brut-email-headline">
              GET THE
              <br />
              DAILY
              <br />
              SIGNAL.
            </span>
            <span className="brut-email-sub">
              FREE. NO SPAM. UNSUBSCRIBE ANYTIME.
            </span>
          </div>
          <div className="brut-email-right">
            {submitted ? (
              <span className="brut-success">
                YOU&apos;RE IN. SIGNAL STARTS TOMORROW.
              </span>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "contents" }}>
                <input
                  className="brut-input"
                  type="email"
                  placeholder="YOUR EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="brut-submit-btn">
                  SEND ME THE ALERTS
                </button>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#000",
                  }}
                >
                  NO CREDIT CARD. NO NOISE. JUST INSIDER CLUSTERS.
                </span>
              </form>
            )}
          </div>
        </section>

        <hr className="brut-hr" />

        {/* FOOTER */}
        <footer className="brut-footer">
          <span className="brut-footer-logo">CLUSTERDESK</span>
          <p className="brut-footer-legal">
            NOT INVESTMENT ADVICE. CLUSTERDESK AGGREGATES PUBLIC SEC FORM 4
            FILINGS. ALWAYS DO YOUR OWN RESEARCH. PAST CLUSTER SIGNALS DO NOT
            GUARANTEE FUTURE PERFORMANCE.
          </p>
        </footer>
      </div>
    </>
  );
}
