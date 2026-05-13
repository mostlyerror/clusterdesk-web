import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface Cluster {
  ticker: string;
  company_name: string;
  score: number;
  insider_count?: number;
  total_value_usd?: number;
  market_cap_usd?: number;
  cluster_start_date?: string;
  cluster_end_date?: string;
  roles?: string[];
}

interface Props {
  clusters?: Cluster[];
  weekOf?: string;
}

const PREVIEW_CLUSTERS: Cluster[] = [
  {
    ticker: "OFIX",
    company_name: "Orthofix Medical Inc",
    score: 74,
    insider_count: 3,
    total_value_usd: 420000,
    market_cap_usd: 490000000,
    cluster_start_date: "2026-05-05",
    cluster_end_date: "2026-05-08",
    roles: ["CEO", "Director"],
  },
  {
    ticker: "HCAT",
    company_name: "Health Catalyst Inc",
    score: 68,
    insider_count: 2,
    total_value_usd: 185000,
    market_cap_usd: 310000000,
    cluster_start_date: "2026-05-06",
    cluster_end_date: "2026-05-07",
    roles: ["CFO", "Director"],
  },
];

export function PreviewProps(): Props {
  return {
    clusters: PREVIEW_CLUSTERS,
    weekOf: "May 12, 2026",
  };
}

export function WeeklyDigestEmail({ clusters = PREVIEW_CLUSTERS, weekOf = "This week" }: Props) {
  return (
    <Html>
      <Head />
      <Preview>Friday&apos;s top insider cluster buys — {weekOf}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Friday&apos;s top insider cluster buys</Heading>
          <Text style={subheading}>{weekOf} · before market open</Text>
          <Text style={intro}>
            Here are this week&apos;s highest-conviction cluster buys — stocks where
            multiple insiders bought with their own money within days of each
            other.
          </Text>
          {clusters.map((cluster) => (
            <div key={cluster.ticker} style={clusterRow}>
              <Link
                href={`https://clusterdesk.io/buys/${cluster.ticker}`}
                style={tickerLink}
              >
                {cluster.ticker}
              </Link>
              <Text style={companyName}>{cluster.company_name}</Text>
              <Text style={reasonText}>{reasonToCare(cluster)}</Text>
              <Text style={scoreText}>Conviction score: {cluster.score}/100</Text>
            </div>
          ))}
          <Hr style={hr} />
          <Text style={disclaimer}>
            For informational and educational purposes only. Not financial
            advice. Past insider trading patterns do not guarantee future
            performance.
          </Text>
          <Text style={footer}>
            <Link href="https://clusterdesk.io" style={footerLink}>
              clusterdesk.io
            </Link>
            {" · "}
            <Link href="https://x.com/clusterdesk" style={footerLink}>
              @clusterdesk
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WeeklyDigestEmail;

const body = {
  backgroundColor: "#ffffff",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "40px 24px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#111111",
  margin: "0 0 4px",
};

const subheading = {
  fontSize: "13px",
  color: "#888888",
  margin: "0 0 24px",
};

const intro = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#444444",
  margin: "0 0 24px",
};

const clusterRow = {
  borderLeft: "3px solid #16a34a",
  paddingLeft: "16px",
  marginBottom: "20px",
};

const tickerLink = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#111111",
  textDecoration: "none",
  display: "block",
};

const companyName = {
  fontSize: "14px",
  color: "#555555",
  margin: "2px 0",
};

const scoreText = {
  fontSize: "13px",
  color: "#16a34a",
  fontWeight: "600",
  margin: "2px 0",
};

const reasonText = {
  fontSize: "13px",
  color: "#444444",
  lineHeight: "1.55",
  margin: "8px 0 2px",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "32px 0 24px",
};

const disclaimer = {
  fontSize: "11px",
  color: "#aaaaaa",
  lineHeight: "1.5",
  margin: "0 0 12px",
};

const footer = {
  fontSize: "12px",
  color: "#888888",
};

const footerLink = {
  color: "#888888",
};

function reasonToCare(cluster: Cluster): string {
  const parts: string[] = [];
  const insiderCount = cluster.insider_count ?? 0;
  const totalValue = cluster.total_value_usd ?? 0;
  const marketCap = cluster.market_cap_usd ?? 0;
  const roles = cluster.roles ?? [];
  const windowDays = getWindowDays(cluster.cluster_start_date, cluster.cluster_end_date);
  const seniorRoles = roles.filter((role) => /CEO|CFO|Chief|President/i.test(role));

  if (insiderCount > 0 && totalValue > 0) {
    parts.push(`${insiderCount} insiders bought ${formatUsd(totalValue)}`);
  }
  if (windowDays !== null) {
    parts.push(`over ${windowDays} day${windowDays === 1 ? "" : "s"}`);
  }
  if (seniorRoles.length > 0) {
    parts.push(`with ${seniorRoles.slice(0, 2).join(" and ")} participation`);
  }
  if (totalValue > 0 && marketCap > 0) {
    parts.push(`${((totalValue / marketCap) * 100).toFixed(2)}% of market cap`);
  }

  return parts.length
    ? `Why it matters: ${parts.join(", ")}.`
    : "Why it matters: multiple insiders bought within the same short window.";
}

function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(value / 1_000)}K`;
}

function getWindowDays(start?: string, end?: string): number | null {
  if (!start || !end) return null;
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) return null;
  return Math.max(1, Math.round((endMs - startMs) / 86_400_000) + 1);
}
