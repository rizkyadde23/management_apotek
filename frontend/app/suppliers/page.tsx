"use client";

import { useEffect, useState } from "react";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/lib/api/suppliers";

import { Supplier } from "@/types/supplier";

import SupplierFormModal from "@/components/suppliers/SupplierFormModal";
import DeleteSupplierModal from "@/components/suppliers/DeleteSupplierModal";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const data = await getSuppliers();

      setSuppliers(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData: any) {
    await createSupplier(formData);

    await loadData();
  }

  async function handleUpdate(formData: any) {
    if (!selectedSupplier) return;

    await updateSupplier(selectedSupplier.id, formData);

    await loadData();
  }

  async function handleDelete() {
    if (!selectedSupplier) return;

    await deleteSupplier(selectedSupplier.id);

    setOpenDelete(false);

    await loadData();
  }

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Suppliers</h1>

        <button
          onClick={() => {
            setSelectedSupplier(null);
            setOpenForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Tambah Supplier
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari supplier..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg p-2 w-full text-black"
      />

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 text-left">Nama</th>

              <th className="p-3 text-left">Telepon</th>

              <th className="p-3 text-left">Email</th>

              <th className="p-3 text-left">Alamat</th>

              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id} className="border-t">
                <td className="p-3 text-black">{supplier.name}</td>

                <td className="p-3 text-black">{supplier.phone}</td>

                <td className="p-3 text-black">{supplier.email}</td>

                <td className="p-3 text-black">{supplier.address}</td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedSupplier(supplier);

                        setOpenForm(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSupplier(supplier);

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

      <SupplierFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={selectedSupplier ? handleUpdate : handleCreate}
        initialData={selectedSupplier || undefined}
      />

      <DeleteSupplierModal
        open={openDelete}
        supplierName={selectedSupplier?.name || ""}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
