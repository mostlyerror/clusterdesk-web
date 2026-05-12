"use client";

import { useState } from "react";

const CLUSTERS = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiders: 3,
    amount: "$312K",
    sector: "ENERGY STORAGE",
    days: 4,
    depth: "87 FATHOMS",
    species: "APEX LUMINESCENT",
    change: "+18.4%",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    amount: "$88K",
    sector: "ACCESSIBILITY TECH",
    days: 6,
    depth: "74 FATHOMS",
    species: "DEEP BIOLUMINESCENT",
    change: "+9.2%",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    amount: "$47K",
    sector: "DIGITAL MEDIA",
    days: 8,
    depth: "62 FATHOMS",
    species: "ABYSSAL GLOW",
    change: "+5.7%",
  },
];

const SCORE_GLOW: Record<number, string> = {
  87: "#00FFD4",
  74: "#0080FF",
  62: "#8B00FF",
};

export default function DeepSeaPage() {
  const [email, setEmail] = useState("");
  const [descended, setDescended] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setDescended(true);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;700;900&family=Outfit:wght@300;400;500;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #020B18;
        }

        .deep-sea-root {
          min-height: 100vh;
          background: #020B18;
          font-family: 'Outfit', sans-serif;
          color: #C8E8FF;
          position: relative;
          overflow-x: hidden;
        }

        /* Depth background gradients */
        .deep-sea-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 30%, rgba(0,128,255,0.10) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(139,0,255,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 10%, rgba(0,255,212,0.06) 0%, transparent 40%),
            radial-gradient(ellipse at 10% 80%, rgba(0,128,255,0.07) 0%, transparent 45%);
          pointer-events: none;
          z-index: 0;
        }

        /* Floating bioluminescent particles */
        .particles {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          animation: drift linear infinite;
        }

        .particle:nth-child(1) {
          width: 4px; height: 4px;
          background: #00FFD4;
          box-shadow: 0 0 8px 3px rgba(0,255,212,0.7);
          left: 12%;
          animation-duration: 18s;
          animation-delay: 0s;
          bottom: -10px;
        }
        .particle:nth-child(2) {
          width: 3px; height: 3px;
          background: #0080FF;
          box-shadow: 0 0 8px 3px rgba(0,128,255,0.7);
          left: 35%;
          animation-duration: 24s;
          animation-delay: -5s;
          bottom: -10px;
        }
        .particle:nth-child(3) {
          width: 5px; height: 5px;
          background: #8B00FF;
          box-shadow: 0 0 10px 4px rgba(139,0,255,0.6);
          left: 58%;
          animation-duration: 20s;
          animation-delay: -9s;
          bottom: -10px;
        }
        .particle:nth-child(4) {
          width: 3px; height: 3px;
          background: #00FFD4;
          box-shadow: 0 0 7px 2px rgba(0,255,212,0.6);
          left: 72%;
          animation-duration: 28s;
          animation-delay: -3s;
          bottom: -10px;
        }
        .particle:nth-child(5) {
          width: 4px; height: 4px;
          background: #0080FF;
          box-shadow: 0 0 9px 3px rgba(0,128,255,0.5);
          left: 88%;
          animation-duration: 22s;
          animation-delay: -14s;
          bottom: -10px;
        }
        .particle:nth-child(6) {
          width: 2px; height: 2px;
          background: #00FFD4;
          box-shadow: 0 0 6px 2px rgba(0,255,212,0.8);
          left: 47%;
          animation-duration: 16s;
          animation-delay: -7s;
          bottom: -10px;
        }

        @keyframes drift {
          0% {
            transform: translateY(0) translateX(0px);
            opacity: 0;
          }
          5% { opacity: 1; }
          90% { opacity: 0.8; }
          100% {
            transform: translateY(-105vh) translateX(30px);
            opacity: 0;
          }
        }

        /* Wave animation */
        .wave-container {
          position: relative;
          width: 100%;
          height: 80px;
          overflow: hidden;
          z-index: 2;
        }

        .wave-svg {
          position: absolute;
          bottom: 0;
          width: 200%;
          animation: waveScroll 8s linear infinite;
        }

        .wave-svg.wave2 {
          animation: waveScroll 12s linear infinite reverse;
          opacity: 0.4;
        }

        @keyframes waveScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Card pulse glow animation */
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(0,255,212,0.15),
              0 0 40px rgba(0,255,212,0.05),
              inset 0 0 20px rgba(0,255,212,0.03),
              0 1px 0 rgba(0,255,212,0.2) inset;
          }
          50% {
            box-shadow:
              0 0 35px rgba(0,255,212,0.30),
              0 0 70px rgba(0,255,212,0.10),
              inset 0 0 30px rgba(0,255,212,0.06),
              0 1px 0 rgba(0,255,212,0.3) inset;
          }
        }

        @keyframes pulseGlowBlue {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(0,128,255,0.15),
              0 0 40px rgba(0,128,255,0.05),
              inset 0 0 20px rgba(0,128,255,0.03),
              0 1px 0 rgba(0,128,255,0.2) inset;
          }
          50% {
            box-shadow:
              0 0 35px rgba(0,128,255,0.30),
              0 0 70px rgba(0,128,255,0.10),
              inset 0 0 30px rgba(0,128,255,0.06),
              0 1px 0 rgba(0,128,255,0.3) inset;
          }
        }

        @keyframes pulseGlowViolet {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(139,0,255,0.15),
              0 0 40px rgba(139,0,255,0.05),
              inset 0 0 20px rgba(139,0,255,0.03),
              0 1px 0 rgba(139,0,255,0.2) inset;
          }
          50% {
            box-shadow:
              0 0 35px rgba(139,0,255,0.30),
              0 0 70px rgba(139,0,255,0.10),
              inset 0 0 30px rgba(139,0,255,0.06),
              0 1px 0 rgba(139,0,255,0.3) inset;
          }
        }

        @keyframes ringPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes sonarPing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        @keyframes scanLine {
          0% { top: 0%; }
          100% { top: 100%; }
        }

        @keyframes glowPulseText {
          0%, 100% {
            text-shadow: 0 0 10px #00FFD4, 0 0 20px #00FFD4, 0 0 40px rgba(0,255,212,0.5);
          }
          50% {
            text-shadow: 0 0 20px #00FFD4, 0 0 40px #00FFD4, 0 0 80px rgba(0,255,212,0.8);
          }
        }

        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.7; }
          97% { opacity: 1; }
          98% { opacity: 0.5; }
          99% { opacity: 1; }
        }

        .cluster-card {
          position: relative;
          border-radius: 12px;
          padding: 28px;
          cursor: pointer;
          transition: transform 0.3s ease;
          background: rgba(4, 20, 40, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0,255,212,0.15);
        }

        .cluster-card:hover {
          transform: translateY(-4px);
        }

        .cluster-card.teal {
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .cluster-card.blue {
          animation: pulseGlowBlue 4s ease-in-out infinite;
          border-color: rgba(0,128,255,0.15);
        }

        .cluster-card.violet {
          animation: pulseGlowViolet 4s ease-in-out infinite;
          border-color: rgba(139,0,255,0.15);
        }

        .cluster-card.hovered.teal {
          box-shadow:
            0 0 50px rgba(0,255,212,0.4),
            0 0 100px rgba(0,255,212,0.15),
            inset 0 0 40px rgba(0,255,212,0.08) !important;
        }
        .cluster-card.hovered.blue {
          box-shadow:
            0 0 50px rgba(0,128,255,0.4),
            0 0 100px rgba(0,128,255,0.15),
            inset 0 0 40px rgba(0,128,255,0.08) !important;
        }
        .cluster-card.hovered.violet {
          box-shadow:
            0 0 50px rgba(139,0,255,0.4),
            0 0 100px rgba(139,0,255,0.15),
            inset 0 0 40px rgba(139,0,255,0.08) !important;
        }

        .score-ring {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
        }

        .score-ring svg {
          transform: rotate(-90deg);
        }

        .score-ring .score-value {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Exo 2', sans-serif;
          font-weight: 700;
          font-size: 20px;
          animation: glowPulseText 3s ease-in-out infinite;
        }

        .sonar-ping {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid currentColor;
          animation: sonarPing 2.5s ease-out infinite;
          opacity: 0;
        }

        .label-tag {
          font-family: 'Outfit', sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.15em;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .metric-box {
          background: rgba(4, 20, 40, 0.6);
          border-radius: 8px;
          padding: 10px 14px;
          border: 1px solid rgba(26, 58, 74, 0.8);
        }

        .metric-label {
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #4A7A9B;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .metric-value {
          font-family: 'Exo 2', sans-serif;
          font-size: 15px;
          font-weight: 600;
        }

        .subscribe-input {
          background: rgba(4, 20, 40, 0.8);
          border: 1px solid rgba(0,255,212,0.25);
          border-radius: 8px;
          padding: 14px 18px;
          color: #C8E8FF;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .subscribe-input:focus {
          border-color: rgba(0,255,212,0.6);
          box-shadow: 0 0 20px rgba(0,255,212,0.15);
        }

        .subscribe-input::placeholder {
          color: #2A5A6A;
        }

        .descend-btn {
          background: linear-gradient(135deg, rgba(0,255,212,0.15), rgba(0,128,255,0.15));
          border: 1px solid rgba(0,255,212,0.4);
          border-radius: 8px;
          padding: 14px 28px;
          color: #00FFD4;
          font-family: 'Exo 2', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .descend-btn:hover {
          background: linear-gradient(135deg, rgba(0,255,212,0.25), rgba(0,128,255,0.25));
          box-shadow: 0 0 30px rgba(0,255,212,0.3), 0 0 60px rgba(0,255,212,0.1);
          border-color: rgba(0,255,212,0.7);
        }

        .scanline-container {
          position: relative;
          overflow: hidden;
        }

        .scanline-container::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,255,212,0.15), transparent);
          animation: scanLine 6s linear infinite;
        }

        .depth-meter {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Exo 2', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #4A7A9B;
        }

        .depth-bar {
          height: 3px;
          border-radius: 2px;
          background: linear-gradient(90deg, #00FFD4, #0080FF);
          position: relative;
          overflow: visible;
        }

        .depth-bar::after {
          content: '';
          position: absolute;
          right: -2px;
          top: -3px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00FFD4;
          box-shadow: 0 0 8px 3px rgba(0,255,212,0.8);
        }
      `}</style>

      <div className="deep-sea-root">
        {/* Floating bioluminescent particles */}
        <div className="particles">
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
          <div className="particle" />
        </div>

        {/* Wave animation at top */}
        <div className="wave-container">
          <svg className="wave-svg" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: "80px" }}>
            <path
              d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,0 1440,40 L1440,80 L0,80 Z"
              fill="rgba(0,255,212,0.04)"
            />
          </svg>
          <svg className="wave-svg wave2" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: "80px" }}>
            <path
              d="M0,30 C200,70 400,10 600,30 C800,50 1000,10 1200,35 C1300,47 1380,20 1440,30 L1440,80 L0,80 Z"
              fill="rgba(0,128,255,0.06)"
            />
          </svg>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", paddingTop: "48px", paddingBottom: "56px" }}>
            {/* Transmission tag */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(0,255,212,0.06)",
              border: "1px solid rgba(0,255,212,0.2)",
              borderRadius: "100px",
              padding: "6px 16px",
              marginBottom: "32px",
            }}>
              <div style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: "#00FFD4",
                boxShadow: "0 0 8px 3px rgba(0,255,212,0.8)",
                animation: "ringPulse 2s ease-in-out infinite",
              }} />
              <span style={{
                fontFamily: "'Exo 2', sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.25em",
                color: "#00FFD4",
                textTransform: "uppercase" as const,
              }}>
                TRANSMISSION FROM 3,000M BELOW
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "clamp(36px, 7vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#E8F8FF",
              marginBottom: "8px",
              textShadow: "0 0 60px rgba(0,255,212,0.2)",
            }}>
              CLUSTER
            </h1>
            <h1 style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "clamp(36px, 7vw, 72px)",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              background: "linear-gradient(90deg, #00FFD4, #0080FF, #8B00FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "24px",
              animation: "glowPulseText 4s ease-in-out infinite",
              filter: "drop-shadow(0 0 30px rgba(0,255,212,0.4))",
            }}>
              INTELLIGENCE
            </h1>

            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "16px",
              fontWeight: 300,
              color: "#6A9AB8",
              letterSpacing: "0.05em",
              maxWidth: "500px",
              margin: "0 auto 8px",
              lineHeight: 1.7,
            }}>
              Bioluminescent signals from micro-cap depths.
            </p>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "14px",
              fontWeight: 300,
              color: "#4A7A9B",
              letterSpacing: "0.05em",
              maxWidth: "480px",
              margin: "0 auto",
            }}>
              When 2+ executives illuminate the darkness by buying their own stock
              within days of each other — something glows in the abyss.
            </p>

            {/* Depth separator */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "40px" }}>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,255,212,0.2))" }} />
              <span style={{ fontFamily: "'Exo 2', sans-serif", fontSize: "9px", letterSpacing: "0.3em", color: "#2A5A6A" }}>
                SPECIMENS DETECTED TODAY
              </span>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(0,255,212,0.2), transparent)" }} />
            </div>
          </div>

          {/* Cluster Cards */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "24px" }}>
            {CLUSTERS.map((cluster, i) => {
              const glowColors = ["teal", "blue", "violet"];
              const cardColor = glowColors[i];
              const accentColor = [
                "#00FFD4",
                "#0080FF",
                "#8B00FF",
              ][i];
              const accentRgb = [
                "0,255,212",
                "0,128,255",
                "139,0,255",
              ][i];
              const circumference = 2 * Math.PI * 30;
              const dashOffset = circumference * (1 - cluster.score / 100);

              return (
                <div
                  key={cluster.ticker}
                  className={`cluster-card scanline-container ${cardColor} ${hoveredCard === i ? "hovered" : ""}`}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Specimen header */}
                  <div style={{
                    fontFamily: "'Exo 2', sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.25em",
                    color: accentColor,
                    opacity: 0.7,
                    marginBottom: "16px",
                    textTransform: "uppercase" as const,
                  }}>
                    ◈ SPECIMEN IDENTIFIED: {cluster.ticker} / {cluster.company.toUpperCase()} / CLUSTER ACTIVITY DETECTED
                  </div>

                  {/* Card main row */}
                  <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>

                    {/* Score sonar ring */}
                    <div className="score-ring">
                      <div className="sonar-ping" style={{ color: accentColor }} />
                      <svg width="80" height="80" viewBox="0 0 80 80">
                        {/* Background ring */}
                        <circle
                          cx="40" cy="40" r="30"
                          fill="none"
                          stroke={`rgba(${accentRgb},0.1)`}
                          strokeWidth="4"
                        />
                        {/* Progress ring */}
                        <circle
                          cx="40" cy="40" r="30"
                          fill="none"
                          stroke={accentColor}
                          strokeWidth="3"
                          strokeDasharray={`${circumference}`}
                          strokeDashoffset={`${dashOffset}`}
                          strokeLinecap="round"
                          style={{
                            filter: `drop-shadow(0 0 6px ${accentColor})`,
                            animation: "ringPulse 3s ease-in-out infinite",
                          }}
                        />
                      </svg>
                      <div
                        className="score-value"
                        style={{ color: accentColor }}
                      >
                        {cluster.score}
                      </div>
                    </div>

                    {/* Main info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "4px", flexWrap: "wrap" as const }}>
                        <span style={{
                          fontFamily: "'Exo 2', sans-serif",
                          fontSize: "28px",
                          fontWeight: 700,
                          color: accentColor,
                          textShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
                          letterSpacing: "-0.01em",
                          animation: "flicker 8s ease-in-out infinite",
                        }}>
                          {cluster.ticker}
                        </span>
                        <span style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: "15px",
                          fontWeight: 400,
                          color: "#7AAAC0",
                        }}>
                          {cluster.company}
                        </span>
                      </div>

                      {/* Depth pressure gauge */}
                      <div className="depth-meter" style={{ marginBottom: "16px" }}>
                        <span>DEPTH:</span>
                        <span style={{ color: accentColor, fontWeight: 600 }}>{cluster.depth}</span>
                        <span style={{ color: "#2A5A6A", margin: "0 4px" }}>·</span>
                        <span>{cluster.species}</span>
                      </div>

                      {/* Depth bar */}
                      <div style={{ marginBottom: "18px" }}>
                        <div className="depth-bar" style={{ width: `${cluster.score}%` }} />
                      </div>

                      {/* Metrics row */}
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
                        <div className="metric-box">
                          <div className="metric-label">Insiders</div>
                          <div className="metric-value" style={{ color: accentColor, textShadow: `0 0 12px ${accentColor}` }}>
                            {cluster.insiders}
                          </div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-label">Amount</div>
                          <div className="metric-value" style={{ color: "#C8E8FF" }}>
                            {cluster.amount}
                          </div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-label">Window</div>
                          <div className="metric-value" style={{ color: "#C8E8FF" }}>
                            {cluster.days}d
                          </div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-label">Sector</div>
                          <div className="metric-value" style={{ color: "#7AAAC0", fontSize: "11px", letterSpacing: "0.05em" }}>
                            {cluster.sector}
                          </div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-label">Return</div>
                          <div className="metric-value" style={{ color: "#00FFD4", textShadow: "0 0 10px rgba(0,255,212,0.6)" }}>
                            {cluster.change}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right badge */}
                    <div style={{ flexShrink: 0, textAlign: "center" as const }}>
                      <div style={{
                        background: `rgba(${accentRgb},0.08)`,
                        border: `1px solid rgba(${accentRgb},0.25)`,
                        borderRadius: "8px",
                        padding: "10px 14px",
                        marginBottom: "8px",
                      }}>
                        <div style={{
                          fontFamily: "'Exo 2', sans-serif",
                          fontSize: "9px",
                          letterSpacing: "0.2em",
                          color: accentColor,
                          opacity: 0.7,
                          marginBottom: "4px",
                        }}>
                          SIGNAL
                        </div>
                        <div style={{
                          fontFamily: "'Exo 2', sans-serif",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: accentColor,
                          letterSpacing: "0.1em",
                        }}>
                          {cluster.score >= 80 ? "APEX" : cluster.score >= 70 ? "STRONG" : "ACTIVE"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card footer */}
                  <div style={{
                    marginTop: "18px",
                    paddingTop: "14px",
                    borderTop: `1px solid rgba(${accentRgb},0.08)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", color: "#2A5A6A", letterSpacing: "0.1em" }}>
                      BIOLUMINESCENT CLUSTER · MICRO-CAP ZONE
                    </span>
                    <span style={{
                      fontFamily: "'Exo 2', sans-serif",
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      color: accentColor,
                      opacity: 0.6,
                    }}>
                      VIEW SPECIMEN →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats bar */}
          <div style={{
            display: "flex",
            gap: "1px",
            marginTop: "48px",
            marginBottom: "48px",
            background: "rgba(0,255,212,0.05)",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid rgba(0,255,212,0.1)",
          }}>
            {[
              { label: "SPECIES DETECTED", value: "3", accent: "#00FFD4" },
              { label: "TOTAL DEPTH SIGNAL", value: "223", accent: "#0080FF" },
              { label: "AVG CONVICTION", value: "74.3", accent: "#8B00FF" },
              { label: "ABYSS ZONE", value: "MICRO-CAP", accent: "#00FFD4" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  padding: "20px 16px",
                  textAlign: "center" as const,
                  background: "rgba(4,20,40,0.6)",
                  borderRight: i < 3 ? "1px solid rgba(0,255,212,0.06)" : "none",
                }}
              >
                <div style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: stat.accent,
                  textShadow: `0 0 20px ${stat.accent}, 0 0 40px ${stat.accent}`,
                  marginBottom: "6px",
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  color: "#2A5A6A",
                  textTransform: "uppercase" as const,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Subscribe section */}
          <div style={{
            position: "relative",
            background: "rgba(4,20,40,0.7)",
            border: "1px solid rgba(0,255,212,0.12)",
            borderRadius: "16px",
            padding: "48px 40px",
            textAlign: "center" as const,
            overflow: "hidden",
            boxShadow: "0 0 60px rgba(0,255,212,0.06), inset 0 0 60px rgba(0,255,212,0.02)",
          }}>
            {/* Background glow orb */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(0,255,212,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "#00FFD4",
              opacity: 0.7,
              marginBottom: "16px",
              textTransform: "uppercase" as const,
            }}>
              ◈ DEEP SIGNAL SUBSCRIPTION
            </div>

            <h2 style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "clamp(24px, 4vw, 38px)",
              fontWeight: 800,
              color: "#E8F8FF",
              letterSpacing: "-0.01em",
              marginBottom: "8px",
              textShadow: "0 0 40px rgba(0,255,212,0.15)",
            }}>
              DESCEND WITH US
            </h2>

            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "15px",
              fontWeight: 300,
              color: "#4A7A9B",
              marginBottom: "6px",
              letterSpacing: "0.03em",
            }}>
              RECEIVE SIGNALS FROM THE DEEP
            </p>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "13px",
              fontWeight: 300,
              color: "#2A5A6A",
              marginBottom: "36px",
              letterSpacing: "0.05em",
            }}>
              Fresh bioluminescent clusters delivered before the surface-dwellers notice the glow.
            </p>

            {descended ? (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(0,255,212,0.08)",
                border: "1px solid rgba(0,255,212,0.3)",
                borderRadius: "10px",
                padding: "16px 28px",
              }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#00FFD4",
                  boxShadow: "0 0 10px 4px rgba(0,255,212,0.8)",
                }} />
                <span style={{
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  color: "#00FFD4",
                }}>
                  SIGNAL LOCKED — DESCENDING
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", maxWidth: "480px", margin: "0 auto" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="subscribe-input"
                />
                <button type="submit" className="descend-btn">
                  DESCEND
                </button>
              </form>
            )}

            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "11px",
              color: "#1A3A4A",
              marginTop: "16px",
              letterSpacing: "0.08em",
            }}>
              NO SPAM · ONLY BIOLUMINESCENT SIGNALS · UNSUBSCRIBE ANYTIME
            </p>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: "48px",
            textAlign: "center" as const,
            borderTop: "1px solid rgba(0,255,212,0.05)",
            paddingTop: "32px",
          }}>
            <div style={{
              fontFamily: "'Exo 2', sans-serif",
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: "#1A3A4A",
              marginBottom: "8px",
            }}>
              CLUSTERDESK · DEEP SEA INTELLIGENCE DIVISION
            </div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "11px",
              color: "#1A3A4A",
              lineHeight: 1.7,
            }}>
              Not financial advice. Data sourced from SEC Form 4 filings.
              <br />
              All creatures observed at a safe distance of 3,000m.
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
