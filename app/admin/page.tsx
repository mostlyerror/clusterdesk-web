import { createAdminClient } from "@/lib/supabase-server";

export const revalidate = 0;

const LINKS = [
  { label: "Railway", desc: "Cron logs + env vars", href: "https://railway.app" },
  { label: "Vercel", desc: "Web deploys + function logs", href: "https://vercel.com" },
  { label: "Supabase", desc: "Database + queries", href: "https://supabase.com" },
  { label: "Resend", desc: "Email delivery logs", href: "https://resend.com" },
  { label: "GitHub (web)", desc: "clusterdesk-web", href: "https://github.com/mostlyerror/clusterdesk-web" },
  { label: "GitHub (worker)", desc: "clusterdesk-worker", href: "https://github.com/mostlyerror/clusterdesk-worker" },
  { label: "X / Twitter", desc: "@clusterdesk", href: "https://x.com/clusterdesk" },
];

async function getStats() {
  const db = createAdminClient();

  const [subscribersRes, clustersRes, weekRes] = await Promise.all([
    db.from("email_subscribers").select("*", { count: "exact", head: true }),
    db.from("clusters").select("*", { count: "exact", head: true }).not("published_at", "is", null),
    db.from("clusters")
      .select("ticker,company_name:payload->company_name,score,published_at,twitter_post_id")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(10),
  ]);

  return {
    subscriberCount: subscribersRes.count ?? 0,
    totalPublished: clustersRes.count ?? 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentClusters: (weekRes.data ?? []) as any[],
  };
}

export default async function AdminPage() {
  const { subscriberCount, totalPublished, recentClusters } = await getStats();
  const lastPublished = recentClusters[0]?.published_at;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">ClusterDesk Admin</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <Stat label="Subscribers" value={subscriberCount} />
        <Stat label="Clusters published" value={totalPublished} />
        <Stat
          label="Last published"
          value={lastPublished ? new Date(lastPublished).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
        />
      </div>

      {/* Recent clusters */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Recent clusters</h2>
        <div className="border border-[#222] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#787878] border-b border-[#222] bg-[#111]">
                <th className="text-left px-4 py-3">Ticker</th>
                <th className="text-left px-4 py-3">Company</th>
                <th className="text-left px-4 py-3">Score</th>
                <th className="text-left px-4 py-3">Published</th>
                <th className="text-left px-4 py-3">Links</th>
              </tr>
            </thead>
            <tbody>
              {recentClusters.map((c: Record<string, string | number | null>) => (
                <tr key={`${c.ticker}-${c.published_at}`} className="border-b border-[#1a1a1a] last:border-0">
                  <td className="px-4 py-3 font-mono text-[#22C55E]">
                    <a href={`/buys/${c.ticker}`} className="hover:underline">{String(c.ticker)}</a>
                  </td>
                  <td className="px-4 py-3 text-[#ccc]">{String(c.company_name ?? "")}</td>
                  <td className="px-4 py-3">{String(c.score)}</td>
                  <td className="px-4 py-3 text-[#787878] text-xs">
                    {c.published_at ? new Date(String(c.published_at)).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—"}
                  </td>
                  <td className="px-4 py-3 flex gap-3 text-xs">
                    {c.twitter_post_id && (
                      <a href={`https://x.com/clusterdesk/status/${c.twitter_post_id}`} target="_blank" rel="noopener noreferrer" className="text-[#787878] hover:text-white">X post ↗</a>
                    )}
                  </td>
                </tr>
              ))}
              {recentClusters.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-[#787878]">No clusters published yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick links */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#222] rounded-lg px-4 py-3 hover:border-[#444] transition-colors"
            >
              <p className="font-medium text-sm">{link.label}</p>
              <p className="text-[#787878] text-xs mt-0.5">{link.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-[#222] rounded-lg px-4 py-4">
      <p className="text-[#787878] text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
