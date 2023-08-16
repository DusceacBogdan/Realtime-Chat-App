'use client';
import { chatHrefConstructor } from '@/lib/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

interface SidebarChatListProps {
    friends: User[];
    sessionId: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
    const pathname = usePathname();
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (pathname?.includes('chat')) {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathname.includes(msg.senderId));
            });
        }
    }, [pathname]);

    return (
        <ul
            role='list'
            className='-mx-2 max-h-[25rem] space-y-1 overflow-y-auto'
        >
            {friends.sort().map((friend) => {
                const friendId = friend.id;
                // const { id: friendId } = friend;
                const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
                    return unseenMsg.senderId === friend.id;
                }).length;
                return (
                    <li key={friend.id}>
                        <a
                            className='group flex items-center gap-x-3 rounded-md p-2 text-xs font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                            href={`/dashboard/chat/${chatHrefConstructor(sessionId, friendId)}`}
                        >
                            <Image
                                height={28}
                                width={28}
                                referrerPolicy='no-referrer'
                                className='inline rounded-full'
                                src={friend.image}
                                alt="Your friends' profile picture"
                            />
                            {friend.name}
                            {unseenMessagesCount > 0 ? (
                                <div className='flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white'>
                                    {unseenMessagesCount}
                                </div>
                            ) : null}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
};

export default SidebarChatList;
