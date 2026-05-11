"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DESIGNS = [
  { slug: "activity-feed", name: "Activity Feed" },
  { slug: "growth", name: "Growth" },
  { slug: "mission-control", name: "Mission Control" },
  { slug: "levers-knobs", name: "Levers & Knobs" },
  { slug: "deep-clusters", name: "Deep Clusters" },
  { slug: "operator-checklist", name: "Operator Checklist" },
  { slug: "architecture-map", name: "Architecture Map" },
  { slug: "solopreneur-briefing", name: "Solopreneur Briefing" },
];

export default function ExploreNav() {
  const pathname = usePathname();

  return (
    <div
      style={{ background: "#070707", borderBottom: "1px solid #1a1a1a" }}
      className="sticky top-0 z-40"
    >
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3 overflow-x-auto scrollbar-none">
        <Link
          href="/admin/explore"
          className="text-xs font-medium flex-shrink-0 transition-colors hover:text-white"
          style={{ color: pathname === "/admin/explore" ? "#fff" : "#555" }}
        >
          ⊞ Gallery
        </Link>
        <span style={{ color: "#222" }} className="flex-shrink-0">
          /
        </span>
        <div className="flex items-center gap-1.5">
          {DESIGNS.map((d) => {
            const isActive = pathname === `/admin/explore/${d.slug}`;
            return (
              <Link
                key={d.slug}
                href={`/admin/explore/${d.slug}`}
                className="text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition-all"
                style={{
                  background: isActive ? "#22C55E" : "transparent",
                  color: isActive ? "#0a0a0a" : "#666",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {d.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
