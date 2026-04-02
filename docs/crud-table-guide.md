# Hướng Dẫn Từng Tính Năng: Table CRUD với Ant Design & TanStack Query

Hướng dẫn này chia quá trình làm thành từng **Chặng (Milestone)**. Cuối mỗi chặng, bạn sẽ có thể chạy thử (Test) chức năng đó lên UI để đảm bảo nó hoạt động rồi mới làm tiếp.

---

## 🚀 Chặng 1: Xây dựng bộ khung và Hiển thị danh sách (READ)

**Mục tiêu:** Cài đặt thư viện, gọi API lấy dữ liệu và hiển thị lên bảng Ant Design.

### Bước 1: Cài đặt và Bọc Provider
1. Chạy lệnh: `pnpm add axios @tanstack/react-query antd @ant-design/icons zustand`
2. Tại file cao nhất (ví dụ `app/layout.tsx` hoặc 1 client component bọc ngoài), thêm thẻ `<QueryClientProvider client={new QueryClient()}>`.

### Bước 2: Chuẩn bị hàm Axios
Tạo file `src/api/user.service.ts`:
```ts
import axios from 'axios';
const api = axios.create({ baseURL: 'https://64...mockapi.io/api/v1' }); // Thay bằng API của bạn

export const userApi = {
  getUsers: () => api.get('/users').then(res => res.data),
};
```

### Bước 3: Tạo Hook gọi Query
Tạo file `src/hooks/queries/useUsers.ts`:
```ts
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.service';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'], 
    queryFn: userApi.getUsers,
  });
};
```

### Bước 4: Tạo 컴포넌트 (Component) Bảng
Tạo `src/components/organisms/UserTable.tsx`:
```tsx
'use client';
import { Table } from 'antd';
import { useUsers } from '@/hooks/queries/useUsers';

export const UserTable = () => {
  const { data, isLoading, isError } = useUsers();

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Tên', dataIndex: 'name' },
  ];

  if (isError) return <div>Lỗi tải dữ liệu!</div>;

  return <Table rowKey="id" columns={columns} dataSource={data} loading={isLoading} />;
};
```

👉 **TEST LẦN 1:** Thêm `<UserTable />` vào `app/page.tsx` và chạy `pnpm dev`. Bạn sẽ thấy bảng hiển thị cột ID và Tên kèm hiệu ứng loading tự động của Antd. Nếu bảng ra số liệu, xin chúc mừng! Bạn qua được cửa đầu.

---

## 🚀 Chặng 2: Tính năng Thêm Mới (CREATE)

**Mục tiêu:** Mở Modal điền form, lưu lại, và bảng phải tự động reset (có dữ liệu mới).

### Bước 1: Viết hàm API và Hook Mutation
Tại `src/api/user.service.ts`:
```ts
  createUser: (data: any) => api.post('/users', data).then(res => res.data),
```
Tại `src/hooks/queries/useUsers.ts`:
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
// ... (như cũ)

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      // Khi API trả về OK, bắt bảng 'users' tải lại DỮ LIỆU TỰ ĐỘNG!
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

### Bước 2: Setup Zustand Store cho Form Modal
Tạo `src/store/useModalStore.ts`:
```ts
import { create } from 'zustand';

type ModalState = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
```

### Bước 3: Xây Modal Form
Tạo `src/components/organisms/UserFormModal.tsx`:
```tsx
'use client';
import { Modal, Form, Input } from 'antd';
import { useModalStore } from '@/store/useModalStore';
import { useCreateUser } from '@/hooks/queries/useUsers';

export const UserFormModal = () => {
  const { isOpen, closeModal } = useModalStore();
  const { mutate: createUser, isPending } = useCreateUser();
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    createUser(values, {
      onSuccess: () => {
        form.resetFields(); // dọn sạch form
        closeModal();       // Đóng UI
      }
    });
  };

  return (
    <Modal title="Thêm User" open={isOpen} onCancel={closeModal} onOk={form.submit} confirmLoading={isPending}>
      <Form form={form} onFinish={handleFinish} layout="vertical">
        <Form.Item name="name" label="Tên"><Input /></Form.Item>
      </Form>
    </Modal>
  );
};
```

