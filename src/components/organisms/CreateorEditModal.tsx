'use client'

import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface Props {
  isOpen: boolean;
  initialData: any | null; // Nếu null là Thêm, nếu có data là Sửa
  onCancel: () => void;
  onSubmit: (values: any) => void;
  isLoading: boolean;
}

const CreateOrEditModal = ({ isOpen, initialData, onCancel, onSubmit, isLoading }: Props) => {
  const [form] = Form.useForm();

  // Mỗi khi mở Modal hoặc đổi user cần sửa, reset lại giá trị của Form
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.setFieldsValue(initialData); // Đổ dữ liệu cũ vào form để sửa
      } else {
        form.resetFields(); // Xóa sạch form để thêm mới
      }
    }
  }, [isOpen, initialData, form]);

  return (
    <Modal
      title={initialData ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}> Hủy </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={isLoading} 
          onClick={() => form.submit()}
        >
          {initialData ? "Cập nhật" : "Tạo mới"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit} // Khi bấm submit, gọi hàm onSubmit truyền từ cha xuống
      >
        <Form.Item
          name="name"
          label="Họ và Tên"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input placeholder="example@gmail.com" />
        </Form.Item>

        <Form.Item name="city" label="Thành phố">
          <Input placeholder="Hà Nội" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrEditModal;