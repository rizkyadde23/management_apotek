"use client";

import { PurchaseOrder } from "@/types/purchase-order";

interface Props {
  purchaseOrders: PurchaseOrder[];
}

export default function PurchaseOrderStats({ purchaseOrders }: Props) {
  const total = purchaseOrders.length;

  const pending = purchaseOrders.filter((po) => po.status === "PENDING").length;

  const approved = purchaseOrders.filter(
    (po) => po.status === "APPROVED",
  ).length;

  const received = purchaseOrders.filter(
    (po) => po.status === "RECEIVED",
  ).length;

  const cards = [
    {
      title: "Total PO",
      value: total,
    },
    {
      title: "Pending",
      value: pending,
    },
    {
      title: "Approved",
      value: approved,
    },
    {
      title: "Received",
      value: received,
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
