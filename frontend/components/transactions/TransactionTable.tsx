"use client";

import { Eye } from "lucide-react";

import { Transaction } from "@/types/transaction";

interface Props {
  transactions: Transaction[];
  onDetail: (transaction: Transaction) => void;
}

export default function TransactionTable({ transactions, onDetail }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Kode
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Kasir
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Total
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Tanggal
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {transaction.transaction_code}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {transaction.user?.name}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  Rp {Number(transaction.total).toLocaleString("id-ID")}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      transaction.payment_status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {transaction.payment_status}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {new Date(transaction.created_at).toLocaleDateString("id-ID")}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onDetail(transaction)}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                      <Eye size={16} />
                      Detail
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
