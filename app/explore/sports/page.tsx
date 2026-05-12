"use client";

import React, { useEffect, useRef, useState } from "react";

// ─── Sample Data ────────────────────────────────────────────────────────────

const CLUSTERS = [
  {
    rank: 1,
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiders: 3,
    value: 312000,
    roles: "CEO + CFO + Director",
    change: "+14.2%",
    hot: true,
  },
  {
    rank: 2,
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    value: 88000,
    roles: "CEO + Director",
    change: "+8.7%",
    hot: false,
  },
  {
    rank: 3,
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    value: 47000,
    roles: "President + Director",
    change: "+5.1%",
    hot: false,
  },
];

const MVST_FILINGS = [
  {
    name: "Yang Wu",
    position: "CEO",
    date: "May 7, 2026",
    shares: 142857,
    value: 180000,
    change: "+14.2%",
  },
  {
    name: "Sascha Kelterborn",
    position: "Director",
    date: "May 8, 2026",
    shares: 65079,
    value: 82000,
    change: "+14.2%",
  },
  {
    name: "Craig Webster",
    position: "CFO",
    date: "May 9, 2026",
    shares: 39682,
    value: 50000,
    change: "+14.2%",
  },
];

const BREAKING_ITEMS = [
  "MVST CEO YANG WU PURCHASES $180K — THIRD INSIDER THIS WEEK",
  "CLUSTER ALERT: ZDGE PRESIDENT + DIRECTOR BUY WITHIN 48 HRS",
  "AEYE AUDIOEYE INSIDER CLUSTER: 2 EXECS — $88K COMBINED",
  "MICRO-CAP CLUSTER ACTIVITY UP 23% VS PRIOR WEEK",
  "NEW ALERT: INSIDER CONVICTION SCORE 87 — HIGHEST THIS MONTH",
];

