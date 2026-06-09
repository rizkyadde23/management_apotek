"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [ready, setReady] =
    useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem(
        "auth_token"
      );

    if (!token) {
      router.push("/login");
      return;
    }

    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}