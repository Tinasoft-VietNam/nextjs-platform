import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/app/api/auth/service";
import { useRouter } from "next/navigation";

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ username, password }: any) => authService.login(username, password),
        onSuccess: (data) => {
            document.cookie = `access_token=${data.accessToken}; path=/; max-age=${60 * 60 * 24};`;
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
            router.push("/");
        },
    });
};

export const useLogout = () => {
    const router = useRouter();
    return () => {
        document.cookie = `access_token=; path=/; max-age=0;`;
        router.push("/login");
    };
};
const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
}
export const useGetMe = () => {
    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: () => {
            const token = getCookie('access_token');
            if (!token) throw new Error("No Token");
            return authService.getMe(token);
        },
        retry: false,

    })
}
