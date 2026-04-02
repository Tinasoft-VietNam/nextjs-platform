// src/app/page.tsx
'use client';
import { UserTable } from '@/components/organisms/UserTable';
import { useModalStore } from '@/store/useModalStore';
import { Button } from 'antd/es/radio';
import { UserFormModal } from '@/components/organisms/UserFormModal';

export default function HomePage() {
  const { openModal } = useModalStore();
  return (
    <div><Button onClick={() => openModal()}>Thêm mới</Button>
      <UserTable />
      <UserFormModal />
    </div>
  )
}