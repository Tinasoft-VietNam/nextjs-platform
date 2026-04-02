import axios from "axios";

const api = axios.create({ baseURL: "https://dummyjson.com" });
export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
}
export const userService = {
    getUsers: async () => {
        const response = await api.get("/users?limit=0");
        return response.data;
    },
    createUser: async (data: User) => {
        const response = await api.post("users/add", data);
        return response.data;
    },
    deleteUser: async (id: string) => {
        const response = await api.delete(`users/${id}`);
        return response.data;
    },
    updateUser: async ({ id, data }: { id: number, data: any }) => {
        const response = await api.put(`users/${id}`, data);
        return response.data;
    }
}