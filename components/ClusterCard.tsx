import Link from "next/link";
import type { ClusterPayload } from "@/lib/types";

interface Props {
  cluster: ClusterPayload;
  publishedAt?: string;
}

function scoreLabel(score: number): { word: string; color: string } {
  if (score >= 80) return { word: "Very strong", color: "#22C55E" };
  if (score >= 60) return { word: "Strong", color: "#86efac" };
  if (score >= 40) return { word: "Moderate", color: "#f59e0b" };
  return { word: "Weak", color: "#787878" };
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
      <svg width={52} height={52} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={26} cy={26} r={r} fill="none" stroke="#1a1a1a" strokeWidth={3} />
        <circle
          cx={26} cy={26} r={r} fill="none"
          stroke={color} strokeWidth={3}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 1,
      }}>
        <span style={{ color, fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{score}</span>
        <span style={{ color: "#444", fontSize: 9, lineHeight: 1 }}>/100</span>
      </div>
    </div>
  );
}

export function ClusterCard({ cluster, publishedAt }: Props) {
  const mcapM = Math.round(cluster.market_cap_usd / 1_000_000);
  const totalK = Math.round(cluster.total_value_usd / 1_000);
  const { word, color } = scoreLabel(cluster.score);

  return (
    <Link
      href={`/buys/${cluster.ticker}`}
      className="block bg-[#111111] border border-[#222222] rounded-lg p-5 hover:border-[#22C55E] transition-colors"
    >
      <div className="flex items-start justify-between mb-3 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[#22C55E] font-bold text-lg">${cluster.ticker}</span>
            <span className="text-[#787878] text-sm truncate">{cluster.company_name}</span>
          </div>
          <div className="text-[#ccc] text-sm leading-snug">
            {cluster.insider_count} company insider{cluster.insider_count !== 1 ? "s" : ""} bought{" "}
            <span className="text-white font-medium">${totalK}K</span> combined in a{" "}
            {cluster.insider_count > 2 ? "tight" : "coordinated"} window.{" "}
            <span className="text-[#555]">Market cap: ${mcapM}M.</span>
          </div>
        </div>
        <div className="text-center flex-shrink-0">
          <ScoreRing score={cluster.score} color={color} />
          <div className="text-xs font-medium mt-1" style={{ color }}>{word}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-[#555] mr-1">Who bought:</span>
        {[...new Set(cluster.roles)].map((role) => (
          <span
            key={role}
            className="text-xs bg-[#0f2818] text-[#22C55E] border border-[#1a4a2a] rounded px-2 py-0.5"
          >
            {role}
          </span>
        ))}
      </div>
      {publishedAt && (
        <div className="text-[#787878] text-xs mt-3">
          {new Date(publishedAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", year: "numeric",
          })}
        </div>
      )}
    </Link>
  );
}
