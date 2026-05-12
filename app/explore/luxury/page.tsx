"use client";

import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#F5EFE6",
  bgGrad: "linear-gradient(135deg, #F5EFE6 0%, #EFE8DC 100%)",
  ink: "#1C1410",
  inkMuted: "#5C4A38",
  inkFaint: "#9C8878",
  gold: "#C9A84C",
  goldFaint: "rgba(201, 168, 76, 0.5)",
  goldVeryFaint: "rgba(201, 168, 76, 0.12)",
  card: "#F9F4EE",
  cardBorder: "#E8DDD0",
} as const;

// ─── Sample data ──────────────────────────────────────────────────────────────
const clusters = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiderCount: 3,
    totalValue: "$312K",
    roles: "CEO · CFO · Director",
    window: "May 1–5, 2026",
    signal: "Strong conviction",
    change: "+18.4%",
    marketCap: "$412M",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiderCount: 2,
    totalValue: "$88K",
    roles: "CEO · Director",
    window: "May 6–8, 2026",
    signal: "Elevated conviction",
    change: "+11.2%",
    marketCap: "$98M",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiderCount: 2,
    totalValue: "$47K",
    roles: "President · Director",
    window: "May 9–10, 2026",
    signal: "Moderate conviction",
    change: "+6.7%",
    marketCap: "$74M",
  },
];

