import { createAdminClient } from "@/lib/supabase-server";

export const revalidate = 0;

function startOfDayUTC(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 86_400_000);
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function getGrowthData() {
  const db = createAdminClient();

  const now = new Date();
  const todayUTC = startOfDayUTC(now);
  const thisWeekStart = addDays(todayUTC, -6);
  const lastWeekStart = addDays(thisWeekStart, -7);
  const thirtyDaysAgo = addDays(todayUTC, -29);

  const [subsAll, clusters30d] = await Promise.all([
    db
      .from("email_subscribers")
      .select("email, signup_source, created_at")
      .order("created_at", { ascending: true }),
    db
      .from("clusters")
      .select("ticker, published_at")
      .not("published_at", "is", null)
      .gte("published_at", thirtyDaysAgo.toISOString())
      .order("published_at", { ascending: true }),
  ]);

  const allSubs = subsAll.data ?? [];
  const allClusters = clusters30d.data ?? [];

  const signupsPerDay: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    signupsPerDay[isoDate(addDays(thirtyDaysAgo, i))] = 0;
  }
  for (const s of allSubs) {
    const d = isoDate(new Date(s.created_at));
    if (d in signupsPerDay) signupsPerDay[d] = (signupsPerDay[d] ?? 0) + 1;
  }
  const sparklineDays = Object.entries(signupsPerDay).map(([date, count]) => ({
    date,
    count,
  }));

  const sourceCounts: Record<string, number> = {};
  for (const s of allSubs) {
    const src = (s.signup_source as string | null) ?? "unknown";
    sourceCounts[src] = (sourceCounts[src] ?? 0) + 1;
  }
  const totalSubs = allSubs.length;

  const thisWeekSubs = allSubs.filter(
    (s) =>
      new Date(s.created_at) >= thisWeekStart &&
      new Date(s.created_at) < addDays(todayUTC, 1)
  ).length;
  const lastWeekSubs = allSubs.filter(
    (s) =>
      new Date(s.created_at) >= lastWeekStart &&
      new Date(s.created_at) < thisWeekStart
  ).length;

  const weeksData: { label: string; count: number }[] = [];
  for (let w = 3; w >= 0; w--) {
    const wStart = addDays(thisWeekStart, -w * 7);
    const wEnd = addDays(wStart, 7);
    const count = allClusters.filter(
      (c) =>
        new Date(c.published_at as string) >= wStart &&
        new Date(c.published_at as string) < wEnd
    ).length;
    const label =
      w === 0 ? "This wk" : w === 1 ? "Last wk" : isoDate(wStart).slice(5);
    weeksData.push({ label, count });
  }

  const thisWeekClusters = weeksData[weeksData.length - 1].count;
  const lastWeekClusters = weeksData[weeksData.length - 2].count;

  return {
    totalSubs,
    sparklineDays,
    sourceCounts,
    thisWeekSubs,
    lastWeekSubs,
    thisWeekClusters,
    lastWeekClusters,
    weeksData,
  };
}

