"use client";

import { User } from "@/types/user";

import { Pencil, Trash2, Shield, UserCheck, UserX } from "lucide-react";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export default function UserTable({ users, onEdit, onDelete }: Props) {
  function getRoleColor(role?: string) {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-700";

      case "OWNER":
        return "bg-purple-100 text-purple-700";

      case "APOTEKER":
        return "bg-green-100 text-green-700";

      case "KASIR":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                User
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Role
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="
                    border-b
                    transition-colors
                    hover:bg-slate-50
                  "
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {user.name}
                      </p>

                      <p className="text-xs text-slate-500">ID #{user.id}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-700">{user.email}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-medium
                        ${getRoleColor(user.role?.name)}
                      `}
                    >
                      <Shield size={14} />

                      {user.role?.name ?? "-"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {user.is_active ? (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-full
                          bg-green-100
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-green-700
                        "
                      >
                        <UserCheck size={14} />
                        Active
                      </span>
                    ) : (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-full
                          bg-red-100
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-red-700
                        "
                      >
                        <UserX size={14} />
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="
                          rounded-lg
                          bg-amber-500
                          p-2
                          text-white
                          transition
                          hover:bg-amber-600
                        "
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => onDelete(user)}
                        className="
                          rounded-lg
                          bg-red-500
                          p-2
                          text-white
                          transition
                          hover:bg-red-600
                        "
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
