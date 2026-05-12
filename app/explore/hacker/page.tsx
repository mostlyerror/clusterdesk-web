"use client";

import { useState } from "react";

const CLUSTERS = [
  {
    ticker: "MVST",
    name: "microvast holdings",
    score: 87,
    insiders: 3,
    roles: ["ceo", "cfo", "director"],
    valueFmt: "$312,000 usd",
    window: 5,
    status: "ACTIVE",
    epochStart: 1746057600,
    epochEnd: 1746489600,
  },
  {
    ticker: "AEYE",
    name: "audioeye inc",
    score: 74,
    insiders: 2,
    roles: ["ceo", "director"],
    valueFmt: "$88,000 usd",
    window: 3,
    status: "ACTIVE",
    epochStart: 1746489600,
    epochEnd: 1746748800,
  },
  {
    ticker: "ZDGE",
    name: "zedge inc",
    score: 62,
    insiders: 2,
    roles: ["cfo", "director"],
    valueFmt: "$47,000 usd",
    window: 4,
    status: "MONITORING",
    epochStart: 1746748800,
    epochEnd: 1747094400,
  },
];

function progressBar(score: number): string {
  const filled = Math.round(score / 10);
  const empty = 10 - filled;
  return "[" + "█".repeat(filled) + "░".repeat(empty) + "]";
}

function severityLabel(score: number): string {
  if (score >= 80) return "HIGH";
  if (score >= 60) return "MEDIUM";
  return "LOW";
}

const FAKE_SIG = `-----BEGIN CLUSTERDESK SIGNATURE-----
Version: ClusterDesk/1.0 (darknet build)

iQEzBAEBCAAdFiEEn3kZ2mVlQ7x9K1pFoWq2Ec4rT3QFAmg5Xz4ACgkQoWq2
Ec4rT3TtjQCg4vZXk9mLQpT2J8dFw3nYs6RV1bKxPmC+yO7NeuWdHqLzBmFU
oVKe3TpIqXs9lNcD0hRwAmZ5YuJOvKxMtV3sGp6NdEb1cFLa8Qy7HnWjXiUo
tR2kB4mPeZsVlDqC9uNwXfOgA1hYvKs3mBRj5TnLpQ8eF7GdIcZw==
=Xm4r
-----END CLUSTERDESK SIGNATURE-----`;

