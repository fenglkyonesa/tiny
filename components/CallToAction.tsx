import { Link } from "@nextui-org/react";

const CallToAction = () => (
  <div className="w-full h-[80px] flex items-center px-2 border-[1px] border-zinc-700 rounded-2xl">
    <p className="text-sm md:text-base">
      Want to claim your links, edit them, or view their{" "}
      <Link href="#" underline="always">
        analytics
      </Link>
      ?
      <Link href="#" underline="always">
        Create a free account
      </Link>{" "}
      on Lru.me to get started.
    </p>
  </div>
);

export default CallToAction;
