import React from 'react';

export type LoadingProps = {
    show: boolean;
    message?: string;
};

export default function Loading({ show, message = 'Loading...' }: LoadingProps) {
    if (show) {
        return (
            <div className='h-screen w-full opacity-50 bg-gray-500 fixed top-0 z-50 flex justify-center items-center'>
                <span className='text-neutral-50'>{message}</span>
            </div>
        );
    }
    return <></>;
}
