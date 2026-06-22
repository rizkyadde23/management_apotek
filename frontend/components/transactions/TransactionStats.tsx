"use client";

import { Transaction } from "@/types/transaction";

interface Props {
  transactions: Transaction[];
}

export default function TransactionStats({ transactions }: Props) {
  const totalTransaction = transactions.length;

  const paidTransaction = transactions.filter(
    (t) => t.payment_status === "PAID",
  ).length;

  const unpaidTransaction = transactions.filter(
    (t) => t.payment_status === "UNPAID",
  ).length;

  const revenue = transactions
    .filter((t) => t.payment_status === "PAID")
    .reduce((sum, item) => sum + Number(item.total), 0);

  const cards = [
    {
      title: "Total Transaksi",
      value: totalTransaction,
    },
    {
      title: "Transaksi Lunas",
      value: paidTransaction,
    },
    {
      title: "Belum Lunas",
      value: unpaidTransaction,
    },
    {
      title: "Revenue",
      value: `Rp ${revenue.toLocaleString("id-ID")}`,
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">{card.title}</p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {card.value}
          </h3>
        </div>
      ))}
    </div>
  );
}
