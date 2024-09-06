import CenterNavbar from "@/components/CenterNavbar";
import React from "react";
export const runtime = "edge";

const Page = () => {
  return (
    <main className="flex flex-col items-center  w-full min-h-screen">
      <CenterNavbar />
    </main>
  );
};

export default Page;
