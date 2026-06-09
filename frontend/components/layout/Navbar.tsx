"use client";

import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;

  role?: {
    name: string;
  };
}

export default function Navbar() {
  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {
    const saved =
      localStorage.getItem("auth_user");

    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  return (
    <header className="bg-white border-b px-6 h-16 flex items-center justify-between">
      <h1 className="font-bold text-lg">
        Management Apotek
      </h1>

      <div className="text-right">
        <p className="font-medium">
          {user?.name}
        </p>

        <p className="text-sm text-gray-500">
          {user?.role?.name}
        </p>
      </div>
    </header>
  );
}