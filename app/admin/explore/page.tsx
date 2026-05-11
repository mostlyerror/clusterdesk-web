import Link from "next/link";

const DESIGNS = [
  {
    slug: "activity-feed",
    name: "Activity Feed",
    desc: "Chronological timeline of every publish and subscriber signup, with relative timestamps.",
    tags: ["observability", "timeline"],
  },
  {
    slug: "growth",
    name: "Growth",
    desc: "30-day signup sparkline, week-over-week comparisons, and signup source breakdown.",
    tags: ["growth", "charts"],
  },
  {
    slug: "mission-control",
    name: "Mission Control",
    desc: "Monospace subsystem status board with traffic-light indicators for pipeline, subscribers, web, and email.",
    tags: ["status", "ops"],
  },
  {
    slug: "levers-knobs",
    name: "Levers & Knobs",
    desc: "Action-first control panel: purge test data, send test welcome email, revalidate cache.",
    tags: ["actions", "tools"],
  },
  {
    slug: "deep-clusters",
    name: "Deep Clusters",
    desc: "Quality-review cards with score bars and full insider filing detail for every published cluster.",
    tags: ["clusters", "review"],
  },
  {
    slug: "operator-checklist",
    name: "Operator Checklist",
    desc: "Morning checklist: pipeline ran, cluster published, subscribers growing, services healthy.",
    tags: ["checklist", "ops"],
  },
  {
    slug: "architecture-map",
    name: "Architecture Map",
    desc: "Live pipeline flow diagram from OpenInsider scrape to X post, email, and ticker page.",
    tags: ["architecture", "pipeline"],
  },
  {
    slug: "solopreneur-briefing",
    name: "Solopreneur Briefing",
    desc: "Personal daily briefing: your numbers, what went out this week, action items.",
    tags: ["briefing", "personal"],
  },
];

export default function ExplorePage() {
  return (
    <div className="text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Admin Design Gallery
          </h1>
          <p className="text-sm" style={{ color: "#787878" }}>
            8 different angles on the same data. Click any to preview.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DESIGNS.map((d, i) => (
            <Link
              key={d.slug}
              href={`/admin/explore/${d.slug}`}
              className="group block rounded-xl border p-5 transition-all hover:border-[#333]"
              style={{ borderColor: "#1a1a1a", background: "#0f0f0f" }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span
                    className="text-xs tabular-nums mr-2"
                    style={{ color: "#333" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold group-hover:text-white transition-colors">
                    {d.name}
                  </span>
                </div>
                <span
                  className="text-xs transition-colors"
                  style={{ color: "#333" }}
                >
                  →
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: "#666" }}>
                {d.desc}
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {d.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ background: "#1a1a1a", color: "#555" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t" style={{ borderColor: "#1a1a1a" }}>
          <Link
            href="/admin"
            className="text-xs transition-colors hover:text-white"
            style={{ color: "#555" }}
          >
            ← Back to admin
          </Link>
        </div>
      </div>
    </div>
  );
}
