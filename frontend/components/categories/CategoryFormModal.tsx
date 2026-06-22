"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export default function CategoryFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
      });
    } else {
      setForm({
        name: "",
        description: "",
      });
    }
  }, [open, initialData]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between border-b border-slate-200 px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {initialData ? "Edit Category" : "Add Category"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Manage medicine category data.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Category Name
            </label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : initialData
                  ? "Update Category"
                  : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
