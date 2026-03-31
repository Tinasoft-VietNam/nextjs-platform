"use client"; // Bắt buộc trong Next.js App Router khi dùng hooks

import React, { useState, useMemo, useTransition } from 'react';
import { Table } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import type { GetProp, TableProps } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query'; // Import TanStack Query

// Import các Molecules
import TableToolbar from '../../molecules/TableToolbar';
import ActionButtons from '../../molecules/ActionButton';
import CreateModal from './CreateModal';

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

// 1. Tách hàm fetch ra ngoài (queryFn)
const fetchUsers = async (queryString: string): Promise<ApiResponse<DataType>> => {
  const response = await fetch(`/api/data?${queryString}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export default function UserTableOrganism() {
  const router = useRouter();
  
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

  // Tạo chuỗi query string từ tableParams
  const queryString = toURLSearchParams(getRandomuserParams(tableParams)).toString();

  // 2. Thay thế useEffect và useState bằng useQuery
  const { 
    data: queryData, 
    isFetching, // Dùng isFetching thay vì isLoading để UI table mượt hơn khi chuyển trang
  } = useQuery({
    queryKey: ['users', queryString], // Mỗi khi queryString đổi, API sẽ tự fetch lại
    queryFn: () => fetchUsers(queryString),
    placeholderData: keepPreviousData, // Giữ data cũ trên màn hình trong lúc fetch data mới (tránh chớp bảng)
  });

  const handleSearch = (value: string) => {
    setSearchText(value);
    
    // Reset về trang 1 khi search
    setTableParams(prev => ({
      ...prev,
      search: value,
      pagination: {
        ...prev.pagination,
        current: 1
      }
    }));
    
    // Cập nhật URL
    router.push(`?${queryString}&search=${encodeURIComponent(value)}`);
  };

  const handleAddNew = () => setIsModalCreateOpen(true);

  const handleEdit = (record: DataType) => {
    console.log("Sửa user:", record.name);
  };

  const handleDelete = (recordKey: string) => {
    // TẠM THỜI: Vẫn để log. 
    // LƯU Ý: Với TanStack Query, chỗ này bạn nên dùng useMutation để gọi API xóa, 
    // sau đó gọi queryClient.invalidateQueries({ queryKey: ['users'] }) để bảng tự update.
    console.log("Cần gọi API xóa ID:", recordKey);
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
        columns={columns}
        // 3. Lấy data trực tiếp từ queryData
        dataSource={queryData?.data || []} 
        pagination={{
          ...tableParams.pagination,
          // 4. Lấy total từ queryData để Antd tính số trang
          total: queryData?.total || 0, 
        }}
        // Dùng isFetching của React Query kết hợp isPending của UI transition
        loading={isFetching || isPendingUI} 
        onChange={handleTableChange}
        className="overflow-hidden"
        rowKey="id" // Sửa lại thành _id khớp với DataType
      />
      
      <CreateModal 
        isModalCreateOpen={isModalCreateOpen} 
        setIsModalCreateOpen={setIsModalCreateOpen} 
      />
    </div>
  );
}