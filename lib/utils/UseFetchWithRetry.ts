import { useState, useCallback } from "react";
import toast from "react-hot-toast";

// 定义数据类型
interface IndexCardItemProps {
  shortUrl: string;
  longUrl: string;
  clicks: number;
}

interface FetchOptions extends RequestInit {
  retries?: number; // 最大重试次数
  timeout?: number; // 超时时间
  delay?: number; // 重试前的等待时间
}

const UseFetchWithRetry = (url: string, options: FetchOptions = {}) => {
  const [data, setData] = useState<IndexCardItemProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    retries = 3,
    timeout = 3000,
    delay = 1000,
    ...fetchOptions
  } = options;

  const fetchWithTimeout = useCallback(
    (url: string, options: RequestInit, timeout: number): Promise<Response> => {
      return Promise.race([
        fetch(url, options),
        new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error("请求超时")), timeout)
        ),
      ]);
    },
    []
  );

  const fetchWithRetry = useCallback(
    async (
      url: string,
      options: RequestInit,
      retries: number,
      timeout: number,
      delay: number
    ): Promise<Response> => {
      try {
        const response = await fetchWithTimeout(url, options, timeout);
        if (!response.ok) {
          throw new Error("网络响应不正常");
        }
        return response;
      } catch (error) {
        if (retries > 0) {
          console.warn(`请求失败，重试中... 剩余重试次数: ${retries}`);
          await new Promise((resolve) => setTimeout(resolve, delay)); // 等待一段时间后重试
          return fetchWithRetry(url, options, retries - 1, timeout, delay);
        } else {
          throw error;
        }
      }
    },
    [fetchWithTimeout]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: Response = await fetchWithRetry(
        url,
        fetchOptions,
        retries,
        timeout,
        delay
      );
      const apiData: IndexCardItemProps[] = await response.json();
      const storedItems: IndexCardItemProps[] = JSON.parse(
        localStorage.getItem("items") || "[]"
      );
      const combinedData = [...storedItems, ...apiData];
      setData(combinedData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(`${error.message}`);
      } else {
        setError("未知错误");
        toast.error("未知错误");
      }
    } finally {
      setLoading(false);
    }
  }, [url, fetchOptions, retries, timeout, delay, fetchWithRetry]);

  return { data, loading, error, fetchData };
};

export default UseFetchWithRetry;
