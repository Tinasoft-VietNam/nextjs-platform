import { Metadata } from 'next';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

export const metadata: Metadata = {
    title: 'Not Found',
};

const NotFoundContent = () => {
    return (
        <>
            <div className='flex flex-col items-center'>
                <RiAlarmWarningFill
                    size={60}
                    className='drop-shadow-glow animate-flicker text-red-500'
                />
                <h1 className='mt-8 text-4xl md:text-6xl'>Page Not Found</h1>
                <a href='/'>Back to home</a>
            </div>
        </>
    );
}
export default NotFoundContent;