import Link from "next/link";

const DESIGNS = [
  { slug: "financial-terminal", name: "Financial Terminal", desc: "Bloomberg amber — monospace, dense, trading-floor energy." },
  { slug: "editorial", name: "Editorial", desc: "Financial Times broadsheet — serif hierarchy, salmon warmth." },
  { slug: "brutalist", name: "Brutalist", desc: "Swiss brutalism — raw black borders, oversized type, no mercy." },
  { slug: "luxury", name: "Luxury", desc: "Goldman Sachs internal — cream, gold, Cormorant Garamond." },
  { slug: "retro-crt", name: "Retro CRT", desc: "1988 terminal — phosphor green, scanlines, glow." },
  { slug: "art-deco", name: "Art Deco", desc: "Great Gatsby meets Wall Street — gold chevrons, deep navy." },
  { slug: "tactical", name: "Tactical", desc: "Classified briefing — olive drab, stencil, TOP SECRET stamps." },
  { slug: "glassmorphism", name: "Glassmorphism", desc: "2028 OS — frosted glass, deep space gradient, neon accents." },
  { slug: "newsprint", name: "Newsprint", desc: "Morning broadsheet — ink on newsprint, column rules, bylines." },
  { slug: "neon-noir", name: "Neon Noir", desc: "Blade Runner x Wall Street — neon pink, cyan, deep black." },
];

export default function ExploreGallery() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-2">Design Explorations — Round 3</h1>
        <p className="text-[#787878] text-sm">10 full visual overhauls. Click any to preview.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {DESIGNS.map((d, i) => (
          <Link
            key={d.slug}
            href={`/explore/${d.slug}`}
            className="group block rounded-xl border p-5 transition-all hover:border-[#333]"
            style={{ borderColor: "#1a1a1a", background: "#0f0f0f" }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs tabular-nums" style={{ color: "#333" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold group-hover:text-white transition-colors">
                  {d.name}
                </span>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: "#333" }}>→</span>
            </div>
            <p className="text-sm" style={{ color: "#555" }}>{d.desc}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 pt-6 border-t border-[#1a1a1a]">
        <Link href="/admin/explore" className="text-xs text-[#444] hover:text-white transition-colors">
          ← Admin design gallery
        </Link>
      </div>
    </div>
  );
}
