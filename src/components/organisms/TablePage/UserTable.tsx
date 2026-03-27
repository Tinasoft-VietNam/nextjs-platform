"use client";

import React, { useEffect, useState, useMemo, useTransition } from 'react';
import { Table, Tag } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import type { GetProp, TableProps } from 'antd';
import { useRouter } from 'next/navigation';

// Import các Molecules
import TableToolbar from '../../molecules/TableToolbar';
import ActionButtons from '../../molecules/ActionButton';
import CreateModal from './CreateModal';



// type Row = {
//   id: string | number;
//   name?: string;
//   email?: string;
//   city?: string;
//   avatar?: string;
// };

// Định nghĩa kiểu dữ liệu
type DataType = {
  _id: string;
  name: string;
  email: string;
  city: string;
}
type ApiResponse<T> = {
  page: number;
  limit: number;
  total: number;
  data: DataType[];
};
type ColumnsType<T extends object = object> = TableProps<T>['columns']; type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
  search?: string;
}

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
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [searchText, setSearchText] = useState('');

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  // const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  // const [dataEdit, setDataEdit] = useState<DataType | null>(null);
  // Hàm xử lý logic cho Molecules
  const handleSearch = (value: string) => {
    // console.log("Searching for:", value);
    // if(searchText === ""){
    //   setTableParams(prev => ({
    //     ...prev,
    //     pagination: {
    //       ...prev.pagination,
    //       current: 1
    //     }
    //   }));
    // }
    setSearchText(value);
    router.push(`?${params.toString()}&search=${encodeURIComponent(value)}`);
  };


  const handleAddNew = () => {
    console.log("Mở modal thêm mới");
    setIsModalCreateOpen(true);
  };

  const handleEdit = (record: DataType) => {
    console.log("Sửa user:", record.name);
    // setDataEdit(record);
    // setIsModalEditOpen(true);
  };

  const handleDelete = (recordKey: string) => {
    setData(prev => prev.filter(item => item._id !== recordKey));
  };
  // columns of table is re-render when sort so we use useMemo() to control
  const columns: ColumnsType<DataType> = useMemo(() =>
    [
      {
        title: 'ID',
        dataIndex: 'id',
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
        // Nhúng Molecule ActionButtons vào cột này
        render: (_: any, record: DataType) => (
          <ActionButtons
            onEdit={() => handleEdit(record)}
            onDelete={() => handleDelete(record._id)}
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
        search: searchText ,
      });

      // `dataSource` is useless since `pageSize` changed
      if (pagination.pageSize !== tableParams.pagination?.pageSize) {
        setData([]);
      }
    });
  };

  const params = toURLSearchParams(getRandomuserParams(tableParams));
  const fetchData = () => {
    setLoading(true);
    fetch(`/api/data?${params.toString()}`)
      .then(response => response.json())
      .then((data: ApiResponse<DataType>) => {
        setData(data.data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: data.total
          }
        });
        router.push(`?${params.toString()}`);
        // console.log("Fetched data:", data);
      });
  }

  useEffect(fetchData, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
  ]);


  return (
    // Wrap toàn bộ organism bằng Tailwind để tạo khung
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">

      {/* Nhúng Molecule Toolbar */}
      <TableToolbar
        title="Danh sách người dùng"
        onSearch={handleSearch}
        onAddNew={handleAddNew}
      />

      {/* Bảng dữ liệu chính */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={isPending}
        onChange={handleTableChange}
        className="overflow-hidden"
        rowKey="id"
      />
      <CreateModal isModalCreateOpen={isModalCreateOpen} setIsModalCreateOpen={setIsModalCreateOpen} />
    </div>
  );
}