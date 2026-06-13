"use client";

import { useEffect, useState } from "react";

import {
  getPurchaseOrders,
  approvePurchaseOrder,
  receivePurchaseOrder,
  cancelPurchaseOrder,
} from "@/lib/api/purchase-orders";

import PurchaseOrderDetailModal from "@/components/purchase-orders/PurchaseOrderDetailModal";

import { PurchaseOrder } from "@/types/purchase-order";

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getPurchaseOrders();

      setPurchaseOrders(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: number) {
    await approvePurchaseOrder(id);

    loadData();
  }

  async function handleReceive(id: number) {
    await receivePurchaseOrder(id);

    loadData();
  }

  async function handleCancel(id: number) {
    if (!confirm("Yakin membatalkan PO?")) return;

    await cancelPurchaseOrder(id);

    loadData();
  }

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-black">Purchase Orders</h1>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 border">No PO</th>

              <th className="p-3 border">Supplier</th>

              <th className="p-3 border">Status</th>

              <th className="p-3 border">Dibuat Oleh</th>

              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {purchaseOrders.map((po) => (
              <tr key={po.id}>
                <td className="border p-3 text-black">{po.po_number}</td>

                <td className="border p-3 text-black">{po.supplier?.name}</td>

                <td className="border p-3 text-black">{po.status}</td>

                <td className="border p-3 text-black">{po.creator?.name}</td>

                <td className="border p-3">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        setSelectedPO(po);

                        setOpenDetail(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Detail
                    </button>

                    {po.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleApprove(po.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleCancel(po.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {po.status === "APPROVED" && (
                      <button
                        onClick={() => handleReceive(po.id)}
                        className="bg-purple-600 text-white px-3 py-1 rounded"
                      >
                        Receive
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PurchaseOrderDetailModal
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        purchaseOrder={selectedPO}
      />
    </div>
  );
}
