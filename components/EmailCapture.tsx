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
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <p className="text-[#22C55E] font-medium">
        Check your inbox — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-[#111111] border border-[#333333] text-white placeholder-[#787878] rounded-lg px-4 py-3 focus:outline-none focus:border-[#22C55E] transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[#22C55E] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#16a34a] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Get alerts"}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-sm mt-1 w-full">{errorMsg}</p>
      )}
    </form>
  );
}
