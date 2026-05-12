"use client";

import React, { useState } from "react";

const PALETTE = {
  bg: "#F5F0E8",
  red: "#CC0000",
  black: "#000000",
  white: "#FFFFFF",
  grey: "#888888",
  darkGrey: "#333333",
};

const clusters = [
  {
    ticker: "MVST",
    name: "MICROVAST HOLDINGS",
    score: 87,
    insiders: 3,
    totalBought: "$312,000",
    days: 5,
    sector: "ENERGY STORAGE",
    change: "+14.2%",
  },
  {
    ticker: "AEYE",
    name: "AUDIOEYE INC",
    score: 74,
    insiders: 2,
    totalBought: "$88,000",
    days: 4,
    sector: "ACCESSIBILITY TECH",
    change: "+9.7%",
  },
  {
    ticker: "ZDGE",
    name: "ZEDGE INC",
    score: 62,
    insiders: 2,
    totalBought: "$47,000",
    days: 7,
    sector: "DIGITAL MEDIA",
    change: "+6.1%",
  },
];

export default function ConstructivistPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setJoined(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700;900&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: ${PALETTE.bg};
        }

        .constructivist-root {
          font-family: 'Oswald', 'Impact', sans-serif;
          background: ${PALETTE.bg};
          color: ${PALETTE.black};
          min-height: 100vh;
          overflow-x: hidden;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        /* ─── HERO ─── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 80px 60px 60px 60px;
          overflow: hidden;
        }

        /* diagonal red slab behind headline */
        .hero-slab {
          position: absolute;
          top: -120px;
          left: -80px;
          width: 130%;
          height: 520px;
          background: ${PALETTE.red};
          transform: rotate(-3deg);
          z-index: 0;
        }

        /* big black triangle top-right */
        .deco-triangle-tr {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-left: 280px solid transparent;
          border-top: 280px solid ${PALETTE.black};
          z-index: 1;
        }

        /* large red circle bottom-left */
        .deco-circle-bl {
          position: absolute;
          bottom: -100px;
          left: -80px;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: ${PALETTE.red};
          opacity: 0.12;
          z-index: 0;
        }

        /* small black circle */
        .deco-circle-sm {
          position: absolute;
          bottom: 120px;
          right: 200px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: ${PALETTE.black};
          z-index: 1;
        }

        /* diagonal rule top-left corner */
        .deco-rule-tl {
          position: absolute;
          top: 60px;
          left: 60px;
          width: 200px;
          height: 6px;
          background: ${PALETTE.white};
          transform: rotate(-3deg);
          z-index: 2;
        }

        /* diagonal rule bottom-right */
        .deco-rule-br {
          position: absolute;
          bottom: 140px;
          right: 60px;
          width: 340px;
          height: 4px;
          background: ${PALETTE.black};
          transform: rotate(-3deg);
          z-index: 2;
        }

        .hero-eyebrow {
          position: relative;
          z-index: 3;
          font-size: 18px;
          font-weight: 700;
          color: ${PALETTE.white};
          letter-spacing: 0.25em;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hero-eyebrow::before {
          content: '';
          display: inline-block;
          width: 40px;
          height: 4px;
          background: ${PALETTE.white};
        }

        .hero-headline {
          position: relative;
          z-index: 3;
          font-size: clamp(72px, 12vw, 140px);
          font-weight: 900;
          line-height: 0.88;
          color: ${PALETTE.white};
          margin-bottom: 0;
        }

        .hero-headline-slash {
          display: block;
          color: ${PALETTE.white};
        }

        .hero-headline-sub {
          display: block;
          color: ${PALETTE.black};
          -webkit-text-stroke: 3px ${PALETTE.black};
          color: transparent;
        }

        .hero-subline {
          position: relative;
          z-index: 3;
          font-size: 22px;
          font-weight: 700;
          color: ${PALETTE.white};
          margin-top: 36px;
          max-width: 540px;
          line-height: 1.4;
        }

        .hero-agitprop {
          position: relative;
          z-index: 3;
          margin-top: 28px;
          background: ${PALETTE.black};
          color: ${PALETTE.bg};
          display: inline-block;
          padding: 8px 24px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.18em;
          transform: rotate(-1deg);
        }

        .hero-stats-row {
          position: relative;
          z-index: 3;
          display: flex;
          gap: 0;
          margin-top: 56px;
          flex-wrap: wrap;
        }

        .hero-stat {
          border-left: 4px solid ${PALETTE.white};
          padding: 8px 32px 8px 20px;
        }

        .hero-stat-num {
          font-size: 48px;
          font-weight: 900;
          color: ${PALETTE.white};
          line-height: 1;
        }

        .hero-stat-label {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.2em;
          margin-top: 2px;
        }

        /* scroll indicator */
        .scroll-arrow {
          position: absolute;
          bottom: 40px;
          left: 60px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .scroll-arrow span {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: ${PALETTE.black};
        }

        .scroll-arrow-line {
          width: 2px;
          height: 48px;
          background: ${PALETTE.black};
        }

        /* ─── MANIFESTO BAND ─── */
        .manifesto-band {
          background: ${PALETTE.black};
          color: ${PALETTE.bg};
          padding: 28px 60px;
          display: flex;
          align-items: center;
          gap: 32px;
          overflow: hidden;
          position: relative;
        }

        .manifesto-band::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 8px;
          height: 100%;
          background: ${PALETTE.red};
        }

        .manifesto-star {
          font-size: 32px;
          color: ${PALETTE.red};
          flex-shrink: 0;
        }

        .manifesto-text {
          font-size: clamp(16px, 2.5vw, 22px);
          font-weight: 700;
          letter-spacing: 0.1em;
          line-height: 1.3;
        }

        /* ─── CLUSTER SECTION ─── */
        .cluster-section {
          padding: 80px 60px;
          position: relative;
        }

        .cluster-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 6px;
          background: repeating-linear-gradient(
            90deg,
            ${PALETTE.red} 0px,
            ${PALETTE.red} 40px,
            ${PALETTE.black} 40px,
            ${PALETTE.black} 80px
          );
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
        }

        .section-label-text {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: ${PALETTE.grey};
        }

        .section-label-rule {
          flex: 1;
          height: 2px;
          background: ${PALETTE.black};
        }

        .section-title {
          font-size: clamp(48px, 6vw, 80px);
          font-weight: 900;
          line-height: 0.9;
          margin-bottom: 60px;
        }

        /* individual cluster card */
        .cluster-card {
          position: relative;
          background: ${PALETTE.bg};
          border: 3px solid ${PALETTE.black};
          margin-bottom: 24px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 140px 1fr auto;
          min-height: 180px;
        }

        .cluster-card::before {
          content: '';
          position: absolute;
          top: -20px;
          left: -40px;
          width: 200px;
          height: 8px;
          background: ${PALETTE.red};
          transform: rotate(-3deg);
        }

        /* left score column */
        .card-score-col {
          background: ${PALETTE.black};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          position: relative;
        }

        .card-score-num {
          font-size: 72px;
          font-weight: 900;
          color: ${PALETTE.red};
          line-height: 1;
        }

        .card-score-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: ${PALETTE.grey};
          margin-top: 4px;
        }

        /* diagonal accent inside score col */
        .card-score-col::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 40px;
          background: ${PALETTE.red};
          clip-path: polygon(0 100%, 100% 0, 100% 100%);
        }

        /* middle info column */
        .card-info-col {
          padding: 28px 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .card-ticker {
          font-size: 56px;
          font-weight: 900;
          line-height: 1;
          color: ${PALETTE.black};
        }

        .card-name {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.2em;
          color: ${PALETTE.grey};
          margin-top: 4px;
        }

        .card-poster-stat {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: ${PALETTE.black};
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-poster-stat .star {
          color: ${PALETTE.red};
          font-size: 16px;
        }

        .card-sector-tag {
          display: inline-block;
          background: ${PALETTE.black};
          color: ${PALETTE.bg};
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          padding: 4px 12px;
          margin-top: 12px;
          align-self: flex-start;
        }

        /* right change column */
        .card-change-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          padding: 28px 32px;
          background: ${PALETTE.red};
          min-width: 160px;
        }

        .card-change-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: rgba(255,255,255,0.6);
        }

        .card-change-num {
          font-size: 52px;
          font-weight: 900;
          color: ${PALETTE.white};
          line-height: 1;
          margin-top: 4px;
        }

        .card-view-btn {
          margin-top: 20px;
          background: ${PALETTE.black};
          color: ${PALETTE.white};
          border: none;
          padding: 10px 20px;
          font-family: 'Oswald', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          cursor: pointer;
          text-transform: uppercase;
          transition: background 0.15s;
        }

        .card-view-btn:hover {
          background: ${PALETTE.bg};
          color: ${PALETTE.black};
        }

        /* ─── HOW IT WORKS ─── */
        .how-section {
          background: ${PALETTE.black};
          padding: 80px 60px;
          position: relative;
          overflow: hidden;
        }

        /* big red circle deco */
        .how-deco-circle {
          position: absolute;
          top: -120px;
          right: -120px;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          border: 40px solid ${PALETTE.red};
          opacity: 0.18;
        }

        .how-deco-triangle {
          position: absolute;
          bottom: -40px;
          left: 40px;
          width: 0;
          height: 0;
          border-right: 160px solid transparent;
          border-bottom: 160px solid ${PALETTE.red};
          opacity: 0.3;
        }

        .how-title {
          font-size: clamp(40px, 5vw, 72px);
          font-weight: 900;
          color: ${PALETTE.bg};
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
        }

        .how-title span {
          color: ${PALETTE.red};
        }

        .how-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 40px;
          position: relative;
          z-index: 1;
        }

        .how-step {
          border-left: 6px solid ${PALETTE.red};
          padding-left: 24px;
        }

        .how-step-num {
          font-size: 72px;
          font-weight: 900;
          color: ${PALETTE.red};
          line-height: 1;
          opacity: 0.4;
        }

        .how-step-title {
          font-size: 22px;
          font-weight: 700;
          color: ${PALETTE.bg};
          margin-top: -16px;
          line-height: 1.2;
        }

        .how-step-body {
          font-size: 14px;
          font-weight: 400;
          color: ${PALETTE.grey};
          margin-top: 12px;
          line-height: 1.6;
          letter-spacing: 0.05em;
        }

        /* ─── STATS POSTER BAND ─── */
        .stats-band {
          padding: 80px 60px;
          position: relative;
          overflow: hidden;
          background: ${PALETTE.bg};
        }

        .stats-band::before {
          content: '';
          position: absolute;
          top: 40px;
          left: 0;
          width: 100%;
          height: 4px;
          background: ${PALETTE.red};
          transform: rotate(-1deg);
        }

        .stats-band::after {
          content: '';
          position: absolute;
          bottom: 40px;
          left: 0;
          width: 100%;
          height: 4px;
          background: ${PALETTE.black};
          transform: rotate(-1deg);
        }

        .stats-deco-circle-big {
          position: absolute;
          top: 50%;
          right: -180px;
          transform: translateY(-50%);
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: ${PALETTE.red};
          opacity: 0.07;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0;
          position: relative;
          z-index: 1;
          margin-top: 20px;
        }

        .stat-block {
          padding: 40px 32px;
          border-right: 2px solid ${PALETTE.black};
        }

        .stat-block:last-child {
          border-right: none;
        }

        .stat-block-star {
          color: ${PALETTE.red};
          font-size: 24px;
          display: block;
          margin-bottom: 12px;
        }

        .stat-block-num {
          font-size: clamp(36px, 4vw, 64px);
          font-weight: 900;
          color: ${PALETTE.black};
          line-height: 1;
        }

        .stat-block-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: ${PALETTE.grey};
          margin-top: 8px;
          line-height: 1.4;
        }

        /* ─── SUBSCRIBE ─── */
        .subscribe-section {
          background: ${PALETTE.red};
          padding: 100px 60px;
          position: relative;
          overflow: hidden;
        }

        .sub-deco-triangle-tr {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-left: 320px solid transparent;
          border-top: 320px solid rgba(0,0,0,0.15);
        }

        .sub-deco-circle {
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: rgba(0,0,0,0.12);
        }

        .sub-label {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.6);
          position: relative;
          z-index: 1;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sub-label::after {
          content: '';
          display: inline-block;
          width: 60px;
          height: 3px;
          background: rgba(255,255,255,0.4);
        }

        .sub-title {
          font-size: clamp(48px, 7vw, 100px);
          font-weight: 900;
          color: ${PALETTE.white};
          line-height: 0.9;
          position: relative;
          z-index: 1;
          margin-bottom: 8px;
        }

        .sub-title-em {
          color: ${PALETTE.black};
        }

        .sub-copy {
          font-size: 18px;
          font-weight: 700;
          color: rgba(255,255,255,0.75);
          margin-top: 24px;
          max-width: 560px;
          line-height: 1.5;
          position: relative;
          z-index: 1;
          letter-spacing: 0.05em;
        }

        .sub-agitprop {
          background: ${PALETTE.black};
          color: ${PALETTE.bg};
          display: inline-block;
          padding: 8px 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
          margin-top: 16px;
          transform: rotate(-2deg);
          position: relative;
          z-index: 1;
        }

        .sub-form {
          display: flex;
          gap: 0;
          margin-top: 48px;
          position: relative;
          z-index: 1;
          max-width: 600px;
          flex-wrap: wrap;
        }

        .sub-input {
          flex: 1;
          padding: 18px 24px;
          font-family: 'Oswald', sans-serif;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: 4px solid ${PALETTE.black};
          border-right: none;
          background: ${PALETTE.white};
          color: ${PALETTE.black};
          outline: none;
          min-width: 0;
        }

        .sub-input::placeholder {
          color: #aaa;
        }

        .sub-btn {
          background: ${PALETTE.black};
          color: ${PALETTE.white};
          border: 4px solid ${PALETTE.black};
          padding: 18px 36px;
          font-family: 'Oswald', sans-serif;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
        }

        .sub-btn:hover {
          background: ${PALETTE.bg};
          color: ${PALETTE.black};
        }

        .sub-success {
          font-size: 28px;
          font-weight: 900;
          color: ${PALETTE.white};
          letter-spacing: 0.1em;
          position: relative;
          z-index: 1;
          margin-top: 48px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sub-disclaimer {
          font-size: 11px;
          font-weight: 400;
          color: rgba(255,255,255,0.5);
          margin-top: 16px;
          letter-spacing: 0.1em;
          position: relative;
          z-index: 1;
        }

        /* ─── FOOTER ─── */
        .footer {
          background: ${PALETTE.black};
          padding: 40px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-logo {
          font-size: 28px;
          font-weight: 900;
          color: ${PALETTE.bg};
          letter-spacing: 0.1em;
        }

        .footer-logo span {
          color: ${PALETTE.red};
        }

        .footer-links {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
        }

        .footer-link {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: ${PALETTE.grey};
          text-decoration: none;
          cursor: pointer;
          transition: color 0.15s;
        }

        .footer-link:hover {
          color: ${PALETTE.red};
        }

        .footer-copy {
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.15em;
          color: #444;
          width: 100%;
          margin-top: 16px;
        }

        /* ─── NAV ─── */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: ${PALETTE.bg};
          border-bottom: 3px solid ${PALETTE.black};
          padding: 0 60px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-logo {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 0.1em;
          color: ${PALETTE.black};
        }

        .nav-logo span {
          color: ${PALETTE.red};
        }

        .nav-tagline {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: ${PALETTE.grey};
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-tagline::before {
          content: '★';
          color: ${PALETTE.red};
          font-size: 10px;
        }

        .nav-cta {
          background: ${PALETTE.red};
          color: ${PALETTE.white};
          border: none;
          padding: 10px 24px;
          font-family: 'Oswald', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.15s;
        }

        .nav-cta:hover {
          background: ${PALETTE.black};
        }

        /* ─── DIAGONAL RULE DIVIDER ─── */
        .divider-rule {
          height: 12px;
          background: repeating-linear-gradient(
            -45deg,
            ${PALETTE.red},
            ${PALETTE.red} 10px,
            ${PALETTE.black} 10px,
            ${PALETTE.black} 20px
          );
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 768px) {
          .hero {
            padding: 100px 24px 60px 24px;
          }
          .cluster-section,
          .how-section,
          .stats-band,
          .subscribe-section {
            padding: 60px 24px;
          }
          .nav {
            padding: 0 24px;
          }
          .nav-tagline {
            display: none;
          }
          .cluster-card {
            grid-template-columns: 100px 1fr;
            grid-template-rows: auto auto;
          }
          .card-change-col {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            min-width: unset;
          }
          .footer {
            padding: 32px 24px;
          }
          .sub-form {
            flex-direction: column;
          }
          .sub-input {
            border-right: 4px solid ${PALETTE.black};
            border-bottom: none;
          }
          .hero-stats-row {
            flex-direction: column;
            gap: 16px;
          }
          .stat-block {
            border-right: none;
            border-bottom: 2px solid ${PALETTE.black};
          }
        }
      `}</style>

      <div className="constructivist-root">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">CLUSTER<span>DESK</span></div>
          <div className="nav-tagline">INSIDER INTELLIGENCE</div>
          <button className="nav-cta" onClick={() => document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth" })}>
            ★ JOIN NOW
          </button>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-slab" />
          <div className="deco-triangle-tr" />
          <div className="deco-circle-bl" />
          <div className="deco-circle-sm" />
          <div className="deco-rule-tl" />
          <div className="deco-rule-br" />

          <div className="hero-eyebrow">★ CLUSTER BUY INTELLIGENCE</div>

          <h1 className="hero-headline">
            <span className="hero-headline-slash">INSIDERS</span>
            <span className="hero-headline-slash">/ RALLY</span>
          </h1>

          <p className="hero-subline">
            When 2+ executives buy their own company's stock within days of each other — the signal is clear. We surface it first.
          </p>

          <div className="hero-agitprop">
            ★ THE BOURGEOISIE BUYS IN CLUSTERS. NOW YOU KNOW WHEN. ★
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <div className="hero-stat-num">847</div>
              <div className="hero-stat-label">CLUSTER ALERTS — ALL TIME</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">73%</div>
              <div className="hero-stat-label">POSITIVE 30-DAY RETURN</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">12</div>
              <div className="hero-stat-label">NEW ALERTS THIS WEEK</div>
            </div>
          </div>

          <div className="scroll-arrow">
            <div className="scroll-arrow-line" />
            <span>SCROLL</span>
          </div>
        </section>

        {/* MANIFESTO BAND */}
        <div className="manifesto-band">
          <span className="manifesto-star">★</span>
          <p className="manifesto-text">
            SEC FORM 4 FILINGS REVEAL THE TRUTH. WHEN THREE OFFICERS BUY THE SAME STOCK IN FIVE DAYS — THAT IS NOT COINCIDENCE. THAT IS CONVICTION.
          </p>
          <span className="manifesto-star">★</span>
        </div>

        {/* CLUSTER CARDS */}
        <section className="cluster-section">
          <div className="section-label">
            <span className="section-label-text">★ ACTIVE ALERTS</span>
            <div className="section-label-rule" />
            <span className="section-label-text">RANKED BY SCORE</span>
          </div>

          <h2 className="section-title">
            THIS WEEK'S<br />CLUSTERS
          </h2>

          {clusters.map((c) => (
            <div key={c.ticker} className="cluster-card">
              <div className="card-score-col">
                <div className="card-score-num">{c.score}</div>
                <div className="card-score-label">SCORE</div>
              </div>

              <div className="card-info-col">
                <div>
                  <div className="card-ticker">{c.ticker}</div>
                  <div className="card-name">{c.name}</div>
                </div>
                <div>
                  <div className="card-poster-stat">
                    <span className="star">★</span>
                    {c.insiders} EXECUTIVES — {c.totalBought} — {c.days} DAYS
                  </div>
                  <div className="card-sector-tag">★ {c.sector}</div>
                </div>
              </div>

              <div className="card-change-col">
                <div className="card-change-label">SINCE CLUSTER</div>
                <div className="card-change-num">{c.change}</div>
                <button className="card-view-btn">VIEW ALERT →</button>
              </div>
            </div>
          ))}
        </section>

        {/* DIAGONAL RULE DIVIDER */}
        <div className="divider-rule" />

        {/* HOW IT WORKS */}
        <section className="how-section">
          <div className="how-deco-circle" />
          <div className="how-deco-triangle" />

          <h2 className="how-title">
            THE <span>SCIENCE</span><br />OF THE SIGNAL
          </h2>

          <div className="how-steps">
            <div className="how-step">
              <div className="how-step-num">01</div>
              <div className="how-step-title">SEC FILINGS — REAL TIME</div>
              <p className="how-step-body">
                Every Form 4 filed with the SEC is parsed the moment it lands. Executive identity, shares purchased, total value — all extracted.
              </p>
            </div>
            <div className="how-step">
              <div className="how-step-num">02</div>
              <div className="how-step-title">CLUSTER DETECTION</div>
              <p className="how-step-body">
                Our engine scans for 2 or more insiders at the same micro-cap company buying within a rolling 10-day window. The cluster is confirmed.
              </p>
            </div>
            <div className="how-step">
              <div className="how-step-num">03</div>
              <div className="how-step-title">SCORE + ALERT</div>
              <p className="how-step-body">
                Each cluster receives a conviction score (0–100) based on number of buyers, capital deployed, and days between purchases. You receive the alert instantly.
              </p>
            </div>
          </div>
        </section>

        {/* STATS POSTER BAND */}
        <section className="stats-band">
          <div className="stats-deco-circle-big" />

          <div className="section-label">
            <span className="section-label-text">★ PLATFORM STATS</span>
            <div className="section-label-rule" />
          </div>

          <div className="stats-grid">
            <div className="stat-block">
              <span className="stat-block-star">★</span>
              <div className="stat-block-num">2,400+</div>
              <div className="stat-block-label">COMPANIES<br />MONITORED</div>
            </div>
            <div className="stat-block">
              <span className="stat-block-star">★</span>
              <div className="stat-block-num">847</div>
              <div className="stat-block-label">CLUSTER ALERTS<br />FIRED</div>
            </div>
            <div className="stat-block">
              <span className="stat-block-star">★</span>
              <div className="stat-block-num">+23%</div>
              <div className="stat-block-label">AVG RETURN<br />90 DAYS POST-CLUSTER</div>
            </div>
            <div className="stat-block">
              <span className="stat-block-star">★</span>
              <div className="stat-block-num">&lt; 15s</div>
              <div className="stat-block-label">AVERAGE ALERT<br />LATENCY</div>
            </div>
          </div>
        </section>

        {/* DIAGONAL RULE DIVIDER */}
        <div className="divider-rule" />

        {/* SUBSCRIBE */}
        <section className="subscribe-section" id="subscribe">
          <div className="sub-deco-triangle-tr" />
          <div className="sub-deco-circle" />

          <div className="sub-label">★ FREE DAILY BRIEFING</div>

          <h2 className="sub-title">
            JOIN THE<br />
            <span className="sub-title-em">MOVEMENT</span>
          </h2>

          <p className="sub-copy">
            Every morning: the top 3 cluster buy alerts, ranked by conviction score. Delivered to your inbox before the market opens.
          </p>

          <div className="sub-agitprop">
            ★ THE INFORMATION IS PUBLIC. THE ANALYSIS IS OURS. ★
          </div>

          {!joined ? (
            <form className="sub-form" onSubmit={handleJoin}>
              <input
                type="email"
                className="sub-input"
                placeholder="YOUR EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="sub-btn">
                JOIN THE MOVEMENT →
              </button>
            </form>
          ) : (
            <div className="sub-success">
              <span style={{ color: PALETTE.black, fontSize: "40px" }}>★</span>
              YOU ARE NOW PART OF THE VANGUARD.
            </div>
          )}

          <p className="sub-disclaimer">
            NO SPAM. NO NOISE. ONE SIGNAL. UNSUBSCRIBE ANY TIME. NOT FINANCIAL ADVICE.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-logo">
            CLUSTER<span>DESK</span>
          </div>
          <div className="footer-links">
            <span className="footer-link">★ HOW IT WORKS</span>
            <span className="footer-link">★ PRICING</span>
            <span className="footer-link">★ FAQ</span>
            <span className="footer-link">★ TWITTER</span>
          </div>
          <p className="footer-copy">
            © 2024 CLUSTERDESK. FOR EDUCATIONAL AND INFORMATIONAL PURPOSES ONLY. NOT FINANCIAL ADVICE. ALL INSIDER TRADING DATA SOURCED FROM PUBLIC SEC FORM 4 FILINGS.
          </p>
        </footer>

      </div>
    </>
  );
}
