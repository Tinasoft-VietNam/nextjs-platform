'use client';
import { UserTable } from '@/components/organisms/users/UserTable';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
export default function UserPage() {
    const router = useRouter();
    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
                <Button type="primary" onClick={() => router.push('/users/create')}>Thêm mới</Button>
            </div>
            <UserTable />
        </div>
    )
}