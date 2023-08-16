import FriendRequests from '@/components/FriendRequests';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { FC } from 'react';

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
    const session = await getServerSession(authOptions);

    if (!session) {
        notFound();
    }
    const incomingSenderIds = (await fetchRedis(
        'smembers',
        `user:${session.user.id}:incoming_friend_requests`
    )) as string[];

    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            const sender = (await fetchRedis(
                'get',
                `user:${senderId}`
            )) as string;
            const senderParsed = JSON.parse(sender) as User;
            return {
                senderId,
                senderEmail: senderParsed.email,
            };
        })
    );
    return (
        <main className='p-8'>
            <h1 className='mb-8 text-5xl font-bold'>Friend Requests</h1>
            <div className='flex flex-col gap-4'>
                <FriendRequests
                    sessionId={session.user.id}
                    incomingFriendRequests={incomingFriendRequests}
                />
            </div>
        </main>
    );
};

export default page;
