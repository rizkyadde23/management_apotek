"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Badge from "@/components/ui/Badge";

import {
  getExpiredMedicines,
  getExpiringSoonMedicines,
  getExpiredSummary,
} from "@/lib/api/expired-medicines";

import type { ExpiredMedicine, ExpiredSummary } from "@/types/expired-medicine";

export default function ExpiredMedicinesPage() {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

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

  const filteredExpired = expiredMedicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(search.toLowerCase()) ||
      medicine.code.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredExpiringSoon = expiringSoonMedicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(search.toLowerCase()) ||
      medicine.code.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />

          <div className="p-6">Loading Expired Medicines...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Header */}

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Expired Medicines
            </h1>

            <p className="mt-1 text-slate-500">
              Monitoring obat yang telah expired dan akan segera expired.
            </p>
          </div>

          {/* Summary */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Expired Medicines</p>

              <h3 className="mt-2 text-3xl font-bold text-red-600">
                {summary.expired_count}
              </h3>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500">Expiring Soon</p>

              <h3 className="mt-2 text-3xl font-bold text-orange-600">
                {summary.expiring_soon_count}
              </h3>
            </div>
          </div>

          {/* Search */}

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <input
              type="text"
              placeholder="Cari nama obat atau kode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                text-black
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          {/* Expired Medicines */}

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              overflow-hidden
              shadow-sm
            "
          >
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Expired Medicines
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left">Code</th>

                    <th className="px-4 py-3 text-left">Medicine</th>

                    <th className="px-4 py-3 text-left">Batch</th>

                    <th className="px-4 py-3 text-center">Stock</th>

                    <th className="px-4 py-3 text-center">Expired Date</th>

                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpired.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-slate-500"
                      >
                        Tidak ada obat expired
                      </td>
                    </tr>
                  ) : (
                    filteredExpired.map((medicine) => (
                      <tr
                        key={medicine.id}
                        className="
                            border-t
                            border-slate-100
                            hover:bg-slate-50
                          "
                      >
                        <td className="px-4 py-4 text-slate-700">
                          {medicine.code}
                        </td>

                        <td className="px-4 py-4 font-medium text-slate-900">
                          {medicine.name}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {medicine.batch_number}
                        </td>

                        <td className="px-4 py-4 text-center font-semibold text-red-600">
                          {medicine.stock}
                        </td>

                        <td className="px-4 py-4 text-center text-slate-700">
                          {formatDate(medicine.expired_date)}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <Badge color="red">EXPIRED</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expiring Soon */}

          <div
            className="
              bg-white
              border
              border-slate-200
              rounded-2xl
              overflow-hidden
              shadow-sm
            "
          >
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Expiring Soon
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left">Code</th>

                    <th className="px-4 py-3 text-left">Medicine</th>

                    <th className="px-4 py-3 text-left">Batch</th>

                    <th className="px-4 py-3 text-center">Stock</th>

                    <th className="px-4 py-3 text-center">Expired Date</th>

                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredExpiringSoon.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-slate-500"
                      >
                        Tidak ada obat yang akan expired
                      </td>
                    </tr>
                  ) : (
                    filteredExpiringSoon.map((medicine) => (
                      <tr
                        key={medicine.id}
                        className="
                            border-t
                            border-slate-100
                            hover:bg-slate-50
                          "
                      >
                        <td className="px-4 py-4 text-slate-700">
                          {medicine.code}
                        </td>

                        <td className="px-4 py-4 font-medium text-slate-900">
                          {medicine.name}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {medicine.batch_number}
                        </td>

                        <td className="px-4 py-4 text-center font-semibold text-orange-600">
                          {medicine.stock}
                        </td>

                        <td className="px-4 py-4 text-center text-slate-700">
                          {formatDate(medicine.expired_date)}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <Badge color="yellow">EXPIRING SOON</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
