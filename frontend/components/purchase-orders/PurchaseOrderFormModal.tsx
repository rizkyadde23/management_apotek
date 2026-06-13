"use client";

import { useEffect, useState } from "react";

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
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-black mb-5">
          Buat Purchase Order
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <select
            value={form.supplier_id}
            onChange={(e) =>
              setForm({
                ...form,
                supplier_id: e.target.value,
              })
            }
            className="border p-2 rounded w-full text-black"
          >
            <option value="">Pilih Supplier</option>

            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>

          {form.items.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-3">
              <select
                value={item.medicine_id}
                onChange={(e) =>
                  updateItem(index, "medicine_id", Number(e.target.value))
                }
                className="border p-2 rounded text-black"
              >
                <option value="">Pilih Obat</option>

                {medicines.map((medicine) => (
                  <option key={medicine.id} value={medicine.id}>
                    {medicine.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, "quantity", Number(e.target.value))
                }
                className="border p-2 rounded text-black"
              />

              <input
                type="number"
                placeholder="Harga"
                value={item.unit_price}
                onChange={(e) =>
                  updateItem(index, "unit_price", Number(e.target.value))
                }
                className="border p-2 rounded text-black"
              />

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="bg-red-600 text-white rounded"
              >
                Hapus
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Tambah Item
          </button>

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
              Simpan PO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
