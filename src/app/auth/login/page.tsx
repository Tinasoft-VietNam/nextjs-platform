import { LoginForm } from "@/components/organisms/LoginFormTw";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { UnderlineLink } from "@/components/molecules/Links";

const LoginPage = () => {
    return (
        <>
            <AuthTemplate title="Welcome back">
                <LoginForm />
                <p className='text-center text-sm text-gray-600'>
                    Chưa có tài khoản?{' '}
                    <UnderlineLink href='/auth/register'>Đăng ký ngay</UnderlineLink>
                </p>
            </AuthTemplate>
        </>
    )
}
export default LoginPage;