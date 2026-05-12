"use client";

import React, { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const clusters = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    romanScore: "LXXXVII",
    insiders: 3,
    totalValue: "$312K",
    roles: "Chief Executive Officer, Chief Financial Officer & Director",
    daysSpan: 4,
    certNo: "No. 00841",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    romanScore: "LXXIV",
    insiders: 2,
    totalValue: "$88K",
    roles: "Chief Executive Officer & Director",
    daysSpan: 6,
    certNo: "No. 00842",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    romanScore: "LXII",
    insiders: 2,
    totalValue: "$47K",
    roles: "President & Director",
    daysSpan: 9,
    certNo: "No. 00843",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toOrdinal(n: number): string {
  if (n === 1) return "FIRST";
  if (n === 2) return "SECOND";
  if (n === 3) return "THIRD";
  return `${n}TH`;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=IM+Fell+English:ital@0;1&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --cream: #F8F4E8;
    --cream-dark: #EDE7CF;
    --navy: #1A237E;
    --navy-light: #283593;
    --green: #1B5E20;
    --gold: #C9A84C;
    --gold-light: #DFC06A;
    --gold-dark: #9A7A30;
    --dark: #1A1208;
  }

  /* ── Page shell ─────────────────────────────────────── */
  .cert-page {
    min-height: 100vh;
    background-color: var(--cream);
    font-family: 'IM Fell English', serif;
    color: var(--dark);
    overflow-x: hidden;
    position: relative;
  }

  .cert-page * {
    font-family: 'IM Fell English', serif;
  }

  .cinzel { font-family: 'Cinzel', serif !important; }

  /* ── Guilloché background ───────────────────────────── */
  .guilloche-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      repeating-radial-gradient(
        circle at 50% 50%,
        transparent 0,
        transparent 18px,
        rgba(201,168,76,0.07) 19px,
        transparent 20px
      ),
      repeating-radial-gradient(
        circle at 20% 80%,
        transparent 0,
        transparent 28px,
        rgba(26,35,126,0.04) 29px,
        transparent 30px
      ),
      repeating-radial-gradient(
        circle at 80% 20%,
        transparent 0,
        transparent 22px,
        rgba(27,94,32,0.04) 23px,
        transparent 24px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 39px,
        rgba(201,168,76,0.04) 40px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 39px,
        rgba(201,168,76,0.04) 40px
      ),
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 27px,
        rgba(201,168,76,0.025) 28px,
        transparent 29px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 27px,
        rgba(201,168,76,0.025) 28px,
        transparent 29px
      );
  }

  /* ── Page border (outer frame) ─────────────────────── */
  .cert-outer-border {
    position: relative;
    z-index: 1;
    margin: 24px;
    border: 8px double var(--gold);
    box-shadow:
      inset 0 0 0 4px var(--cream),
      inset 0 0 0 6px var(--gold-dark),
      0 0 0 2px var(--gold-dark),
      0 4px 32px rgba(26,35,126,0.12);
    min-height: calc(100vh - 48px);
    padding: 20px;
  }

  .cert-inner-border {
    border: 2px solid var(--gold);
    box-shadow: inset 0 0 0 1px rgba(201,168,76,0.4);
    padding: 40px 48px 48px;
    min-height: 100%;
    position: relative;
  }

  /* ── Corner medallions ──────────────────────────────── */
  .corner-medallion {
    position: absolute;
    width: 52px;
    height: 52px;
  }
  .corner-medallion.tl { top: -2px; left: -2px; }
  .corner-medallion.tr { top: -2px; right: -2px; transform: scaleX(-1); }
  .corner-medallion.bl { bottom: -2px; left: -2px; transform: scaleY(-1); }
  .corner-medallion.br { bottom: -2px; right: -2px; transform: scale(-1,-1); }

  /* ── Nav strip ──────────────────────────────────────── */
  .cert-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--gold);
    padding-bottom: 12px;
    margin-bottom: 32px;
  }

  .cert-nav-link {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 0.22em;
    color: var(--navy);
    text-decoration: none;
    text-transform: uppercase;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  .cert-nav-link:hover { opacity: 1; }

  /* ── Header band ────────────────────────────────────── */
  .cert-header {
    text-align: center;
    margin-bottom: 32px;
    position: relative;
  }

  .cert-issuer {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    font-weight: 400;
    letter-spacing: 0.45em;
    color: var(--green);
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .cert-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(28px, 5.5vw, 56px);
    font-weight: 900;
    color: var(--navy);
    letter-spacing: 0.18em;
    line-height: 1;
    margin-bottom: 6px;
    text-shadow: 1px 1px 0 rgba(26,35,126,0.18);
  }

  .cert-subtitle {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.3em;
    color: var(--green);
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  /* ── Gold divider rules ─────────────────────────────── */
  .gold-rule {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 18px 0;
  }

  .gold-rule-line {
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold) 20%, var(--gold) 80%, transparent);
  }

  .gold-rule-line.short { max-width: 200px; }
  .gold-rule-line.long  { max-width: 100%; }

  .gold-ornament {
    color: var(--gold);
    font-size: 18px;
    line-height: 1;
    user-select: none;
  }

  .gold-thin-rule {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold-dark) 15%, var(--gold) 50%, var(--gold-dark) 85%, transparent);
    margin: 14px 0;
  }

  /* ── KNOW ALL MEN banner ────────────────────────────── */
  .know-all-banner {
    text-align: center;
    margin: 28px 0 20px;
  }

  .know-all-text {
    font-family: 'Cinzel', serif;
    font-size: clamp(14px, 2.2vw, 22px);
    font-weight: 700;
    letter-spacing: 0.28em;
    color: var(--navy);
    text-transform: uppercase;
    display: inline-block;
    border-top: 2px solid var(--gold);
    border-bottom: 2px solid var(--gold);
    padding: 8px 24px;
    position: relative;
  }

  .know-all-text::before,
  .know-all-text::after {
    content: '✦';
    color: var(--gold);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
  }
  .know-all-text::before { left: -20px; }
  .know-all-text::after  { right: -20px; }

  /* ── Preamble text ──────────────────────────────────── */
  .cert-preamble {
    font-size: 14px;
    line-height: 1.95;
    text-align: justify;
    color: var(--dark);
    letter-spacing: 0.02em;
    max-width: 860px;
    margin: 0 auto;
  }

  .cert-preamble em {
    font-style: italic;
  }

  .cert-preamble strong {
    font-family: 'Cinzel', serif;
    font-weight: 700;
    color: var(--navy);
    font-size: 13px;
    letter-spacing: 0.08em;
  }

  /* ── Section heading ────────────────────────────────── */
  .section-heading {
    text-align: center;
    margin: 36px 0 24px;
  }

  .section-heading h2 {
    font-family: 'Cinzel', serif;
    font-size: clamp(13px, 2vw, 18px);
    font-weight: 700;
    letter-spacing: 0.3em;
    color: var(--navy);
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .section-heading .sub {
    font-size: 12px;
    font-style: italic;
    color: rgba(26,18,8,0.55);
    letter-spacing: 0.04em;
  }

  /* ── Cluster certificate cards ─────────────────────── */
  .cluster-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    margin: 32px 0;
  }

  @media (max-width: 900px) {
    .cluster-grid { grid-template-columns: 1fr; }
  }

  .cluster-cert {
    background: var(--cream);
    position: relative;
    /* Multi-layer engraved borders */
    box-shadow:
      0 0 0 1px var(--gold-dark),
      0 0 0 5px var(--cream),
      0 0 0 7px var(--gold),
      0 0 0 11px var(--cream),
      0 0 0 13px rgba(201,168,76,0.5),
      4px 6px 20px rgba(26,35,126,0.12);
    padding: 32px 28px 28px;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .cluster-cert:hover {
    transform: translateY(-3px);
    box-shadow:
      0 0 0 1px var(--gold),
      0 0 0 5px var(--cream),
      0 0 0 7px var(--gold),
      0 0 0 11px var(--cream),
      0 0 0 13px var(--gold-dark),
      6px 12px 32px rgba(26,35,126,0.2);
  }

  .cert-number {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 0.22em;
    color: rgba(26,18,8,0.4);
    margin-bottom: 14px;
    text-align: right;
  }

  .cert-ticker-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    gap: 12px;
  }

  .cert-ticker {
    font-family: 'Cinzel', serif;
    font-size: 30px;
    font-weight: 900;
    color: var(--navy);
    letter-spacing: 0.12em;
    line-height: 1;
  }

  .cert-company-name {
    font-size: 11px;
    font-style: italic;
    color: rgba(26,18,8,0.6);
    margin-top: 4px;
    line-height: 1.4;
  }

  /* Roman numeral score medallion */
  .score-seal {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 2px solid var(--gold);
    box-shadow:
      0 0 0 4px var(--cream),
      0 0 0 6px var(--gold-dark);
    background: var(--cream-dark);
    flex-shrink: 0;
    position: relative;
  }

  .score-seal::before {
    content: '';
    position: absolute;
    inset: 5px;
    border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.4);
  }

  .score-roman {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    font-weight: 700;
    color: var(--navy);
    letter-spacing: 0.04em;
    line-height: 1;
    text-align: center;
    padding: 0 4px;
  }

  .score-label {
    font-family: 'Cinzel', serif;
    font-size: 7px;
    letter-spacing: 0.14em;
    color: var(--green);
    text-transform: uppercase;
    margin-top: 3px;
  }

  /* Card body */
  .cert-body-text {
    font-size: 11.5px;
    line-height: 1.85;
    text-align: justify;
    color: rgba(26,18,8,0.75);
    margin: 12px 0 16px;
    letter-spacing: 0.01em;
  }

  .cert-body-text em { font-style: italic; }
  .cert-body-text strong {
    font-family: 'Cinzel', serif;
    font-weight: 700;
    color: var(--navy);
    font-size: 11px;
  }

  .cert-stats-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
  }

  .cert-stats-table td {
    padding: 5px 0;
    font-size: 11px;
    border-bottom: 1px solid rgba(201,168,76,0.25);
    vertical-align: top;
  }

  .cert-stats-table td:first-child {
    font-family: 'Cinzel', serif;
    font-size: 8.5px;
    letter-spacing: 0.16em;
    color: rgba(26,18,8,0.4);
    text-transform: uppercase;
    width: 42%;
    padding-right: 8px;
  }

  .cert-stats-table td:last-child {
    color: var(--navy);
    font-weight: 400;
    letter-spacing: 0.02em;
  }

  .cert-stats-table tr:last-child td {
    border-bottom: none;
  }

  .cert-value-highlight {
    font-family: 'Cinzel', serif;
    font-size: 12px;
    font-weight: 700;
    color: var(--green);
  }

  .cert-card-footer {
    margin-top: 18px;
    border-top: 1px solid var(--gold);
    padding-top: 12px;
    text-align: center;
  }

  .cert-card-footer-text {
    font-size: 9px;
    font-style: italic;
    color: rgba(26,18,8,0.4);
    letter-spacing: 0.06em;
    line-height: 1.5;
  }

  /* ── Company seal (circular CSS) ───────────────────── */
  .company-seal-wrapper {
    display: flex;
    justify-content: center;
    margin: 36px 0;
  }

  .company-seal {
    position: relative;
    width: 160px;
    height: 160px;
  }

  .seal-outer-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid var(--navy);
    box-shadow: 0 0 0 2px var(--cream), 0 0 0 4px var(--gold), 0 0 0 6px var(--cream), 0 0 0 8px rgba(26,35,126,0.25);
  }

  .seal-inner-ring {
    position: absolute;
    inset: 16px;
    border-radius: 50%;
    border: 1px solid var(--gold-dark);
  }

  .seal-innermost {
    position: absolute;
    inset: 22px;
    border-radius: 50%;
    background: var(--cream-dark);
    border: 1px solid rgba(201,168,76,0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }

  .seal-eagle {
    font-size: 28px;
    line-height: 1;
    opacity: 0.85;
  }

  .seal-est {
    font-family: 'Cinzel', serif;
    font-size: 7px;
    letter-spacing: 0.22em;
    color: var(--navy);
    opacity: 0.7;
  }

  .seal-year {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.16em;
    color: var(--navy);
  }

  /* ── Rotating text path (SVG) ───────────────────────── */
  .seal-text-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .seal-text-path {
    font-family: 'Cinzel', serif;
    font-size: 9.5px;
    letter-spacing: 3.4px;
    fill: var(--navy);
    font-weight: 700;
  }

  /* ── Email capture ──────────────────────────────────── */
  .apply-section {
    margin: 40px 0 8px;
    background: var(--cream-dark);
    border: 2px solid var(--gold);
    box-shadow:
      inset 0 0 0 4px var(--cream),
      inset 0 0 0 6px rgba(201,168,76,0.3);
    padding: 40px 48px;
    text-align: center;
    position: relative;
  }

  .apply-section::before {
    content: '❦';
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 28px;
    color: var(--gold);
    background: var(--cream);
    padding: 0 12px;
    line-height: 1;
  }

  .apply-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(16px, 2.5vw, 24px);
    font-weight: 900;
    letter-spacing: 0.24em;
    color: var(--navy);
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .apply-subtitle {
    font-size: 14px;
    font-style: italic;
    color: rgba(26,18,8,0.6);
    margin-bottom: 20px;
    line-height: 1.7;
  }

  .apply-form {
    display: flex;
    max-width: 500px;
    margin: 24px auto 0;
    gap: 0;
  }

  .apply-input {
    flex: 1;
    background: var(--cream);
    border: 2px solid var(--gold-dark);
    border-right: none;
    color: var(--dark);
    padding: 13px 18px;
    font-family: 'IM Fell English', serif;
    font-size: 13px;
    font-style: italic;
    letter-spacing: 0.04em;
    outline: none;
    transition: border-color 0.2s;
  }

  .apply-input::placeholder {
    color: rgba(26,18,8,0.35);
    font-style: italic;
  }

  .apply-input:focus {
    border-color: var(--navy);
  }

  .apply-button {
    background: var(--navy);
    color: var(--cream);
    border: 2px solid var(--navy);
    padding: 13px 24px;
    font-family: 'Cinzel', serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    cursor: pointer;
    text-transform: uppercase;
    white-space: nowrap;
    transition: background 0.2s, color 0.2s;
  }

  .apply-button:hover {
    background: var(--gold-dark);
    border-color: var(--gold-dark);
    color: var(--dark);
  }

  .apply-fine-print {
    font-size: 10px;
    font-style: italic;
    color: rgba(26,18,8,0.38);
    margin-top: 14px;
    letter-spacing: 0.04em;
  }

  .apply-confirmed {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    border: 2px solid var(--green);
    padding: 16px 32px;
    margin-top: 20px;
    color: var(--green);
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 0.22em;
    font-weight: 700;
  }

  /* ── Methodology section ────────────────────────────── */
  .method-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--gold);
    border: 1px solid var(--gold);
    margin: 24px 0;
  }

  @media (max-width: 700px) {
    .method-grid { grid-template-columns: 1fr 1fr; }
  }

  .method-cell {
    background: var(--cream);
    padding: 24px 20px;
    text-align: center;
  }

  .method-numeral {
    font-family: 'Cinzel', serif;
    font-size: 22px;
    font-weight: 900;
    color: rgba(201,168,76,0.6);
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }

  .method-label {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--navy);
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .method-desc {
    font-size: 11px;
    font-style: italic;
    color: rgba(26,18,8,0.55);
    line-height: 1.65;
  }

  /* ── Footer ─────────────────────────────────────────── */
  .cert-footer {
    border-top: 2px solid var(--gold);
    padding-top: 24px;
    margin-top: 40px;
    text-align: center;
  }

  .footer-logo {
    font-family: 'Cinzel', serif;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 0.3em;
    color: var(--navy);
    opacity: 0.5;
    margin-bottom: 4px;
  }

  .footer-sub {
    font-family: 'Cinzel', serif;
    font-size: 8px;
    letter-spacing: 0.35em;
    color: rgba(26,18,8,0.35);
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .footer-disclaimer {
    font-size: 10px;
    font-style: italic;
    color: rgba(26,18,8,0.38);
    line-height: 1.8;
    max-width: 680px;
    margin: 0 auto 20px;
    letter-spacing: 0.02em;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 28px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .footer-link {
    font-family: 'Cinzel', serif;
    font-size: 8px;
    letter-spacing: 0.18em;
    color: rgba(26,35,126,0.4);
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-link:hover { color: var(--navy); }

  /* ── Animations ─────────────────────────────────────── */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fade-in-1 { animation: fadeIn 0.9s ease-out 0.1s both; }
  .fade-in-2 { animation: fadeIn 0.9s ease-out 0.3s both; }
  .fade-in-3 { animation: fadeIn 0.9s ease-out 0.5s both; }
  .fade-in-4 { animation: fadeIn 0.9s ease-out 0.7s both; }

  @keyframes sealSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .seal-ring-spin {
    animation: sealSpin 80s linear infinite;
    transform-origin: center;
  }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function GoldRule({ ornament = "✦" }: { ornament?: string }) {
  return (
    <div className="gold-rule">
      <div className="gold-rule-line long" />
      <span className="gold-ornament">{ornament}</span>
      <div className="gold-rule-line short" />
      <span className="gold-ornament">{ornament}</span>
      <div className="gold-rule-line long" />
    </div>
  );
}

function CornerMedallion({ className }: { className: string }) {
  return (
    <svg
      className={`corner-medallion ${className}`}
      viewBox="0 0 52 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer corner L-bracket */}
      <path d="M2 2 L2 22 M2 2 L22 2" stroke="#C9A84C" strokeWidth="3" />
      <path d="M6 6 L6 18 M6 6 L18 6" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5" />
      {/* Floral knot */}
      <circle cx="6" cy="6" r="3.5" fill="#C9A84C" opacity="0.7" />
      <circle cx="6" cy="6" r="1.5" fill="#F8F4E8" />
      {/* Small diamonds on legs */}
      <rect x="2" y="12" width="4" height="4" transform="rotate(45 4 14)" fill="#C9A84C" opacity="0.5" />
      <rect x="12" y="2" width="4" height="4" transform="rotate(45 14 4)" fill="#C9A84C" opacity="0.5" />
      {/* Filigree lines */}
      <path d="M10 2 C10 8 2 10 2 10" stroke="#9A7A30" strokeWidth="0.75" opacity="0.5" />
    </svg>
  );
}

function CompanySeal() {
  return (
    <div className="company-seal-wrapper">
      <div className="company-seal">
        <div className="seal-outer-ring" />
        <div className="seal-inner-ring" />
        <div className="seal-innermost">
          <span className="seal-eagle">⚖</span>
          <span className="seal-est">EST.</span>
          <span className="seal-year">MMXXIV</span>
        </div>
        {/* Rotating text path */}
        <svg className="seal-text-svg" viewBox="0 0 160 160">
          <defs>
            <path
              id="sealCircle"
              d="M 80,80 m -58,0 a 58,58 0 1,1 116,0 a 58,58 0 1,1 -116,0"
            />
          </defs>
          <g className="seal-ring-spin">
            <text className="seal-text-path">
              <textPath href="#sealCircle" startOffset="0%">
                CLUSTERDESK INTELLIGENCE CORPORATION ✦ ESTABLISHED MMXXIV ✦
              </textPath>
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

function ClusterCertCard({
  cluster,
  index,
}: {
  cluster: (typeof clusters)[0];
  index: number;
}) {
  return (
    <div
      className="cluster-cert"
      style={{ animationDelay: `${0.2 + index * 0.18}s` }}
    >
      {/* Certificate number top-right */}
      <div className="cert-number cinzel">{cluster.certNo}</div>

      {/* Ticker + score seal */}
      <div className="cert-ticker-row">
        <div>
          <div className="cert-ticker">{cluster.ticker}</div>
          <div className="cert-company-name">{cluster.company}</div>
        </div>
        <div className="score-seal">
          <div className="score-roman">{cluster.romanScore}</div>
          <div className="score-label">Score</div>
        </div>
      </div>

      {/* Thin rule */}
      <div className="gold-thin-rule" />

      {/* Legal body text */}
      <p className="cert-body-text">
        <em>This certifies that</em> <strong>{cluster.ticker} / {cluster.company.toUpperCase()}</strong>{" "}
        <em>
          has been identified as exhibiting insider cluster buying activity,
          wherein{" "}
        </em>
        <strong>{toOrdinal(cluster.insiders)} ({cluster.insiders}) EXECUTIVE OFFICER{cluster.insiders > 1 ? "S" : ""}</strong>
        <em>
          {" "}of said corporation have independently acquired shares of common
          stock within a period of{" "}
        </em>
        <strong>{cluster.daysSpan} ({cluster.daysSpan}) CALENDAR DAYS</strong>
        <em>, collectively deploying capital in the aggregate sum of </em>
        <strong>{cluster.totalValue}</strong>
        <em>.</em>
      </p>

      {/* Stats */}
      <table className="cert-stats-table">
        <tbody>
          <tr>
            <td>Principals</td>
            <td>{cluster.roles}</td>
          </tr>
          <tr>
            <td>Capital Deployed</td>
            <td>
              <span className="cert-value-highlight cinzel">{cluster.totalValue}</span>
            </td>
          </tr>
          <tr>
            <td>Acquisition Window</td>
            <td>{cluster.daysSpan} Days</td>
          </tr>
          <tr>
            <td>Conviction Index</td>
            <td>
              <span className="cert-value-highlight cinzel">{cluster.romanScore}</span>
              <span style={{ fontSize: "10px", color: "rgba(26,18,8,0.45)", marginLeft: 6 }}>
                / C
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="cert-card-footer">
        <div className="cert-card-footer-text">
          ❧ Issued pursuant to public SEC Form 4 filings ❧
          <br />
          ClusterDesk Intelligence Corporation · MMXXVI
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StockCertificatePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <>
      <style>{css}</style>

      {/* Guilloché background layer */}
      <div className="guilloche-bg" />

      <div className="cert-page">
        <div className="cert-outer-border">
          <div className="cert-inner-border">

            {/* Corner medallions */}
            <CornerMedallion className="tl" />
            <CornerMedallion className="tr" />
            <CornerMedallion className="bl" />
            <CornerMedallion className="br" />

            {/* ── Navigation ──────────────────────────────── */}
            <nav className="cert-nav">
              <div style={{ display: "flex", gap: 28 }}>
                {["Markets", "Filings", "Archives"].map((l) => (
                  <a key={l} href="#" className="cert-nav-link cinzel">{l}</a>
                ))}
              </div>
              <div
                className="cinzel"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.3em",
                  color: "var(--gold-dark)",
                  opacity: 0.8,
                }}
              >
                ✦ MMXXVI ✦
              </div>
              <div style={{ display: "flex", gap: 28 }}>
                {["Methodology", "Disclaimer", "Subscribe"].map((l) => (
                  <a key={l} href="#" className="cert-nav-link cinzel">{l}</a>
                ))}
              </div>
            </nav>

            {/* ── Certificate Header ───────────────────────── */}
            <header className="cert-header fade-in-1">
              <div className="cert-issuer cinzel">
                ClusterDesk Intelligence Corporation
              </div>

              <div className="gold-thin-rule" />

              <h1 className="cert-title cinzel">CLUSTERDESK</h1>
              <div className="cert-subtitle cinzel">
                Insider Cluster Intelligence · Micro-Cap Securities
              </div>

              <GoldRule ornament="❦" />

              {/* KNOW ALL MEN banner */}
              <div className="know-all-banner">
                <span className="know-all-text cinzel">
                  Know All Men by These Presents
                </span>
              </div>
            </header>

            {/* ── Preamble ─────────────────────────────────── */}
            <section className="fade-in-2" style={{ maxWidth: 860, margin: "0 auto" }}>
              <p className="cert-preamble">
                <strong>THAT</strong> <em>this instrument, duly prepared and issued by the</em>{" "}
                <strong>CLUSTERDESK INTELLIGENCE CORPORATION</strong>
                <em>
                  , organised and existing under the laws of these United States, does
                  hereby certify and attest — upon diligent examination of all public
                  filings submitted to the Securities and Exchange Commission — that the
                  hereinafter-enumerated corporations have each exhibited a pattern of{" "}
                </em>
                <strong>INSIDER CLUSTER BUYING</strong>
                <em>
                  , defined as the independent acquisition of shares of common stock by
                  two (2) or more corporate executive officers or directors within a
                  compressed period, constituting a signal of coordinated private
                  conviction of material significance to the discerning investor.
                </em>
              </p>

              <GoldRule ornament="✦" />
            </section>

            {/* ── Company Seal ─────────────────────────────── */}
            <CompanySeal />

            <GoldRule ornament="❧" />

            {/* ── Cluster Cards ─────────────────────────────── */}
            <section className="fade-in-3">
              <div className="section-heading">
                <h2 className="cinzel">Active Cluster Certificates</h2>
                <div className="sub">
                  Ranked by Conviction Index · Issued {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>

              <div className="cluster-grid">
                {clusters.map((c, i) => (
                  <ClusterCertCard key={c.ticker} cluster={c} index={i} />
                ))}
              </div>
            </section>

            <GoldRule ornament="✦" />

            {/* ── What is a Cluster Buy ─────────────────────── */}
            <section style={{ maxWidth: 860, margin: "0 auto 0", padding: "8px 0 32px" }}>
              <div className="section-heading">
                <h2 className="cinzel">The Doctrine of the Cluster Buy</h2>
                <div className="sub">
                  <em>wherein the signal is distinguished from the noise</em>
                </div>
              </div>

              <p className="cert-preamble" style={{ marginBottom: 24 }}>
                <em>
                  A cluster buy arises when multiple corporate insiders — executives,
                  directors, and officers possessed of material non-public knowledge of
                  their company&apos;s affairs — do independently and within a narrow
                  window of time each commit their own personal capital to the purchase
                  of shares. History records that such concerted conviction, disclosed
                  pursuant to Form 4 obligation, has preceded significant price
                  appreciation at a rate far exceeding chance or coincidence. Where one
                  insider buys, one may speculate; where{" "}
                </em>
                <strong>TWO OR MORE BUY IN CONCERT</strong>
                <em>
                  , the market whispers what the boardroom knows.
                </em>
              </p>

              {/* Methodology grid */}
              <div className="method-grid">
                {[
                  { numeral: "I",    label: "Surveillance",   desc: "SEC Form 4 filings monitored in real-time across all registered micro-cap issuers." },
                  { numeral: "II",   label: "Detection",      desc: "Proprietary algorithms identify two or more distinct insiders purchasing within 14 days." },
                  { numeral: "III",  label: "Scoring",        desc: "Each cluster scored I–C on participants, capital deployed, seniority, and time compression." },
                  { numeral: "IV",   label: "Dissemination",  desc: "Ranked alerts transmitted to members each Friday before the Monday market open." },
                ].map((m) => (
                  <div key={m.numeral} className="method-cell">
                    <div className="method-numeral cinzel">{m.numeral}</div>
                    <div className="method-label cinzel">{m.label}</div>
                    <p className="method-desc">{m.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <GoldRule ornament="❦" />

            {/* ── Apply for Membership ──────────────────────── */}
            <section className="apply-section fade-in-4">
              <div className="apply-title cinzel">Apply for Membership</div>
              <p className="apply-subtitle">
                <em>
                  Receive weekly cluster intelligence by private correspondence.
                  Every Friday — ranked, annotated, and delivered before the
                  Monday open.
                </em>
              </p>

              <div
                className="gold-thin-rule"
                style={{ maxWidth: 320, margin: "0 auto" }}
              />

              {submitted ? (
                <div className="apply-confirmed cinzel">
                  <span>❦</span>
                  <span>Application Received &mdash; We Shall Be In Touch</span>
                  <span>❦</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="apply-form">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your correspondence address…"
                    className="apply-input"
                    required
                  />
                  <button type="submit" className="apply-button cinzel">
                    Apply
                  </button>
                </form>
              )}

              <p className="apply-fine-print">
                No solicitations. No obligations. Your address held in strictest confidence.
                Membership is extended at the sole discretion of ClusterDesk Intelligence Corporation.
              </p>
            </section>

            {/* ── Footer ───────────────────────────────────── */}
            <footer className="cert-footer">
              <div className="footer-logo cinzel">CLUSTERDESK</div>
              <div className="footer-sub cinzel">Intelligence Corporation · Est. MMXXIV</div>

              <div className="gold-thin-rule" />

              <p className="footer-disclaimer">
                <em>
                  ClusterDesk is an informational service and nothing herein constitutes
                  investment advice, a solicitation, or a recommendation to buy or sell
                  any security. All insider transaction data is derived from public
                  filings with the Securities and Exchange Commission. Past cluster
                  patterns do not guarantee future performance. Invest solely at your
                  own discretion and risk. This certificate is issued for informational
                  purposes only and confers no legal rights upon the holder.
                </em>
              </p>

              <div className="footer-links">
                {["Privacy Policy", "Terms of Service", "Disclaimer", "Contact"].map((l) => (
                  <a key={l} href="#" className="footer-link cinzel">{l.toUpperCase()}</a>
                ))}
              </div>

              <div
                className="cinzel"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.25em",
                  color: "rgba(26,18,8,0.25)",
                  marginBottom: 8,
                }}
              >
                ✦ &nbsp; MMXXVI &nbsp; ✦
              </div>
            </footer>

          </div>{/* cert-inner-border */}
        </div>{/* cert-outer-border */}
      </div>{/* cert-page */}
    </>
  );
}
