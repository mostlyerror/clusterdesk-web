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

export interface EmailSubscriberRow {
  id?: number;
  email: string;
  signup_source: string;
  created_at?: string;
}

// Minimal Database type for createClient generic
export interface Database {
  public: {
    Tables: {
      ticker_pages: {
        Row: TickerPageRow;
        Insert: never;
        Update: never;
        Relationships: [];
      };
      clusters: {
        Row: ClusterRow;
        Insert: never;
        Update: never;
        Relationships: [];
      };
      email_subscribers: {
        Row: EmailSubscriberRow;
        Insert: Omit<EmailSubscriberRow, "id" | "created_at">;
        Update: Partial<EmailSubscriberRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
