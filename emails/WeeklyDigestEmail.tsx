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
}

interface Props {
  clusters?: Cluster[];
  weekOf?: string;
}

const PREVIEW_CLUSTERS: Cluster[] = [
  { ticker: "OFIX", company_name: "Orthofix Medical Inc", score: 74 },
  { ticker: "HCAT", company_name: "Health Catalyst Inc", score: 68 },
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
      <Preview>This week&apos;s insider cluster buys — {weekOf}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>This week&apos;s cluster buys</Heading>
          <Text style={subheading}>{weekOf}</Text>
          <Text style={intro}>
            Here are this week&apos;s high-conviction insider cluster buys —
            stocks where multiple insiders bought within days of each other.
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
              <Text style={scoreText}>Score: {cluster.score}</Text>
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
