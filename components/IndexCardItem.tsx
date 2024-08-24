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
            <a
              href={"https://api.lru.me/" + props.shortUrl}
              target="_blank" // 确保链接在新标签页中打开
              rel="noopener noreferrer" // 安全性考虑
              className="font-sans font-bold text-foreground hover:underline"
            >
              {"lru.me/" + props.shortUrl}
            </a>
            <a
              href={props.longUrl}
              target="_blank" // 确保链接在新标签页中打开
              rel="noopener noreferrer" // 安全性考虑
              className="text-small  font-sans font-semibold text-foreground hover:underline"
            >
              {props.longUrl}
            </a>
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
