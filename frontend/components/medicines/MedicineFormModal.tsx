"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/categories";
import { getSuppliers } from "@/lib/api/suppliers";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export default function MedicineFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    supplier_id: "",
    category_id: "",
    code: "",
    batch_number: "",
    name: "",
    description: "",
    type: "GENERIC",
    stock: 0,
    minimum_stock: 10,
    price: 0,
    expired_date: "",
    is_active: true,
  });

  useEffect(() => {
    if (!open) return;

    loadMasterData();

    if (initialData) {
      setForm({
        ...initialData,
      });
    }
  }, [open, initialData]);

  async function loadMasterData() {
    try {
      const categoryRes = await getCategories();
      const supplierRes = await getSuppliers();

      setCategories(categoryRes);
      setSuppliers(supplierRes);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
    <div className="fixed inset-0 bg-black/50 overflow-y-auto z-50">
      <div className="max-w-3xl mx-auto bg-white mt-10 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {initialData ? "Edit Obat" : "Tambah Obat"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-slate-700">Supplier</label>

            <select
              name="supplier_id"
              value={form.supplier_id}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full text-black"
            >
              <option value="">Pilih Supplier</option>

              {suppliers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-slate-700">Kategori</label>

            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full text-black"
            >
              <option value="">Pilih Kategori</option>

              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <input
            name="code"
            placeholder="Kode Obat"
            value={form.code}
            onChange={handleChange}
            className="border rounded-lg p-2 text-black"
          />

          <input
            name="batch_number"
            placeholder="Batch Number"
            value={form.batch_number}
            onChange={handleChange}
            className="border rounded-lg p-2 text-black"
          />

          <input
            name="name"
            placeholder="Nama Obat"
            value={form.name}
            onChange={handleChange}
            className="border rounded-lg p-2 text-black"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded-lg p-2 text-black"
          >
            <option value="GENERIC">GENERIC</option>

            <option value="NON_GENERIC">NON GENERIC</option>
          </select>

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="border rounded-lg p-2 text-black"
          />

          <input
            type="number"
            name="minimum_stock"
            placeholder="Minimum Stock"
            value={form.minimum_stock}
            onChange={handleChange}
            className="border rounded-lg p-2 text-black"
          />

          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={form.price}
            onChange={handleChange}
            className="border rounded-lg p-2 text-black"
          />

          <input
            type="date"
            name="expired_date"
            value={form.expired_date?.split("T")[0]}
            onChange={handleChange}
            className="border rounded-lg p-2 text-black"
          />

          <textarea
            name="description"
            placeholder="Deskripsi"
            value={form.description}
            onChange={handleChange}
            className="border rounded-lg p-2 col-span-2 text-black"
          />

          <div className="col-span-2 flex justify-end gap-2">
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
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
