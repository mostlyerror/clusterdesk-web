import { createClient } from "@supabase/supabase-js";

// Full schema manifest — update this when migrations add new tables or columns.
const REQUIRED_SCHEMA = {
  filings: [
    "id", "filing_date", "trade_date", "ticker", "company_name",
    "insider_name", "insider_title", "transaction_code", "shares",
    "price_per_share", "trade_value_usd", "filing_url", "raw_payload", "scraped_at",
    "is_10b5_1",
  ],
  clusters: [
    "id", "ticker", "cluster_start_date", "cluster_end_date", "insider_count",
    "total_value_usd", "market_cap_usd", "score", "payload",
    "detected_at", "published_at", "twitter_post_id",
  ],
  ticker_pages: ["ticker", "cluster_date", "payload", "score", "published_at"],
  email_subscribers: [
    "id", "email", "signup_source", "loops_synced", "created_at",
    "signup_ticker", "signup_campaign", "signup_variant", "signup_referrer",
  ],
  market_cap_cache: ["ticker", "market_cap_usd", "fetched_at"],
};

if (process.env.SKIP_DB_PREFLIGHT === "1") {
  console.log("[preflight-db] skipped because SKIP_DB_PREFLIGHT=1");
  process.exit(0);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "[preflight-db] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Set both in the build environment, or set SKIP_DB_PREFLIGHT=1 for local-only builds."
  );
  process.exit(1);
}

const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let failed = false;

for (const [table, columns] of Object.entries(REQUIRED_SCHEMA)) {
  const { error } = await db
    .from(table)
    .select(columns.join(","), { count: "exact", head: true });

  if (error) {
    console.error(`[preflight-db] Table "${table}" schema check failed: ${error.message}`);
    failed = true;
  }
}

if (failed) {
  console.error("[preflight-db] Run `make db-migrate` before deploying.");
  process.exit(1);
}

const totalColumns = Object.values(REQUIRED_SCHEMA).flat().length;
console.log(`[preflight-db] Schema check passed (${Object.keys(REQUIRED_SCHEMA).length} tables, ${totalColumns} columns).`);
