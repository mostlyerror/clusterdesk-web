"use client";

import React, { useState } from "react";

const clusters = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiders: 3,
    totalValue: "$312K",
    roles: "Chief Executive + Chief Financial + Director",
    daysSpan: 4,
    priceChange: "+14.2%",
    conviction: "CRITICAL",
    psi: 87,
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    totalValue: "$88K",
    roles: "Chief Executive + Director",
    daysSpan: 6,
    priceChange: "+8.7%",
    conviction: "ELEVATED",
    psi: 74,
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    totalValue: "$47K",
    roles: "Chief Executive + Chief Operating",
    daysSpan: 9,
    priceChange: "+5.1%",
    conviction: "MODERATE",
    psi: 62,
  },
];

const convictionColor: Record<string, string> = {
  CRITICAL: "#B5651D",
  ELEVATED: "#7C4A1E",
  MODERATE: "#5A3A1A",
};

function PressureGauge({ psi, size = 120 }: { psi: number; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const strokeW = size * 0.055;
  const tickR = r - strokeW / 2 - size * 0.03;

  // Gauge arc: from 225deg to -45deg (270 degrees sweep)
  // 0 PSI = 225deg, 100 PSI = -45deg (clockwise)
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const startAngle = 225;
  const endAngle = 495; // 225 + 270
  const clampedPsi = Math.min(100, Math.max(0, psi));
  const needleAngle = startAngle + (clampedPsi / 100) * 270;

  const arcPath = (startDeg: number, endDeg: number, radius: number) => {
    const s = toRad(startDeg);
    const e = toRad(endDeg);
    const x1 = cx + radius * Math.cos(s);
    const y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e);
    const y2 = cy + radius * Math.sin(e);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const ticks = Array.from({ length: 11 }, (_, i) => {
    const angle = toRad(startAngle + i * 27);
    const inner = tickR - size * 0.035;
    const outer = tickR + size * 0.005;
    return {
      x1: cx + inner * Math.cos(angle),
      y1: cy + inner * Math.sin(angle),
      x2: cx + outer * Math.cos(angle),
      y2: cy + outer * Math.sin(angle),
    };
  });

  const needleRad = toRad(needleAngle);
  const needleLen = r - strokeW;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy + needleLen * Math.sin(needleRad);

  // Filled arc up to current value
  const filledPath = arcPath(startAngle, Math.min(needleAngle, endAngle), r);
  const bgPath = arcPath(startAngle, endAngle, r);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block" }}
    >
      {/* Outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={size * 0.46}
        fill="none"
        stroke="#B5651D"
        strokeWidth={size * 0.025}
      />
      <circle
        cx={cx}
        cy={cy}
        r={size * 0.42}
        fill="none"
        stroke="#7C4A1E"
        strokeWidth={size * 0.012}
      />
      {/* Background face */}
      <circle cx={cx} cy={cy} r={size * 0.41} fill="#1A0E06" />

      {/* Background arc track */}
      <path
        d={bgPath}
        fill="none"
        stroke="#3A2010"
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
      {/* Filled arc */}
      <path
        d={filledPath}
        fill="none"
        stroke="#B5651D"
        strokeWidth={strokeW}
        strokeLinecap="round"
      />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="#F0E6D3"
          strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
          opacity={0.7}
        />
      ))}

      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke="#F0E6D3"
        strokeWidth={size * 0.02}
        strokeLinecap="round"
      />
      {/* Needle pivot */}
      <circle cx={cx} cy={cy} r={size * 0.045} fill="#B5651D" />
      <circle cx={cx} cy={cy} r={size * 0.02} fill="#F0E6D3" />

      {/* PSI Label */}
      <text
        x={cx}
        y={cy + r * 0.62}
        textAnchor="middle"
        fill="#B5651D"
        fontSize={size * 0.13}
        fontFamily="'Libre Baskerville', serif"
        fontWeight="bold"
      >
        {psi}
      </text>
      <text
        x={cx}
        y={cy + r * 0.82}
        textAnchor="middle"
        fill="#7C4A1E"
        fontSize={size * 0.1}
        fontFamily="'Libre Baskerville', serif"
      >
        PSI
      </text>
    </svg>
  );
}

