import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/app/api/user/service";

export const useUsers = ({ sortBy, order }: { sortBy?: string | null, order?: string | null } = {}) => {
    return useQuery({
        queryKey: ["users", sortBy, order],
        queryFn: () => userService.getUsers({ sortBy, order }),
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

export const useSearchUsers = ({ q, limit, skip, sortBy, order }: { q: string, limit: number, skip: number, sortBy?: string | null, order?: string | null }) => {
    return useQuery({
        queryKey: ["users", "search", q, limit, skip, sortBy, order],
        queryFn: () => userService.searchUsers({ q, limit, skip, sortBy, order }),
        enabled: !!q,
    })
}