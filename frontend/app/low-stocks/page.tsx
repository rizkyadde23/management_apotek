"use client";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Badge from "@/components/ui/Badge";

import {
  getLowStock,
  getOutOfStock,
  getLowStockSummary,
} from "@/lib/api/low-stocks";

export default function LowStockPage() {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

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
      setLoading(true);

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

  const filteredLowStocks = useMemo(() => {
    return lowStocks.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(search.toLowerCase()) ||
        medicine.code.toLowerCase().includes(search.toLowerCase()),
    );
  }, [lowStocks, search]);

  const filteredOutStocks = useMemo(() => {
    return outStocks.filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(search.toLowerCase()) ||
        medicine.code.toLowerCase().includes(search.toLowerCase()),
    );
  }, [outStocks, search]);

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
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Header */}

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Monitoring Stok
              </h1>

              <p className="mt-1 text-slate-500">
                Pantau obat yang hampir habis dan stok kosong.
              </p>
            </div>

            {/* Summary */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <p className="text-sm text-slate-500">Low Stock Medicines</p>

                <h3 className="mt-2 text-4xl font-bold text-orange-600">
                  {summary.low_stock_count}
                </h3>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <p className="text-sm text-slate-500">Out Of Stock Medicines</p>

                <h3 className="mt-2 text-4xl font-bold text-red-600">
                  {outStocks.length}
                </h3>
              </div>
            </div>

            {/* Search */}

            <div>
              <input
                type="text"
                placeholder="Cari obat berdasarkan kode atau nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  text-black
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-100
                "
              />
            </div>

            {/* Low Stock */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Low Stock Medicines
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Kode
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Nama Obat
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Stock
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Minimum
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLowStocks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-slate-500"
                        >
                          Tidak ada data low stock.
                        </td>
                      </tr>
                    ) : (
                      filteredLowStocks.map((medicine) => (
                        <tr
                          key={medicine.id}
                          className="border-t border-slate-100"
                        >
                          <td className="px-6 py-4 text-black">
                            {medicine.code}
                          </td>

                          <td className="px-6 py-4 text-black">
                            {medicine.name}
                          </td>

                          <td className="px-6 py-4 font-semibold text-orange-600">
                            {medicine.stock}
                          </td>

                          <td className="px-6 py-4 text-black">
                            {medicine.minimum_stock}
                          </td>

                          <td className="px-6 py-4">
                            <Badge color="yellow">LOW STOCK</Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Out Of Stock */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Out Of Stock Medicines
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Kode
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Nama Obat
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Stock
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOutStocks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-10 text-center text-slate-500"
                        >
                          Tidak ada data out of stock.
                        </td>
                      </tr>
                    ) : (
                      filteredOutStocks.map((medicine) => (
                        <tr
                          key={medicine.id}
                          className="border-t border-slate-100"
                        >
                          <td className="px-6 py-4 text-black">
                            {medicine.code}
                          </td>

                          <td className="px-6 py-4 text-black">
                            {medicine.name}
                          </td>

                          <td className="px-6 py-4 font-bold text-red-600">
                            {medicine.stock}
                          </td>

                          <td className="px-6 py-4">
                            <Badge color="red">OUT OF STOCK</Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
