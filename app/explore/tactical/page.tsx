"use client";

import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

interface ClusterAlert {
  ticker: string;
  company: string;
  score: number;
  insiders: { name: string; title: string; amount: string }[];
  totalExposure: string;
  threatLevel: "HIGH" | "MEDIUM" | "LOW";
  date: string;
  missionId: string;
  gridCoords: string;
  redactedField: string;
}

const ALERTS: ClusterAlert[] = [
  {
    ticker: "MVST",
    company: "Microvast Holdings Inc.",
    score: 87,
    insiders: [
      { name: "YANG WU", title: "CHIEF EXECUTIVE OFFICER", amount: "$148,200" },
      { name: "CRAIG WEBSTER", title: "CHIEF FINANCIAL OFFICER", amount: "$97,500" },
      { name: "LEON LAMONTAGNE", title: "BOARD DIRECTOR", amount: "$66,300" },
    ],
    totalExposure: "$312,000",
    threatLevel: "HIGH",
    date: "2026-05-08",
    missionId: "OP-CLUSTER-7741",
    gridCoords: "38°53′N 77°02′W",
    redactedField: "ACQUISITION TARGET",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc.",
    score: 74,
    insiders: [
      { name: "DAVID MORADI", title: "CHAIRMAN / CEO", amount: "$52,800" },
      { name: "KELLY THOMAS", title: "CHIEF OPERATING OFFICER", amount: "$35,200" },
    ],
    totalExposure: "$88,000",
    threatLevel: "MEDIUM",
    date: "2026-05-05",
    missionId: "OP-CLUSTER-7739",
    gridCoords: "33°27′N 112°04′W",
    redactedField: "Q2 REVENUE FORECAST",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc.",
    score: 62,
    insiders: [
      { name: "JONATHAN REICH", title: "CHIEF EXECUTIVE OFFICER", amount: "$29,400" },
      { name: "YI TSAI", title: "VP OF FINANCE", amount: "$17,600" },
    ],
    totalExposure: "$47,000",
    threatLevel: "MEDIUM",
    date: "2026-05-03",
    missionId: "OP-CLUSTER-7737",
    gridCoords: "40°42′N 74°00′W",
    redactedField: "PRODUCT LAUNCH DATE",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function threatColor(level: ClusterAlert["threatLevel"]): string {
  if (level === "HIGH") return "#CC2200";
  if (level === "MEDIUM") return "#B8860B";
  return "#4A7A4A";
}

function RedactionBar({ width = 160 }: { width?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width,
        height: 14,
        background: "#0A0A05",
        borderRadius: 1,
        verticalAlign: "middle",
        userSelect: "none",
        letterSpacing: 2,
      }}
      aria-label="[REDACTED]"
    />
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function AlertCard({ alert }: { alert: ClusterAlert }) {
  const tc = threatColor(alert.threatLevel);

  return (
    <div
      style={{
        background: "#3A3A20",
        border: "1px solid #5A5A30",
        borderTop: `3px solid ${tc}`,
        padding: "28px 28px 24px",
        position: "relative",
        fontFamily: "'Courier Prime', 'Courier New', monospace",
        color: "#F0EDD8",
      }}
    >
      {/* Grid coords — top right */}
      <span
        style={{
          position: "absolute",
          top: 10,
          right: 14,
          fontSize: 9,
          color: "#9A9A70",
          fontFamily: "'Courier Prime', monospace",
          letterSpacing: 0.5,
        }}
      >
        {alert.gridCoords}
      </span>

      {/* Mission ID — top left */}
      <div
        style={{
          fontSize: 9,
          color: "#9A9A70",
          letterSpacing: 1,
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        {alert.missionId} &nbsp;|&nbsp; INTEL RECEIVED: {alert.date}
      </div>

      {/* Ticker + threat level row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 18,
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "'Special Elite', 'Courier New', monospace",
              letterSpacing: 2,
              color: "#F0EDD8",
              lineHeight: 1,
            }}
          >
            {alert.ticker}
          </div>
          <div style={{ fontSize: 11, color: "#9A9A70", marginTop: 4, letterSpacing: 0.5 }}>
            SUBJECT: {alert.company}
          </div>
        </div>

        <div
          style={{
            border: `2px solid ${tc}`,
            padding: "4px 10px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 8, color: "#9A9A70", letterSpacing: 1, marginBottom: 2 }}>
            THREAT LEVEL
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: tc,
              letterSpacing: 2,
              fontFamily: "'Special Elite', monospace",
            }}
          >
            {alert.threatLevel}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #5A5A30", marginBottom: 16 }} />

      {/* Assets identified */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 9,
            color: "#9A9A70",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          ASSETS IDENTIFIED ({alert.insiders.length}):
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {alert.insiders.map((ins, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 12,
                borderLeft: "2px solid #5A5A30",
                paddingLeft: 10,
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
                  {ins.name}
                </span>
                <span style={{ fontSize: 9, color: "#9A9A70", marginLeft: 8 }}>
                  {ins.title}
                </span>
              </div>
              <span style={{ fontSize: 11, color: "#B8C090", whiteSpace: "nowrap" }}>
                {ins.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Financial exposure + classification */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 9, color: "#9A9A70", letterSpacing: 1, marginBottom: 3 }}>
            FINANCIAL EXPOSURE:
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1, color: "#F0EDD8" }}>
            {alert.totalExposure}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 9, color: "#9A9A70", letterSpacing: 1, marginBottom: 3 }}>
            CLASSIFICATION:
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: tc,
              letterSpacing: 1,
              fontFamily: "'Special Elite', monospace",
            }}
          >
            {alert.score}/100
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px dashed #5A5A30", marginBottom: 14 }} />

      {/* Redacted field */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 9,
          color: "#9A9A70",
          letterSpacing: 1,
        }}
      >
        <span style={{ textTransform: "uppercase" }}>{alert.redactedField}:</span>
        <RedactionBar width={140} />
      </div>
    </div>
  );
}

