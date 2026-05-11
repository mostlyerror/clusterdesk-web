import { createAdminClient } from "@/lib/supabase-server";

export const revalidate = 0;

type FeedEvent =
  | {
      kind: "publish";
      timestamp: string;
      ticker: string;
      companyName: string;
      score: number;
    }
  | {
      kind: "subscriber";
      timestamp: string;
      email: string;
      signupSource: string | null;
    };

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function isThisWeek(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() < 7 * 24 * 60 * 60 * 1000;
}

async function getFeedEvents(): Promise<{
  events: FeedEvent[];
  weekCount: number;
}> {
  const db = createAdminClient();

  const [clustersRes, subscribersRes] = await Promise.all([
    db
      .from("clusters")
      .select("ticker, score, published_at, payload")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(100),
    db
      .from("email_subscribers")
      .select("email, signup_source, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const events: FeedEvent[] = [];

  for (const row of clustersRes.data ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = row.payload as any;
    events.push({
      kind: "publish",
      timestamp: row.published_at as string,
      ticker: row.ticker as string,
      companyName:
        typeof payload?.company_name === "string"
          ? payload.company_name
          : row.ticker,
      score: typeof row.score === "number" ? row.score : Number(row.score ?? 0),
    });
  }

  for (const row of subscribersRes.data ?? []) {
    events.push({
      kind: "subscriber",
      timestamp: row.created_at as string,
      email: row.email as string,
      signupSource: (row.signup_source as string | null) ?? null,
    });
  }

  events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const weekCount = events.filter((e) => isThisWeek(e.timestamp)).length;

  return { events, weekCount };
}

export default async function ActivityFeedPage() {
  const { events, weekCount } = await getFeedEvents();

  return (
    <div className="text-white">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight">
            Activity Feed
          </h1>
          <p className="text-sm mt-1" style={{ color: "#787878" }}>
            {weekCount === 0
              ? "No events this week"
              : `${weekCount} event${weekCount === 1 ? "" : "s"} this week`}
          </p>
        </div>

        {events.length === 0 ? (
          <p className="text-sm" style={{ color: "#787878" }}>
            No events yet.
          </p>
        ) : (
          <ol className="relative">
            {events.map((event, i) => (
              <li
                key={`${event.kind}-${event.timestamp}-${i}`}
                className="flex gap-4 mb-0"
              >
                <div
                  className="flex flex-col items-center"
                  style={{ width: 24, flexShrink: 0 }}
                >
                  <div
                    className="rounded-full mt-1 flex-shrink-0"
                    style={{
                      width: 8,
                      height: 8,
                      background:
                        event.kind === "publish" ? "#22C55E" : "#3B82F6",
                    }}
                  />
                  {i < events.length - 1 && (
                    <div
                      className="flex-1"
                      style={{
                        width: 1,
                        background: "#1f1f1f",
                        marginTop: 4,
                        minHeight: 32,
                      }}
                    />
                  )}
                </div>

                <div className="pb-6 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      {event.kind === "publish" ? (
                        <>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-xs font-medium uppercase tracking-wide px-1.5 py-0.5 rounded"
                              style={{
                                background: "rgba(34,197,94,0.12)",
                                color: "#22C55E",
                              }}
                            >
                              Published
                            </span>
                            <a
                              href={`/buys/${event.ticker}`}
                              className="font-mono text-sm font-semibold hover:underline"
                              style={{ color: "#22C55E" }}
                            >
                              {event.ticker}
                            </a>
                          </div>
                          <p
                            className="text-sm mt-0.5"
                            style={{ color: "#ccc" }}
                          >
                            {event.companyName} &middot; score{" "}
                            <span className="font-medium text-white">
                              {event.score}
                            </span>
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-xs font-medium uppercase tracking-wide px-1.5 py-0.5 rounded"
                              style={{
                                background: "rgba(59,130,246,0.12)",
                                color: "#3B82F6",
                              }}
                            >
                              Subscriber
                            </span>
                          </div>
                          <p
                            className="text-sm mt-0.5"
                            style={{ color: "#ccc" }}
                          >
                            New signup
                            {event.signupSource
                              ? ` from ${event.signupSource}`
                              : ""}{" "}
                            &middot;{" "}
                            <span style={{ color: "#787878" }}>
                              {event.email}
                            </span>
                          </p>
                        </>
                      )}
                    </div>
                    <span
                      className="text-xs flex-shrink-0 tabular-nums"
                      style={{ color: "#787878" }}
                    >
                      {relativeTime(event.timestamp)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
