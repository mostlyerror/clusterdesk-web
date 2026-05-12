import Link from "next/link";
import type { ClusterPayload } from "@/lib/types";

interface Props {
  cluster: ClusterPayload;
  publishedAt?: string;
  featured?: boolean;
}

function scoreLabel(score: number): { word: string; color: string } {
  if (score >= 80) return { word: "Very strong", color: "#2D6A4F" };
  if (score >= 60) return { word: "Strong", color: "#3D8B65" };
  if (score >= 40) return { word: "Moderate", color: "#D97706" };
  return { word: "Weak", color: "#9A9A9A" };
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <div style={{ position: "relative", width: 58, height: 58, flexShrink: 0 }}>
      <svg width={58} height={58} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={29} cy={29} r={r} fill="none" stroke="#E8E8E4" strokeWidth={3} />
        <circle
          cx={29} cy={29} r={r} fill="none"
          stroke={color} strokeWidth={3}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
        <span style={{ color, fontSize: 14, fontWeight: 600, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{score}</span>
        <span style={{ color: "#C0C0C0", fontSize: 9, lineHeight: 1 }}>/100</span>
      </div>
    </div>
  );
}

export function ClusterCard({ cluster, publishedAt, featured }: Props) {
  const mcapM = Math.round(cluster.market_cap_usd / 1_000_000);
  const totalK = Math.round(cluster.total_value_usd / 1_000);
  const { word, color } = scoreLabel(cluster.score);

  return (
    <Link
      href={`/buys/${cluster.ticker}`}
      style={{
        display: "block",
        background: "#FFFFFF",
        border: "1px solid #E8E8E4",
        borderLeft: featured ? "3px solid #2D6A4F" : "1px solid #E8E8E4",
        padding: "28px 32px",
        textDecoration: "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      className="cluster-card"
    >
      <style>{`.cluster-card:hover { border-color: #2D6A4F !important; box-shadow: 0 2px 16px rgba(45,106,79,0.08); }`}</style>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 26, letterSpacing: "-0.01em", color: "#1A1A1A", lineHeight: 1 }}>
              {cluster.ticker}
            </span>
            <span style={{ fontSize: 13, color: "#9A9A9A", fontWeight: 400 }}>{cluster.company_name}</span>
          </div>
          <p style={{ fontSize: 14, color: "#4A4A4A", lineHeight: 1.55, marginBottom: 0 }}>
            {cluster.insider_count} insider{cluster.insider_count !== 1 ? "s" : ""} bought{" "}
            <strong style={{ color: "#1A1A1A", fontWeight: 600 }}>${totalK}K</strong> combined
            in a {cluster.insider_count > 2 ? "tight" : "coordinated"} window.{" "}
            <span style={{ color: "#9A9A9A" }}>Market cap: ${mcapM}M.</span>
          </p>
        </div>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <ScoreRing score={cluster.score} color={color} />
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color, marginTop: 4 }}>{word}</div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #F0F0EC", paddingTop: 16, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#9A9A9A", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginRight: 4 }}>Buyers</span>
        {[...new Set(cluster.roles)].map((role) => (
          <span key={role} style={{ fontSize: 11, background: "#EEF5F1", color: "#2D6A4F", fontWeight: 600, padding: "3px 8px", letterSpacing: "0.02em" }}>
            {role}
          </span>
        ))}
        {publishedAt && (
          <span style={{ fontSize: 11, color: "#C0C0C0", marginLeft: "auto" }}>
            {new Date(publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        )}
      </div>
    </Link>
  );
}
