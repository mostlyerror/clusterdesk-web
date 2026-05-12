import Link from "next/link";

export function NavBar() {
  return (
    <nav style={{ borderBottom: "1px solid #E8E8E4", background: "#FAFAF8" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              letterSpacing: "-0.02em",
              color: "#1A1A1A",
              textDecoration: "none",
            }}
          >
            ClusterDesk
          </Link>
          <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
            {[
              { href: "/weekly", label: "Weekly" },
              { href: "/about", label: "About" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#9A9A9A",
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
