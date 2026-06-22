"use client";

import { Package, AlertTriangle, CircleOff, Clock3 } from "lucide-react";

import StatCard from "@/components/ui/StatCard";

import { Medicine } from "@/types/medicine";

interface Props {
  medicines: Medicine[];
}

export default function MedicineStats({ medicines }: Props) {
  const total = medicines.length;

  const lowStock = medicines.filter(
    (medicine) => medicine.stock <= medicine.minimum_stock,
  ).length;

  const outOfStock = medicines.filter(
    (medicine) => medicine.stock === 0,
  ).length;

  const expiringSoon = medicines.filter((medicine) => {
    const expired = new Date(medicine.expired_date);

    const today = new Date();

    const diff = expired.getTime() - today.getTime();

    const days = diff / (1000 * 60 * 60 * 24);

    return days <= 30 && days >= 0;
  }).length;

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-5
        md:grid-cols-2
        xl:grid-cols-4
        mb-8
      "
    >
      <StatCard
        title="Total Medicines"
        value={total}
        subtitle="Registered medicines"
        icon={<Package size={24} />}
      />

      <StatCard
        title="Low Stock"
        value={lowStock}
        subtitle="Need restock"
        icon={<AlertTriangle size={24} />}
      />

      <StatCard
        title="Out of Stock"
        value={outOfStock}
        subtitle="Unavailable"
        icon={<CircleOff size={24} />}
      />

      <StatCard
        title="Expiring Soon"
        value={expiringSoon}
        subtitle="Within 30 days"
        icon={<Clock3 size={24} />}
      />
    </div>
  );
}
