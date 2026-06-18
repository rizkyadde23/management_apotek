"use client";

import { useEffect, useState } from "react";

import { getStockMovements } from "@/lib/api/stock-logs";

import { StockLog } from "@/types/stock-log";

export default function StockLogPage() {
  const [logs, setLogs] = useState<StockLog[]>([]);

  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Stock Movement History</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-3">Tanggal</th>

              <th className="border p-3">Obat</th>

              <th className="border p-3">Jenis</th>

              <th className="border p-3">Qty</th>

              <th className="border p-3">Sebelum</th>

              <th className="border p-3">Sesudah</th>

              <th className="border p-3">User</th>

              <th className="border p-3">Catatan</th>
            </tr>
          </thead>

          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-6 text-slate-500">
                  Belum ada histori stok
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td className="border p-3 text-black">
                    {new Date(log.created_at).toLocaleString("id-ID")}
                  </td>

                  <td className="border p-3">
                    <div className="font-semibold text-black">
                      {log.medicine.name}
                    </div>

                    <div className="text-xs text-slate-500">
                      {log.medicine.code}
                    </div>
                  </td>

                  <td className="border p-3">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        log.type === "IN"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {log.type}
                    </span>
                  </td>

                  <td className="border p-3 font-semibold text-center text-black">
                    {log.quantity}
                  </td>

                  <td className="border p-3 text-center text-black">
                    {log.stock_before}
                  </td>

                  <td className="border p-3 text-center text-black">
                    {log.stock_after}
                  </td>

                  <td className="border p-3 text-black">{log.user?.name}</td>

                  <td className="border p-3 text-black">{log.notes ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
