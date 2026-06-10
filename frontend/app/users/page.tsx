"use client";

import { useEffect, useState } from "react";

import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api/users";

import { User } from "@/types/user";

import UserFormModal from "@/components/users/UserFormModal";
import DeleteUserModal from "@/components/users/DeleteUserModal";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData: any) {
    try {
      await createUser(formData);

      setOpenForm(false);

      await loadData();
    } catch (error) {
      console.error(error);

      alert("Gagal menambah user");
    }
  }

  async function handleUpdate(formData: any) {
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, formData);

      setOpenForm(false);

      await loadData();
    } catch (error) {
      console.error(error);

      alert("Gagal update user");
    }
  }

  async function handleDelete() {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);

      setOpenDelete(false);

      await loadData();
    } catch (error) {
      console.error(error);

      alert("Gagal menghapus user");
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Users</h1>

        <button
          onClick={() => {
            setSelectedUser(null);

            setOpenForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Tambah User
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg p-2 w-full text-black"
      />

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 text-left">Nama</th>

              <th className="p-3 text-left">Email</th>

              <th className="p-3 text-left">Role</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-3 text-black">{user.name}</td>

                <td className="p-3 text-black">{user.email}</td>

                <td className="p-3 text-black">{user.role?.name ?? "-"}</td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_active ? "Aktif" : "Non Aktif"}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);

                        setOpenForm(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setSelectedUser(user);

                        setOpenDelete(true);
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={selectedUser ? handleUpdate : handleCreate}
        initialData={selectedUser || undefined}
      />

      <DeleteUserModal
        open={openDelete}
        userName={selectedUser?.name || ""}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