export default function HackerPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const now = Math.floor(Date.now() / 1000);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/hack-font@3/build/web/hack.css');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html, body {
          background: #000000;
          color: #AAAAAA;
          font-family: 'Hack', 'Source Code Pro', 'Courier New', Courier, monospace;
          font-size: 13px;
          line-height: 1.6;
          -webkit-font-smoothing: none;
          -moz-osx-font-smoothing: grayscale;
        }

        a {
          color: #00AA44;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        input[type="text"], input[type="email"] {
          background: #000000;
          color: #AAAAAA;
          border: 1px solid #333333;
          font-family: inherit;
          font-size: 13px;
          padding: 2px 6px;
          outline: none;
        }

        input[type="text"]:focus, input[type="email"]:focus {
          border-color: #555555;
        }

        button {
          background: #000000;
          color: #AAAAAA;
          border: 1px solid #333333;
          font-family: inherit;
          font-size: 13px;
          padding: 2px 8px;
          cursor: pointer;
        }

        button:hover {
          color: #DDDDDD;
          border-color: #555555;
        }

        ::selection {
          background: #00AA44;
          color: #000000;
        }
      `}</style>

      <div
        style={{
          background: "#000000",
          minHeight: "100vh",
          maxWidth: "780px",
          margin: "0 auto",
          padding: "24px 16px 48px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ color: "#DDDDDD", marginBottom: "4px" }}>
            clusterdesk.io{" "}
            <span style={{ color: "#00AA44" }}>
              [secure connection established]
            </span>
          </div>
          <div style={{ color: "#555555" }}>
            tls 1.3 | cipher: AES_256_GCM | cert: self-signed
          </div>
          <div style={{ color: "#555555", marginTop: "2px" }}>
            // this service does not log, does not track, does not monetize your
            data
          </div>
        </div>

        {/* Nav */}
        <div style={{ marginBottom: "24px", color: "#AAAAAA" }}>
          <a href="#">[home]</a>
          {" | "}
          <a href="#">[alerts]</a>
          {" | "}
          <a href="#">[watchlist]</a>
          {" | "}
          <a href="#">[docs]</a>
          {" | "}
          <a href="#">[about]</a>
          {" | "}
          <span style={{ color: "#00AA44" }}>247 users monitoring</span>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid #333333",
            marginBottom: "24px",
          }}
        />

        {/* Status line */}
        <div style={{ marginBottom: "20px", color: "#555555" }}>
          <span style={{ color: "#00AA44" }}>$</span> query --source=sec_form4
          --type=cluster_buy --min_insiders=2 --micro_cap=true
          <br />
          <span style={{ color: "#00AA44" }}>$</span>{" "}
          <span style={{ color: "#AAAAAA" }}>
            fetching... 3 active clusters found. epoch: {now}
          </span>
        </div>

        {/* Clusters */}
        {CLUSTERS.map((c) => (
          <div
            key={c.ticker}
            style={{
              marginBottom: "28px",
              borderTop: "1px solid #333333",
              paddingTop: "16px",
            }}
          >
            {/* Alert header */}
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#CC0000", fontWeight: "bold" }}>
                [ALERT]
              </span>{" "}
              <span style={{ color: "#DDDDDD" }}>
                {c.ticker} :: {c.name}
              </span>
            </div>

            {/* Data block */}
            <div style={{ color: "#AAAAAA", paddingLeft: "8px" }}>
              <div>
                score:{" "}
                <span style={{ color: "#DDDDDD" }}>
                  {c.score}/100 {progressBar(c.score)}{" "}
                </span>
                <span
                  style={{
                    color:
                      severityLabel(c.score) === "HIGH"
                        ? "#CC0000"
                        : severityLabel(c.score) === "MEDIUM"
                          ? "#AAAAAA"
                          : "#555555",
                  }}
                >
                  {severityLabel(c.score)}
                </span>
              </div>
              <div>
                insiders:{" "}
                <span style={{ color: "#DDDDDD" }}>
                  {c.insiders} ({c.roles.join(", ")})
                </span>
              </div>
              <div>
                value:{" "}
                <span style={{ color: "#00AA44" }}>{c.valueFmt}</span>
              </div>
              <div>
                window:{" "}
                <span style={{ color: "#DDDDDD" }}>{c.window} days</span>
              </div>
              <div>
                epoch_range:{" "}
                <span style={{ color: "#555555" }}>
                  {c.epochStart} → {c.epochEnd}
                </span>
              </div>
              <div>
                status:{" "}
                <span
                  style={{
                    color:
                      c.status === "ACTIVE" ? "#00AA44" : "#AAAAAA",
                  }}
                >
                  {c.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid #333333",
            margin: "8px 0 24px",
          }}
        />

        {/* Subscribe */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ color: "#555555", marginBottom: "8px" }}>
            // subscribe for raw alert feed (encrypted, no tracking)
          </div>
          {subscribed ? (
            <div style={{ color: "#00AA44" }}>
              &gt; subscribed. pgp key optional — reply to confirmation.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              <label htmlFor="hacker-email" style={{ color: "#AAAAAA" }}>
                email:
              </label>
              <input
                id="hacker-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@protonmail.com"
                style={{ width: "220px" }}
              />
              <button type="submit">[subscribe]</button>
            </form>
          )}
        </div>

        {/* PGP signature */}
        <div
          style={{
            borderTop: "1px solid #333333",
            paddingTop: "16px",
            marginBottom: "24px",
          }}
        >
          <pre
            style={{
              color: "#555555",
              fontFamily: "inherit",
              fontSize: "11px",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {FAKE_SIG}
          </pre>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #333333",
            paddingTop: "16px",
            color: "#555555",
            fontSize: "11px",
          }}
        >
          <div>
            clearnet:{" "}
            <a href="https://clusterdesk.io" style={{ color: "#555555" }}>
              https://clusterdesk.io
            </a>
          </div>
          <div>
            tor mirror:{" "}
            <span style={{ color: "#AAAAAA" }}>
              http://clstrdsk3k7xample.onion
            </span>{" "}
            (tor mirror)
          </div>
          <div style={{ marginTop: "8px" }}>
            // data sourced from sec form 4 filings. public record. no warranty.
          </div>
          <div>
            // clusterdesk is not a registered investment adviser. this is not
            financial advice.
          </div>
          <div style={{ marginTop: "8px", color: "#333333" }}>
            epoch: {now} | build: darknet-1.0.0
          </div>
        </div>
      </div>
    </>
  );
}
