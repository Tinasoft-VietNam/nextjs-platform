'use client';

import { Menu } from 'antd';
import { UserOutlined, SettingOutlined, HomeOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { Children } from 'react';

export const SideBar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: 'Trang chủ',
        },
        {
            key: '/users',
            icon: <UserOutlined />,
            label: 'Người dùng',
            children: [
                { key: "/users", label: "Danh sách" },
                { key: "/users/create", label: "Thêm mới" }
            ]
        },
        {
            key: '/products',

            label: 'Sản phẩm',
        }
    ];

    return (
        <div style={{ width: 256, minHeight: '100vh', backgroundColor: '#fff', borderRight: '1px solid #f0f0f0' }}>
            <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold', color: '#1677ff' }}>
                LOGO
            </div>
            <Menu
                mode="inline"
                selectedKeys={[pathname]}
                items={menuItems}
                onClick={({ key }) => router.push(key)}
                style={{ borderRight: 0 }}
            />
        </div>
    );
};