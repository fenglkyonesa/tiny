import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Select, SelectItem } from "@nextui-org/react";
import { times } from "@/lib/utils/TimeSelect";
import { useStore } from "@/store/ChatStore";

interface DataItem {
  start: string; // 或者 Date 类型，取决于你的需求
  count: number;
}

const chartConfig: ChartConfig = {
  clicks: {
    label: "clicks",
    color: "hsl(var(--chart-1))",
  },
};

// 获取用户的时区
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// 获取用户的区域 (locale)
const locale = Intl.DateTimeFormat().resolvedOptions().locale;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const fetchChartData = async (
  params: string,
  interval: string
): Promise<DataItem[]> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/analysis/get?key=${params}&groupBy=times&timezone=${timeZone}&interval=${interval}`
    );
    if (!response.ok) {
      throw new Error("Failed");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
};

const MemoizedLineChart = React.memo(
  ({ chartData, interval }: { chartData: DataItem[]; interval: string }) => (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <LineChart data={chartData} margin={{ left: 12, right: 12, top: 5 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="start"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            return new Date(value).toLocaleDateString(locale, {
              month: "short",
              day: "numeric",
              year: "numeric",
              ...(interval === "D" && { hour: "numeric" }), // 仅当 interval 为 'D' 时才包含小时选项
              hour12: false, // 使用 24 小时制
              timeZone: timeZone,
            });
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey="clicks"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString(locale, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  ...(interval === "D" && { hour: "numeric" }), // 仅当 interval 为 'D' 时才包含小时选项
                  hour12: false, // 使用 24 小时制
                  timeZone: timeZone,
                });
              }}
            />
          }
        />
        <Line
          dataKey="count"
          type="monotone"
          stroke={`var(--color-clicks)`}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
);

export function LineChartItem({ params }: { params: string }) {
  const { interval, setInterval } = useStore(); // 使用 store
  const [chartData, setChartData] = React.useState<DataItem[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchChartData(params, interval);
      setChartData(data);
    };

    fetchData();
  }, [params, interval]); // 依赖于 params 和 interval

  const totalClicks = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.count, 0),
    [chartData]
  );

  return (
    <Card className="w-[95%] lg:w-[1100px]">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 sm:py-6">
          <CardTitle>
            <Select
              items={times}
              variant="underlined"
              aria-label="times"
              defaultSelectedKeys={[interval]} // 使用传递的 interval 作为默认值
              className="max-w-xs"
              onChange={(e) => setInterval(e.target.value)}
            >
              {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
            </Select>
          </CardTitle>
        </div>
        <div className="flex">
          <button className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-2 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              {chartConfig.clicks.label}
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {totalClicks.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <MemoizedLineChart chartData={chartData} interval={interval} />
      </CardContent>
    </Card>
  );
}
