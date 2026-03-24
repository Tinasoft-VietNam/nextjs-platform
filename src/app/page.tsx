// src/app/page.tsx
'use client';

import { HomeTemplate } from '@/components/templates/HomeTemplate';
import { HeroSection } from '@/components/organisms/HeroSection';
import UnderlineLink from '@/components/atoms/links/UnderlineLink';

export default function HomePage() {
  return (
    <HomeTemplate 
      hero={<HeroSection />}
      footer={
        <>
          © {new Date().getFullYear()} By{' '}
          <UnderlineLink href='https://theodorusclarence.com'>
            Theodorus Clarence
          </UnderlineLink>
        </>
      }
    />
  );
}