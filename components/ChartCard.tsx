import React, { useCallback, useMemo } from "react";
import numeral from "numeral";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DataItem {
  [key: string]: any;
}

interface ChatCardProps {
  data?: DataItem[];
  colorGenerator?: (category: string) => string;
}

export function ChatCard({
  data = [],
  colorGenerator = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
}: ChatCardProps) {
  const dimensions = useMemo(
    () => (data.length ? Object.keys(data[0]) : []),
    [data]
  );
  const categoryKey = dimensions.find((dim) => dim !== "count") || "";
  const valueKey = "count";

  // Generate chart configuration and colors
  const chartConfig = useMemo(
    () =>
      data.reduce<Record<string, { label: string; color: string }>>(
        (config, item) => {
          const category = item[categoryKey];
          if (category && !config[category]) {
            config[category] = {
              label: category,
              color: colorGenerator(category),
            };
          }
          return config;
        },
        {}
      ),
    [data, categoryKey, colorGenerator]
  );

  // Map data with colors
  const coloredData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        fill: chartConfig[item[categoryKey]]?.color,
      })),
    [data, categoryKey, chartConfig]
  );

  // Format value using numeral.js
  const formatValue = useCallback(
    (value: number) => numeral(value).format("0.a"),
    []
  );
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        data={coloredData}
        layout="vertical"
        margin={{ right: 25, left: 5 }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey={categoryKey}
          type="category"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => chartConfig[value]?.label || value}
        />
        <XAxis dataKey={valueKey} type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey={valueKey} layout="vertical" radius={5}>
          <LabelList
            dataKey={valueKey}
            position="right"
            offset={2}
            className="fill-foreground"
            fontSize={12}
            formatter={formatValue}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
