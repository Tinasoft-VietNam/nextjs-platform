import axios from "axios";

export const authApi = axios.create({ baseURL: "https://dummyjson.com" });

export const authService = {
    login: async (username: string, password: string) => {
        const response = await authApi.post("/auth/login", {
            username,
            password,
            expiresInMins: 60,
        });
        return response.data;
    },
    getMe: async (token: string) => {
        const response = await authApi.get("auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};
