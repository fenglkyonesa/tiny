import { useCallback } from "react";
import Cookie from "js-cookie";

interface FetchDataOptions {
  retries?: number; // 可选的重试次数
  retryDelay?: number; // 可选的重试延迟时间
}

export function useFetchData(
  setData: React.Dispatch<React.SetStateAction<IndexCardItemProps[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  options?: FetchDataOptions
) {
  const fetchData = useCallback(
    async (shortUrl: string) => {
      setLoading(true);

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const retries = options?.retries ?? 0;
      let retryCount = 0;

      while (retryCount <= retries) {
        try {
          const response = await fetch(
            `${apiBaseUrl}/api/analysis/get?key=${shortUrl}&interval=A`
          );
          if (!response.ok)
            throw new Error(`Network response was not ok: ${response.status}`);

          const data = await response.json();
          const count = data[0]?.count || 0;

          const currentItems = JSON.parse(
            Cookie.get("items") || "[]"
          ) as IndexCardItemProps[];
          const itemIndex = currentItems.findIndex(
            (item) => item.shortUrl === shortUrl
          );

          if (itemIndex !== -1) {
            currentItems[itemIndex].clicks = count;
          } else {
            currentItems.push({
              shortUrl,
              longUrl: `https://example.com/${shortUrl}`,
              clicks: count,
            });
          }

          setData(currentItems);
          Cookie.set("items", JSON.stringify(currentItems));

          break; // 成功后跳出循环
        } catch (error) {
          console.error("Fetch error:", error);
          if (retryCount < retries && options?.retryDelay) {
            await new Promise((resolve) =>
              setTimeout(resolve, options.retryDelay)
            );
          }
        } finally {
          retryCount++;
        }
      }

      setLoading(false);
    },
    [setData, setLoading, options]
  );

  return { fetchData };
}
