import Link from "next/link";

export function NavBar() {
  return (
    <nav className="border-b border-[#222222] px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-lg tracking-tight">
          Cluster<span className="text-[#22C55E]">Desk</span>
        </Link>
        <div className="flex gap-6 text-sm text-[#787878]">
          <Link href="/weekly" className="hover:text-white transition-colors">Weekly</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </div>
    </nav>
  );
}
