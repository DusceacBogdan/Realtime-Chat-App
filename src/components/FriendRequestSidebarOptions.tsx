'use client';

import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

interface FriendRequestSidebarOptionsProps {
    sessionId: string;
    initialUnseenRequestCount: number;
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
    sessionId,
    initialUnseenRequestCount,
}) => {
    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(initialUnseenRequestCount);
    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

        const friendRequestHandler = () => {
            setUnseenRequestCount((prev) => prev + 1);
        };

        const friendHandler = () => {
            setUnseenRequestCount((prev) => (prev > 0 ? prev - 1 : 0));
        };

        pusherClient.bind('incoming_friend_requests', friendRequestHandler);
        pusherClient.bind('new_friend', friendHandler);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`));
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

            pusherClient.unbind('new_friend', friendHandler);
            pusherClient.unbind('incoming_friend_requests', friendRequestHandler);
        };
    }, [sessionId]);

    return (
        <Link
            href='/dashboard/requests'
            className='group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
        >
            <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600'>
                <User className='h-4 w-4' />
            </div>
            <p className='truncate'>Friend Requests</p>
            {unseenRequestCount > 0 ? (
                <div className='flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                    {unseenRequestCount}
                </div>
            ) : null}
        </Link>
    );
};

export default FriendRequestSidebarOptions;
