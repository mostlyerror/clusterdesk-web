"use client";

import React, { useState } from "react";

const clusters = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiders: 3,
    totalValue: "$312K",
    roles: "CEO + CFO + Director",
    daysSpan: 4,
    priceChange: "+14.2%",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    totalValue: "$88K",
    roles: "CEO + Director",
    daysSpan: 6,
    priceChange: "+8.7%",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    totalValue: "$47K",
    roles: "President + Director",
    daysSpan: 9,
    priceChange: "+5.3%",
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;700&family=Lato:wght@300;400&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .art-deco-page {
    min-height: 100vh;
    background-color: #0F1B2D;
    background-image:
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 40px,
        rgba(212, 175, 55, 0.04) 40px,
        rgba(212, 175, 55, 0.04) 41px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 40px,
        rgba(212, 175, 55, 0.04) 40px,
        rgba(212, 175, 55, 0.04) 41px
      );
    font-family: 'Lato', sans-serif;
    color: #F5F0E8;
    overflow-x: hidden;
  }

  .art-deco-page * {
    font-family: 'Lato', sans-serif;
  }

  .josefin {
    font-family: 'Josefin Sans', sans-serif !important;
  }

  @keyframes shimmer {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }

  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .shimmer {
    animation: shimmer 3s ease-in-out infinite;
  }

  .fade-in-down {
    animation: fadeInDown 0.8s ease-out forwards;
  }

  .fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .cluster-card {
    background: rgba(15, 27, 45, 0.9);
    border: 1px solid rgba(212, 175, 55, 0.5);
    outline: 2px solid rgba(212, 175, 55, 0.15);
    outline-offset: 4px;
    position: relative;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }

  .cluster-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 40px rgba(212, 175, 55, 0.2);
    border-color: rgba(212, 175, 55, 0.9);
  }

  .cluster-card::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 1px solid rgba(212, 175, 55, 0.1);
    pointer-events: none;
  }

  .corner-ornament {
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: rgba(212, 175, 55, 0.7);
    border-style: solid;
  }

  .corner-ornament.tl { top: 4px; left: 4px; border-width: 2px 0 0 2px; }
  .corner-ornament.tr { top: 4px; right: 4px; border-width: 2px 2px 0 0; }
  .corner-ornament.bl { bottom: 4px; left: 4px; border-width: 0 0 2px 2px; }
  .corner-ornament.br { bottom: 4px; right: 4px; border-width: 0 2px 2px 0; }

  .score-diamond {
    width: 64px;
    height: 64px;
    transform: rotate(45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
  }

  .score-diamond-inner {
    transform: rotate(-45deg);
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 700;
    font-size: 18px;
    line-height: 1;
    position: relative;
    z-index: 1;
  }

  .email-input {
    background: transparent;
    border: 1px solid rgba(212, 175, 55, 0.6);
    color: #F5F0E8;
    padding: 14px 20px;
    font-family: 'Lato', sans-serif;
    font-size: 14px;
    letter-spacing: 0.08em;
    outline: none;
    transition: border-color 0.2s ease;
    width: 100%;
  }

  .email-input::placeholder {
    color: rgba(245, 240, 232, 0.35);
    letter-spacing: 0.12em;
    font-size: 12px;
  }

  .email-input:focus {
    border-color: rgba(212, 175, 55, 0.9);
    box-shadow: 0 0 12px rgba(212, 175, 55, 0.15);
  }

  .cta-button {
    background: #D4AF37;
    color: #0F1B2D;
    border: none;
    padding: 14px 32px;
    font-family: 'Josefin Sans', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.18em;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
    white-space: nowrap;
  }

  .cta-button:hover {
    background: #F0C840;
    transform: translateY(-1px);
  }

  .cta-button:active {
    transform: translateY(0);
  }

  .sunburst {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(212, 175, 55, 0.025) 1deg,
      transparent 2deg,
      transparent 14deg,
      rgba(212, 175, 55, 0.025) 15deg,
      transparent 16deg,
      transparent 29deg,
      rgba(212, 175, 55, 0.025) 30deg,
      transparent 31deg,
      transparent 44deg,
      rgba(212, 175, 55, 0.025) 45deg,
      transparent 46deg,
      transparent 59deg,
      rgba(212, 175, 55, 0.025) 60deg,
      transparent 61deg,
      transparent 74deg,
      rgba(212, 175, 55, 0.025) 75deg,
      transparent 76deg,
      transparent 89deg,
      rgba(212, 175, 55, 0.025) 90deg,
      transparent 91deg,
      transparent 104deg,
      rgba(212, 175, 55, 0.025) 105deg,
      transparent 106deg,
      transparent 119deg,
      rgba(212, 175, 55, 0.025) 120deg,
      transparent 121deg,
      transparent 134deg,
      rgba(212, 175, 55, 0.025) 135deg,
      transparent 136deg,
      transparent 149deg,
      rgba(212, 175, 55, 0.025) 150deg,
      transparent 151deg,
      transparent 164deg,
      rgba(212, 175, 55, 0.025) 165deg,
      transparent 166deg,
      transparent 179deg,
      rgba(212, 175, 55, 0.025) 180deg,
      transparent 181deg,
      transparent 194deg,
      rgba(212, 175, 55, 0.025) 195deg,
      transparent 196deg,
      transparent 209deg,
      rgba(212, 175, 55, 0.025) 210deg,
      transparent 211deg,
      transparent 224deg,
      rgba(212, 175, 55, 0.025) 225deg,
      transparent 226deg,
      transparent 239deg,
      rgba(212, 175, 55, 0.025) 240deg,
      transparent 241deg,
      transparent 254deg,
      rgba(212, 175, 55, 0.025) 255deg,
      transparent 256deg,
      transparent 269deg,
      rgba(212, 175, 55, 0.025) 270deg,
      transparent 271deg,
      transparent 284deg,
      rgba(212, 175, 55, 0.025) 285deg,
      transparent 286deg,
      transparent 299deg,
      rgba(212, 175, 55, 0.025) 300deg,
      transparent 301deg,
      transparent 314deg,
      rgba(212, 175, 55, 0.025) 315deg,
      transparent 316deg,
      transparent 329deg,
      rgba(212, 175, 55, 0.025) 330deg,
      transparent 331deg,
      transparent 344deg,
      rgba(212, 175, 55, 0.025) 345deg,
      transparent 346deg,
      transparent 359deg
    );
    border-radius: 50%;
    pointer-events: none;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  }

  .stat-row:last-child {
    border-bottom: none;
  }

  .nav-link {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 0.2em;
    color: rgba(212, 175, 55, 0.7);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .nav-link:hover {
    color: #D4AF37;
  }

  .score-badge-high { background: linear-gradient(135deg, #8B6914, #D4AF37); }
  .score-badge-mid { background: linear-gradient(135deg, #5a4510, #9a7820); }
  .score-badge-low { background: linear-gradient(135deg, #2a2a2a, #5a5a5a); }
`;

function OrnamentalDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "8px 0",
      }}
    >
      <div style={{ width: "60px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
      <span style={{ color: "#D4AF37", fontSize: "10px", letterSpacing: "2px" }}>◆</span>
      <div style={{ width: "80px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
      <span style={{ color: "#D4AF37", fontSize: "10px", letterSpacing: "2px" }}>◆</span>
      <div style={{ width: "80px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
      <span style={{ color: "#D4AF37", fontSize: "10px", letterSpacing: "2px" }}>◆</span>
      <div style={{ width: "60px", height: "1px", background: "rgba(212,175,55,0.4)" }} />
    </div>
  );
}

function ScoreDiamond({ score }: { score: number }) {
  const badgeClass =
    score >= 80 ? "score-badge-high" : score >= 70 ? "score-badge-mid" : "score-badge-low";

  return (
    <div
      className={`score-diamond ${badgeClass}`}
      style={{
        boxShadow:
          score >= 80
            ? "0 0 20px rgba(212,175,55,0.4)"
            : score >= 70
            ? "0 0 12px rgba(212,175,55,0.2)"
            : "none",
      }}
    >
      <div className="score-diamond-inner" style={{ color: "#0F1B2D" }}>
        {score}
      </div>
    </div>
  );
}

function ClusterCard({
  cluster,
  index,
}: {
  cluster: (typeof clusters)[0];
  index: number;
}) {
  return (
    <div
      className="cluster-card"
      style={{
        padding: "40px 36px 36px",
        animationDelay: `${index * 0.15}s`,
      }}
    >
      <div className="corner-ornament tl" />
      <div className="corner-ornament tr" />
      <div className="corner-ornament bl" />
      <div className="corner-ornament br" />

      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <div
            className="josefin"
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#D4AF37",
              letterSpacing: "0.12em",
              lineHeight: 1,
            }}
          >
            {cluster.ticker}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(245,240,232,0.7)",
              fontStyle: "italic",
              letterSpacing: "0.04em",
              marginTop: "4px",
            }}
          >
            {cluster.company}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <ScoreDiamond score={cluster.score} />
          <div
            className="josefin"
            style={{
              fontSize: "9px",
              letterSpacing: "0.2em",
              color: "rgba(212,175,55,0.5)",
              textTransform: "uppercase",
            }}
          >
            SIGNAL
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
          marginBottom: "20px",
        }}
      />

      {/* Stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
        <div className="stat-row">
          <span
            className="josefin"
            style={{ fontSize: "10px", letterSpacing: "0.16em", color: "rgba(245,240,232,0.45)" }}
          >
            INSIDERS
          </span>
          <span
            className="josefin"
            style={{ fontSize: "13px", fontWeight: 700, color: "#F5F0E8", letterSpacing: "0.06em" }}
          >
            {cluster.insiders} BUYERS
          </span>
        </div>
        <div className="stat-row">
          <span
            className="josefin"
            style={{ fontSize: "10px", letterSpacing: "0.16em", color: "rgba(245,240,232,0.45)" }}
          >
            CAPITAL
          </span>
          <span
            className="josefin"
            style={{ fontSize: "13px", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.06em" }}
          >
            {cluster.totalValue}
          </span>
        </div>
        <div className="stat-row">
          <span
            className="josefin"
            style={{ fontSize: "10px", letterSpacing: "0.16em", color: "rgba(245,240,232,0.45)" }}
          >
            SPAN
          </span>
          <span
            style={{ fontSize: "13px", color: "rgba(245,240,232,0.75)", letterSpacing: "0.04em" }}
          >
            {cluster.daysSpan} days
          </span>
        </div>
        <div className="stat-row">
          <span
            className="josefin"
            style={{ fontSize: "10px", letterSpacing: "0.16em", color: "rgba(245,240,232,0.45)" }}
          >
            ROLES
          </span>
          <span
            style={{
              fontSize: "12px",
              color: "rgba(245,240,232,0.65)",
              fontStyle: "italic",
              letterSpacing: "0.02em",
            }}
          >
            {cluster.roles}
          </span>
        </div>
        <div className="stat-row">
          <span
            className="josefin"
            style={{ fontSize: "10px", letterSpacing: "0.16em", color: "rgba(245,240,232,0.45)" }}
          >
            30-DAY RETURN
          </span>
          <span
            className="josefin"
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: cluster.priceChange.startsWith("+") ? "#4CAF50" : "#CF6679",
              letterSpacing: "0.06em",
            }}
          >
            {cluster.priceChange}
          </span>
        </div>
      </div>

      {/* Footer ornament */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "24px",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <div style={{ width: "20px", height: "1px", background: "rgba(212,175,55,0.3)" }} />
        <span style={{ color: "rgba(212,175,55,0.4)", fontSize: "8px" }}>◆</span>
        <div style={{ width: "20px", height: "1px", background: "rgba(212,175,55,0.3)" }} />
      </div>
    </div>
  );
}

export default function ArtDecoPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="art-deco-page">
        {/* Top Navigation Bar */}
        <nav
          style={{
            borderBottom: "1px solid rgba(212,175,55,0.2)",
            padding: "16px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "32px" }}>
            <a href="#" className="nav-link">MARKETS</a>
            <a href="#" className="nav-link">INTELLIGENCE</a>
            <a href="#" className="nav-link">ARCHIVES</a>
          </div>
          <div
            className="josefin shimmer"
            style={{
              fontSize: "11px",
              letterSpacing: "0.25em",
              color: "rgba(212,175,55,0.5)",
            }}
          >
            EST. MMXXIV
          </div>
          <div style={{ display: "flex", gap: "32px" }}>
            <a href="#" className="nav-link">ABOUT</a>
            <a href="#" className="nav-link">CONTACT</a>
            <a href="#" className="nav-link">SUBSCRIBE</a>
          </div>
        </nav>

        {/* Hero Section */}
        <header
          style={{
            position: "relative",
            padding: "80px 40px 60px",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* Sunburst background */}
          <div className="sunburst" />

          {/* Top gold rule */}
          <div
            style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)",
              marginBottom: "32px",
            }}
          />

          {/* Edition label */}
          <div
            className="josefin fade-in-down"
            style={{
              fontSize: "11px",
              letterSpacing: "0.35em",
              color: "rgba(212,175,55,0.6)",
              marginBottom: "20px",
            }}
          >
            ◆ &nbsp; INSIDER INTELLIGENCE BUREAU &nbsp; ◆
          </div>

          {/* Main title with flanking lines */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                flex: 1,
                maxWidth: "180px",
                height: "2px",
                background: "linear-gradient(to left, #D4AF37, transparent)",
              }}
            />
            <h1
              className="josefin fade-in-down"
              style={{
                fontSize: "clamp(42px, 7vw, 72px)",
                fontWeight: 700,
                color: "#D4AF37",
                letterSpacing: "0.22em",
                lineHeight: 1,
                textShadow: "0 0 60px rgba(212,175,55,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              CLUSTERDESK
            </h1>
            <div
              style={{
                flex: 1,
                maxWidth: "180px",
                height: "2px",
                background: "linear-gradient(to right, #D4AF37, transparent)",
              }}
            />
          </div>

          {/* Subtitle */}
          <div
            className="josefin fade-in-down"
            style={{
              fontSize: "12px",
              letterSpacing: "0.3em",
              color: "rgba(245,240,232,0.5)",
              marginBottom: "32px",
            }}
          >
            CLUSTER BUY INTELLIGENCE &nbsp;›&nbsp; MICRO-CAP MARKETS
          </div>

          {/* Decorative chevron rule */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "32px",
            }}
          >
            <span style={{ color: "rgba(212,175,55,0.3)", fontSize: "12px" }}>›</span>
            <span style={{ color: "rgba(212,175,55,0.5)", fontSize: "12px" }}>›</span>
            <span style={{ color: "rgba(212,175,55,0.7)", fontSize: "12px" }}>›</span>
            <div
              style={{
                width: "120px",
                height: "1px",
                background: "rgba(212,175,55,0.5)",
              }}
            />
            <span
              className="josefin"
              style={{
                fontSize: "10px",
                letterSpacing: "0.25em",
                color: "rgba(212,175,55,0.7)",
                padding: "0 12px",
              }}
            >
              WEEKLY EDITION
            </span>
            <div
              style={{
                width: "120px",
                height: "1px",
                background: "rgba(212,175,55,0.5)",
              }}
            />
            <span style={{ color: "rgba(212,175,55,0.7)", fontSize: "12px" }}>‹</span>
            <span style={{ color: "rgba(212,175,55,0.5)", fontSize: "12px" }}>‹</span>
            <span style={{ color: "rgba(212,175,55,0.3)", fontSize: "12px" }}>‹</span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: "16px",
              fontWeight: 300,
              color: "rgba(245,240,232,0.65)",
              letterSpacing: "0.08em",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "0 auto 32px",
            }}
          >
            When two or more executives purchase shares within days of each other,
            the market whispers what the boardroom knows.
          </p>

          {/* Bottom gold rule */}
          <div
            style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(212,175,55,0.6), transparent)",
              marginTop: "32px",
            }}
          />
        </header>

        {/* What is a Cluster Buy section */}
        <section style={{ padding: "48px 40px", maxWidth: "860px", margin: "0 auto" }}>
          <OrnamentalDivider />

          <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
            <div
              className="josefin"
              style={{
                fontSize: "10px",
                letterSpacing: "0.35em",
                color: "rgba(212,175,55,0.5)",
                marginBottom: "12px",
              }}
            >
              ◆ &nbsp; INTELLIGENCE BRIEF &nbsp; ◆
            </div>
            <h2
              className="josefin"
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#F5F0E8",
                letterSpacing: "0.14em",
                marginBottom: "20px",
              }}
            >
              THE CLUSTER BUY SIGNAL
            </h2>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 300,
                color: "rgba(245,240,232,0.65)",
                lineHeight: 1.8,
                letterSpacing: "0.04em",
                maxWidth: "620px",
                margin: "0 auto",
              }}
            >
              A cluster buy occurs when multiple corporate insiders — executives, directors,
              officers — independently purchase shares of the same company within a compressed
              timeframe. Historically, such coordinated conviction has preceded significant
              price appreciation at a rate far exceeding chance.
            </p>
          </div>

          {/* Three pillars */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1px",
              background: "rgba(212,175,55,0.2)",
              border: "1px solid rgba(212,175,55,0.2)",
              margin: "32px 0",
            }}
          >
            {[
              { label: "MICRO-CAP FOCUS", desc: "Under $300M market cap — where insiders hold real conviction and signals are amplified." },
              { label: "TWO OR MORE", desc: "A single insider buy is noise. Two or more within days is a chorus the market cannot ignore." },
              { label: "SPEED MATTERS", desc: "Compressed timeframes — 2 to 14 days — indicate urgency and shared private conviction." },
            ].map((pillar, i) => (
              <div
                key={i}
                style={{
                  background: "#0F1B2D",
                  padding: "32px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  className="josefin"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.22em",
                    color: "#D4AF37",
                    marginBottom: "12px",
                  }}
                >
                  {pillar.label}
                </div>
                <div
                  style={{
                    width: "24px",
                    height: "1px",
                    background: "rgba(212,175,55,0.4)",
                    margin: "0 auto 12px",
                  }}
                />
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 300,
                    color: "rgba(245,240,232,0.55)",
                    lineHeight: 1.7,
                    letterSpacing: "0.02em",
                  }}
                >
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          <OrnamentalDivider />
        </section>

        {/* Active Clusters Section */}
        <section style={{ padding: "0 40px 60px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", padding: "0 0 40px" }}>
            <div
              className="josefin"
              style={{
                fontSize: "10px",
                letterSpacing: "0.35em",
                color: "rgba(212,175,55,0.5)",
                marginBottom: "12px",
              }}
            >
              ◆ &nbsp; ACTIVE INTELLIGENCE &nbsp; ◆
            </div>
            <h2
              className="josefin"
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#F5F0E8",
                letterSpacing: "0.14em",
                marginBottom: "8px",
              }}
            >
              CURRENT CLUSTER ALERTS
            </h2>
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "0.15em",
                color: "rgba(245,240,232,0.35)",
                fontStyle: "italic",
              }}
            >
              Ranked by proprietary signal score — updated weekly
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            {clusters.map((cluster, i) => (
              <ClusterCard key={cluster.ticker} cluster={cluster} index={i} />
            ))}
          </div>

          {/* Score legend */}
          <div
            style={{
              marginTop: "32px",
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              padding: "20px",
              border: "1px solid rgba(212,175,55,0.15)",
            }}
          >
            {[
              { range: "80–100", label: "HIGH CONVICTION", color: "#D4AF37" },
              { range: "65–79", label: "MODERATE SIGNAL", color: "#9a7820" },
              { range: "50–64", label: "WORTH WATCHING", color: "#6B7A8D" },
            ].map((item) => (
              <div key={item.range} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    transform: "rotate(45deg)",
                    background: item.color,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    className="josefin"
                    style={{ fontSize: "11px", color: item.color, letterSpacing: "0.12em" }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(245,240,232,0.4)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Score {item.range}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Email Capture */}
        <section
          style={{
            borderTop: "1px solid rgba(212,175,55,0.2)",
            borderBottom: "1px solid rgba(212,175,55,0.2)",
            padding: "64px 40px",
            textAlign: "center",
            background: "rgba(212,175,55,0.03)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative side ornaments */}
          <div
            style={{
              position: "absolute",
              left: "40px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              alignItems: "center",
              opacity: 0.3,
            }}
          >
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: `${20 - i * 2}px`,
                  height: "1px",
                  background: "#D4AF37",
                }}
              />
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              right: "40px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              alignItems: "center",
              opacity: 0.3,
            }}
          >
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: `${20 - i * 2}px`,
                  height: "1px",
                  background: "#D4AF37",
                }}
              />
            ))}
          </div>

          <div
            className="josefin"
            style={{
              fontSize: "10px",
              letterSpacing: "0.35em",
              color: "rgba(212,175,55,0.5)",
              marginBottom: "16px",
            }}
          >
            ◆ &nbsp; PRIVATE WIRE &nbsp; ◆
          </div>
          <h2
            className="josefin"
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#F5F0E8",
              letterSpacing: "0.14em",
              marginBottom: "12px",
            }}
          >
            RECEIVE WEEKLY INTELLIGENCE
          </h2>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 300,
              color: "rgba(245,240,232,0.55)",
              letterSpacing: "0.06em",
              lineHeight: 1.7,
              marginBottom: "36px",
              maxWidth: "480px",
              margin: "0 auto 36px",
            }}
          >
            Every Friday, the week&apos;s most significant cluster buys — curated, ranked,
            and delivered before Monday&apos;s open.
          </p>

          {submitted ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                border: "1px solid rgba(212,175,55,0.4)",
                padding: "16px 32px",
              }}
            >
              <span style={{ color: "#D4AF37", fontSize: "16px" }}>◆</span>
              <span
                className="josefin"
                style={{ color: "#D4AF37", letterSpacing: "0.18em", fontSize: "13px" }}
              >
                TRANSMISSION RECEIVED
              </span>
              <span style={{ color: "#D4AF37", fontSize: "16px" }}>◆</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                maxWidth: "480px",
                margin: "0 auto",
                gap: "0",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR TELEGRAPH ADDRESS"
                className="email-input"
                required
                style={{ flex: 1 }}
              />
              <button type="submit" className="cta-button">
                RECEIVE INTELLIGENCE
              </button>
            </form>
          )}

          <div
            style={{
              marginTop: "24px",
              fontSize: "11px",
              color: "rgba(245,240,232,0.25)",
              letterSpacing: "0.1em",
              fontStyle: "italic",
            }}
          >
            No solicitations. Unsubscribe at any time. Your address is held in confidence.
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: "60px 40px", maxWidth: "860px", margin: "0 auto" }}>
          <OrnamentalDivider />

          <div style={{ textAlign: "center", padding: "40px 0 36px" }}>
            <div
              className="josefin"
              style={{
                fontSize: "10px",
                letterSpacing: "0.35em",
                color: "rgba(212,175,55,0.5)",
                marginBottom: "12px",
              }}
            >
              ◆ &nbsp; METHODOLOGY &nbsp; ◆
            </div>
            <h2
              className="josefin"
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#F5F0E8",
                letterSpacing: "0.14em",
                marginBottom: "32px",
              }}
            >
              THE INTELLIGENCE PROCESS
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
            {[
              {
                step: "I",
                title: "ACQUISITION",
                desc: "SEC Form 4 filings are monitored in real-time across all registered micro-cap and small-cap issuers.",
              },
              {
                step: "II",
                title: "DETECTION",
                desc: "Proprietary algorithms identify when two or more distinct insiders purchase within a 14-day window.",
              },
              {
                step: "III",
                title: "SCORING",
                desc: "Each cluster is scored 0–100 based on number of participants, capital deployed, role seniority, and timeframe compression.",
              },
              {
                step: "IV",
                title: "DISSEMINATION",
                desc: "Ranked alerts transmitted to subscribers each Friday before market open, with full context and filing citations.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "32px",
                  padding: "28px 0",
                  borderBottom: i < 3 ? "1px solid rgba(212,175,55,0.1)" : "none",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="josefin"
                  style={{
                    fontSize: "22px",
                    fontWeight: 300,
                    color: "rgba(212,175,55,0.3)",
                    minWidth: "40px",
                    letterSpacing: "0.1em",
                    lineHeight: 1,
                    paddingTop: "2px",
                  }}
                >
                  {item.step}
                </div>
                <div
                  style={{
                    width: "1px",
                    alignSelf: "stretch",
                    background: "rgba(212,175,55,0.15)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    className="josefin"
                    style={{
                      fontSize: "13px",
                      letterSpacing: "0.2em",
                      color: "#D4AF37",
                      marginBottom: "8px",
                    }}
                  >
                    {item.title}
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 300,
                      color: "rgba(245,240,232,0.6)",
                      lineHeight: 1.7,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <OrnamentalDivider />
        </section>

        {/* Disclaimer / Footer */}
        <footer
          style={{
            borderTop: "1px solid rgba(212,175,55,0.15)",
            padding: "40px 40px 48px",
            textAlign: "center",
          }}
        >
          {/* Footer logo */}
          <div
            className="josefin"
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "rgba(212,175,55,0.4)",
              letterSpacing: "0.22em",
              marginBottom: "8px",
            }}
          >
            CLUSTERDESK
          </div>
          <div
            className="josefin"
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: "rgba(245,240,232,0.2)",
              marginBottom: "28px",
            }}
          >
            INSIDER INTELLIGENCE BUREAU
          </div>

          <div
            style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)",
              marginBottom: "24px",
            }}
          />

          <p
            style={{
              fontSize: "11px",
              fontWeight: 300,
              color: "rgba(245,240,232,0.25)",
              lineHeight: 1.8,
              letterSpacing: "0.04em",
              maxWidth: "600px",
              margin: "0 auto 20px",
            }}
          >
            ClusterDesk is an informational service. Nothing herein constitutes investment advice,
            a solicitation, or a recommendation to buy or sell any security. Insider transaction
            data is sourced from public SEC filings. Past cluster patterns do not guarantee
            future results. Invest at your own risk.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {["PRIVACY POLICY", "TERMS OF SERVICE", "DISCLAIMER", "CONTACT"].map((link) => (
              <a
                key={link}
                href="#"
                className="josefin"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  color: "rgba(212,175,55,0.3)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,55,0.7)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,55,0.3)";
                }}
              >
                {link}
              </a>
            ))}
          </div>

          <div
            style={{
              marginTop: "28px",
              fontSize: "9px",
              letterSpacing: "0.15em",
              color: "rgba(245,240,232,0.15)",
            }}
          >
            ◆ &nbsp; MMXXVI &nbsp; ◆
          </div>
        </footer>
      </div>
    </>
  );
}
