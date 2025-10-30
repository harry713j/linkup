import type { ChatType, LoginUser, RegisterUser } from "@/schema";

export interface UserDetail {
  displayName: string | null;
  bio: string | null;
  userID: string;
  status: boolean;
  profileUrl: string | null;
  updatedAt: Date;
}

export interface User {
  username: string;
  email: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userDetail: UserDetail;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (data: RegisterUser) => Promise<void>;
  login: (data: LoginUser) => Promise<void>;
  logout: () => Promise<void>;
}

export interface PaginatedResponse<T> {
  data: Array<T>;
  meta: {
    pages: number;
    page: number;
    total: number;
    limit: number;
  };
}

export type ChatCardType = {
  id: string;
  name: string;
  type: ChatType;
  icon: string | null;
};
