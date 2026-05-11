import { createAdminClient } from "@/lib/supabase-server";

export const revalidate = 0;

type StatusLevel = "NOMINAL" | "DEGRADED" | "WARNING" | "DOWN";

interface SubsystemStatus {
  name: string;
  status: StatusLevel;
  metric: string;
  detail: string;
}

const STATUS_COLOR: Record<StatusLevel, string> = {
  NOMINAL: "#22C55E",
  DEGRADED: "#F59E0B",
  WARNING: "#F59E0B",
  DOWN: "#EF4444",
};

const STATUS_BG: Record<StatusLevel, string> = {
  NOMINAL: "#052e16",
  DEGRADED: "#1c1002",
  WARNING: "#1c1002",
  DOWN: "#1f0707",
};

const STATUS_BORDER: Record<StatusLevel, string> = {
  NOMINAL: "#16653480",
  DEGRADED: "#7849008f",
  WARNING: "#7849008f",
  DOWN: "#7f1d1d80",
};

async function getMissionData() {
  const db = createAdminClient();

  const [subscribersRes, latestClusterRes, totalPublishedRes] =
    await Promise.all([
      db
        .from("email_subscribers")
        .select("email,created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .limit(5),
      db
        .from("clusters")
        .select("ticker,score,published_at")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .limit(1)
        .single(),
      db
        .from("clusters")
        .select("*", { count: "exact", head: true })
        .not("published_at", "is", null),
    ]);

  const subscriberCount = subscribersRes.count ?? 0;
  const recentSubscribers = subscribersRes.data ?? [];
  const latestCluster = latestClusterRes.data;
  const totalPublished = totalPublishedRes.count ?? 0;

  const now = Date.now();

  let pipelineStatus: StatusLevel = "DOWN";
  let pipelineMetric = "No clusters published";
  let pipelineDetail = "Pipeline has never run or all drafts";
  if (latestCluster?.published_at) {
    const lastMs = new Date(latestCluster.published_at).getTime();
    const hoursAgo = (now - lastMs) / (1000 * 60 * 60);
    const daysAgo = hoursAgo / 24;
    if (daysAgo <= 1) {
      pipelineStatus = "NOMINAL";
      pipelineMetric = `Last run ${Math.round(hoursAgo)}h ago`;
      pipelineDetail = `${latestCluster.ticker} · score ${latestCluster.score}`;
    } else if (daysAgo <= 3) {
      pipelineStatus = "DEGRADED";
      pipelineMetric = `Last run ${Math.round(daysAgo)}d ago`;
      pipelineDetail = `${latestCluster.ticker} — pipeline may be stalling`;
    } else {
      pipelineStatus = "DOWN";
      pipelineMetric = `Last run ${Math.round(daysAgo)}d ago`;
      pipelineDetail = "Pipeline has not published in 3+ days";
    }
  }

  let subscribersStatus: StatusLevel = "NOMINAL";
  const subscribersMetric = `${subscriberCount} total`;
  let subscribersDetail = "Subscriber list is healthy";
  if (subscriberCount === 0) {
    subscribersStatus = "DOWN";
    subscribersDetail = "No subscribers captured yet";
  } else if (subscriberCount < 10) {
    subscribersStatus = "WARNING";
    subscribersDetail = "Subscriber count is very low";
  }

  const webStatus: StatusLevel = "NOMINAL";
  const webMetric = "Admin responding";
  const webDetail = `${totalPublished} clusters live`;

  const emailStatus: StatusLevel = "WARNING";
  const emailMetric = "No live telemetry";
  const emailDetail = "Check Resend dashboard manually";

  const subsystems: SubsystemStatus[] = [
    { name: "PIPELINE", status: pipelineStatus, metric: pipelineMetric, detail: pipelineDetail },
    { name: "SUBSCRIBERS", status: subscribersStatus, metric: subscribersMetric, detail: subscribersDetail },
    { name: "WEB", status: webStatus, metric: webMetric, detail: webDetail },
    { name: "EMAIL", status: emailStatus, metric: emailMetric, detail: emailDetail },
  ];

  const allNominal = subsystems.every((s) => s.status === "NOMINAL");

  return {
    subsystems,
    allNominal,
    recentSubscribers,
    latestCluster,
    totalPublished,
    subscriberCount,
    checkedAt: new Date().toISOString(),
  };
}

export default async function MissionControlPage() {
  const {
    subsystems,
    allNominal,
    recentSubscribers,
    latestCluster,
    totalPublished,
    subscriberCount,
    checkedAt,
  } = await getMissionData();

  const checkedAtFormatted = new Date(checkedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="font-mono" style={{ color: "#e5e5e5" }}>
      <div
        className="border-b px-6 py-3 flex items-center justify-between text-xs"
        style={{ borderColor: "#1f1f1f", color: "#787878" }}
      >
        <span className="tracking-widest uppercase">
          ClusterDesk &middot; Mission Control
        </span>
        <span className="tabular-nums">CHECKED {checkedAtFormatted}</span>
      </div>

      <div className="px-6 py-10 max-w-5xl mx-auto">
        <div
          className="rounded-lg px-6 py-5 mb-10 flex items-center gap-4 border-2"
          style={{
            background: allNominal ? "#052e16" : "#1f0707",
            borderColor: allNominal ? "#22C55E" : "#EF4444",
          }}
        >
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{
              background: allNominal ? "#22C55E" : "#EF4444",
              boxShadow: `0 0 12px ${allNominal ? "#22C55E" : "#EF4444"}`,
            }}
          />
          <div>
            <p
              className="text-xl font-bold tracking-widest uppercase"
              style={{ color: allNominal ? "#22C55E" : "#EF4444" }}
            >
              {allNominal ? "ALL SYSTEMS NOMINAL" : "ATTENTION REQUIRED"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#787878" }}>
              {allNominal
                ? "All subsystems operating within normal parameters"
                : "One or more subsystems require operator review"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          {subsystems.map((sys) => (
            <SubsystemBlock key={sys.name} sys={sys} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <MetricCard label="TOTAL PUBLISHED" value={String(totalPublished)} sub="clusters" />
          <MetricCard label="SUBSCRIBERS" value={String(subscriberCount)} sub="on list" />
          <MetricCard
            label="LAST CLUSTER"
            value={
              latestCluster?.published_at
                ? new Date(latestCluster.published_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "—"
            }
            sub={latestCluster?.ticker ?? "none"}
          />
        </div>

        <section className="mb-10">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "#787878" }}>
            Recent Subscribers
          </p>
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: "#222" }}>
            {recentSubscribers.length === 0 ? (
              <p className="px-4 py-4 text-xs" style={{ color: "#787878" }}>
                NO SUBSCRIBERS CAPTURED
              </p>
            ) : (
              recentSubscribers.map(
                (sub: { email: string; created_at: string }, i: number) => (
                  <div
                    key={sub.email}
                    className="flex items-center justify-between px-4 py-2.5 text-xs border-b last:border-b-0"
                    style={{
                      borderColor: "#1a1a1a",
                      background: i % 2 === 0 ? "#0f0f0f" : "#0a0a0a",
                    }}
                  >
                    <span style={{ color: "#22C55E" }}>{sub.email}</span>
                    <span className="tabular-nums" style={{ color: "#787878" }}>
                      {new Date(sub.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )
              )
            )}
          </div>
        </section>

        <section>
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "#787878" }}>
            External Systems
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "RAILWAY", href: "https://railway.app" },
              { label: "VERCEL", href: "https://vercel.com" },
              { label: "SUPABASE", href: "https://supabase.com" },
              { label: "RESEND", href: "https://resend.com" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded border transition-colors hover:border-[#555]"
                style={{ borderColor: "#333", color: "#787878" }}
              >
                {link.label} &uarr;
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SubsystemBlock({ sys }: { sys: SubsystemStatus }) {
  const color = STATUS_COLOR[sys.status];
  const bg = STATUS_BG[sys.status];
  const border = STATUS_BORDER[sys.status];

  return (
    <div className="rounded-lg p-5 border" style={{ background: bg, borderColor: border }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs tracking-widest uppercase" style={{ color: "#787878" }}>
          {sys.name}
        </p>
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          />
          <span className="text-xs font-bold tracking-widest" style={{ color }}>
            {sys.status}
          </span>
        </div>
      </div>
      <p className="text-lg font-bold mb-1" style={{ color }}>
        {sys.metric}
      </p>
      <p className="text-xs" style={{ color: "#787878" }}>
        {sys.detail}
      </p>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg p-4 border" style={{ borderColor: "#222", background: "#0f0f0f" }}>
      <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "#787878" }}>
        {label}
      </p>
      <p className="text-3xl font-bold tabular-nums">{value}</p>
      <p className="text-xs mt-1" style={{ color: "#787878" }}>
        {sub}
      </p>
    </div>
  );
}
