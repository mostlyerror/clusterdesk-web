export interface FilingRecord {
  insider_name: string;
  insider_title: string;
  trade_date: string;
  trade_value_usd: number;
  shares: number;
  price_per_share: number;
  filing_url: string;
}

export interface ClusterPayload {
  ticker: string;
  company_name: string;
  market_cap_usd: number;
  cluster_start_date: string;
  cluster_end_date: string;
  insider_count: number;
  total_value_usd: number;
  roles: string[];
  score: number;
  filings: FilingRecord[];
}

export interface TickerPageRow {
  ticker: string;
  cluster_date: string;
  payload: ClusterPayload;
  score: number;
  published_at: string;
}

export interface ClusterRow {
  id: number;
  ticker: string;
  cluster_start_date: string;
  cluster_end_date: string;
  insider_count: number;
  total_value_usd: number;
  market_cap_usd: number;
  score: number;
  payload: ClusterPayload;
  published_at: string;
  twitter_post_id: string | null;
}

// Minimal Database type for createClient generic
export interface Database {
  public: {
    Tables: {
      ticker_pages: { Row: TickerPageRow };
      clusters: { Row: ClusterRow };
    };
  };
}
