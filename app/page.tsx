import { Button, Input } from "@nextui-org/react";
import MdNavbar from "../components/MdNavbar";
import { Link2 } from 'lucide-react';
import StartButton from "@/components/StartButton";
import { CornerDownLeft } from 'lucide-react';
import IndexCardItem from "@/components/IndexCardItem";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <MdNavbar />
      <section className="mt-[5vh]  text-center antialiased space-y-6 ">
        <h1 className=" md:text-6xl text-4xl  font-sans font-bold gradient-text ">
          Next Generation <br />Superpower Short Links
        </h1>
        <h1 className="font-sans font-semibold md:text-3xl text-xl hover:subpixel-antialiased">
          Yzgz.cc is born for users and serves the people.
        </h1>
      </section>
      <StartButton />
      <section className="flex flex-col gap-4 w-96 md:w-[520px] mt-[2vh]">
        <Input type="text"
          className="w-full"
          variant="bordered"
          placeholder="https://www.yzgz.cc"
          startContent={<Link2 />}
          endContent={<button><CornerDownLeft size={20} /></button>}
        />
        <div>
          <IndexCardItem 
          avatar="https://nextui.org/avatars/avatar-1.png"
          shortUrl="yzgz.cc/1"
          longUrl="yzgz.cc/1"
          clicks={11774}
          />
        </div>
      </section>
    </main>
  );
}
