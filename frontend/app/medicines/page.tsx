"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Medicine } from "@/types/medicine";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await api.get("/medicines");

    setMedicines(response.data.data.data);

    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Medicines</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Expired</th>
          </tr>
        </thead>

        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine.id}>
              <td className="border p-2">{medicine.name}</td>

              <td className="border p-2">{medicine.category.name}</td>

              <td className="border p-2">{medicine.stock}</td>

              <td className="border p-2">Rp {medicine.price}</td>

              <td className="border p-2">
                {new Date(medicine.expired_date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
