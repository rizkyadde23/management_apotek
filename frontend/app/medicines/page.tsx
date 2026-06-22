"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api";

import { Medicine } from "@/types/medicine";

import { Plus } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SearchBar from "@/components/ui/SearchBar";
import MedicineStats from "@/components/medicines/MedicineStats";
import MedicineTable from "@/components/medicines/MedicineTable";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
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
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            <PageHeader
              title="Medicines"
              description="Manage all medicines available in your pharmacy."
              action={
                <PrimaryButton
                  onClick={() => {
                    setSelectedMedicine(null);
                    setOpenForm(true);
                  }}
                >
                  <Plus size={18} className="mr-2" />
                  Add Medicine
                </PrimaryButton>
              }
            />

            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search medicine..."
            />

            <MedicineStats medicines={medicines} />

            <MedicineTable
              medicines={filteredMedicines}
              onEdit={(medicine) => {
                setSelectedMedicine(medicine);
                setOpenForm(true);
              }}
              onDelete={(medicine) => {
                setSelectedMedicine(medicine);
                setOpenDelete(true);
              }}
            />

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
        </main>
      </div>
    </div>
  );
}
