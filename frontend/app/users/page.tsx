"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User } from "@/types/user";

export default function UsersPage() {
  const [users, setUsers] =
    useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const response =
      await api.get("/users");

    setUsers(
      response.data.data.data
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">
        Users
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2">
              Name
            </th>

            <th className="border p-2">
              Email
            </th>

            <th className="border p-2">
              Role
            </th>

            <th className="border p-2">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">
                {user.name}
              </td>

              <td className="border p-2">
                {user.email}
              </td>

              <td className="border p-2">
                {user.role?.name ??
                  "No Role"}
              </td>

              <td className="border p-2">
                {user.is_active
                  ? "Active"
                  : "Inactive"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}