import { Metadata } from 'next';
import { LoginForm } from '@/components/organisms/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Đăng nhập vào hệ thống',
};

export default function LoginPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f2f5' }}>
      <LoginForm />
    </main>
  );
}
