"use client";
import { Button, Input, Skeleton } from "@nextui-org/react";
import MdNavbar from "../components/MdNavbar";
import { Link2 } from "lucide-react";
import StartButton from "@/components/StartButton";
import { useEffect, useState } from "react";
import IndexCardItem from "@/components/IndexCardItem";
import toast from "react-hot-toast";

interface IndexCardItemProps {
  shortUrl: string;
  longUrl: string;
  clicks: number;
  // 如果需要 `expiresAt` 字段，请确保 `IndexCardItem` 组件也使用了该字段
}

export default function Home() {
  const [value, setValue] = useState("");
  const [data, setData] = useState<IndexCardItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedding, setPedding] = useState(false);

  useEffect(() => {
    // 从 localStorage 获取存储的项目
    const getStoredItems = () => {
      const storedItems = JSON.parse(localStorage.getItem("items") || "[]");
      return storedItems;
    };

    // 从 API 获取数据
    fetch("http://api.lru.me/api/statistics/top") // 替换为你的 API 端点
      .then((response) => {
        if (!response.ok) {
          throw new Error("网络响应不正常");
        }
        return response.json();
      })
      .then((apiData: IndexCardItemProps[]) => {
        const storedItems = getStoredItems(); // 获取有效的 localStorage 项目
        const combinedData = [...storedItems, ...apiData];
        setData(combinedData);
      })
      .catch((error) => {
        toast.error(`错误: ${error.message}`);
      })
      .finally(() => {
        setLoading(false); // 更新加载状态
      });
  }, []);

  const handlePostRequest = () => {
    setPedding(true);

    // 创建 URL 查询参数
    const params = new URLSearchParams({ longUrl: value }).toString();
    fetch("http://api.lru.me/api/shortens", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // 更新请求头
      },
      body: params,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("网络响应不正常");
        }
        return response.text();
      })
      .then((item) => {
        // 保存新项目到 localStorage
        const storedItems = JSON.parse(localStorage.getItem("items") || "[]");
        const indexCardItem: IndexCardItemProps = {
          shortUrl: item as string,
          longUrl: value,
          clicks: 0,
        };
        storedItems.push(indexCardItem);
        localStorage.setItem("items", JSON.stringify(storedItems));
        setData([indexCardItem, ...data]);
        setValue(""); // 清空输入字段
      })
      .catch((error) => {
        toast.error(`错误: ${error.message}`);
      })
      .finally(() => {
        setPedding(false); // 无论成功或失败都重置加载状态
      });
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <MdNavbar />
      <section className="pt-4 text-center antialiased space-y-6">
        <h1 className="md:text-6xl text-4xl font-sans font-bold gradient-text">
          Next Generation <br />
          Superpower Short Links
        </h1>
        <h1 className="font-sans font-semibold md:text-3xl text-xl hover:subpixel-antialiased">
          Yzgz.cc is born for users and serves the people.
        </h1>
      </section>
      <StartButton />

      <section className="flex flex-col gap-4 w-full p-4 md:w-[520px]">
        <Input
          type="text"
          className="w-full"
          variant="bordered"
          placeholder="https://www.yzgz.cc"
          value={value}
          onValueChange={setValue}
          startContent={<Link2 />}
        />
        <Button
          color={!value || pedding ? "default" : "primary"}
          isDisabled={!value || pedding}
          className="w-full"
          onClick={handlePostRequest}
        >
          {pedding ? "loading.." : "Confirm"}
        </Button>
        {loading ? (
          <div className="w-full flex items-center gap-3">
            <div>
              <Skeleton className="flex rounded-full w-12 h-12" />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-3 w-full rounded-lg" />
              <Skeleton className="h-3 w-4/5 rounded-lg" />
            </div>
          </div>
        ) : (
          data.map((item) => (
            <IndexCardItem
              key={item.shortUrl} // 使用 shortUrl 作为唯一标识符
              avatar={"https://nextui.org/avatars/avatar-1.png"}
              shortUrl={item.shortUrl}
              longUrl={item.longUrl}
              clicks={item.clicks}
              // 确保 IndexCardItem 组件支持这些属性
            />
          ))
        )}
      </section>
    </main>
  );
}
