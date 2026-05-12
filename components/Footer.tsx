export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #1A1A1A", marginTop: 80 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 48, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#9A9A9A", letterSpacing: "0.04em" }}>
          © {new Date().getFullYear()} ClusterDesk ·{" "}
          <a href="mailto:hello@clusterdesk.io" style={{ color: "#9A9A9A" }}>hello@clusterdesk.io</a>
          {" "}·{" "}
          <a href="https://x.com/clusterdesk" target="_blank" rel="noopener noreferrer" style={{ color: "#9A9A9A" }}>@clusterdesk</a>
        </span>
        <p style={{ fontSize: 11, color: "#9A9A9A", maxWidth: 480, textAlign: "right", lineHeight: 1.6 }}>
          Not investment advice. All data sourced from publicly available SEC Form 4 filings.
          Past insider activity does not guarantee future returns.
        </p>
      </div>
    </footer>
  );
}
