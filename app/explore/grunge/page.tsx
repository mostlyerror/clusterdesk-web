"use client";

import React, { useState } from "react";

const clusters = [
  {
    ticker: "MVST",
    company: "Microvast Holdings",
    score: 87,
    insiders: 3,
    amount: "$312,000",
    roles: ["CEO", "CFO", "DIRECTOR"],
    daysAgo: 4,
    priceChange: "+14.2%",
    rotate: "-1.5deg",
  },
  {
    ticker: "AEYE",
    company: "AudioEye Inc",
    score: 74,
    insiders: 2,
    amount: "$88,000",
    roles: ["CEO", "DIRECTOR"],
    daysAgo: 7,
    priceChange: "+8.6%",
    rotate: "1.2deg",
  },
  {
    ticker: "ZDGE",
    company: "Zedge Inc",
    score: 62,
    insiders: 2,
    amount: "$47,000",
    roles: ["PRESIDENT", "DIRECTOR"],
    daysAgo: 12,
    priceChange: "+5.1%",
    rotate: "-0.8deg",
  },
];

export default function GrungePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&family=Special+Elite&family=Oswald:wght@700;900&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          background: #F0EDEA;
          font-family: 'Special Elite', 'Courier New', monospace;
          color: #000000;
          overflow-x: hidden;
        }

        /* ---- NOISE / GRAIN OVERLAY ---- */
        .grunge-root {
          position: relative;
          background: #F0EDEA;
          min-height: 100vh;
          isolation: isolate;
        }

        .grunge-root::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.45;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-repeat: repeat;
          mix-blend-mode: multiply;
        }

        /* ---- NAV ---- */
        .g-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 28px;
          border-bottom: 3px solid #000;
          background: #F0EDEA;
          position: sticky;
          top: 0;
          z-index: 100;
          transform: none;
        }

        .g-nav-logo {
          font-family: 'Oswald', sans-serif;
          font-weight: 900;
          font-size: 26px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #000;
          text-decoration: none;
          position: relative;
        }

        .g-nav-logo::after {
          content: 'UNAUTHORIZED INTELLIGENCE';
          display: block;
          font-family: 'VT323', monospace;
          font-size: 13px;
          letter-spacing: 0.18em;
          color: #CC0000;
          margin-top: -4px;
        }

        .g-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .g-nav-issue {
          font-family: 'VT323', monospace;
          font-size: 16px;
          letter-spacing: 0.12em;
          color: #888888;
          text-transform: uppercase;
        }

        .g-nav-btn {
          background: #CC0000;
          color: #F0EDEA;
          border: 2px solid #000;
          font-family: 'Oswald', sans-serif;
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          padding: 8px 20px;
          cursor: pointer;
          transform: rotate(-0.6deg);
          box-shadow: 3px 3px 0 #000;
          transition: box-shadow 0.1s, transform 0.1s;
        }

        .g-nav-btn:hover {
          box-shadow: 5px 5px 0 #000;
          transform: rotate(-0.6deg) translate(-1px,-1px);
        }

        /* ---- TICKER TAPE ---- */
        .g-tape {
          background: #000;
          overflow: hidden;
          white-space: nowrap;
          border-bottom: 2px solid #CC0000;
          padding: 8px 0;
        }

        .g-tape-inner {
          display: inline-block;
          animation: gtape 22s linear infinite;
        }

        @keyframes gtape {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .g-tape-item {
          font-family: 'VT323', monospace;
          font-size: 18px;
          color: #CC0000;
          letter-spacing: 0.18em;
          padding: 0 28px;
        }

        .g-tape-sep {
          color: #888888;
          margin: 0 4px;
        }

        /* ---- HERO ---- */
        .g-hero {
          padding: 52px 32px 40px;
          position: relative;
          overflow: hidden;
        }

        .g-hero-eyebrow {
          font-family: 'VT323', monospace;
          font-size: 19px;
          color: #888888;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 12px;
          transform: rotate(-0.4deg);
        }

        .g-hero-headline {
          display: block;
          line-height: 1;
          margin-bottom: 6px;
        }

        .g-hed-vt {
          font-family: 'VT323', monospace;
          font-size: clamp(52px, 9vw, 96px);
          color: #CC0000;
          display: inline;
          letter-spacing: -0.01em;
        }

        .g-hed-oswald {
          font-family: 'Oswald', sans-serif;
          font-weight: 900;
          font-size: clamp(58px, 10vw, 106px);
          color: #000;
          display: inline;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          margin-left: 6px;
        }

        .g-hed-small {
          font-family: 'VT323', monospace;
          font-size: clamp(28px, 4.5vw, 52px);
          color: #888888;
          display: inline;
          letter-spacing: 0.04em;
          margin-left: 8px;
        }

        .g-hero-sub {
          font-family: 'Special Elite', monospace;
          font-size: 17px;
          color: #000;
          max-width: 620px;
          line-height: 1.55;
          margin-top: 22px;
          transform: rotate(-0.3deg);
          border-left: 4px solid #CC0000;
          padding-left: 16px;
        }

        .g-hero-stamp {
          position: absolute;
          right: 48px;
          top: 56px;
          transform: rotate(8deg);
          border: 4px solid #CC0000;
          padding: 10px 18px;
          text-align: center;
          background: #F0EDEA;
          box-shadow: 4px 4px 0 rgba(0,0,0,0.25);
        }

        .g-hero-stamp-top {
          font-family: 'VT323', monospace;
          font-size: 12px;
          color: #888888;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          display: block;
          border-bottom: 2px solid #CC0000;
          padding-bottom: 6px;
          margin-bottom: 6px;
        }

        .g-hero-stamp-num {
          font-family: 'Oswald', sans-serif;
          font-weight: 900;
          font-size: 80px;
          color: #CC0000;
          line-height: 1;
          display: block;
          letter-spacing: -0.04em;
        }

        .g-hero-stamp-bot {
          font-family: 'VT323', monospace;
          font-size: 13px;
          color: #888888;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          display: block;
          border-top: 2px solid #CC0000;
          padding-top: 6px;
          margin-top: 4px;
        }

        /* ---- DIVIDER ---- */
        .g-divider {
          border: none;
          border-top: 3px solid #000;
          margin: 0;
        }

        .g-divider-red {
          border: none;
          border-top: 3px solid #CC0000;
          margin: 0;
        }

        /* ---- STATS STRIP ---- */
        .g-stats-strip {
          display: flex;
          border-bottom: 3px solid #000;
          background: #000;
        }

        .g-stats-strip-item {
          flex: 1;
          padding: 18px 24px;
          border-right: 2px solid #CC0000;
          text-align: center;
        }

        .g-stats-strip-item:last-child {
          border-right: none;
        }

        .g-stats-strip-label {
          font-family: 'VT323', monospace;
          font-size: 14px;
          color: #888888;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 2px;
        }

        .g-stats-strip-val {
          font-family: 'Oswald', sans-serif;
          font-weight: 900;
          font-size: 34px;
          color: #F0EDEA;
          letter-spacing: -0.02em;
          line-height: 1;
          display: block;
        }

        /* ---- MANIFESTO BOX ---- */
        .g-manifesto-wrap {
          padding: 40px 32px;
        }

        .g-manifesto {
          border: 3px solid #000;
          padding: 28px 32px;
          background: #F0EDEA;
          transform: rotate(-0.7deg);
          box-shadow: 6px 6px 0 #000, 8px 8px 0 #CC0000;
          position: relative;
        }

        .g-manifesto::before {
          content: '// EDITORIAL //';
          font-family: 'VT323', monospace;
          font-size: 13px;
          color: #CC0000;
          letter-spacing: 0.22em;
          position: absolute;
          top: -11px;
          left: 24px;
          background: #F0EDEA;
          padding: 0 8px;
        }

        .g-manifesto-text {
          font-family: 'Special Elite', monospace;
          font-size: 19px;
          line-height: 1.55;
          color: #000;
        }

        .g-manifesto-text strong {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #CC0000;
        }

        /* ---- SECTION LABEL ---- */
        .g-section-label {
          font-family: 'VT323', monospace;
          font-size: 16px;
          color: #888888;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 32px;
          transform: rotate(-0.3deg);
        }

        /* ---- WANTED POSTER CARDS ---- */
        .g-cards-section {
          padding: 48px 32px;
        }

        .g-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .g-card {
          border: 3px solid #000;
          background: #F0EDEA;
          padding: 0;
          position: relative;
          box-shadow: 8px 8px 0 #000;
        }

        .g-card-header {
          background: #000;
          padding: 10px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .g-card-header-label {
          font-family: 'VT323', monospace;
          font-size: 15px;
          color: #888888;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .g-card-header-source {
          font-family: 'VT323', monospace;
          font-size: 14px;
          color: #888888;
          letter-spacing: 0.16em;
        }

        .g-card-body {
          padding: 24px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 24px;
          align-items: start;
        }

        .g-card-left {
          min-width: 130px;
          border-right: 3px dashed #888888;
          padding-right: 24px;
        }

        .g-card-wanted {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.3em;
          color: #CC0000;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .g-card-ticker {
          font-family: 'Oswald', sans-serif;
          font-weight: 900;
          font-size: 58px;
          line-height: 1;
          color: #000;
          letter-spacing: -0.03em;
          display: block;
        }

        .g-card-company {
          font-family: 'Special Elite', monospace;
          font-size: 13px;
          color: #888888;
          display: block;
          margin-top: 4px;
          line-height: 1.3;
          max-width: 130px;
        }

        .g-card-rank {
          font-family: 'VT323', monospace;
          font-size: 14px;
          color: #888888;
          letter-spacing: 0.16em;
          display: block;
          margin-top: 14px;
          border-top: 2px solid #888888;
          padding-top: 8px;
        }

        .g-card-center {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 20px;
        }

        .g-card-stat {
          display: flex;
          flex-direction: column;
        }

        .g-card-stat-label {
          font-family: 'VT323', monospace;
          font-size: 13px;
          color: #888888;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 1px;
          display: block;
        }

        .g-card-stat-val {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 24px;
          color: #000;
          line-height: 1;
          display: block;
        }

        .g-card-stat-val-red {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 24px;
          color: #CC0000;
          line-height: 1;
          display: block;
        }

        .g-card-roles {
          grid-column: 1 / -1;
          border-top: 2px dashed #888888;
          padding-top: 12px;
          margin-top: 4px;
        }

        .g-card-roles-label {
          font-family: 'VT323', monospace;
          font-size: 13px;
          color: #888888;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }

        .g-card-roles-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .g-role-tag {
          background: #000;
          color: #F0EDEA;
          font-family: 'VT323', monospace;
          font-size: 16px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 3px 10px;
          border: 2px solid #000;
          display: inline-block;
        }

        .g-card-right {
          text-align: center;
          border-left: 3px solid #000;
          padding-left: 20px;
          min-width: 110px;
        }

        .g-stamp {
          display: inline-block;
          border: 4px solid #CC0000;
          padding: 8px 12px;
          background: #F0EDEA;
          transform: rotate(-4deg);
          margin-bottom: 14px;
          box-shadow: 3px 3px 0 rgba(204,0,0,0.3);
        }

        .g-stamp-text {
          font-family: 'Oswald', sans-serif;
          font-weight: 900;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #CC0000;
          text-transform: uppercase;
          display: block;
          line-height: 1.2;
        }

        .g-score-block {
          border: 3px solid #000;
          padding: 8px 12px;
          background: #F0EDEA;
          text-align: center;
        }

        .g-score-label {
          font-family: 'VT323', monospace;
          font-size: 12px;
          color: #888888;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          display: block;
        }

        .g-score-num {
          font-family: 'Oswald', sans-serif;
          font-weight: 900;
          font-size: 54px;
          color: #000;
          letter-spacing: -0.04em;
          line-height: 1;
          display: block;
        }

        .g-score-sub {
          font-family: 'VT323', monospace;
          font-size: 11px;
          color: #CC0000;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          display: block;
          border-top: 2px solid #CC0000;
          padding-top: 4px;
          margin-top: 2px;
        }

        .g-card-footer {
          background: #F0EDEA;
          border-top: 2px dashed #888888;
          padding: 8px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .g-card-footer-caption {
          font-family: 'VT323', monospace;
          font-size: 13px;
          color: #888888;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .g-card-footer-btn {
          background: #F0EDEA;
          color: #000;
          border: 2px solid #000;
          font-family: 'Special Elite', monospace;
          font-size: 13px;
          letter-spacing: 0.1em;
          padding: 6px 16px;
          cursor: pointer;
          text-transform: uppercase;
          box-shadow: 2px 2px 0 #000;
          transition: box-shadow 0.1s, transform 0.1s;
        }

        .g-card-footer-btn:hover {
          box-shadow: 4px 4px 0 #000;
          transform: translate(-1px,-1px);
        }

        /* ---- HOW IT WORKS ---- */
        .g-how {
          padding: 48px 32px;
          position: relative;
        }

        .g-how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .g-how-item {
          border: 3px solid #000;
          padding: 24px;
          background: #F0EDEA;
          box-shadow: 5px 5px 0 #000;
          position: relative;
        }

        .g-how-num {
          font-family: 'VT323', monospace;
          font-size: 64px;
          color: #CC0000;
          line-height: 1;
          display: block;
          letter-spacing: -0.02em;
          margin-bottom: 8px;
          border-bottom: 2px solid #000;
          padding-bottom: 8px;
        }

        .g-how-title {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #000;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: block;
          margin-bottom: 10px;
        }

        .g-how-body {
          font-family: 'Special Elite', monospace;
          font-size: 14px;
          color: #000;
          line-height: 1.55;
        }

        .g-how-caption {
          font-family: 'VT323', monospace;
          font-size: 12px;
          color: #888888;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          display: block;
          margin-top: 12px;
          border-top: 1px dashed #888888;
          padding-top: 8px;
        }

        /* ---- SUBSCRIBE SECTION ---- */
        .g-subscribe {
          padding: 0 32px 48px;
        }

        .g-sub-outer {
          position: relative;
          background: #000;
          border: 3px solid #000;
          padding: 40px;
          box-shadow: 8px 8px 0 #CC0000;
          transform: rotate(-0.5deg);
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 14px),
            98.5% calc(100% - 6px),
            97% 100%,
            95% calc(100% - 9px),
            93% calc(100% - 4px),
            91% calc(100% - 12px),
            89% calc(100% - 5px),
            87% 100%,
            85% calc(100% - 8px),
            82% calc(100% - 3px),
            80% calc(100% - 11px),
            77% calc(100% - 5px),
            75% 100%,
            72% calc(100% - 7px),
            69% calc(100% - 2px),
            66% calc(100% - 10px),
            63% calc(100% - 5px),
            60% 100%,
            57% calc(100% - 8px),
            54% calc(100% - 3px),
            51% calc(100% - 11px),
            48% calc(100% - 5px),
            45% 100%,
            42% calc(100% - 9px),
            39% calc(100% - 4px),
            36% calc(100% - 12px),
            33% calc(100% - 6px),
            30% 100%,
            27% calc(100% - 8px),
            24% calc(100% - 3px),
            21% calc(100% - 10px),
            18% calc(100% - 5px),
            15% 100%,
            12% calc(100% - 9px),
            9% calc(100% - 4px),
            6% calc(100% - 11px),
            3% calc(100% - 6px),
            0 calc(100% - 3px)
          );
        }

        .g-sub-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .g-sub-left {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .g-sub-overline {
          font-family: 'VT323', monospace;
          font-size: 16px;
          color: #888888;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          display: block;
          transform: rotate(-0.5deg);
        }

        .g-sub-headline {
          display: block;
          line-height: 1;
        }

        .g-sub-hed-vt {
          font-family: 'VT323', monospace;
          font-size: clamp(36px, 5.5vw, 64px);
          color: #CC0000;
          letter-spacing: -0.01em;
        }

        .g-sub-hed-oswald {
          font-family: 'Oswald', sans-serif;
          font-weight: 900;
          font-size: clamp(38px, 5.8vw, 68px);
          color: #F0EDEA;
          text-transform: uppercase;
          letter-spacing: -0.03em;
          margin-left: 6px;
        }

        .g-sub-body {
          font-family: 'Special Elite', monospace;
          font-size: 15px;
          color: #888888;
          line-height: 1.55;
          max-width: 360px;
        }

        .g-sub-right {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .g-sub-input {
          background: #F0EDEA;
          border: 3px solid #888888;
          font-family: 'Special Elite', monospace;
          font-size: 16px;
          color: #000;
          padding: 14px 16px;
          outline: none;
          width: 100%;
          letter-spacing: 0.04em;
        }

        .g-sub-input::placeholder {
          color: #888888;
        }

        .g-sub-input:focus {
          border-color: #CC0000;
          background: #F0EDEA;
        }

        .g-sub-btn {
          background: #CC0000;
          color: #F0EDEA;
          border: 3px solid #F0EDEA;
          font-family: 'Oswald', sans-serif;
          font-weight: 900;
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          padding: 14px 24px;
          cursor: pointer;
          width: 100%;
          box-shadow: 4px 4px 0 #F0EDEA;
          transition: box-shadow 0.1s, transform 0.1s;
        }

        .g-sub-btn:hover {
          box-shadow: 6px 6px 0 #F0EDEA;
          transform: translate(-1px,-1px);
        }

        .g-sub-fine {
          font-family: 'VT323', monospace;
          font-size: 13px;
          color: #888888;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-align: center;
        }

        .g-sub-success {
          font-family: 'Special Elite', monospace;
          font-size: 18px;
          color: #F0EDEA;
          background: #CC0000;
          border: 3px solid #F0EDEA;
          padding: 18px 24px;
          display: block;
          letter-spacing: 0.06em;
          transform: rotate(-1deg);
          box-shadow: 4px 4px 0 #F0EDEA;
        }

        /* ---- FOOTER ---- */
        .g-footer {
          border-top: 3px solid #000;
          padding: 28px 32px;
          background: #F0EDEA;
        }

        .g-footer-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .g-footer-logo {
          font-family: 'Oswald', sans-serif;
          font-weight: 900;
          font-size: 22px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #000;
        }

        .g-footer-logo-sub {
          font-family: 'VT323', monospace;
          font-size: 13px;
          color: #888888;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          display: block;
          margin-top: -2px;
        }

        .g-footer-issue {
          font-family: 'VT323', monospace;
          font-size: 14px;
          color: #888888;
          letter-spacing: 0.2em;
          text-align: right;
          line-height: 1.6;
        }

        .g-footer-divider {
          border: none;
          border-top: 2px dashed #888888;
          margin-bottom: 16px;
        }

        .g-footer-legal {
          font-family: 'VT323', monospace;
          font-size: 13px;
          color: #888888;
          letter-spacing: 0.1em;
          line-height: 1.7;
          text-transform: uppercase;
        }

        /* ---- RESPONSIVE ---- */
        @media (max-width: 860px) {
          .g-hero-stamp { display: none; }
          .g-card-body { grid-template-columns: 1fr; }
          .g-card-left { border-right: none; border-bottom: 3px dashed #888888; padding-right: 0; padding-bottom: 16px; }
          .g-card-right { border-left: none; border-top: 3px solid #000; padding-left: 0; padding-top: 16px; text-align: left; }
          .g-how-grid { grid-template-columns: 1fr; }
          .g-sub-inner { grid-template-columns: 1fr; gap: 28px; }
          .g-stats-strip { flex-wrap: wrap; }
          .g-stats-strip-item { flex: 50%; }
          .g-footer-top { flex-direction: column; gap: 12px; }
          .g-footer-issue { text-align: left; }
        }
      `}</style>

      <div className="grunge-root">
        {/* NAV */}
        <nav className="g-nav">
          <span className="g-nav-logo">CLUSTERDESK</span>
          <div className="g-nav-right">
            <span className="g-nav-issue">ISSUE #047 — MAY 2026</span>
            <button className="g-nav-btn">GET THE ZINE</button>
          </div>
        </nav>

        {/* TICKER TAPE */}
        <div className="g-tape">
          <div className="g-tape-inner">
            {[
              "MVST — 3 INSIDERS — $312,000",
              "AEYE — 2 INSIDERS — $88,000",
              "ZDGE — 2 INSIDERS — $47,000",
              "CLUSTER ALERT ACTIVE",
              "THEY KNOW SOMETHING",
              "SOURCE: SEC FORM 4",
              "MVST — 3 INSIDERS — $312,000",
              "AEYE — 2 INSIDERS — $88,000",
              "ZDGE — 2 INSIDERS — $47,000",
              "CLUSTER ALERT ACTIVE",
              "THEY KNOW SOMETHING",
              "SOURCE: SEC FORM 4",
            ].map((item, i) => (
              <span key={i} className="g-tape-item">
                {item}
                <span className="g-tape-sep"> ▮ </span>
              </span>
            ))}
          </div>
        </div>

        {/* HERO */}
        <div className="g-hero">
          <span className="g-hero-eyebrow">⚠ LIVE CLUSTER INTELLIGENCE — UPDATED DAILY ⚠</span>

          <div style={{ transform: "rotate(-0.5deg)" }}>
            <span className="g-hero-headline">
              <span className="g-hed-vt">THEY'RE</span>
              <span className="g-hed-oswald">BUYING</span>
            </span>
            <span className="g-hero-headline">
              <span className="g-hed-oswald">THEIR OWN</span>
              <span className="g-hed-small">damn</span>
            </span>
            <span className="g-hero-headline">
              <span className="g-hed-vt">STOCK.</span>
              <span className="g-hed-oswald" style={{ color: "#CC0000", marginLeft: 12 }}>FIND OUT.</span>
            </span>
          </div>

          <p className="g-hero-sub">
            When 2+ executives buy shares in their own micro-cap company within days of each other —
            that's a cluster. We track every Form 4 so you don't have to. No noise. No spin. Raw signal.
          </p>

          {/* DECORATIVE STAMP */}
          <div className="g-hero-stamp" aria-hidden>
            <span className="g-hero-stamp-top">TOP SCORE</span>
            <span className="g-hero-stamp-num">87</span>
            <span className="g-hero-stamp-bot">CONVICTION</span>
          </div>
        </div>

        <hr className="g-divider" />

        {/* STATS STRIP */}
        <div className="g-stats-strip">
          <div className="g-stats-strip-item">
            <span className="g-stats-strip-label">ACTIVE CLUSTERS</span>
            <span className="g-stats-strip-val">3</span>
          </div>
          <div className="g-stats-strip-item">
            <span className="g-stats-strip-label">TOTAL CAPITAL</span>
            <span className="g-stats-strip-val">$447K</span>
          </div>
          <div className="g-stats-strip-item">
            <span className="g-stats-strip-label">INSIDERS TRACKED</span>
            <span className="g-stats-strip-val">7</span>
          </div>
          <div className="g-stats-strip-item">
            <span className="g-stats-strip-label">DATA SOURCE</span>
            <span className="g-stats-strip-val" style={{ fontSize: 18, paddingTop: 4, color: "#888888" }}>SEC FORM 4</span>
          </div>
        </div>

        {/* MANIFESTO */}
        <div className="g-manifesto-wrap">
          <div className="g-manifesto">
            <p className="g-manifesto-text">
              Corporate America has a tell. When the <strong>CEO</strong> buys.
              When the <strong>CFO</strong> buys. When the <strong>Director</strong> buys —
              all within the same week — at a tiny company nobody is watching?
              That is not a coincidence. That is a <strong>SIGNAL.</strong> This is that signal.
            </p>
          </div>
        </div>

        <hr className="g-divider" />

        {/* CLUSTER CARDS */}
        <section className="g-cards-section">
          <span className="g-section-label">▶ ACTIVE CLUSTER ALERTS — 3 SIGNALS THIS WEEK</span>
          <div className="g-cards-grid">
            {clusters.map((c, i) => (
              <div
                key={c.ticker}
                className="g-card"
                style={{ transform: `rotate(${c.rotate})` }}
              >
                {/* CARD HEADER */}
                <div className="g-card-header">
                  <span className="g-card-header-label">
                    WANTED: INSIDER CLUSTER #{i + 1}
                  </span>
                  <span className="g-card-header-source">
                    SOURCE: SEC FORM 4 FILINGS
                  </span>
                </div>

                {/* CARD BODY */}
                <div className="g-card-body">
                  {/* LEFT */}
                  <div className="g-card-left">
                    <span className="g-card-wanted">■ CLUSTER DETECTED</span>
                    <span className="g-card-ticker">{c.ticker}</span>
                    <span className="g-card-company">{c.company}</span>
                    <span className="g-card-rank">RANK #{i + 1} OF 3</span>
                  </div>

                  {/* CENTER */}
                  <div className="g-card-center">
                    <div className="g-card-stat">
                      <span className="g-card-stat-label">INSIDERS</span>
                      <span className={i === 0 ? "g-card-stat-val-red" : "g-card-stat-val"}>
                        {c.insiders}
                      </span>
                    </div>
                    <div className="g-card-stat">
                      <span className="g-card-stat-label">TOTAL BOUGHT</span>
                      <span className="g-card-stat-val">{c.amount}</span>
                    </div>
                    <div className="g-card-stat">
                      <span className="g-card-stat-label">DAYS AGO</span>
                      <span className="g-card-stat-val">{c.daysAgo}d</span>
                    </div>
                    <div className="g-card-stat">
                      <span className="g-card-stat-label">SINCE CLUSTER</span>
                      <span className="g-card-stat-val-red">{c.priceChange}</span>
                    </div>
                    <div className="g-card-roles">
                      <span className="g-card-roles-label">■ WHO BOUGHT</span>
                      <div className="g-card-roles-tags">
                        {c.roles.map((r) => (
                          <span key={r} className="g-role-tag">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="g-card-right">
                    <div
                      className="g-stamp"
                      style={{ transform: `rotate(${i % 2 === 0 ? "-5deg" : "4deg"})` }}
                    >
                      <span className="g-stamp-text">INSIDER</span>
                      <span className="g-stamp-text">BUY</span>
                      <span className="g-stamp-text">DETECTED</span>
                    </div>
                    <div className="g-score-block">
                      <span className="g-score-label">CONVICTION</span>
                      <span className="g-score-num">{c.score}</span>
                      <span className="g-score-sub">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* CARD FOOTER */}
                <div className="g-card-footer">
                  <span className="g-card-footer-caption">
                    ⚠ XEROX COPY — PUBLIC RECORD — SEC.GOV
                  </span>
                  <button className="g-card-footer-btn">VIEW FULL DOSSIER →</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="g-divider" />

        {/* HOW IT WORKS */}
        <section className="g-how">
          <span className="g-section-label">▶ HOW THIS OPERATION WORKS</span>
          <div className="g-how-grid">
            {[
              {
                num: "01",
                title: "WE SCAN EVERY FILING",
                body: "Every Form 4 submitted to the SEC is parsed in real time. No manual work. No delays. Machines doing the work so you don't have to.",
                caption: "DATA SOURCE: SEC EDGAR — PUBLIC RECORD",
                rotate: "-1deg",
              },
              {
                num: "02",
                title: "WE DETECT CLUSTERS",
                body: "When 2 or more executives at the same micro-cap buy shares within 10 days of each other, a cluster is flagged. Conviction score computed.",
                caption: "METHODOLOGY: PATTERN RECOGNITION — RAW MATH",
                rotate: "0.8deg",
              },
              {
                num: "03",
                title: "YOU GET THE SIGNAL",
                body: "Daily briefing. Raw data. Zero noise. The conviction score ranks every cluster by strength so you know what matters and what doesn't.",
                caption: "DELIVERY: EMAIL — 6AM EST — NO SPAM",
                rotate: "-0.6deg",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="g-how-item"
                style={{ transform: `rotate(${item.rotate})` }}
              >
                <span className="g-how-num">{item.num}</span>
                <span className="g-how-title">{item.title}</span>
                <p className="g-how-body">{item.body}</p>
                <span className="g-how-caption">{item.caption}</span>
              </div>
            ))}
          </div>
        </section>

        <hr className="g-divider" />

        {/* SUBSCRIBE */}
        <section className="g-subscribe">
          <div style={{ paddingTop: 48 }}>
            <div className="g-sub-outer">
              <div className="g-sub-inner">
                <div className="g-sub-left">
                  <span className="g-sub-overline">▮ ADD YOUR NAME TO THE LIST ▮</span>
                  <span className="g-sub-headline">
                    <span className="g-sub-hed-vt">GET</span>
                    <span className="g-sub-hed-oswald">THE</span>
                    <br />
                    <span className="g-sub-hed-oswald">DAILY</span>
                    <span className="g-sub-hed-vt"> SIGNAL.</span>
                  </span>
                  <p className="g-sub-body">
                    Free. Photocopied. Delivered before market open. Insiders
                    buy for a reason. We just tell you when they move in packs.
                  </p>
                </div>
                <div className="g-sub-right">
                  {submitted ? (
                    <span className="g-sub-success">
                      ✓ YOU'RE ON THE LIST. SIGNAL STARTS TOMORROW 6AM EST.
                    </span>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: "contents" }}>
                      <input
                        className="g-sub-input"
                        type="email"
                        placeholder="your.email@address.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <button type="submit" className="g-sub-btn">
                        SEND ME THE ALERTS
                      </button>
                      <span className="g-sub-fine">
                        NO CREDIT CARD · NO NOISE · UNSUBSCRIBE ANYTIME
                      </span>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="g-footer">
          <div className="g-footer-top">
            <div>
              <span className="g-footer-logo">CLUSTERDESK</span>
              <span className="g-footer-logo-sub">UNAUTHORIZED INSIDER INTELLIGENCE</span>
            </div>
            <div className="g-footer-issue">
              ISSUE #047 — MAY 2026<br />
              PRINTED ON RECYCLED PAPER<br />
              PHOTOCOPIED AT 2AM
            </div>
          </div>
          <hr className="g-footer-divider" />
          <p className="g-footer-legal">
            NOT INVESTMENT ADVICE. NOT AFFILIATED WITH THE SEC, ANY COMPANY LISTED, OR ANY FINANCIAL INSTITUTION.
            CLUSTERDESK AGGREGATES PUBLICLY AVAILABLE SEC FORM 4 FILINGS AND PRESENTS THEM FOR INFORMATIONAL PURPOSES ONLY.
            INSIDER BUYING DOES NOT GUARANTEE FUTURE PRICE PERFORMANCE. PAST CLUSTER SIGNALS DO NOT PREDICT FUTURE RETURNS.
            ALWAYS DO YOUR OWN DUE DILIGENCE BEFORE MAKING ANY INVESTMENT DECISION. THIS IS A FREE SERVICE. WE ARE NOT
            RESPONSIBLE FOR ANY ACTIONS YOU TAKE BASED ON THIS INFORMATION. THE DATA PRESENTED HEREIN IS DERIVED SOLELY
            FROM PUBLIC RECORDS. © 2026 CLUSTERDESK — ALL RIGHTS RESERVED — DISTRIBUTED FREELY — COPY IT IF YOU WANT.
          </p>
        </footer>
      </div>
    </>
  );
}
