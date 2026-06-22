"use client";

import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export default function SupplierFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
      });
    } else {
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
  }, [open, initialData]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      <div className="max-w-3xl mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b px-6 py-5">
            <h2 className="text-2xl font-bold text-slate-900">
              {initialData ? "Edit Supplier" : "Tambah Supplier"}
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Kelola informasi supplier
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Nama Supplier
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
                  Nomor Telepon
                </label>

                <input
                  name="phone"
                  value={form.phone}
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

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">
                  Alamat
                </label>

                <textarea
                  rows={4}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 p-3 text-black focus:border-blue-500 focus:outline-none"
                />
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
