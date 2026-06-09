"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DashboardData } from "@/types/dashboard";

export default function DashboardPage() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const fetchDashboard = async () => {
    const response =
      await api.get("/dashboard");

    setData(response.data.data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-5">
      <Card
        title="Total Medicines"
        value={data.total_medicines}
      />

      <Card
        title="Suppliers"
        value={data.total_suppliers}
      />

      <Card
        title="Low Stock"
        value={data.low_stock}
      />

      <Card
        title="Expired"
        value={data.expired_medicines}
      />

      <Card
        title="Today Revenue"
        value={`Rp ${data.today_revenue}`}
      />

      <Card
        title="Month Revenue"
        value={`Rp ${data.month_revenue}`}
      />
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}