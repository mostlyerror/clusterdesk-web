import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { TickerPageRow } from "@/lib/types";

export const revalidate = 3600;

export async function GET() {
  const { data: pages } = await supabase
    .from("ticker_pages")
    .select("ticker, cluster_date, published_at")
    .order("published_at", { ascending: false }) as {
      data: Pick<TickerPageRow, "ticker" | "cluster_date" | "published_at">[] | null;
    };

  const base = "https://clusterdesk.io";
  const staticPaths = ["/", "/weekly", "/about"];

  const urls = [
    ...staticPaths.map(
      (path) => `
<url>
  <loc>${base}${path}</loc>
  <changefreq>${path === "/" ? "daily" : "weekly"}</changefreq>
</url>`
    ),
    ...(pages ?? []).map(
      (row) => `
<url>
  <loc>${base}/buys/${row.ticker}</loc>
  <lastmod>${row.published_at.split("T")[0]}</lastmod>
  <changefreq>weekly</changefreq>
</url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
