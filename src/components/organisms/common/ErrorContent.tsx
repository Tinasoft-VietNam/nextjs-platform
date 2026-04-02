
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import TextButton from '@/components/atoms/Button/TextButton';
interface IProps{
    reset: () => void;
}
const ErrorContent = (props: IProps) => {
    const { reset } = props;
    return (
        <div className='items-center flex-col flex'>
            <RiAlarmWarningFill
                size={60}
                className='drop-shadow-glow animate-flicker text-red-500'
            />
            <h1 className='mt-8 text-4xl md:text-6xl'>
                Oops, something went wrong!
            </h1>
            <TextButton variant='basic' onClick={reset} className='mt-4'>
                Try again
            </TextButton>
        </div>
    )
}
export default ErrorContent;