export default async function GrowthPage() {
  const {
    totalSubs,
    sparklineDays,
    sourceCounts,
    thisWeekSubs,
    lastWeekSubs,
    thisWeekClusters,
    lastWeekClusters,
    weeksData,
  } = await getGrowthData();

  const sparklineMax = Math.max(...sparklineDays.map((d) => d.count), 1);
  const clusterMax = Math.max(...weeksData.map((w) => w.count), 1);
  const subsDelta = thisWeekSubs - lastWeekSubs;
  const clustersDelta = thisWeekClusters - lastWeekClusters;
  const sourceTotal = Object.values(sourceCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="text-white px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex items-baseline gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Growth</h1>
          <span style={{ color: "#787878" }} className="text-sm">
            trajectory dashboard
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <KPI label="Total subscribers" value={totalSubs} />
          <KPI label="This week subs" value={thisWeekSubs} delta={subsDelta} />
          <KPI
            label="This week clusters"
            value={thisWeekClusters}
            delta={clustersDelta}
          />
          <KPI label="Last week subs" value={lastWeekSubs} />
        </div>

        <section>
          <SectionHeader title="Signups / day" subtitle="last 30 days" />
          <div
            className="border rounded-xl p-5"
            style={{ borderColor: "#1f1f1f", background: "#111" }}
          >
            <div className="flex items-end gap-[3px] h-24">
              {sparklineDays.map((day) => {
                const pct = Math.max(
                  (day.count / sparklineMax) * 100,
                  day.count > 0 ? 4 : 0
                );
                return (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count}`}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${pct}%`,
                      minHeight: day.count > 0 ? "3px" : "1px",
                      background: day.count > 0 ? "#22C55E" : "#1f1f1f",
                      opacity: day.count > 0 ? 1 : 0.4,
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              <span style={{ color: "#787878" }} className="text-xs">
                {sparklineDays[0]?.date}
              </span>
              <span style={{ color: "#787878" }} className="text-xs">
                today
              </span>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader title="Week-over-week" subtitle="current vs previous" />
          <div className="grid grid-cols-2 gap-4">
            <WoWCard
              label="Subscribers"
              thisWeek={thisWeekSubs}
              lastWeek={lastWeekSubs}
            />
            <WoWCard
              label="Clusters published"
              thisWeek={thisWeekClusters}
              lastWeek={lastWeekClusters}
            />
          </div>
        </section>

        <section>
          <SectionHeader title="Clusters / week" subtitle="last 4 weeks" />
          <div
            className="border rounded-xl p-5"
            style={{ borderColor: "#1f1f1f", background: "#111" }}
          >
            <div className="flex items-end gap-6 h-28">
              {weeksData.map((week, i) => {
                const pct = Math.max(
                  (week.count / clusterMax) * 100,
                  week.count > 0 ? 8 : 2
                );
                const isThis = i === weeksData.length - 1;
                return (
                  <div
                    key={week.label}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{ color: isThis ? "#22C55E" : "#e5e5e5" }}
                    >
                      {week.count}
                    </span>
                    <div
                      className="w-full flex items-end justify-center"
                      style={{ height: "80px" }}
                    >
                      <div
                        className="w-full rounded-t-sm"
                        style={{
                          height: `${pct}%`,
                          background: isThis ? "#22C55E" : "#2a2a2a",
                          minHeight: week.count > 0 ? "6px" : "2px",
                        }}
                      />
                    </div>
                    <span
                      style={{ color: "#787878" }}
                      className="text-xs text-center"
                    >
                      {week.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            title="Signup sources"
            subtitle={`${Object.keys(sourceCounts).length} source${Object.keys(sourceCounts).length !== 1 ? "s" : ""}`}
          />
          <div
            className="border rounded-xl p-5 space-y-4"
            style={{ borderColor: "#1f1f1f", background: "#111" }}
          >
            {Object.entries(sourceCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([source, count]) => {
                const pct =
                  sourceTotal > 0
                    ? Math.round((count / sourceTotal) * 100)
                    : 0;
                return (
                  <div key={source}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm capitalize">{source}</span>
                      <span className="text-sm" style={{ color: "#787878" }}>
                        {count} &middot; {pct}%
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{ height: "6px", background: "#1f1f1f" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: "#22C55E" }}
                      />
                    </div>
                  </div>
                );
              })}
            {Object.keys(sourceCounts).length === 0 && (
              <p style={{ color: "#787878" }} className="text-sm">
                No subscribers yet.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function KPI({
  label,
  value,
  delta,
}: {
  label: string;
  value: number;
  delta?: number;
}) {
  return (
    <div
      className="border rounded-xl px-4 py-4"
      style={{ borderColor: "#1f1f1f", background: "#111" }}
    >
      <p className="text-xs mb-1" style={{ color: "#787878" }}>
        {label}
      </p>
      <p className="text-3xl font-bold">{value}</p>
      {delta !== undefined && (
        <p
          className="text-xs mt-1 font-medium"
          style={{
            color: delta > 0 ? "#22C55E" : delta < 0 ? "#ef4444" : "#787878",
          }}
        >
          {delta > 0 ? `↑${delta}` : delta < 0 ? `↓${Math.abs(delta)}` : "→ flat"}{" "}
          vs last week
        </p>
      )}
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      <h2 className="text-base font-semibold">{title}</h2>
      {subtitle && (
        <span className="text-xs" style={{ color: "#787878" }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

function WoWCard({
  label,
  thisWeek,
  lastWeek,
}: {
  label: string;
  thisWeek: number;
  lastWeek: number;
}) {
  const delta = thisWeek - lastWeek;
  const maxVal = Math.max(thisWeek, lastWeek, 1);

  return (
    <div
      className="border rounded-xl p-5"
      style={{ borderColor: "#1f1f1f", background: "#111" }}
    >
      <p className="text-xs mb-4" style={{ color: "#787878" }}>
        {label}
      </p>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: "#22C55E" }}>This week</span>
            <span style={{ color: "#22C55E" }} className="font-semibold">
              {thisWeek}
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: "8px", background: "#1f1f1f" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${(thisWeek / maxVal) * 100}%`,
                background: "#22C55E",
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: "#787878" }}>Last week</span>
            <span style={{ color: "#787878" }} className="font-semibold">
              {lastWeek}
            </span>
          </div>
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: "8px", background: "#1f1f1f" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${(lastWeek / maxVal) * 100}%`,
                background: "#2a2a2a",
              }}
            />
          </div>
        </div>
      </div>

      <p
        className="text-lg font-bold"
        style={{
          color: delta > 0 ? "#22C55E" : delta < 0 ? "#ef4444" : "#787878",
        }}
      >
        {delta > 0 ? `↑ +${delta}` : delta < 0 ? `↓ ${delta}` : "→ flat"}
      </p>
    </div>
  );
}
