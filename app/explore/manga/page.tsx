"use client";

import React, { useState } from "react";

const stocks = [
  {
    ticker: "MVST",
    name: "Microvast Holdings",
    score: 87,
    insiders: 3,
    amount: "$312K",
    description: "Battery tech company. THREE execs loaded up in 5 days.",
    size: "large",
    onomatopoeia: "KA-CHING!!",
    sfxRotation: "-12deg",
  },
  {
    ticker: "AEYE",
    name: "AudioEye Inc",
    score: 74,
    insiders: 2,
    amount: "$88K",
    description: "Digital accessibility. Dual insider strike!",
    size: "small",
    onomatopoeia: "SWOOSH!",
    sfxRotation: "8deg",
  },
  {
    ticker: "ZDGE",
    name: "Zedge Inc",
    score: 62,
    insiders: 2,
    amount: "$47K",
    description: "Mobile content platform. Insiders move in silence.",
    size: "small",
    onomatopoeia: "BOOM!",
    sfxRotation: "-6deg",
  },
];

export default function MangaPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setJoined(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@400;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .manga-root {
          background: #ffffff;
          min-height: 100vh;
          font-family: 'Nunito', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── HALFTONE UTILITY ── */
        .halftone {
          background-color: #FFE600;
          background-image: radial-gradient(circle, #000 1.2px, transparent 1.2px);
          background-size: 8px 8px;
        }
        .halftone-red {
          background-color: #FF0000;
          background-image: radial-gradient(circle, rgba(0,0,0,0.35) 1px, transparent 1px);
          background-size: 6px 6px;
        }

        /* ── PANEL BORDERS ── */
        .panel {
          border: 5px solid #000;
          position: relative;
          overflow: hidden;
          background: #fff;
        }

        /* ── SPEED LINES ── */
        .speed-lines {
          position: absolute;
          inset: 0;
          background: repeating-conic-gradient(
            from 0deg at 50% 50%,
            rgba(0,0,0,0.06) 0deg 2deg,
            transparent 2deg 6deg
          );
          pointer-events: none;
          z-index: 0;
        }

        /* ── SPEECH BUBBLE ── */
        .speech-bubble {
          position: relative;
          background: #fff;
          border: 4px solid #000;
          border-radius: 16px;
          padding: 12px 20px;
          display: inline-block;
        }
        .speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 28px;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 20px solid #000;
        }
        .speech-bubble::before {
          content: '';
          position: absolute;
          bottom: -14px;
          left: 30px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 16px solid #fff;
          z-index: 1;
        }

        /* ── SPEECH BUBBLE RIGHT-POINTING ── */
        .bubble-right::after {
          bottom: auto;
          left: auto;
          right: -20px;
          top: 16px;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 20px solid #000;
          border-right: none;
        }
        .bubble-right::before {
          bottom: auto;
          left: auto;
          right: -13px;
          top: 18px;
          border-top: 8px solid transparent;
          border-bottom: 8px solid transparent;
          border-left: 15px solid #fff;
          border-right: none;
          border-top-color: transparent;
        }

        /* ── ACTION STAMP ── */
        .action-stamp {
          font-family: 'Bangers', cursive;
          font-size: 1rem;
          letter-spacing: 2px;
          background: #FFE600;
          border: 3px solid #000;
          padding: 4px 10px;
          transform: rotate(-3deg);
          display: inline-block;
          box-shadow: 3px 3px 0 #000;
        }

        /* ── POWER LEVEL BAR ── */
        .power-bar-bg {
          height: 18px;
          background: #eee;
          border: 3px solid #000;
          position: relative;
          overflow: hidden;
        }
        .power-bar-fill {
          height: 100%;
          background: #FF0000;
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 4px,
            rgba(255,255,255,0.25) 4px,
            rgba(255,255,255,0.25) 8px
          );
          transition: width 0.6s ease;
        }

        /* ── SFX DECORATION ── */
        .sfx {
          font-family: 'Bangers', cursive;
          font-size: 2.4rem;
          color: #FF0000;
          -webkit-text-stroke: 2px #000;
          text-shadow: 3px 3px 0 #000;
          letter-spacing: 2px;
          pointer-events: none;
          user-select: none;
        }

        /* ── TICKER BADGE ── */
        .ticker-badge {
          font-family: 'Bangers', cursive;
          font-size: 2.4rem;
          letter-spacing: 3px;
          color: #000;
          line-height: 1;
        }

        /* ── GRID ── */
        .comic-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: auto auto;
          gap: 0;
        }

        /* MVST: 2×2 */
        .panel-large {
          grid-column: span 2;
          grid-row: span 2;
          min-height: 360px;
        }
        /* AEYE: 1×1 top-right */
        .panel-small-1 {
          grid-column: 3;
          grid-row: 1;
          min-height: 180px;
        }
        /* ZDGE: 1×1 bottom-right */
        .panel-small-2 {
          grid-column: 3;
          grid-row: 2;
          min-height: 180px;
        }

        /* ── DIAGONAL DRAMA PANEL ── */
        .diagonal-panel {
          background: #000;
          position: relative;
          overflow: hidden;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 5px solid #FF0000;
          border-bottom: 5px solid #FF0000;
        }
        .diagonal-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            -45deg,
            transparent 0px,
            transparent 18px,
            rgba(255,0,0,0.12) 18px,
            rgba(255,0,0,0.12) 20px
          );
        }
        .diagonal-panel-text {
          font-family: 'Bangers', cursive;
          font-size: clamp(1.4rem, 4vw, 2.8rem);
          color: #FF0000;
          letter-spacing: 4px;
          text-align: center;
          -webkit-text-stroke: 1px #FFE600;
          text-shadow: 0 0 20px rgba(255,0,0,0.6), 4px 4px 0 #000;
          position: relative;
          z-index: 1;
          padding: 0 24px;
          line-height: 1.2;
        }

        /* ── NAV ── */
        .manga-nav {
          border-bottom: 5px solid #000;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          background: #FFE600;
          background-image: radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px);
          background-size: 8px 8px;
        }

        /* ── HERO PANEL ── */
        .hero-panel {
          min-height: 280px;
          border-bottom: 5px solid #000;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: #fff;
        }

        /* ── SUBSCRIBE PANEL ── */
        .subscribe-panel {
          border-top: 5px solid #000;
          padding: 48px 24px;
          background: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }

        .input-field {
          border: 4px solid #000;
          font-family: 'Nunito', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          padding: 10px 16px;
          outline: none;
          width: 100%;
          max-width: 340px;
        }
        .input-field:focus {
          box-shadow: 4px 4px 0 #000;
        }

        .submit-btn {
          font-family: 'Bangers', cursive;
          font-size: 1.4rem;
          letter-spacing: 2px;
          background: #FF0000;
          color: #fff;
          border: 4px solid #000;
          padding: 10px 28px;
          cursor: pointer;
          box-shadow: 4px 4px 0 #000;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .submit-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 #000;
        }
        .submit-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #000;
        }

        /* ── FOOTER ── */
        .manga-footer {
          border-top: 5px solid #000;
          background: #000;
          color: #FFE600;
          font-family: 'Bangers', cursive;
          letter-spacing: 2px;
          padding: 16px 24px;
          text-align: center;
          font-size: 0.95rem;
        }

        /* ── SCROLL HINT ── */
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        @media (max-width: 640px) {
          .comic-grid {
            grid-template-columns: 1fr;
          }
          .panel-large {
            grid-column: span 1;
            grid-row: span 1;
            min-height: 300px;
          }
          .panel-small-1, .panel-small-2 {
            grid-column: 1;
            grid-row: auto;
            min-height: 200px;
          }
        }
      `}</style>

      <div className="manga-root">

        {/* ── NAV ── */}
        <nav className="manga-nav">
          <span style={{
            fontFamily: "'Bangers', cursive",
            fontSize: "2rem",
            letterSpacing: "4px",
            color: "#000",
            lineHeight: 1,
          }}>
            CLUSTERDESK
          </span>
          <div className="action-stamp" style={{ fontSize: "0.75rem" }}>
            INSIDER INTEL
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span className="speech-bubble bubble-right" style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "0.8rem",
              color: "#000",
            }}>
              EPISODE 1
            </span>
          </div>
        </nav>

        {/* ── HERO PANEL ── */}
        <div className="hero-panel">
          <div className="speed-lines" />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            {/* Big action stamp */}
            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: "clamp(1rem, 3vw, 1.3rem)",
              letterSpacing: "6px",
              background: "#FFE600",
              backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)",
              backgroundSize: "6px 6px",
              border: "4px solid #000",
              padding: "6px 20px",
              display: "inline-block",
              transform: "rotate(-2deg)",
              boxShadow: "4px 4px 0 #000",
              marginBottom: "20px",
            }}>
              INSIDER BUY DETECTED!
            </div>

            <h1 style={{
              fontFamily: "'Bangers', cursive",
              fontSize: "clamp(2.8rem, 8vw, 6rem)",
              letterSpacing: "6px",
              color: "#000",
              lineHeight: 0.95,
              marginBottom: "8px",
              textShadow: "5px 5px 0 #FF0000",
            }}>
              THE CLUSTER<br />
              <span style={{ color: "#FF0000", textShadow: "4px 4px 0 #000" }}>STRIKES!!</span>
            </h1>

            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#000",
              maxWidth: "480px",
              margin: "16px auto 0",
              borderLeft: "5px solid #FF0000",
              paddingLeft: "12px",
              textAlign: "left",
            }}>
              When 2+ execs buy their own stock within days of each other —
              the battle manga is already written. You just have to read it.
            </p>

            {/* Onomatopoeia floating near hero */}
            <div className="sfx" style={{
              position: "absolute",
              top: "-20px",
              right: "8%",
              transform: "rotate(15deg)",
              fontSize: "3.5rem",
              opacity: 0.7,
            }}>
              ZAP!
            </div>
          </div>
        </div>

        {/* ── DIAGONAL DRAMA PANEL ── */}
        <div className="diagonal-panel">
          <div className="diagonal-panel-text">
            THREE INSIDERS BOUGHT THE SAME STOCK IN FIVE DAYS!!
          </div>
        </div>

        {/* ── COMIC PANEL GRID ── */}
        <div className="comic-grid">

          {/* ── MVST: LARGE 2×2 ── */}
          <div className="panel panel-large" style={{ padding: 0 }}>
            {/* Halftone header strip */}
            <div className="halftone" style={{
              borderBottom: "5px solid #000",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span className="ticker-badge" style={{ fontSize: "3rem" }}>MVST</span>
              <div className="action-stamp" style={{
                background: "#FF0000",
                color: "#fff",
                fontSize: "0.85rem",
                transform: "rotate(2deg)",
              }}>
                #1 THREAT
              </div>
            </div>

            <div style={{ padding: "20px 20px 16px" }}>
              {/* SFX */}
              <div className="sfx" style={{
                transform: "rotate(-12deg)",
                float: "right",
                marginLeft: "8px",
                marginTop: "-8px",
                fontSize: "2.8rem",
              }}>
                KA-CHING!!
              </div>

              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#666",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}>
                Microvast Holdings
              </div>

              {/* Power level */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{
                  fontFamily: "'Bangers', cursive",
                  fontSize: "1.6rem",
                  letterSpacing: "2px",
                  color: "#000",
                  marginBottom: "4px",
                }}>
                  CONVICTION: 87/100!!!
                </div>
                <div className="power-bar-bg">
                  <div className="power-bar-fill" style={{ width: "87%" }} />
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}>
                {[
                  { label: "INSIDERS", value: "3 WARRIORS" },
                  { label: "TOTAL BOUGHT", value: "$312K" },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    border: "4px solid #000",
                    padding: "10px 12px",
                    background: "#fff",
                    boxShadow: "3px 3px 0 #000",
                  }}>
                    <div style={{
                      fontFamily: "'Bangers', cursive",
                      fontSize: "0.85rem",
                      letterSpacing: "2px",
                      color: "#FF0000",
                    }}>
                      {stat.label}
                    </div>
                    <div style={{
                      fontFamily: "'Bangers', cursive",
                      fontSize: "1.8rem",
                      color: "#000",
                      lineHeight: 1,
                    }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Speech bubble description */}
              <div style={{ marginTop: "12px", paddingBottom: "8px" }}>
                <div className="speech-bubble" style={{ maxWidth: "100%" }}>
                  <p style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#000",
                  }}>
                    Battery tech company. THREE execs loaded up in 5 days.
                    This is not a drill. This is WAR.
                  </p>
                </div>
              </div>

              {/* Bottom yellow strip */}
              <div style={{
                marginTop: "28px",
                borderTop: "4px solid #000",
                paddingTop: "10px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <div className="halftone" style={{
                  fontFamily: "'Bangers', cursive",
                  fontSize: "0.9rem",
                  letterSpacing: "2px",
                  border: "3px solid #000",
                  padding: "4px 10px",
                  color: "#000",
                }}>
                  POWER LEVEL: 87
                </div>
                <div style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#666",
                }}>
                  CLUSTER SCORE — UPDATED TODAY
                </div>
              </div>
            </div>
          </div>

          {/* ── AEYE: SMALL 1×1 ── */}
          <div className="panel panel-small-1" style={{ padding: 0 }}>
            <div style={{
              borderBottom: "4px solid #000",
              padding: "8px 12px",
              background: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span className="ticker-badge" style={{
                color: "#FFE600",
                fontSize: "2rem",
              }}>
                AEYE
              </span>
              <div className="sfx" style={{
                fontSize: "1.5rem",
                transform: "rotate(8deg)",
                color: "#FFE600",
                textShadow: "2px 2px 0 #FF0000",
              }}>
                SWOOSH!
              </div>
            </div>
            <div style={{ padding: "12px" }}>
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "6px",
              }}>
                AudioEye Inc
              </div>
              <div style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "1.3rem",
                letterSpacing: "1px",
                marginBottom: "6px",
              }}>
                CONVICTION: 74/100!!
              </div>
              <div className="power-bar-bg" style={{ marginBottom: "10px" }}>
                <div className="power-bar-fill" style={{ width: "74%" }} />
              </div>
              <div style={{
                display: "flex",
                gap: "8px",
                fontSize: "0.8rem",
              }}>
                <div style={{
                  border: "3px solid #000",
                  padding: "4px 8px",
                  fontFamily: "'Bangers', cursive",
                  letterSpacing: "1px",
                  background: "#FFE600",
                  backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)",
                  backgroundSize: "6px 6px",
                }}>
                  2 INSIDERS
                </div>
                <div style={{
                  border: "3px solid #000",
                  padding: "4px 8px",
                  fontFamily: "'Bangers', cursive",
                  letterSpacing: "1px",
                  background: "#FF0000",
                  color: "#fff",
                }}>
                  $88K
                </div>
              </div>
            </div>
          </div>

          {/* ── ZDGE: SMALL 1×1 ── */}
          <div className="panel panel-small-2" style={{ padding: 0 }}>
            <div className="halftone-red" style={{
              borderBottom: "4px solid #000",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span className="ticker-badge" style={{
                color: "#fff",
                fontSize: "2rem",
                textShadow: "2px 2px 0 #000",
              }}>
                ZDGE
              </span>
              <div className="sfx" style={{
                fontSize: "1.5rem",
                transform: "rotate(-6deg)",
                color: "#FFE600",
                textShadow: "2px 2px 0 #000",
              }}>
                BOOM!
              </div>
            </div>
            <div style={{ padding: "12px" }}>
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "6px",
              }}>
                Zedge Inc
              </div>
              <div style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "1.3rem",
                letterSpacing: "1px",
                marginBottom: "6px",
              }}>
                CONVICTION: 62/100!
              </div>
              <div className="power-bar-bg" style={{ marginBottom: "10px" }}>
                <div className="power-bar-fill" style={{ width: "62%", background: "#000" }} />
              </div>
              <div style={{
                display: "flex",
                gap: "8px",
                fontSize: "0.8rem",
              }}>
                <div style={{
                  border: "3px solid #000",
                  padding: "4px 8px",
                  fontFamily: "'Bangers', cursive",
                  letterSpacing: "1px",
                  background: "#fff",
                  boxShadow: "2px 2px 0 #000",
                }}>
                  2 INSIDERS
                </div>
                <div style={{
                  border: "3px solid #000",
                  padding: "4px 8px",
                  fontFamily: "'Bangers', cursive",
                  letterSpacing: "1px",
                  background: "#FFE600",
                  backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)",
                  backgroundSize: "6px 6px",
                }}>
                  $47K
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS PANEL ── */}
        <div className="panel" style={{
          border: "none",
          borderTop: "5px solid #000",
          borderBottom: "5px solid #000",
          padding: "32px 24px",
          background: "#fff",
          position: "relative",
        }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              letterSpacing: "4px",
              color: "#000",
              marginBottom: "24px",
              textShadow: "3px 3px 0 #FFE600",
            }}>
              THE BATTLE RULES
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
            }}>
              {[
                { num: "01", title: "CLUSTER DETECTED", body: "2+ insiders buy within 5 days of each other." },
                { num: "02", title: "MICRO-CAP ONLY", body: "Under $300M market cap. These are the hidden arenas." },
                { num: "03", title: "SCORE CALCULATED", body: "Volume, recency, number of insiders = CONVICTION LEVEL." },
                { num: "04", title: "ALERT SENT", body: "You get the intel before the market wakes up." },
              ].map((step) => (
                <div key={step.num} style={{
                  border: "4px solid #000",
                  padding: "16px",
                  position: "relative",
                  boxShadow: "4px 4px 0 #000",
                }}>
                  <div style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "2.4rem",
                    color: "#FF0000",
                    lineHeight: 1,
                    marginBottom: "4px",
                  }}>
                    {step.num}
                  </div>
                  <div style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "1.1rem",
                    letterSpacing: "2px",
                    marginBottom: "6px",
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#444",
                    lineHeight: 1.5,
                  }}>
                    {step.body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SUBSCRIBE PANEL ── */}
        <div className="subscribe-panel">
          {/* background halftone dots */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,230,0,0.4) 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }} />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            {/* Dramatic action box */}
            <div style={{
              fontFamily: "'Bangers', cursive",
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              letterSpacing: "4px",
              color: "#000",
              textShadow: "5px 5px 0 #FF0000",
              marginBottom: "8px",
              lineHeight: 1,
            }}>
              JOIN THE ALLIANCE!
            </div>
            <div style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#000",
              marginBottom: "28px",
            }}>
              Get daily cluster buy alerts. Free. No spam. Just signal.
            </div>

            {joined ? (
              <div style={{ textAlign: "center" }}>
                <div className="halftone" style={{
                  display: "inline-block",
                  border: "5px solid #000",
                  padding: "20px 32px",
                  boxShadow: "6px 6px 0 #000",
                  transform: "rotate(-1deg)",
                }}>
                  <div style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "2.4rem",
                    letterSpacing: "3px",
                    color: "#000",
                    lineHeight: 1,
                  }}>
                    ALLIANCE JOINED!!
                  </div>
                  <div style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#000",
                    marginTop: "4px",
                  }}>
                    First episode drops tomorrow morning.
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                  maxWidth: "400px",
                  margin: "0 auto",
                }}
              >
                <div className="speech-bubble" style={{
                  marginBottom: "8px",
                  maxWidth: "320px",
                }}>
                  <p style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#000",
                  }}>
                    "I check ClusterDesk before I check the market open."
                    — Anonymous trader
                  </p>
                </div>
                <input
                  type="email"
                  className="input-field"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="submit-btn">
                  ENTER THE BATTLE →
                </button>
                <div style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "0.75rem",
                  color: "#888",
                  fontWeight: 700,
                }}>
                  Unsubscribe any time. No charge. Ever.
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="manga-footer">
          <span>CLUSTERDESK © 2026 &nbsp;·&nbsp; NOT FINANCIAL ADVICE &nbsp;·&nbsp; TO BE CONTINUED...</span>
          <div style={{
            fontFamily: "'Bangers', cursive",
            fontSize: "2rem",
            color: "#FF0000",
            letterSpacing: "4px",
            marginTop: "4px",
          }}>
            — END OF EPISODE 1 —
          </div>
        </footer>

      </div>
    </>
  );
}
