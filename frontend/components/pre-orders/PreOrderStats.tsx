"use client";

interface Props {
  preOrders: any[];
}

export default function PreOrderStats({ preOrders }: Props) {
  const total = preOrders.length;

  const pending = preOrders.filter((item) => item.status === "PENDING").length;

  const ready = preOrders.filter((item) => item.status === "READY").length;

  const completed = preOrders.filter(
    (item) => item.status === "COMPLETED",
  ).length;

  const cards = [
    {
      title: "Total Pre Order",
      value: total,
    },
    {
      title: "Pending",
      value: pending,
    },
    {
      title: "Ready",
      value: ready,
    },
    {
      title: "Completed",
      value: completed,
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
