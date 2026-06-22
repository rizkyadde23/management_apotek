"use client";

interface Props {
  open: boolean;
  categoryName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteCategoryModal({
  open,
  categoryName,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-900">Delete Category</h2>

        <p className="mt-3 text-slate-600">
          Are you sure you want to delete
          <span className="font-semibold"> {categoryName}</span>?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
