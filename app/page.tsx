import { supabase } from "@/lib/supabase";
import { ClusterCard } from "@/components/ClusterCard";
import { EmailCapture } from "@/components/EmailCapture";
import type { TickerPageRow } from "@/lib/types";

export const revalidate = 3600;

const S = {
  wrap: { maxWidth: 960, margin: "0 auto", padding: "0 32px" } as React.CSSProperties,
  label: { fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#9A9A9A" },
  rule: { width: "100%", height: 1, background: "#E8E8E4", border: "none" } as React.CSSProperties,
};

async function getLatestClusters(): Promise<TickerPageRow[]> {
  const { data } = await supabase
    .from("ticker_pages")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(4);
  return data ?? [];
}

function AlertPreview() {
  return (
    <div style={{ border: "1px solid #E8E8E4", background: "#FFFFFF" }}>
      {/* Push notification */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #F0F0EC", display: "flex", gap: 12, alignItems: "flex-start", background: "#FAFAF8" }}>
        <div style={{ width: 32, height: 32, background: "#2D6A4F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>
          CD
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>ClusterDesk</span>
            <span style={{ fontSize: 11, color: "#C0C0C0" }}>now</span>
          </div>
          <p style={{ fontSize: 12, color: "#6A6A6A", lineHeight: 1.4 }}>
            $MVST cluster buy — 87/100. 3 insiders, $312K in 4 days.
          </p>
        </div>
      </div>
      {/* Email body */}
      <div style={{ padding: "20px 20px" }}>
        <div style={{ fontSize: 11, color: "#C0C0C0", fontFamily: "monospace", marginBottom: 16 }}>
          From: alerts@clusterdesk.io &nbsp;·&nbsp; Subject: $MVST — Cluster Buy Alert · Score 87/100
        </div>
        <div style={{ border: "1px solid #E8E8E4", padding: "20px 20px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "#1A1A1A" }}>MVST</span>
            <span style={{ fontSize: 12, color: "#9A9A9A" }}>Microvast Holdings · $180M market cap</span>
          </div>
          <p style={{ fontSize: 13, color: "#4A4A4A", marginBottom: 16, lineHeight: 1.6 }}>
            3 insiders purchased <strong style={{ color: "#1A1A1A" }}>$312,000</strong> combined
            within a 4-day window. Conviction score:{" "}
            <strong style={{ color: "#2D6A4F" }}>87/100 — Very Strong</strong>.
          </p>
          <div style={{ borderTop: "1px solid #F0F0EC", paddingTop: 14, display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {[
              { role: "CEO", value: "$145,000", date: "May 2" },
              { role: "CFO", value: "$112,000", date: "May 3" },
              { role: "Director", value: "$55,000", date: "May 5" },
            ].map(({ role, value, date }) => (
              <div key={role} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "#9A9A9A", fontFamily: "monospace", width: 72 }}>{role}</span>
                <span style={{ color: "#4A4A4A", fontWeight: 500 }}>{value}</span>
                <span style={{ color: "#C0C0C0" }}>{date}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #F0F0EC", paddingTop: 14, marginTop: 14 }}>
            <span style={{ fontSize: 12, color: "#2D6A4F" }}>View full breakdown → clusterdesk.io/buys/MVST</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const clusters = await getLatestClusters();
  const [top, ...rest] = clusters;

  return (
    <div style={{ background: "#FAFAF8" }}>
      {/* Live bar */}
      <div style={{ borderBottom: "1px solid #E8E8E4" }}>
        <div style={{ ...S.wrap, display: "flex", alignItems: "center", gap: 12, padding: "10px 32px" }}>
          <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8, flexShrink: 0 }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#2D6A4F", opacity: 0.6, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
            <span style={{ position: "relative", width: 8, height: 8, borderRadius: "50%", background: "#2D6A4F" }} />
          </span>
          <style>{`@keyframes ping { 75%,100% { transform: scale(2); opacity: 0; } }`}</style>
          <span style={{ ...S.label }}>Live</span>
          <span style={{ color: "#E8E8E4" }}>·</span>
          <span style={{ fontSize: 12, color: "#9A9A9A" }}>Monitoring SEC Form 4 filings daily</span>
          {clusters.length > 0 && (
            <>
              <span style={{ color: "#E8E8E4" }}>·</span>
              <span style={{ fontSize: 12, color: "#9A9A9A" }}>{clusters.length} active signal{clusters.length !== 1 ? "s" : ""}</span>
            </>
          )}
        </div>
      </div>

      {/* Hero — Swiss big-number style when top cluster exists, editorial otherwise */}
      {top ? (
        <div style={{ borderBottom: "1px solid #1A1A1A" }}>
          <div style={{ ...S.wrap, padding: "56px 32px 48px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 48, alignItems: "flex-end" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(96px, 12vw, 160px)", fontWeight: 400, lineHeight: 0.9, letterSpacing: "-0.03em", color: "#2D6A4F" }}>
                {top.payload.score}
              </div>
              <div style={{ paddingBottom: 8, display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ ...S.label, color: "#2D6A4F", marginBottom: 8 }}>Top signal this week</div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, letterSpacing: "-0.01em", color: "#1A1A1A", lineHeight: 1.1, marginBottom: 4 }}>
                    {top.payload.company_name}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#9A9A9A" }}>${top.payload.ticker}</div>
                </div>
                <p style={{ fontSize: 15, color: "#4A4A4A", lineHeight: 1.55, maxWidth: 420 }}>
                  {top.payload.insider_count} executives purchased{" "}
                  <strong style={{ color: "#1A1A1A" }}>${Math.round(top.payload.total_value_usd / 1000)}K</strong>{" "}
                  within a{" "}
                  {Math.ceil((new Date(top.payload.cluster_end_date).getTime() - new Date(top.payload.cluster_start_date).getTime()) / 86400000) + 1}-day
                  window — the highest cluster signal score this week.
                </p>
                <div style={{ display: "flex", gap: 40 }}>
                  {[
                    { value: top.payload.insider_count.toString(), label: "Insiders" },
                    { value: `$${Math.round(top.payload.total_value_usd / 1000)}K`, label: "Total bought" },
                    { value: `$${Math.round(top.payload.market_cap_usd / 1_000_000)}M`, label: "Market cap" },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, letterSpacing: "-0.02em", color: "#1A1A1A", lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A9A9A", marginTop: 4 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ borderBottom: "1px solid #1A1A1A" }}>
          <div style={{ ...S.wrap, padding: "96px 32px 80px", maxWidth: 720 }}>
            <p style={{ ...S.label, color: "#2D6A4F", marginBottom: 24 }}>Insider Cluster Intelligence</p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(40px, 6vw, 56px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#1A1A1A", marginBottom: 24 }}>
              When executives buy together,<br />pay attention.
            </h1>
            <p style={{ fontSize: 16, fontWeight: 300, color: "#6A6A6A", lineHeight: 1.75, maxWidth: 500, marginBottom: 40 }}>
              ClusterDesk detects when 2+ insiders at the same micro-cap company buy their own stock within days of each other — and sends you the alert.
            </p>
            <EmailCapture source="landing" />
          </div>
        </div>
      )}

      <div style={S.wrap}>
        {/* Subscribe CTA (shown below hero when top cluster exists) */}
        {top && (
          <div style={{ padding: "40px 0", borderBottom: "1px solid #E8E8E4", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 22, color: "#1A1A1A", marginBottom: 4 }}>
                Get the next alert before the market does.
              </p>
              <p style={{ fontSize: 13, fontWeight: 300, color: "#9A9A9A" }}>Free. One email per cluster. Unsubscribe anytime.</p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <EmailCapture source="landing" />
            </div>
          </div>
        )}

        {/* What is a cluster buy */}
        <div style={{ padding: "56px 0", borderBottom: "1px solid #E8E8E4" }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 48 }}>
            <div>
              <p style={S.label}>The signal</p>
            </div>
            <div>
              <p style={{ fontSize: 15, color: "#4A4A4A", lineHeight: 1.7, marginBottom: 12, maxWidth: 560 }}>
                A <strong style={{ color: "#1A1A1A" }}>cluster buy</strong> happens when two or more company insiders — executives, directors, or major shareholders — purchase stock{" "}
                <strong style={{ color: "#1A1A1A" }}>independently within a short window</strong>. Unlike a single trade, which can be noise, a cluster signals broad internal conviction: multiple people with direct knowledge of the business are all betting their own money at the same time.
              </p>
              <p style={{ fontSize: 12, color: "#C0C0C0" }}>Source: SEC Form 4 filings, publicly available within 2 business days of each trade.</p>
            </div>
          </div>
        </div>

        {/* All signals */}
        {clusters.length > 0 && (
          <div style={{ padding: "56px 0", borderBottom: "1px solid #E8E8E4" }}>
            <div style={{ marginBottom: 32 }}>
              <p style={S.label}>Recent signals</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {clusters.map((row, i) => (
                <div key={`${row.ticker}-${row.cluster_date}`} style={{ borderBottom: i < clusters.length - 1 ? "1px solid #F0F0EC" : "none" }}>
                  <ClusterCard cluster={row.payload} publishedAt={row.published_at} featured={i === 0} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Methodology */}
        <div style={{ padding: "56px 0", borderBottom: "1px solid #E8E8E4" }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 48 }}>
            <div>
              <p style={S.label}>How it works</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                {
                  n: "01",
                  title: "Cluster detection",
                  body: "We monitor SEC Form 4 filings every weekday. When two or more insiders at the same micro-cap company ($50M–$500M) buy on the open market within a 5-day window, a cluster event is flagged.",
                },
                {
                  n: "02",
                  title: "Seniority & conviction weighting",
                  body: "CEO and CFO purchases carry higher weight than Director purchases. Dollar amount is normalised against company size, so a $50K buy at a $100M company scores higher than the same amount at a $500M company.",
                },
                {
                  n: "03",
                  title: "Score & alert delivery",
                  body: "Each cluster receives a 0–100 conviction score. Clusters scoring 60+ are published and emailed within 24 hours of the final Form 4 filing. No noise. Just the signal.",
                },
              ].map(({ n, title, body }) => (
                <div key={n} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 24 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#C0C0C0", paddingTop: 2 }}>{n}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 }}>{title}</p>
                    <p style={{ fontSize: 14, fontWeight: 300, color: "#6A6A6A", lineHeight: 1.65 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What you receive */}
        <div style={{ padding: "56px 0", borderBottom: "1px solid #E8E8E4" }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 48 }}>
            <div>
              <p style={S.label}>What you get</p>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 300, color: "#6A6A6A", marginBottom: 24, lineHeight: 1.6 }}>
                Every qualifying cluster buy arrives as a push notification and email with the full breakdown — who bought, how much, their title, and what the conviction score means.
              </p>
              <AlertPreview />
            </div>
          </div>
        </div>

        {/* Bottom subscribe */}
        {!top && (
          <div style={{ padding: "80px 0" }}>
            <p style={{ ...S.label, marginBottom: 12 }}>Don&apos;t miss the next signal</p>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 36, letterSpacing: "-0.02em", color: "#1A1A1A", marginBottom: 8, lineHeight: 1.1 }}>
              Get alerted when a cluster buy is detected.
            </p>
            <p style={{ fontSize: 13, fontWeight: 300, color: "#9A9A9A", marginBottom: 32 }}>Free. Alerts delivered within 24 hours.</p>
            <EmailCapture source="landing-bottom" />
          </div>
        )}
      </div>
    </div>
  );
}
