"use client";

import { useState } from "react";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bgGreen: "#1A2F1A",
  bgBrown: "#1C1208",
  parchment: "#E8DFC8",
  parchmentMuted: "#C8BFA8",
  gold: "#B8942A",
  goldFaint: "rgba(184, 148, 42, 0.18)",
  goldBorder: "rgba(184, 148, 42, 0.45)",
  muted: "#8A7A5A",
  border: "#2A3A2A",
  cardBg: "#1F2E1F",
  cardBgAlt: "#1A1A0E",
  inkLight: "rgba(232, 223, 200, 0.55)",
} as const;

// ─── Sample data ────────────────────────────────────────────────────────────────
const clusters = [
  {
    numeral: "I",
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiderCount: 3,
    totalValue: 312000,
    window: "May 1–5, 2026",
    windowDays: 5,
    marketCap: "$412M",
    roles: ["Chief Executive Officer", "Chief Financial Officer", "Independent Director"],
  },
  {
    numeral: "II",
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiderCount: 2,
    totalValue: 88000,
    window: "May 6–8, 2026",
    windowDays: 3,
    marketCap: "$98M",
    roles: ["Chief Executive Officer", "Board Director"],
  },
  {
    numeral: "III",
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiderCount: 2,
    totalValue: 47000,
    window: "May 9–10, 2026",
    windowDays: 2,
    marketCap: "$74M",
    roles: ["President", "Board Director"],
  },
] as const;

// ─── Helpers ────────────────────────────────────────────────────────────────────
function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function latinClass(score: number): { label: string; abbr: string } {
  if (score >= 80) return { label: "Classis Prima", abbr: "First Class" };
  if (score >= 60) return { label: "Classis Secunda", abbr: "Second Class" };
  if (score >= 40) return { label: "Classis Tertia", abbr: "Third Class" };
  return { label: "Classis Quarta", abbr: "Fourth Class" };
}

function insiderWord(n: number): string {
  const words = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  return words[n] ?? String(n);
}

function ordinalWord(n: number): string {
  const words = ["", "first", "second", "third", "fourth", "fifth"];
  return words[n] ?? `${n}th`;
}

function dayWord(n: number): string {
  if (n === 1) return "a single day";
  const words = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  return `${words[n] ?? n} days`;
}

function buildProseNarrative(c: (typeof clusters)[number]): string {
  const cls = latinClass(c.score);
  const insiderStr = insiderWord(c.insiderCount);
  const valueStr = formatCurrency(c.totalValue);
  const rolesStr = c.roles.slice(0, -1).join(", ") + " and " + c.roles[c.roles.length - 1];
  return (
    `${insiderStr.charAt(0).toUpperCase() + insiderStr.slice(1)} officers of ${c.company} — ` +
    `namely the ${rolesStr} — made concurrent open-market purchases ` +
    `totalling ${valueStr} over a period of ${dayWord(c.windowDays)}, spanning ${c.window}. ` +
    `The enterprise commands a market capitalisation of approximately ${c.marketCap}. ` +
    `Upon rigorous analysis of timing, magnitude, and officer seniority, ` +
    `this cluster has been assigned a conviction score of ${c.score} points ` +
    `and accordingly classified as ${cls.label} — ${cls.abbr}.`
  );
}

// ─── Score Seal ────────────────────────────────────────────────────────────────
function ScoreSeal({ score }: { score: number }) {
  const cls = latinClass(score);
  const pct = score / 100;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width={72} height={72} viewBox="0 0 72 72">
        {/* Outer decorative ring */}
        <circle cx={36} cy={36} r={34} fill="none" stroke={C.border} strokeWidth={1} />
        {/* Track */}
        <circle cx={36} cy={36} r={r} fill="none" stroke="rgba(184,148,42,0.12)" strokeWidth={3} />
        {/* Progress */}
        <circle
          cx={36}
          cy={36}
          r={r}
          fill="none"
          stroke={C.gold}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.25}
          transform="rotate(-90 36 36)"
        />
        {/* Score numeral */}
        <text x={36} y={39} textAnchor="middle" fill={C.gold} fontSize={15} fontFamily="EB Garamond, serif" fontWeight={600}>
          {score}
        </text>
      </svg>
      <span style={{ fontFamily: "EB Garamond, serif", fontStyle: "italic", fontSize: 11, color: C.muted, letterSpacing: "0.04em" }}>
        {cls.label}
      </span>
    </div>
  );
}

