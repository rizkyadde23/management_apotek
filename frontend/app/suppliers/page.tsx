"use client";

import { useEffect, useState } from "react";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/lib/api/suppliers";

import { Supplier } from "@/types/supplier";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import PrimaryButton from "@/components/ui/PrimaryButton";

import SupplierTable from "@/components/suppliers/SupplierTable";
import SupplierFormModal from "@/components/suppliers/SupplierFormModal";
import DeleteSupplierModal from "@/components/suppliers/DeleteSupplierModal";

import { Plus } from "lucide-react";

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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData: any) {
    try {
      await createSupplier(formData);

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to create supplier");
    }
  }

  async function handleUpdate(formData: any) {
    if (!selectedSupplier) return;

    try {
      await updateSupplier(selectedSupplier.id, formData);

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to update supplier");
    }
  }

  async function handleDelete() {
    if (!selectedSupplier) return;

    try {
      await deleteSupplier(selectedSupplier.id);

      setOpenDelete(false);

      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete supplier");
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Navbar />

          <div className="p-6">Loading suppliers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <PageHeader
              title="Suppliers"
              description="Manage supplier information and contact details."
              action={
                <PrimaryButton
                  onClick={() => {
                    setSelectedSupplier(null);
                    setOpenForm(true);
                  }}
                >
                  <Plus size={18} className="mr-2" />
                  Add Supplier
                </PrimaryButton>
              }
            />

            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search supplier..."
            />

            <SupplierTable
              suppliers={filteredSuppliers}
              onEdit={(supplier) => {
                setSelectedSupplier(supplier);

                setOpenForm(true);
              }}
              onDelete={(supplier) => {
                setSelectedSupplier(supplier);

                setOpenDelete(true);
              }}
            />
          </div>
        </main>
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
