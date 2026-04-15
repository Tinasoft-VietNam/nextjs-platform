'use client';

import { Form, Input, Button, Card, Space } from 'antd';
import { useCreateUser, useUpdateUser } from '@/hooks/queries/useUsers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@/app/api/user/service';

export const UserForm = ({ initialValues }: { initialValues?: User }) => {
    const router = useRouter();
    const { mutate: createUser, isPending: isCreating } = useCreateUser();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
    const [form] = Form.useForm();

    const [isDirty, setIsDirty] = useState(false);
    const isEditMode = !!initialValues;
    const imageValue = Form.useWatch('image', form);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = ''; // Trình duyệt yêu cầu gán chuỗi rỗng để hiển thị hộp thoại cảnh báo mặc định
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleFinish = (values: User) => {
        setIsDirty(false); // Reset lại trạng thái để tránh chặn người dùng nếu họ submit thành công
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
            <Form form={form} onFinish={handleFinish} onValuesChange={() => setIsDirty(true)} layout='vertical'>
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
                {imageValue && (
                    <div style={{ marginBottom: 24 }}>
                        <img 
                            src={imageValue} 
                            alt="Preview" 
                            style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8, border: '1px solid #d9d9d9' }} 
                        />
                    </div>
                )}
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
