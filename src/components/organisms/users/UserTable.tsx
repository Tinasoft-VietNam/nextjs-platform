'use client'
import { Table, Input, Space } from 'antd';
import { useSearchUsers, useUsers } from '@/hooks/queries/useUsers';
import { Button, Popconfirm } from 'antd';
import { useDeleteUser } from '@/hooks/queries/useUsers';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
const { Search } = Input;
export const UserTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sortBy = searchParams.get('sortBy');
    const order = searchParams.get('order');

    const { data, isLoading: loadingUsers, isError } = useUsers({
        sortBy,
        order
    });
    const { mutate: deleteUser } = useDeleteUser();
    const pathname = usePathname();
    const q = searchParams.get('q');
    const limit = Number(searchParams.get('limit'));
    const skip = Number(searchParams.get('skip'));
    const handleSearch = (value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('q', value);
            params.set('limit', '0');
            params.set('skip', '0');
        } else {
            params.delete('q');
        }
        router.push(`${pathname}?${params.toString()}`);
    }

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        const params = new URLSearchParams(searchParams);

        const sortField = sorter.field;
        const sortOrder = sorter.order;

        if (sortOrder) {
            params.set('sortBy', sortField as string);
            params.set('order', sortOrder === 'ascend' ? 'asc' : 'desc');
        } else {
            params.delete('sortBy');
            params.delete('order');
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const { data: searchData, isLoading: loadingSearch } = useSearchUsers({ q: q || "", limit, skip, sortBy, order });
    const isSearching = !!q;
    const isLoading = isSearching ? loadingSearch : loadingUsers;
    const dataSource = isSearching ? searchData?.users : data?.users;
    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Tên', dataIndex: 'firstName', sorter: true },
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
    return (
        <Space orientation='vertical' style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Search
                    placeholder="Tìm kiếm theo Tên hoặc Họ..."
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                />
            </div>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={dataSource}
                loading={isLoading}
                pagination={{ pageSize: 10, showSizeChanger: false }}
                onChange={handleTableChange}
            />
        </Space>
    );
};