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

// FIX: it
export interface Chat {
  id: string;
  name: string;
  adminID: string | null;
  groupIcon: string | null;
  type: ChatType;
  createdAt: Date;
  updatedAt: Date;
  creator: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    email: string;
  } | null;
  participants:
    | {
        chatID: string;
        participantID: string;
        role: "admin" | "participant";
        joinedAt: Date;
      }[]
    | undefined;
}

// FIX: this and the response from the server
export interface Message {
  id: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  chatID: string;
  senderID: string;
  content: string | null;
  attachmentUrl: string | null;
  messageType: "text" | "image" | "video" | "file" | null;
  messageStatus: {
    updatedAt: Date | null;
    userID: string;
    status: "sent" | "delivered" | "seen" | null;
    messageID: number;
  }[];
  sender: {
    id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    username: string;
    email: string;
    passwordHash: string;
  }[];
}