function GearOrnament({ size = 32 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const teeth = 10;
  const outerR = size * 0.45;
  const innerR = size * 0.3;
  const boreR = size * 0.1;
  const points: string[] = [];

  for (let i = 0; i < teeth * 2; i++) {
    const angle = (i * Math.PI) / teeth;
    const r = i % 2 === 0 ? outerR : innerR;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <polygon points={points.join(" ")} fill="#B5651D" opacity={0.85} />
      <circle cx={cx} cy={cy} r={boreR} fill="#2C1A0E" />
    </svg>
  );
}

function CopperDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        margin: "28px 0",
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#7C4A1E",
          border: "2px solid #B5651D",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          flex: 1,
          height: 2,
          background:
            "linear-gradient(to right, #7C4A1E, #B5651D 40%, #B5651D 60%, #7C4A1E)",
          borderRadius: 1,
        }}
      />
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#7C4A1E",
          border: "2px solid #B5651D",
          flexShrink: 0,
        }}
      />
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        margin: "36px 0 20px",
      }}
    >
      <GearOrnament size={28} />
      <h2
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "0.85rem",
          letterSpacing: "0.25em",
          color: "#B5651D",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        {children}
      </h2>
      <GearOrnament size={28} />
    </div>
  );
}

function Rivet({
  top,
  left,
  right,
  bottom,
}: {
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #D4882A, #7C4A1E)",
        border: "1px solid #B5651D",
        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
      }}
    />
  );
}

