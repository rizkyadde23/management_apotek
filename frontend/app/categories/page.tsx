"use client";

import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/categories";

import { Category } from "@/types/category";

import CategoryTable from "@/components/categories/CategoryTable";
import CategoryFormModal from "@/components/categories/CategoryFormModal";
import DeleteCategoryModal from "@/components/categories/DeleteCategoryModal";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

import PageHeader from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/PrimaryButton";

import { Plus } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [openForm, setOpenForm] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data: any) {
    await createCategory(data);

    await loadData();
  }

  async function handleUpdate(data: any) {
    if (!selectedCategory) return;

    await updateCategory(selectedCategory.id, data);

    await loadData();
  }

  async function handleDelete() {
    if (!selectedCategory) return;

    await deleteCategory(selectedCategory.id);

    setOpenDelete(false);

    await loadData();
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <PageHeader
              title="Categories"
              description="Manage medicine categories."
              action={
                <PrimaryButton
                  onClick={() => {
                    setSelectedCategory(null);
                    setOpenForm(true);
                  }}
                >
                  <Plus size={18} className="mr-2" />
                  Add Category
                </PrimaryButton>
              }
            />

            <CategoryTable
              categories={categories}
              onEdit={(category) => {
                setSelectedCategory(category);
                setOpenForm(true);
              }}
              onDelete={(category) => {
                setSelectedCategory(category);
                setOpenDelete(true);
              }}
            />
          </div>
        </main>
      </div>

      <CategoryFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={selectedCategory ? handleUpdate : handleCreate}
        initialData={selectedCategory || undefined}
      />

      <DeleteCategoryModal
        open={openDelete}
        categoryName={selectedCategory?.name || ""}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
