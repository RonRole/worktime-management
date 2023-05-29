import Link, { LinkProps } from 'next/link';
import { useContext } from 'react';
import { SessionContext } from '../containers/SessionContextProvider';
import { useRouter } from 'next/router';
import React from 'react';

export default function NavHeader() {
    const router = useRouter();
    const { isLoggedIn, destroy } = useContext(SessionContext);
    const onLogout = React.useCallback(async () => {
        await destroy();
        await router.push('/top');
    }, [destroy, router]);
    return (
        <nav className='w-full bg-gray-500 sticky top-0 py-4 font-medium'>
            <div className='flex justify-between'>
                <ul className='flex justify-start'>
                    <li>
                        <Link href='/top' className='text-white hover:text-blue-300 mx-2'>
                            Top
                        </Link>
                    </li>
                    {isLoggedIn && (
                        <li>
                            <Link href='/sample' className='text-white hover:text-blue-300'>
                                Work Time
                            </Link>
                        </li>
                    )}
                </ul>
                {isLoggedIn && (
                    <div className='mx-4'>
                        <button
                            type='button'
                            className='text-white border border-solid border-2 border-red-500 bg-red-500 hover:bg-transparent rounded px-4'
                            onClick={onLogout}
                        >
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