function ClusterCard({ cluster }: { cluster: (typeof clusters)[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        background: "#3A2010",
        border: "2px solid #B5651D",
        borderRadius: 4,
        padding: "24px 24px 20px",
        cursor: "pointer",
        transition: "box-shadow 0.25s",
        boxShadow: expanded
          ? "0 0 24px rgba(181,101,29,0.35), inset 0 0 40px rgba(0,0,0,0.4)"
          : "0 4px 16px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.3)",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Corner rivets */}
      <Rivet top={8} left={8} />
      <Rivet top={8} right={8} />
      <Rivet bottom={8} left={8} />
      <Rivet bottom={8} right={8} />

      {/* Engraved border inset */}
      <div
        style={{
          position: "absolute",
          inset: 6,
          border: "1px solid rgba(181,101,29,0.25)",
          borderRadius: 2,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {/* Pressure Gauge */}
        <div style={{ flexShrink: 0 }}>
          <PressureGauge psi={cluster.psi} size={108} />
          <div
            style={{
              textAlign: "center",
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "0.6rem",
              color: "#7C4A1E",
              letterSpacing: "0.12em",
              marginTop: 4,
            }}
          >
            PRESSURE GAUGE
          </div>
        </div>

        {/* Card body */}
        <div style={{ flex: 1, minWidth: 200 }}>
          {/* Boiler status badge */}
          <div
            style={{
              display: "inline-block",
              background: convictionColor[cluster.conviction],
              border: "1px solid #B5651D",
              padding: "2px 10px",
              fontSize: "0.6rem",
              fontFamily: "'Cinzel', serif",
              letterSpacing: "0.2em",
              color: "#F0E6D3",
              marginBottom: 8,
            }}
          >
            BOILER STATUS: {cluster.conviction}
          </div>

          {/* Ticker + Company */}
          <h3
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.35rem",
              color: "#F0E6D3",
              margin: "0 0 2px",
              letterSpacing: "0.08em",
            }}
          >
            {cluster.ticker}
          </h3>
          <div
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: "italic",
              fontSize: "0.8rem",
              color: "#B5651D",
              marginBottom: 14,
            }}
          >
            {cluster.company}
          </div>

          {/* Measurements grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px 16px",
            }}
          >
            {[
              { label: "ACCUMULATED CAPITAL", value: cluster.totalValue },
              {
                label: "OPERATIVES DETECTED",
                value: `${cluster.insiders} INSIDERS`,
              },
              { label: "TEMPORAL SPAN", value: `${cluster.daysSpan} DAYS` },
              {
                label: "PRESSURE READING",
                value: `${cluster.psi} PSI`,
              },
              { label: "MARKET DISPLACEMENT", value: cluster.priceChange },
            ].map((m) => (
              <div key={m.label}>
                <div
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontSize: "0.55rem",
                    color: "#7C4A1E",
                    letterSpacing: "0.14em",
                    marginBottom: 2,
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.8rem",
                    color: "#F0E6D3",
                  }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid rgba(181,101,29,0.3)",
          }}
        >
          <CopperDivider />
          <div
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: "0.75rem",
              color: "#F0E6D3",
              lineHeight: 1.8,
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.65rem",
                color: "#B5651D",
                letterSpacing: "0.15em",
                display: "block",
                marginBottom: 8,
              }}
            >
              OPERATIVE IDENTIFICATIONS:
            </span>
            <span style={{ fontStyle: "italic", color: "#D4A97A" }}>
              {cluster.roles}
            </span>
          </div>

          <div
            style={{
              marginTop: 14,
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: "italic",
              fontSize: "0.72rem",
              color: "#7C4A1E",
              lineHeight: 1.7,
            }}
          >
            Laboratory observation: {cluster.insiders} officers of{" "}
            {cluster.company} acquired shares within a {cluster.daysSpan}-day
            window, accumulating {cluster.totalValue} in aggregate. The
            analytical engine classifies this cluster as a{" "}
            <span style={{ color: "#B5651D" }}>
              {cluster.conviction.toLowerCase()}-conviction signal
            </span>{" "}
            with a chamber pressure of {cluster.psi} PSI.
          </div>
        </div>
      )}
    </div>
  );
}

export default function SteampunkPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .steampunk-root {
          min-height: 100vh;
          background-color: #2C1A0E;
          background-image:
            repeating-linear-gradient(
              87deg,
              transparent,
              transparent 38px,
              rgba(90,50,20,0.09) 38px,
              rgba(90,50,20,0.09) 39px
            ),
            repeating-linear-gradient(
              177deg,
              transparent,
              transparent 58px,
              rgba(60,30,10,0.08) 58px,
              rgba(60,30,10,0.08) 60px
            ),
            repeating-linear-gradient(
              92deg,
              transparent,
              transparent 80px,
              rgba(181,101,29,0.03) 80px,
              rgba(181,101,29,0.03) 81px
            );
          color: #F0E6D3;
          font-family: 'Libre Baskerville', serif;
          padding: 0 0 80px;
        }

        .steampunk-root input::placeholder {
          color: #7C4A1E;
          opacity: 1;
        }

        .steampunk-root input:focus {
          outline: none;
          border-color: #B5651D !important;
          box-shadow: 0 0 8px rgba(181,101,29,0.4);
        }

        .subscribe-btn {
          transition: background 0.2s, box-shadow 0.2s;
        }

        .subscribe-btn:hover {
          background: #C87729 !important;
          box-shadow: 0 0 16px rgba(181,101,29,0.5);
        }

        .cluster-card-wrapper:hover > div {
          box-shadow: 0 0 32px rgba(181,101,29,0.3), inset 0 0 40px rgba(0,0,0,0.3) !important;
        }
      `}</style>

      <div className="steampunk-root">
        {/* Masthead */}
        <div
          style={{
            borderBottom: "3px solid #B5651D",
            background:
              "linear-gradient(180deg, #1A0E06 0%, #2C1A0E 60%, #3A2010 100%)",
            padding: "48px 24px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative gear clusters */}
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 28,
              opacity: 0.3,
              display: "flex",
              gap: -8,
            }}
          >
            <GearOrnament size={56} />
            <GearOrnament size={36} />
            <GearOrnament size={48} />
          </div>
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 28,
              opacity: 0.3,
              display: "flex",
              gap: -8,
            }}
          >
            <GearOrnament size={48} />
            <GearOrnament size={36} />
            <GearOrnament size={56} />
          </div>

          {/* Dateline */}
          <div
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: "italic",
              fontSize: "0.65rem",
              color: "#7C4A1E",
              letterSpacing: "0.2em",
              marginBottom: 14,
            }}
          >
            LONDON, ENGLAND &mdash; ANNO DOMINI 1886 &mdash; FIFTH EDITION
          </div>

          {/* Title lockup */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                flex: 1,
                maxWidth: 180,
                height: 1,
                background:
                  "linear-gradient(to right, transparent, #B5651D)",
              }}
            />
            <h1
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(1.6rem, 5vw, 3rem)",
                color: "#F0E6D3",
                margin: 0,
                letterSpacing: "0.12em",
                textShadow: "0 2px 12px rgba(181,101,29,0.4)",
              }}
            >
              CLUSTERDESK
            </h1>
            <div
              style={{
                flex: 1,
                maxWidth: 180,
                height: 1,
                background:
                  "linear-gradient(to left, transparent, #B5651D)",
              }}
            />
          </div>

          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(0.6rem, 2vw, 0.78rem)",
              color: "#B5651D",
              letterSpacing: "0.35em",
              marginBottom: 18,
              textTransform: "uppercase",
            }}
          >
            The Analytical Engine for Insider Cluster Intelligence
          </div>

          <div
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: "italic",
              fontSize: "0.78rem",
              color: "#7C4A1E",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Constructed in the tradition of Mr. Charles Babbage&rsquo;s
            Difference Engine, this apparatus detects the coordinated
            accumulation of shares by corporate officers &mdash; a signal the
            markets have not yet priced.
          </div>

          {/* Sub-rule */}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div
              style={{ width: 40, height: 1, background: "#7C4A1E" }}
            />
            <GearOrnament size={18} />
            <div
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: "0.62rem",
                color: "#7C4A1E",
                letterSpacing: "0.18em",
              }}
            >
              STEAM-POWERED MARKET ANALYSIS
            </div>
            <GearOrnament size={18} />
            <div
              style={{ width: 40, height: 1, background: "#7C4A1E" }}
            />
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          {/* How it works */}
          <SectionHeader>OPERATING PRINCIPLES</SectionHeader>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 8,
            }}
          >
            {[
              {
                step: "I",
                title: "SIGNAL DETECTION",
                body: "The engine's telegraph receivers intercept Form 4 filings from the Securities Exchange Commission, cataloguing every purchase by an officer of the company.",
              },
              {
                step: "II",
                title: "CLUSTER ANALYSIS",
                body: "The difference wheels compute coincident purchases within rolling 14-day windows. Two or more officers buying simultaneously constitutes a cluster.",
              },
              {
                step: "III",
                title: "PRESSURE CALCULATION",
                body: "A proprietary algorithm converts cluster density, aggregate capital, and officer seniority into a single chamber pressure reading, expressed in PSI.",
              },
            ].map((p) => (
              <div
                key={p.step}
                style={{
                  background: "#251508",
                  border: "1px solid rgba(181,101,29,0.3)",
                  borderRadius: 3,
                  padding: "18px 16px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "1.5rem",
                    color: "rgba(181,101,29,0.25)",
                    position: "absolute",
                    top: 10,
                    right: 14,
                    lineHeight: 1,
                  }}
                >
                  {p.step}
                </div>
                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.62rem",
                    color: "#B5651D",
                    letterSpacing: "0.2em",
                    marginBottom: 8,
                  }}
                >
                  {p.title}
                </div>
                <div
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontStyle: "italic",
                    fontSize: "0.72rem",
                    color: "#C8A87A",
                    lineHeight: 1.75,
                  }}
                >
                  {p.body}
                </div>
              </div>
            ))}
          </div>

          <CopperDivider />

          {/* Active Alerts */}
          <SectionHeader>MARKET INTELLIGENCE</SectionHeader>

          <div
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: "italic",
              fontSize: "0.7rem",
              color: "#7C4A1E",
              textAlign: "center",
              marginBottom: 20,
              letterSpacing: "0.08em",
            }}
          >
            Active cluster alerts &mdash; sorted by chamber pressure, highest
            first &mdash; click any card to expand the laboratory record
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {clusters.map((c) => (
              <div key={c.ticker} className="cluster-card-wrapper">
                <ClusterCard cluster={c} />
              </div>
            ))}
          </div>

          <CopperDivider />

          {/* Statistics panel */}
          <SectionHeader>LABORATORY MEASUREMENTS</SectionHeader>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
              marginBottom: 8,
            }}
          >
            {[
              { label: "CLUSTERS ACTIVE", value: "3" },
              { label: "TOTAL CAPITAL DEPLOYED", value: "$447K" },
              { label: "MEAN CHAMBER PSI", value: "74.3" },
              { label: "FILINGS PROCESSED", value: "1,284" },
              { label: "MICRO-CAP UNIVERSE", value: "4,200+" },
              { label: "ENGINE UPTIME", value: "99.7%" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "#1A0E06",
                  border: "1px solid rgba(181,101,29,0.2)",
                  borderRadius: 3,
                  padding: "14px 12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "1.2rem",
                    color: "#F0E6D3",
                    marginBottom: 4,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontSize: "0.55rem",
                    color: "#7C4A1E",
                    letterSpacing: "0.15em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <CopperDivider />

          {/* Methodology */}
          <SectionHeader>METHODOLOGICAL TREATISE</SectionHeader>

          <div
            style={{
              background: "#251508",
              border: "1px solid rgba(181,101,29,0.25)",
              borderRadius: 3,
              padding: "24px 28px",
              marginBottom: 8,
            }}
          >
            <p
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontStyle: "italic",
                fontSize: "0.78rem",
                color: "#C8A87A",
                lineHeight: 2,
                margin: "0 0 14px",
              }}
            >
              The Analytical Engine does not speculate. It observes, measures,
              and reports with the precision of a master clockmaker&rsquo;s
              instrument. When two or more corporate officers purchase their own
              company&rsquo;s shares within a fortnight, the engine classifies
              this as a cluster event and assigns a pressure score.
            </p>
            <p
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontStyle: "italic",
                fontSize: "0.78rem",
                color: "#C8A87A",
                lineHeight: 2,
                margin: 0,
              }}
            >
              Research conducted across 10,000 historical cluster events
              demonstrates that high-pressure clusters (PSI &ge; 75) yield
              statistically significant excess returns over the subsequent
              ninety-day window. The engine is most sensitive at micro-cap
              companies, where each officer&rsquo;s purchase represents a
              meaningful fraction of daily volume.
            </p>
          </div>

          <CopperDivider />

          {/* Subscribe */}
          <SectionHeader>
            SUBSCRIBE TO THE ANALYTICAL ENGINE TELEGRAPH SERVICE
          </SectionHeader>

          <div
            style={{
              background: "#251508",
              border: "2px solid #B5651D",
              borderRadius: 4,
              padding: "32px 28px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <Rivet top={10} left={10} />
            <Rivet top={10} right={10} />
            <Rivet bottom={10} left={10} />
            <Rivet bottom={10} right={10} />

            <div
              style={{
                position: "absolute",
                inset: 6,
                border: "1px solid rgba(181,101,29,0.2)",
                borderRadius: 2,
                pointerEvents: "none",
              }}
            />

            {subscribed ? (
              <div>
                <GearOrnament size={48} />
                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "1rem",
                    color: "#F0E6D3",
                    letterSpacing: "0.12em",
                    margin: "16px 0 8px",
                  }}
                >
                  TELEGRAPH RECEIVED
                </div>
                <div
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontStyle: "italic",
                    fontSize: "0.78rem",
                    color: "#B5651D",
                    lineHeight: 1.7,
                  }}
                >
                  Your subscription has been registered in the Engine&rsquo;s
                  ledger. Dispatches shall commence forthwith.
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    fontFamily: "'Libre Baskerville', serif",
                    fontStyle: "italic",
                    fontSize: "0.8rem",
                    color: "#C8A87A",
                    lineHeight: 1.75,
                    marginBottom: 24,
                    maxWidth: 480,
                    margin: "0 auto 24px",
                  }}
                >
                  Receive morning telegraph dispatches whenever a new cluster
                  event exceeds 70 PSI. The Engine transmits only when the
                  signal is genuine.
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    maxWidth: 460,
                    margin: "0 auto",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="email"
                    placeholder="telegraph address (email)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 220,
                      background: "#1A0E06",
                      border: "1px solid #7C4A1E",
                      borderRadius: 3,
                      padding: "10px 14px",
                      fontFamily: "'Libre Baskerville', serif",
                      fontStyle: "italic",
                      fontSize: "0.78rem",
                      color: "#F0E6D3",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <button
                    className="subscribe-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (email) setSubscribed(true);
                    }}
                    style={{
                      background: "#B5651D",
                      border: "1px solid #D4882A",
                      borderRadius: 3,
                      padding: "10px 22px",
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      color: "#F0E6D3",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ENGAGE THE ENGINE
                  </button>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    fontFamily: "'Libre Baskerville', serif",
                    fontStyle: "italic",
                    fontSize: "0.62rem",
                    color: "#5A3A1A",
                    letterSpacing: "0.08em",
                  }}
                >
                  No charge during the experimental period. Unsubscribe by
                  telegraph at any time.
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <CopperDivider />

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <GearOrnament size={22} />
              <GearOrnament size={16} />
              <GearOrnament size={22} />
            </div>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.65rem",
                color: "#5A3A1A",
                letterSpacing: "0.2em",
                marginBottom: 6,
              }}
            >
              CLUSTERDESK ANALYTICAL ENGINE &mdash; MDCCCLXXXVI
            </div>
            <div
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontStyle: "italic",
                fontSize: "0.6rem",
                color: "#3A2010",
                letterSpacing: "0.08em",
              }}
            >
              This apparatus is provided for informational purposes only and
              constitutes no investment advice. Past pressure readings do not
              guarantee future steam.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
