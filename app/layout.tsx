import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "ClusterDesk — Daily Insider Cluster Buy Alerts",
  description:
    "Free daily alerts on insider cluster buys in micro-cap stocks. When multiple insiders buy at the same company within days, we tell you.",
  openGraph: {
    siteName: "ClusterDesk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@clusterdesk",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#0A0A0A] text-white min-h-screen">
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
