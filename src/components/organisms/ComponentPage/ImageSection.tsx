import NextImage from '@/components/molecules/NextImage';
import clsx from 'clsx'
export const ImageSection = ({ textColor }: { textColor: string }) => {
    return (
        <>
            <li className='space-y-2'>
                <h2 className='text-lg md:text-xl'>Next Image</h2>
                <p className={clsx('mt-1! text-sm', textColor)}>
                    Next Image with default props and skeleton animation
                </p>
                <NextImage
                    useSkeleton
                    className='w-32 md:w-40'
                    src='/favicon/android-chrome-192x192.png'
                    width='180'
                    height='180'
                    alt='Icon'
                />
            </li>
        </>
    );
}