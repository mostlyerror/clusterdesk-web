"use client";

import { useState } from "react";

const CLUSTERS = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiders: 3,
    amount: "$312K",
    level: "CRITICAL",
    days: 4,
    sector: "ENERGY STORAGE",
    change: "+18.4%",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    amount: "$88K",
    level: "HIGH",
    days: 6,
    sector: "ACCESSIBILITY TECH",
    change: "+9.2%",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    amount: "$47K",
    level: "ELEVATED",
    days: 8,
    sector: "DIGITAL MEDIA",
    change: "+5.7%",
  },
];

const LEVEL_COLORS: Record<string, string> = {
  CRITICAL: "#FF006E",
  HIGH: "#FF4D9E",
  ELEVATED: "#00F5FF",
};

export default function NeonNoirPage() {
  const [email, setEmail] = useState("");
  const [jacked, setJacked] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setJacked(true);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.4; }
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes rain {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @keyframes pulse-pink {
          0%, 100% { box-shadow: 0 0 8px #FF006E, 0 0 16px #FF006E; }
          50% { box-shadow: 0 0 20px #FF006E, 0 0 40px #FF006E, 0 0 60px #FF006E; }
        }

        @keyframes pulse-cyan {
          0%, 100% { text-shadow: 0 0 10px #00F5FF, 0 0 20px #00F5FF; }
          50% { text-shadow: 0 0 20px #00F5FF, 0 0 40px #00F5FF, 0 0 80px #00F5FF; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes glitch {
          0% { clip-path: inset(0 0 98% 0); transform: translate(-2px, 0); }
          10% { clip-path: inset(40% 0 50% 0); transform: translate(2px, 0); }
          20% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 0); }
          30% { clip-path: inset(15% 0 70% 0); transform: translate(2px, 0); }
          40% { clip-path: inset(60% 0 30% 0); transform: translate(-2px, 0); }
          50% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
          100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
        }

        @keyframes scroll-ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes neon-line-pulse {
          0%, 100% { opacity: 0.7; box-shadow: 2px 0 12px #FF006E, 4px 0 24px #FF006E; }
          50% { opacity: 1; box-shadow: 2px 0 20px #FF006E, 4px 0 40px #FF006E, 6px 0 60px #FF006E; }
        }

        .neon-noir-root {
          font-family: 'Space Mono', monospace;
          background: #000000;
          color: #ffffff;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        /* Subtle cyan grid */
        .neon-noir-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* Scanline overlay */
        .scanline-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 999;
          overflow: hidden;
        }
        .scanline-overlay::after {
          content: '';
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(0, 245, 255, 0.07);
          animation: scanline 4s linear infinite;
        }

        /* CRT scanlines static */
        .scanline-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.08) 2px,
            rgba(0, 0, 0, 0.08) 4px
          );
        }

        /* Vertical neon pink edge */
        .neon-edge {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #FF006E;
          animation: neon-line-pulse 2s ease-in-out infinite;
          z-index: 100;
        }

        /* Logo flicker */
        .logo-flicker {
          animation: flicker 5s infinite;
        }

        /* Rain strip */
        .rain-col {
          position: fixed;
          top: 0;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: rgba(0, 245, 255, 0.15);
          writing-mode: vertical-rl;
          letter-spacing: 4px;
          pointer-events: none;
          z-index: 1;
          animation: rain linear infinite;
        }

        /* Card styles */
        .cluster-card {
          background: #000;
          border: 1px solid rgba(255, 0, 110, 0.2);
          border-left: 4px solid #FF006E;
          padding: 24px 28px;
          position: relative;
          transition: all 0.2s ease;
          cursor: default;
        }
        .cluster-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255, 0, 110, 0);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .cluster-card:hover {
          border-left-color: #FF006E;
          box-shadow:
            0 0 20px rgba(255, 0, 110, 0.3),
            0 0 40px rgba(255, 0, 110, 0.15),
            inset 0 0 20px rgba(255, 0, 110, 0.05);
        }
        .cluster-card:hover::after {
          border-color: rgba(255, 0, 110, 0.4);
        }

        /* Score glow */
        .score-cyan {
          animation: pulse-cyan 3s ease-in-out infinite;
        }

        /* Button */
        .jack-in-btn {
          font-family: 'Syncopate', sans-serif;
          font-weight: 700;
          background: #FF006E;
          color: #000;
          border: none;
          padding: 14px 40px;
          font-size: 14px;
          letter-spacing: 0.15em;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }
        .jack-in-btn:hover {
          background: #000;
          color: #FF006E;
          box-shadow:
            0 0 12px #FF006E,
            0 0 24px #FF006E,
            0 0 48px rgba(255, 0, 110, 0.4);
          outline: 2px solid #FF006E;
        }

        /* Input */
        .noir-input {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          background: transparent;
          border: 1px solid rgba(0, 245, 255, 0.3);
          color: #fff;
          padding: 14px 18px;
          width: 100%;
          max-width: 340px;
          letter-spacing: 0.1em;
          outline: none;
          transition: all 0.2s ease;
        }
        .noir-input::placeholder {
          color: rgba(0, 245, 255, 0.4);
          letter-spacing: 0.1em;
        }
        .noir-input:focus {
          border-color: #00F5FF;
          box-shadow: 0 0 10px rgba(0, 245, 255, 0.2), 0 0 20px rgba(0, 245, 255, 0.1);
        }

        /* Ticker tape */
        .ticker-wrap {
          overflow: hidden;
          white-space: nowrap;
          border-top: 1px solid rgba(255, 0, 110, 0.3);
          border-bottom: 1px solid rgba(255, 0, 110, 0.3);
          padding: 8px 0;
          background: rgba(255, 0, 110, 0.04);
        }
        .ticker-content {
          display: inline-block;
          animation: scroll-ticker 30s linear infinite;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(255, 0, 110, 0.8);
          letter-spacing: 0.15em;
        }

        /* Glitch decoration */
        .glitch-deco {
          position: relative;
          display: inline-block;
        }
        .glitch-deco::before {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          color: #00F5FF;
          clip-path: inset(0 0 100% 0);
          animation: glitch 7s steps(1) infinite;
          opacity: 0.7;
        }

        /* Network status bar */
        .status-bar {
          border: 1px solid rgba(0, 245, 255, 0.2);
          background: rgba(0, 245, 255, 0.03);
          padding: 12px 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
          align-items: center;
        }

        /* Badge */
        .level-badge {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          padding: 3px 8px;
          border: 1px solid currentColor;
        }

        /* Section divider */
        .section-divider {
          border: none;
          border-top: 1px solid rgba(0, 245, 255, 0.15);
          margin: 48px 0;
        }
      `}</style>

      {/* Structural overlays */}
      <div className="scanline-overlay" aria-hidden="true" />
      <div className="neon-edge" aria-hidden="true" />

      {/* Rain columns */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="rain-col"
          aria-hidden="true"
          style={{
            left: `${8 + i * 12}%`,
            animationDuration: `${4 + i * 1.3}s`,
            animationDelay: `${i * 0.7}s`,
            fontSize: `${8 + (i % 3)}px`,
          }}
        >
          {"||||||||||||||||||||||||||||||||||||||||||||||"}
        </div>
      ))}

      <div className="neon-noir-root" style={{ position: "relative", zIndex: 2 }}>

        {/* Ticker tape */}
        <div className="ticker-wrap">
          <span className="ticker-content">
            {"  ·  MVST +18.4%  ·  CLUSTER ALERT: 3 INSIDERS  ·  AEYE +9.2%  ·  CLUSTER ALERT: 2 INSIDERS  ·  ZDGE +5.7%  ·  CLUSTER ALERT: 2 INSIDERS  ·  MONITORING 4,847 MICRO-CAPS  ·  SIGNAL STRONG  ·  LAST ALERT 2H AGO  ·  MVST +18.4%  ·  CLUSTER ALERT: 3 INSIDERS  ·  AEYE +9.2%  ·  "}
          </span>
        </div>

        {/* Header */}
        <header
          style={{
            padding: "48px 48px 32px 64px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderBottom: "1px solid rgba(255, 0, 110, 0.2)",
            position: "relative",
          }}
        >
          {/* Decorative corner element */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 32,
              right: 48,
              width: 80,
              height: 80,
              borderTop: "2px solid rgba(0, 245, 255, 0.4)",
              borderRight: "2px solid rgba(0, 245, 255, 0.4)",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 16,
              right: 48,
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              color: "rgba(0, 245, 255, 0.35)",
              letterSpacing: "0.2em",
            }}
          >
            SYS:ONLINE // NODE:4 // UPTIME:99.7%
          </div>

          <h1
            className="logo-flicker glitch-deco"
            data-text="CLUSTERDESK"
            style={{
              fontFamily: "'Syncopate', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 5vw, 56px)",
              letterSpacing: "0.25em",
              color: "#FF006E",
              textShadow: "0 0 10px #FF006E, 0 0 20px #FF006E, 0 0 40px #FF006E",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            CLUSTERDESK
          </h1>
          <p
            style={{
              fontFamily: "'Syncopate', sans-serif",
              fontSize: "clamp(8px, 1.5vw, 11px)",
              letterSpacing: "0.4em",
              color: "#00F5FF",
              textShadow: "0 0 10px #00F5FF, 0 0 20px #00F5FF",
              textTransform: "uppercase",
            }}
          >
            INSIDER INTELLIGENCE NETWORK
          </p>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#00F5FF",
                boxShadow: "0 0 6px #00F5FF, 0 0 12px #00F5FF",
                animation: "blink 1.2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: "rgba(0, 245, 255, 0.7)",
                letterSpacing: "0.2em",
              }}
            >
              LIVE
            </span>
          </div>
        </header>

        {/* Network Status Bar */}
        <div style={{ padding: "20px 48px 20px 64px" }}>
          <div className="status-bar">
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: "rgba(0, 245, 255, 0.5)",
                letterSpacing: "0.2em",
                flexShrink: 0,
              }}
            >
              NETWORK STATUS
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "#00F5FF",
                letterSpacing: "0.1em",
              }}
            >
              MONITORING{" "}
              <span style={{ color: "rgba(0, 245, 255, 0.4)" }}>████</span>
              {" "}4,847 STOCKS
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "#00F5FF",
                letterSpacing: "0.1em",
              }}
            >
              SIGNAL{" "}
              <span style={{ color: "rgba(0, 245, 255, 0.4)" }}>████████</span>
              {" "}STRONG
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "#00F5FF",
                letterSpacing: "0.1em",
              }}
            >
              LAST ALERT{" "}
              <span style={{ color: "rgba(0, 245, 255, 0.4)" }}>██</span>
              {" "}2H AGO
            </span>
          </div>
        </div>

        {/* Main content */}
        <main style={{ padding: "12px 48px 64px 64px" }}>

          {/* Section header */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 1,
                  background: "#FF006E",
                  boxShadow: "0 0 6px #FF006E",
                }}
              />
              <h2
                style={{
                  fontFamily: "'Syncopate', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.4em",
                  color: "rgba(255, 0, 110, 0.8)",
                  textTransform: "uppercase",
                }}
              >
                ACTIVE CLUSTER SIGNALS
              </h2>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "linear-gradient(90deg, rgba(255,0,110,0.4) 0%, transparent 100%)",
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.05em",
              }}
            >
              2+ executives buying within a compressed window // micro-cap universe
            </p>
          </div>

          {/* Cluster Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
            {CLUSTERS.map((c, i) => {
              const isHovered = hoveredCard === i;
              const levelColor = LEVEL_COLORS[c.level] || "#00F5FF";
              return (
                <div
                  key={c.ticker}
                  className="cluster-card"
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card top row */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 20,
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                      <span
                        style={{
                          fontFamily: "'Syncopate', sans-serif",
                          fontWeight: 700,
                          fontSize: 24,
                          color: "#FF006E",
                          textShadow: isHovered
                            ? "0 0 10px #FF006E, 0 0 20px #FF006E, 0 0 40px #FF006E"
                            : "0 0 8px rgba(255,0,110,0.6)",
                          letterSpacing: "0.1em",
                          transition: "text-shadow 0.2s ease",
                        }}
                      >
                        {c.ticker}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 12,
                          color: "rgba(255,255,255,0.5)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {c.company}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span
                        className="level-badge"
                        style={{
                          color: levelColor,
                          borderColor: levelColor,
                          boxShadow: isHovered ? `0 0 8px ${levelColor}` : "none",
                          transition: "box-shadow 0.2s ease",
                        }}
                      >
                        {c.level}
                      </span>
                      <div style={{ textAlign: "right" }}>
                        <div
                          className={isHovered ? "score-cyan" : ""}
                          style={{
                            fontFamily: "'Syncopate', sans-serif",
                            fontWeight: 700,
                            fontSize: 32,
                            color: "#00F5FF",
                            textShadow: "0 0 10px #00F5FF, 0 0 20px #00F5FF",
                            lineHeight: 1,
                          }}
                        >
                          {c.score}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 9,
                            color: "#FF006E",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            marginTop: 2,
                          }}
                        >
                          CONVICTION LEVEL
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card data grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "16px 24px",
                      paddingTop: 16,
                      borderTop: "1px solid rgba(0, 245, 255, 0.1)",
                    }}
                  >
                    {[
                      { label: "INSIDERS", value: `${c.insiders} EXECS` },
                      { label: "TOTAL SPEND", value: c.amount },
                      { label: "WINDOW", value: `${c.days}D` },
                      { label: "SECTOR", value: c.sector },
                      { label: "POST-SIGNAL", value: c.change },
                    ].map((item) => (
                      <div key={item.label}>
                        <div
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 9,
                            color: "#00F5FF",
                            letterSpacing: "0.2em",
                            marginBottom: 4,
                            opacity: 0.7,
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#fff",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card index */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 16,
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      color: "rgba(255, 0, 110, 0.2)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")} / {String(CLUSTERS.length).padStart(2, "0")}
                  </div>
                </div>
              );
            })}
          </div>

          <hr className="section-divider" />

          {/* Subscribe section */}
          <div style={{ maxWidth: 600 }}>
            <h2
              style={{
                fontFamily: "'Syncopate', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(18px, 3vw, 28px)",
                letterSpacing: "0.2em",
                color: "#fff",
                textShadow: "0 0 20px rgba(255,255,255,0.2)",
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              PLUG INTO THE GRID
            </h2>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                color: "rgba(0, 245, 255, 0.6)",
                letterSpacing: "0.05em",
                lineHeight: 1.7,
                marginBottom: 32,
              }}
            >
              Cluster alerts delivered to your terminal the moment{" "}
              <span style={{ color: "#00F5FF" }}>2+ executives</span> buy at{" "}
              the same micro-cap. No noise. Signal only.
            </p>

            {jacked ? (
              <div
                style={{
                  fontFamily: "'Syncopate', sans-serif",
                  fontSize: 14,
                  letterSpacing: "0.25em",
                  color: "#00F5FF",
                  textShadow: "0 0 10px #00F5FF, 0 0 20px #00F5FF, 0 0 40px #00F5FF",
                  padding: "20px 0",
                }}
              >
                ✓ NEURAL LINK ESTABLISHED
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <label
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    letterSpacing: "0.3em",
                    color: "rgba(0, 245, 255, 0.5)",
                  }}
                >
                  ENTER YOUR EMAIL ADDRESS
                </label>
                <div style={{ display: "flex", gap: 0, width: "100%", maxWidth: 480 }}>
                  <input
                    type="email"
                    required
                    className="noir-input"
                    placeholder="operator@corp.net"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ borderRight: "none" }}
                  />
                  <button type="submit" className="jack-in-btn">
                    JACK IN
                  </button>
                </div>
                <p
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9,
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.1em",
                  }}
                >
                  FREE // NO SPAM // DISCONNECT ANYTIME
                </p>
              </form>
            )}
          </div>

          <hr className="section-divider" />

          {/* Footer */}
          <footer
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "'Syncopate', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  color: "rgba(255, 0, 110, 0.5)",
                  textShadow: "0 0 6px rgba(255, 0, 110, 0.3)",
                }}
              >
                CLUSTERDESK
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.15)",
                  marginLeft: 16,
                  letterSpacing: "0.1em",
                }}
              >
                // NOT INVESTMENT ADVICE // SEC FORM 4 DATA //
              </span>
            </div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                color: "rgba(0, 245, 255, 0.25)",
                letterSpacing: "0.15em",
              }}
            >
              NODE_ID: CDK-{String(Math.floor(Math.random() * 9000) + 1000)}
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
