"use client";

import { useEffect, useState } from "react";

import {
  getExpiredMedicines,
  getExpiringSoonMedicines,
  getExpiredSummary,
} from "@/lib/api/expired-medicines";

import type { ExpiredMedicine, ExpiredSummary } from "@/types/expired-medicine";

export default function ExpiredMedicinesPage() {
  const [loading, setLoading] = useState(true);

  const [expiredMedicines, setExpiredMedicines] = useState<ExpiredMedicine[]>(
    [],
  );

  const [expiringSoonMedicines, setExpiringSoonMedicines] = useState<
    ExpiredMedicine[]
  >([]);

  const [summary, setSummary] = useState<ExpiredSummary>({
    expired_count: 0,
    expiring_soon_count: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const expired = await getExpiredMedicines();

      const expiringSoon = await getExpiringSoonMedicines();

      const summaryData = await getExpiredSummary();

      setExpiredMedicines(expired);

      setExpiringSoonMedicines(expiringSoon);

      setSummary(summaryData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("id-ID");
  }

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Expired Medicines</h1>

      {/* Summary */}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-5">
          <h3 className="text-slate-500">Expired Medicines</h3>

          <p className="text-3xl font-bold text-red-600">
            {summary.expired_count}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <h3 className="text-slate-500">Expiring Soon</h3>

          <p className="text-3xl font-bold text-orange-600">
            {summary.expiring_soon_count}
          </p>
        </div>
      </div>

      {/* Expired */}

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-black">Expired Medicines</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-3">Code</th>

              <th className="border p-3">Medicine</th>

              <th className="border p-3">Batch</th>

              <th className="border p-3">Stock</th>

              <th className="border p-3">Expired Date</th>

              <th className="border p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {expiredMedicines.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  Tidak ada obat expired
                </td>
              </tr>
            ) : (
              expiredMedicines.map((medicine) => (
                <tr key={medicine.id}>
                  <td className="border p-3 text-black">{medicine.code}</td>

                  <td className="border p-3 text-black">{medicine.name}</td>

                  <td className="border p-3 text-black">
                    {medicine.batch_number}
                  </td>

                  <td className="border p-3 text-red-600 font-bold">
                    {medicine.stock}
                  </td>

                  <td className="border p-3 text-black">
                    {formatDate(medicine.expired_date)}
                  </td>

                  <td className="border p-3">
                    <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">
                      EXPIRED
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Expiring Soon */}

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-black">Expiring Soon</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-3">Code</th>

              <th className="border p-3">Medicine</th>

              <th className="border p-3">Batch</th>

              <th className="border p-3">Stock</th>

              <th className="border p-3">Expired Date</th>

              <th className="border p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {expiringSoonMedicines.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  Tidak ada obat yang akan expired
                </td>
              </tr>
            ) : (
              expiringSoonMedicines.map((medicine) => (
                <tr key={medicine.id}>
                  <td className="border p-3 text-black">{medicine.code}</td>

                  <td className="border p-3 text-black">{medicine.name}</td>

                  <td className="border p-3 text-black">
                    {medicine.batch_number}
                  </td>

                  <td className="border p-3 text-orange-600 font-semibold">
                    {medicine.stock}
                  </td>

                  <td className="border p-3 text-black">
                    {formatDate(medicine.expired_date)}
                  </td>

                  <td className="border p-3">
                    <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs">
                      EXPIRING SOON
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
