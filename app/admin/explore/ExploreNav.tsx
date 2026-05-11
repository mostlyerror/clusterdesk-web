"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const V1_DESIGNS = [
  { slug: "activity-feed", name: "Activity Feed" },
  { slug: "growth", name: "Growth" },
  { slug: "mission-control", name: "Mission Control" },
  { slug: "levers-knobs", name: "Levers & Knobs" },
  { slug: "deep-clusters", name: "Deep Clusters" },
  { slug: "operator-checklist", name: "Operator Checklist" },
  { slug: "architecture-map", name: "Architecture Map" },
  { slug: "solopreneur-briefing", name: "Solopreneur Briefing" },
];

const V2_DESIGNS = [
  { slug: "v2/war-room", name: "War Room" },
  { slug: "v2/commander", name: "Commander" },
  { slug: "v2/daily-driver", name: "Daily Driver" },
  { slug: "v2/notebook", name: "Notebook" },
  { slug: "v2/cockpit", name: "Cockpit" },
  { slug: "v2/field-report", name: "Field Report" },
  { slug: "v2/ops-log", name: "Ops Log" },
  { slug: "v2/dashboard-pro", name: "Dashboard Pro" },
];

function NavPill({
  slug,
  name,
  active,
}: {
  slug: string;
  name: string;
  active: boolean;
}) {
  return (
    <Link
      href={`/admin/explore/${slug}`}
      className="text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition-all flex-shrink-0"
      style={{
        background: active ? "#22C55E" : "transparent",
        color: active ? "#0a0a0a" : "#666",
        fontWeight: active ? 600 : 400,
      }}
    >
      {name}
    </Link>
  );
}

export default function ExploreNav() {
  const pathname = usePathname();
  const isV2 = pathname.includes("/admin/explore/v2/");
  const isV1 =
    !isV2 &&
    pathname !== "/admin/explore" &&
    pathname.startsWith("/admin/explore/");

  return (
    <div
      style={{ background: "#070707", borderBottom: "1px solid #1a1a1a" }}
      className="sticky top-0 z-40"
    >
      {/* Top row: Gallery link + version labels */}
      <div className="max-w-6xl mx-auto px-4 pt-2 flex items-center gap-4">
        <Link
          href="/admin/explore"
          className="text-xs font-medium flex-shrink-0 transition-colors hover:text-white"
          style={{
            color: pathname === "/admin/explore" ? "#fff" : "#444",
          }}
        >
          ⊞ Gallery
        </Link>
        <span style={{ color: "#222" }} className="flex-shrink-0 text-xs">
          /
        </span>
        <span
          className="text-[10px] uppercase tracking-widest flex-shrink-0"
          style={{ color: isV1 ? "#22C55E" : "#333" }}
        >
          v1
        </span>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-2">
          {V1_DESIGNS.map((d) => (
            <NavPill
              key={d.slug}
              slug={d.slug}
              name={d.name}
              active={pathname === `/admin/explore/${d.slug}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom row: v2 designs */}
      <div className="max-w-6xl mx-auto px-4 pb-2 flex items-center gap-4">
        <span className="text-xs font-medium flex-shrink-0" style={{ color: "#444" }}>
          ⊞
        </span>
        <span className="text-[10px]" style={{ color: "#222" }}>/</span>
        <span
          className="text-[10px] uppercase tracking-widest flex-shrink-0"
          style={{ color: isV2 ? "#22C55E" : "#333" }}
        >
          v2
        </span>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {V2_DESIGNS.map((d) => (
            <NavPill
              key={d.slug}
              slug={d.slug}
              name={d.name}
              active={pathname === `/admin/explore/${d.slug}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
