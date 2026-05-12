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
    sector: "ENERGY STORAGE",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    amount: "$88K",
    level: "HIGH",
    sector: "ACCESSIBILITY TECH",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    amount: "$47K",
    level: "ELEVATED",
    sector: "DIGITAL MEDIA",
  },
];

const LEVEL_COLORS: Record<string, string> = {
  CRITICAL: "#FF71CE",
  HIGH: "#01CDFE",
  ELEVATED: "#B967FF",
};

export default function VaporwavePage() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Rajdhani:wght@400;500;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          overflow-x: hidden;
        }

        @keyframes bgPulse {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes scanlines {
          0%   { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        @keyframes gradientText {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes sunStripe {
          0%   { opacity: 1; }
          50%  { opacity: 0.6; }
          100% { opacity: 1; }
        }

        @keyframes gridScroll {
          0%   { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }

        @keyframes floatPalm {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-8px) rotate(2deg); }
        }

        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 10px #FF71CE, 0 0 20px #FF71CE, 0 0 40px #FF71CE; }
          50%       { text-shadow: 0 0 5px #B967FF, 0 0 15px #B967FF, 0 0 30px #B967FF; }
        }

        @keyframes borderSpin {
          0%   { border-color: #FF71CE #01CDFE #B967FF #FF71CE; }
          25%  { border-color: #01CDFE #B967FF #FF71CE #01CDFE; }
          50%  { border-color: #B967FF #FF71CE #01CDFE #B967FF; }
          75%  { border-color: #FF71CE #01CDFE #B967FF #FF71CE; }
          100% { border-color: #FF71CE #01CDFE #B967FF #FF71CE; }
        }

        @keyframes titlebarBlink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0.4; }
        }

        .vp-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #1A0A2E 0%, #2D0A4E 30%, #3D0066 50%, #2D0A4E 70%, #1A0A2E 100%);
          background-size: 400% 400%;
          animation: bgPulse 8s ease infinite;
          font-family: 'Rajdhani', sans-serif;
          color: #E8D5FF;
          position: relative;
          overflow: hidden;
        }

        /* Scanlines overlay */
        .vp-root::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.08) 2px,
            rgba(0, 0, 0, 0.08) 4px
          );
          pointer-events: none;
          z-index: 9999;
          animation: scanlines 0.1s steps(1) infinite;
        }

        .vp-hero {
          position: relative;
          text-align: center;
          padding: 60px 20px 20px;
          z-index: 1;
        }

        .vp-aesthetic-tag {
          font-family: 'VT323', monospace;
          font-size: 18px;
          letter-spacing: 0.6em;
          color: #01CDFE;
          text-transform: uppercase;
          margin-bottom: 12px;
          opacity: 0.85;
        }

        .vp-logo {
          font-family: 'VT323', monospace;
          font-size: clamp(40px, 8vw, 80px);
          letter-spacing: 0.15em;
          background: linear-gradient(90deg, #FF71CE, #01CDFE, #B967FF, #FF71CE);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientText 4s ease infinite;
        }

        .vp-tagline {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.25em;
          color: #B967FF;
          margin-top: 8px;
          text-transform: uppercase;
        }

        /* Retro Sun */
        .vp-sun-wrap {
          display: flex;
          justify-content: center;
          margin: 28px 0 0;
          position: relative;
          z-index: 1;
        }

        .vp-sun {
          width: 160px;
          height: 80px;
          border-radius: 80px 80px 0 0;
          overflow: hidden;
          position: relative;
          box-shadow: 0 0 40px rgba(255, 113, 206, 0.5), 0 0 80px rgba(255, 113, 206, 0.2);
        }

        .vp-sun-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            #FFD700 0%,
            #FF8C00 15%,
            #FF4500 30%,
            #FF1493 45%,
            #C71585 60%,
            #8B0057 75%,
            #4B0082 100%
          );
        }

        .vp-sun-stripe {
          position: absolute;
          left: 0;
          right: 0;
          background: #1A0A2E;
          animation: sunStripe 2s ease-in-out infinite;
        }

        .vp-sun-stripe:nth-child(2)  { bottom: 0px;  height: 7px; }
        .vp-sun-stripe:nth-child(3)  { bottom: 13px; height: 6px; }
        .vp-sun-stripe:nth-child(4)  { bottom: 25px; height: 6px; }
        .vp-sun-stripe:nth-child(5)  { bottom: 37px; height: 5px; }
        .vp-sun-stripe:nth-child(6)  { bottom: 48px; height: 5px; }
        .vp-sun-stripe:nth-child(7)  { bottom: 58px; height: 4px; }

        /* Perspective grid floor */
        .vp-grid-floor {
          width: 100%;
          height: 140px;
          position: relative;
          overflow: hidden;
          margin-top: -1px;
        }

        .vp-grid-floor-inner {
          position: absolute;
          bottom: 0;
          left: -50%;
          width: 200%;
          height: 300px;
          background-image:
            linear-gradient(rgba(255, 113, 206, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 113, 206, 0.4) 1px, transparent 1px);
          background-size: 60px 60px;
          transform: perspective(300px) rotateX(60deg);
          transform-origin: center top;
          animation: gridScroll 2s linear infinite;
        }

        /* Palm trees */
        .vp-palms {
          display: flex;
          justify-content: space-between;
          padding: 0 40px;
          margin-top: -80px;
          position: relative;
          z-index: 2;
          pointer-events: none;
        }

        .vp-palm {
          font-size: 64px;
          line-height: 1;
          filter: drop-shadow(0 0 12px rgba(1, 205, 254, 0.6));
          animation: floatPalm 4s ease-in-out infinite;
        }

        .vp-palm:nth-child(2) {
          animation-delay: 2s;
        }

        /* Content section */
        .vp-content {
          position: relative;
          z-index: 3;
          max-width: 900px;
          margin: 0 auto;
          padding: 20px 20px 60px;
        }

        .vp-section-label {
          font-family: 'VT323', monospace;
          font-size: 22px;
          letter-spacing: 0.4em;
          color: #01CDFE;
          text-align: center;
          margin-bottom: 24px;
          text-shadow: 0 0 10px #01CDFE;
        }

        /* Win95-style card */
        .vp-card {
          margin-bottom: 20px;
          border: 2px solid #FF71CE;
          border-radius: 0;
          background: rgba(26, 10, 46, 0.85);
          backdrop-filter: blur(10px);
          transition: box-shadow 0.2s, border-color 0.2s;
          position: relative;
          overflow: hidden;
        }

        .vp-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,113,206,0.05) 0%, rgba(1,205,254,0.05) 100%);
          pointer-events: none;
        }

        .vp-card-hovered {
          box-shadow: 0 0 20px rgba(255, 113, 206, 0.5), 0 0 40px rgba(1, 205, 254, 0.2);
          border-color: #01CDFE;
        }

        .vp-titlebar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(90deg, #4B0082, #7B00C2, #4B0082);
          padding: 5px 8px;
          user-select: none;
        }

        .vp-titlebar-text {
          font-family: 'VT323', monospace;
          font-size: 16px;
          color: #E8D5FF;
          letter-spacing: 0.1em;
          animation: titlebarBlink 6s ease infinite;
        }

        .vp-titlebar-buttons {
          display: flex;
          gap: 4px;
        }

        .vp-titlebar-btn {
          width: 14px;
          height: 14px;
          border: 1px solid rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #E8D5FF;
          background: rgba(75, 0, 130, 0.8);
          cursor: default;
          font-family: monospace;
        }

        .vp-card-body {
          padding: 16px 20px;
        }

        .vp-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .vp-ticker {
          font-family: 'VT323', monospace;
          font-size: 42px;
          line-height: 1;
          background: linear-gradient(90deg, #FF71CE, #B967FF);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientText 3s ease infinite;
        }

        .vp-company {
          font-size: 13px;
          font-weight: 500;
          color: #B967FF;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 2px;
        }

        .vp-sector {
          font-size: 11px;
          font-weight: 400;
          color: rgba(185, 103, 255, 0.6);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .vp-score-block {
          text-align: right;
        }

        .vp-score-label {
          font-family: 'VT323', monospace;
          font-size: 12px;
          letter-spacing: 0.3em;
          color: #01CDFE;
        }

        .vp-score-value {
          font-family: 'VT323', monospace;
          font-size: 56px;
          line-height: 1;
          color: #05FFA1;
          text-shadow: 0 0 10px #05FFA1, 0 0 20px rgba(5, 255, 161, 0.5);
        }

        .vp-level-badge {
          display: inline-block;
          font-family: 'VT323', monospace;
          font-size: 14px;
          letter-spacing: 0.2em;
          padding: 2px 10px;
          margin-top: 4px;
          border-width: 1px;
          border-style: solid;
        }

        .vp-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #FF71CE, #01CDFE, transparent);
          margin: 12px 0;
          opacity: 0.5;
        }

        .vp-meta {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .vp-meta-item {
          display: flex;
          flex-direction: column;
        }

        .vp-meta-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: rgba(232, 213, 255, 0.5);
          text-transform: uppercase;
        }

        .vp-meta-value {
          font-family: 'VT323', monospace;
          font-size: 22px;
          color: #01CDFE;
          text-shadow: 0 0 8px rgba(1, 205, 254, 0.4);
        }

        /* Progress bar */
        .vp-progress-track {
          width: 100%;
          height: 6px;
          background: rgba(185, 103, 255, 0.2);
          margin-top: 14px;
          position: relative;
          overflow: hidden;
        }

        .vp-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF71CE, #01CDFE);
          position: relative;
          transition: width 0.5s ease;
        }

        .vp-progress-fill::after {
          content: '';
          position: absolute;
          right: 0;
          top: -2px;
          width: 4px;
          height: 10px;
          background: #fff;
          box-shadow: 0 0 6px #FF71CE;
        }

        /* Subscribe section */
        .vp-subscribe {
          text-align: center;
          margin-top: 40px;
          padding: 32px 20px;
          border: 1px solid rgba(255, 113, 206, 0.3);
          background: rgba(26, 10, 46, 0.6);
          position: relative;
          overflow: hidden;
        }

        .vp-subscribe::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, rgba(255,113,206,0.05), rgba(1,205,254,0.05), rgba(185,103,255,0.05));
          background-size: 200% 200%;
          animation: bgPulse 6s ease infinite;
        }

        .vp-subscribe-heading {
          font-family: 'VT323', monospace;
          font-size: 28px;
          letter-spacing: 0.3em;
          color: #E8D5FF;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }

        .vp-subscribe-sub {
          font-size: 13px;
          font-weight: 400;
          color: rgba(185, 103, 255, 0.8);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }

        .vp-subscribe-row {
          display: flex;
          justify-content: center;
          gap: 0;
          max-width: 480px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .vp-email-input {
          flex: 1;
          padding: 12px 16px;
          background: rgba(26, 10, 46, 0.9);
          border: 1px solid #B967FF;
          border-right: none;
          color: #E8D5FF;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.05em;
          outline: none;
        }

        .vp-email-input::placeholder {
          color: rgba(185, 103, 255, 0.5);
          font-style: normal;
        }

        .vp-email-input:focus {
          border-color: #FF71CE;
          box-shadow: inset 0 0 10px rgba(255, 113, 206, 0.1);
        }

        .vp-cta-btn {
          padding: 12px 24px;
          background: #FF71CE;
          border: 1px solid #FF71CE;
          color: #1A0A2E;
          font-family: 'VT323', monospace;
          font-size: 18px;
          letter-spacing: 0.15em;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, box-shadow 0.2s;
        }

        .vp-cta-btn:hover {
          background: #ff9de1;
          box-shadow: 0 0 20px rgba(255, 113, 206, 0.6), 0 0 40px rgba(255, 113, 206, 0.3);
        }

        /* Footer aesthetic strip */
        .vp-footer {
          text-align: center;
          padding: 20px;
          font-family: 'VT323', monospace;
          font-size: 14px;
          letter-spacing: 0.5em;
          color: rgba(185, 103, 255, 0.4);
          position: relative;
          z-index: 3;
        }

        .vp-footer-gradient {
          background: linear-gradient(90deg, #FF71CE, #01CDFE, #B967FF, #05FFA1, #FF71CE);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientText 5s ease infinite;
        }

        .vp-glitch-text {
          position: relative;
          display: inline-block;
        }
      `}</style>

      <div className="vp-root">
        {/* Hero */}
        <div className="vp-hero">
          <div className="vp-aesthetic-tag">Ａ Ｅ Ｓ Ｔ Ｈ Ｅ Ｔ Ｉ Ｃ</div>
          <div className="vp-logo">ＣＬＵＳＴＥＲＤＥＳＫ</div>
          <div className="vp-tagline">
            1997 Corporate Japan meets Miami Vice&nbsp;·&nbsp;Insider cluster intelligence
          </div>
        </div>

        {/* Retro Sun */}
        <div className="vp-sun-wrap">
          <div className="vp-sun">
            <div className="vp-sun-gradient" />
            <div className="vp-sun-stripe" />
            <div className="vp-sun-stripe" />
            <div className="vp-sun-stripe" />
            <div className="vp-sun-stripe" />
            <div className="vp-sun-stripe" />
            <div className="vp-sun-stripe" />
          </div>
        </div>

        {/* Grid floor */}
        <div className="vp-grid-floor">
          <div className="vp-grid-floor-inner" />
        </div>

        {/* Palm trees */}
        <div className="vp-palms">
          <div className="vp-palm">🌴</div>
          <div className="vp-palm">🌴</div>
        </div>

        {/* Alert cards */}
        <div className="vp-content">
          <div className="vp-section-label">// CLUSTER ALERTS //</div>

          {CLUSTERS.map((c, i) => (
            <div
              key={c.ticker}
              className={`vp-card${hovered === i ? " vp-card-hovered" : ""}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Windows 95-style title bar */}
              <div className="vp-titlebar">
                <span className="vp-titlebar-text">
                  {c.ticker}.EXE — INSIDER ALERT v1.0
                </span>
                <div className="vp-titlebar-buttons">
                  <div className="vp-titlebar-btn">_</div>
                  <div className="vp-titlebar-btn">□</div>
                  <div className="vp-titlebar-btn">✕</div>
                </div>
              </div>

              <div className="vp-card-body">
                <div className="vp-card-top">
                  <div>
                    <div className="vp-ticker">{c.ticker}</div>
                    <div className="vp-company">{c.company}</div>
                    <div className="vp-sector">{c.sector}</div>
                    <div
                      className="vp-level-badge"
                      style={{
                        color: LEVEL_COLORS[c.level],
                        borderColor: LEVEL_COLORS[c.level],
                        boxShadow: `0 0 8px ${LEVEL_COLORS[c.level]}60`,
                      }}
                    >
                      ◆ {c.level}
                    </div>
                  </div>
                  <div className="vp-score-block">
                    <div className="vp-score-label">SIGNAL SCORE</div>
                    <div className="vp-score-value">{c.score}</div>
                  </div>
                </div>

                <div className="vp-divider" />

                <div className="vp-meta">
                  <div className="vp-meta-item">
                    <span className="vp-meta-label">Insiders</span>
                    <span className="vp-meta-value">{c.insiders}×</span>
                  </div>
                  <div className="vp-meta-item">
                    <span className="vp-meta-label">Buy Volume</span>
                    <span className="vp-meta-value">{c.amount}</span>
                  </div>
                  <div className="vp-meta-item">
                    <span className="vp-meta-label">Cluster Type</span>
                    <span className="vp-meta-value">OPEN MKT</span>
                  </div>
                </div>

                {/* Score progress bar */}
                <div className="vp-progress-track">
                  <div
                    className="vp-progress-fill"
                    style={{ width: `${c.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Subscribe */}
          <div className="vp-subscribe">
            <div className="vp-subscribe-heading">
              ｎｅｗ　ｓｉｇｎａｌｓ　ｅｖｅｒｙ　ｄａｙ
            </div>
            <div className="vp-subscribe-sub">
              Real-time cluster alerts delivered to your inbox
            </div>
            <div className="vp-subscribe-row">
              <input
                type="email"
                placeholder="your@email.com"
                className="vp-email-input"
              />
              <button className="vp-cta-btn">
                ＪＯＩＮ　ＴＨＥ　ＮＥＴＷＯＲＫ
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="vp-footer">
          <span className="vp-footer-gradient">
            ▓▒░ CLUSTERDESK · INSIDER INTELLIGENCE · MMXXVI ░▒▓
          </span>
        </div>
      </div>
    </>
  );
}
