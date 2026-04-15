'use client';

import { Form, Input, Button, Card, Alert } from 'antd';
import { useLogin } from '@/hooks/queries/useAuth';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';

export const LoginForm = () => {
    const { mutate: login, isPending } = useLogin();
    const [errorMsg, setErrorMsg] = useState("");

    const onFinish = (values: any) => {
        setErrorMsg("");
        login(values, {
            onError: (err: any) => {
                setErrorMsg(err?.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.");
            }
        });
    };

    return (
        <Card title="Hệ thống Quản trị" style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 16 }} />}
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username (Thử: emilys)" size="large" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password (Thử: emilyspass)"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={isPending} block size="large">
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};
