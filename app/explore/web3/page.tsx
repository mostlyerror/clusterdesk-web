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
    change: "+18.4%",
    gwei: 87,
    strength: "VERY STRONG",
    poolShare: "0.87",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    amount: "$88K",
    days: 6,
    sector: "ACCESSIBILITY TECH",
    change: "+9.2%",
    gwei: 74,
    strength: "STRONG",
    poolShare: "0.74",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    amount: "$47K",
    days: 9,
    sector: "MEDIA TECH",
    change: "+6.1%",
    gwei: 62,
    strength: "MODERATE",
    poolShare: "0.62",
  },
];

const GLOBAL_STATS = [
  { label: "TVL", sublabel: "Total Value of Clusters", value: "$447K", delta: "+12.4%" },
  { label: "APY", sublabel: "Alert Precision", value: "91.3%", delta: "+2.1%" },
  { label: "POOLS", sublabel: "Active Clusters", value: "3", delta: "LIVE" },
  { label: "HOLDERS", sublabel: "Tracked Insiders", value: "7", delta: "SEC Filed" },
];

export default function Web3Page() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [emailVal, setEmailVal] = useState("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Manrope:wght@400;500;600&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #0A0A0F;
        }

        .w3-root {
          min-height: 100vh;
          background: #0A0A0F;
          color: #E8E8F0;
          font-family: 'Manrope', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Animated orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
          animation: orbFloat 12s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 500px;
          height: 500px;
          top: -120px;
          left: -100px;
          background: radial-gradient(circle, rgba(123,47,255,0.25) 0%, transparent 70%);
          animation-duration: 14s;
        }
        .orb-2 {
          width: 400px;
          height: 400px;
          top: 30%;
          right: -80px;
          background: radial-gradient(circle, rgba(255,45,120,0.2) 0%, transparent 70%);
          animation-duration: 11s;
          animation-delay: -4s;
        }
        .orb-3 {
          width: 350px;
          height: 350px;
          bottom: 10%;
          left: 20%;
          background: radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%);
          animation-duration: 16s;
          animation-delay: -7s;
        }

        @keyframes orbFloat {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(30px, -40px) scale(1.05); }
          66%  { transform: translate(-20px, 20px) scale(0.97); }
          100% { transform: translate(10px, -20px) scale(1.03); }
        }

        /* Hero gradient animation */
        @keyframes heroGradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Gradient text */
        .grad-text-purple-pink {
          background: linear-gradient(90deg, #7B2FFF, #FF2D78);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .grad-text-purple-cyan {
          background: linear-gradient(90deg, #7B2FFF, #00D4FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .grad-text-cyan-pink {
          background: linear-gradient(90deg, #00D4FF, #FF2D78);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Glass card */
        .glass-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid transparent;
          background-clip: padding-box;
          border-radius: 16px;
          position: relative;
        }
        .glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(123,47,255,0.5), rgba(255,45,120,0.4));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .glass-card-cyan::before {
          background: linear-gradient(135deg, rgba(0,212,255,0.5), rgba(123,47,255,0.4));
        }
        .glass-card:hover::before {
          background: linear-gradient(135deg, #7B2FFF, #FF2D78);
        }

        /* Pulse dot */
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        .pulse-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00D4FF;
          animation: pulse-dot 1.5s ease-in-out infinite;
        }

        /* Token badge */
        .token-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px 4px 8px;
          border-radius: 100px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.04em;
          background: rgba(123,47,255,0.15);
          border: 1px solid rgba(123,47,255,0.4);
          color: #C4A1FF;
          position: relative;
          overflow: hidden;
        }
        .token-badge::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(123,47,255,0.08), transparent);
          transform: translateX(-100%);
          animation: shimmer 3s ease infinite;
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }

        /* Gradient button */
        .btn-connect {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.08em;
          padding: 10px 20px;
          border-radius: 100px;
          border: 1px solid transparent;
          background: rgba(10,10,15,0.8);
          background-clip: padding-box;
          color: #C4A1FF;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }
        .btn-connect::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 100px;
          padding: 1px;
          background: linear-gradient(135deg, #7B2FFF, #FF2D78);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
        .btn-connect:hover {
          background: rgba(123,47,255,0.15);
          color: #fff;
        }

        .btn-primary {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.06em;
          padding: 14px 32px;
          border-radius: 100px;
          border: none;
          background: linear-gradient(135deg, #7B2FFF, #FF2D78);
          color: #fff;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .btn-primary:active {
          transform: translateY(0);
        }

        /* Stat pill */
        .stat-pill {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 10px 16px;
          border-radius: 10px;
          background: rgba(123,47,255,0.08);
          border: 1px solid rgba(123,47,255,0.2);
          min-width: 90px;
        }

        /* Score ring */
        @keyframes ringFill {
          from { stroke-dasharray: 0 251; }
          to   { stroke-dasharray: var(--fill) 251; }
        }
        .score-ring circle.fill {
          animation: ringFill 1.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }

        /* Input */
        .w3-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(123,47,255,0.3);
          border-radius: 100px;
          padding: 12px 20px;
          font-family: 'Manrope', sans-serif;
          font-size: 14px;
          color: #E8E8F0;
          outline: none;
          width: 280px;
          transition: border-color 0.2s;
        }
        .w3-input:focus {
          border-color: #7B2FFF;
        }
        .w3-input::placeholder {
          color: rgba(232,232,240,0.35);
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(123,47,255,0.4); border-radius: 4px; }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title { font-size: 36px !important; }
          .hero-sub { font-size: 15px !important; }
          .cards-grid { grid-template-columns: 1fr !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .nav-inner { padding: 0 16px !important; }
          .w3-input { width: 100% !important; }
          .subscribe-row { flex-direction: column !important; }
        }
      `}</style>

      <div className="w3-root">
        {/* Background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* NAV */}
        <nav style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(10,10,15,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(123,47,255,0.15)",
        }}>
          <div className="nav-inner" style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 32px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #7B2FFF, #FF2D78)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="5" r="3" fill="white" />
                  <circle cx="4" cy="14" r="2.5" fill="white" fillOpacity="0.7" />
                  <circle cx="14" cy="14" r="2.5" fill="white" fillOpacity="0.7" />
                  <line x1="9" y1="8" x2="4" y2="11.5" stroke="white" strokeWidth="1.2" strokeOpacity="0.6" />
                  <line x1="9" y1="8" x2="14" y2="11.5" stroke="white" strokeWidth="1.2" strokeOpacity="0.6" />
                </svg>
              </div>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: "-0.01em",
              }}>
                <span className="grad-text-purple-pink">Cluster</span>
                <span style={{ color: "#E8E8F0" }}>Desk</span>
              </span>
            </div>

            {/* Nav links */}
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {["Clusters", "Analytics", "Docs"].map((item) => (
                <span key={item} style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  color: "rgba(232,232,240,0.55)",
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                  transition: "color 0.15s",
                }}>
                  {item}
                </span>
              ))}
            </div>

            {/* Wallet-style button */}
            <button className="btn-connect">
              <span style={{ marginRight: 6 }}>◈</span>
              CONNECT ALERTS
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{
          position: "relative",
          zIndex: 1,
          padding: "96px 32px 80px",
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
        }}>
          {/* Live badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 100,
            background: "rgba(0,212,255,0.08)",
            border: "1px solid rgba(0,212,255,0.25)",
            marginBottom: 28,
          }}>
            <span className="pulse-dot" />
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "0.1em",
              color: "#00D4FF",
            }}>
              LIVE · 3 ACTIVE CLUSTERS
            </span>
          </div>

          <h1 className="hero-title" style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 64,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            marginBottom: 24,
          }}>
            <span style={{ color: "#E8E8F0" }}>Insider Buys,</span>
            <br />
            <span className="grad-text-purple-pink">On-Chain Clarity.</span>
          </h1>

          <p className="hero-sub" style={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 400,
            fontSize: 18,
            lineHeight: 1.65,
            color: "rgba(232,232,240,0.55)",
            maxWidth: 560,
            margin: "0 auto 48px",
          }}>
            When 2+ executives buy their own stock within days of each other,
            ClusterDesk detects the signal — surfaced like a DeFi pool, priced
            in conviction.
          </p>

          {/* Hero CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: 15, padding: "15px 36px" }}>
              Explore Clusters
            </button>
            <button className="btn-connect" style={{ padding: "13px 24px", fontSize: 14 }}>
              View Docs ↗
            </button>
          </div>

          {/* Animated gradient bar */}
          <div style={{
            marginTop: 64,
            height: 2,
            borderRadius: 2,
            background: "linear-gradient(90deg, transparent, #7B2FFF, #FF2D78, #00D4FF, transparent)",
            backgroundSize: "200% 100%",
            animation: "heroGradient 4s linear infinite",
            opacity: 0.6,
          }} />
        </section>

        {/* PROTOCOL STATS */}
        <section style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto 72px",
          padding: "0 32px",
        }}>
          <div className="stats-row glass-card" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
            borderRadius: 16,
            overflow: "hidden",
          }}>
            {GLOBAL_STATS.map((s, i) => (
              <div key={s.label} style={{
                padding: "28px 28px",
                borderRight: i < GLOBAL_STATS.length - 1
                  ? "1px solid rgba(123,47,255,0.12)"
                  : "none",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: "rgba(232,232,240,0.35)",
                  textTransform: "uppercase",
                }}>
                  {s.label}
                </div>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 32,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }} className="grad-text-purple-cyan">
                  {s.value}
                </div>
                <div style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 13,
                  color: "rgba(232,232,240,0.45)",
                }}>
                  {s.sublabel}
                </div>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 600,
                  fontSize: 12,
                  color: "#00D4FF",
                  letterSpacing: "0.02em",
                }}>
                  {s.delta}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CLUSTER POOLS HEADING */}
        <section style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto 32px",
          padding: "0 32px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.15em",
              color: "rgba(232,232,240,0.35)",
              marginBottom: 8,
              textTransform: "uppercase",
            }}>
              Active Liquidity Pools
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 36,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}>
              <span className="grad-text-purple-pink">Insider Clusters</span>
            </h2>
          </div>
          <div style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 13,
            color: "rgba(232,232,240,0.4)",
            maxWidth: 320,
            lineHeight: 1.6,
            textAlign: "right",
          }}>
            Clusters ranked by conviction score — the higher the score,
            the stronger the coordinated buying signal.
          </div>
        </section>

        {/* CLUSTER CARDS */}
        <section style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto 80px",
          padding: "0 32px",
        }}>
          <div className="cards-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}>
            {CLUSTERS.map((c, i) => (
              <div
                key={c.ticker}
                className="glass-card"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  cursor: "default",
                  transition: "transform 0.2s",
                  transform: hovered === i ? "translateY(-4px)" : "translateY(0)",
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                {/* Card header gradient bar */}
                <div style={{
                  height: 3,
                  background: i === 0
                    ? "linear-gradient(90deg, #7B2FFF, #FF2D78)"
                    : i === 1
                    ? "linear-gradient(90deg, #FF2D78, #00D4FF)"
                    : "linear-gradient(90deg, #00D4FF, #7B2FFF)",
                }} />

                <div style={{ padding: "24px 24px 28px" }}>
                  {/* Top row: token badge + score ring */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                    <div>
                      {/* Token badge */}
                      <div className="token-badge" style={{ marginBottom: 10 }}>
                        <span style={{
                          display: "inline-block",
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: i === 0
                            ? "linear-gradient(135deg, #7B2FFF, #FF2D78)"
                            : i === 1
                            ? "linear-gradient(135deg, #FF2D78, #00D4FF)"
                            : "linear-gradient(135deg, #00D4FF, #7B2FFF)",
                          flexShrink: 0,
                        }} />
                        ${c.ticker}
                      </div>
                      <div style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontWeight: 500,
                        fontSize: 13,
                        color: "rgba(232,232,240,0.45)",
                        lineHeight: 1.4,
                        maxWidth: 160,
                      }}>
                        {c.company}
                      </div>
                    </div>

                    {/* Score Ring (SVG) */}
                    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                      <svg width="72" height="72" viewBox="0 0 72 72">
                        <circle cx="36" cy="36" r="30"
                          fill="none"
                          stroke="rgba(123,47,255,0.12)"
                          strokeWidth="5"
                        />
                        <circle
                          className="fill"
                          cx="36" cy="36" r="30"
                          fill="none"
                          stroke="url(#scoreGrad)"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={`${(c.score / 100) * 188.5} 251`}
                          strokeDashoffset="47"
                          style={{ transform: "rotate(-90deg)", transformOrigin: "36px 36px" }}
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7B2FFF" />
                            <stop offset="100%" stopColor="#FF2D78" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 0,
                      }}>
                        <span style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 800,
                          fontSize: 18,
                          lineHeight: 1,
                          background: "linear-gradient(90deg, #7B2FFF, #FF2D78)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}>
                          {c.score}
                        </span>
                        <span style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 8,
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          color: "rgba(232,232,240,0.35)",
                        }}>
                          /100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* APY-style conviction */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 800,
                      fontSize: 28,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                      background: "linear-gradient(90deg, #7B2FFF, #FF2D78)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      marginBottom: 4,
                    }}>
                      {c.score}% CONVICTION
                    </div>
                    <div style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 600,
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      color: "rgba(232,232,240,0.3)",
                    }}>
                      CLUSTER SIGNAL SCORE
                    </div>
                  </div>

                  {/* DeFi stats row */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 10,
                    marginBottom: 20,
                  }}>
                    {[
                      { label: "TVL", value: c.amount },
                      { label: "APY", value: c.change },
                      { label: "HOLDERS", value: `${c.insiders}` },
                    ].map((stat) => (
                      <div key={stat.label} style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(123,47,255,0.12)",
                      }}>
                        <span style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 600,
                          fontSize: 9,
                          letterSpacing: "0.12em",
                          color: "rgba(232,232,240,0.3)",
                        }}>
                          {stat.label}
                        </span>
                        <span style={{
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 800,
                          fontSize: 16,
                          letterSpacing: "-0.01em",
                          color: "#E8E8F0",
                        }}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Gas fee parody */}
                  <div style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(0,212,255,0.05)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 18,
                  }}>
                    <span style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      color: "rgba(232,232,240,0.4)",
                    }}>
                      SIGNAL STRENGTH
                    </span>
                    <span style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: 11,
                      color: "#00D4FF",
                      letterSpacing: "0.04em",
                    }}>
                      ⛽ {c.gwei} GWEI · {c.strength}
                    </span>
                  </div>

                  {/* Bottom row */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}>
                      <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                      <span style={{
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: 12,
                        color: "rgba(232,232,240,0.4)",
                      }}>
                        {c.days}d window · {c.sector}
                      </span>
                    </div>
                    <button className="btn-connect" style={{ padding: "7px 14px", fontSize: 11 }}>
                      TRADE →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto 80px",
          padding: "0 32px",
        }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: "0.15em",
              color: "rgba(232,232,240,0.3)",
              marginBottom: 12,
            }}>
              PROTOCOL MECHANICS
            </div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 36,
              letterSpacing: "-0.02em",
            }}>
              <span className="grad-text-cyan-pink">How Clusters Form</span>
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}>
            {[
              {
                icon: "⟠",
                step: "01",
                title: "SEC Files the Trade",
                body: "Executives file Form 4 disclosures within 2 days of buying their own company's stock. We ingest every filing in real time.",
                color: "#7B2FFF",
              },
              {
                icon: "⬡",
                step: "02",
                title: "Cluster Detection",
                body: "Our algorithm finds micro-cap companies where 2+ insiders buy within a 14-day window — a statistically rare coordinated signal.",
                color: "#FF2D78",
              },
              {
                icon: "◈",
                step: "03",
                title: "Conviction Scored",
                body: "Each cluster is scored 0–100 based on insider count, purchase size, recency, and historical alpha. High score = high conviction.",
                color: "#00D4FF",
              },
            ].map((item) => (
              <div key={item.step} className="glass-card glass-card-cyan" style={{ padding: "28px 28px" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `rgba(${item.color === "#7B2FFF" ? "123,47,255" : item.color === "#FF2D78" ? "255,45,120" : "0,212,255"},0.12)`,
                    border: `1px solid ${item.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: item.color,
                    flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 13,
                    letterSpacing: "0.1em",
                    color: "rgba(232,232,240,0.2)",
                  }}>
                    {item.step}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "-0.01em",
                  color: "#E8E8F0",
                  marginBottom: 10,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "rgba(232,232,240,0.45)",
                }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SUBSCRIBE SECTION */}
        <section style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto 96px",
          padding: "0 32px",
        }}>
          <div className="glass-card" style={{
            padding: "64px 48px",
            textAlign: "center",
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Radial glow behind */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "200%",
              background: "radial-gradient(ellipse, rgba(123,47,255,0.12) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 14px",
                borderRadius: 100,
                background: "rgba(123,47,255,0.1)",
                border: "1px solid rgba(123,47,255,0.3)",
                marginBottom: 24,
              }}>
                <span style={{ fontSize: 14 }}>⬡</span>
                <span style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: "#C4A1FF",
                }}>
                  FREE MINT · NO GAS FEES
                </span>
              </div>

              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 42,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: 16,
              }}>
                <span className="grad-text-purple-pink">MINT YOUR</span>
                <br />
                <span style={{ color: "#E8E8F0" }}>ALERT SUBSCRIPTION</span>
              </h2>

              <p style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 16,
                lineHeight: 1.65,
                color: "rgba(232,232,240,0.5)",
                maxWidth: 460,
                margin: "0 auto 40px",
              }}>
                Get cluster alerts the moment they form. No wallet required.
                No gas fees. Just signal — straight to your inbox.
              </p>

              {subscribed ? (
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 32px",
                  borderRadius: 100,
                  background: "rgba(0,212,255,0.1)",
                  border: "1px solid rgba(0,212,255,0.3)",
                }}>
                  <span className="pulse-dot" />
                  <span style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: "0.06em",
                    color: "#00D4FF",
                  }}>
                    MINTED. ALERTS CONNECTED.
                  </span>
                </div>
              ) : (
                <div className="subscribe-row" style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}>
                  <input
                    className="w3-input"
                    type="email"
                    placeholder="your@wallet.eth"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && emailVal.trim()) setSubscribed(true);
                    }}
                  />
                  <button
                    className="btn-primary"
                    onClick={() => { if (emailVal.trim()) setSubscribed(true); }}
                  >
                    MINT FREE ALERTS
                  </button>
                </div>
              )}

              <div style={{
                marginTop: 20,
                fontFamily: "'Manrope', sans-serif",
                fontSize: 12,
                color: "rgba(232,232,240,0.25)",
                letterSpacing: "0.02em",
              }}>
                FREE. NO GAS FEES. UNSUBSCRIBE ANY BLOCK.
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(123,47,255,0.1)",
          padding: "40px 32px",
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 16,
          }}>
            <span className="grad-text-purple-pink">Cluster</span>
            <span style={{ color: "rgba(232,232,240,0.4)" }}>Desk</span>
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Twitter", "Discord"].map((link) => (
              <span key={link} style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: 13,
                color: "rgba(232,232,240,0.3)",
                cursor: "pointer",
                letterSpacing: "0.01em",
                transition: "color 0.15s",
              }}>
                {link}
              </span>
            ))}
          </div>

          <div style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 12,
            color: "rgba(232,232,240,0.2)",
          }}>
            © 2026 ClusterDesk · Not financial advice.
          </div>
        </footer>
      </div>
    </>
  );
}
