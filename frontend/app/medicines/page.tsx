"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

import { Medicine } from "@/types/medicine";

import MedicineFormModal from "@/components/medicines/MedicineFormModal";
import DeleteMedicineModal from "@/components/medicines/DeleteMedicineModal";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const response = await api.get("/medicines");

      console.log(response);
      console.log(response.data);

      setMedicines(response.data.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData: any) {
    try {
      await api.post("/medicines", formData);

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Gagal menambah obat");
    }
  }

  async function handleUpdate(formData: any) {
    if (!selectedMedicine) return;

    try {
      await api.put(`/medicines/${selectedMedicine.id}`, formData);

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Gagal update obat");
    }
  }

  async function handleDelete() {
    if (!selectedMedicine) return;

    try {
      await api.delete(`/medicines/${selectedMedicine.id}`);

      setOpenDelete(false);

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus obat");
    }
  }

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Medicines</h1>

        <button
          onClick={() => {
            setSelectedMedicine(null);
            setOpenForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Tambah Obat
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari obat..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg p-2 w-full text-black"
      />

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 text-left">Nama</th>

              <th className="p-3 text-left">Kategori</th>

              <th className="p-3 text-left">Supplier</th>

              <th className="p-3 text-left">Stock</th>

              <th className="p-3 text-left">Harga</th>

              <th className="p-3 text-left">Expired</th>

              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredMedicines.map((medicine) => (
              <tr key={medicine.id} className="border-t">
                <td className="p-3">{medicine.name}</td>

                <td className="p-3">{medicine.category?.name}</td>

                <td className="p-3">{medicine.supplier?.name}</td>

                <td className="p-3">{medicine.stock}</td>

                <td className="p-3">
                  Rp {Number(medicine.price).toLocaleString("id-ID")}
                </td>

                <td className="p-3">
                  {new Date(medicine.expired_date).toLocaleDateString("id-ID")}
                </td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedMedicine(medicine);
                        setOpenForm(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setSelectedMedicine(medicine);
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

      <MedicineFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={selectedMedicine ? handleUpdate : handleCreate}
        initialData={selectedMedicine || undefined}
      />

      <DeleteMedicineModal
        open={openDelete}
        medicineName={selectedMedicine?.name || ""}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
