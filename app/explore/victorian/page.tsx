"use client";

import { useState } from "react";

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
    romanScore: "LXXXVII",
    romanTotal: "XCIX",
    description:
      "Three company directors have been observed purchasing shares in suspicious concord, within the span of four days, deploying capital of considerable sum.",
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
    romanScore: "LXXIV",
    romanTotal: "XCIX",
    description:
      "Two officers of the corporation, in acts most curious and coordinated, have acquired shares within six days of one another — a concurrence most suspicious to this Gazette.",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    totalValue: "$47K",
    roles: "President + Director",
    daysSpan: 9,
    priceChange: "+5.3%",
    romanScore: "LXII",
    romanTotal: "XCIX",
    description:
      "The President and a Director of this concern have been observed in their purchasing of shares, nine days apart — suggesting foreknowledge of developments yet undisclosed.",
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=IM+Fell+English:ital@0;1&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .vic-page {
    min-height: 100vh;
    background-color: #3D1C02;
    background-image:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(245, 230, 200, 0.012) 3px,
        rgba(245, 230, 200, 0.012) 4px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 3px,
        rgba(245, 230, 200, 0.008) 3px,
        rgba(245, 230, 200, 0.008) 4px
      ),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 8px,
        rgba(26, 10, 0, 0.15) 8px,
        rgba(26, 10, 0, 0.15) 9px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 8px,
        rgba(26, 10, 0, 0.1) 8px,
        rgba(26, 10, 0, 0.1) 9px
      );
    font-family: 'IM Fell English', serif;
    color: #F5E6C8;
    overflow-x: hidden;
  }

  .playfair {
    font-family: 'Playfair Display', serif !important;
  }

  .imfell {
    font-family: 'IM Fell English', serif !important;
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    92% { opacity: 1; }
    93% { opacity: 0.85; }
    94% { opacity: 1; }
    96% { opacity: 0.9; }
    97% { opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .flicker {
    animation: flicker 8s ease-in-out infinite;
  }

  .fade-in {
    animation: fadeIn 1s ease-out forwards;
  }

  .masthead-border {
    border: 3px double #B8860B;
    outline: 1px solid #B8860B;
    outline-offset: 4px;
  }

  .gazette-card {
    position: relative;
    background: #F5E6C8;
    color: #1A0A00;
    border: 2px solid #B8860B;
    box-shadow:
      4px 4px 0 #8B0000,
      6px 6px 0 rgba(139,0,0,0.4),
      8px 8px 0 rgba(139,0,0,0.15),
      inset 0 0 30px rgba(61,28,2,0.08),
      inset 0 0 60px rgba(139,0,0,0.04);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: default;
    overflow: hidden;
  }

  .gazette-card::before {
    content: '';
    position: absolute;
    inset: 5px;
    border: 1px solid rgba(184, 134, 11, 0.35);
    pointer-events: none;
    z-index: 1;
  }

  .gazette-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 40%, rgba(255,220,140,0.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .gazette-card:hover {
    transform: translate(-2px, -2px);
    box-shadow:
      6px 6px 0 #8B0000,
      9px 9px 0 rgba(139,0,0,0.35),
      12px 12px 0 rgba(139,0,0,0.12);
  }

  .wax-seal {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #C0392B, #8B0000 55%, #5C0000);
    border: 2px solid #4a0000;
    box-shadow:
      0 0 0 1px rgba(184,134,11,0.5),
      2px 3px 6px rgba(0,0,0,0.5),
      inset 0 1px 3px rgba(255,100,100,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
  }

  .wax-seal::before {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    border: 1px solid rgba(255,150,150,0.2);
  }

  .email-input-vic {
    background: #FFF8EC;
    border: 1px solid #B8860B;
    border-right: none;
    color: #1A0A00;
    padding: 14px 20px;
    font-family: 'IM Fell English', serif;
    font-size: 14px;
    outline: none;
    width: 100%;
    transition: border-color 0.2s ease;
  }

  .email-input-vic::placeholder {
    color: rgba(26,10,0,0.35);
    font-style: italic;
  }

  .email-input-vic:focus {
    border-color: #8B0000;
    box-shadow: inset 0 1px 3px rgba(139,0,0,0.1);
  }

  .cta-button-vic {
    background: #8B0000;
    color: #F5E6C8;
    border: 1px solid #5C0000;
    padding: 14px 28px;
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.12em;
    cursor: pointer;
    transition: background 0.2s ease;
    white-space: nowrap;
    text-transform: uppercase;
  }

  .cta-button-vic:hover {
    background: #6B0000;
  }

  .ornamental-rule {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 6px 0;
  }

  .stamp-caveat {
    display: inline-block;
    transform: rotate(-3deg);
    border: 3px solid #8B0000;
    padding: 4px 14px;
    color: #8B0000;
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    font-size: 13px;
    letter-spacing: 0.25em;
    opacity: 0.85;
    box-shadow: 2px 2px 0 rgba(139,0,0,0.3);
  }

  .section-paper {
    background: rgba(245, 230, 200, 0.06);
    border-top: 1px solid rgba(184,134,11,0.25);
    border-bottom: 1px solid rgba(184,134,11,0.25);
  }

  .pillar-cell {
    background: rgba(26, 10, 0, 0.3);
    border: 1px solid rgba(184,134,11,0.2);
    padding: 28px 20px;
    text-align: center;
  }

  .how-step {
    display: flex;
    gap: 24px;
    padding: 24px 0;
    border-bottom: 1px solid rgba(184,134,11,0.15);
    align-items: flex-start;
  }

  .how-step:last-child {
    border-bottom: none;
  }

  .footer-link-vic {
    font-family: 'Playfair Display', serif;
    font-size: 10px;
    letter-spacing: 0.18em;
    color: rgba(184,134,11,0.4);
    text-decoration: none;
    transition: color 0.2s ease;
    text-transform: uppercase;
  }

  .footer-link-vic:hover {
    color: rgba(184,134,11,0.8);
  }
`;

function OrnamentalDivider() {
  return (
    <div className="ornamental-rule">
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(184,134,11,0.5))" }} />
      <span style={{ color: "#B8860B", fontSize: "14px", letterSpacing: "4px" }}>❦ ✦ ❧</span>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(184,134,11,0.5))" }} />
    </div>
  );
}

function SmallDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "4px 0" }}>
      <div style={{ width: "40px", height: "1px", background: "rgba(184,134,11,0.4)" }} />
      <span style={{ color: "#B8860B", fontSize: "10px" }}>✴</span>
      <div style={{ width: "40px", height: "1px", background: "rgba(184,134,11,0.4)" }} />
    </div>
  );
}

function WaxSeal({ roman, total }: { roman: string; total: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flexShrink: 0 }}>
      <div className="wax-seal">
        <div style={{ textAlign: "center", zIndex: 1, position: "relative" }}>
          <div
            className="playfair"
            style={{
              fontSize: "13px",
              fontWeight: 900,
              color: "#F5E6C8",
              lineHeight: 1,
              letterSpacing: "0.04em",
            }}
          >
            {roman}
          </div>
          <div
            style={{
              fontSize: "7px",
              color: "rgba(245,230,200,0.5)",
              letterSpacing: "0.06em",
              marginTop: "2px",
              fontFamily: "'IM Fell English', serif",
            }}
          >
            of {total}
          </div>
        </div>
      </div>
      <div
        className="playfair"
        style={{ fontSize: "7px", letterSpacing: "0.18em", color: "#8B0000", textTransform: "uppercase" }}
      >
        Conviction
      </div>
    </div>
  );
}

function GazetteCard({ cluster, index }: { cluster: (typeof clusters)[0]; index: number }) {
  return (
    <div
      className="gazette-card"
      style={{
        padding: "32px 28px 28px",
        animationDelay: `${index * 0.2}s`,
      }}
    >
      {/* Card content sits above pseudo-elements */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Notice header */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#8B0000", fontSize: "12px" }}>❦</span>
            <span
              className="playfair"
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "#8B0000",
                textTransform: "uppercase",
              }}
            >
              Notice of Suspicious Activity
            </span>
            <span style={{ color: "#8B0000", fontSize: "12px" }}>❦</span>
          </div>
          <div
            style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, #B8860B, transparent)",
            }}
          />
        </div>

        {/* Company name & ticker */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <div
            className="playfair"
            style={{
              fontSize: "22px",
              fontWeight: 900,
              color: "#1A0A00",
              letterSpacing: "0.1em",
              lineHeight: 1.1,
              textTransform: "uppercase",
            }}
          >
            {cluster.company}
          </div>
          <div
            className="playfair"
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#8B0000",
              letterSpacing: "0.2em",
              marginTop: "2px",
            }}
          >
            ({cluster.ticker})
          </div>
        </div>

        <SmallDivider />

        {/* Wax seal + description row */}
        <div style={{ display: "flex", gap: "16px", margin: "16px 0", alignItems: "flex-start" }}>
          <WaxSeal roman={cluster.romanScore} total={cluster.romanTotal} />
          <div style={{ flex: 1 }}>
            <p
              className="imfell"
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#2A1200",
                fontStyle: "italic",
              }}
            >
              {cluster.description}
            </p>
          </div>
        </div>

        <SmallDivider />

        {/* Stats in gazette style */}
        <div style={{ marginTop: "14px" }}>
          {[
            { label: "Accused Parties", value: `${cluster.insiders} Insider${cluster.insiders > 1 ? "s" : ""}` },
            { label: "Capital Deployed", value: cluster.totalValue },
            { label: "Offices Held", value: cluster.roles },
            { label: "Days Elapsed", value: `${cluster.daysSpan} days` },
            { label: "30-Day Movement", value: cluster.priceChange },
          ].map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "5px 0",
                borderBottom: "1px solid rgba(184,134,11,0.2)",
                gap: "8px",
              }}
            >
              <span
                className="imfell"
                style={{ fontSize: "11px", color: "rgba(26,10,0,0.55)", fontStyle: "italic" }}
              >
                {row.label}
              </span>
              <span
                className="playfair"
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color:
                    row.label === "30-Day Movement"
                      ? row.value.startsWith("+")
                        ? "#2D6A00"
                        : "#8B0000"
                      : "#1A0A00",
                  letterSpacing: "0.04em",
                  textAlign: "right",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Caveat stamp */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "18px" }}>
          <div className="stamp-caveat">CAVEAT EMPTOR</div>
        </div>

        {/* Footer ornament */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "16px",
            gap: "6px",
            alignItems: "center",
          }}
        >
          <span style={{ color: "rgba(139,0,0,0.3)", fontSize: "10px" }}>☽</span>
          <span style={{ color: "rgba(139,0,0,0.4)", fontSize: "12px" }}>☠</span>
          <span style={{ color: "rgba(139,0,0,0.3)", fontSize: "10px" }}>☽</span>
        </div>
      </div>
    </div>
  );
}

export default function VictorianPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="vic-page">

        {/* ── TOP NAV ── */}
        <nav
          style={{
            borderBottom: "1px solid rgba(184,134,11,0.3)",
            padding: "10px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "28px" }}>
            {["Markets", "Intelligence", "Archives"].map((item) => (
              <a
                key={item}
                href="#"
                className="playfair"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  color: "rgba(184,134,11,0.6)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                {item}
              </a>
            ))}
          </div>
          <div
            className="playfair flicker"
            style={{
              fontSize: "9px",
              letterSpacing: "0.25em",
              color: "rgba(245,230,200,0.3)",
              textTransform: "uppercase",
            }}
          >
            ☽ Est. MDCCCLXXXVIII ☽
          </div>
          <div style={{ display: "flex", gap: "28px" }}>
            {["Offices", "Enquiries", "Subscribe"].map((item) => (
              <a
                key={item}
                href="#"
                className="playfair"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  color: "rgba(184,134,11,0.6)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </nav>

        {/* ── MASTHEAD ── */}
        <header
          style={{
            padding: "40px 48px 36px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Outer decorative band */}
          <div
            style={{
              border: "1px solid rgba(184,134,11,0.35)",
              padding: "28px 40px 24px",
              position: "relative",
            }}
          >
            {/* Inner border */}
            <div
              style={{
                position: "absolute",
                inset: "5px",
                border: "1px solid rgba(184,134,11,0.18)",
                pointerEvents: "none",
              }}
            />

            {/* Ornament row */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "6px",
                marginBottom: "14px",
                color: "#B8860B",
                fontSize: "16px",
                letterSpacing: "4px",
              }}
            >
              ❦ ❦ ❦ ❦ ❦ ❦ ❦ ❦ ❦ ❦ ❦ ❦
            </div>

            {/* Masthead title */}
            <h1
              className="playfair flicker"
              style={{
                fontSize: "clamp(32px, 6vw, 68px)",
                fontWeight: 900,
                color: "#F5E6C8",
                letterSpacing: "0.12em",
                lineHeight: 1,
                textShadow:
                  "0 0 40px rgba(245,230,200,0.15), 2px 2px 0 rgba(26,10,0,0.6)",
                marginBottom: "8px",
              }}
            >
              THE CLUSTERDESK GAZETTE
            </h1>

            <div
              style={{
                height: "2px",
                background: "linear-gradient(to right, transparent, #B8860B, #8B0000, #B8860B, transparent)",
                margin: "10px 0",
              }}
            />

            {/* Edition line */}
            <div
              className="imfell"
              style={{
                fontSize: "13px",
                color: "rgba(245,230,200,0.7)",
                letterSpacing: "0.06em",
                marginBottom: "6px",
              }}
            >
              Vol. XLVII, No. 12 &mdash; London, Monday, 11th May, 1888 &mdash; Price One Penny
            </div>

            <div
              style={{
                height: "1px",
                background: "linear-gradient(to right, transparent, rgba(184,134,11,0.5), transparent)",
                margin: "8px 0",
              }}
            />

            {/* Tagline */}
            <p
              className="imfell"
              style={{
                fontSize: "15px",
                fontStyle: "italic",
                color: "rgba(245,230,200,0.6)",
                maxWidth: "600px",
                margin: "10px auto 10px",
                lineHeight: 1.6,
              }}
            >
              &ldquo;Illuminating the dark commerce of company directors
              who traffic in their own shares — in service to the investing public.&rdquo;
            </p>

            {/* Bottom ornament row */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "6px",
                marginTop: "14px",
                color: "#B8860B",
                fontSize: "16px",
                letterSpacing: "4px",
              }}
            >
              ❧ ✦ ❧ ✦ ❧ ✦ ❧ ✦ ❧ ✦ ❧ ✦ ❧
            </div>
          </div>
        </header>

        {/* ── WHAT IS A CLUSTER BUY ── */}
        <section style={{ padding: "40px 48px", maxWidth: "900px", margin: "0 auto" }}>
          <OrnamentalDivider />

          <div style={{ padding: "32px 0 24px", textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <span style={{ color: "#8B0000", fontSize: "18px" }}>✝</span>
              <h2
                className="playfair"
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#F5E6C8",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Upon the Matter of Cluster Purchases
              </h2>
              <span style={{ color: "#8B0000", fontSize: "18px" }}>✝</span>
            </div>

            <p
              className="imfell"
              style={{
                fontSize: "15px",
                lineHeight: 1.85,
                color: "rgba(245,230,200,0.72)",
                maxWidth: "660px",
                margin: "0 auto 24px",
              }}
            >
              When two or more corporate directors — those entrusted by shareholders with the stewardship
              of their capital — do purchase shares of their own concern within a compressed interval of
              days, such concurrence doth constitute what this Gazette terms a <em>Cluster Purchase</em>:
              a signal of the highest order, suggesting foreknowledge of undisclosed material events.
            </p>
          </div>

          {/* Three pillars */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px",
              margin: "24px 0",
            }}
          >
            {[
              {
                symbol: "☠",
                label: "Micro-Cap Concerns",
                desc: "Firms with capitalisation beneath £300,000 — where insider conviction rings loudest and price movements most pronounced.",
              },
              {
                symbol: "✦",
                label: "Two or More Principals",
                desc: "A solitary purchase signifies little. Two or more acting in concert, however, constitutes a chorus the market cannot ignore.",
              },
              {
                symbol: "☽",
                label: "Temporal Compression",
                desc: "Transactions occurring within a fortnight — a window suggesting urgency and shared private intelligence of great import.",
              },
            ].map((pillar) => (
              <div key={pillar.label} className="pillar-cell">
                <div style={{ fontSize: "20px", color: "#8B0000", marginBottom: "8px" }}>
                  {pillar.symbol}
                </div>
                <div
                  className="playfair"
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#B8860B",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: "10px",
                  }}
                >
                  {pillar.label}
                </div>
                <p
                  className="imfell"
                  style={{
                    fontSize: "12px",
                    color: "rgba(245,230,200,0.55)",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                  }}
                >
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>

          <OrnamentalDivider />
        </section>

        {/* ── GAZETTE NOTICES / CLUSTER CARDS ── */}
        <section style={{ padding: "0 48px 60px", maxWidth: "1140px", margin: "0 auto" }}>
          {/* Section heading */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
                marginBottom: "10px",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(184,134,11,0.5))" }} />
              <span style={{ color: "#B8860B", fontSize: "18px" }}>✴</span>
              <h2
                className="playfair"
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#F5E6C8",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Current Intelligence Dispatches
              </h2>
              <span style={{ color: "#B8860B", fontSize: "18px" }}>✴</span>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(184,134,11,0.5))" }} />
            </div>
            <p
              className="imfell"
              style={{
                fontSize: "12px",
                color: "rgba(245,230,200,0.35)",
                fontStyle: "italic",
                letterSpacing: "0.04em",
              }}
            >
              Ranked by proprietary conviction score — updated each Monday
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "32px",
            }}
          >
            {clusters.map((cluster, i) => (
              <GazetteCard key={cluster.ticker} cluster={cluster} index={i} />
            ))}
          </div>

          {/* Score legend */}
          <div
            style={{
              marginTop: "36px",
              padding: "16px 24px",
              border: "1px solid rgba(184,134,11,0.2)",
              display: "flex",
              justifyContent: "center",
              gap: "48px",
              flexWrap: "wrap",
              background: "rgba(26,10,0,0.3)",
            }}
          >
            {[
              { range: "LXXX–XCIX", label: "High Conviction", dot: "#8B0000" },
              { range: "LXV–LXXIX", label: "Moderate Signal", dot: "#B8860B" },
              { range: "L–LXIV",    label: "Worth Watching",  dot: "rgba(245,230,200,0.3)" },
            ].map((item) => (
              <div key={item.range} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: item.dot,
                    border: "1px solid rgba(184,134,11,0.4)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    className="playfair"
                    style={{ fontSize: "10px", color: "#B8860B", letterSpacing: "0.1em" }}
                  >
                    {item.label}
                  </div>
                  <div
                    className="imfell"
                    style={{ fontSize: "10px", color: "rgba(245,230,200,0.35)", fontStyle: "italic" }}
                  >
                    Score {item.range}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SUBSCRIBE ── */}
        <section
          className="section-paper"
          style={{
            padding: "60px 48px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Candlelight glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 60%, rgba(184,134,11,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "18px",
                color: "#8B0000",
                fontSize: "18px",
                letterSpacing: "4px",
              }}
            >
              ☠ ✝ ☠
            </div>

            <h2
              className="playfair"
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#F5E6C8",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Subscribe to the Gazette
            </h2>

            <p
              className="imfell"
              style={{
                fontSize: "16px",
                fontStyle: "italic",
                color: "rgba(245,230,200,0.55)",
                marginBottom: "8px",
              }}
            >
              Receive our weekly intelligence dispatches by electrical telegraph
            </p>

            <p
              className="imfell"
              style={{
                fontSize: "13px",
                color: "rgba(245,230,200,0.4)",
                maxWidth: "520px",
                margin: "0 auto 32px",
                lineHeight: 1.7,
              }}
            >
              Each Monday morning, this Gazette delivers unto its subscribers a full accounting
              of the week&apos;s most suspicious cluster purchases — complete with conviction scores,
              officer identifications, and the sum of capital exchanged.
            </p>

            {submitted ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "14px",
                  border: "1px solid rgba(184,134,11,0.4)",
                  padding: "16px 32px",
                  background: "rgba(26,10,0,0.3)",
                }}
              >
                <span style={{ color: "#B8860B", fontSize: "18px" }}>✦</span>
                <span
                  className="playfair"
                  style={{
                    color: "#B8860B",
                    letterSpacing: "0.16em",
                    fontSize: "13px",
                    textTransform: "uppercase",
                  }}
                >
                  Transmission Received — Welcome to the Gazette
                </span>
                <span style={{ color: "#B8860B", fontSize: "18px" }}>✦</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your telegraph address (electronic mail)"
                  className="email-input-vic"
                  required
                  style={{ flex: 1 }}
                />
                <button type="submit" className="cta-button-vic">
                  Subscribe
                </button>
              </form>
            )}

            <div
              className="imfell"
              style={{
                marginTop: "18px",
                fontSize: "11px",
                color: "rgba(245,230,200,0.25)",
                fontStyle: "italic",
              }}
            >
              No solicitations. Your address held in strictest confidence. Unsubscribe at any time.
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: "56px 48px", maxWidth: "860px", margin: "0 auto" }}>
          <OrnamentalDivider />

          <div style={{ textAlign: "center", padding: "28px 0 24px" }}>
            <h2
              className="playfair"
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#F5E6C8",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              The Investigative Process
            </h2>
            <div style={{ fontSize: "18px", color: "#8B0000", letterSpacing: "6px" }}>☽ ✝ ☽</div>
          </div>

          <div>
            {[
              {
                roman: "I",
                title: "Acquisition of Intelligence",
                desc: "Form Four filings submitted to the Securities & Exchange Commission are monitored continuously across all registered micro-cap and small-cap concerns in these United States.",
              },
              {
                roman: "II",
                title: "Detection of Concurrence",
                desc: "Proprietary algorithms, devised by our analysts, identify instances wherein two or more distinct officers purchase shares within a fortnight of one another — a compressed interval most suggestive of shared foreknowledge.",
              },
              {
                roman: "III",
                title: "Assessment of Conviction",
                desc: "Each cluster is awarded a score of nought to ninety-nine, accounting for: the number of purchasing principals, the capital thus deployed, the seniority of the offices held, and the compression of the purchasing timeframe.",
              },
              {
                roman: "IV",
                title: "Dissemination by Telegraph",
                desc: "Ranked intelligence dispatches are transmitted to subscribers each Monday, with full context, filing citations, and the Gazette&apos;s considered assessment of the matter at hand.",
              },
            ].map((step, i) => (
              <div key={i} className="how-step">
                <div
                  className="playfair"
                  style={{
                    fontSize: "24px",
                    fontWeight: 900,
                    color: "rgba(139,0,0,0.35)",
                    minWidth: "36px",
                    lineHeight: 1,
                    paddingTop: "2px",
                  }}
                >
                  {step.roman}
                </div>
                <div
                  style={{
                    width: "1px",
                    alignSelf: "stretch",
                    background: "rgba(184,134,11,0.2)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    className="playfair"
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#B8860B",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {step.title}
                  </div>
                  <p
                    className="imfell"
                    style={{
                      fontSize: "13px",
                      color: "rgba(245,230,200,0.6)",
                      lineHeight: 1.75,
                      fontStyle: "italic",
                    }}
                    dangerouslySetInnerHTML={{ __html: step.desc }}
                  />
                </div>
              </div>
            ))}
          </div>

          <OrnamentalDivider />
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            borderTop: "2px solid rgba(184,134,11,0.2)",
            padding: "40px 48px 48px",
            textAlign: "center",
          }}
        >
          {/* Masthead footer */}
          <div
            className="playfair flicker"
            style={{
              fontSize: "20px",
              fontWeight: 900,
              color: "rgba(245,230,200,0.25)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "4px",
            }}
          >
            The Clusterdesk Gazette
          </div>
          <div
            className="imfell"
            style={{
              fontSize: "11px",
              fontStyle: "italic",
              color: "rgba(245,230,200,0.18)",
              marginBottom: "24px",
              letterSpacing: "0.06em",
            }}
          >
            Established in the Year of Our Lord MDCCCLXXXVIII
          </div>

          <div
            style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(184,134,11,0.25), transparent)",
              marginBottom: "22px",
            }}
          />

          {/* SEC Disclaimer in archaic English */}
          <p
            className="imfell"
            style={{
              fontSize: "11px",
              color: "rgba(245,230,200,0.22)",
              lineHeight: 1.9,
              maxWidth: "640px",
              margin: "0 auto 20px",
              fontStyle: "italic",
            }}
          >
            This Gazette is published for informational purposes only and doth not constitute investment
            advice, a solicitation, nor any recommendation to buy or sell securities of any kind.
            All intelligence herein is derived from public filings made to the Securities &amp; Exchange
            Commission of the United States. Past patterns of cluster purchasing do not guarantee future
            returns. The reader doth invest entirely at his own risk, and this publication accepts no
            liability whatsoever for losses sustained thereby.
          </p>

          {/* Footer links */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "28px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            {["Privacy Policy", "Terms of Service", "Disclaimer", "Enquiries"].map((link) => (
              <a key={link} href="#" className="footer-link-vic">
                {link}
              </a>
            ))}
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "rgba(184,134,11,0.2)",
              letterSpacing: "8px",
            }}
          >
            ☽ ✦ ☠ ✦ ☽
          </div>

          <div
            className="imfell"
            style={{
              marginTop: "10px",
              fontSize: "10px",
              color: "rgba(245,230,200,0.12)",
              fontStyle: "italic",
            }}
          >
            &ldquo;Caveat Emptor &mdash; Let the buyer beware.&rdquo;
          </div>
        </footer>
      </div>
    </>
  );
}
