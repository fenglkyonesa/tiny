import { Button } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'

export default function StartButton() {
    return (
        <Link href={"/login"} className='mt-[2vh]'>
            <Button variant="shadow" radius="full" className='w-32 h-8'>
                <p className="font-sans font-semibold">免费开始</p>
            </Button>
        </Link>
    )
}
