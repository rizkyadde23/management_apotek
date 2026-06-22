"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type RoleName =
  | "ADMIN"
  | "OWNER"
  | "APOTEKER";

interface Role {
  id: number;
  name: RoleName;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: Role;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: RoleName | null;

  loading: boolean;

  isAuthenticated: boolean;

  isAdmin: boolean;
  isOwner: boolean;
  isApoteker: boolean;

  login: (
    token: string,
    user: User
  ) => void;

  logout: () => void;

  refreshUser: (
    user: User
  ) => void;

  hasRole: (
    role: RoleName
  ) => boolean;

  hasAnyRole: (
    roles: RoleName[]
  ) => boolean;
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
      localStorage.getItem(
        "auth_token"
      );

    const savedUser =
      localStorage.getItem(
        "auth_user"
      );

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      setUser(
        JSON.parse(savedUser)
      );
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

    setToken(null);
    setUser(null);

    window.location.href = "/login";

  };

  const refreshUser = (
    newUser: User
  ) => {

    setUser(newUser);

    localStorage.setItem(
      "auth_user",
      JSON.stringify(newUser)
    );

  };

  const role =
    user?.role?.name ?? null;

  const hasRole = (
    roleName: RoleName
  ) => {

    return role === roleName;

  };

  const hasAnyRole = (
    roles: RoleName[]
  ) => {

    return role
      ? roles.includes(role)
      : false;

  };

  const value =
    useMemo(
      () => ({

        user,

        token,

        role,

        loading,

        isAuthenticated:
          !!token,

        isAdmin:
          role === "ADMIN",

        isOwner:
          role === "OWNER",

        isApoteker:
          role === "APOTEKER",

        login,

        logout,

        refreshUser,

        hasRole,

        hasAnyRole,

      }),
      [
        user,
        token,
        role,
        loading,
      ]
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);