"use client";

import { useEffect, useState } from "react";

import { getTransactions } from "@/lib/api/transactions";

import { Transaction } from "@/types/transaction";

import TransactionDetailModal from "@/components/transactions/TransactionDetailModal";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getTransactions();

      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Transactions</h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 text-left">Kode</th>

              <th className="p-3 text-left">Kasir</th>

              <th className="p-3 text-left">Total</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-left">Tanggal</th>

              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t">
                <td className="p-3 text-black">
                  {transaction.transaction_code}
                </td>

                <td className="p-3 text-black">{transaction.user?.name}</td>

                <td className="p-3 text-black">
                  Rp {Number(transaction.total).toLocaleString("id-ID")}
                </td>

                <td className="p-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    {transaction.payment_status}
                  </span>
                </td>

                <td className="p-3 text-black">
                  {new Date(transaction.created_at).toLocaleDateString("id-ID")}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => {
                      setSelectedTransaction(transaction);

                      setOpenDetail(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TransactionDetailModal
        open={openDetail}
        transaction={selectedTransaction}
        onClose={() => setOpenDetail(false)}
      />
    </div>
  );
}
