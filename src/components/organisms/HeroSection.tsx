// src/components/organisms/HeroSection.tsx
import Logo from '~/svg/Logo.svg';
// import ArrowLink from '@/components/atoms/links/ArrowLink';
// import ButtonLink from '@/components/atoms/links/ButtonLink';

import { ArrowLink, ButtonLink } from '@/components/molecules/Links';
export const HeroSection = () => (
  <>
    <Logo className='w-16' />
    <h1 className='mt-4'>Next.js + Tailwind CSS + TypeScript Starter</h1>
    <p className='mt-2 text-sm text-gray-800'>
      A starter for Next.js, Tailwind CSS, and TypeScript...
    </p>
    <p className='mt-2 text-sm text-gray-700'>
      <ArrowLink direction='left' href='...'>See the repository</ArrowLink>
    </p>
    <ButtonLink className='mt-6' href='/components' variant='light'>
      See all components
    </ButtonLink>
  </>
);