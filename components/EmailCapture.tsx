"use client";

import { useState } from "react";

interface Props {
  source?: string;
}

export function EmailCapture({ source = "landing" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Subscription failed");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg.slice(0, 120));
    }
  }

  if (status === "success") {
    return (
      <p style={{ color: "#2D6A4F", fontWeight: 500 }}>
        You&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 0, width: "100%", maxWidth: 440 }}>
      <label htmlFor="email-input" className="sr-only">Email address</label>
      <input
        id="email-input"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        style={{
          flex: 1,
          height: 48,
          border: "1px solid #E8E8E4",
          borderRight: "none",
          background: "#FFFFFF",
          padding: "0 16px",
          fontSize: 14,
          color: "#1A1A1A",
          outline: "none",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          height: 48,
          padding: "0 24px",
          background: "#2D6A4F",
          color: "#FFFFFF",
          border: "none",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          cursor: status === "loading" ? "default" : "pointer",
          opacity: status === "loading" ? 0.6 : 1,
          whiteSpace: "nowrap",
          fontFamily: "var(--font-sans, system-ui, sans-serif)",
          flexShrink: 0,
        }}
      >
        {status === "loading" ? "Sending…" : "Get alerts"}
      </button>
      {status === "error" && (
        <p style={{ color: "#DC2626", fontSize: 12, marginTop: 8, width: "100%" }}>{errorMsg}</p>
      )}
    </form>
  );
}
