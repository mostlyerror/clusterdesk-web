import Link from "next/link";
import type { ClusterPayload } from "@/lib/types";

interface Props {
  cluster: ClusterPayload;
  publishedAt?: string;
}

export function ClusterCard({ cluster, publishedAt }: Props) {
  const mcapM = Math.round(cluster.market_cap_usd / 1_000_000);
  const totalK = Math.round(cluster.total_value_usd / 1_000);

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
        <span className="text-white font-semibold text-sm bg-[#1a1a1a] border border-[#333] rounded px-2 py-1">
          {cluster.score}/100
        </span>
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