// ─── Score arc (CSS-only ring) ─────────────────────────────────────────────────
function ScoreArc({ score }: { score: number }) {
  // Use conic-gradient to draw the arc portion
  const pct = score / 100;
  const filledColor = C.gold;
  const trackColor = C.cardBorder;

  return (
    <div
      style={{
        position: "relative",
        width: 64,
        height: 64,
        flexShrink: 0,
      }}
    >
      {/* Outer ring via conic-gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(${filledColor} 0% ${pct * 100}%, ${trackColor} ${pct * 100}% 100%)`,
        }}
      />
      {/* Inner mask to create donut */}
      <div
        style={{
          position: "absolute",
          inset: 8,
          borderRadius: "50%",
          background: C.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 15,
            fontWeight: 600,
            color: C.ink,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

// ─── Hairline divider ──────────────────────────────────────────────────────────
function Hairline({ style }: { style?: React.CSSProperties }) {
  return (
    <hr
      style={{
        border: "none",
        borderTop: `0.5px solid ${C.goldFaint}`,
        margin: 0,
        ...style,
      }}
    />
  );
}

// ─── Stat pill ─────────────────────────────────────────────────────────────────
function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontVariant: "small-caps",
          color: C.gold,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 15,
          fontWeight: 500,
          color: C.ink,
          letterSpacing: "0.01em",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Cluster card ──────────────────────────────────────────────────────────────
function ClusterCard({
  cluster,
  rank,
}: {
  cluster: (typeof clusters)[number];
  rank: number;
}) {
  return (
    <div
      style={{
        background: C.card,
        borderTop: `3px solid ${C.gold}`,
        borderRadius: "0 0 2px 2px",
        padding: "28px 32px 26px",
        position: "relative",
        boxShadow: "0 1px 4px rgba(28,20,16,0.05), 0 0 0 1px rgba(28,20,16,0.04)",
      }}
    >
      {/* Rank watermark */}
      <span
        style={{
          position: "absolute",
          top: 22,
          right: 32,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 11,
          fontWeight: 400,
          letterSpacing: "0.2em",
          color: C.inkFaint,
          fontVariant: "small-caps",
        }}
      >
        No.{String(rank).padStart(2, "0")}
      </span>

      {/* Top row: ticker + company + arc */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: C.ink,
              lineHeight: 1,
              marginBottom: 5,
            }}
          >
            {cluster.ticker}
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 13,
              fontWeight: 400,
              color: C.inkMuted,
              letterSpacing: "0.03em",
            }}
          >
            {cluster.company}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: 2 }}>
          <ScoreArc score={cluster.score} />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.gold,
              fontVariant: "small-caps",
            }}
          >
            Score
          </span>
        </div>
      </div>

      <Hairline style={{ marginBottom: 18 }} />

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px 8px",
          marginBottom: 18,
        }}
      >
        <StatItem label="Insiders" value={`${cluster.insiderCount}`} />
        <StatItem label="Capital" value={cluster.totalValue} />
        <StatItem label="Window" value={cluster.window} />
        <StatItem label="Market Cap" value={cluster.marketCap} />
      </div>

      <Hairline style={{ marginBottom: 14 }} />

      {/* Bottom row: roles + signal + change */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 13,
            fontStyle: "italic",
            color: C.inkMuted,
            letterSpacing: "0.01em",
          }}
        >
          {cluster.roles}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.inkFaint,
              fontVariant: "small-caps",
            }}
          >
            {cluster.signal}
          </span>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 15,
              fontWeight: 600,
              color: C.gold,
              letterSpacing: "0.02em",
            }}
          >
            {cluster.change}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function LuxuryPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          background: #F5EFE6;
        }

        ::selection {
          background: rgba(201, 168, 76, 0.25);
          color: #1C1410;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #F5EFE6 inset;
          -webkit-text-fill-color: #1C1410;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: C.bgGrad,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: C.ink,
        }}
      >
        {/* ── Navigation ── */}
        <nav
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "28px 40px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Wordmark */}
          <div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.ink,
                borderBottom: `1.5px solid ${C.gold}`,
                paddingBottom: 3,
              }}
            >
              ClusterDesk
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["Signals", "Methodology", "Access"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: C.inkMuted,
                  textDecoration: "none",
                  fontVariant: "small-caps",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.inkMuted)}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        {/* Top hairline */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <Hairline />
        </div>

        {/* ── Hero ── */}
        <header
          style={{
            maxWidth: 740,
            margin: "0 auto",
            padding: "72px 40px 64px",
            textAlign: "center",
          }}
        >
          {/* Overline */}
          <p
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 22,
              fontVariant: "small-caps",
            }}
          >
            Micro-Cap Insider Intelligence
          </p>

          {/* Main headline */}
          <h1
            style={{
              fontSize: "clamp(42px, 6vw, 68px)",
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: C.ink,
              marginBottom: 20,
            }}
          >
            Where insiders cluster,
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>
              opportunity follows.
            </em>
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontSize: 32,
              fontWeight: 300,
              fontStyle: "italic",
              color: C.inkMuted,
              letterSpacing: "0.01em",
              lineHeight: 1.35,
              marginBottom: 14,
            }}
          >
            Intelligence on insider conviction
          </p>

          {/* Body */}
          <p
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: C.inkFaint,
              lineHeight: 1.7,
              maxWidth: 480,
              margin: "0 auto",
              letterSpacing: "0.01em",
            }}
          >
            We surface the moments when two or more executives at the same
            micro-cap company buy stock within days of each other — a rare
            signal of shared private conviction.
          </p>
        </header>

        {/* ── Divider with label ── */}
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <Hairline style={{ flex: 1 }} />
          <span
            style={{
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: C.gold,
              whiteSpace: "nowrap",
              fontVariant: "small-caps",
            }}
          >
            Recent Cluster Signals
          </span>
          <Hairline style={{ flex: 1 }} />
        </div>

        {/* ── Date stamp ── */}
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "0 40px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontStyle: "italic",
              color: C.inkFaint,
              letterSpacing: "0.03em",
            }}
          >
            Updated May 10, 2026
          </span>
        </div>

        {/* ── Cards grid ── */}
        <main
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "0 40px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
            marginBottom: 80,
          }}
        >
          {clusters.map((cluster, i) => (
            <ClusterCard key={cluster.ticker} cluster={cluster} rank={i + 1} />
          ))}
        </main>

        {/* ── Methodology strip ── */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <Hairline style={{ marginBottom: 48 }} />
        </div>

        <section
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "0 40px 80px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 20,
              fontVariant: "small-caps",
            }}
          >
            The Method
          </p>
          <p
            style={{
              fontSize: 19,
              fontWeight: 300,
              fontStyle: "italic",
              color: C.inkMuted,
              lineHeight: 1.7,
              letterSpacing: "0.01em",
              marginBottom: 36,
            }}
          >
            The cluster score weighs the number of insiders, the size of their
            purchases relative to each insider's historical activity, the
            tightness of the buying window, and the seniority of each
            participant. A score above 70 is rare. Above 85 is exceptional.
          </p>

          {/* Three pillars */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: C.cardBorder,
              border: `1px solid ${C.cardBorder}`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {[
              {
                num: "I",
                label: "Concurrence",
                body: "Multiple insiders acting within the same narrow window, independently",
              },
              {
                num: "II",
                label: "Materiality",
                body: "Purchase size meaningful relative to each insider's compensation and history",
              },
              {
                num: "III",
                label: "Seniority",
                body: "C-suite and board members carry greater informational proximity",
              },
            ].map((pillar) => (
              <div
                key={pillar.num}
                style={{
                  background: C.card,
                  padding: "28px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 400,
                    letterSpacing: "0.2em",
                    color: C.gold,
                    marginBottom: 10,
                  }}
                >
                  {pillar.num}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: C.ink,
                    marginBottom: 10,
                    fontVariant: "small-caps",
                    textTransform: "uppercase",
                  }}
                >
                  {pillar.label}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: C.inkMuted,
                    lineHeight: 1.6,
                  }}
                >
                  {pillar.body}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Email capture ── */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <Hairline style={{ marginBottom: 72 }} />
        </div>

        <section
          style={{
            maxWidth: 520,
            margin: "0 auto",
            padding: "0 40px 96px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 16,
              fontVariant: "small-caps",
            }}
          >
            Private Access
          </p>

          <h2
            style={{
              fontSize: 34,
              fontWeight: 300,
              lineHeight: 1.25,
              color: C.ink,
              marginBottom: 12,
              letterSpacing: "-0.01em",
            }}
          >
            Receive signals before
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>
              the market does.
            </em>
          </h2>

          <p
            style={{
              fontSize: 15,
              fontWeight: 400,
              color: C.inkFaint,
              lineHeight: 1.65,
              marginBottom: 36,
              letterSpacing: "0.01em",
            }}
          >
            Daily briefings delivered before U.S. market open.
            <br />
            New clusters only. No noise.
          </p>

          {submitted ? (
            <div
              style={{
                padding: "22px 32px",
                border: `0.5px solid ${C.gold}`,
                background: C.goldVeryFaint,
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  fontStyle: "italic",
                  color: C.inkMuted,
                  letterSpacing: "0.02em",
                }}
              >
                Thank you. We will be in touch.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "stretch",
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 16,
                  fontWeight: 400,
                  color: C.ink,
                  background: "transparent",
                  border: "none",
                  borderBottom: `1.5px solid ${C.gold}`,
                  padding: "12px 2px",
                  outline: "none",
                  letterSpacing: "0.02em",
                  width: "100%",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderBottomColor = C.ink;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderBottomColor = C.gold;
                }}
              />
              <button
                type="submit"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: C.gold,
                  background: C.ink,
                  border: "none",
                  padding: "16px 32px",
                  cursor: "pointer",
                  marginTop: 8,
                  fontVariant: "small-caps",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Request Access
              </button>
            </form>
          )}
        </section>

        {/* ── Footer ── */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 40px" }}>
          <Hairline style={{ marginBottom: 32 }} />
        </div>

        <footer
          style={{
            padding: "0 40px 48px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.12em",
              color: C.inkFaint,
              lineHeight: 1.7,
              marginBottom: 8,
            }}
          >
            ClusterDesk is not a registered investment adviser. Nothing herein
            constitutes investment advice or a solicitation to buy or sell any
            security.
          </p>
          <p
            style={{
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: "0.08em",
              color: C.inkFaint,
              opacity: 0.6,
            }}
          >
            &copy; 2026 ClusterDesk &ensp;&middot;&ensp; All rights reserved
          </p>
        </footer>
      </div>
    </>
  );
}