👉 **TEST LẦN 2:** 
- Render cái Nút Bấm: `<Button onClick={() => openModal()}>Thêm mới</Button>`.
- Vứt `<UserFormModal />` vào cùng chỗ với `<UserTable />` trong file `page.tsx`.
- Thử bấm "Thêm mới" -> điền Tên -> Lưu -> Data trong bảng tự động nhảy lên thành dòng mới (Không dùng useState bắt update bảng). Hoàn thành Chặng 2.

---

## 🚀 Chặng 3: Tính năng Xóa (DELETE)

**Mục tiêu:** Bấm Xóa 1 dòng -> API trừ dữ liệu -> Bảng reload.

### Bước 1: Mutation API
File api: `deleteUser: (id: string) => api.delete('/users/' + id),`
File hook:
```ts
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
```

### Bước 2: Gắn action Xóa vào Bảng
Mở lại `UserTable.tsx`, sửa đoạn `columns`:
```tsx
import { Button, Popconfirm } from 'antd';
import { useDeleteUser } from '@/hooks/queries/useUsers';

// ...trong component
const { mutate: deleteUser } = useDeleteUser();

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: 'Tên', dataIndex: 'name' },
  {
    title: 'Hành động',
    render: (_, record) => (
      <Popconfirm title="Xóa nha?" onConfirm={() => deleteUser(record.id)}>
        <Button danger>Xóa</Button>
      </Popconfirm>
    ),
  },
];
```

👉 **TEST LẦN 3:** Click nút Xoá trên dòng của bảng, kiểm tra xem nó có biến mất khỏi bảng và DB chưa.

---

## 🚀 Chặng 4: Tính năng Sửa (UPDATE) - Nâng cao Zustand

**Mục tiêu:** Bấm Sửa trên bảng -> Bật Modal Form đang có dữ liệu tương ứng lên -> Sửa -> Lưu.

### Bước 1: Nâng cấp Modal Store
Vào `useModalStore.ts`, thêm `selectedRecord`:
```ts
type ModalState = {
  isOpen: boolean;
  selectedRecord: any | null;      // Lưu dòng chọn lưu
  openModal: (record?: any) => void; 
  closeModal: () => void;
};
export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  selectedRecord: null,
  openModal: (record = null) => set({ isOpen: true, selectedRecord: record }),
  closeModal: () => set({ isOpen: false, selectedRecord: null }),
}));
```

### Bước 2: Hook Update
File api: `updateUser: ({id, data}) => api.put('/users/' + id, data),`
File hook: `useUpdateUser` (viết tương tự Create, nhớ invalidate).

### Bước 3: Nút Sửa gọi Store
Mở `UserTable.tsx`, thêm nút sửa vào `columns`:
```tsx
import { useModalStore } from '@/store/useModalStore';
// ... trong component
const { openModal } = useModalStore();

// Cột hành động:
  <Button onClick={() => openModal(record)}>Sửa</Button>
  <Popconfirm ...> <Button danger>Xóa</Button> </Popconfirm>
```

### Bước 4: Sửa Form Modal để đọc Record cũ
Mở `UserFormModal.tsx`, lắng nghe biến `selectedRecord` và tự điền form:
*Dùng thuộc tính của Form Ant Design: `useEffect` (đây là lúc hy hữu cần dùng useEffect để set lại value cho form do Form API Ant Design chứ k hẳn do State)*

```tsx
import { useEffect } from 'react';

const { isOpen, closeModal, selectedRecord } = useModalStore();
const isEditMode = !!selectedRecord;

useEffect(() => {
  if (isOpen) {
    if (isEditMode) form.setFieldsValue(selectedRecord); // Điền dữ liệu cũ vào form
    else form.resetFields();
  }
}, [isOpen, selectedRecord, form]);

const handleFinish = (values: any) => {
  if (isEditMode) {
     updateUser({ id: selectedRecord.id, data: values }, { onSuccess: closeModal });
  } else {
     createUser(values, { onSuccess: closeModal });
  }
};
```

👉 **TEST CUỐI:** Nhấn Sửa -> Modal nhúng data -> Đổi tên -> Bấm OK -> Dữ liệu bảng đổi tức khắc. Form đã thông minh, hỗ trợ cả 2 chế độ Thêm và Sửa!
