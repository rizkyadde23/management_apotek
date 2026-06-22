"use client";

import { Edit, Trash2, Tag } from "lucide-react";

import { Category } from "@/types/category";

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50">
            <th className="px-6 py-4 text-left">Category</th>

            <th className="px-6 py-4 text-left">Description</th>

            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-t">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <Tag size={18} className="text-blue-600" />
                  </div>

                  <span className="font-medium text-slate-900">
                    {category.name}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 text-slate-600">
                {category.description || "-"}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(category)}
                    className="rounded-xl bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(category)}
                    className="rounded-xl bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
