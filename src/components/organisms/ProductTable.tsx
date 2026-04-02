'use client'
import { useProducts } from "@/hooks/queries/useProducts"
import { Table } from "antd"
export const ProductTable = () => {
    const { data, isLoading, isError } = useProducts();
    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Tên', dataIndex: 'title' },
        { title: 'Giá', dataIndex: 'price' },
        { title: 'Loại', dataIndex: 'category' },
        { title: 'Thương hiệu', dataIndex: 'brand' },
        { title: 'Đánh giá', dataIndex: 'rating' },
    ]
    return (
        <div>
            <h1>Product Table</h1>
            <Table
                rowKey="id"
                columns={columns}
                dataSource={data?.products}
                loading={isLoading}
                pagination={{ pageSize: 10, showSizeChanger: false }}
            />
        </div>
    )
}