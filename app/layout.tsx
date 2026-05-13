import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const serif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClusterDesk — Weekly Insider Cluster Buy Digest",
  description:
    "Get the top insider cluster buys every Friday before market open. Built from SEC Form 4 filings in micro-cap stocks.",
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
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen">
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
