"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

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
        supplier_id: initialData.supplier_id ?? "",
        category_id: initialData.category_id ?? "",
        code: initialData.code ?? "",
        batch_number: initialData.batch_number ?? "",
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        type: initialData.type ?? "GENERIC",
        stock: initialData.stock ?? 0,
        minimum_stock: initialData.minimum_stock ?? 10,
        price: initialData.price ?? 0,
        expired_date: initialData.expired_date ?? "",
        is_active: initialData.is_active ?? true,
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

  const inputClass = `
    w-full
    rounded-xl
    border
    border-slate-300
    px-4
    py-3
    text-slate-900
    outline-none
    transition
    focus:border-blue-500
    focus:ring-4
    focus:ring-blue-100
  `;

  const labelClass = `
    mb-2
    block
    text-sm
    font-medium
    text-slate-700
  `;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-sm
        p-4
      "
    >
      <div
        className="
          w-full
          max-w-5xl
          rounded-3xl
          bg-white
          shadow-2xl
          border
          border-slate-200
          overflow-hidden
          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {initialData ? "Edit Medicine" : "Add Medicine"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage medicine information and inventory data.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              p-2
              text-slate-500
              transition
              hover:bg-slate-100
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="
            grid
            grid-cols-1
            gap-5
            p-8
            md:grid-cols-2
          "
        >
          {/* Supplier */}
          <div>
            <label className={labelClass}>Supplier</label>

            <select
              name="supplier_id"
              value={form.supplier_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Supplier</option>

              {suppliers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>

            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Category</option>

              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Code */}
          <div>
            <label className={labelClass}>Medicine Code</label>

            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="MED-001"
              className={inputClass}
            />
          </div>

          {/* Batch */}
          <div>
            <label className={labelClass}>Batch Number</label>

            <input
              name="batch_number"
              value={form.batch_number}
              onChange={handleChange}
              placeholder="BATCH-001"
              className={inputClass}
            />
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>Medicine Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Paracetamol"
              className={inputClass}
            />
          </div>

          {/* Type */}
          <div>
            <label className={labelClass}>Medicine Type</label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="GENERIC">Generic</option>
              <option value="NON_GENERIC">Non Generic</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className={labelClass}>Current Stock</label>

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Minimum Stock */}
          <div>
            <label className={labelClass}>Minimum Stock</label>

            <input
              type="number"
              name="minimum_stock"
              value={form.minimum_stock}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Price */}
          <div>
            <label className={labelClass}>Price (Rp)</label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Expired Date */}
          <div>
            <label className={labelClass}>Expired Date</label>

            <input
              type="date"
              name="expired_date"
              value={form.expired_date ? form.expired_date.split("T")[0] : ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>

            <textarea
              rows={4}
              name="description"
              value={form.description ?? ""}
              onChange={handleChange}
              placeholder="Medicine description..."
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                text-slate-900
                resize-none
                outline-none
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />
          </div>

          {/* Footer */}
          <div
            className="
              md:col-span-2
              flex
              justify-end
              gap-3
              border-t
              border-slate-200
              pt-6
              mt-2
            "
          >
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                border
                border-slate-300
                px-5
                py-3
                font-medium
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-xl
                bg-blue-600
                px-5
                py-3
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:opacity-50
              "
            >
              {loading
                ? "Saving..."
                : initialData
                  ? "Update Medicine"
                  : "Save Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
