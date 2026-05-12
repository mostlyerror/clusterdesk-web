import Link from "next/link";

const ROUND_3 = [
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

const ROUND_4 = [
  { slug: "scandinavian", name: "Scandinavian", desc: "Nordic minimalism — bone white, muted sage, clean geometry." },
  { slug: "memphis", name: "Memphis", desc: "1980s Memphis Group — squiggles, triangles, pastel chaos." },
  { slug: "constructivist", name: "Constructivist", desc: "Soviet propaganda poster — red, black, diagonal type, bold diagonals." },
  { slug: "dark-academic", name: "Dark Academic", desc: "Oxford library — mahogany, candlelight, leather-bound intelligence." },
  { slug: "sports", name: "Sports Broadcast", desc: "ESPN bottom-third — team colors, scoreboard, live ticker." },
  { slug: "vaporwave", name: "Vaporwave", desc: "1995 internet — magenta gradients, grid floors, glitch nostalgia." },
  { slug: "swiss", name: "Swiss / Helvetica", desc: "International Style — pure grid, Helvetica, mathematical precision." },
  { slug: "bauhaus", name: "Bauhaus", desc: "Weimar geometry — primary colors, circles, triangles, squares." },
  { slug: "noir-film", name: "Noir Film", desc: "1940s detective noir — high contrast, shadows, venetian blinds." },
  { slug: "stock-certificate", name: "Stock Certificate", desc: "Vintage engraved certificate — guilloché borders, wax seals, Cinzel." },
  { slug: "racing", name: "Racing / F1", desc: "Formula 1 telemetry — carbon fiber, rev counters, checkered flags." },
  { slug: "deep-sea", name: "Deep Sea", desc: "Bioluminescent depths — midnight blue, teal glow, sonar rings." },
  { slug: "steampunk", name: "Steampunk", desc: "Victorian brass gears — pressure gauges, rivets, copper pipes." },
  { slug: "academic-paper", name: "Academic Paper", desc: "SSRN preprint — two-column layout, footnotes, citation style." },
  { slug: "grunge", name: "Grunge Zine", desc: "1994 xeroxed zine — rotated cards, ransom note type, rubber stamps." },
  { slug: "web3", name: "Web3 / DeFi", desc: "Crypto protocol — gradient purple, wallet connect, TVL metrics." },
  { slug: "manga", name: "Manga / Comic", desc: "Shonen battle manga — halftone dots, speed lines, power levels." },
  { slug: "hacker", name: "Hacker / Darknet", desc: "Tor browser aesthetic — pure monospace, zero decoration, PGP sigs." },
  { slug: "victorian", name: "Victorian Gazette", desc: "1888 penny press — mahogany, gaslit, Caveat Emptor in Gothic type." },
  { slug: "saas", name: "Modern SaaS", desc: "Y Combinator startup — gradient blobs, command palette, social proof." },
];

function DesignGrid({ designs, offset = 0 }: { designs: typeof ROUND_3; offset?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {designs.map((d, i) => (
        <Link
          key={d.slug}
          href={`/explore/${d.slug}`}
          className="group block rounded-xl border p-5 transition-all hover:border-[#333]"
          style={{ borderColor: "#1a1a1a", background: "#0f0f0f" }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs tabular-nums" style={{ color: "#333" }}>
                {String(offset + i + 1).padStart(2, "0")}
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
  );
}

export default function ExploreGallery() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-2">Design Explorations</h1>
        <p className="text-[#787878] text-sm">30 full visual overhauls. Click any to preview.</p>
      </div>

      <div className="mb-2">
        <p className="text-xs font-medium mb-4" style={{ color: "#444" }}>Round 3 — 10 designs</p>
        <DesignGrid designs={ROUND_3} offset={0} />
      </div>

      <div className="mt-10 mb-2">
        <p className="text-xs font-medium mb-4" style={{ color: "#444" }}>Round 4 — 20 designs</p>
        <DesignGrid designs={ROUND_4} offset={10} />
      </div>

      <div className="mt-10 pt-6 border-t border-[#1a1a1a]">
        <Link href="/admin/explore" className="text-xs text-[#444] hover:text-white transition-colors">
          ← Admin design gallery
        </Link>
      </div>
    </div>
  );
}
