"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role?: {
    id: number;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (
    token: string,
    user: User
  ) => void;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const savedToken =
      localStorage.getItem("auth_token");

    const savedUser =
      localStorage.getItem("auth_user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = (
    token: string,
    user: User
  ) => {
    localStorage.setItem(
      "auth_token",
      token
    );

    localStorage.setItem(
      "auth_user",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(
      "auth_token"
    );

    localStorage.removeItem(
      "auth_user"
    );

    setUser(null);
    setToken(null);

    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);