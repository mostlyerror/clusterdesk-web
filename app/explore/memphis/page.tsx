"use client";

import React, { useState } from "react";

/* ─── Data ─────────────────────────────────────────────────────────────── */
const clusters = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiders: 3,
    amount: "$312K",
    roles: "CEO + CFO + Director",
    cardBg: "#FFB3D1",   // pastel pink
    scoreBg: "#FF006E",
    scoreText: "#FFFEF0",
    tilt: "-1.5deg",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    amount: "$88K",
    roles: "CEO + Director",
    cardBg: "#B3CCFF",   // pastel blue
    scoreBg: "#0057FF",
    scoreText: "#FFFEF0",
    tilt: "1.2deg",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    amount: "$47K",
    roles: "President + Director",
    cardBg: "#FFF5A0",   // pastel yellow
    scoreBg: "#FFE600",
    scoreText: "#000000",
    tilt: "-0.8deg",
  },
] as const;

/* ─── Inline style helpers ──────────────────────────────────────────────── */
type CSSProps = React.CSSProperties;

const C = {
  pink:   "#FF006E",
  yellow: "#FFE600",
  blue:   "#0057FF",
  black:  "#000000",
  bg:     "#FFFEF0",
};

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function MemphisPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) setSubscribed(true);
  };

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Righteous:wght@400&family=Nunito:wght@400;700;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: ${C.bg}; }

        /* checkerboard strip */
        .memphis-checker {
          background-image: repeating-linear-gradient(
            45deg,
            ${C.black} 0px,   ${C.black} 10px,
            ${C.yellow} 10px, ${C.yellow} 20px
          );
          height: 24px;
          width: 100%;
        }

        /* polka dots divider */
        .memphis-dots {
          background-image: radial-gradient(${C.pink} 3px, transparent 3px);
          background-size: 24px 24px;
          background-color: ${C.bg};
          height: 48px;
          width: 100%;
        }

        /* zigzag border via clip-path on a pseudo-element — done with CSS gradient */
        .memphis-zigzag {
          background:
            linear-gradient(135deg, ${C.blue} 25%, transparent 25%) -10px 0,
            linear-gradient(225deg, ${C.blue} 25%, transparent 25%) -10px 0,
            linear-gradient( 45deg, ${C.blue} 25%, transparent 25%),
            linear-gradient(315deg, ${C.blue} 25%, ${C.bg}       25%);
          background-size: 20px 20px;
          background-color: ${C.blue};
          height: 20px;
          width: 100%;
        }

        /* triangle strip between header and cards */
        .memphis-triangles {
          display: flex;
          overflow: hidden;
          height: 40px;
          width: 100%;
        }
        .memphis-triangles span {
          display: inline-block;
          width: 0;
          height: 0;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
        }
        .memphis-triangles span.up-pink  { border-bottom: 40px solid ${C.pink}; }
        .memphis-triangles span.up-yellow{ border-bottom: 40px solid ${C.yellow}; }
        .memphis-triangles span.up-blue  { border-bottom: 40px solid ${C.blue}; }
        .memphis-triangles span.dn-pink  { border-top: 40px solid ${C.pink};   border-bottom: none; }
        .memphis-triangles span.dn-yellow{ border-top: 40px solid ${C.yellow}; border-bottom: none; }
        .memphis-triangles span.dn-blue  { border-top: 40px solid ${C.blue};   border-bottom: none; }

        /* squiggle background scatter */
        .memphis-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .memphis-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(${C.pink}44 2px, transparent 2px),
            radial-gradient(${C.blue}44 2px, transparent 2px);
          background-size: 60px 60px, 90px 90px;
          background-position: 0 0, 30px 45px;
        }

        .page-wrap {
          position: relative;
          z-index: 1;
          font-family: 'Nunito', sans-serif;
          background: transparent;
          min-height: 100vh;
          padding-bottom: 80px;
        }

        /* score diamond */
        .score-diamond {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Righteous', cursive;
          font-size: 22px;
          font-weight: 400;
          border: 3px solid ${C.black};
          transform: rotate(45deg);
          box-shadow: 4px 4px 0 ${C.black};
          flex-shrink: 0;
        }
        .score-diamond-inner {
          transform: rotate(-45deg);
          line-height: 1;
          text-align: center;
        }

        /* pill badge */
        .insider-badge {
          display: inline-block;
          background: ${C.black};
          color: ${C.yellow};
          font-family: 'Righteous', cursive;
          font-size: 11px;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 999px;
        }

        /* subscribe input */
        .subscribe-input {
          border: 3px solid ${C.black};
          background: #fff;
          font-family: 'Nunito', sans-serif;
          font-size: 16px;
          font-weight: 700;
          padding: 12px 16px;
          outline: none;
          width: 280px;
          box-shadow: 4px 4px 0 ${C.black};
        }
        .subscribe-input:focus {
          box-shadow: 6px 6px 0 ${C.pink};
        }

        .subscribe-btn {
          border: 3px solid ${C.black};
          background: ${C.pink};
          color: #fff;
          font-family: 'Righteous', cursive;
          font-size: 17px;
          letter-spacing: 0.04em;
          padding: 13px 28px;
          cursor: pointer;
          box-shadow: 6px 6px 0 ${C.black};
          transition: transform 0.08s, box-shadow 0.08s;
          white-space: nowrap;
        }
        .subscribe-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0 ${C.black};
        }
        .subscribe-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 3px 3px 0 ${C.black};
        }

        /* card hover */
        .cluster-card {
          transition: transform 0.12s, box-shadow 0.12s;
        }
        .cluster-card:hover {
          transform: translateY(-4px) rotate(var(--card-tilt, 0deg)) !important;
          box-shadow: 10px 10px 0 ${C.black} !important;
        }

        @media (max-width: 640px) {
          .cards-grid { flex-direction: column !important; align-items: center !important; }
          .cluster-card { width: 100% !important; max-width: 360px; }
          .subscribe-row { flex-direction: column !important; }
          .subscribe-input { width: 100% !important; max-width: 340px; }
        }
      `}</style>

      {/* ── Scattered bg decoration ── */}
      <div className="memphis-bg" />

      <div className="page-wrap">

        {/* ── Top checker strip ── */}
        <div className="memphis-checker" />

        {/* ── HEADER ── */}
        <header style={{
          background: C.yellow,
          borderBottom: `4px solid ${C.black}`,
          padding: "36px 24px 28px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* decorative circles in header corners */}
          <span style={{
            position: "absolute", top: 10, left: 16,
            width: 40, height: 40, borderRadius: "50%",
            background: C.pink, border: `3px solid ${C.black}`,
            display: "block",
          }} />
          <span style={{
            position: "absolute", top: 14, right: 20,
            width: 28, height: 28, borderRadius: "50%",
            background: C.blue, border: `3px solid ${C.black}`,
            display: "block",
          }} />
          <span style={{
            position: "absolute", bottom: 8, left: "50%",
            transform: "translateX(-50%)",
            width: 16, height: 16, borderRadius: "50%",
            background: C.black,
            display: "block",
          }} />

          {/* lightning bolt accent */}
          <span style={{
            position: "absolute", top: 8, left: "50%",
            marginLeft: -80,
            fontSize: 32,
            transform: "rotate(-12deg)",
            userSelect: "none",
          }}>⚡</span>
          <span style={{
            position: "absolute", top: 8, right: "8%",
            fontSize: 28,
            transform: "rotate(8deg)",
            userSelect: "none",
          }}>⚡</span>

          <h1 style={{
            fontFamily: "'Righteous', cursive",
            fontSize: "clamp(42px, 10vw, 88px)",
            fontWeight: 400,
            color: C.black,
            textShadow: "5px 5px 0 #000, 8px 8px 0 rgba(255,0,110,0.3)",
            letterSpacing: "0.04em",
            lineHeight: 1,
            position: "relative",
          }}>
            CLUSTERDESK
          </h1>

          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(13px, 2.5vw, 18px)",
            color: C.black,
            marginTop: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            position: "relative",
          }}>
            🔥 Insider Cluster Buy Alerts — When Execs Buy Together
          </p>
        </header>

        {/* ── Zigzag strip ── */}
        <div className="memphis-zigzag" />

        {/* ── Triangle strip ── */}
        <div className="memphis-triangles" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, i) => {
            const colors = ["up-pink", "up-yellow", "up-blue", "dn-pink", "dn-yellow", "dn-blue"] as const;
            return <span key={i} className={colors[i % colors.length]} />;
          })}
        </div>

        {/* ── Sub-headline ── */}
        <div style={{ textAlign: "center", padding: "32px 24px 8px", position: "relative" }}>
          <span style={{
            display: "inline-block",
            background: C.blue,
            color: "#fff",
            fontFamily: "'Righteous', cursive",
            fontSize: "clamp(13px, 2vw, 16px)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "6px 20px",
            border: `3px solid ${C.black}`,
            boxShadow: `4px 4px 0 ${C.black}`,
            transform: "rotate(-1deg)",
          }}>
            Live Cluster Signals — Micro-Cap Stocks
          </span>
        </div>

        {/* ── Cards grid ── */}
        <div
          className="cards-grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            justifyContent: "center",
            padding: "40px 24px",
          }}
        >
          {clusters.map((c) => (
            <div
              key={c.ticker}
              className="cluster-card"
              style={{
                "--card-tilt": c.tilt,
                background: c.cardBg,
                border: `3px solid ${C.black}`,
                boxShadow: `6px 6px 0 ${C.black}`,
                borderRadius: 4,
                padding: "28px 24px 24px",
                width: 300,
                transform: `rotate(${c.tilt})`,
                position: "relative",
              } as CSSProps}
            >
              {/* corner decoration */}
              <span style={{
                position: "absolute",
                top: -1, right: -1,
                width: 0, height: 0,
                borderTop: `32px solid ${C.black}`,
                borderLeft: "32px solid transparent",
              }} />

              {/* top row: ticker + score diamond */}
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 16,
              }}>
                <div>
                  <div style={{
                    fontFamily: "'Righteous', cursive",
                    fontSize: 34,
                    color: C.black,
                    lineHeight: 1,
                    letterSpacing: "0.04em",
                  }}>
                    {c.ticker}
                  </div>
                  <div style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: C.black,
                    opacity: 0.75,
                    marginTop: 2,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}>
                    {c.company}
                  </div>
                </div>

                <div className="score-diamond" style={{ background: c.scoreBg }}>
                  <div className="score-diamond-inner" style={{ color: c.scoreText }}>
                    <div style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.1 }}>{c.score}</div>
                    <div style={{ fontSize: 9, letterSpacing: "0.08em", fontFamily: "'Nunito',sans-serif", fontWeight: 900 }}>SCORE</div>
                  </div>
                </div>
              </div>

              {/* divider line */}
              <div style={{
                height: 3,
                background: `repeating-linear-gradient(90deg, ${C.black} 0, ${C.black} 8px, transparent 8px, transparent 14px)`,
                marginBottom: 16,
              }} />

              {/* stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: C.black,
                    opacity: 0.6,
                  }}>
                    Insiders
                  </span>
                  <span className="insider-badge">{c.insiders} EXECS</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: C.black,
                    opacity: 0.6,
                  }}>
                    Total Buy
                  </span>
                  <span style={{
                    fontFamily: "'Righteous', cursive",
                    fontSize: 22,
                    color: C.black,
                  }}>
                    {c.amount}
                  </span>
                </div>

                <div style={{
                  background: "rgba(0,0,0,0.07)",
                  border: `2px solid ${C.black}`,
                  borderRadius: 2,
                  padding: "6px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: 12,
                  color: C.black,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}>
                  {c.roles}
                </div>
              </div>

              {/* CTA strip */}
              <div style={{
                marginTop: 20,
                background: C.black,
                color: C.yellow,
                fontFamily: "'Righteous', cursive",
                fontSize: 12,
                letterSpacing: "0.12em",
                textAlign: "center",
                padding: "6px 0",
                borderRadius: 2,
                cursor: "pointer",
              }}>
                VIEW FULL SIGNAL →
              </div>
            </div>
          ))}
        </div>

        {/* ── Polka dots divider ── */}
        <div className="memphis-dots" />

        {/* ── How it works strip ── */}
        <div style={{
          background: C.blue,
          borderTop: `3px solid ${C.black}`,
          borderBottom: `3px solid ${C.black}`,
          padding: "28px 24px",
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
        }}>
          {[
            { icon: "👀", label: "We watch", desc: "Every SEC Form 4 filing, every day" },
            { icon: "🔗", label: "We cluster", desc: "2+ execs buying in 5 days? Flag it." },
            { icon: "🏃", label: "You move", desc: "Micro-caps move fast. Be early." },
          ].map((step, i) => (
            <div key={i} style={{
              background: C.yellow,
              border: `3px solid ${C.black}`,
              boxShadow: `5px 5px 0 ${C.black}`,
              padding: "18px 22px",
              minWidth: 180,
              textAlign: "center",
              transform: `rotate(${[-1, 1, -0.5][i]}deg)`,
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{step.icon}</div>
              <div style={{
                fontFamily: "'Righteous', cursive",
                fontSize: 18,
                color: C.black,
                marginBottom: 4,
              }}>
                {step.label}
              </div>
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                color: C.black,
                opacity: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>

        {/* ── Second checker strip ── */}
        <div className="memphis-checker" style={{ background: `repeating-linear-gradient(45deg, ${C.pink} 0, ${C.pink} 10px, ${C.bg} 10px, ${C.bg} 20px)` }} />

        {/* ── Subscribe section ── */}
        <div style={{
          padding: "56px 24px 48px",
          textAlign: "center",
          position: "relative",
        }}>
          {/* decorative shapes */}
          <span style={{
            position: "absolute", top: 24, left: "10%",
            width: 0, height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderBottom: `36px solid ${C.blue}`,
            filter: `drop-shadow(3px 3px 0 ${C.black})`,
          }} />
          <span style={{
            position: "absolute", top: 30, right: "10%",
            width: 36, height: 36,
            borderRadius: "50%",
            background: C.pink,
            border: `3px solid ${C.black}`,
            display: "block",
            boxShadow: `3px 3px 0 ${C.black}`,
          }} />
          <span style={{
            position: "absolute", bottom: 24, left: "20%",
            width: 24, height: 24,
            background: C.yellow,
            border: `3px solid ${C.black}`,
            transform: "rotate(20deg)",
            display: "block",
            boxShadow: `2px 2px 0 ${C.black}`,
          }} />

          <h2 style={{
            fontFamily: "'Righteous', cursive",
            fontSize: "clamp(28px, 6vw, 52px)",
            color: C.black,
            textShadow: `3px 3px 0 ${C.pink}`,
            marginBottom: 8,
            lineHeight: 1.1,
          }}>
            GET THE ALERT
          </h2>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: C.black,
            opacity: 0.7,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 32,
          }}>
            Free daily email — no spam, just signals
          </p>

          {subscribed ? (
            <div style={{
              display: "inline-block",
              background: C.yellow,
              border: `3px solid ${C.black}`,
              boxShadow: `6px 6px 0 ${C.black}`,
              padding: "20px 40px",
              transform: "rotate(-1deg)",
            }}>
              <p style={{
                fontFamily: "'Righteous', cursive",
                fontSize: 24,
                color: C.black,
              }}>
                🎉 YOU'RE IN! Watch your inbox.
              </p>
            </div>
          ) : (
            <div
              className="subscribe-row"
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                className="subscribe-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              />
              <button className="subscribe-btn" onClick={handleSubscribe}>
                YES, ALERT ME!
              </button>
            </div>
          )}

          <p style={{
            marginTop: 20,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            color: C.black,
            opacity: 0.45,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>
            Unsubscribe anytime · Not investment advice
          </p>
        </div>

        {/* ── Footer zigzag ── */}
        <div className="memphis-zigzag" style={{
          background:
            `linear-gradient(135deg, ${C.pink} 25%, transparent 25%) -10px 0,
             linear-gradient(225deg, ${C.pink} 25%, transparent 25%) -10px 0,
             linear-gradient( 45deg, ${C.pink} 25%, transparent 25%),
             linear-gradient(315deg, ${C.pink} 25%, ${C.bg}   25%)`,
          backgroundSize: "20px 20px",
          backgroundColor: C.pink,
        }} />

        {/* ── Footer ── */}
        <footer style={{
          background: C.black,
          color: C.yellow,
          fontFamily: "'Righteous', cursive",
          fontSize: 13,
          letterSpacing: "0.12em",
          textAlign: "center",
          padding: "18px 24px",
        }}>
          CLUSTERDESK — INSIDER INTELLIGENCE FOR THE BOLD &nbsp;⚡&nbsp; © 2024
        </footer>

      </div>
    </>
  );
}
