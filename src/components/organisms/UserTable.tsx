"use client";

import React, { useState } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// Import các Molecules
import TableToolbar from '../molecules/TableToolbar';
import ActionButtons from '../molecules/ActionButton';



// Định nghĩa kiểu dữ liệu
interface DataType {
  key: string;
  name: string;
  age: number;
  status: 'Active' | 'Inactive';
}

export default function UserTableOrganism() {
  const [data, setData] = useState<DataType[]>([
    { key: '1', name: 'Nguyễn Văn A', age: 22, status: 'Active' },
    { key: '2', name: 'Trần Thị B', age: 20, status: 'Inactive' },
    { key: '3', name: 'Lê Văn C', age: 25, status: 'Active' },
  ]);

  // Hàm xử lý logic cho Molecules
  const handleSearch = (value: string) => {
    console.log("Searching for:", value);
  };

  const handleAddNew = () => {
    console.log("Mở modal thêm mới");
  };

  const handleEdit = (record: DataType) => {
    console.log("Sửa user:", record.name);
  };

  const handleDelete = (recordKey: string) => {
    setData(prev => prev.filter(item => item.key !== recordKey));
  };

  // Cấu hình các cột cho bảng
  const columns: ColumnsType<DataType> = [
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
      key: 'name',
      className: 'font-medium text-gray-700', 
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'} className="rounded-full px-3">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      // Nhúng Molecule ActionButtons vào cột này
      render: (_, record) => (
        <ActionButtons 
          onEdit={() => handleEdit(record)} 
          onDelete={() => handleDelete(record.key)} 
        />
      ),
    },
  ];

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
        pagination={{ pageSize: 5 }}
        className="overflow-hidden" 
      />
    </div>
  );
}