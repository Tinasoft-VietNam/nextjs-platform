import NotFoundContent from '@/components/organisms/NotFoundContent';
import { HomeTemplate } from '@/components/templates/HomeTemplate';
import { Metadata } from 'next';
import * as React from 'react';


export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  // throw new Error("Test trang Error nè!");
  return (
    <HomeTemplate 
      hero ={<NotFoundContent />}
      footer={<p>© {new Date().getFullYear()} Your Project</p>}
    />
    // <main>
    //   <section className='bg-white'>
    //     <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
    //       <RiAlarmWarningFill
    //         size={60}
    //         className='drop-shadow-glow animate-flicker text-red-500'
    //       />
    //       <h1 className='mt-8 text-4xl md:text-6xl'>Page Not Found</h1>
    //       <a href='/'>Back to home</a>
    //     </div>
    //   </section>
    // </main>
  );
}
