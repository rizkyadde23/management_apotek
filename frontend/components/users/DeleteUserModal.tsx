"use client";

interface Props {
  open: boolean;
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteUserModal({
  open,
  userName,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl">
        <h2 className="text-xl font-bold text-red-600 mb-3">
          Hapus User
        </h2>

        <p className="text-black">
          Yakin ingin menghapus:
        </p>

        <p className="font-semibold text-black">
          {userName}
        </p>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Batal
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}