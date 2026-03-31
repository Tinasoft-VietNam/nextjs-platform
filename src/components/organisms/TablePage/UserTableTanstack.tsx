"use client";

import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { Modal, Spin, Table, message } from 'antd';
import type { TableProps } from 'antd';
import {
    useInfiniteQuery,
    useQueryClient,
    useMutation
} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

import { fetchUsers, createUser, updateUser, deleteUser } from '@/api/userApi';
import TableToolbar from '../../molecules/TableToolbar';
import ActionButtons from '../../molecules/ActionButton';
import CreateOrEditModal from '../CreateorEditModal';

// --- TYPES ---
type DataType = {
    id: string | number;
    name: string;
    email: string;
    city: string;
};

type UsersResponse = {
    total: number;
    data: DataType[];
    page?: number;
    limit?: number;
};

interface TableParams {
    pagination?: { current: number; pageSize: number };
    sortField?: string | any;
    sortOrder?: string | any;
    filters?: any;
    search?: string;
}

// --- CONSTANTS ---
const CHUNK_SIZE = 100;

export default function UserTableOrganismTan() {
    const queryClient = useQueryClient();
    const { ref, inView } = useInView(); 

    const [editingUser, setEditingUser] = useState<DataType | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPendingUI, startTransition] = useTransition();
    const [searchText, setSearchText] = useState('');

    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: { current: 1, pageSize: 10 },
    });

    // --- 1. INFINITE QUERY LOGIC ---
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
    } = useInfiniteQuery<UsersResponse>({
        queryKey: ['users', tableParams.pagination?.current, tableParams.pagination?.pageSize, tableParams.search, tableParams.sortField, tableParams.sortOrder],
        queryFn: async ({ pageParam = 0 }) => {
            const pageSize = Math.max(1, tableParams.pagination?.pageSize || 10);
            const currentPage = Math.max(1, tableParams.pagination?.current || 1);
            const baseOffset = (currentPage - 1) * pageSize;

            const loadedInCurrentBigPage = pageParam as number;
            const remaining = pageSize - loadedInCurrentBigPage;
            const limit = Math.min(CHUNK_SIZE, remaining);
            const currentOffset = baseOffset + loadedInCurrentBigPage;

            const params = new URLSearchParams({
                offset: currentOffset.toString(),
                limit: limit.toString(),
                search: tableParams.search || '',
                orderby: tableParams.sortField || 'id', // FIX: Đặt mặc định sắp xếp theo id
                // FIX: Mặc định là 'asc' (tăng dần) nếu không có yêu cầu descend
                order: tableParams.sortOrder === 'descend' ? 'desc' : 'asc', 
            });

            return fetchUsers(params.toString());
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const pageSize = Math.max(1, tableParams.pagination?.pageSize || 10);
            const currentPage = Math.max(1, tableParams.pagination?.current || 1);
            const baseOffset = (currentPage - 1) * pageSize;

            const loadedInCurrentBigPage = allPages.reduce((sum, page) => sum + (page.data?.length || 0), 0);

            if (loadedInCurrentBigPage >= pageSize) return undefined;
            if (baseOffset + loadedInCurrentBigPage >= lastPage.total) return undefined;

            return loadedInCurrentBigPage;
        },
    });

    const flatData = useMemo(() => data?.pages.flatMap((page) => page.data) || [], [data]);

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // --- 2. MUTATIONS ---
    const addMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            message.success('Thêm thành công!');
            setIsModalOpen(false);
        },
        onError: (error: any) => message.error(error.message || 'Lỗi khi thêm!'),
    });

    const updateMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            message.success('Cập nhật thành công!');
            setIsModalOpen(false);
            setEditingUser(null);
        },
        onError: (error: any) => message.error(error.message || 'Lỗi khi cập nhật!'),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onMutate: async (id: DataType['id']) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });

            const previous = queryClient.getQueriesData({ queryKey: ['users'] });

            previous.forEach(([queryKey, cached]) => {
                if (!cached || typeof cached !== 'object') return;
                const cachedAny = cached as any;
                if (!Array.isArray(cachedAny.pages)) return;

                let removed = 0;
                const nextPages = cachedAny.pages.map((page: any) => {
                    if (!page?.data || !Array.isArray(page.data)) return page;
                    const before = page.data.length;
                    const nextData = page.data.filter((u: any) => String(u.id) !== String(id));
                    removed += before - nextData.length;
                    return before === nextData.length ? page : { ...page, data: nextData };
                });

                if (removed <= 0) return;

                const currentTotal = Number(cachedAny.pages?.[0]?.total ?? cachedAny.total ?? 0);
                const nextTotal = Math.max(0, currentTotal - removed);
                const nextPagesWithTotal = nextPages.map((page: any) =>
                    page && typeof page === 'object' ? { ...page, total: nextTotal } : page
                );

                queryClient.setQueryData(queryKey, { ...cachedAny, pages: nextPagesWithTotal });
            });

            return { previous };
        },
        onError: (error: any, _id, context) => {
            context?.previous?.forEach(([queryKey, cached]) => {
                queryClient.setQueryData(queryKey, cached);
            });
            message.error(error?.message || 'Lỗi khi xóa!');
        },
        onSuccess: () => {
            message.success('Đã xóa thành công');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    // --- 3. EVENT HANDLERS ---
    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    // Debounce search để gõ không giật và giảm số lần query
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            startTransition(() => {
                setTableParams(prev => ({
                    ...prev,
                    search: searchText,
                    pagination: { ...prev.pagination!, current: 1 },
                }));
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchText, startTransition]);

    const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
        startTransition(() => {
            const sort = Array.isArray(sorter) ? undefined : sorter;
            setTableParams({
                pagination: { current: pagination.current!, pageSize: pagination.pageSize! },
                filters,
                sortOrder: sort?.order,
                sortField: sort?.field as string,
                search: tableParams.search,
            });
        });
    };

    const handleDelete = useCallback((user: DataType) => {
        Modal.confirm({
            title: 'Xác nhận xóa người dùng?',
            content: (
                <div className="space-y-1">
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                </div>
            ),
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: () => deleteMutation.mutateAsync(user.id),
        });
    }, [deleteMutation]);

    // FIX: Đưa columns ra ngoài render cycle bằng useMemo để chống re-render lag máy.
    // Bắt buộc phải thêm width cho từng cột khi dùng virtualization.
    const columns = useMemo(() => [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
        { title: 'Name', dataIndex: 'name', key: 'name', sorter: true, width: 250 },
        { title: 'Email', dataIndex: 'email', key: 'email', sorter: true, width: 300 },
        { title: 'City', dataIndex: 'city', key: 'city', width: 200 },
        {
            title: 'Action',
            key: 'action',
            width: 150,
            render: (_: number, record: DataType) => (
                <ActionButtons
                    onEdit={() => { setEditingUser(record); setIsModalOpen(true); }}
                    onDelete={() => handleDelete(record)}
                />
            ),
        },
    ], [handleDelete]);

    const isMainLoading = isFetching && !isFetchingNextPage;
    const isSoftBusy = isPendingUI || isMainLoading;

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <TableToolbar
                title="Danh sách người dùng (Hybrid Load)"
                onSearch={handleSearch}
                onAddNew={() => { setEditingUser(null); setIsModalOpen(true); }}
            />

            <div className={`transition-opacity duration-200 ${isSoftBusy ? 'opacity-70' : 'opacity-100'}`}>
                <Table
                    // FIX: Bật prop virtual
                    virtual
                    // FIX: Đặt kích thước cố định bằng số để ảo hóa tính toán được
                    scroll={{ y: 600, x: 1000 }}
                    // FIX: Sử dụng columns đã bọc useMemo
                    columns={columns}
                    dataSource={flatData}
                    // Loading có delay để tránh nháy khi chuyển trang/sort/search
                    loading={{ spinning: isMainLoading, delay: 200 }}
                    pagination={{
                        ...tableParams.pagination,
                        total: data?.pages[0]?.total ?? 0,
                        pageSizeOptions: [5, 10, 50, 100, 1000, 10000, 50000],
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng cộng ${total.toLocaleString()} bản ghi`,
                    }}
                    onChange={handleTableChange}
                    rowKey="id"
                    footer={() => (
                        <div ref={ref} className="text-center py-2 min-h-[40px]">
                            {isFetchingNextPage ? <Spin size="small" tip="Loading more..." /> : null}
                            {!hasNextPage && flatData.length > 0 && <span className="text-gray-400">Đã tải hết</span>}
                        </div>
                    )}
                />
            </div>

            <CreateOrEditModal
                isOpen={isModalOpen}
                initialData={editingUser}
                onCancel={() => setIsModalOpen(false)}
                isLoading={addMutation.isPending || updateMutation.isPending}
                onSubmit={(values) => {
                    if (editingUser) {
                        updateMutation.mutate({ ...values, id: editingUser.id });
                    } else {
                        addMutation.mutate(values);
                    }
                }}
            />
        </div>
    );
}