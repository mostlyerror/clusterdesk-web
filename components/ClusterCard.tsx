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

export function ClusterCard({ cluster, publishedAt }: Props) {
  const mcapM = Math.round(cluster.market_cap_usd / 1_000_000);
  const totalK = Math.round(cluster.total_value_usd / 1_000);
  const { word, color } = scoreLabel(cluster.score);

  return (
    <Link
      href={`/buys/${cluster.ticker}`}
      className="block bg-[#111111] border border-[#222222] rounded-lg p-5 hover:border-[#22C55E] transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-[#22C55E] font-bold text-lg">${cluster.ticker}</span>
          <span className="text-[#787878] text-sm ml-2">{cluster.company_name}</span>
        </div>
        <div className="text-right">
          <div className="text-xs text-[#555] mb-0.5">Conviction score</div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-base" style={{ color }}>{cluster.score}</span>
            <span className="text-[#444] text-xs">/100</span>
            <span className="text-xs font-medium" style={{ color }}>{word}</span>
          </div>
        </div>
      </div>
      <div className="text-[#ccc] text-sm mb-3">
        {cluster.insider_count} company insider{cluster.insider_count !== 1 ? "s" : ""} bought{" "}
        <span className="text-white font-medium">${totalK}K</span> combined in a{" "}
        {cluster.insider_count > 2 ? "tight" : "coordinated"} window.{" "}
        <span className="text-[#787878]">Market cap: ${mcapM}M.</span>
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
