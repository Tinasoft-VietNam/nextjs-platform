import Skeleton from '@/components/atoms/Skeleton';
import clsx from 'clsx'
export const SkeletonSection = ({ textColor }: { textColor: string }) => {
    return (
        <>
            <li className='space-y-2'>
                <h2 className='text-lg md:text-xl'>Skeleton</h2>
                <p className={clsx('mt-1! text-sm', textColor)}>
                    Skeleton with shimmer effect
                </p>
                <Skeleton className='h-72 w-72' />
            </li>
        </>
    );
}