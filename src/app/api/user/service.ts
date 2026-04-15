import axios from "axios";

const api = axios.create({ baseURL: "https://dummyjson.com" });
export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    age?: number;
    gender?: string;
    phone?: string;
    username?: string;
    birthDate?: string;
    bloodGroup?: string;
    height?: number;
    weight?: number;
    eyeColor?: string;
    hair?: { color: string; type: string };
    address?: {
        address: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
    };
    company?: {
        name: string;
        department: string;
        title: string;
    };
    university?: string;
    role?: string;
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
    getUsers: async ({ sortBy, order }: { sortBy?: string | null, order?: string | null } = {}) => {
        let usersData;
        const localData = getLocalUsers();
        if (localData) {
            usersData = localData; // Lấy từ localStorage nếu đã có
        } else {
            const response = await api.get("/users?limit=0");
            usersData = response.data;
            setLocalUsers(usersData); // Lần đầu lưu vào localStorage
        }

        const users = [...usersData.users];
        if (sortBy && order) {
            users.sort((a: any, b: any) => {
                const valA = a[sortBy];
                const valB = b[sortBy];
                if (valA < valB) return order === 'asc' ? -1 : 1;
                if (valA > valB) return order === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return { ...usersData, users };
    },
    createUser: async (data: User) => {
        const localData = getLocalUsers() || { users: [] };
        const newId = new Date().getTime();
        const newUser = { ...data, id: newId };

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
    },
    getUserById: async (id: string | number): Promise<User> => {
        const localData = getLocalUsers();
        if (localData) {
            const user = localData.users.find(u => u.id.toString() === id.toString());
            if (user) {
                if (user.age || user.phone) return user;
            }
        }
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    searchUsers: async ({ q, limit, skip, sortBy, order }: { q: string, limit: number, skip: number, sortBy?: string | null, order?: string | null }) => {
        const params: any = { q, limit, skip };
        if (sortBy) params.sortBy = sortBy;
        if (order) params.order = order;
        const response = await api.get("/users/search", { params })
        return response.data as { users: User[], total: number, skip: number, limit: number }
    }
}