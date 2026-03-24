import * as React from 'react';

type HomeTemplateProps = {
  hero: React.ReactNode;
  footer: React.ReactNode;
};

export const HomeTemplate = ({ hero, footer }: HomeTemplateProps) => {
  return (
    <main>
      <section className='bg-white'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
          {hero}
          <footer className='absolute bottom-2 text-gray-700'>
            {footer}
          </footer>
        </div>
      </section>
    </main>
  );
};