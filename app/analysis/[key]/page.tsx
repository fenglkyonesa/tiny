"use client";
import CenterNavbar from "@/components/CenterNavbar";
import CHartCardTabs from "@/components/ChartCartTabs";
import { LineChartItem } from "@/components/LineChartItem";
export const runtime = "edge";
export default function Page({ params }: { params: { key: string } }) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <CenterNavbar />
      <LineChartItem params={params.key} />
      <div className="grid w-[95%] lg:w-[1100px] grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
        <CHartCardTabs
          shortUrl={params.key}
          tabKeys={["device", "browser", "os"]}
        />
        <CHartCardTabs
          shortUrl={params.key}
          tabKeys={["country", "province", "city"]}
        />
        <CHartCardTabs shortUrl={params.key} tabKeys={["referrer"]} />
      </div>
    </main>
  );
}
