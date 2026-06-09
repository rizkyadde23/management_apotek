"use client";

import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/categories";

import { Category } from "@/types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getCategories();

      setCategories(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingId) {
        await updateCategory(editingId, form);
      } else {
        await createCategory(form);
      }

      setForm({
        name: "",
        description: "",
      });

      setEditingId(null);

      loadData();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Yakin ingin menghapus kategori?");

    if (!confirmDelete) return;

    await deleteCategory(id);

    loadData();
  }

  function handleEdit(category: Category) {
    setEditingId(category.id);

    setForm({
      name: category.name,
      description: category.description ?? "",
    });
  }

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Kategori Obat</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-5 space-y-4"
      >
        <div>
          <label className="block mb-1 text-black">Nama Kategori</label>

          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full border rounded p-2 text-black"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-black">Deskripsi</label>

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="w-full border rounded p-2 text-black"
          />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          {editingId ? "Update" : "Tambah"}
        </button>
      </form>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 border">Nama</th>

              <th className="p-3 border">Deskripsi</th>

              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="border p-3 text-black">{category.name}</td>

                <td className="border p-3 text-black">
                  {category.description}
                </td>

                <td className="border p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
