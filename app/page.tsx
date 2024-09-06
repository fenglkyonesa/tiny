"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Cookie from "js-cookie";
import {
  Button,
  Card,
  CardHeader,
  Input,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import IndexCardItem from "@/components/IndexCardItem";
import StartButton from "@/components/StartButton";
import { useFetchData } from "@/hooks/useFetchData";
import { usePostRequest } from "@/hooks/usePostRequest";
import { useFetchClicks } from "@/hooks/useFetchClicks";
import SkeletonLoader from "@/components/SkeletonLoader";
import CallToAction from "@/components/CallToAction";
import FeaturesSection from "@/components/FeaturesSection";
import CenterNavbar from "@/components/CenterNavbar";
import IndexTabs from "@/components/IndexTabs";
import Link from "next/link";
import React from "react";

export const runtime = "edge";
const Home = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [hovered, setHovered] = useState(false);
  const [data, setData] = useState<IndexCardItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [clicks, setClicks] = useState<number | null>(null);

  const { fetchData } = useFetchData(setData, setLoading);
  const { handlePostRequest, isPosting } = usePostRequest(
    inputUrl,
    setInputUrl,
    setData
  );
  const key = "go";

  const { clicks: fetchedClicks, error: fetchClicksError } =
    useFetchClicks(key);

  // Effect to fetch and set data
  useEffect(() => {
    const storedItems = JSON.parse(Cookie.get("items") || "[]");
    setData(storedItems);
    storedItems.forEach((item: IndexCardItemProps) => {
      fetchData(item.shortUrl).catch((err) => console.log(err.message));
    });
    setLoading(false);
  }, [fetchData]);

  // Effect to update clicks
  useEffect(() => {
    if (fetchedClicks !== undefined) {
      setClicks(fetchedClicks);
    }
    if (fetchClicksError) {
      console.log(fetchClicksError);
    }
  }, [fetchedClicks, fetchClicksError]);

  // Handle delete action
  const handleDelete = useCallback(
    (shortUrl: string) => {
      const updatedData = data.filter((item) => item.shortUrl !== shortUrl);
      setData(updatedData);
      Cookie.set("items", JSON.stringify(updatedData));
    },
    [data]
  );

  // Event handlers
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);
  const validateUrl = (inputUrl: string) =>
    inputUrl.match(
      /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/i
    );

  const isInvalid = React.useMemo(() => {
    if (inputUrl === "") return false;

    return validateUrl(inputUrl) ? false : true;
  }, [inputUrl]);
  // Memoized variable to check if input is disabled
  const isDisabled = useMemo(() => data.length > 4, [data.length]);
  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <CenterNavbar />
      <section className="pt-4 text-center space-y-6">
        <h1 className="md:text-6xl text-4xl font-bold gradient-text">
          Next Generation <br />
          Superpower Short Links
        </h1>
        <h2 className="font-semibold md:text-3xl text-xl">
          Lru.me is born for users and serves the people.
        </h2>
      </section>

      <StartButton />

      <section
        className="flex flex-col md:gap-2 gap-1 w-full p-4 md:w-[520px]"
        onMouseLeave={handleMouseLeave}
      >
        <Tooltip
          isOpen={isDisabled && hovered}
          placement="top"
          content={
            <Card className="max-w-[400px]">
              <CardHeader className="flex gap-3">
                <p className="text-md">
                  Maximum number of links reached. Swipe to delete existing
                  links or create a free account to create more links.
                </p>
              </CardHeader>
              <Button
                as={Link}
                color="primary"
                href="/authentication"
                variant="shadow"
              >
                Start For Free
              </Button>
            </Card>
          }
        >
          <div className="relative" onMouseEnter={handleMouseEnter}>
            <Input
              type="text"
              className="w-full"
              variant="bordered"
              disabled={isDisabled}
              isInvalid={isInvalid}
              placeholder="https://lru.me"
              color={isInvalid ? "danger" : "primary"}
              errorMessage="Please enter a valid url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
          </div>
        </Tooltip>

        <Button
          color={!inputUrl || isPosting || isInvalid ? "default" : "primary"}
          isDisabled={!inputUrl || isPosting || isInvalid}
          className="w-full"
          onClick={handlePostRequest}
        >
          {isPosting ? <Spinner /> : "Continue"}
        </Button>

        <IndexCardItem
          key={key}
          shortUrl={key}
          clicks={99899}
          longUrl="https://lru.me"
        />

        {loading ? (
          <SkeletonLoader />
        ) : (
          data
            .filter((item) => item.shortUrl !== key)
            .map((item) => (
              <IndexCardItem
                key={item.shortUrl}
                shortUrl={item.shortUrl}
                longUrl={item.longUrl}
                clicks={item.clicks}
                onDelete={handleDelete}
              />
            ))
        )}

        <CallToAction />
      </section>

      <FeaturesSection />
      <IndexTabs />
      <IndexTabs />
    </main>
  );
};

export default Home;
