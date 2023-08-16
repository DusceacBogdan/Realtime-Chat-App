import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { FC } from 'react';
interface pageProps {}
const page: FC<pageProps> = async ({}) => {
    const session = await getServerSession(authOptions);
    return (
        <main className='p-8'>
            <div className='truncate'>{session?.user.email}</div>
        </main>
    );
};
export default page;
