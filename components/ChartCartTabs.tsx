import React, { useState, useEffect, useCallback } from "react";
import { Tab, Tabs } from "@nextui-org/react";
import { ChatCard } from "./ChartCard";
import { useStore } from "@/store/ChatStore";

interface CardTestProps {
  shortUrl: string;
  tabKeys: string[]; // 父组件传递的 key 数组
}

export default function CHartCardTabs({ shortUrl, tabKeys }: CardTestProps) {
  const { interval } = useStore(); // 使用 store

  const [selectedKey, setSelectedKey] = useState<string>(tabKeys[0] || ""); // 初始化选中的 key
  const [chartData, setChartData] = useState<any[]>([]); // 根据实际数据类型调整
  const [loading, setLoading] = useState<boolean>(false); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误状态

  // Define the function to handle tab selection change
  const handleSelectionChange = useCallback((key: React.Key) => {
    setSelectedKey(key as string); // Convert key to string if needed
  }, []);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Define the fetchData function
  const fetchData = useCallback(
    async (key: string) => {
      setLoading(true); // 开始加载
      setError(null); // 清除错误
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/analysis/get?key=${shortUrl}&groupBy=${key}&timezone=Asia/Shanghai&interval=${interval}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setChartData(data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false); // 加载完成
      }
    },
    [shortUrl, interval]
  );

  useEffect(() => {
    if (selectedKey) {
      fetchData(selectedKey); // 请求选中的 tab 的数据
    }
  }, [selectedKey, fetchData]);

  return (
    <div className="flex flex-wrap gap-4 rounded-xl border bg-card text-card-foreground shadow">
      <Tabs
        variant="underlined"
        aria-label="Options"
        selectedKey={selectedKey}
        onSelectionChange={handleSelectionChange}
      >
        {tabKeys.map((key) => (
          <Tab
            key={key}
            title={key.charAt(0).toUpperCase() + key.slice(1)}
            className="w-full"
          >
            {loading ? (
              <div>Loading...</div> // 加载中状态
            ) : (
              <ChatCard data={chartData} />
            )}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
