'use client';

import { ButtonHTMLAttributes, FC, useState } from 'react';
import Button from './ui/Button';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { LogOut } from 'lucide-react';

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
    const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

    return (
        <Button
            {...props}
            variant='ghost'
            isLoading={isSigningOut}
            onClick={async () => {
                setIsSigningOut(true);
                try {
                    await signOut();
                } catch (error) {
                    toast.error('There was a problem signing out');
                } finally {
                    setIsSigningOut(false);
                }
            }}
        >
            {isSigningOut ? null : <LogOut className='h-4 w-4' />}
        </Button>
    );
};

export default SignOutButton;
