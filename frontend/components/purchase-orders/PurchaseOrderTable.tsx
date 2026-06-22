"use client";

import { Eye } from "lucide-react";

import { PurchaseOrder } from "@/types/purchase-order";

interface Props {
  purchaseOrders: PurchaseOrder[];

  onDetail: (po: PurchaseOrder) => void;

  onApprove: (id: number) => void;

  onReceive: (id: number) => void;

  onCancel: (id: number) => void;
}

export default function PurchaseOrderTable({
  purchaseOrders,
  onDetail,
  onApprove,
  onReceive,
  onCancel,
}: Props) {
  function statusBadge(status: string) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "APPROVED":
        return "bg-blue-100 text-blue-700";

      case "RECEIVED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left">No PO</th>

              <th className="px-6 py-4 text-left">Supplier</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-left">Created By</th>

              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {purchaseOrders.map((po) => (
              <tr
                key={po.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium text-slate-900">
                  {po.po_number}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {po.supplier?.name}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                      po.status,
                    )}`}
                  >
                    {po.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-700">{po.creator?.name}</td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => onDetail(po)}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                      <Eye size={16} />
                      Detail
                    </button>

                    {po.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => onApprove(po.id)}
                          className="rounded-lg bg-green-600 px-3 py-2 text-white"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => onCancel(po.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-white"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {po.status === "APPROVED" && (
                      <button
                        onClick={() => onReceive(po.id)}
                        className="rounded-lg bg-purple-600 px-3 py-2 text-white"
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
    </div>
  );
}
