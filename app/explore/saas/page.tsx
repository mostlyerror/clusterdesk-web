"use client";

import { useState, useEffect, useRef } from "react";

const CLUSTERS = [
  {
    ticker: "MVST",
    name: "Microvast Holdings",
    score: 87,
    insiders: 3,
    value: "$312K",
    conviction: "High",
    roles: "CEO · CFO · Director",
    dateRange: "May 1–5, 2026",
    change: "+14.2%",
    positive: true,
  },
  {
    ticker: "AEYE",
    name: "AudioEye Inc",
    score: 74,
    insiders: 2,
    value: "$88K",
    conviction: "Strong",
    roles: "CEO · Director",
    dateRange: "May 6–8, 2026",
    change: "+8.7%",
    positive: true,
  },
  {
    ticker: "ZDGE",
    name: "Zedge Inc",
    score: 62,
    insiders: 2,
    value: "$47K",
    conviction: "Moderate",
    roles: "CFO · Director",
    dateRange: "May 9–10, 2026",
    change: "+5.1%",
    positive: true,
  },
];

const FEATURES = [
  {
    icon: "⚡",
    title: "Real-time cluster detection",
    description:
      "Alerts fire within minutes of SEC Form 4 filings. Never miss a window when executives are buying.",
  },
  {
    icon: "🎯",
    title: "Conviction scoring",
    description:
      "Proprietary algorithm weighing insider count, purchase size, role seniority, and timing proximity.",
  },
  {
    icon: "📊",
    title: "Micro-cap focus",
    description:
      "Institutional money can't move the needle here. Your edge is reading the same data they can't act on.",
  },
  {
    icon: "🔔",
    title: "Instant notifications",
    description:
      "Slack, email, or webhook. Get alerts your way, tuned to your conviction threshold.",
  },
  {
    icon: "📋",
    title: "Full filing context",
    description:
      "Every alert links to raw SEC filings so you can verify the thesis in 30 seconds.",
  },
  {
    icon: "🔒",
    title: "Institutional-grade data",
    description:
      "Sourced directly from EDGAR. Zero third-party data vendors in the pipeline.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I've been tracking insider buys manually for 3 years. ClusterDesk does in seconds what used to take me an entire Sunday afternoon.",
    name: "Marcus T.",
    role: "Independent investor, 12 years",
    avatar: "MT",
  },
  {
    quote:
      "The conviction score is genuinely useful. I don't need to read every filing anymore — I just look at what crossed 80 and do my own diligence from there.",
    name: "Sarah K.",
    role: "Former hedge fund analyst",
    avatar: "SK",
  },
  {
    quote:
      "Three cluster alerts in the last 60 days. All three moved within two weeks. I'm not a superstitious person but I'm also not ignoring this signal.",
    name: "David L.",
    role: "Retail investor, FIRE community",
    avatar: "DL",
  },
];

const LOGOS = [
  "Goldman Sachs",
  "Citadel",
  "Sequoia",
  "Two Sigma",
  "Renaissance",
  "Bridgewater",
];

