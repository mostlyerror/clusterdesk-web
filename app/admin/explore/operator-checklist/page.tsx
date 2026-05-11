import { createAdminClient } from "@/lib/supabase-server";

export const revalidate = 0;

type CheckStatus = "ok" | "warn" | "fail" | "unknown";

interface CheckItem {
  label: string;
  detail: string;
  status: CheckStatus;
}

async function getChecklistData() {
  const db = createAdminClient();

  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [latestClusterRes, subscriberCountRes, weekSubsRes, totalPublishedRes] =
    await Promise.all([
      db
        .from("clusters")
        .select("ticker, published_at, score")
        .not("published_at", "is", null)
        .order("published_at", { ascending: false })
        .limit(1)
        .single(),
      db
        .from("email_subscribers")
        .select("*", { count: "exact", head: true }),
      db
        .from("email_subscribers")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
      db
        .from("clusters")
        .select("*", { count: "exact", head: true })
        .not("published_at", "is", null),
    ]);

  const latestCluster = latestClusterRes.data;
  const totalSubs = subscriberCountRes.count ?? 0;
  const weekSubs = weekSubsRes.count ?? 0;
  const totalPublished = totalPublishedRes.count ?? 0;

  // Pipeline check
  let pipelineStatus: CheckStatus = "fail";
  let pipelineDetail = "No clusters published yet";
  if (latestCluster?.published_at) {
    const daysAgo =
      (now - new Date(latestCluster.published_at).getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysAgo <= 1) {
      pipelineStatus = "ok";
      pipelineDetail = `Last publish: ${latestCluster.ticker} · ${Math.round(daysAgo * 24)}h ago · score ${latestCluster.score}`;
    } else if (daysAgo <= 3) {
      pipelineStatus = "warn";
      pipelineDetail = `Last publish: ${latestCluster.ticker} · ${Math.round(daysAgo)}d ago — check Railway logs`;
    } else {
      pipelineStatus = "fail";
      pipelineDetail = `No publish in ${Math.round(daysAgo)}d — pipeline may be down`;
    }
  }

  // Subscriber growth check
  let subGrowthStatus: CheckStatus = "ok";
  let subGrowthDetail = `${weekSubs} new this week · ${totalSubs} total`;
  if (totalSubs === 0) {
    subGrowthStatus = "fail";
    subGrowthDetail = "No subscribers yet — check signup form";
  } else if (weekSubs === 0) {
    subGrowthStatus = "warn";
    subGrowthDetail = `${totalSubs} total · 0 new this week — growth stalled`;
  }

  // Content check
  let contentStatus: CheckStatus = "ok";
  let contentDetail = `${totalPublished} clusters published`;
  if (totalPublished === 0) {
    contentStatus = "fail";
    contentDetail = "No clusters published — run pipeline";
  } else if (totalPublished < 3) {
    contentStatus = "warn";
    contentDetail = `Only ${totalPublished} clusters — limited content`;
  }

  // Email service check (can't verify live, mark as unknown)
  const emailStatus: CheckStatus = "unknown";
  const emailDetail = "Verify in Resend dashboard — no live telemetry available";

  // X / Twitter aging check
  const launchDate = new Date("2025-05-01");
  const daysSinceLaunch = Math.floor(
    (now - launchDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const xStatus: CheckStatus = daysSinceLaunch >= 14 ? "ok" : "warn";
  const xDetail =
    daysSinceLaunch >= 14
      ? `Account aged ${daysSinceLaunch}d — cleared to post`
      : `Account ${daysSinceLaunch}/14d aged — wait before first post`;

  const checks: CheckItem[] = [
    { label: "Pipeline ran recently", detail: pipelineDetail, status: pipelineStatus },
    { label: "Subscriber growth", detail: subGrowthDetail, status: subGrowthStatus },
    { label: "Content published", detail: contentDetail, status: contentStatus },
    { label: "Email service (Resend)", detail: emailDetail, status: emailStatus },
    { label: "X account aging", detail: xDetail, status: xStatus },
  ];

  const passCount = checks.filter((c) => c.status === "ok").length;
  const failCount = checks.filter((c) => c.status === "fail").length;

  return { checks, passCount, failCount, totalSubs, weekSubs, totalPublished };
}

const STATUS_ICON: Record<CheckStatus, string> = {
  ok: "✓",
  warn: "⚠",
  fail: "✗",
  unknown: "?",
};

const STATUS_COLOR: Record<CheckStatus, string> = {
  ok: "#22C55E",
  warn: "#F59E0B",
  fail: "#EF4444",
  unknown: "#787878",
};

export default async function OperatorChecklistPage() {
  const { checks, passCount, failCount, totalSubs, weekSubs, totalPublished } =
    await getChecklistData();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const allClear = failCount === 0;

  return (
    <div className="text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#555" }}>
            {today}
          </p>
          <h1 className="text-xl font-semibold tracking-tight">
            Morning Checklist
          </h1>
          <p className="text-sm mt-1" style={{ color: "#787878" }}>
            {passCount}/{checks.length} items clear
            {failCount > 0 && (
              <span style={{ color: "#EF4444" }}>
                {" "}&middot; {failCount} issue{failCount !== 1 ? "s" : ""} need attention
              </span>
            )}
          </p>
        </div>

        {/* Overall status banner */}
        <div
          className="rounded-xl border px-5 py-4 mb-8 flex items-center gap-3"
          style={{
            background: allClear ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
            borderColor: allClear ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
          }}
        >
          <span
            className="text-xl font-bold"
            style={{ color: allClear ? "#22C55E" : "#EF4444" }}
          >
            {allClear ? "✓" : "✗"}
          </span>
          <p
            className="text-sm font-medium"
            style={{ color: allClear ? "#22C55E" : "#EF4444" }}
          >
            {allClear
              ? "All clear — ClusterDesk is operating normally"
              : `${failCount} item${failCount !== 1 ? "s" : ""} require your attention`}
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-2 mb-10">
          {checks.map((check) => (
            <div
              key={check.label}
              className="rounded-xl border px-4 py-4 flex items-start gap-4"
              style={{ borderColor: "#1a1a1a", background: "#0f0f0f" }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                style={{
                  background: `${STATUS_COLOR[check.status]}1a`,
                  color: STATUS_COLOR[check.status],
                }}
              >
                {STATUS_ICON[check.status]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{check.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "#666" }}>
                  {check.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "#1a1a1a", background: "#0f0f0f" }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: "#555" }}
          >
            At a glance
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total subscribers", value: totalSubs },
              { label: "New this week", value: weekSubs },
              { label: "Clusters published", value: totalPublished },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold tabular-nums">{value}</p>
                <p className="text-xs mt-0.5" style={{ color: "#555" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
