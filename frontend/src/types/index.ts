import type { LoginUser, RegisterUser } from "@/schema";

export interface User {
    displayName: string;
    email: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userDetail: any;
}

export interface AuthContextType {
    user: User | null,
    loading: boolean,
    register: (data: RegisterUser) => Promise<void>,
    login: (data: LoginUser) => Promise<void>,
    logout: () => Promise<void>
}