'use client'
import React from 'react'
import { QrCode } from 'lucide-react';
import { Card, CardHeader, CardFooter, Avatar, Button, Link } from "@nextui-org/react";
import { Copy } from 'lucide-react';
import CopyButton from './CopyButton';
interface IndexCardItemProps {
    shortUrl: string,
    longUrl: string,
    clicks: number,
    avatar: string,
    expiresAt: Date
}
export default function IndexCardItem(props: IndexCardItemProps) {
    const [isFollowed, setIsFollowed] = React.useState(false);
    return (
        <Card className="w-full">
            <CardHeader className="justify-between">
                <div className="flex gap-5">
                    <Avatar isBordered radius="full" size="md" src={props.avatar} />
                    <div className="flex flex-col gap-1 items-start justify-center">
                        <Link href={"https://" + props.shortUrl} color='foreground' isExternal underline="hover">{props.shortUrl}</Link>
                        <Link
                            href={props.longUrl}
                            color='foreground'
                            isExternal
                            underline="always"
                            className='text-small text-default-400 font-sans font-semibold'
                        >
                            {props.longUrl}
                        </Link>
                    </div>
                    <CopyButton url={props.shortUrl} />
                    <QrCode className='cursor-pointer'/>
                </div>
                <Button
                    className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                    color="primary"
                    radius="full"
                    size="sm"
                    variant={isFollowed ? "bordered" : "solid"}
                    onPress={() => setIsFollowed(!isFollowed)}
                >
                    view
                </Button>
            </CardHeader>

            <CardFooter>
                <div className="flex gap-3">
                    <p className="text-small font-sans font-bold">{props.clicks}</p>
                    <p className="text-small">Clicks</p>
                    <p className="text-small font-sans font-bold">{props.longUrl}</p>
                    <p className="text-small">expiresAt</p>
                </div>
            </CardFooter>
        </Card>
    );
}
