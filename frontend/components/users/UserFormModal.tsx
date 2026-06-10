"use client";

import { useEffect, useState } from "react";

import { getRoles } from "@/lib/api/roles";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export default function UserFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    const response = await getRoles();
    setRoles(response);
  }

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        role_id: initialData.role_id || "",
      });
    }
  }, [open, initialData]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await onSubmit(form);

      onClose();
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-black mb-5">
          {initialData ? "Edit User" : "Tambah User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
            className="border rounded p-2 w-full text-black"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded p-2 w-full text-black"
          />

          {!initialData && (
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border rounded p-2 w-full text-black"
            />
          )}

          <select
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            className="border rounded p-2 w-full text-black"
          >
            <option value="">Pilih Role</option>

            {roles.map((role: any) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
