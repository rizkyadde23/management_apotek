"use client";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Badge from "@/components/ui/Badge";

import { getStockMovements } from "@/lib/api/stock-logs";

import { StockLog } from "@/types/stock-log";

export default function StockLogPage() {
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getStockMovements();

      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = useMemo(() => {
    return logs.filter(
      (log) =>
        log.medicine?.name?.toLowerCase().includes(search.toLowerCase()) ||
        log.medicine?.code?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [logs, search]);

  const totalIn = logs.filter((log) => log.type === "IN").length;

  const totalOut = logs.filter((log) => log.type === "OUT").length;

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Navbar />

          <div className="p-6">Loading Medicines...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 p-8 space-y-6">
          {/* Header */}

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Stock Movement History
            </h1>

            <p className="mt-1 text-slate-500">
              Riwayat pergerakan stok obat masuk dan keluar.
            </p>
          </div>

          {/* Summary */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Log</p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {logs.length}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Stock IN</p>

              <h3 className="mt-2 text-3xl font-bold text-green-600">
                {totalIn}
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Stock OUT</p>

              <h3 className="mt-2 text-3xl font-bold text-red-600">
                {totalOut}
              </h3>
            </div>
          </div>

          {/* Search */}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <input
              type="text"
              placeholder="Cari nama obat atau kode obat..."
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

          {/* Table */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Stock Movement Logs
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                      Tanggal
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                      Obat
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">
                      Jenis
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">
                      Sebelum
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">
                      Sesudah
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                      User
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                      Catatan
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-10 text-center text-slate-500"
                      >
                        Belum ada histori stok.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-4 py-4 text-sm text-slate-700">
                          {new Date(log.created_at).toLocaleString("id-ID")}
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-medium text-slate-900">
                            {log.medicine.name}
                          </div>

                          <div className="text-xs text-slate-500">
                            {log.medicine.code}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-center">
                          {log.type === "IN" ? (
                            <Badge color="green">STOCK IN</Badge>
                          ) : (
                            <Badge color="red">STOCK OUT</Badge>
                          )}
                        </td>

                        <td className="px-4 py-4 text-center font-semibold text-slate-900">
                          {log.quantity}
                        </td>

                        <td className="px-4 py-4 text-center text-slate-700">
                          {log.stock_before}
                        </td>

                        <td className="px-4 py-4 text-center text-slate-700">
                          {log.stock_after}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {log.user?.name ?? "-"}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {log.notes ?? "-"}
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
