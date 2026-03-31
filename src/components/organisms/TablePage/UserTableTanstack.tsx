"use client"; // Bắt buộc trong Next.js App Router khi dùng hooks

import React, { useState, useMemo, useTransition } from 'react';
import { Table } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import type { GetProp, TableProps } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'; // Import TanStack Query
import { message, Modal } from 'antd';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/api/userApi';
// Import các Molecules
import TableToolbar from '../../molecules/TableToolbar';
import ActionButtons from '../../molecules/ActionButton';
import CreateModal from './CreateModal';

import CreateOrEditModal from '../CreateorEditModal';
// Định nghĩa kiểu dữ liệu
type DataType = {
  id: string;
  name: string;
  email: string;
  city: string;
};

type ApiResponse<T> = {
  page: number;
  limit: number;
  total: number;
  data: DataType[];
};

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
  search?: string;
}

// Hàm Helpers giữ nguyên
const toURLSearchParams = <T extends Record<string, any>>(record: T) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    params.append(key, value);
  }
  return params;
};

const getRandomuserParams = (params: TableParams) => {
  const { pagination, filters, sortField, sortOrder, ...restParams } = params;
  const result: Record<string, any> = {};
  result.limit = pagination?.pageSize;
  result.page = pagination?.current;
  if (sortField) {
    result.orderby = sortField;
    result.order = sortOrder === 'ascend' ? 'asc' : 'desc';
  }
  Object.entries(restParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      result[key] = value;
    }
  });
  return result;
};


export default function UserTableOrganism() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<DataType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Chỉ giữ lại các state quản lý UI và Params
  const [isPendingUI, startTransition] = useTransition();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [searchText, setSearchText] = useState('');
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  // search and read query params tu URL de sync voi state
  const queryString = toURLSearchParams(getRandomuserParams(tableParams)).toString();
  const { data: queryData, isFetching } = useQuery({
    queryKey: ['users', queryString],
    queryFn: () => fetchUsers(queryString),
  });

  // add new
  const addMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Làm mới bảng
      message.success('Thêm người dùng thành công!');
      setIsModalOpen(false);
    },
  });

  //edit
  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Cập nhật thành công!');
      setIsModalOpen(false);
      setEditingUser(null);
    },
  });

  // delete
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Đã xóa người dùng');
    },
  });

//   const handleSearch = (value: string) => {
//     setSearchText(value);
    
//     // Reset về trang 1 khi search
//     setTableParams(prev => ({
//       ...prev,
//       search: value,
//       pagination: {
//         ...prev.pagination,
//         current: 1
//       }
//     }));
    
//     // Cập nhật URL
//     router.push(`?${queryString}&search=${encodeURIComponent(value)}`);
//   };
  const handleSearch = (value: string) => {
    setTableParams(prev => ({ ...prev, search: value, pagination: { ...prev.pagination, current: 1 } }));
  };
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa?',
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const handleEdit = (record: DataType) => {
    setEditingUser(record);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<DataType> = useMemo(() => [
    {
      title: 'ID',
      dataIndex: 'id', // Lưu ý: theo DataType của bạn là _id, hãy cẩn thận check lại API trả về _id hay id
      key: 'id',
      className: 'font-medium text-gray-700',
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      className: 'font-medium text-gray-700',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
      key: 'email',
    },
    {
      title: 'Thành phố',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: DataType) => (
        <ActionButtons 
          onEdit={() => handleEdit(record)} 
          onDelete={() => handleDelete(record.id)} 
        />
      ),
    },
  ], []);

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    startTransition(() => {
      setTableParams({
        pagination,
        filters,
        sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
        sortField: Array.isArray(sorter) ? undefined : sorter.field,
        search: searchText,
      });
      // Cập nhật URL khi chuyển trang/sort
      router.push(`?${toURLSearchParams(getRandomuserParams({
        pagination,
        filters,
        sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
        sortField: Array.isArray(sorter) ? undefined : sorter.field,
        search: searchText,
      })).toString()}`);
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <TableToolbar
        title="Danh sách người dùng"
        onSearch={handleSearch} 
        onAddNew={handleAddNew}
      />

      <Table
        loading={isFetching || deleteMutation.isPending}
        columns={columns}
        // 3. Lấy data trực tiếp từ queryData
        dataSource={queryData?.data || []} 
        pagination={{
          ...tableParams.pagination,
          // 4. Lấy total từ queryData để Antd tính số trang
          total: queryData?.total || 0, 
        }}
        // Dùng isFetching của React Query kết hợp isPending của UI transition
        onChange={handleTableChange}
        className="overflow-hidden"
        rowKey="id" // Sửa lại thành _id khớp với DataType
      />
      
      <CreateOrEditModal 
        isOpen={isModalOpen}
        initialData={editingUser}
        onCancel={() => setIsModalOpen(false)}
        isLoading={addMutation.isPending || updateMutation.isPending}
        onSubmit={(values) => {
          if (editingUser) {
            // Nếu có editingUser -> Gọi API Update
            updateMutation.mutate({ ...values, _id: editingUser.id });
          } else {
            // Nếu không có -> Gọi API Create
            addMutation.mutate(values);
          }
        }}
      />

    </div>
  );
}