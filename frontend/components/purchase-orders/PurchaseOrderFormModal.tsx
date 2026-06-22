"use client";

import { useEffect, useState } from "react";

import { X, Plus, Trash2 } from "lucide-react";

import { getSuppliers } from "@/lib/api/suppliers";
import { getMedicines } from "@/lib/api/medicines";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function PurchaseOrderFormModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    supplier_id: "",
    items: [
      {
        medicine_id: "",
        quantity: 1,
        unit_price: 0,
      },
    ],
  });

  useEffect(() => {
    if (!open) return;

    loadMasterData();
  }, [open]);

  async function loadMasterData() {
    const supplierData = await getSuppliers();
    const medicineData = await getMedicines();

    setSuppliers(supplierData);
    setMedicines(medicineData);
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          medicine_id: "",
          quantity: 1,
          unit_price: 0,
        },
      ],
    }));
  }

  function removeItem(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  function updateItem(index: number, field: string, value: any) {
    const items = [...form.items];

    items[index] = {
      ...items[index],
      [field]: value,
    };

    setForm({
      ...form,
      items,
    });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Create Purchase Order
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create medicine procurement order from supplier.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Supplier */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Supplier
            </label>

            <select
              value={form.supplier_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  supplier_id: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select Supplier</option>

              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Purchase Order Items
              </h3>

              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {form.items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-4">
                    {/* Medicine */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Medicine
                      </label>

                      <select
                        value={item.medicine_id}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "medicine_id",
                            Number(e.target.value),
                          )
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                      >
                        <option value="">Select Medicine</option>

                        {medicines.map((medicine) => (
                          <option key={medicine.id} value={medicine.id}>
                            {medicine.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Qty */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Quantity
                      </label>

                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", Number(e.target.value))
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Unit Price
                      </label>

                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "unit_price",
                            Number(e.target.value),
                          )
                        }
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900"
                      />
                    </div>

                    {/* Delete */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700"
                      >
                        <Trash2 size={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Purchase Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
