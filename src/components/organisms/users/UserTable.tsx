'use client'
import { Table, Input, Space } from 'antd';
import { useUsers } from '@/hooks/queries/useUsers';
import { Button, Popconfirm } from 'antd';
import { useDeleteUser } from '@/hooks/queries/useUsers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
const { Search } = Input;
export const UserTable = () => {
    const router = useRouter();
    const { data, isLoading, isError } = useUsers();
    const { mutate: deleteUser } = useDeleteUser();
    const [searchText, setSearchText] = useState('');
    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Tên', dataIndex: 'firstName', sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName) },
        { title: 'Họ', dataIndex: 'lastName' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Avatar', dataIndex: 'image', render: (text: string) => <img src={text} alt="avatar" width={50} height={50} /> },
        {
            title: 'Hành động',
            render: (_: any, record: any) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button onClick={() => router.push(`/users/edit/${record.id}`)}>Sửa</Button>
                    <Popconfirm title="Xóa?" onConfirm={() => deleteUser(record.id)}>
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                    <Button onClick={() => router.push(`/users/${record.id}`)}>Chi tiết</Button>
                </div>
            ),
        },
    ];

    if (isError) return <div>Lỗi tải dữ liệu! </div>;
    let filteredData = data?.users || [];
    if (searchText) {
        filteredData = filteredData.filter((user: any) => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            return fullName.includes(searchText.toLowerCase());
        });
    }
    return (
        <Space orientation='vertical' style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm theo Tên hoặc Họ..."
                    allowClear
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
            </div>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={filteredData}
                loading={isLoading}
                pagination={{ pageSize: 10, showSizeChanger: false }}
            />
        </Space>
    );
};