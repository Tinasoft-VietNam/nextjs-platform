import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không đúng định dạng'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(20, 'Mật khẩu không được quá 20 ký tự'),
});

// Trích xuất Type từ Schema để dùng cho TypeScript
export type LoginInput = z.infer<typeof loginSchema>;