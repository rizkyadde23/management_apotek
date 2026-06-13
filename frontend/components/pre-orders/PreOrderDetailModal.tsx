"use client";

interface Props {
  open: boolean;
  preorder: any;
  onClose: () => void;
}

export default function PreOrderDetailModal({
  open,
  preorder,
  onClose,
}: Props) {
  if (!open || !preorder) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-black">Detail Pre Order</h2>

        <div className="space-y-2 text-black">
          <p>
            <b>Customer:</b> {preorder.customer_name}
          </p>

          <p>
            <b>Telepon:</b> {preorder.customer_phone}
          </p>

          <p>
            <b>Obat:</b> {preorder.medicine?.name}
          </p>

          <p>
            <b>Jumlah:</b> {preorder.quantity}
          </p>

          <p>
            <b>Status:</b> {preorder.status}
          </p>

          <p>
            <b>Estimasi:</b> {preorder.estimated_arrival_date}
          </p>

          <p>
            <b>PO:</b> {preorder.purchase_order?.po_number || "-"}
          </p>

          <p>
            <b>Catatan:</b> {preorder.notes || "-"}
          </p>
        </div>

        <div className="flex justify-end mt-5">
          <button
            onClick={onClose}
            className="bg-slate-600 text-white px-4 py-2 rounded"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
