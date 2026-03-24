import { Button, IconButton, TextButton } from '@/components/atoms/Button'
import clsx from 'clsx'
import { ButtonLink } from '@/components/molecules/Links';
import {
  ArrowRight,
  CreditCard,
  Laptop,
  Phone,
  Plus,
  Shield,
} from 'lucide-react';

export const ButtonSection = ({ mode, textColor }: { mode: string; textColor: string }) => {
    return (
        <>
            <li className='space-y-2'>
                <h2 className='text-lg md:text-xl'>Button</h2>
                <p className={clsx('mt-1! text-sm', textColor)}>
                    Ordinary button with style.
                </p>
                <div className='flex flex-wrap gap-2'>
                    <Button variant='primary'>Primary Variant</Button>
                    <Button variant='outline' isDarkBg={mode === 'dark'}>
                        Outline Variant
                    </Button>
                    <Button variant='ghost' isDarkBg={mode === 'dark'}>
                        Ghost Variant
                    </Button>
                    <Button variant='dark'>Dark Variant</Button>
                    <Button variant='light'>Light Variant</Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                    <Button
                        variant='primary'
                        leftIcon={Plus}
                        rightIcon={ArrowRight}
                    >
                        Icon
                    </Button>
                    <Button
                        variant='outline'
                        leftIcon={Plus}
                        rightIcon={ArrowRight}
                        isDarkBg={mode === 'dark'}
                    >
                        Icon
                    </Button>
                    <Button
                        variant='ghost'
                        leftIcon={Plus}
                        rightIcon={ArrowRight}
                        isDarkBg={mode === 'dark'}
                    >
                        Icon
                    </Button>
                    <Button variant='dark' leftIcon={Plus} rightIcon={ArrowRight}>
                        Icon
                    </Button>
                    <Button variant='light' leftIcon={Plus} rightIcon={ArrowRight}>
                        Icon
                    </Button>
                </div>
                <div className='mt-4! flex flex-wrap gap-2'>
                    <Button size='sm' variant='primary'>
                        Small Size
                    </Button>
                    <Button size='sm' variant='outline' isDarkBg={mode === 'dark'}>
                        Small Size
                    </Button>
                    <Button size='sm' variant='ghost' isDarkBg={mode === 'dark'}>
                        Small Size
                    </Button>
                    <Button size='sm' variant='dark'>
                        Small Size
                    </Button>
                    <Button size='sm' variant='light'>
                        Small Size
                    </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                    <Button
                        size='sm'
                        variant='primary'
                        leftIcon={Plus}
                        rightIcon={ArrowRight}
                    >
                        Icon
                    </Button>
                    <Button
                        size='sm'
                        variant='outline'
                        leftIcon={Plus}
                        rightIcon={ArrowRight}
                        isDarkBg={mode === 'dark'}
                    >
                        Icon
                    </Button>
                    <Button
                        size='sm'
                        variant='ghost'
                        leftIcon={Plus}
                        rightIcon={ArrowRight}
                        isDarkBg={mode === 'dark'}
                    >
                        Icon
                    </Button>

                    <Button
                        size='sm'
                        variant='dark'
                        leftIcon={Plus}
                        rightIcon={ArrowRight}
                    >
                        Icon
                    </Button>
                    <Button
                        size='sm'
                        variant='light'
                        leftIcon={Plus}
                        rightIcon={ArrowRight}
                    >
                        Icon
                    </Button>
                </div>

                <div className='mt-4! flex flex-wrap gap-2'>
                    <Button disabled variant='primary'>
                        Disabled
                    </Button>
                    <Button disabled variant='outline' isDarkBg={mode === 'dark'}>
                        Disabled
                    </Button>
                    <Button disabled variant='ghost' isDarkBg={mode === 'dark'}>
                        Disabled
                    </Button>
                    <Button disabled variant='dark'>
                        Disabled
                    </Button>
                    <Button disabled variant='light'>
                        Disabled
                    </Button>
                </div>
                <div className='flex flex-wrap gap-2'>
                    <Button isLoading variant='primary'>
                        Disabled
                    </Button>
                    <Button isLoading variant='outline' isDarkBg={mode === 'dark'}>
                        Disabled
                    </Button>
                    <Button isLoading variant='ghost' isDarkBg={mode === 'dark'}>
                        Disabled
                    </Button>
                    <Button isLoading variant='dark'>
                        Disabled
                    </Button>
                    <Button isLoading variant='light'>
                        Disabled
                    </Button>
                </div>
            </li>
            <li className='space-y-2'>
                <h2 className='text-lg md:text-xl'>TextButton</h2>
                <p className={clsx('mt-1! text-sm', textColor)}>
                    Button with a text style
                </p>
                <div className='space-x-2'>
                    <TextButton>Primary Variant</TextButton>
                    <TextButton variant='basic'>Basic Variant</TextButton>
                </div>
            </li>
            <li className='space-y-2'>
                <h2 className='text-lg md:text-xl'>IconButton</h2>
                <p className={clsx('mt-1! text-sm', textColor)}>
                    Button with only icon inside
                </p>
                <div className='space-x-2'>
                    <IconButton icon={Plus} />
                    <IconButton variant='outline' icon={Laptop} />
                    <IconButton variant='ghost' icon={Phone} />
                    <IconButton variant='dark' icon={Shield} />
                    <IconButton variant='light' icon={CreditCard} />
                </div>
            </li>
            <li className='space-y-2'>
                <h2 className='text-lg md:text-xl'>Custom 404 Page</h2>
                <p className={clsx('mt-1! text-sm', textColor)}>
                    Styled 404 page with some animation.
                </p>
                <div className='flex flex-wrap gap-2'>
                    <ButtonLink href='/404'>Visit the 404 page</ButtonLink>
                </div>
            </li>
        </>
    )
}