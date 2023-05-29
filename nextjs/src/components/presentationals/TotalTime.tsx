import { Minutes, toViewString } from '@/domains/time';
import React from 'react';

export type TotalTimeProps = {
    time: Minutes;
} & React.ComponentProps<'div'>;

export default function TotalTime({ time, ...props }: TotalTimeProps) {
    return (
        <div {...props}>
            <span className='block text-xs'>Total</span>
            <span className='text-4xl font-extrabold'>{toViewString(time)}</span>
        </div>
    );
}
