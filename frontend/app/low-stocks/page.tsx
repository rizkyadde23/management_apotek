"use client";

import { useEffect, useState } from "react";

import {
  getLowStock,
  getOutOfStock,
  getLowStockSummary,
} from "@/lib/api/low-stocks";

export default function LowStockPage() {
  const [loading, setLoading] = useState(true);

  const [lowStocks, setLowStocks] = useState<any[]>([]);

  const [outStocks, setOutStocks] = useState<any[]>([]);

  const [summary, setSummary] = useState({
    low_stock_count: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const lowStockData = await getLowStock();

      const outStockData = await getOutOfStock();

      const summaryData = await getLowStockSummary();

      setLowStocks(lowStockData);

      setOutStocks(outStockData);

      setSummary(summaryData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Monitoring Stok</h1>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-5">
          <h3 className="text-slate-500">Low Stock</h3>

          <p className="text-3xl font-bold text-orange-600">
            {summary.low_stock_count}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <h3 className="text-slate-500">Out Of Stock</h3>

          <p className="text-3xl font-bold text-red-600">{outStocks.length}</p>
        </div>
      </div>

      {/* LOW STOCK */}

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-black">Low Stock Medicines</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 border">Kode</th>

              <th className="p-3 border">Nama Obat</th>

              <th className="p-3 border">Stock</th>

              <th className="p-3 border">Minimum</th>

              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {lowStocks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  Tidak ada data low stock
                </td>
              </tr>
            ) : (
              lowStocks.map((medicine: any) => (
                <tr key={medicine.id}>
                  <td className="border p-3 text-black">{medicine.code}</td>

                  <td className="border p-3 text-black">{medicine.name}</td>

                  <td className="border p-3 text-orange-600 font-semibold">
                    {medicine.stock}
                  </td>

                  <td className="border p-3 text-black">
                    {medicine.minimum_stock}
                  </td>

                  <td className="border p-3">
                    <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs">
                      LOW STOCK
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* OUT OF STOCK */}

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-black">
            Out Of Stock Medicines
          </h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 border">Kode</th>

              <th className="p-3 border">Nama Obat</th>

              <th className="p-3 border">Stock</th>

              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {outStocks.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-slate-500">
                  Tidak ada data out of stock
                </td>
              </tr>
            ) : (
              outStocks.map((medicine: any) => (
                <tr key={medicine.id}>
                  <td className="border p-3 text-black">{medicine.code}</td>

                  <td className="border p-3 text-black">{medicine.name}</td>

                  <td className="border p-3 text-red-600 font-bold">
                    {medicine.stock}
                  </td>

                  <td className="border p-3">
                    <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">
                      OUT OF STOCK
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
