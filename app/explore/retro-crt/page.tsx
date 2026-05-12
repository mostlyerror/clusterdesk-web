"use client";

import React, { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Transaction {
  name: string;
  title: string;
  date: string;
  shares: string;
  value: string;
}

interface ClusterAlert {
  ticker: string;
  company: string;
  score: number;
  insiderCount: number;
  totalValue: string;
  transactions: Transaction[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ALERTS: ClusterAlert[] = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiderCount: 3,
    totalValue: "$312,000",
    transactions: [
      { name: "YANG WU",          title: "CEO", date: "2026-05-01", shares: "45,000 SHS", value: "$180,000" },
      { name: "SASCHA KELTERBORN", title: "DIR", date: "2026-05-03", shares: "20,500 SHS", value: "$82,000"  },
      { name: "CRAIG WEBSTER",    title: "CFO", date: "2026-05-05", shares: "12,500 SHS", value: "$50,000"  },
    ],
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiderCount: 2,
    totalValue: "$88,000",
    transactions: [
      { name: "DAVID MORKEN",     title: "CEO", date: "2026-05-02", shares: "18,200 SHS", value: "$54,600"  },
      { name: "KELLY CAMPBELL",   title: "CFO", date: "2026-05-04", shares: "11,100 SHS", value: "$33,300"  },
    ],
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiderCount: 2,
    totalValue: "$47,000",
    transactions: [
      { name: "JONATHAN REICH",   title: "CEO", date: "2026-05-03", shares: "9,800 SHS",  value: "$29,400"  },
      { name: "YI TSAI",          title: "DIR", date: "2026-05-06", shares: "5,800 SHS",  value: "$17,600"  },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreBar(score: number): string {
  const filled = Math.round(score / 10);
  const empty  = 10 - filled;
  return "[" + "█".repeat(filled) + "░".repeat(empty) + "] " + score + "%";
}

function pad(s: string, width: number): string {
  return s.length >= width ? s.slice(0, width) : s + " ".repeat(width - s.length);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RetroCrtPage() {
  const [email, setEmail]           = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [uptime, setUptime]         = useState("847:23:14");
  const [lastScan, setLastScan]     = useState("00:02:14");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  // Tick uptime every second
  const secondsRef = useRef(847 * 3600 + 23 * 60 + 14);
  useEffect(() => {
    const id = setInterval(() => {
      secondsRef.current += 1;
      const h = Math.floor(secondsRef.current / 3600);
      const m = Math.floor((secondsRef.current % 3600) / 60);
      const s = secondsRef.current % 60;
      setUptime(
        String(h).padStart(3, "0") + ":" +
        String(m).padStart(2, "0") + ":" +
        String(s).padStart(2, "0")
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Tick last-scan counter down from 134s, cycling
  const scanRef = useRef(134);
  useEffect(() => {
    const id = setInterval(() => {
      scanRef.current -= 1;
      if (scanRef.current < 0) scanRef.current = 299;
      const m = Math.floor(scanRef.current / 60);
      const s = scanRef.current % 60;
      setLastScan(
        String(m).padStart(2, "0") + ":" +
        String(s).padStart(2, "0") + " AGO"
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          background: #000000;
          color: #00FF41;
          font-family: 'Share Tech Mono', 'Courier New', Courier, monospace;
          font-size: 13px;
          line-height: 1.6;
          min-height: 100vh;
        }

        /* Scanlines overlay on :root pseudo-element */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          background: repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.15) 0px,
            rgba(0,0,0,0.15) 1px,
            transparent 1px,
            transparent 2px
          );
        }

        /* CRT vignette */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9998;
          background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%);
        }

        @keyframes blink {
          0%, 50%  { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes flicker {
          0%   { opacity: 1; }
          92%  { opacity: 1; }
          93%  { opacity: 0.85; }
          94%  { opacity: 1; }
          96%  { opacity: 0.9; }
          100% { opacity: 1; }
        }

        @keyframes bootLine {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .crt-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px 16px 48px;
          animation: flicker 8s infinite;
        }

        .glow {
          text-shadow:
            0 0 10px #00FF41,
            0 0 20px #00FF41,
            0 0 40px #00FF41;
        }

        .glow-dim {
          text-shadow:
            0 0 6px #00AA2A,
            0 0 12px #00AA2A;
        }

        .blink-cursor::after {
          content: '█';
          display: inline-block;
          animation: blink 1s step-start infinite;
          text-shadow: 0 0 10px #00FF41, 0 0 20px #00FF41;
        }

        .ascii-border {
          border: 1px solid #00AA2A;
          padding: 12px 16px;
          position: relative;
        }

        .dim { color: #00AA2A; }

        .boot-line {
          display: block;
          opacity: 0;
          animation: bootLine 0.3s ease forwards;
        }
        .boot-line:nth-child(1) { animation-delay: 0.1s; }
        .boot-line:nth-child(2) { animation-delay: 0.5s; }
        .boot-line:nth-child(3) { animation-delay: 0.9s; }

        .card-toggle {
          background: none;
          border: none;
          color: #00FF41;
          font-family: inherit;
          font-size: inherit;
          cursor: pointer;
          width: 100%;
          text-align: left;
          padding: 0;
        }
        .card-toggle:hover { text-shadow: 0 0 10px #00FF41, 0 0 20px #00FF41; }

        .subscribe-input {
          background: transparent;
          border: none;
          outline: none;
          color: #00FF41;
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          width: 280px;
          caret-color: #00FF41;
          text-shadow: 0 0 8px #00FF41;
        }
        .subscribe-input::placeholder { color: #00AA2A; }

        .submit-btn {
          background: #00FF41;
          color: #000;
          border: none;
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          padding: 2px 12px;
          cursor: pointer;
          margin-left: 12px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .submit-btn:hover {
          background: #00AA2A;
        }

        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          text-align: left;
          padding: 2px 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          white-space: nowrap;
        }
        th {
          color: #00AA2A;
          border-bottom: 1px solid #00AA2A;
        }
        td { color: #00FF41; }
        tr:hover td { background: rgba(0,255,65,0.05); }
      `}</style>

      <main className="crt-page">

        {/* ── HEADER ────────────────────────────────────────── */}
        <div style={{ border: "1px solid #00FF41", padding: "16px 20px", marginBottom: 24, boxShadow: "0 0 20px rgba(0,255,65,0.25), inset 0 0 20px rgba(0,255,65,0.03)" }}>
          {/* top rule */}
          <div className="dim" style={{ letterSpacing: 1, marginBottom: 8, fontSize: 11 }}>
            {"┌" + "─".repeat(68) + "┐"}
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="glow" style={{ fontSize: 18, letterSpacing: 3, fontWeight: "bold" }}>
              ██████╗ ██╗     ██╗   ██╗███████╗████████╗███████╗██████╗
            </div>
            <div className="glow" style={{ fontSize: 18, letterSpacing: 3 }}>
              CLUSTERDESK  INTELLIGENCE  SYSTEM  v2.6
            </div>
          </div>
          <div className="dim" style={{ letterSpacing: 1, marginTop: 8, marginBottom: 10, fontSize: 11 }}>
            {"└" + "─".repeat(68) + "┘"}
          </div>

          {/* status bar */}
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 11, color: "#00AA2A", marginTop: 4 }}>
            <span>UPTIME: <span className="glow" style={{ color: "#00FF41" }}>{uptime}</span></span>
            <span className="glow" style={{ color: "#00FF41" }}>■ SYSTEM ONLINE</span>
            <span>DATE: <span style={{ color: "#00FF41" }}>2026-05-12</span></span>
          </div>
        </div>

        {/* ── BOOT SEQUENCE ─────────────────────────────────── */}
        <div style={{ marginBottom: 24, paddingLeft: 4, borderLeft: "2px solid #00AA2A" }}>
          <div className="dim" style={{ marginBottom: 4, fontSize: 11 }}>{"> SYSTEM BOOT LOG"}</div>
          <span className="boot-line dim">
            {"[  0.001] "}<span style={{ color: "#00FF41" }}>INITIALIZING INSIDER MONITOR............</span><span className="glow" style={{ color: "#00FF41" }}>  OK</span>
          </span>
          <span className="boot-line dim" style={{ animationDelay: "0.5s" }}>
            {"[  0.047] "}<span style={{ color: "#00FF41" }}>CONNECTING TO SEC DATABASE..............</span><span className="glow" style={{ color: "#00FF41" }}>  OK</span>
          </span>
          <span className="boot-line dim" style={{ animationDelay: "0.9s" }}>
            {"[  0.112] "}<span style={{ color: "#00FF41" }}>LOADING CLUSTER ALGORITHMS..............</span><span className="glow" style={{ color: "#00FF41" }}>  OK</span>
          </span>
        </div>

        {/* ── SYSTEM STATUS BAR ─────────────────────────────── */}
        <div style={{
          background: "rgba(0,255,65,0.06)",
          border: "1px solid #00AA2A",
          padding: "8px 16px",
          marginBottom: 28,
          fontSize: 11,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8
        }}>
          <span className="dim">MONITORING: <span className="glow" style={{ color: "#00FF41" }}>4,847 COMPANIES</span></span>
          <span className="dim">ACTIVE ALERTS: <span className="glow" style={{ color: "#00FF41" }}>3</span></span>
          <span className="dim">LAST SCAN: <span style={{ color: "#00FF41" }}>{lastScan}</span></span>
          <span className="dim">FEED: <span style={{ color: "#00FF41" }}>SEC EDGAR LIVE</span></span>
        </div>

        {/* ── SECTION HEADER ────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <div className="glow" style={{ fontSize: 14, letterSpacing: 2, marginBottom: 4 }}>
            {"┌─[ CLUSTER BUY ALERTS ]─────────────────────────────────────────────"}
          </div>
          <div className="dim" style={{ fontSize: 11, paddingLeft: 4 }}>
            {"  ALGORITHM: 2+ INSIDERS BUYING WITHIN 10 DAYS  |  UNIVERSE: MICRO-CAP"}
          </div>
        </div>

        {/* ── ALERT CARDS ───────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {ALERTS.map((alert, idx) => {
            const isExpanded = expandedIdx === idx;
            return (
              <div
                key={alert.ticker}
                style={{
                  border: `1px solid ${isExpanded ? "#00FF41" : "#00AA2A"}`,
                  boxShadow: isExpanded ? "0 0 16px rgba(0,255,65,0.2)" : "none",
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Card header — always visible */}
                <button className="card-toggle" onClick={() => setExpandedIdx(isExpanded ? null : idx)}>
                  <div style={{ padding: "10px 16px", display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                    {/* Ticker */}
                    <div style={{ minWidth: 56 }}>
                      <div className="glow" style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 2 }}>{alert.ticker}</div>
                    </div>
                    {/* Company + score bar */}
                    <div style={{ flex: 1 }}>
                      <div className="dim" style={{ fontSize: 11, marginBottom: 2 }}>{alert.company.toUpperCase()}</div>
                      <div className="glow" style={{ fontSize: 12, letterSpacing: 1 }}>{scoreBar(alert.score)}</div>
                    </div>
                    {/* Stats */}
                    <div style={{ textAlign: "right", fontSize: 11 }}>
                      <div className="dim">INSIDERS: <span style={{ color: "#00FF41" }}>{alert.insiderCount}</span></div>
                      <div className="dim">TOTAL: <span className="glow" style={{ color: "#00FF41" }}>{alert.totalValue}</span></div>
                    </div>
                    {/* Expand indicator */}
                    <div className="dim" style={{ fontSize: 11, minWidth: 24, paddingTop: 2 }}>
                      {isExpanded ? "[-]" : "[+]"}
                    </div>
                  </div>
                </button>

                {/* Expanded transaction table */}
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #00AA2A", padding: "12px 16px 14px" }}>
                    <div className="dim" style={{ fontSize: 11, marginBottom: 8 }}>
                      {"  ┌─[ TRANSACTION LOG ]───────────────────────────────────────"}
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>NAME</th>
                          <th>ROLE</th>
                          <th>DATE</th>
                          <th>SHARES</th>
                          <th>VALUE</th>
                          <th>TYPE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alert.transactions.map((tx, ti) => (
                          <tr key={ti}>
                            <td>{pad(tx.name, 18)}</td>
                            <td>{pad(tx.title, 5)}</td>
                            <td>{tx.date}</td>
                            <td style={{ textAlign: "right" }}>{tx.shares}</td>
                            <td style={{ textAlign: "right" }} className="glow">{tx.value}</td>
                            <td><span style={{ color: "#00FF41", fontSize: 11 }}>OPEN-MKT BUY</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ marginTop: 10, paddingLeft: 4, fontSize: 11, color: "#00AA2A" }}>
                      {"  └────────────────────────────────────────────────────────────"}
                    </div>
                    {/* Cluster signature visualization */}
                    <div style={{ marginTop: 10, paddingLeft: 4 }}>
                      <div className="dim" style={{ fontSize: 11, marginBottom: 4 }}>CLUSTER TIMELINE:</div>
                      <div style={{ fontSize: 11, color: "#00FF41", letterSpacing: 1 }}>
                        {alert.transactions.map((tx, ti) => (
                          <div key={ti} style={{ display: "flex", gap: 8 }}>
                            <span className="dim">{tx.date}</span>
                            <span>{"▶ " + tx.name + " [" + tx.title + "]"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── AGGREGATE SUMMARY TABLE ───────────────────────── */}
        <div style={{ border: "1px solid #00AA2A", padding: "14px 16px", marginBottom: 32 }}>
          <div className="glow" style={{ fontSize: 13, letterSpacing: 2, marginBottom: 10 }}>
            {"┌─[ ALERT SUMMARY TABLE ]────────────────────────────────────────────"}
          </div>
          <table>
            <thead>
              <tr>
                <th>TICKER</th>
                <th>COMPANY</th>
                <th>SCORE</th>
                <th>INSIDERS</th>
                <th>TOTAL VALUE</th>
                <th>SIGNAL</th>
              </tr>
            </thead>
            <tbody>
              {ALERTS.map((a) => (
                <tr key={a.ticker} style={{ cursor: "pointer" }} onClick={() => setExpandedIdx(ALERTS.indexOf(a))}>
                  <td className="glow" style={{ fontWeight: "bold", letterSpacing: 1 }}>{a.ticker}</td>
                  <td className="dim">{a.company.toUpperCase()}</td>
                  <td>{scoreBar(a.score)}</td>
                  <td style={{ textAlign: "center" }}>{a.insiderCount}</td>
                  <td className="glow">{a.totalValue}</td>
                  <td style={{ fontSize: 11, color: a.score >= 80 ? "#00FF41" : "#00AA2A" }}>
                    {a.score >= 80 ? "◉ STRONG" : a.score >= 70 ? "◎ MODERATE" : "○ WATCH"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── HOW IT WORKS ──────────────────────────────────── */}
        <div style={{ border: "1px solid #00AA2A", padding: "14px 16px", marginBottom: 32, fontSize: 12 }}>
          <div className="glow" style={{ fontSize: 13, letterSpacing: 2, marginBottom: 10 }}>
            {"┌─[ ALGORITHM OVERVIEW ]─────────────────────────────────────────────"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              ["> STEP 1", "INGEST  SEC Form 4 filings in real-time via EDGAR feed"],
              ["> STEP 2", "FILTER  Open-market purchases only. No options, no grants"],
              ["> STEP 3", "CLUSTER Detect 2+ execs buying within 10-day rolling window"],
              ["> STEP 4", "SCORE   Weight by role, dollar size, days-between, history"],
            ].map(([step, desc]) => (
              <div key={step}>
                <div className="glow" style={{ fontSize: 11, marginBottom: 2 }}>{step}</div>
                <div className="dim" style={{ fontSize: 11 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SUBSCRIBE ─────────────────────────────────────── */}
        <div style={{
          border: "1px solid #00FF41",
          padding: "20px 20px",
          boxShadow: "0 0 24px rgba(0,255,65,0.18), inset 0 0 30px rgba(0,255,65,0.04)",
          marginBottom: 32
        }}>
          <div className="glow" style={{ fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>
            {"┌─[ SUBSCRIBE TO CLUSTER ALERTS ]────────────────────────────────────"}
          </div>
          <div className="dim" style={{ fontSize: 11, marginBottom: 16 }}>
            {"  RECEIVE DAILY 06:30 ET BRIEFING VIA EMAIL WHEN NEW CLUSTERS FIRE."}
          </div>

          {!submitted ? (
            <form onSubmit={handleSubscribe} style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <span className="glow" style={{ fontSize: 13 }}>&gt; ENTER EMAIL TO SUBSCRIBE:</span>
              <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #00AA2A", paddingBottom: 1 }}>
                <input
                  className="subscribe-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="off"
                  spellCheck={false}
                />
                {email === "" && <span style={{ animation: "blink 1s step-start infinite", color: "#00FF41", textShadow: "0 0 10px #00FF41" }}>█</span>}
              </div>
              <button className="submit-btn" type="submit">[ EXECUTE ]</button>
            </form>
          ) : (
            <div>
              <div className="glow" style={{ fontSize: 13 }}>{"▶ SUBSCRIBER RECORD CREATED."}</div>
              <div className="dim" style={{ fontSize: 11, marginTop: 4 }}>{"  CONFIRMATION TRANSMITTED TO: " + email}</div>
              <div className="dim" style={{ fontSize: 11 }}>{"  NEXT BRIEFING: 2026-05-13 06:30 ET"}</div>
            </div>
          )}
        </div>

        {/* ── FOOTER ────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #00AA2A", paddingTop: 14, fontSize: 11 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span className="dim">CLUSTERDESK v2.6 © 2026</span>
            <span className="dim">NOT INVESTMENT ADVICE. FOR INFORMATIONAL USE ONLY.</span>
            <span className="dim blink-cursor"></span>
          </div>
          <div className="dim" style={{ marginTop: 6, textAlign: "center", fontSize: 10, letterSpacing: 1 }}>
            DATA SOURCE: SEC EDGAR  |  FORM 4 FILINGS  |  REFRESH CYCLE: 5 MIN  |  LATENCY: &lt;30S
          </div>
        </div>

      </main>
    </>
  );
}
