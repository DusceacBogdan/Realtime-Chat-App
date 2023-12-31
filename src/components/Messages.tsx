'use client';

import { pusherClient } from '@/lib/pusher';
import { cn, toPusherKey } from '@/lib/utils';
import { Message } from '@/lib/validations/message';
import { format } from 'date-fns';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';

interface MessagesProps {
    initialMessages: Message[];
    sessionId: string;
    chatId: string;
    chatPartner: User;
    sessionImg: string;
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId, sessionImg, chatPartner, chatId }) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    const scrollDownRef = useRef<HTMLDivElement | null>(null);
    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, 'HH:mm');
    };

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

        const messageHandler = (message: Message) => {
            setMessages((prev) => [message, ...prev]);
        };

        pusherClient.bind('incoming_message', messageHandler);

        return () => {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));

            pusherClient.unbind('incoming_message', messageHandler);
        };
    }, [chatId]);

    return (
        <div
            id='messages'
            className='scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto p-3'
        >
            <div ref={scrollDownRef} />

            {messages.map((message, index) => {
                const isCurrentUser = message.senderId === sessionId;

                const hasNextMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId;
                return (
                    <div
                        id='chat-message'
                        key={`${message.id}-${message.timestamp}`}
                    >
                        <div
                            className={cn('flex items-end', {
                                'justify-end': isCurrentUser,
                            })}
                        >
                            <div
                                className={cn('mx-2 flex max-w-xs flex-col space-y-2 text-base', {
                                    'order-1 items-end': isCurrentUser,
                                    'order-2 items-start': !isCurrentUser,
                                })}
                            >
                                <span
                                    className={cn('inline-block rounded-lg px-4 py-2', {
                                        'bg-indigo-600 text-white': isCurrentUser,
                                        'bg-gray-200 text-gray-900': !isCurrentUser,
                                        'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                                        'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser,
                                    })}
                                >
                                    {message.text}{' '}
                                    <span className='ml-2 text-xs text-gray-400'>
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                </span>
                            </div>
                            <div
                                className={cn('relative h-6 w-6', {
                                    'order-2': isCurrentUser,
                                    'order-1': !isCurrentUser,
                                    invisible: hasNextMessageFromSameUser,
                                })}
                            >
                                <Image
                                    fill
                                    src={isCurrentUser ? sessionImg : chatPartner.image}
                                    alt='Profile Picture'
                                    referrerPolicy='no-referrer'
                                    className='rounded-full'
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Messages;
