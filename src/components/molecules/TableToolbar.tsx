import React from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

interface TableToolbarProps {
  title: string;
  onSearch: (value: string) => void;
  onAddNew: () => void;
}
const TableToolbar =({ title, onSearch, onAddNew }: TableToolbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <Input 
          placeholder="Tìm kiếm..." 
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAddNew}
          className="bg-blue-600 hover:bg-blue-700" // Ép style Tailwind nếu cần
        >
          Thêm mới
        </Button>
      </div>
    </div>
  );
}
export default TableToolbar;