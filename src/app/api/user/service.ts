import axios from "axios";

const api = axios.create({ baseURL: "https://dummyjson.com" });
export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
}

const USERS_CACHE_KEY = "dummy_users_cache";

const getLocalUsers = (): { users: User[] } | null => {
    if (typeof window !== "undefined") {
        const stored = localStorage.getItem(USERS_CACHE_KEY);
        if (stored) return JSON.parse(stored);
    }
    return null;
}

const setLocalUsers = (data: { users: User[] }) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(data));
    }
}

export const userService = {
    getUsers: async () => {
        const localData = getLocalUsers();
        if (localData) {
            return localData; // Lấy từ localStorage nếu đã có
        }

        const response = await api.get("/users?limit=0");
        const data = response.data;
        setLocalUsers(data); // Lần đầu lưu vào localStorage
        return data;
    },
    createUser: async (data: User) => {
        const localData = getLocalUsers() || { users: [] };

        // Tạo ID mới giả lập DB
        const newId = new Date().getTime();
        const newUser = { ...data, id: newId };

        // Thêm vào đầu danh sách
        localData.users = [newUser, ...localData.users];
        setLocalUsers(localData);

        return newUser;
    },
    deleteUser: async (id: string | number) => {
        const localData = getLocalUsers();
        if (localData) {
            localData.users = localData.users.filter(u => u.id.toString() !== id.toString());
            setLocalUsers(localData);
        }
        return { id };
    },
    updateUser: async ({ id, data }: { id: number, data: any }) => {
        const localData = getLocalUsers();
        let updatedUser = { ...data, id };
        if (localData) {
            localData.users = localData.users.map(u => {
                if (u.id.toString() === id.toString()) {
                    updatedUser = { ...u, ...data };
                    return updatedUser;
                }
                return u;
            });
            setLocalUsers(localData);
        }
        return updatedUser;
    }
}