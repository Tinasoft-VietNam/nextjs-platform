'use client';

import { createContext, useContext, ReactNode } from "react";
import { useGetMe } from "@/hooks/queries/useAuth";

interface AuthContextType {
    user: any | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: user } = useGetMe();

    return (
        <AuthContext.Provider value={{ user: user || null }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
