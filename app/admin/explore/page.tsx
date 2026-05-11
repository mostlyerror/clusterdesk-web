import Link from "next/link";

const V1_DESIGNS = [
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
    desc: "Monospace subsystem status board with traffic-light indicators.",
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
    desc: "Quality-review cards with score bars and full insider filing detail.",
    tags: ["clusters", "review"],
  },
  {
    slug: "operator-checklist",
    name: "Operator Checklist",
    desc: "Morning checklist: pipeline ran, subscribers growing, services healthy.",
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

const V2_DESIGNS = [
  {
    slug: "v2/war-room",
    name: "War Room",
    desc: "Everything above the fold. Dense status grid with glowing indicators. Actions embedded inline with each subsystem.",
    tags: ["dense", "no-scroll"],
  },
  {
    slug: "v2/commander",
    name: "Commander",
    desc: "Split-pane IDE layout. Left: status + checklist + actions. Right: live activity feed. Independent scroll.",
    tags: ["split-pane", "feed"],
  },
  {
    slug: "v2/daily-driver",
    name: "Daily Driver",
    desc: "Opens with what needs attention NOW. Checklist first, warm conversational tone, KPI strip, toolbox at bottom.",
    tags: ["checklist-first", "friendly"],
  },
  {
    slug: "v2/notebook",
    name: "Notebook",
    desc: "Written handoff document. Prose status sentences, collapsible context blocks, inline actions.",
    tags: ["document", "prose"],
  },
  {
    slug: "v2/cockpit",
    name: "Cockpit",
    desc: "Bloomberg terminal density. Monospace throughout, all metrics above the fold, title-attribute tooltips.",
    tags: ["dense", "monospace"],
  },
  {
    slug: "v2/field-report",
    name: "Field Report",
    desc: "Memo format with a dynamically generated opening paragraph assembled from live data.",
    tags: ["narrative", "memo"],
  },
  {
    slug: "v2/ops-log",
    name: "Ops Log",
    desc: "Running log format. Every status check and activity event is a timestamped [LEVEL] log entry.",
    tags: ["log", "monospace"],
  },
  {
    slug: "v2/dashboard-pro",
    name: "Dashboard Pro",
    desc: "Sidebar navigation with 5 sections: Overview, Activity, Checklist, Actions, Systems.",
    tags: ["sidebar-nav", "sections"],
  },
];

function DesignCard({
  slug,
  name,
  desc,
  tags,
  index,
  version,
}: {
  slug: string;
  name: string;
  desc: string;
  tags: string[];
  index: number;
  version: "v1" | "v2";
}) {
  return (
    <Link
      href={`/admin/explore/${slug}`}
      className="group block rounded-xl border p-5 transition-all hover:border-[#333]"
      style={{ borderColor: "#1a1a1a", background: "#0f0f0f" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="text-xs tabular-nums"
            style={{ color: version === "v2" ? "#22C55E33" : "#333" }}
          >
            {version === "v2" ? "v2·" : ""}{String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold group-hover:text-white transition-colors">
            {name}
          </span>
        </div>
        <span className="text-xs flex-shrink-0 transition-colors" style={{ color: "#333" }}>
          →
        </span>
      </div>
      <p className="text-sm mb-4" style={{ color: "#666" }}>
        {desc}
      </p>
      <div className="flex gap-1.5 flex-wrap">
        {tags.map((tag) => (
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
  );
}

export default function ExplorePage() {
  return (
    <div className="text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Admin Design Gallery
          </h1>
          <p className="text-sm" style={{ color: "#787878" }}>
            16 designs across two rounds of exploration. Click any to preview.
          </p>
        </div>

        {/* V2 — consolidated designs */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#22C55E" }}>
              Round 2
            </h2>
            <span className="text-xs" style={{ color: "#555" }}>
              consolidated — mission control + explanations + actions + feed
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {V2_DESIGNS.map((d, i) => (
              <DesignCard key={d.slug} {...d} index={i} version="v2" />
            ))}
          </div>
        </div>

        {/* V1 — original explorations */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#555" }}>
              Round 1
            </h2>
            <span className="text-xs" style={{ color: "#444" }}>
              initial parallel exploration — single-focus designs
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {V1_DESIGNS.map((d, i) => (
              <DesignCard key={d.slug} {...d} index={i} version="v1" />
            ))}
          </div>
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
