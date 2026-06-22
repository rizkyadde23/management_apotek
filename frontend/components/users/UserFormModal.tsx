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

  const [roles, setRoles] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
  });

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
        role_id: initialData.role_id || initialData.role?.id || "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        password: "",
        role_id: "",
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b px-6 py-5">
            <h2 className="text-2xl font-bold text-slate-900">
              {initialData ? "Edit User" : "Tambah User"}
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Kelola data pengguna sistem
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Nama
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 p-3 text-black focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 p-3 text-black focus:border-blue-500 focus:outline-none"
                />
              </div>

              {!initialData && (
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 p-3 text-black focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Role
                </label>

                <select
                  name="role_id"
                  value={form.role_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 p-3 text-black focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Pilih Role</option>

                  {roles.map((role: any) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 border-t pt-5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
