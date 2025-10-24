import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axiosInstance, { setAccessToken } from "@/api";
import type { AuthContextType, User } from "@/types";
import type { RegisterUser, LoginUser } from "@/schema";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  console.log("User: ", user);

  const signup = async (data: RegisterUser) => {
    const response = await axiosInstance.post("/auth/register", data);
    setAccessToken(response.data.accessToken);
    await fetchUser();
  };

  const login = async (data: LoginUser) => {
    const response = await axiosInstance.post("/auth/login", data);
    console.log("Login Response: ", response);
    setAccessToken(response.data.accessToken);
    await fetchUser();
  };

  const logout = async () => {
    await axiosInstance.get("/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  const fetchUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/users/me", {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user details: ", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // on page refresh restore the session
    const restoreSession = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/auth/refresh", {
          withCredentials: true,
        });
        setAccessToken(response.data.accessToken);
        await fetchUser();
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{ register: signup, login, logout, user, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth() must be used inside Auth provider");
  }

  return context;
};
