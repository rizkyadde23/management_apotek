"use client";

import { Transaction } from "@/types/transaction";

interface Props {
  open: boolean;

  transaction: Transaction | null;

  onClose: () => void;
}

export default function TransactionDetailModal({
  open,
  transaction,
  onClose,
}: Props) {
  if (!open || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6">
        <h2 className="text-2xl font-bold text-black mb-5">Detail Transaksi</h2>

        <div className="space-y-2 mb-5 text-black">
          <p>
            <strong>Kode:</strong> {transaction.transaction_code}
          </p>

          <p>
            <strong>Kasir:</strong> {transaction.user?.name}
          </p>

          <p>
            <strong>Status:</strong> {transaction.payment_status}
          </p>
        </div>

        <table className="w-full border mb-5">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 border">Obat</th>

              <th className="p-2 border">Qty</th>

              <th className="p-2 border">Harga</th>

              <th className="p-2 border">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {transaction.details.map((detail) => (
              <tr key={detail.id}>
                <td className="border p-2 text-black">
                  {detail.medicine?.name}
                </td>

                <td className="border p-2 text-black">{detail.quantity}</td>

                <td className="border p-2 text-black">
                  Rp {Number(detail.price).toLocaleString("id-ID")}
                </td>

                <td className="border p-2 text-black">
                  Rp {Number(detail.subtotal).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-2 text-right text-black">
          <p>
            Subtotal : Rp {Number(transaction.subtotal).toLocaleString("id-ID")}
          </p>

          <p>
            Diskon : Rp {Number(transaction.discount).toLocaleString("id-ID")}
          </p>

          <p className="font-bold text-lg">
            Total : Rp {Number(transaction.total).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="border px-4 py-2 rounded">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
