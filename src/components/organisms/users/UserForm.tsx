'use client';

import { Form, Input, Button, Card, Space } from 'antd';
import { useCreateUser, useUpdateUser } from '@/hooks/queries/useUsers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User } from '@/app/api/user/service';

export const UserForm = ({ initialValues }: { initialValues?: User }) => {
    const router = useRouter();
    const { mutate: createUser, isPending: isCreating } = useCreateUser();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
    const [form] = Form.useForm();

    const isEditMode = !!initialValues;

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleFinish = (values: User) => {
        if (isEditMode) {
            updateUser({ id: initialValues.id, data: values }, {
                onSuccess: () => {
                    router.push('/');
                }
            });
        } else {
            createUser(values, {
                onSuccess: () => {
                    router.push('/');
                }
            });
        }
    }

    return (
        <Card title={isEditMode ? "Cập nhật User" : "Tạo User"} style={{ maxWidth: 600, margin: '0 auto' }}>
            <Form form={form} onFinish={handleFinish} layout='vertical'>
                <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="image" label="Image (URL)" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                        {isEditMode ? "Cập nhật" : "Tạo mới"}
                    </Button>
                    <Button onClick={() => router.push('/')}>
                        Hủy
                    </Button>
                </Space>
            </Form>
        </Card>
    );
}
