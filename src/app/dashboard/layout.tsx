import Link from 'next/link';
import { readDir } from '../fs-api';
import Header from './_components/Header';

import { PromptCommands } from '@/components/madeup/prompt';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/card";
import { Folder } from 'lucide-react';

export default async function DashLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    type DirectoryContent = { data: { files: string[] } }
    const directoryContent = await readDir('/', false) as object as DirectoryContent
    return (
        <div className='h-screen relative overflow-hidden p-5 space-y-5'>
            <Header />
            <PromptCommands />
            <div className='flex flex-1 h-full overflow-hidden'>
                <div className='flex flex-col overflow-y-scroll scroll-smooth pb-20 pr-5 gap-5'>
                    {directoryContent?.data?.files.map((item: string) => (
                        <Card key={item} className='grow shrink-0'>
                            <CardHeader>
                            </CardHeader>
                            <Link href={`/dashboard/${item}/`}>
                                <CardContent className='grid place-content-center'>
                                    <Folder className='w-12 h-12' />
                                </CardContent>
                            </Link>
                            <CardFooter className='flex justify-center'>
                                <p>{item}</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <div className='w-full h-full'>
                    {children}
                </div>
            </div>
        </div>




    )
}

