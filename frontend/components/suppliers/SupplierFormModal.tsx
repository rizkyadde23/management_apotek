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
  const [loading, setLoading] =
    useState(false);

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {initialData
            ? "Edit Supplier"
            : "Tambah Supplier"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="name"
            placeholder="Nama Supplier"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-black"
            required
          />

          <input
            name="phone"
            placeholder="Nomor Telepon"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-black"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-black"
          />

          <textarea
            name="address"
            placeholder="Alamat"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 text-black"
            rows={3}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded-lg"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {loading
                ? "Menyimpan..."
                : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}