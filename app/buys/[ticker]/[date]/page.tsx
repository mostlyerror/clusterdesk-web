import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { ClusterCard } from "@/components/ClusterCard";

export const revalidate = 3600;

interface Props {
  params: Promise<{ ticker: string; date: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ticker, date } = await params;
  return {
    title: `${ticker.toUpperCase()} Cluster Buy ${date} | ClusterDesk`,
  };
}

export default async function TickerDatePage({ params }: Props) {
  const { ticker, date } = await params;
  const upper = ticker.toUpperCase();
  const { data } = await supabase
    .from("ticker_pages")
    .select("*")
    .eq("ticker", upper)
    .eq("cluster_date", date)
    .single();

  if (!data) notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">
        <span className="text-[#22C55E]">${upper}</span> cluster buy — {date}
      </h1>
      <ClusterCard cluster={data.payload} publishedAt={data.published_at} />
    </div>
  );
}
