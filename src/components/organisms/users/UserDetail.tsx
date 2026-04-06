"use client"
import React from "react";
import { useUserById } from "@/hooks/queries/useUsers";
import { Descriptions, Skeleton, Tag } from "antd";

export default function UserDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const { data: user, isLoading } = useUserById(id);

    if (isLoading) return <Skeleton active style={{ padding: 24 }} />
    if (!user) return <div>Không tìm thấy user</div>

    return (
        <div>
            <h1>{`User detail page ${id}`}</h1>
            <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="Tên">{user.firstName} {user.lastName}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Điện thoại">{user.phone}</Descriptions.Item>
                <Descriptions.Item label="Tuổi">{user.age}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">{user.gender}</Descriptions.Item>
                <Descriptions.Item label="Nhóm máu">{user.bloodGroup}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{user.birthDate}</Descriptions.Item>
                <Descriptions.Item label="Công ty">{user.company?.name}</Descriptions.Item>
                <Descriptions.Item label="Chức vụ">{user.company?.title}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                    {user.address?.address}, {user.address?.city}, {user.address?.country}
                </Descriptions.Item>
                <Descriptions.Item label="Vai trò">
                    <Tag color={user.role === 'admin' ? 'red' : 'default'}>{user.role}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Đại học">{user.university}</Descriptions.Item>
            </Descriptions>
        </div>
    )
}