import UnderlineLink from '@/components/molecules/Links/UnderlineLink'
import UnstyledLink from '@/components/molecules/Links/UnstyledLink'
import PrimaryLink from '@/components/molecules/links/PrimaryLink'
import ArrowLink from '@/components/molecules/links/ArrowLink'
import ButtonLink from '@/components/molecules/links/ButtonLink'
import clsx from 'clsx'



export const LinkSection = ({ textColor }: { textColor: string }) => {
    return (
        <>
            <li className='space-y-2'>
                <h2 className='text-lg md:text-xl'>UnstyledLink</h2>
                <p className={clsx('mt-1! text-sm', textColor)}>
                    No style applied, differentiate internal and outside links, give
                    custom cursor for outside links.
                </p>
                <div className='space-x-2'>
                    <UnstyledLink href='/'>Internal Links</UnstyledLink>
                    <UnstyledLink href='https://theodorusclarence.com'>
                        Outside Links
                    </UnstyledLink>
                </div>
            </li>
            <li className='space-y-2'>
                <h2 className='text-lg md:text-xl'>PrimaryLink</h2>
                <p className={clsx('mt-1! text-sm', textColor)}>
                    Add styling on top of UnstyledLink, giving a primary color to
                    the link.
                </p>
                <div className='space-x-2'>
                    <PrimaryLink href='/'>Internal Links</PrimaryLink>
                    <PrimaryLink href='https://theodorusclarence.com'>
                        Outside Links
                    </PrimaryLink>
                </div>
            </li>
            <li className='space-y-2'>
                <h2 className='text-lg md:text-xl'>UnderlineLink</h2>
                <p className={clsx('mt-1! text-sm', textColor)}>
                    Add styling on top of UnstyledLink, giving a dotted and animated
                    underline.
                </p>
                <div className='space-x-2'>
                    <UnderlineLink href='/'>Internal Links</UnderlineLink>
                    <UnderlineLink href='https://theodorusclarence.com'>
                        Outside Links
                    </UnderlineLink>
                </div>
            </li>
            <li className='space-y-2'>
              <h2 className='text-lg md:text-xl'>ArrowLink</h2>
              <p className={clsx('mt-1! text-sm', textColor)}>
                Useful for indicating navigation, I use this quite a lot, so why
                not build a component with some whimsy touch?
              </p>
              <div className='flex flex-wrap items-center gap-4'>
                <ArrowLink href='/' direction='left'>
                  Direction Left
                </ArrowLink>
                <ArrowLink href='/'>Direction Right</ArrowLink>
                <ArrowLink
                  as={UnstyledLink}
                  className='inline-flex items-center'
                  href='/'
                >
                  Polymorphic
                </ArrowLink>
                <ArrowLink
                  as={ButtonLink}
                  variant='light'
                  className='inline-flex items-center'
                  href='/'
                >
                  Polymorphic
                </ArrowLink>
              </div>
            </li>
        </>
    )
}