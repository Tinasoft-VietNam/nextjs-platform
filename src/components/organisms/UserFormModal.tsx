'use client';

import { Modal, Form, Input } from 'antd';
import { useModalStore } from '@/store/useModalStore';
import { useCreateUser, useUpdateUser } from '@/hooks/queries/useUsers';
import { useEffect } from 'react';
export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
}
export const UserFormModal = () => {
    const { isOpen, closeModal, selectedRecord } = useModalStore();
    const { mutate: createUser, isPending: isCreating } = useCreateUser();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
    const [form] = Form.useForm();

    const isEditMode = !!selectedRecord;

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                form.setFieldsValue(selectedRecord);
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, selectedRecord, form]);

    const handleFinish = (values: User) => {
        if (isEditMode) {
            updateUser({ id: selectedRecord.id, data: values }, {
                onSuccess: () => {
                    closeModal();
                }
            });
        } else {
            createUser(values, {
                onSuccess: () => {
                    form.resetFields();
                    closeModal();
                }
            });
        }
    }
    return (
        <Modal title={isEditMode ? "Cập nhật User" : "Tạo User"} open={isOpen} onCancel={closeModal} onOk={form.submit} confirmLoading={isCreating || isUpdating}>
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
                <Form.Item name="image" label="Image" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}