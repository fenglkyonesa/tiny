"use client"
import { Button, Input, Skeleton } from "@nextui-org/react";
import MdNavbar from "../components/MdNavbar";
import { Link2 } from 'lucide-react';
import StartButton from "@/components/StartButton";
import { useEffect, useState } from "react";
import IndexCardItem from "@/components/IndexCardItem";
import toast from "react-hot-toast";
interface IndexCardItemProps {
  id: number,
  name: string,
  usename: string,
  email: string,
  expiresAt: Date
}
export default function Home() {
  const [value, setValue] = useState("");
  const [data, setData] = useState<IndexCardItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedding, setPedding] = useState(false);

  useEffect(() => {
    // Function to fetch and filter localStorage items
    const getStoredItems = () => {
      const storedItems = JSON.parse(localStorage.getItem('items') || '[]');
      // const now = new Date();
      // return storedItems.filter(item => new Date(item.expiresAt) > now);
      return storedItems;
    };

    // Fetch data from the API
    fetch('https://jsonplaceholder.typicode.com/users') // Replace with your API endpoint
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(apiData => {
        const storedItems = getStoredItems(); // Get valid items from localStorage
        // Combine stored items and API data
        const combinedData = [...storedItems, ...apiData];
        setData(combinedData);
      })
      .catch(error => {
        toast.error(error)
      }).finally(() => {
        setLoading(false); // Update loading state
      });
    ;
  }, []);

  const handlePostRequest = () => {

    setPedding(true);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24小时后到期
    fetch('https://jsonplaceholder.typicode.com/posts', { // 替换为你的 API 端点
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: value,
        usename: 'ExampleUser', // 替换为适当的数据
        email: 'example@example.com', // 替换为适当的数据
        expiresAt,
      }),
    })
      .then(response => {
        if (!response.ok) {
          toast.error('Network response was not ok');
          return
        }
        return response.json();
      })
      .then(newItem => {
        // 保存新项目及其到期时间到 localStorage
        const storedItems = JSON.parse(localStorage.getItem('items') || '[]');
        storedItems.push(newItem);
        localStorage.setItem('items', JSON.stringify(storedItems));
        setData([newItem, ...data]);
        setValue(''); // 清空输入字段
      })
      .catch(error => {
        toast.error(error)
      })
      .finally(() => {
        setPedding(false); // 无论成功或失败都重置加载状态
      });
  };

  return (

      <main className="flex min-h-screen w-full flex-col items-center  ">
        <MdNavbar />
        <section className="pt-4 text-center antialiased space-y-6 ">
          <h1 className=" md:text-6xl text-4xl  font-sans font-bold gradient-text ">
            Next Generation <br />Superpower Short Links
          </h1>
          <h1 className="font-sans font-semibold md:text-3xl text-xl hover:subpixel-antialiased">
            Yzgz.cc is born for users and serves the people.
          </h1>
        </section>
        <StartButton />

        <section className="flex flex-col gap-4 w-full p-4 md:w-[520px]">
          <Input type="text"
            className="w-full"
            variant="bordered"
            placeholder="https://www.yzgz.cc"
            value={value}
            onValueChange={setValue}
            startContent={<Link2 />}
          />
          <Button color={(!value || pedding) ? "default" : "primary"} isDisabled={!value || pedding} className="w-full" onClick={handlePostRequest}>
            {pedding ? 'loading..' : 'Confirm'}
          </Button>
          {loading ? <div className=" w-full flex items-center gap-3">
            <div>
              <Skeleton className="flex rounded-full w-12 h-12" />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-3 w-full rounded-lg" />
              <Skeleton className="h-3 w-4/5 rounded-lg" />
            </div>
          </div> :

            data.map(item => (
              <IndexCardItem
                key={item.id}
                avatar={"https://nextui.org/avatars/avatar-1.png"}
                shortUrl={item.name}
                longUrl={item.usename}
                clicks={item.id}
                expiresAt={item.expiresAt}
              />
            ))
          }
        </section>
      </main>
  );
}
