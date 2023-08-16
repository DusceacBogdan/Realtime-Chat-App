import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions';
import { Icon, Icons } from '@/components/Icons';
import SidebarChatList from '@/components/SidebarChatList';
import SighOutButton from '@/components/SighOutButton';
import { getFriendsByUserId } from '@/helpers/get-friends-by-id';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

interface SidebarOption {
    id: number;
    name: string;
    href: string;
    Icon: Icon;
}

const sidebarOptions: SidebarOption[] = [
    {
        id: 1,
        name: 'Add friend',
        href: '/dashboard/add',
        Icon: 'UserPlus',
    },
];

const Layout: FC<LayoutProps> = async ({ children }) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        notFound();
    }

    const friends = await getFriendsByUserId(session.user.id);

    const unseenRequestCount = (
        (await fetchRedis(
            'smembers',
            `user:${session.user.id}:incoming_friend_requests`
        )) as User[]
    ).length;

    return (
        <div className='flex h-screen w-full'>
            <div className='flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
                <Link
                    href='/dashboard'
                    className='flex h-16 shrink-0 items-center'
                >
                    <Icons.Logo className='h-8 w-auto text-indigo-600' />
                </Link>
                {friends.length > 0 ? (
                    <div className='text-xs font-semibold leading-6 text-gray-400'>
                        Your chats
                    </div>
                ) : null}

                <nav className='flex flex-1 flex-col'>
                    <ul
                        role='list'
                        className='flex flex-1 flex-col gap-y-7'
                    >
                        <li>
                            <SidebarChatList
                                friends={friends}
                                sessionId={session.user.id}
                            />
                        </li>

                        <li>
                            <div className='text-xs font-semibold leading-6 text-gray-400'>
                                Overview
                            </div>
                            <ul
                                role='list'
                                className='-mx-2 mt-2 space-y-1'
                            >
                                {sidebarOptions.map((option) => {
                                    const Icon = Icons[option.Icon];
                                    return (
                                        <li key={option.id}>
                                            <Link
                                                href={option.href}
                                                className='group flex gap-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                                            >
                                                <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600'>
                                                    <Icon className='h-4 w-4' />
                                                </span>

                                                <span className='truncate'>
                                                    {option.name}
                                                </span>
                                            </Link>
                                        </li>
                                    );
                                })}
                                <FriendRequestSidebarOptions
                                    sessionId={session.user.id}
                                    initialUnseenRequestCount={
                                        unseenRequestCount
                                    }
                                />
                            </ul>
                        </li>
                        <li></li>

                        <li className='-mx-6 mt-auto flex items-center'>
                            <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                                <div className='relative h-8 w-8 bg-gray-50'>
                                    <Image
                                        fill
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        src={session.user.image || ''}
                                        alt='Your profile picture'
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <span>{session.user.name}</span>
                                    <span className='text-xs text-zinc-400'>
                                        {session.user.email}
                                    </span>
                                </div>
                            </div>
                            <SighOutButton className='aspect-square h-full' />
                        </li>
                    </ul>
                </nav>
            </div>
            {children}
        </div>
    );
};

export default Layout;
