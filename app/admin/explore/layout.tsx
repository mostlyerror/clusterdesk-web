import ExploreNav from "./ExploreNav";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <ExploreNav />
      {children}
    </div>
  );
}
