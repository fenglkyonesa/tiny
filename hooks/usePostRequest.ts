import { useState, useCallback } from "react";
import Cookie from "js-cookie";
import React from "react";

export function usePostRequest(
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setData: React.Dispatch<React.SetStateAction<IndexCardItemProps[]>>
) {
  const [isPosting, setIsPosting] = useState(false);

  // 处理 URL 的函数，始终使用 https://
  const ensureHttpsUrl = (urlString: string): string => {
    // 如果 URL 已经有协议部分，则用 https 替换
    if (/^http:\/\//i.test(urlString)) {
      urlString = urlString.replace(/^http:\/\//i, "https://");
    } else if (!/^https?:\/\//i.test(urlString)) {
      // 如果没有协议部分，则添加 https://
      urlString = `https://${urlString}`;
    }
    return urlString;
  };
  const validateUrl = (inputUrl: string) =>
    inputUrl.match(
      /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/i
    );

  const isInvalid = React.useMemo(() => {
    if (value === "") return false;

    return validateUrl(value) ? false : true;
  }, [value]);

  const handlePostRequest = useCallback(async () => {
    if (isInvalid) {
      return;
    }
    // 规范化 URL，确保其有协议部分
    const normalizedUrl = ensureHttpsUrl(value);

    setIsPosting(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const params = new URLSearchParams({ originalUrl: normalizedUrl });

      const response = await fetch(`${apiBaseUrl}/api/tiny`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.statusText}`);

      const result = await response.text();
      const shortUrl = result;

      const currentItems = JSON.parse(Cookie.get("items") || "[]");
      const newItem = { shortUrl, longUrl: normalizedUrl, clicks: 0 };
      currentItems.push(newItem);
      setData(currentItems);
      Cookie.set("items", JSON.stringify(currentItems));
      setValue("");
    } catch (error: any) {
      console.error("Post error:", error.message);
    } finally {
      setIsPosting(false);
    }
  }, [value, setValue, setData]);

  return { handlePostRequest, isPosting };
}
