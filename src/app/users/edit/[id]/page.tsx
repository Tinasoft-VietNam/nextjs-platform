'use client';

import { UserForm } from "@/components/organisms/users/UserForm";
import { useUsers } from "@/hooks/queries/useUsers";
import { useParams } from "next/navigation";
import { Spin } from "antd";

export default function EditUserPage() {
    const params = useParams();
    const id = params?.id as string;
    const { data, isLoading } = useUsers();

    if (isLoading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

    const user = data?.users?.find((u: any) => u.id.toString() === id);

    if (!user) return <div style={{ textAlign: 'center', padding: '50px' }}>Không tìm thấy User</div>;

    return (
        <div style={{ padding: '24px' }}>
            <UserForm initialValues={user} />
        </div>
    );
}
