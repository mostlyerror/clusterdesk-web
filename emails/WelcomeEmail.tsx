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

export function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Every weekday morning, we surface high-conviction insider cluster buys.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>You&apos;re on the list.</Heading>
          <Text style={text}>
            Every weekday morning, ClusterDesk surfaces high-conviction insider
            cluster buys in U.S. micro-cap stocks — companies where multiple
            insiders bought within days of each other.
          </Text>
          <Text style={text}>
            We score each cluster on conviction, insider seniority, and trade
            size. Only the strongest signals make the cut.
          </Text>
          <Text style={text}>
            Follow along on{" "}
            <Link href="https://x.com/clusterdesk" style={link}>
              @clusterdesk
            </Link>{" "}
            for daily alerts, or visit{" "}
            <Link href="https://clusterdesk.io" style={link}>
              clusterdesk.io
            </Link>{" "}
            to browse past picks.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            ClusterDesk · For informational purposes only, not financial advice.
            <br />
            <Link href="https://clusterdesk.io" style={footerLink}>
              clusterdesk.io
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;

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
  margin: "0 0 24px",
};

const text = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#444444",
  margin: "0 0 16px",
};

const link = {
  color: "#16a34a",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "32px 0 24px",
};

const footer = {
  fontSize: "12px",
  color: "#888888",
  lineHeight: "1.5",
};

const footerLink = {
  color: "#888888",
};
