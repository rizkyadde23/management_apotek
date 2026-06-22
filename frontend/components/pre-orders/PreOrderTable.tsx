"use client";

import { Eye } from "lucide-react";

interface Props {
  preOrders: any[];

  onDetail: (item: any) => void;

  onReady: (id: number) => void;

  onComplete: (id: number) => void;

  onCancel: (id: number) => void;
}

export default function PreOrderTable({
  preOrders,
  onDetail,
  onReady,
  onComplete,
  onCancel,
}: Props) {
  function getStatusClass(status: string) {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "READY":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
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
              <th className="px-6 py-4 text-left">Customer</th>

              <th className="px-6 py-4 text-left">Medicine</th>

              <th className="px-6 py-4 text-left">Quantity</th>

              <th className="px-6 py-4 text-left">Status</th>

              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {preOrders.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-4 text-slate-900 font-medium">
                  {item.customer_name}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {item.medicine?.name}
                </td>

                <td className="px-6 py-4 text-slate-700">{item.quantity}</td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => onDetail(item)}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                    >
                      <Eye size={16} />
                      Detail
                    </button>

                    {item.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => onReady(item.id)}
                          className="rounded-lg bg-green-600 px-3 py-2 text-white"
                        >
                          Ready
                        </button>

                        <button
                          onClick={() => onCancel(item.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-white"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {item.status === "READY" && (
                      <button
                        onClick={() => onComplete(item.id)}
                        className="rounded-lg bg-purple-600 px-3 py-2 text-white"
                      >
                        Complete
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
