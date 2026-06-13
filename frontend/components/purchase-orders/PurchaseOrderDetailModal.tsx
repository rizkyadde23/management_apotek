"use client";

import { PurchaseOrder } from "@/types/purchase-order";

interface Props {
  open: boolean;
  onClose: () => void;
  purchaseOrder: PurchaseOrder | null;
}

export default function PurchaseOrderDetailModal({
  open,
  onClose,
  purchaseOrder,
}: Props) {
  if (!open || !purchaseOrder) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-black mb-4">
          Detail Purchase Order
        </h2>

        <div className="space-y-2 mb-4 text-black">
          <p>
            <strong>No PO:</strong> {purchaseOrder.po_number}
          </p>

          <p>
            <strong>Supplier:</strong> {purchaseOrder.supplier.name}
          </p>

          <p>
            <strong>Status:</strong> {purchaseOrder.status}
          </p>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-2">Obat</th>

              <th className="border p-2">Qty</th>

              <th className="border p-2">Harga</th>

              <th className="border p-2">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {purchaseOrder.details.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.medicine?.name}</td>

                <td className="border p-2">{item.quantity}</td>

                <td className="border p-2">
                  Rp {Number(item.unit_price).toLocaleString("id-ID")}
                </td>

                <td className="border p-2">
                  Rp {Number(item.subtotal).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
