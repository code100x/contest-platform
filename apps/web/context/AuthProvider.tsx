"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  getAuthStateSSR,
  getTokenExpiration,
} from "@/lib/auth";
import { BACKEND_URL } from "@/config/index";
import axios from "axios"

interface AuthContextType {
  user: any;
  accessToken: string | null;
  logout: () => Promise<void>;
  loading: boolean;
  login: (userData: any, token: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string| null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const clearAuth = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("user");
    console.log("Auth Reset!")
  }

  const logout = async () => {
    try { 
      await axios.post(`${BACKEND_URL}/api/v1/user/signout`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.log("Failed to logout - backend:", error);
    }
    
    console.log("Clearing frontend auth state");
    clearAuth();
  };

  const scheduleTokenRefresh = async (token: string) => {
    const exp = getTokenExpiration(token);
    if (exp === null) {
      console.warn("Token expiration could not be determined.");
      return;
    }
    const now = Date.now();
    const delay = exp - now - 5000;

    if (delay > 0) {
      setTimeout(async () => {
        try {
          const data = await getAuthStateSSR();
          if (data) {
            setAccessToken(data.accessToken);
            setUser(data.user);
          } else {
            console.warn("Token refresh failed, resetting auth!");
            clearAuth();
          }
        } catch (err) {
          console.error("Token refresh error:", err);
          clearAuth()
        }
      }, delay);
    }
  };

  const initAuth = async () => {
    setLoading(true);
    try {
      const data = await getAuthStateSSR();
      if (!data) {
        throw new Error("AuthProvider - initAuth Error");
      }
      setAccessToken(data.accessToken);
      const localData = localStorage.getItem("user");
      setUser(localData ? JSON.parse(localData) : null);
      // setUser(data.user);
      scheduleTokenRefresh(data.accessToken);
    } catch (error) {
      console.log("Auth init Error:", error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: any, token: string) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    
    scheduleTokenRefresh(token);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const value: AuthContextType = {
    user, 
    accessToken,
    logout,
    loading,
    login
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}