import NotFoundContent from '@/components/organisms/common/NotFoundContent';
import { Metadata } from 'next';
import * as React from 'react';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <NotFoundContent />
      <footer style={{ marginTop: '20px' }}>
        <p>© {new Date().getFullYear()} Your Project</p>
      </footer>
    </div>
  );
}