function ScoreCircle({ score }: { score: number }) {
  const pct = score / 100;
  const color =
    score >= 80
      ? "#4F46E5"
      : score >= 65
      ? "#7C3AED"
      : "#6D28D9";
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: `conic-gradient(${color} ${pct * 360}deg, #1a1a2e ${pct * 360}deg)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "#111111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-0.5px",
        }}
      >
        {score}
      </div>
    </div>
  );
}

function ConvictionBadge({ level }: { level: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    High: { bg: "rgba(79,70,229,0.2)", text: "#818cf8" },
    Strong: { bg: "rgba(124,58,237,0.2)", text: "#a78bfa" },
    Moderate: { bg: "rgba(109,40,217,0.15)", text: "#c4b5fd" },
  };
  const c = colors[level] || colors.Moderate;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 4,
        letterSpacing: "0.04em",
        textTransform: "uppercase" as const,
      }}
    >
      {level}
    </span>
  );
}

export default function SaasPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
      if (e.key === "Escape") setCmdOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (cmdOpen && inputRef.current) inputRef.current.focus();
  }, [cmdOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0A0A0A;
      color: #FFFFFF;
      -webkit-font-smoothing: antialiased;
    }

    ::selection { background: rgba(79,70,229,0.4); color: #fff; }

    @keyframes blob {
      0%   { transform: translate(0px, 0px) scale(1); }
      33%  { transform: translate(40px, -30px) scale(1.08); }
      66%  { transform: translate(-20px, 20px) scale(0.95); }
      100% { transform: translate(0px, 0px) scale(1); }
    }

    @keyframes blob2 {
      0%   { transform: translate(0px, 0px) scale(1); }
      33%  { transform: translate(-50px, 30px) scale(1.05); }
      66%  { transform: translate(30px, -20px) scale(0.97); }
      100% { transform: translate(0px, 0px) scale(1); }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(79,70,229,0.4); }
      70%  { box-shadow: 0 0 0 10px rgba(79,70,229,0); }
      100% { box-shadow: 0 0 0 0 rgba(79,70,229,0); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }

    .hero-fade-1 { animation: fadeUp 0.7s ease both; animation-delay: 0.1s; }
    .hero-fade-2 { animation: fadeUp 0.7s ease both; animation-delay: 0.25s; }
    .hero-fade-3 { animation: fadeUp 0.7s ease both; animation-delay: 0.4s; }
    .hero-fade-4 { animation: fadeUp 0.7s ease both; animation-delay: 0.55s; }
    .hero-fade-5 { animation: fadeUp 0.7s ease both; animation-delay: 0.7s; }
    .hero-fade-6 { animation: fadeUp 0.7s ease both; animation-delay: 0.85s; }

    .cluster-card {
      background: #111111;
      border: 1px solid #222222;
      border-radius: 12px;
      padding: 20px;
      transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
      cursor: pointer;
    }

    .cluster-card:hover {
      border-color: transparent;
      box-shadow:
        0 0 0 1px rgba(79,70,229,0.6),
        0 8px 32px rgba(79,70,229,0.15),
        0 2px 8px rgba(0,0,0,0.4);
      transform: translateY(-2px);
    }

    .feature-card {
      background: #111111;
      border: 1px solid #1a1a1a;
      border-radius: 12px;
      padding: 24px;
      transition: border-color 0.2s ease, background 0.2s ease;
    }

    .feature-card:hover {
      border-color: #2a2a2a;
      background: #141414;
    }

    .testimonial-card {
      background: #0e0e0e;
      border: 1px solid #1e1e1e;
      border-radius: 12px;
      padding: 28px;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 12px 22px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
      letter-spacing: -0.01em;
      font-family: inherit;
      text-decoration: none;
    }

    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(79,70,229,0.4);
    }

    .btn-primary:active { transform: translateY(0); }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      color: #fff;
      border: 1px solid #333333;
      border-radius: 8px;
      padding: 12px 22px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: border-color 0.2s ease, background 0.2s ease;
      letter-spacing: -0.01em;
      font-family: inherit;
      text-decoration: none;
    }

    .btn-outline:hover {
      border-color: #555555;
      background: rgba(255,255,255,0.04);
    }

    .email-input {
      flex: 1;
      background: #111111;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 12px 16px;
      color: #fff;
      font-size: 15px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      min-width: 0;
    }

    .email-input:focus {
      border-color: #4F46E5;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.15);
    }

    .email-input::placeholder { color: #555555; }

    .gradient-text {
      background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c4b5fd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .kbd-hint {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #555555;
    }

    .kbd {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 11px;
      color: #888888;
      font-family: inherit;
    }

    .cmd-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 120px;
      animation: fadeIn 0.15s ease;
    }

    .cmd-palette {
      background: #141414;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      width: 100%;
      max-width: 560px;
      overflow: hidden;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(79,70,229,0.2);
    }

    .cmd-input {
      width: 100%;
      background: transparent;
      border: none;
      border-bottom: 1px solid #222222;
      padding: 16px 20px;
      font-size: 16px;
      color: #fff;
      font-family: inherit;
      outline: none;
    }

    .cmd-input::placeholder { color: #444444; }

    .cmd-result {
      padding: 8px 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .cmd-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.1s ease;
    }

    .cmd-item:hover { background: #1e1e1e; }

    .section-label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #4F46E5;
      margin-bottom: 12px;
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #222222, transparent);
      margin: 80px 0;
    }

    .live-dot {
      width: 6px;
      height: 6px;
      background: #22c55e;
      border-radius: 50%;
      display: inline-block;
      animation: pulse-ring 2s ease infinite;
    }

    .logo-item {
      color: #333333;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s ease;
      cursor: default;
    }

    .logo-item:hover { color: #555555; }

    .checklist-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: #cccccc;
      margin-bottom: 10px;
    }

    .check-icon {
      width: 18px;
      height: 18px;
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      flex-shrink: 0;
    }

    .nav-link {
      color: #888888;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .nav-link:hover { color: #ffffff; }

    .ticker-tag {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #818cf8;
      background: rgba(79,70,229,0.1);
      padding: 3px 8px;
      border-radius: 4px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #ffffff 0%, #a78bfa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .noise-overlay {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    }

    @media (max-width: 768px) {
      .hero-headline { font-size: 36px !important; }
      .features-grid { grid-template-columns: 1fr !important; }
      .clusters-grid { grid-template-columns: 1fr !important; }
      .testimonials-grid { grid-template-columns: 1fr !important; }
      .stats-row { flex-direction: column; gap: 32px !important; }
      .cta-row { flex-direction: column !important; }
      .subscribe-row { flex-direction: column !important; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="noise-overlay" />

      {/* Command Palette */}
      {cmdOpen && (
        <div className="cmd-overlay" onClick={() => setCmdOpen(false)}>
          <div className="cmd-palette" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              className="cmd-input"
              placeholder="Search tickers, insiders, sectors..."
              value={cmdQuery}
              onChange={(e) => setCmdQuery(e.target.value)}
            />
            <div className="cmd-result">
              {["MVST — Microvast Holdings · Score 87", "AEYE — AudioEye Inc · Score 74", "ZDGE — Zedge Inc · Score 62"].map((item) => (
                <div key={item} className="cmd-item">
                  <span style={{ fontSize: 14, color: "#888888" }}>⟳</span>
                  <span style={{ fontSize: 14, color: "#cccccc" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "8px 16px 12px", borderTop: "1px solid #1a1a1a", display: "flex", gap: 16 }}>
              <span className="kbd-hint"><kbd className="kbd">↵</kbd> open</span>
              <span className="kbd-hint"><kbd className="kbd">esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>

        {/* Nav */}
        <nav style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid #161616",
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(12px)",
          padding: "0 24px",
        }}>
          <div style={{
            maxWidth: 1100,
            margin: "0 auto",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
              }}>C</div>
              <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>ClusterDesk</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <a href="#features" className="nav-link">Features</a>
              <a href="#alerts" className="nav-link">Alerts</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <button
                onClick={() => setCmdOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#111111",
                  border: "1px solid #222222",
                  borderRadius: 6,
                  padding: "5px 12px",
                  color: "#666666",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "border-color 0.2s",
                }}
              >
                <span>Search tickers</span>
                <span className="kbd" style={{ marginLeft: 4 }}>⌘K</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ position: "relative", overflow: "hidden", paddingTop: 100, paddingBottom: 120, textAlign: "center" }}>
          {/* Gradient blobs */}
          <div style={{
            position: "absolute",
            top: -100,
            left: "50%",
            transform: "translateX(-60%)",
            width: 700,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(79,70,229,0.18) 0%, transparent 70%)",
            animation: "blob 12s ease-in-out infinite",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute",
            top: 50,
            right: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)",
            animation: "blob2 15s ease-in-out infinite",
            pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", position: "relative" }}>
            <div className="hero-fade-1" style={{ marginBottom: 20 }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(79,70,229,0.1)",
                border: "1px solid rgba(79,70,229,0.25)",
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 13,
                color: "#a78bfa",
                fontWeight: 500,
              }}>
                <span className="live-dot" />
                Live cluster alerts · 14 new this week
              </span>
            </div>

            <h1
              className="hero-headline hero-fade-2"
              style={{
                fontSize: 62,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                marginBottom: 24,
              }}
            >
              When executives buy{" "}
              <span className="gradient-text">their own stock</span>
              {" "}together, you should know.
            </h1>

            <p className="hero-fade-3" style={{
              fontSize: 19,
              color: "#888888",
              lineHeight: 1.6,
              marginBottom: 40,
              maxWidth: 540,
              margin: "0 auto 40px",
              fontWeight: 400,
            }}>
              ClusterDesk surfaces insider cluster buy alerts — when 2+ executives buy their own micro-cap company&rsquo;s stock within days of each other. The signal institutions can&rsquo;t trade on.
            </p>

            <div className="cta-row hero-fade-4" style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              marginBottom: 48,
              flexWrap: "wrap",
            }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: "13px 28px" }}>
                Start for free →
              </button>
              <button className="btn-outline" style={{ fontSize: 16, padding: "13px 28px" }}>
                View sample alert
              </button>
            </div>

            <div className="hero-fade-5" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: "#555555",
              fontSize: 14,
            }}>
              <div style={{ display: "flex" }}>
                {["#4F46E5", "#7C3AED", "#6D28D9", "#5B21B6", "#4C1D95"].map((c, i) => (
                  <div key={i} style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: c,
                    border: "2px solid #0A0A0A",
                    marginLeft: i === 0 ? 0 : -8,
                    fontSize: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                  }}>
                    {["M","S","A","J","R"][i]}
                  </div>
                ))}
              </div>
              <span>Trusted by <strong style={{ color: "#cccccc" }}>2,400</strong> investors</span>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <div style={{ borderTop: "1px solid #161616", borderBottom: "1px solid #161616", background: "#0d0d0d" }}>
          <div className="stats-row" style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "48px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 80,
            textAlign: "center",
          }}>
            {[
              { value: "2,847", label: "Alerts this year" },
              { value: "68%", label: "Moved within 30 days" },
              { value: "< 4 min", label: "Avg alert latency" },
              { value: "$2.1B", label: "Insider buys tracked" },
            ].map((s) => (
              <div key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div style={{ fontSize: 13, color: "#555555", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Cluster Alerts */}
        <section id="alerts" style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 24px" }}>
          <div style={{ marginBottom: 48 }}>
            <div className="section-label">Live alerts</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
              Today&rsquo;s cluster signals
            </h2>
            <p style={{ color: "#666666", fontSize: 16 }}>
              Updated in real-time as Form 4 filings arrive from the SEC.
            </p>
          </div>

          <div
            className="clusters-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {CLUSTERS.map((c, i) => (
              <div
                key={c.ticker}
                className="cluster-card"
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span className="ticker-tag">{c.ticker}</span>
                      <ConvictionBadge level={c.conviction} />
                    </div>
                    <div style={{ fontSize: 14, color: "#999999", fontWeight: 500 }}>{c.name}</div>
                  </div>
                  <ScoreCircle score={c.score} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#555555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Insiders</div>
                    <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{c.insiders}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#555555", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Volume</div>
                    <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>{c.value}</div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#555555", marginBottom: 1 }}>{c.roles}</div>
                    <div style={{ fontSize: 12, color: "#444444" }}>{c.dateRange}</div>
                  </div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#22c55e",
                    background: "rgba(34,197,94,0.08)",
                    padding: "4px 10px",
                    borderRadius: 6,
                  }}>
                    {c.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button className="btn-outline" style={{ fontSize: 14 }}>
              View all 47 active alerts →
            </button>
          </div>
        </section>

        <div className="divider" style={{ maxWidth: 1100, margin: "0 auto" }} />

        {/* Features */}
        <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 96px" }}>
          <div style={{ marginBottom: 48 }}>
            <div className="section-label">Why ClusterDesk</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
              Everything the signal demands
            </h2>
            <p style={{ color: "#666666", fontSize: 16, maxWidth: 480 }}>
              Insider cluster buying is one of the most reliable public signals in markets. We engineered a platform worthy of it.
            </p>
          </div>

          <div
            className="features-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em" }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "#666666", lineHeight: 1.6 }}>{f.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ background: "#0d0d0d", borderTop: "1px solid #161616", borderBottom: "1px solid #161616" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 24px" }}>
            <div style={{ marginBottom: 48 }}>
              <div className="section-label">Social proof</div>
              <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.03em" }}>
                Investors who stopped guessing
              </h2>
            </div>
            <div
              className="testimonials-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
            >
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="testimonial-card">
                  <div style={{ color: "#818cf8", fontSize: 32, lineHeight: 1, marginBottom: 16 }}>&ldquo;</div>
                  <p style={{ fontSize: 15, color: "#cccccc", lineHeight: 1.65, marginBottom: 20 }}>{t.quote}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: "#555555" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logo grid */}
        <div style={{ borderBottom: "1px solid #161616", padding: "40px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "#333333", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>
              Used by investors at
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
              {LOGOS.map((l) => (
                <span key={l} className="logo-item">{l}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <section id="pricing" style={{ maxWidth: 640, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
          <div className="section-label" style={{ textAlign: "center" }}>Pricing</div>
          <h2 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Free forever.
          </h2>
          <p style={{ color: "#666666", fontSize: 17, marginBottom: 48 }}>
            No credit card required. No tricks.
          </p>

          <div style={{
            background: "#111111",
            border: "1px solid #1e1e1e",
            borderRadius: 16,
            padding: "40px 40px",
            textAlign: "left",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* subtle gradient top border */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
            }} />

            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
              <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em" }}>$0</span>
              <span style={{ color: "#555555", fontSize: 15 }}>/month to start</span>
            </div>
            <p style={{ color: "#666666", fontSize: 14, marginBottom: 32 }}>
              Upgrade for more alerts, filtering, and Slack delivery. Starting at $29/mo.
            </p>

            {[
              "Up to 5 cluster alerts per week",
              "Conviction score for every alert",
              "SEC filing links on every card",
              "Email digest (daily or weekly)",
              "14-day alert history",
              "No credit card, ever — until you want more",
            ].map((item) => (
              <div key={item} className="checklist-item">
                <div className="check-icon">✓</div>
                <span>{item}</span>
              </div>
            ))}

            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 32, fontSize: 16, padding: "14px" }}>
              Get started for free →
            </button>
          </div>
        </section>

        {/* Subscribe */}
        <section style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #0d0a1e 100%)", borderTop: "1px solid #161616", padding: "96px 24px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>📬</div>
            <h2 style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
              Get your first alert in{" "}
              <span className="gradient-text">60 seconds</span>
            </h2>
            <p style={{ color: "#666666", fontSize: 16, marginBottom: 36 }}>
              Drop your email. The next cluster signal goes straight to your inbox.
            </p>

            {submitted ? (
              <div style={{
                background: "rgba(79,70,229,0.1)",
                border: "1px solid rgba(79,70,229,0.3)",
                borderRadius: 10,
                padding: "20px 28px",
                color: "#a78bfa",
                fontSize: 16,
                fontWeight: 500,
              }}>
                ✓ You&rsquo;re in. Check your inbox in a few minutes.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="subscribe-row"
                style={{ display: "flex", gap: 10 }}
              >
                <input
                  className="email-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                  Send me alerts
                </button>
              </form>
            )}

            <p style={{ color: "#333333", fontSize: 13, marginTop: 16 }}>
              No spam. Unsubscribe anytime. Your email is never shared.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid #161616", padding: "32px 24px" }}>
          <div style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 5,
                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 800,
              }}>C</div>
              <span style={{ fontWeight: 600, fontSize: 14, color: "#666666" }}>ClusterDesk</span>
            </div>
            <div style={{ display: "flex", gap: 28 }}>
              {["Privacy", "Terms", "Status", "Docs"].map((l) => (
                <a key={l} href="#" className="nav-link" style={{ fontSize: 13 }}>{l}</a>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#333333" }}>
              Not investment advice. Data from SEC EDGAR.
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
