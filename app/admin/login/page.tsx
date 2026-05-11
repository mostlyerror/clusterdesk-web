"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Wrong secret.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-xs">
        <p className="text-[#787878] text-sm mb-2">ClusterDesk Admin</p>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Secret"
          className="bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#22C55E]"
        />
        <button
          type="submit"
          className="bg-[#22C55E] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#16a34a] transition-colors"
        >
          Enter
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
    </div>
  );
}
