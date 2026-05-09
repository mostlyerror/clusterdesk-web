export function Footer() {
  return (
    <footer className="border-t border-[#222222] mt-20 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <p className="text-[#787878] text-xs leading-relaxed">
          ClusterDesk is for informational and educational purposes only. It is not financial
          advice, investment advice, or a recommendation to buy or sell any security. Information
          is derived from publicly available SEC Form 4 filings. Past insider trading patterns
          do not guarantee future stock performance. Always conduct your own research and consult
          a licensed financial advisor before making investment decisions. ClusterDesk is not a
          registered investment adviser. By subscribing or visiting this site, you acknowledge
          these terms.
        </p>
        <p className="text-[#787878] text-xs mt-4">
          © {new Date().getFullYear()} ClusterDesk ·{" "}
          <a href="mailto:hello@clusterdesk.io" className="hover:text-white">
            hello@clusterdesk.io
          </a>
          {" "}·{" "}
          <a href="https://x.com/clusterdesk" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            @clusterdesk
          </a>
        </p>
      </div>
    </footer>
  );
}