// ─── Divider ───────────────────────────────────────────────────────────────────
function Divider({ glyph = "§" }: { glyph?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, margin: "40px 0" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.border})` }} />
      <span style={{ fontFamily: "EB Garamond, serif", fontSize: 22, color: C.gold, userSelect: "none", lineHeight: 1 }}>{glyph}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.border})` }} />
    </div>
  );
}

// ─── Cluster Card ──────────────────────────────────────────────────────────────
function ClusterCard({ cluster, expanded, onToggle }: {
  cluster: (typeof clusters)[number];
  expanded: boolean;
  onToggle: () => void;
}) {
  const prose = buildProseNarrative(cluster);
  return (
    <article
      style={{
        background: C.cardBg,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${C.gold}`,
        padding: "32px 36px",
        marginBottom: 28,
        position: "relative",
        cursor: "pointer",
        transition: "border-color 0.25s",
      }}
      onClick={onToggle}
    >
      {/* Roman numeral stamp */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 24,
          fontFamily: "EB Garamond, serif",
          fontSize: 13,
          color: C.muted,
          letterSpacing: "0.12em",
          fontStyle: "italic",
        }}
      >
        Case No. {cluster.numeral}
      </div>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
        <ScoreSeal score={cluster.score} />

        <div style={{ flex: 1, minWidth: 200 }}>
          {/* Subject heading */}
          <div
            style={{
              fontFamily: "EB Garamond, serif",
              fontStyle: "italic",
              fontSize: 11,
              color: C.muted,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Subject
          </div>
          <h2
            style={{
              fontFamily: "EB Garamond, serif",
              fontSize: 26,
              fontWeight: 500,
              color: C.parchment,
              margin: 0,
              lineHeight: 1.15,
              fontStyle: "italic",
            }}
          >
            {cluster.company}
          </h2>
          <div
            style={{
              fontFamily: "EB Garamond, serif",
              fontSize: 13,
              color: C.gold,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            {cluster.ticker}
          </div>
        </div>

        {/* Stats gloss */}
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
          {[
            { label: "Officers", value: String(cluster.insiderCount) },
            { label: "Aggregate", value: formatCurrency(cluster.totalValue) },
            { label: "Period", value: cluster.window },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontStyle: "italic",
                  fontSize: 10,
                  color: C.muted,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 2,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontSize: 17,
                  color: C.parchmentMuted,
                  fontWeight: 500,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prose narrative */}
      <div
        style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <p
          style={{
            fontFamily: "EB Garamond, serif",
            fontSize: 16.5,
            lineHeight: 1.85,
            color: C.inkLight,
            margin: 0,
            fontStyle: "italic",
          }}
        >
          {prose}
        </p>
      </div>

      {/* Expandable officers */}
      {expanded && (
        <div
          style={{
            marginTop: 20,
            padding: "18px 20px",
            background: C.goldFaint,
            border: `1px solid ${C.goldBorder}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              fontFamily: "EB Garamond, serif",
              fontStyle: "italic",
              fontSize: 11,
              color: C.gold,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Officers of Record
          </div>
          {cluster.roles.map((role, i) => (
            <div
              key={role}
              style={{
                fontFamily: "EB Garamond, serif",
                fontSize: 15,
                color: C.parchmentMuted,
                lineHeight: 1.7,
                paddingLeft: 8,
                borderLeft: `2px solid ${C.goldBorder}`,
                marginBottom: i < cluster.roles.length - 1 ? 6 : 0,
              }}
            >
              {role}
            </div>
          ))}
        </div>
      )}

      {/* Toggle hint */}
      <div
        style={{
          marginTop: 16,
          fontFamily: "EB Garamond, serif",
          fontStyle: "italic",
          fontSize: 12,
          color: C.muted,
          textAlign: "right",
        }}
      >
        {expanded ? "▲ Conceal officers" : "▼ Reveal officers of record"}
      </div>
    </article>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function DarkAcademicPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleToggle(i: number) {
    setExpandedIndex(expandedIndex === i ? null : i);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <>
      {/* ── Global styles ───────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          background: #1A2F1A;
          color: #E8DFC8;
        }

        .da-page {
          min-height: 100vh;
          font-family: 'EB Garamond', serif;
          color: #E8DFC8;
          /* Book-spine texture: subtle repeating vertical gradient columns */
          background-color: #1A2F1A;
          background-image:
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 48px,
              rgba(20, 35, 20, 0.55) 48px,
              rgba(20, 35, 20, 0.55) 50px
            ),
            repeating-linear-gradient(
              180deg,
              transparent,
              transparent 72px,
              rgba(0,0,0,0.08) 72px,
              rgba(0,0,0,0.08) 74px
            );
        }

        /* Subtle vignette overlay */
        .da-page::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(10,16,10,0.55) 100%);
          z-index: 0;
        }

        .da-content {
          position: relative;
          z-index: 1;
          max-width: 820px;
          margin: 0 auto;
          padding: 60px 28px 80px;
        }

        /* Gold rule animation on hover */
        article:hover {
          border-color: rgba(184, 148, 42, 0.6) !important;
        }

        input[type="email"].da-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(184,148,42,0.5);
          color: #E8DFC8;
          font-family: 'EB Garamond', serif;
          font-size: 17px;
          padding: 8px 4px;
          outline: none;
          width: 100%;
          letter-spacing: 0.02em;
          transition: border-color 0.2s;
        }

        input[type="email"].da-input::placeholder {
          color: #8A7A5A;
          font-style: italic;
        }

        input[type="email"].da-input:focus {
          border-bottom-color: #B8942A;
        }

        button.da-btn {
          background: transparent;
          border: 1px solid #B8942A;
          color: #B8942A;
          font-family: 'EB Garamond', serif;
          font-size: 15px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 10px 28px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        button.da-btn:hover {
          background: rgba(184,148,42,0.12);
          color: #E8DFC8;
        }

        ::selection {
          background: rgba(184,148,42,0.28);
          color: #E8DFC8;
        }
      `}</style>

      <div className="da-page">
        <div className="da-content">

          {/* ── Masthead ───────────────────────────────────────────────────── */}
          <header style={{ textAlign: "center", paddingBottom: 16 }}>
            {/* Epigraph ornament */}
            <div
              style={{
                fontFamily: "EB Garamond, serif",
                fontSize: 18,
                color: C.gold,
                letterSpacing: "0.3em",
                marginBottom: 20,
                opacity: 0.7,
              }}
            >
              ✦ &nbsp;&nbsp; ✦ &nbsp;&nbsp; ✦
            </div>

            <h1
              style={{
                fontFamily: "EB Garamond, serif",
                fontStyle: "italic",
                fontSize: "clamp(38px, 6vw, 58px)",
                fontWeight: 400,
                color: C.gold,
                letterSpacing: "0.04em",
                lineHeight: 1,
                marginBottom: 14,
              }}
            >
              ClusterDesk
            </h1>

            <p
              style={{
                fontFamily: "EB Garamond, serif",
                fontStyle: "italic",
                fontSize: 19,
                color: C.muted,
                letterSpacing: "0.06em",
                marginBottom: 28,
              }}
            >
              Intelligence for the discerning investor.
            </p>

            {/* Horizontal rule with flourish */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${C.gold})` }} />
              <span style={{ fontFamily: "EB Garamond, serif", fontSize: 20, color: C.gold }}>¶</span>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${C.gold})` }} />
            </div>
          </header>

          {/* ── Introduction ───────────────────────────────────────────────── */}
          <section style={{ padding: "36px 0 8px" }}>
            <p
              style={{
                fontFamily: "EB Garamond, serif",
                fontSize: 18,
                lineHeight: 2,
                color: C.inkLight,
                textIndent: "2em",
              }}
            >
              There exists, within the voluminous archives of the Securities and Exchange Commission,
              a class of filing that merits the attention of the most rigorous analyst — the Form 4.
              When officers of the same enterprise make open-market purchases in close temporal proximity,
              it betrays a shared conviction that is rarely accidental. ClusterDesk exists to surface
              precisely these moments: the quiet accumulation of shares by those who know most,
              before the rest of the market has had occasion to take notice.
            </p>
            <p
              style={{
                fontFamily: "EB Garamond, serif",
                fontSize: 18,
                lineHeight: 2,
                color: C.inkLight,
                textIndent: "2em",
                marginTop: 18,
              }}
            >
              What follows are the most recent observations from our register of cluster purchases —
              each examined with the care of a scholar, each rated upon a proprietary scale
              of conviction. These are not rumours. These are transactions, duly recorded,
              duly weighed, and presented here for your consideration.
            </p>
          </section>

          <Divider glyph="§" />

          {/* ── Section heading ─────────────────────────────────────────────── */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                fontFamily: "EB Garamond, serif",
                fontStyle: "italic",
                fontSize: 11,
                color: C.muted,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Register of Current Observations
            </div>
            <h2
              style={{
                fontFamily: "EB Garamond, serif",
                fontSize: 30,
                fontWeight: 400,
                color: C.parchment,
                lineHeight: 1.2,
                fontStyle: "italic",
              }}
            >
              Active Cluster Purchases
            </h2>
          </div>

          {/* ── Cluster Cards ───────────────────────────────────────────────── */}
          {clusters.map((c, i) => (
            <ClusterCard
              key={c.ticker}
              cluster={c}
              expanded={expandedIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}

          <Divider glyph="§" />

          {/* ── Methodology ────────────────────────────────────────────────── */}
          <section>
            <div
              style={{
                fontFamily: "EB Garamond, serif",
                fontStyle: "italic",
                fontSize: 11,
                color: C.muted,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              On Method
            </div>
            <h2
              style={{
                fontFamily: "EB Garamond, serif",
                fontSize: 28,
                fontWeight: 400,
                color: C.parchment,
                marginBottom: 20,
                fontStyle: "italic",
              }}
            >
              The Conviction Index: A Note on Scoring
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 20,
                marginTop: 24,
              }}
            >
              {[
                {
                  label: "Classis Prima",
                  range: "80 – 100",
                  desc: "Three or more senior officers purchasing within a compressed window at a micro-cap enterprise. The rarest and most consequential grade.",
                },
                {
                  label: "Classis Secunda",
                  range: "60 – 79",
                  desc: "Two or more officers of material seniority acting in concert. Elevated conviction warranting close attention.",
                },
                {
                  label: "Classis Tertia",
                  range: "40 – 59",
                  desc: "Concurrent purchases of modest aggregate value. Worthy of note but demanding further corroboration before commitment.",
                },
              ].map((cls) => (
                <div
                  key={cls.label}
                  style={{
                    background: C.cardBgAlt,
                    border: `1px solid ${C.border}`,
                    padding: "22px 20px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "EB Garamond, serif",
                      fontStyle: "italic",
                      fontSize: 18,
                      color: C.gold,
                      marginBottom: 4,
                    }}
                  >
                    {cls.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "EB Garamond, serif",
                      fontSize: 12,
                      color: C.muted,
                      letterSpacing: "0.1em",
                      marginBottom: 12,
                    }}
                  >
                    Score {cls.range}
                  </div>
                  <p
                    style={{
                      fontFamily: "EB Garamond, serif",
                      fontSize: 15,
                      lineHeight: 1.75,
                      color: C.inkLight,
                      fontStyle: "italic",
                    }}
                  >
                    {cls.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <Divider glyph="¶" />

          {/* ── Subscribe ──────────────────────────────────────────────────── */}
          <section>
            <div
              style={{
                background: C.cardBgAlt,
                border: `1px solid ${C.gold}`,
                padding: "44px 40px",
                textAlign: "center",
                position: "relative",
              }}
            >
              {/* Corner ornaments */}
              {(["topLeft", "topRight", "bottomLeft", "bottomRight"] as const).map((corner) => (
                <span
                  key={corner}
                  style={{
                    position: "absolute",
                    fontFamily: "EB Garamond, serif",
                    fontSize: 18,
                    color: C.gold,
                    opacity: 0.5,
                    ...(corner === "topLeft" ? { top: 10, left: 14 } :
                       corner === "topRight" ? { top: 10, right: 14 } :
                       corner === "bottomLeft" ? { bottom: 10, left: 14 } :
                       { bottom: 10, right: 14 }),
                  }}
                >
                  ✦
                </span>
              ))}

              <div
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontStyle: "italic",
                  fontSize: 11,
                  color: C.muted,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Private Correspondence
              </div>

              <h2
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontSize: 32,
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: C.parchment,
                  marginBottom: 14,
                  lineHeight: 1.2,
                }}
              >
                Request Admittance to the Inner Circle
              </h2>

              <p
                style={{
                  fontFamily: "EB Garamond, serif",
                  fontSize: 17,
                  lineHeight: 1.85,
                  color: C.inkLight,
                  fontStyle: "italic",
                  maxWidth: 520,
                  margin: "0 auto 32px",
                }}
              >
                Each week, the most significant cluster purchase alerts are dispatched
                to a select list of subscribers — delivered with the discretion
                and gravity that such intelligence deserves.
              </p>

              {submitted ? (
                <div
                  style={{
                    fontFamily: "EB Garamond, serif",
                    fontStyle: "italic",
                    fontSize: 18,
                    color: C.gold,
                    letterSpacing: "0.04em",
                  }}
                >
                  Your application has been received. We shall be in correspondence.
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    gap: 16,
                    maxWidth: 480,
                    margin: "0 auto",
                    alignItems: "flex-end",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "EB Garamond, serif",
                        fontStyle: "italic",
                        fontSize: 12,
                        color: C.muted,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      Your Address
                    </label>
                    <input
                      type="email"
                      className="da-input"
                      placeholder="correspondence@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="da-btn">
                    Apply
                  </button>
                </form>
              )}
            </div>
          </section>

          <Divider glyph="§" />

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <footer style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "EB Garamond, serif",
                fontStyle: "italic",
                fontSize: 13,
                color: C.muted,
                lineHeight: 2,
                letterSpacing: "0.03em",
              }}
            >
              ClusterDesk. <em>Intelligence for the Discerning Investor.</em> New York. Est. MMXXVI.
              <br />
              All data derived from public filings submitted to the Securities and Exchange Commission.
              <br />
              This publication constitutes neither investment advice nor a solicitation of any kind.
              Past patterns of insider activity are no guarantee of future returns.
            </p>
            <p
              style={{
                fontFamily: "EB Garamond, serif",
                fontSize: 12,
                color: C.border,
                marginTop: 20,
                letterSpacing: "0.06em",
              }}
            >
              ClusterDesk, Inc. · {new Date().getFullYear()} · All rights reserved.
            </p>
          </footer>

        </div>
      </div>
    </>
  );
}
