import { useState, useEffect } from "react";

export function useFetchClicks(key: string) {
  const [clicks, setClicks] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const fetchClicks = async () => {
      try {
        const response = await fetch(
          apiBaseUrl + `/api/analysis/get?key=${key}&interval=A`
        );
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setClicks(data[0]?.count || 0);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchClicks();
  }, [key]);

  return { clicks, error };
}
