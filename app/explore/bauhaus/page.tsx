"use client";

import React, { useState } from "react";

const RED = "#FF0000";
const YELLOW = "#FFD700";
const BLUE = "#0000CC";
const BLACK = "#000000";
const WHITE = "#FFFFFF";

const alerts = [
  {
    ticker: "MVST",
    name: "Microvast Holdings",
    score: 87,
    insiders: 3,
    amount: "$312K",
    shape: "circle" as const,
    color: RED,
    textColor: WHITE,
    label: "HIGH",
  },
  {
    ticker: "AEYE",
    name: "AudioEye Inc",
    score: 74,
    insiders: 2,
    amount: "$88K",
    shape: "square" as const,
    color: BLUE,
    textColor: WHITE,
    label: "MED",
  },
  {
    ticker: "ZDGE",
    name: "Zedge Inc",
    score: 62,
    insiders: 2,
    amount: "$47K",
    shape: "triangle" as const,
    color: YELLOW,
    textColor: BLACK,
    label: "LOW",
  },
];

const stats = [
  { value: "2,847", label: "Alerts Issued", color: RED },
  { value: "94%", label: "Signal Accuracy", color: BLUE },
  { value: "18 Days", label: "Avg. Lead Time", color: YELLOW },
];

function ScoreShape({
  shape,
  score,
  color,
  textColor,
  size = 80,
}: {
  shape: "circle" | "square" | "triangle";
  score: number;
  color: string;
  textColor: string;
  size?: number;
}) {
  if (shape === "circle") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: textColor,
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 700,
            fontSize: size * 0.3,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
      </div>
    );
  }

  if (shape === "square") {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: textColor,
            fontFamily: "'Josefin Sans', sans-serif",
            fontWeight: 700,
            fontSize: size * 0.3,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
      </div>
    );
  }

  // triangle — position score over it
  const bL = size * 0.7;
  const bR = size * 0.7;
  const h = size * 1.22;
  return (
    <div
      style={{
        position: "relative",
        width: bL + bR,
        height: h,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${bL}px solid transparent`,
          borderRight: `${bR}px solid transparent`,
          borderBottom: `${h}px solid ${color}`,
        }}
      />
      <span
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: textColor,
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 700,
          fontSize: size * 0.3,
          lineHeight: 1,
        }}
      >
        {score}
      </span>
    </div>
  );
}

export default function BauhausPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: ${WHITE};
        }

        .bauhaus-root {
          font-family: 'Josefin Sans', sans-serif;
          background: ${WHITE};
          color: ${BLACK};
          min-height: 100vh;
          overflow-x: hidden;
        }

        .divider-red   { height: 8px; background: ${RED};    width: 100%; }
        .divider-yellow{ height: 8px; background: ${YELLOW}; width: 100%; }
        .divider-blue  { height: 8px; background: ${BLUE};   width: 100%; }

        /* Nav */
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          border-bottom: 3px solid ${BLACK};
        }
        .nav-logo {
          font-weight: 700;
          font-size: 18px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }
        .nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
        }
        .nav-links a {
          text-decoration: none;
          color: ${BLACK};
          font-weight: 300;
          font-size: 13px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .nav-links a:hover {
          color: ${RED};
        }
        .nav-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${RED};
        }

        /* Hero */
        .hero {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
          padding: 60px 48px;
          overflow: hidden;
        }
        .hero-shapes {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .hero-red-circle {
          position: absolute;
          top: -60px;
          right: 120px;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          background: ${RED};
          opacity: 0.92;
        }
        .hero-yellow-square {
          position: absolute;
          bottom: -40px;
          right: 40px;
          width: 220px;
          height: 220px;
          background: ${YELLOW};
        }
        .hero-blue-triangle {
          position: absolute;
          top: 30px;
          right: 420px;
          width: 0;
          height: 0;
          border-left: 80px solid transparent;
          border-right: 80px solid transparent;
          border-bottom: 140px solid ${BLUE};
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 560px;
        }
        .hero-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: ${RED};
          margin-bottom: 20px;
        }
        .hero-headline {
          font-size: clamp(42px, 6vw, 72px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .hero-headline span.accent-red    { color: ${RED};  }
        .hero-headline span.accent-blue   { color: ${BLUE}; }
        .hero-sub {
          font-size: 16px;
          font-weight: 300;
          line-height: 1.6;
          max-width: 420px;
          margin-bottom: 36px;
        }
        .hero-cta {
          display: inline-block;
          background: ${BLACK};
          color: ${WHITE};
          font-family: 'Josefin Sans', sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 16px 36px;
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .hero-cta:hover {
          background: ${RED};
        }

        /* Stat band */
        .stat-band {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 3px solid ${BLACK};
          border-bottom: 3px solid ${BLACK};
        }
        .stat-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          border-right: 3px solid ${BLACK};
        }
        .stat-cell:last-child { border-right: none; }
        .stat-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .stat-value {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-align: center;
          line-height: 1;
        }
        .stat-label {
          margin-top: 14px;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          text-align: center;
        }

        /* Alerts section */
        .alerts-section {
          padding: 72px 48px;
        }
        .section-header {
          display: flex;
          align-items: baseline;
          gap: 24px;
          margin-bottom: 48px;
        }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4em;
          text-transform: uppercase;
        }
        .section-rule {
          flex: 1;
          height: 2px;
          background: ${BLACK};
        }

        /* Asymmetric card grid */
        .card-grid {
          display: grid;
          grid-template-columns: 2fr 1.3fr 1fr;
          grid-template-rows: auto auto;
          gap: 0;
          border: 3px solid ${BLACK};
        }
        .cluster-card {
          display: flex;
          flex-direction: column;
          padding: 36px 32px;
          border-right: 3px solid ${BLACK};
          border-bottom: 3px solid ${BLACK};
          background: ${WHITE};
          transition: background 0.15s;
          cursor: pointer;
        }
        .cluster-card:last-child { border-right: none; }
        .cluster-card:nth-child(3) { border-right: none; }
        .cluster-card:hover { background: #f8f8f8; }

        .card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .card-ticker {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .card-name {
          font-size: 12px;
          font-weight: 300;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 6px;
          opacity: 0.7;
        }
        .card-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 24px;
          margin-top: auto;
        }
        .meta-item-label {
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          opacity: 0.6;
          margin-bottom: 4px;
        }
        .meta-item-value {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .card-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          margin-top: 20px;
          padding: 6px 12px;
          display: inline-block;
          align-self: flex-start;
        }

        /* Legend row */
        .legend-row {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 40px;
          padding: 20px 32px;
          border-bottom: none;
          background: #fafafa;
          border-top: 3px solid ${BLACK};
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .legend-text {
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
        }

        /* How it works */
        .how-section {
          padding: 72px 48px;
          display: grid;
          grid-template-columns: 1fr 2px 1fr 2px 1fr;
          gap: 0;
          border-top: 3px solid ${BLACK};
        }
        .how-divider { background: ${BLACK}; }
        .how-item {
          padding: 0 48px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .how-item:first-child { padding-left: 0; }
        .how-item:last-child  { padding-right: 0; }
        .how-number-shape {
          margin-bottom: 28px;
        }
        .how-step-title {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .how-step-body {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.65;
          opacity: 0.75;
        }

        /* Subscribe */
        .subscribe-section {
          background: ${RED};
          padding: 80px 48px;
          display: flex;
          align-items: center;
          gap: 80px;
        }
        .subscribe-left {
          flex: 1;
        }
        .subscribe-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: ${YELLOW};
          margin-bottom: 16px;
        }
        .subscribe-headline {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 700;
          color: ${WHITE};
          line-height: 1.05;
          text-transform: uppercase;
          letter-spacing: -0.02em;
        }
        .subscribe-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .subscribe-form {
          display: flex;
          gap: 0;
          border: 3px solid ${WHITE};
        }
        .subscribe-input {
          flex: 1;
          background: transparent;
          border: none;
          color: ${WHITE};
          font-family: 'Josefin Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.1em;
          padding: 16px 20px;
          outline: none;
        }
        .subscribe-input::placeholder { color: rgba(255,255,255,0.5); }
        .subscribe-btn {
          background: ${WHITE};
          color: ${RED};
          font-family: 'Josefin Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          border: none;
          padding: 16px 28px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .subscribe-btn:hover { background: ${YELLOW}; color: ${BLACK}; }
        .subscribe-note {
          font-size: 11px;
          font-weight: 300;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.1em;
        }
        .subscribe-success {
          font-size: 16px;
          font-weight: 700;
          color: ${WHITE};
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 20px 0;
        }

        /* Footer */
        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 48px;
          border-top: 3px solid ${BLACK};
        }
        .footer-logo {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
        .footer-shapes {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .footer-copy {
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.15em;
          opacity: 0.5;
        }

        @media (max-width: 900px) {
          .nav { padding: 16px 24px; }
          .hero { padding: 48px 24px; min-height: auto; }
          .hero-red-circle { width: 200px; height: 200px; top: -30px; right: 20px; }
          .hero-yellow-square { width: 130px; height: 130px; bottom: -20px; right: 10px; }
          .hero-blue-triangle { display: none; }
          .stat-band { grid-template-columns: 1fr; }
          .stat-cell { border-right: none; border-bottom: 3px solid ${BLACK}; }
          .stat-cell:last-child { border-bottom: none; }
          .card-grid { grid-template-columns: 1fr; }
          .cluster-card { border-right: none; }
          .cluster-card:nth-child(3) { border-right: none; }
          .alerts-section { padding: 48px 24px; }
          .how-section { grid-template-columns: 1fr; padding: 48px 24px; }
          .how-divider { display: none; }
          .how-item { padding: 0 0 40px 0; }
          .subscribe-section { flex-direction: column; gap: 40px; padding: 60px 24px; }
          .footer { padding: 24px; flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      <div className="bauhaus-root">

        {/* Nav */}
        <nav className="nav">
          <div className="nav-logo">ClusterDesk</div>
          <ul className="nav-links">
            <li><a href="#">Alerts</a></li>
            <li><a href="#">Data</a></li>
            <li><a href="#">Method</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
          <div className="nav-dot" />
        </nav>

        <div className="divider-red" />

        {/* Hero */}
        <section className="hero">
          <div className="hero-shapes">
            <div className="hero-red-circle" />
            <div className="hero-yellow-square" />
            <div className="hero-blue-triangle" />
          </div>
          <div className="hero-content">
            <p className="hero-eyebrow">Cluster Buy Intelligence</p>
            <h1 className="hero-headline">
              When<br />
              <span className="accent-red">Insiders</span><br />
              <span className="accent-blue">Move</span><br />
              Together
            </h1>
            <p className="hero-sub">
              Two or more executives buying their own company's stock within days
              of each other. At micro-caps. Before the move. Reduced to signal.
            </p>
            <a href="#alerts" className="hero-cta">View Alerts</a>
          </div>
        </section>

        <div className="divider-blue" />

        {/* Stat Band */}
        <div className="stat-band">
          {stats.map((s) => (
            <div key={s.label} className="stat-cell">
              <div
                className="stat-circle"
                style={{ backgroundColor: s.color }}
              >
                <span
                  style={{
                    color: s.color === YELLOW ? BLACK : WHITE,
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    letterSpacing: "0.03em",
                    textAlign: "center",
                    lineHeight: 1.1,
                    padding: "0 8px",
                  }}
                >
                  {s.value}
                </span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="divider-yellow" />

        {/* Alerts Section */}
        <section className="alerts-section" id="alerts">
          <div className="section-header">
            <span className="section-title">Active Cluster Alerts</span>
            <div className="section-rule" />
          </div>

          <div className="card-grid">
            {alerts.map((a) => (
              <div className="cluster-card" key={a.ticker}>
                <div className="card-top">
                  <div>
                    <div className="card-ticker">{a.ticker}</div>
                    <div className="card-name">{a.name}</div>
                  </div>
                  <ScoreShape
                    shape={a.shape}
                    score={a.score}
                    color={a.color}
                    textColor={a.textColor}
                    size={72}
                  />
                </div>
                <div className="card-meta">
                  <div>
                    <div className="meta-item-label">Insiders</div>
                    <div className="meta-item-value">{a.insiders}</div>
                  </div>
                  <div>
                    <div className="meta-item-label">Volume</div>
                    <div className="meta-item-value">{a.amount}</div>
                  </div>
                </div>
                <div
                  className="card-label"
                  style={{
                    backgroundColor: a.color,
                    color: a.textColor,
                  }}
                >
                  {a.label} SIGNAL
                </div>
              </div>
            ))}

            {/* Legend row */}
            <div className="legend-row">
              <div className="legend-item">
                <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: RED }} />
                <span className="legend-text">High Signal — Red Circle</span>
              </div>
              <div className="legend-item">
                <div style={{ width: 16, height: 16, backgroundColor: BLUE }} />
                <span className="legend-text">Med Signal — Blue Square</span>
              </div>
              <div className="legend-item">
                <div style={{
                  width: 0, height: 0,
                  borderLeft: "9px solid transparent",
                  borderRight: "9px solid transparent",
                  borderBottom: `16px solid ${YELLOW}`,
                }} />
                <span className="legend-text">Base Signal — Yellow Triangle</span>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-red" />

        {/* How It Works */}
        <section className="how-section">
          <div className="how-item">
            <div className="how-number-shape">
              <div style={{
                width: 64, height: 64,
                borderRadius: "50%",
                backgroundColor: RED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ color: WHITE, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 700, fontSize: 24 }}>1</span>
              </div>
            </div>
            <div className="how-step-title">Detect</div>
            <div className="how-step-body">
              SEC Form 4 filings are parsed in real time.
              Every executive purchase at every micro-cap is logged
              within hours of filing.
            </div>
          </div>

          <div className="how-divider" />

          <div className="how-item">
            <div className="how-number-shape">
              <div style={{
                width: 64, height: 64,
                backgroundColor: BLUE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span style={{ color: WHITE, fontFamily: "'Josefin Sans', sans-serif", fontWeight: 700, fontSize: 24 }}>2</span>
              </div>
            </div>
            <div className="how-step-title">Cluster</div>
            <div className="how-step-body">
              When two or more insiders buy within a rolling 14-day window,
              a cluster forms. The score weights recency, dollar size,
              and executive seniority.
            </div>
          </div>

          <div className="how-divider" />

          <div className="how-item">
            <div className="how-number-shape">
              <div style={{
                width: 0, height: 0,
                borderLeft: "40px solid transparent",
                borderRight: "40px solid transparent",
                borderBottom: "68px solid " + YELLOW,
              }} />
            </div>
            <div className="how-step-title" style={{ marginTop: 8 }}>Alert</div>
            <div className="how-step-body">
              Subscribers receive an immediate notification with ticker,
              score, insider count, total dollar volume, and the
              underlying filing links.
            </div>
          </div>
        </section>

        <div className="divider-yellow" />

        {/* Subscribe */}
        <section className="subscribe-section">
          <div className="subscribe-left">
            <p className="subscribe-eyebrow">Early Access</p>
            <h2 className="subscribe-headline">
              Get the<br />
              Alert<br />
              First.
            </h2>
          </div>
          <div className="subscribe-right">
            {submitted ? (
              <div className="subscribe-success">You&apos;re on the list. Watch your inbox.</div>
            ) : (
              <>
                <div className="subscribe-form">
                  <input
                    type="email"
                    className="subscribe-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && email) setSubmitted(true);
                    }}
                  />
                  <button
                    className="subscribe-btn"
                    onClick={() => { if (email) setSubmitted(true); }}
                  >
                    Subscribe
                  </button>
                </div>
                <p className="subscribe-note">
                  No noise. One alert per cluster. Unsubscribe any time.
                </p>
              </>
            )}
          </div>
        </section>

        <div className="divider-blue" />

        {/* Footer */}
        <footer className="footer">
          <div className="footer-logo">ClusterDesk</div>
          <div className="footer-shapes">
            <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: RED }} />
            <div style={{ width: 10, height: 10, backgroundColor: BLUE }} />
            <div style={{
              width: 0, height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "10px solid " + YELLOW,
            }} />
          </div>
          <div className="footer-copy">
            &copy; {new Date().getFullYear()} ClusterDesk. Not investment advice.
          </div>
        </footer>

      </div>
    </>
  );
}
