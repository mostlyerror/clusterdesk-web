import { createAdminClient } from "@/lib/supabase-server";
import AdminControls, {
  type ActivityEvent,
  type ChecklistItem,
  type DashboardProProps,
} from "./AdminControls";

export const revalidate = 0;

// ─── Data helpers ─────────────────────────────────────────────────────────────

function computePipelineStatus(
  lastPublishedAt: string | null
): DashboardProProps["pipelineStatus"] {
  if (!lastPublishedAt) return "UNKNOWN";
  const hoursAgo =
    (Date.now() - new Date(lastPublishedAt).getTime()) / 1000 / 3600;
  if (hoursAgo <= 24) return "NOMINAL";
  if (hoursAgo <= 72) return "DEGRADED";
  return "DOWN";
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getDashboardData(): Promise<DashboardProProps> {
  const db = createAdminClient();

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [allSubsRes, newSubsRes, prevSubsRes, totalClustersRes, recentClustersRes, recentSubsRes] = await Promise.all([
    db.from("email_subscribers").select("*", { count: "exact", head: true }),
    db
      .from("email_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", oneWeekAgo.toISOString()),
    db
      .from("email_subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", twoWeeksAgo.toISOString())
      .lt("created_at", oneWeekAgo.toISOString()),
    db
      .from("clusters")
      .select("*", { count: "exact", head: true })
      .not("published_at", "is", null),
    db
      .from("clusters")
      .select("ticker,score,published_at")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(30),
    db
      .from("email_subscribers")
      .select("email,created_at")
      .order("created_at", { ascending: false })
      .limit(30),
  ]);

  const totalSubscribers = allSubsRes.count ?? 0;
  const subsThisWeek = newSubsRes.count ?? 0;
  const subsLastWeek = prevSubsRes.count ?? 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusters = (recentClustersRes.data ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subscribers = (recentSubsRes.data ?? []) as any[];

  const lastPublishedAt: string | null = clusters[0]?.published_at ?? null;
  const status = computePipelineStatus(lastPublishedAt);

  // Build merged activity feed (newest first, max 30)
  const clusterEvents: ActivityEvent[] = clusters.map((c) => ({
    type: "cluster" as const,
    ticker: c.ticker as string,
    score: c.score as number,
    published_at: c.published_at as string,
  }));
  const subEvents: ActivityEvent[] = subscribers.map((s) => ({
    type: "subscriber" as const,
    email: s.email as string,
    created_at: s.created_at as string,
  }));

  const activity: ActivityEvent[] = [...clusterEvents, ...subEvents]
    .sort((a, b) => {
      const aTime = a.type === "cluster" ? a.published_at : a.created_at;
      const bTime = b.type === "cluster" ? b.published_at : b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    })
    .slice(0, 30);

  const resendConfigured = Boolean(process.env.RESEND_API_KEY);
  const hasContent = (recentClustersRes.data ?? []).length > 0;
  const pipelineOk = status === "NOMINAL" || status === "DEGRADED";

  const checklist: ChecklistItem[] = [
    {
      label: "Pipeline ran recently",
      pass: status === "NOMINAL",
      detail:
        status === "NOMINAL"
          ? "Last cluster was published within 24 hours. Pipeline is healthy."
          : status === "DEGRADED"
          ? "Last publish was 1-3 days ago. Check Railway logs — may have been a weekend or holiday."
          : status === "DOWN"
          ? "No publish in 3+ days. Check Railway logs and verify DRY_RUN=false in env vars."
          : "No clusters published yet. Run the pipeline to generate the first cluster.",
    },
    {
      label: "Subscribers are growing",
      pass: subsThisWeek >= subsLastWeek || totalSubscribers > 0,
      detail:
        subsThisWeek >= subsLastWeek
          ? `${subsThisWeek} new subscribers this week vs ${subsLastWeek} last week. Growth looks healthy.`
          : `${subsThisWeek} this week vs ${subsLastWeek} last week — growth slowed. Consider a marketing push or check the signup form.`,
    },
    {
      label: "Content is live",
      pass: hasContent,
      detail: hasContent
        ? `Clusters are published and live on the site.`
        : "No clusters published yet. The /buys page will be empty until the pipeline runs.",
    },
    {
      label: "Email (Resend) configured",
      pass: resendConfigured,
      detail: resendConfigured
        ? "RESEND_API_KEY is set in the environment. Welcome emails should be sending."
        : "RESEND_API_KEY is missing. Welcome emails are silently failing. Add the key to Vercel environment variables.",
    },
    {
      label: "Pipeline has run at all",
      pass: pipelineOk || hasContent,
      detail:
        pipelineOk || hasContent
          ? "The worker has run at least once and published data to Supabase."
          : "No evidence the pipeline has ever run. Verify Railway is deployed and scheduled. Check the SUPABASE_SERVICE_ROLE_KEY and DRY_RUN env vars in Railway.",
    },
  ];

  return {
    totalSubscribers,
    subsThisWeek,
    subsLastWeek,
    totalPublished: totalClustersRes.count ?? 0,
    lastPublishedAt,
    pipelineStatus: status,
    activity,
    checklist,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  const data = await getDashboardData();
  return <AdminControls {...data} />;
}