// ─── Email Form ───────────────────────────────────────────────────────────────

function ClearanceForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <div
      style={{
        background: "#3A3A20",
        border: "1px solid #5A5A30",
        borderTop: "3px solid #CC2200",
        padding: "32px",
        fontFamily: "'Courier Prime', 'Courier New', monospace",
        color: "#F0EDD8",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      <div style={{ fontSize: 9, color: "#9A9A70", letterSpacing: 2, marginBottom: 8 }}>
        FORM SF-312 — CLASSIFIED INFORMATION NONDISCLOSURE AGREEMENT
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "'Special Elite', monospace",
          letterSpacing: 2,
          marginBottom: 6,
          color: "#F0EDD8",
        }}
      >
        REQUEST SECURITY CLEARANCE
      </div>
      <div style={{ fontSize: 11, color: "#9A9A70", marginBottom: 24, lineHeight: 1.6 }}>
        Authorized personnel only. Daily cluster intelligence delivered to your secure inbox.
        All recipients subject to monitoring under Executive Order 12356.
      </div>

      {submitted ? (
        <div
          style={{
            border: "1px solid #CC2200",
            padding: "16px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#CC2200",
              letterSpacing: 2,
              fontFamily: "'Special Elite', monospace",
            }}
          >
            CLEARANCE REQUEST RECEIVED
          </div>
          <div style={{ fontSize: 10, color: "#9A9A70", marginTop: 6, letterSpacing: 1 }}>
            YOUR APPLICATION IS UNDER REVIEW — STAND BY FOR AUTHORIZATION
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 0 }}>
          <input
            type="email"
            required
            placeholder="ENTER SECURE EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              background: "#2A2A14",
              border: "1px solid #5A5A30",
              borderRight: "none",
              padding: "12px 14px",
              color: "#F0EDD8",
              fontFamily: "'Courier Prime', 'Courier New', monospace",
              fontSize: 11,
              letterSpacing: 1,
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#CC2200",
              border: "1px solid #CC2200",
              padding: "12px 20px",
              color: "#F0EDD8",
              fontFamily: "'Special Elite', monospace",
              fontSize: 12,
              letterSpacing: 2,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            AUTHORIZE
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TacticalPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:wght@400;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #2A2A14;
        }

        .tactical-root {
          min-height: 100vh;
          background-color: #2A2A14;
          background-image:
            linear-gradient(rgba(90, 90, 48, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(90, 90, 48, 0.15) 1px, transparent 1px);
          background-size: 40px 40px;
          color: #F0EDD8;
          font-family: 'Courier Prime', 'Courier New', monospace;
        }

        .tactical-root input::placeholder {
          color: #5A5A40;
          opacity: 1;
        }

        .tactical-root input:focus {
          border-color: #9A9A70 !important;
        }

        @media (max-width: 700px) {
          .alert-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="tactical-root">
        {/* ── HEADER ── */}
        <header
          style={{
            borderBottom: "2px solid #5A5A30",
            padding: "24px 40px 20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Classification banner */}
          <div
            style={{
              fontSize: 11,
              letterSpacing: 3,
              color: "#CC2200",
              fontFamily: "'Courier Prime', monospace",
              fontWeight: 700,
              marginBottom: 18,
              textTransform: "uppercase",
            }}
          >
            ▌CLASSIFICATION: TOP SECRET // CLUSTERDESK // INSIDER INTELLIGENCE▐
          </div>

          {/* TOP SECRET stamp */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 40,
              border: "3px solid #CC2200",
              padding: "6px 14px",
              transform: "rotate(-12deg)",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#CC2200",
                fontFamily: "'Special Elite', monospace",
                letterSpacing: 4,
                lineHeight: 1,
                opacity: 0.9,
              }}
            >
              TOP SECRET
            </div>
          </div>

          {/* Mission title */}
          <div
            style={{
              fontSize: 36,
              fontFamily: "'Special Elite', monospace",
              letterSpacing: 4,
              color: "#F0EDD8",
              lineHeight: 1.1,
              marginBottom: 8,
              maxWidth: 680,
            }}
          >
            OPERATION: CLUSTER WATCH
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#9A9A70",
              letterSpacing: 2,
              maxWidth: 680,
              lineHeight: 1.5,
            }}
          >
            REAL-TIME SURVEILLANCE OF COORDINATED INSIDER ACQUISITION EVENTS AT MICRO-CAP
            COMPANIES. SIGNALS INDICATE MATERIAL NON-PUBLIC ACTIVITY. ALL INTEL CLASSIFIED.
          </div>

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              gap: 32,
              marginTop: 20,
              fontSize: 9,
              color: "#9A9A70",
              letterSpacing: 1,
              flexWrap: "wrap",
            }}
          >
            <span>PREPARED BY: CLUSTERDESK ANALYTICS UNIT</span>
            <span>DATE: 2026-05-12</span>
            <span>DOCUMENT CONTROL: SEC-7741-A</span>
            <span>COPY: 1 OF 1</span>
          </div>
        </header>

        {/* ── BODY ── */}
        <main style={{ padding: "40px 40px 60px", maxWidth: 1200, margin: "0 auto" }}>

          {/* Alert count line */}
          <div
            style={{
              fontSize: 10,
              color: "#9A9A70",
              letterSpacing: 2,
              marginBottom: 24,
              borderLeft: "3px solid #CC2200",
              paddingLeft: 12,
            }}
          >
            ACTIVE CLUSTER ALERTS: {ALERTS.length} &nbsp;|&nbsp;
            HIGH PRIORITY: {ALERTS.filter((a) => a.threatLevel === "HIGH").length} &nbsp;|&nbsp;
            LAST SWEEP: 2026-05-12 06:00 UTC
          </div>

          {/* Cards */}
          <div
            className="alert-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              marginBottom: 56,
            }}
          >
            {ALERTS.map((alert) => (
              <AlertCard key={alert.ticker} alert={alert} />
            ))}
          </div>

          {/* Divider with label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 40,
            }}
          >
            <div style={{ flex: 1, borderTop: "1px solid #5A5A30" }} />
            <span style={{ fontSize: 9, color: "#9A9A70", letterSpacing: 3 }}>
              SECURE ENROLLMENT — AUTHORIZED ACCESS ONLY
            </span>
            <div style={{ flex: 1, borderTop: "1px solid #5A5A30" }} />
          </div>

          {/* Email form */}
          <ClearanceForm />
        </main>

        {/* ── FOOTER ── */}
        <footer
          style={{
            borderTop: "2px solid #5A5A30",
            padding: "16px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#9A9A70",
              letterSpacing: 2,
              fontFamily: "'Courier Prime', monospace",
            }}
          >
            DISTRIBUTION: AUTHORIZED PERSONNEL ONLY &nbsp;|&nbsp; DO NOT COPY &nbsp;|&nbsp;
            DESTROY AFTER READING &nbsp;|&nbsp; CLUSTERDESK © 2026
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 8,
              color: "#5A5A40",
              letterSpacing: 1,
            }}
          >
            THIS DOCUMENT CONTAINS INFORMATION AFFECTING THE NATIONAL DEFENSE OF YOUR PORTFOLIO
            WITHIN THE MEANING OF THE ESPIONAGE LAWS, TITLE 18, U.S.C., SECTIONS 793 AND 794.
          </div>
        </footer>
      </div>
    </>
  );
}
