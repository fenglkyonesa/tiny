"use client";
import React from "react";
import { QrCode } from "lucide-react";
import {
  Card,
  CardHeader,
  CardFooter,
  Avatar,
  Button,
  Link,
} from "@nextui-org/react";
import { Copy } from "lucide-react";
import CopyButton from "./CopyButton";
interface IndexCardItemProps {
  shortUrl: string;
  longUrl: string;
  clicks: number;
  avatar: string;
}
export default function IndexCardItem(props: IndexCardItemProps) {
  const [isFollowed, setIsFollowed] = React.useState(false);
  return (
    <Card className="w-full">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="full" size="md" src={props.avatar} />
          <div className="flex flex-col gap-1 items-start justify-center">
            <Link
              href={"https://lru.me/" + props.shortUrl}
              color="foreground"
              isExternal
              underline="hover"
              className="font-sans font-bold"
            >
              {"lru.me/" + props.shortUrl}
            </Link>
            <Link
              href={props.longUrl}
              color="foreground"
              isExternal
              underline="always"
              className="text-small text-default-400 font-sans font-semibold"
            >
              {props.shortUrl}
            </Link>
          </div>
          <CopyButton url={props.shortUrl} />
          <QrCode className="cursor-pointer" />
        </div>

        <Button
          className={
            isFollowed
              ? "bg-transparent text-foreground border-default-200"
              : ""
          }
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          view
        </Button>
      </CardHeader>
    </Card>
  );
}
