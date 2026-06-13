"use client";

import { useEffect, useState } from "react";

import {
  getPreOrders,
  readyPreOrder,
  completePreOrder,
  cancelPreOrder,
} from "@/lib/api/pre-orders";

import PreOrderDetailModal from "@/components/pre-orders/PreOrderDetailModal";

export default function PreOrdersPage() {
  const [preOrders, setPreOrders] = useState<any[]>([]);

  const [selected, setSelected] = useState<any>(null);

  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const data = await getPreOrders();

    setPreOrders(data);
  }

  async function handleReady(id: number) {
    await readyPreOrder(id);

    loadData();
  }

  async function handleComplete(id: number) {
    await completePreOrder(id);

    loadData();
  }

  async function handleCancel(id: number) {
    await cancelPreOrder(id);

    loadData();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Pre Order</h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 border">Customer</th>

              <th className="p-3 border">Obat</th>

              <th className="p-3 border">Qty</th>

              <th className="p-3 border">Status</th>

              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {preOrders.map((item) => (
              <tr key={item.id}>
                <td className="border p-3 text-black">{item.customer_name}</td>

                <td className="border p-3 text-black">{item.medicine?.name}</td>

                <td className="border p-3 text-black">{item.quantity}</td>

                <td className="border p-3 text-black">{item.status}</td>

                <td className="border p-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelected(item);

                      setOpenDetail(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Detail
                  </button>

                  {item.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleReady(item.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Ready
                      </button>

                      <button
                        onClick={() => handleCancel(item.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {item.status === "READY" && (
                    <button
                      onClick={() => handleComplete(item.id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PreOrderDetailModal
        open={openDetail}
        preorder={selected}
        onClose={() => setOpenDetail(false)}
      />
    </div>
  );
}