const TICKER_ITEMS = [
  "MVST 87 ▲",
  "AEYE 74 ▲",
  "ZDGE 62 ▲",
  "CLUSTER ALERTS: 3 ACTIVE",
  "WEEK'S TOP BUY: $312K",
  "INSIDERS IN ACTION: 7",
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

// ─── Sub-components (inline, no imports) ────────────────────────────────────

function LiveBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "#CC0000",
        borderRadius: 3,
        padding: "2px 8px 2px 6px",
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 13,
        letterSpacing: 2,
        color: "#fff",
        lineHeight: 1,
      }}
    >
      <span className="live-dot" />
      LIVE
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "#FFD700",
    2: "#C0C0C0",
    3: "#CD7F32",
  };
  const color = colors[rank] ?? "#888888";
  return (
    <span
      style={{
        display: "inline-block",
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: color,
        color: rank <= 3 ? "#111" : "#fff",
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 15,
        lineHeight: "28px",
        textAlign: "center",
        fontWeight: 400,
      }}
    >
      {rank}
    </span>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function SportsPage() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const breakingRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Duplicate ticker content for seamless loop
  const tickerText = TICKER_ITEMS.join("   •   ");
  const breakingText = BREAKING_ITEMS.join("     //     ");

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Condensed:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #111111; }

        .sports-page {
          background: #111111;
          color: #ffffff;
          font-family: 'Roboto Condensed', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Live dot pulse */
        .live-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 50%;
          animation: pulse-dot 1.4s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        /* Ticker scroll */
        .ticker-track {
          display: flex;
          white-space: nowrap;
          animation: scroll-left 30s linear infinite;
        }
        .ticker-track:hover { animation-play-state: paused; }

        .breaking-track {
          display: flex;
          white-space: nowrap;
          animation: scroll-left 40s linear infinite;
        }
        .breaking-track:hover { animation-play-state: paused; }

        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Table rows */
        .standings-row:hover { background: #222222 !important; }
        .filings-row:hover { background: #222222 !important; }

        /* Score glow */
        .score-glow {
          text-shadow: 0 0 40px rgba(204,0,0,0.6), 0 0 80px rgba(204,0,0,0.3);
        }

        /* Stat card hover */
        .stat-card { transition: transform 0.15s ease, border-color 0.15s ease; }
        .stat-card:hover { transform: translateY(-2px); border-color: #CC0000 !important; }

        /* CTA button */
        .cta-btn {
          background: #CC0000;
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 3px;
          font-size: 20px;
          padding: 14px 40px;
          border-radius: 3px;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .cta-btn:hover { background: #aa0000; transform: scale(1.03); }
        .cta-btn:active { transform: scale(0.98); }

        .email-input {
          background: #1A1A1A;
          border: 1.5px solid #333;
          color: #fff;
          font-family: 'Roboto Condensed', sans-serif;
          font-size: 16px;
          padding: 13px 18px;
          border-radius: 3px;
          outline: none;
          width: 280px;
          transition: border-color 0.15s;
        }
        .email-input:focus { border-color: #CC0000; }
        .email-input::placeholder { color: #555; }

        /* Divider */
        .red-divider { height: 3px; background: #CC0000; }

        /* Section label */
        .section-label {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 4px;
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .standings-table th:nth-child(4),
          .standings-table td:nth-child(4) { display: none; }
          .filings-table th:nth-child(4),
          .filings-table td:nth-child(4) { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .featured-card-inner { flex-direction: column !important; }
          .score-col { border-right: none !important; border-bottom: 2px solid #222 !important; padding-bottom: 24px !important; margin-bottom: 24px !important; }
        }
      `}</style>

      <div className="sports-page">

        {/* ── Top ticker tape ── */}
        <div
          style={{
            background: "#000",
            borderBottom: "2px solid #CC0000",
            overflow: "hidden",
            height: 34,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#CC0000",
              padding: "0 14px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 14,
              letterSpacing: 2,
              color: "#fff",
              marginRight: 16,
            }}
          >
            ALERTS
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div className="ticker-track">
              {/* Doubled for seamless loop */}
              {[tickerText, tickerText].map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 14,
                    letterSpacing: 2,
                    color: "#FFD700",
                    paddingRight: 80,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Header ── */}
        <header
          style={{
            background: "#0a0a0a",
            borderBottom: "1px solid #1e1e1e",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 36,
                letterSpacing: 5,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              CLUSTER
              <span style={{ color: "#CC0000" }}>DESK</span>
            </span>
            <div
              style={{
                width: 1,
                height: 30,
                background: "#333",
              }}
            />
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 16,
                letterSpacing: 3,
                color: "#888",
              }}
            >
              INSIDER INTELLIGENCE
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <LiveBadge />
            <span
              style={{
                fontFamily: "'Roboto Condensed', sans-serif",
                fontSize: 13,
                color: "#888",
              }}
            >
              MON MAY 12, 2026
            </span>
          </div>
        </header>

        {/* ── Breaking News strip ── */}
        <div
          style={{
            background: "#CC0000",
            overflow: "hidden",
            height: 36,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#8B0000",
              padding: "0 14px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 14,
              letterSpacing: 3,
              color: "#FFD700",
              gap: 6,
            }}
          >
            <span className="live-dot" style={{ background: "#FFD700" } as React.CSSProperties} />
            BREAKING
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div className="breaking-track">
              {[breakingText, breakingText].map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 14,
                    letterSpacing: 2,
                    color: "#fff",
                    paddingRight: 80,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

          {/* ── Featured game card ── */}
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="section-label">FEATURED MATCHUP</span>
                <LiveBadge />
              </div>
              <span
                style={{
                  fontFamily: "'Roboto Condensed', sans-serif",
                  fontSize: 12,
                  color: "#888",
                  letterSpacing: 1,
                }}
              >
                WEEK 19 · MICRO-CAP DIVISION
              </span>
            </div>

            <div
              style={{
                background: "#1A1A1A",
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                padding: "28px 32px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Red accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: "linear-gradient(90deg, #CC0000, #880000)",
                }}
              />

              <div
                className="featured-card-inner"
                style={{ display: "flex", gap: 40, alignItems: "center" }}
              >
                {/* Score column */}
                <div
                  className="score-col"
                  style={{
                    textAlign: "center",
                    borderRight: "2px solid #222",
                    paddingRight: 40,
                    minWidth: 160,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 11,
                      letterSpacing: 4,
                      color: "#888",
                      marginBottom: 4,
                    }}
                  >
                    CONVICTION SCORE
                  </div>
                  <div
                    className="score-glow"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 120,
                      lineHeight: 1,
                      color: "#CC0000",
                    }}
                  >
                    87
                  </div>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 14,
                      letterSpacing: 4,
                      color: "#FFD700",
                    }}
                  >
                    CONVICTION
                  </div>
                </div>

                {/* Matchup info */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 11,
                      letterSpacing: 4,
                      color: "#888",
                      marginBottom: 6,
                    }}
                  >
                    INSIDERS VS MARKET
                  </div>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 52,
                      lineHeight: 1,
                      color: "#fff",
                      marginBottom: 2,
                    }}
                  >
                    MVST
                  </div>
                  <div
                    style={{
                      fontFamily: "'Roboto Condensed', sans-serif",
                      fontSize: 16,
                      color: "#aaa",
                      marginBottom: 16,
                      fontWeight: 400,
                    }}
                  >
                    Microvast Holdings, Inc.
                  </div>

                  {/* Stat pills */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {[
                      { label: "INSIDERS", val: "3" },
                      { label: "TOTAL BUY", val: "$312K" },
                      { label: "CLUSTER SPAN", val: "3 DAYS" },
                      { label: "ROLES", val: "CEO + CFO + DIR" },
                    ].map((pill) => (
                      <div
                        key={pill.label}
                        style={{
                          background: "#111",
                          border: "1px solid #2a2a2a",
                          borderRadius: 3,
                          padding: "6px 12px",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 9,
                            letterSpacing: 3,
                            color: "#888",
                            marginBottom: 2,
                          }}
                        >
                          {pill.label}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 20,
                            color: "#fff",
                            letterSpacing: 1,
                          }}
                        >
                          {pill.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Change badge */}
                <div
                  style={{
                    textAlign: "center",
                    minWidth: 100,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 11,
                      letterSpacing: 3,
                      color: "#888",
                      marginBottom: 4,
                    }}
                  >
                    SINCE CLUSTER
                  </div>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 48,
                      color: "#4CAF50",
                      lineHeight: 1,
                    }}
                  >
                    +14.2%
                  </div>
                  <div
                    style={{
                      fontFamily: "'Roboto Condensed', sans-serif",
                      fontSize: 12,
                      color: "#888",
                      marginTop: 4,
                    }}
                  >
                    stock return
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats grid ── */}
          <div style={{ marginBottom: 40 }}>
            <div className="section-label" style={{ marginBottom: 14 }}>
              THIS WEEK'S STATS
            </div>
            <div
              className="stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 12,
              }}
            >
              {[
                { label: "AVG SCORE", value: "74", sub: "across 3 clusters" },
                { label: "ACTIVE INSIDERS", value: "7", sub: "this week" },
                { label: "TOTAL VOLUME", value: "$447K", sub: "combined buys" },
                { label: "DAYS MONITORED", value: "365", sub: "continuous" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="stat-card"
                  style={{
                    background: "#1A1A1A",
                    border: "1px solid #2a2a2a",
                    borderRadius: 6,
                    padding: "20px 18px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 9,
                      letterSpacing: 4,
                      color: "#888",
                      marginBottom: 6,
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 52,
                      color: "#fff",
                      lineHeight: 1,
                      marginBottom: 4,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Roboto Condensed', sans-serif",
                      fontSize: 12,
                      color: "#888",
                    }}
                  >
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Standings / Leaderboard ── */}
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div className="section-label">CLUSTER STANDINGS</div>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 11,
                  letterSpacing: 3,
                  color: "#CC0000",
                }}
              >
                WEEK 19
              </span>
            </div>

            <div
              style={{
                background: "#1A1A1A",
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <table
                className="standings-table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "'Roboto Condensed', sans-serif",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#111",
                      borderBottom: "2px solid #CC0000",
                    }}
                  >
                    {[
                      { label: "RNK", align: "center" as const, width: 60 },
                      { label: "TEAM (TICKER)", align: "left" as const, width: "auto" },
                      { label: "W — INSIDERS", align: "center" as const, width: 110 },
                      { label: "$ VALUE", align: "right" as const, width: 100 },
                      { label: "CHANGE", align: "right" as const, width: 90 },
                      { label: "SCORE", align: "right" as const, width: 80 },
                    ].map((col) => (
                      <th
                        key={col.label}
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: 11,
                          letterSpacing: 3,
                          color: "#888",
                          padding: "10px 14px",
                          textAlign: col.align,
                          width: col.width,
                          fontWeight: 400,
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CLUSTERS.map((c, idx) => (
                    <tr
                      key={c.ticker}
                      className="standings-row"
                      style={{
                        borderBottom:
                          idx < CLUSTERS.length - 1 ? "1px solid #1e1e1e" : "none",
                        background: c.hot ? "rgba(204,0,0,0.05)" : "transparent",
                        cursor: "default",
                      }}
                    >
                      <td style={{ padding: "14px", textAlign: "center" }}>
                        <RankBadge rank={c.rank} />
                      </td>
                      <td style={{ padding: "14px 14px 14px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              background: "#CC0000",
                              borderRadius: 3,
                              padding: "2px 8px",
                              fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: 17,
                              letterSpacing: 1,
                              color: "#fff",
                              lineHeight: 1.3,
                            }}
                          >
                            {c.ticker}
                          </div>
                          <div>
                            <div
                              style={{
                                fontFamily: "'Roboto Condensed', sans-serif",
                                fontSize: 14,
                                fontWeight: 700,
                                color: "#fff",
                                lineHeight: 1.2,
                              }}
                            >
                              {c.company}
                            </div>
                            <div
                              style={{
                                fontFamily: "'Roboto Condensed', sans-serif",
                                fontSize: 12,
                                color: "#888",
                              }}
                            >
                              {c.roles}
                            </div>
                          </div>
                          {c.hot && (
                            <span
                              style={{
                                background: "#FFD700",
                                color: "#111",
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: 10,
                                letterSpacing: 2,
                                padding: "2px 6px",
                                borderRadius: 2,
                              }}
                            >
                              HOT
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "14px",
                          textAlign: "center",
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: 22,
                          color: "#fff",
                          letterSpacing: 1,
                        }}
                      >
                        {c.insiders}
                      </td>
                      <td
                        style={{
                          padding: "14px",
                          textAlign: "right",
                          fontFamily: "'Roboto Condensed', sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#fff",
                        }}
                      >
                        {formatMoney(c.value)}
                      </td>
                      <td
                        style={{
                          padding: "14px",
                          textAlign: "right",
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: 18,
                          color: "#4CAF50",
                          letterSpacing: 1,
                        }}
                      >
                        {c.change}
                      </td>
                      <td
                        style={{
                          padding: "14px",
                          textAlign: "right",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              c.score >= 80
                                ? "#CC0000"
                                : c.score >= 70
                                ? "#8B3A00"
                                : "#2a2a2a",
                            borderRadius: 4,
                            padding: "4px 10px",
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 22,
                            color: "#fff",
                            letterSpacing: 1,
                            minWidth: 48,
                          }}
                        >
                          {c.score}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── MVST Insider filings table ── */}
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div className="section-label">MVST PLAYER STATS — INSIDER FILINGS</div>
              <LiveBadge />
            </div>

            <div
              style={{
                background: "#1A1A1A",
                border: "1px solid #2a2a2a",
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <table
                className="filings-table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "'Roboto Condensed', sans-serif",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#111",
                      borderBottom: "2px solid #333",
                    }}
                  >
                    {["PLAYER", "POSITION", "DATE", "SHARES", "VALUE", "STOCK ▲"].map(
                      (col) => (
                        <th
                          key={col}
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 11,
                            letterSpacing: 3,
                            color: "#888",
                            padding: "10px 16px",
                            textAlign: col === "PLAYER" || col === "POSITION" || col === "DATE" ? "left" : "right",
                            fontWeight: 400,
                          }}
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {MVST_FILINGS.map((f, idx) => (
                    <tr
                      key={f.name}
                      className="filings-row"
                      style={{
                        borderBottom:
                          idx < MVST_FILINGS.length - 1 ? "1px solid #1e1e1e" : "none",
                        cursor: "default",
                      }}
                    >
                      <td
                        style={{
                          padding: "14px 16px",
                          fontFamily: "'Roboto Condensed', sans-serif",
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#fff",
                        }}
                      >
                        {f.name}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            background: "#1e1e1e",
                            border: "1px solid #2a2a2a",
                            borderRadius: 3,
                            padding: "3px 8px",
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 13,
                            letterSpacing: 2,
                            color: "#aaa",
                          }}
                        >
                          {f.position}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontFamily: "'Roboto Condensed', sans-serif",
                          fontSize: 13,
                          color: "#888",
                        }}
                      >
                        {f.date}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          textAlign: "right",
                          fontFamily: "'Roboto Condensed', sans-serif",
                          fontSize: 14,
                          color: "#ccc",
                        }}
                      >
                        {f.shares.toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          textAlign: "right",
                          fontFamily: "'Roboto Condensed', sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#fff",
                        }}
                      >
                        {formatMoney(f.value)}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          textAlign: "right",
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: 18,
                          color: "#4CAF50",
                          letterSpacing: 1,
                        }}
                      >
                        {f.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Subscribe CTA ── */}
          <div
            style={{
              background: "#1A1A1A",
              border: "1px solid #2a2a2a",
              borderRadius: 6,
              padding: "40px 32px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Red corner accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                borderTop: "60px solid #CC0000",
                borderRight: "60px solid transparent",
              }}
            />

            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 11,
                letterSpacing: 5,
                color: "#888",
                marginBottom: 8,
              }}
            >
              FREE EARLY ACCESS
            </div>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 56,
                letterSpacing: 4,
                color: "#fff",
                lineHeight: 1,
                marginBottom: 10,
              }}
            >
              JOIN THE TEAM
            </h2>
            <p
              style={{
                fontFamily: "'Roboto Condensed', sans-serif",
                fontSize: 16,
                color: "#888",
                maxWidth: 440,
                margin: "0 auto 28px",
                lineHeight: 1.5,
              }}
            >
              Get instant alerts when 2+ insiders buy the same micro-cap stock within
              days of each other. Real signals. No noise.
            </p>

            {submitted ? (
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 28,
                  letterSpacing: 3,
                  color: "#4CAF50",
                }}
              >
                YOU'RE ON THE ROSTER
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubmitted(true);
                }}
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <input
                  className="email-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="cta-btn" type="submit">
                  JOIN THE TEAM
                </button>
              </form>
            )}

            <div
              style={{
                marginTop: 16,
                fontFamily: "'Roboto Condensed', sans-serif",
                fontSize: 12,
                color: "#555",
              }}
            >
              No spam. Unsubscribe anytime. Free forever for early members.
            </div>
          </div>

        </main>

        {/* ── Footer ── */}
        <footer
          style={{
            borderTop: "1px solid #1e1e1e",
            padding: "20px 24px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 18,
              letterSpacing: 4,
              color: "#333",
            }}
          >
            CLUSTER<span style={{ color: "#CC0000" }}>DESK</span>
          </span>
          <span
            style={{
              fontFamily: "'Roboto Condensed', sans-serif",
              fontSize: 12,
              color: "#444",
            }}
          >
            For informational purposes only. Not investment advice. SEC Form 4 data.
          </span>
          <span
            style={{
              fontFamily: "'Roboto Condensed', sans-serif",
              fontSize: 12,
              color: "#444",
            }}
          >
            © 2026 ClusterDesk
          </span>
        </footer>

      </div>
    </>
  );
}
