"use client";

import { useState } from "react";

const CLUSTERS = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiders: 3,
    amount: "$312K",
    days: 4,
    sector: "ENERGY STORAGE",
    position: 1,
    lapTime: "1:23.487",
    gap: "LEADER",
    drs: true,
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    amount: "$88K",
    days: 6,
    sector: "ACCESSIBILITY TECH",
    position: 2,
    lapTime: "1:24.831",
    gap: "+1.344",
    drs: false,
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    amount: "$47K",
    days: 8,
    sector: "DIGITAL MEDIA",
    position: 3,
    lapTime: "1:26.119",
    gap: "+2.632",
    drs: false,
  },
];

const POSITION_COLORS: Record<number, string> = {
  1: "#E8002D",
  2: "#C0C0C0",
  3: "#FFD700",
};

export default function RacingPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setJoined(true);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Exo+2:wght@400;600;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* ── Animations ── */
        @keyframes rev-counter {
          0%   { width: 0%; }
          100% { width: var(--bar-width); }
        }

        @keyframes drs-blink {
          0%, 49% { background: #E8002D; box-shadow: 0 0 10px #E8002D, 0 0 20px #E8002D; }
          50%, 100% { background: #6b0014; box-shadow: none; }
        }

        @keyframes scroll-ticker {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        @keyframes flag-wave {
          0%   { opacity: 1; }
          50%  { opacity: 0.7; }
          100% { opacity: 1; }
        }

        @keyframes rpm-pulse {
          0%, 100% { box-shadow: 0 0 4px #E8002D; }
          50%       { box-shadow: 0 0 16px #E8002D, 0 0 32px rgba(232,0,45,0.4); }
        }

        @keyframes stripe-slide {
          0%   { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }

        /* ── Root ── */
        .f1-root {
          font-family: 'Exo 2', sans-serif;
          background-color: #0D0D0D;
          background-image:
            repeating-linear-gradient(45deg,  #111 0px, #111 2px, #0D0D0D 2px, #0D0D0D 10px),
            repeating-linear-gradient(-45deg, #111 0px, #111 2px, #0D0D0D 2px, #0D0D0D 10px);
          background-blend-mode: overlay;
          color: #FFFFFF;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── Ticker ── */
        .ticker-wrap {
          overflow: hidden;
          white-space: nowrap;
          background: #E8002D;
          padding: 7px 0;
        }
        .ticker-inner {
          display: inline-block;
          animation: scroll-ticker 28s linear infinite;
        }
        .ticker-text {
          font-family: 'Exo 2', sans-serif;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #fff;
          text-transform: uppercase;
        }

        /* ── Racing stripe nav ── */
        .racing-nav {
          position: relative;
          padding: 0;
          overflow: hidden;
          border-bottom: 3px solid #E8002D;
        }
        .nav-stripe-bg {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            -60deg,
            #E8002D 0px,
            #E8002D 20px,
            #0D0D0D 20px,
            #0D0D0D 40px
          );
          opacity: 0.18;
          animation: stripe-slide 1.2s linear infinite;
        }
        .nav-inner {
          position: relative;
          z-index: 2;
          padding: 28px 48px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* ── Checkered flag deco ── */
        .checkered {
          display: inline-grid;
          grid-template-columns: repeat(8, 10px);
          grid-template-rows: repeat(2, 10px);
          flex-shrink: 0;
        }
        .checkered-cell {
          width: 10px;
          height: 10px;
        }

        /* ── DRS indicator ── */
        .drs-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #E8002D;
          color: #fff;
          font-family: 'Russo One', sans-serif;
          font-size: 11px;
          letter-spacing: 0.15em;
          padding: 5px 14px;
          animation: drs-blink 0.9s ease-in-out infinite;
        }

        /* ── Pit board cards ── */
        .race-card {
          background: #111;
          border: 1px solid #222;
          border-left: 4px solid #333;
          position: relative;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          cursor: default;
          overflow: hidden;
        }
        .race-card.card-hover {
          box-shadow: 0 0 24px rgba(232,0,45,0.25), 0 0 48px rgba(232,0,45,0.1);
        }

        /* Carbon inlay on card top */
        .card-carbon-strip {
          height: 4px;
          width: 100%;
          background-image:
            repeating-linear-gradient(45deg,  #1a1a1a 0px, #1a1a1a 1px, #131313 1px, #131313 6px),
            repeating-linear-gradient(-45deg, #1a1a1a 0px, #1a1a1a 1px, #131313 1px, #131313 6px);
          background-blend-mode: overlay;
        }

        /* ── Rev counter bar ── */
        .rev-track {
          height: 4px;
          background: #1c1c1c;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 8px;
        }
        .rev-fill {
          height: 100%;
          background: linear-gradient(90deg, #E8002D 0%, #ff4d6d 80%, #FFD700 100%);
          border-radius: 2px;
          animation: rev-counter 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 0.3s;
          width: 0%;
        }

        /* ── Position badge ── */
        .pos-badge {
          font-family: 'Russo One', sans-serif;
          font-size: 42px;
          line-height: 1;
          letter-spacing: -0.02em;
          min-width: 64px;
          text-align: center;
        }

        /* ── Telemetry strip ── */
        .telemetry {
          background: #0a0a0a;
          border-top: 1px solid #1e1e1e;
          border-bottom: 1px solid #1e1e1e;
          padding: 14px 48px;
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          align-items: center;
        }
        .tel-segment {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 32px 0 0;
          border-right: 1px solid #222;
          margin-right: 32px;
        }
        .tel-segment:last-child {
          border-right: none;
          margin-right: 0;
          padding-right: 0;
        }
        .tel-label {
          font-family: 'Exo 2', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.25em;
          color: #C0C0C0;
          text-transform: uppercase;
        }
        .tel-value {
          font-family: 'Russo One', sans-serif;
          font-size: 14px;
          letter-spacing: 0.05em;
          color: #fff;
        }

        /* ── Pit board data panels ── */
        .pit-panel {
          background: #000;
          border: 1px solid #1e1e1e;
          padding: 10px 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 80px;
        }
        .pit-panel-label {
          font-family: 'Exo 2', sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #C0C0C0;
          text-transform: uppercase;
        }
        .pit-panel-value {
          font-family: 'Russo One', sans-serif;
          font-size: 22px;
          letter-spacing: 0.02em;
          color: #fff;
          line-height: 1.1;
        }

        /* ── Lap time display ── */
        .lap-time {
          font-family: 'Russo One', sans-serif;
          font-size: 15px;
          letter-spacing: 0.08em;
          color: #FFD700;
        }

        /* ── Subscribe section ── */
        .pit-wall-btn {
          font-family: 'Russo One', sans-serif;
          background: #E8002D;
          color: #fff;
          border: none;
          padding: 14px 36px;
          font-size: 13px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.15s ease, box-shadow 0.15s ease;
          flex-shrink: 0;
        }
        .pit-wall-btn:hover {
          background: #c4001f;
          box-shadow: 0 0 16px rgba(232,0,45,0.6);
        }

        .pit-wall-input {
          font-family: 'Exo 2', sans-serif;
          font-size: 13px;
          font-weight: 600;
          background: #000;
          border: 1px solid #333;
          border-right: none;
          color: #fff;
          padding: 14px 18px;
          width: 100%;
          max-width: 320px;
          letter-spacing: 0.05em;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .pit-wall-input::placeholder {
          color: #555;
        }
        .pit-wall-input:focus {
          border-color: #E8002D;
        }

        /* ── Pole badge ── */
        .pole-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #E8002D;
          color: #fff;
          font-family: 'Russo One', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          padding: 4px 12px;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%);
          flex-shrink: 0;
        }

        /* ── Safety car banner ── */
        .safety-car-bar {
          background: #1a1500;
          border-top: 2px solid #FFD700;
          border-bottom: 2px solid #FFD700;
          padding: 8px 48px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* ── Section divider ── */
        .f1-divider {
          border: none;
          border-top: 1px solid #1e1e1e;
          margin: 48px 0;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .nav-inner { padding: 20px 20px; }
          .telemetry  { padding: 14px 20px; gap: 16px; }
          .safety-car-bar { padding: 8px 20px; }
          .main-pad   { padding: 24px 20px 60px; }
          .pit-panel-value { font-size: 16px; }
          .pos-badge  { font-size: 30px; min-width: 48px; }
        }
      `}</style>

      <div className="f1-root">

        {/* ── TICKER TAPE ── */}
        <div className="ticker-wrap" aria-hidden="true">
          <div className="ticker-inner">
            <span className="ticker-text">
              {
                "  ▸  MVST — 3 INSIDERS — $312K — LAP 1:23.487  ·  AEYE — 2 INSIDERS — $88K — LAP 1:24.831  ·  ZDGE — 2 INSIDERS — $47K — LAP 1:26.119  ·  CLUSTER ALERT: POLE POSITION LOCKED  ·  MONITORING 4,847 MICRO-CAPS  ·  SEC FORM 4 LIVE DATA  ·  MVST — 3 INSIDERS — $312K — LAP 1:23.487  ·  AEYE — 2 INSIDERS — $88K — LAP 1:24.831  ·  ZDGE — 2 INSIDERS — $47K — LAP 1:26.119  ·  CLUSTER ALERT: POLE POSITION LOCKED  ·  MONITORING 4,847 MICRO-CAPS  ·  SEC FORM 4 LIVE DATA  ·  "
              }
            </span>
          </div>
        </div>

        {/* ── RACING STRIPE HEADER ── */}
        <header className="racing-nav">
          <div className="nav-stripe-bg" aria-hidden="true" />
          <div className="nav-inner">
            <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
              {/* Checkered flag */}
              <div className="checkered" aria-hidden="true">
                {Array.from({ length: 16 }, (_, i) => {
                  const row = Math.floor(i / 8);
                  const col = i % 8;
                  const isBlack = (row + col) % 2 === 0;
                  return (
                    <div
                      key={i}
                      className="checkered-cell"
                      style={{ background: isBlack ? "#fff" : "#000" }}
                    />
                  );
                })}
              </div>

              <h1
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: "clamp(28px, 5vw, 52px)",
                  letterSpacing: "0.04em",
                  color: "#FFFFFF",
                  lineHeight: 1,
                  textTransform: "uppercase",
                  textShadow: "2px 2px 0 #E8002D",
                }}
              >
                CLUSTERDESK
              </h1>

              <div className="checkered" aria-hidden="true">
                {Array.from({ length: 16 }, (_, i) => {
                  const row = Math.floor(i / 8);
                  const col = i % 8;
                  const isBlack = (row + col) % 2 === 0;
                  return (
                    <div
                      key={i}
                      className="checkered-cell"
                      style={{ background: isBlack ? "#fff" : "#000" }}
                    />
                  );
                })}
              </div>
            </div>

            <p
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(9px, 1.4vw, 12px)",
                letterSpacing: "0.35em",
                color: "#C0C0C0",
                textTransform: "uppercase",
              }}
            >
              INSIDER CLUSTER INTELLIGENCE — PIT WALL LIVE FEED
            </p>

            {/* DRS indicator */}
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div className="drs-badge">
                DRS OPEN
              </div>
              <span
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  color: "#C0C0C0",
                }}
              >
                HIGH CONVICTION SIGNAL ACTIVE
              </span>
            </div>
          </div>
        </header>

        {/* ── SAFETY CAR TELEMETRY BAR ── */}
        <div className="safety-car-bar">
          <span
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "#FFD700",
            }}
          >
            TELEMETRY
          </span>
          <span
            style={{
              fontFamily: "'Exo 2', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.18em",
              color: "#FFD700",
            }}
          >
            INSIDERS IN SECTOR: 3 &nbsp;|&nbsp; TRANSACTION SPEED: 5 DAYS &nbsp;|&nbsp; TOTAL LOAD: $312K &nbsp;|&nbsp; SECTORS MONITORED: 4,847
          </span>
        </div>

        {/* ── TELEMETRY STRIP ── */}
        <div className="telemetry">
          {[
            { label: "Race Leader", value: "MVST" },
            { label: "Fastest Lap", value: "1:23.487" },
            { label: "Clusters Active", value: "3" },
            { label: "Signal Strength", value: "HIGH" },
            { label: "Last Alert", value: "2H AGO" },
          ].map((t) => (
            <div key={t.label} className="tel-segment">
              <span className="tel-label">{t.label}</span>
              <span className="tel-value">{t.value}</span>
            </div>
          ))}
        </div>

        {/* ── MAIN CONTENT ── */}
        <main className="main-pad" style={{ padding: "32px 48px 64px" }}>

          {/* Section heading */}
          <div style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 4,
                height: 32,
                background: "#E8002D",
                animation: "rpm-pulse 1.5s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <div>
              <h2
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: "clamp(16px, 2.5vw, 22px)",
                  letterSpacing: "0.1em",
                  color: "#fff",
                  textTransform: "uppercase",
                }}
              >
                RACE STANDINGS — ACTIVE CLUSTER SIGNALS
              </h2>
              <p
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: 12,
                  color: "#C0C0C0",
                  letterSpacing: "0.08em",
                  marginTop: 4,
                }}
              >
                2+ executives buying their own stock at micro-cap companies within days of each other
              </p>
            </div>
          </div>

          {/* ── CLUSTER / RACE POSITION CARDS ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 52 }}>
            {CLUSTERS.map((c, i) => {
              const posColor = POSITION_COLORS[c.position] || "#C0C0C0";
              const isHovered = hoveredCard === i;
              const barWidth = `${c.score}%`;

              return (
                <div
                  key={c.ticker}
                  className={`race-card${isHovered ? " card-hover" : ""}`}
                  style={{ borderLeftColor: posColor }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="card-carbon-strip" />

                  <div style={{ padding: "20px 24px 24px" }}>
                    {/* TOP ROW */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 20,
                        flexWrap: "wrap",
                        marginBottom: 20,
                      }}
                    >
                      {/* Position number */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <span
                          className="pos-badge"
                          style={{ color: posColor }}
                        >
                          P{c.position}
                        </span>
                        {c.position === 1 && (
                          <div className="pole-badge">POLE</div>
                        )}
                        {c.position !== 1 && (
                          <span
                            style={{
                              fontFamily: "'Exo 2', sans-serif",
                              fontSize: 10,
                              fontWeight: 600,
                              letterSpacing: "0.1em",
                              color: "#555",
                            }}
                          >
                            {c.gap}
                          </span>
                        )}
                      </div>

                      {/* Ticker + company */}
                      <div style={{ flex: 1, minWidth: 140 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontFamily: "'Russo One', sans-serif",
                              fontSize: 30,
                              letterSpacing: "0.04em",
                              color: "#fff",
                              lineHeight: 1,
                            }}
                          >
                            {c.ticker}
                          </span>
                          {c.drs && (
                            <span
                              style={{
                                fontFamily: "'Exo 2', sans-serif",
                                fontSize: 9,
                                fontWeight: 700,
                                letterSpacing: "0.2em",
                                background: "#E8002D",
                                color: "#fff",
                                padding: "2px 8px",
                              }}
                            >
                              DRS
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Exo 2', sans-serif",
                            fontSize: 13,
                            fontWeight: 400,
                            color: "#C0C0C0",
                            letterSpacing: "0.03em",
                            marginTop: 4,
                          }}
                        >
                          {c.company}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Exo 2', sans-serif",
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#555",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            marginTop: 2,
                          }}
                        >
                          {c.sector}
                        </div>
                      </div>

                      {/* Lap time + score */}
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                        {/* Lap time pit board */}
                        <div className="pit-panel">
                          <span className="pit-panel-label">Lap Time</span>
                          <span className="lap-time">{c.lapTime}</span>
                        </div>

                        {/* Score pit board */}
                        <div className="pit-panel" style={{ borderColor: isHovered ? "#E8002D" : "#1e1e1e" }}>
                          <span className="pit-panel-label">Score</span>
                          <span
                            className="pit-panel-value"
                            style={{ color: isHovered ? "#E8002D" : "#fff" }}
                          >
                            {c.score}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PIT BOARD DATA ROW */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginBottom: 16,
                      }}
                    >
                      {[
                        { label: "Insiders", value: `${c.insiders} EXECS` },
                        { label: "Total Spend", value: c.amount },
                        { label: "Window", value: `${c.days} DAYS` },
                      ].map((d) => (
                        <div key={d.label} className="pit-panel">
                          <span className="pit-panel-label">{d.label}</span>
                          <span className="pit-panel-value" style={{ fontSize: 18 }}>{d.value}</span>
                        </div>
                      ))}

                      {/* Gap indicator */}
                      <div
                        className="pit-panel"
                        style={{ borderColor: c.position === 1 ? "#E8002D" : "#1e1e1e" }}
                      >
                        <span className="pit-panel-label">Gap</span>
                        <span
                          className="pit-panel-value"
                          style={{
                            fontSize: 18,
                            color: c.position === 1 ? "#E8002D" : "#C0C0C0",
                          }}
                        >
                          {c.gap}
                        </span>
                      </div>
                    </div>

                    {/* REV COUNTER / SCORE BAR */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Exo 2', sans-serif",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.25em",
                            color: "#555",
                            textTransform: "uppercase",
                          }}
                        >
                          Conviction Rev Counter
                        </span>
                        <span
                          style={{
                            fontFamily: "'Russo One', sans-serif",
                            fontSize: 11,
                            color: posColor,
                            letterSpacing: "0.1em",
                          }}
                        >
                          {c.score} / 100
                        </span>
                      </div>
                      <div className="rev-track">
                        <div
                          className="rev-fill"
                          style={{ "--bar-width": barWidth } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <hr className="f1-divider" />

          {/* ── SUBSCRIBE — TEAM RADIO ── */}
          <div style={{ maxWidth: 600 }}>
            {/* Section flag decoration */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div className="checkered" aria-hidden="true">
                {Array.from({ length: 16 }, (_, i) => {
                  const row = Math.floor(i / 8);
                  const col = i % 8;
                  const isBlack = (row + col) % 2 === 0;
                  return (
                    <div
                      key={i}
                      className="checkered-cell"
                      style={{ background: isBlack ? "#fff" : "#000" }}
                    />
                  );
                })}
              </div>
              <h2
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: "clamp(18px, 2.8vw, 26px)",
                  letterSpacing: "0.06em",
                  color: "#fff",
                  textTransform: "uppercase",
                }}
              >
                JOIN THE TEAM RADIO
              </h2>
            </div>

            <p
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 14,
                fontWeight: 400,
                color: "#C0C0C0",
                letterSpacing: "0.04em",
                lineHeight: 1.7,
                marginBottom: 12,
              }}
            >
              Get alerts direct to pit wall the moment{" "}
              <span style={{ color: "#E8002D", fontWeight: 700 }}>2+ insiders</span> buy at the same micro-cap.
              No noise. Signal only.
            </p>

            <div
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "#FFD700",
                marginBottom: 28,
                textTransform: "uppercase",
              }}
            >
              GET ALERTS DIRECT TO PIT WALL
            </div>

            {joined ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#0a1a00",
                  border: "1px solid #2a5f00",
                  padding: "18px 24px",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#4cff00",
                    boxShadow: "0 0 8px #4cff00",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Russo One', sans-serif",
                    fontSize: 14,
                    letterSpacing: "0.18em",
                    color: "#4cff00",
                    textTransform: "uppercase",
                  }}
                >
                  TEAM RADIO OPEN — ALERTS ACTIVATED
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}
              >
                <label
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    color: "#555",
                    textTransform: "uppercase",
                  }}
                >
                  DRIVER EMAIL ADDRESS
                </label>
                <div style={{ display: "flex", width: "100%", maxWidth: 460 }}>
                  <input
                    type="email"
                    required
                    className="pit-wall-input"
                    placeholder="you@team.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="pit-wall-btn">
                    RADIO IN
                  </button>
                </div>
                <p
                  style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: 10,
                    color: "#444",
                    letterSpacing: "0.12em",
                  }}
                >
                  FREE &nbsp;·&nbsp; NO SPAM &nbsp;·&nbsp; UNSUBSCRIBE ANYTIME
                </p>
              </form>
            )}
          </div>

          <hr className="f1-divider" />

          {/* ── FOOTER ── */}
          <footer
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="checkered" aria-hidden="true">
                {Array.from({ length: 16 }, (_, i) => {
                  const row = Math.floor(i / 8);
                  const col = i % 8;
                  const isBlack = (row + col) % 2 === 0;
                  return (
                    <div
                      key={i}
                      className="checkered-cell"
                      style={{ background: isBlack ? "#333" : "#111" }}
                    />
                  );
                })}
              </div>
              <span
                style={{
                  fontFamily: "'Russo One', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "#444",
                  textTransform: "uppercase",
                }}
              >
                CLUSTERDESK
              </span>
              <span
                style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  color: "#333",
                  letterSpacing: "0.1em",
                }}
              >
                NOT INVESTMENT ADVICE &nbsp;·&nbsp; SEC FORM 4 DATA
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: 9,
                fontWeight: 600,
                color: "#2a2a2a",
                letterSpacing: "0.15em",
              }}
            >
              SECTOR DATA LIVE &nbsp;·&nbsp; LAP 47 / 58
            </span>
          </footer>
        </main>
      </div>
    </>
  );
}
