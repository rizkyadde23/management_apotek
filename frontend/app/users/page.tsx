"use client";

import { useEffect, useState } from "react";

import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api/users";

import { User } from "@/types/user";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import PrimaryButton from "@/components/ui/PrimaryButton";

import UserStats from "@/components/users/UserStats";
import UserTable from "@/components/users/UserTable";

import UserFormModal from "@/components/users/UserFormModal";
import DeleteUserModal from "@/components/users/DeleteUserModal";

import { Plus } from "lucide-react";

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
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Navbar />

          <div className="p-6">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <PageHeader
              title="Users"
              description="Manage system users and permissions."
              action={
                <PrimaryButton
                  onClick={() => {
                    setSelectedUser(null);
                    setOpenForm(true);
                  }}
                >
                  <Plus size={18} className="mr-2" />
                  Add User
                </PrimaryButton>
              }
            />

            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search user..."
            />

            <UserStats users={users} />

            <UserTable
              users={filteredUsers}
              onEdit={(user) => {
                setSelectedUser(user);

                setOpenForm(true);
              }}
              onDelete={(user) => {
                setSelectedUser(user);

                setOpenDelete(true);
              }}
            />
          </div>
        </main>
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
