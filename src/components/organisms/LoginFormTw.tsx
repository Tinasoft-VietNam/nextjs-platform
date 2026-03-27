'use client'
import { useForm } from 'react-hook-form';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
// validate
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/zod/auth'
export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors, isLoading } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema), // "Cắm" Zod vào đây
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginInput) => {
    // Data lúc này đã được Zod đảm bảo đúng định dạng
    console.log('Dữ liệu chuẩn:', data);
    // Giả lập gọi API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Xử lý API ở đây
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 w-full max-w-sm'>
      <FormField 
        label="Email"
        type="email"
        placeholder="your@email.com"
        error={errors.email?.message as string}
        {...register('email', { required: 'Email là bắt buộc' })}
      />
      <FormField 
        label="Mật khẩu"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message as string}
        {...register('password', { required: 'Mật khẩu là bắt buộc' })}
      />
      <Button type="submit" variant="primary" className='w-full justify-center' isLoading={isLoading}>
        Đăng nhập
      </Button>
    </form>
  );
};