import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/app/api/user/service";

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: userService.getUsers,
    })
}
export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.createUser,
        onSuccess: (newData) => {
            // queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.setQueryData(["users"], (oldData: any) => {
                return {
                    ...oldData,

                    users: [newData, ...(oldData?.users || [])],
                };
            });
        }
    })
}
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.deleteUser,
        onSuccess: (data, deletedId) => {
            // queryClient.invalidateQueries({ queryKey: ["users"] })
            queryClient.setQueryData(["users"], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    users: oldData.users.filter((u: any) => u.id !== deletedId),
                };
            });
        }
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: userService.updateUser,
        onSuccess: (updatedData) => {
            queryClient.setQueryData(["users"], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    users: oldData.users.map((u: any) =>
                        u.id === updatedData.id ? updatedData : u
                    ),
                };
            });
        }
    })
}

export const useUserById = (id: string | number) => {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => userService.getUserById(id),
        enabled: !!id,
    })
}