'use client';

import clsx from 'clsx';
import React from 'react';


import { Button } from '@/components/atoms/Button';
import { ArrowLink } from '@/components/molecules/Links';
import { ColorSection } from '@/components/organisms/ComponentPage/ColorSection';
import { useComponentTheme } from '@/hooks/useComponentTheme';
// import { LinkSection } from '@/components/organisms/ComponentPage/LinkSection';
// import { ImageSection } from '@/components/organisms/ComponentPage/ImageSection';
// import { ButtonSection } from '@/components/organisms/ComponentPage/ButtonSection';
// import { SkeletonSection } from '@/components/organisms/ComponentPage/SkeletonSection';

import { LinkSection, ImageSection, ButtonSection, SkeletonSection } from '@/components/organisms/ComponentPage';
import UserTableOrganism from '@/components/organisms/TablePage/UserTable';


export default function ComponentPage() {
  const theme = useComponentTheme();

  return (
    <main>
      <section
        className={clsx(theme.mode === 'dark' ? 'bg-dark' : 'bg-white', theme.color)}
      >
        <div
          className={clsx(
            'layout min-h-screen py-20',
            theme.mode === 'dark' ? 'text-white' : 'text-black'
          )}
        >
          <h1>Built-in Components</h1>
          <ArrowLink direction='left' className='mt-2' href='/'>
            Back to Home
          </ArrowLink>

          <div className='mt-8 flex flex-wrap gap-2'>
            <Button
              onClick={theme.toggleMode}
              variant={theme.mode === 'dark' ? 'light' : 'dark'}
            >
              Set to {theme.mode === 'dark' ? 'light' : 'dark'}
            </Button>
            {/* <Button onClick={randomize}>Randomize CSS Variable</Button> */}
          </div>

          <ol className='mt-8 space-y-6'>
            <ColorSection {...theme} />
            <LinkSection textColor={theme.textColor} />

            <ButtonSection mode={theme.mode} textColor={theme.textColor} />

            {/*Image*/}
            <ImageSection textColor={theme.textColor} />
            {/*Skeleton*/}
            <SkeletonSection textColor={theme.textColor} />
            <UserTableOrganism />
          </ol>
        </div>
      </section>
    </main>
  );
}
