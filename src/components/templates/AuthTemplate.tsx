// src/components/templates/AuthTemplate.tsx
import * as React from 'react';

export const AuthTemplate = ({ children, title }: { children: React.ReactNode, title: string }) => (
  <main className='flex min-h-screen items-center justify-center bg-gray-50 px-4'>
    <div className='w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg'>
      <div className='text-center'>
        <h2 className='text-3xl font-bold tracking-tight text-gray-900'>{title}</h2>
      </div>
      {children}
    </div>
  </main>
);