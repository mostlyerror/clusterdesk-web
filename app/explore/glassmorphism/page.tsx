"use client";

const clusters = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiders: 3,
    amount: "$312K",
    roles: "CEO + CFO + Director",
    daysAgo: 2,
    priceChange: "+4.2%",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    amount: "$88K",
    roles: "CEO + Director",
    daysAgo: 5,
    priceChange: "+1.8%",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    amount: "$47K",
    roles: "President + Director",
    daysAgo: 7,
    priceChange: "+0.6%",
  },
];

export default function GlassmorphismPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'DM Sans', sans-serif;
        }

        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-18px) rotate(1deg); }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(-1deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-22px) rotate(0.5deg); }
        }

        @keyframes orbPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(1.08); }
        }

        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,212,255,0.3), 0 0 40px rgba(0,212,255,0.1); }
          50%       { box-shadow: 0 0 30px rgba(0,212,255,0.6), 0 0 60px rgba(0,212,255,0.2); }
        }

        @keyframes borderGlow {
          0%, 100% { border-color: rgba(0,212,255,0.3); }
          50%       { border-color: rgba(0,212,255,0.7); }
        }

        .card-0 { animation: float0 6s ease-in-out infinite; }
        .card-1 { animation: float1 7.5s ease-in-out infinite; }
        .card-2 { animation: float2 5.5s ease-in-out infinite; }

        .glow-btn {
          animation: pulseGlow 2.5s ease-in-out infinite;
          transition: background 0.2s, transform 0.15s;
        }
        .glow-btn:hover {
          background: rgba(0,212,255,0.25) !important;
          transform: translateY(-2px);
        }

        .glass-input:focus {
          outline: none;
          border-color: rgba(0,212,255,0.6) !important;
          box-shadow: 0 0 16px rgba(0,212,255,0.25);
        }

        .nav-link {
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #00D4FF; }

        .cluster-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          border-radius: 16px;
          padding: 28px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .cluster-card:hover {
          border-color: rgba(0,212,255,0.25);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(0,212,255,0.12);
        }
        .cluster-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,212,255,0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        .stat-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #00D4FF;
        }

        .stat-value {
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
          margin-top: 3px;
        }

        .score-ring {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }

        .score-inner {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(10,10,26,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00D4FF;
          animation: pulseGlow 1.5s ease-in-out infinite;
          flex-shrink: 0;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          fontFamily: "'DM Sans', sans-serif",
          background: "linear-gradient(135deg, #050510 0%, #0D0D2B 40%, #0A0A1A 70%, #050510 100%)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 18s ease infinite",
          color: "#ffffff",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Floating orbs */}
        <div
          style={{
            position: "fixed",
            top: "-15vh",
            left: "-10vw",
            width: "55vw",
            height: "55vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            animation: "orbPulse 8s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: "-20vh",
            right: "-15vw",
            width: "65vw",
            height: "65vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            animation: "orbPulse 11s ease-in-out infinite reverse",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "fixed",
            top: "40vh",
            left: "30vw",
            width: "40vw",
            height: "40vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
            animation: "orbPulse 14s ease-in-out infinite 3s",
            zIndex: 0,
          }}
        />

        {/* ── NAV ── */}
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: "rgba(5,5,16,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,212,255,0.1)",
            padding: "0 32px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #00D4FF, #8B5CF6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="4" cy="4" r="2.5" fill="white" opacity="0.9" />
                <circle cx="10" cy="4" r="2.5" fill="white" opacity="0.9" />
                <circle cx="7" cy="10" r="2.5" fill="white" opacity="0.9" />
                <line x1="4" y1="4" x2="10" y2="4" stroke="white" strokeWidth="1" opacity="0.5" />
                <line x1="4" y1="4" x2="7" y2="10" stroke="white" strokeWidth="1" opacity="0.5" />
                <line x1="10" y1="4" x2="7" y2="10" stroke="white" strokeWidth="1" opacity="0.5" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                background: "linear-gradient(90deg, #ffffff, #00D4FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CLUSTERDESK
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <a href="#" className="nav-link">Clusters</a>
            <a href="#" className="nav-link">Screener</a>
            <a href="#" className="nav-link">Alerts</a>
            <a href="#" className="nav-link">Docs</a>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div className="live-dot" />
              <span style={{ fontSize: "11px", fontWeight: 500, color: "#00D4FF", letterSpacing: "0.08em" }}>
                LIVE
              </span>
            </div>
            <button
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.3)",
                color: "#00D4FF",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              SIGN IN
            </button>
          </div>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <main
          style={{
            position: "relative",
            zIndex: 1,
            paddingTop: "100px",
            paddingBottom: "80px",
            maxWidth: "1160px",
            margin: "0 auto",
            padding: "100px 32px 80px",
          }}
        >
          {/* ── HERO ── */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "72px",
              animation: "fadeInUp 0.8s ease forwards",
            }}
          >
            {/* Status badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "100px",
                background: "rgba(0,212,255,0.08)",
                border: "1px solid rgba(0,212,255,0.2)",
                marginBottom: "28px",
              }}
            >
              <div className="live-dot" />
              <span style={{ fontSize: "11px", fontWeight: 500, color: "#00D4FF", letterSpacing: "0.1em" }}>
                3 NEW CLUSTER ALERTS TODAY
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #e0f7ff 50%, #00D4FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "block",
                }}
              >
                Insider Cluster
              </span>
              <span
                style={{
                  background: "linear-gradient(135deg, #8B5CF6 0%, #C084FC 50%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "block",
                }}
              >
                Intelligence
              </span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                fontWeight: 300,
                color: "rgba(255,255,255,0.55)",
                maxWidth: "520px",
                margin: "0 auto 12px",
                lineHeight: 1.65,
                letterSpacing: "0.01em",
              }}
            >
              When 2+ executives at micro-cap companies buy simultaneously,
              it&apos;s the market&apos;s clearest signal. We surface it first.
            </p>

            {/* Stats bar */}
            <div
              style={{
                display: "inline-flex",
                gap: "32px",
                marginTop: "36px",
                padding: "16px 32px",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
              }}
            >
              {[
                { label: "Clusters Tracked", value: "1,847" },
                { label: "Avg. Return (90d)", value: "+23.4%" },
                { label: "Win Rate", value: "68%" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 500,
                      color: "rgba(0,212,255,0.7)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginTop: "2px",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION HEADER ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "28px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#00D4FF",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                Active Clusters
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", fontWeight: 300 }}>
                Sorted by conviction score — updated in real time
              </p>
            </div>
            <div
              style={{
                padding: "7px 14px",
                borderRadius: "8px",
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.25)",
                fontSize: "11px",
                fontWeight: 500,
                color: "#C084FC",
                letterSpacing: "0.08em",
                cursor: "pointer",
              }}
            >
              VIEW ALL →
            </div>
          </div>

          {/* ── CLUSTER CARDS ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
              marginBottom: "72px",
            }}
          >
            {clusters.map((c, i) => (
              <div
                key={c.ticker}
                className={`cluster-card card-${i}`}
                style={{ animationDelay: `${i * 0.8}s` }}
              >
                {/* Card top: ticker + score ring */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        color: "#ffffff",
                        marginBottom: "3px",
                      }}
                    >
                      {c.ticker}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.45)",
                        maxWidth: "180px",
                        lineHeight: 1.3,
                      }}
                    >
                      {c.company}
                    </div>
                  </div>

                  {/* Score ring */}
                  <div
                    className="score-ring"
                    style={{
                      background: `conic-gradient(#00D4FF calc(${c.score} * 1%), #1a1a3a calc(${c.score} * 1%))`,
                      boxShadow:
                        c.score > 80
                          ? "0 0 20px rgba(0,212,255,0.45)"
                          : "0 0 12px rgba(0,212,255,0.2)",
                    }}
                  >
                    <div className="score-inner">
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#8B5CF6",
                          lineHeight: 1,
                        }}
                      >
                        {c.score}
                      </span>
                      <span
                        style={{
                          fontSize: "8px",
                          fontWeight: 500,
                          color: "rgba(139,92,246,0.7)",
                          letterSpacing: "0.06em",
                          marginTop: "1px",
                        }}
                      >
                        SCORE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginBottom: "20px",
                  }}
                >
                  <span
                    className="tag-pill"
                    style={{
                      background: "rgba(0,212,255,0.08)",
                      border: "1px solid rgba(0,212,255,0.2)",
                      color: "#00D4FF",
                    }}
                  >
                    {c.insiders} Insiders
                  </span>
                  <span
                    className="tag-pill"
                    style={{
                      background: "rgba(139,92,246,0.08)",
                      border: "1px solid rgba(139,92,246,0.2)",
                      color: "#C084FC",
                    }}
                  >
                    {c.daysAgo}d ago
                  </span>
                  <span
                    className="tag-pill"
                    style={{
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.2)",
                      color: "#34D399",
                    }}
                  >
                    {c.priceChange}
                  </span>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    background: "linear-gradient(90deg, rgba(0,212,255,0.15), transparent)",
                    marginBottom: "20px",
                  }}
                />

                {/* Stats grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <div className="stat-label">Total Amount</div>
                    <div className="stat-value">{c.amount}</div>
                  </div>
                  <div>
                    <div className="stat-label">Cluster Size</div>
                    <div className="stat-value">{c.insiders} Buyers</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div className="stat-label">Roles</div>
                    <div className="stat-value" style={{ fontSize: "13px" }}>
                      {c.roles}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "8px",
                    background: "rgba(0,212,255,0.06)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    textAlign: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,212,255,0.14)";
                    e.currentTarget.style.borderColor = "rgba(0,212,255,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0,212,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)";
                  }}
                >
                  VIEW FULL CLUSTER →
                </button>
              </div>
            ))}
          </div>

          {/* ── HOW IT WORKS ── */}
          <div style={{ marginBottom: "80px" }}>
            <h2
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#00D4FF",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "28px",
                textAlign: "center",
              }}
            >
              Signal Architecture
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              {[
                {
                  icon: "⬡",
                  title: "Detect",
                  body: "SEC Form 4 filings parsed in real time. We identify simultaneous buys at the same company.",
                },
                {
                  icon: "⬡",
                  title: "Score",
                  body: "Conviction score weighs cluster size, recency, dollar amount, and role seniority.",
                },
                {
                  icon: "⬡",
                  title: "Alert",
                  body: "Instant notification the moment a new cluster qualifies. No lag, no noise.",
                },
                {
                  icon: "⬡",
                  title: "Track",
                  body: "Monitor every cluster's performance against its entry price over 30, 60, 90 days.",
                },
              ].map((step, i) => (
                <div
                  key={step.title}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "12px",
                    padding: "24px 22px",
                    animation: `fadeInUp 0.8s ease ${0.1 * i}s both`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "rgba(139,92,246,0.6)",
                      letterSpacing: "0.1em",
                      marginBottom: "10px",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#ffffff",
                      marginBottom: "8px",
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.45)",
                      lineHeight: 1.6,
                    }}
                  >
                    {step.body}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── EMAIL CAPTURE ── */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(0,212,255,0.15)",
              borderRadius: "20px",
              padding: "56px 48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              animation: "borderGlow 4s ease-in-out infinite",
            }}
          >
            {/* Background glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at center top, rgba(0,212,255,0.07) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "5px 14px",
                  borderRadius: "100px",
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  marginBottom: "22px",
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: 500, color: "#C084FC", letterSpacing: "0.1em" }}>
                  EARLY ACCESS
                </span>
              </div>

              <h2
                style={{
                  fontSize: "clamp(24px, 4vw, 40px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: "12px",
                  background: "linear-gradient(135deg, #ffffff 0%, #00D4FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Get Cluster Alerts
              </h2>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.45)",
                  maxWidth: "420px",
                  margin: "0 auto 36px",
                  lineHeight: 1.6,
                }}
              >
                Daily briefing: new clusters, score changes, and price performance.
                Free for micro-cap investors.
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                style={{
                  display: "flex",
                  gap: "10px",
                  maxWidth: "440px",
                  margin: "0 auto",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="glass-input"
                  style={{
                    flex: "1 1 220px",
                    padding: "14px 18px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 400,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  type="submit"
                  className="glow-btn"
                  style={{
                    padding: "14px 24px",
                    borderRadius: "10px",
                    background: "rgba(0,212,255,0.15)",
                    border: "1px solid rgba(0,212,255,0.4)",
                    color: "#00D4FF",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  ACTIVATE ALERTS
                </button>
              </form>

              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.25)",
                  marginTop: "16px",
                  letterSpacing: "0.04em",
                }}
              >
                No spam. Unsubscribe any time.
              </p>
            </div>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer
          style={{
            position: "relative",
            zIndex: 1,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "28px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            maxWidth: "1160px",
            margin: "0 auto",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              background: "linear-gradient(90deg, #ffffff, #00D4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CLUSTERDESK
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.04em",
            }}
          >
            Not investment advice. For informational purposes only.
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.3)",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00D4FF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              >
                {l}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
