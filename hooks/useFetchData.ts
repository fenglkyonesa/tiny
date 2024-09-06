import { useCallback } from "react";
import Cookie from "js-cookie";

export function useFetchData(
  setData: React.Dispatch<React.SetStateAction<IndexCardItemProps[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const fetchData = useCallback(
    async (shortUrl: string) => {
      setLoading(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      try {
        const response = await fetch(
          apiBaseUrl + `/api/analysis/get?key=${shortUrl}&interval=A`
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        const count = data[0]?.count || 0;

        const currentItems = JSON.parse(Cookie.get("items") || "[]");
        const itemIndex = currentItems.findIndex(
          (item: IndexCardItemProps) => item.shortUrl === shortUrl
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
      } catch (error: any) {
        console.error("Fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    },
    [setData, setLoading]
  );

  return { fetchData };
}
