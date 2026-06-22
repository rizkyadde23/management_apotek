"use client";

import {
  User,
  Phone,
  Pill,
  Package,
  Calendar,
  FileText,
  ShoppingCart,
} from "lucide-react";

interface Props {
  open: boolean;
  preorder: any;
  onClose: () => void;
}

export default function PreOrderDetailModal({
  open,
  preorder,
  onClose,
}: Props) {
  if (!open || !preorder) return null;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700";

      case "READY":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Detail Pre Order
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Informasi lengkap pre-order pelanggan
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(
                  preorder.status,
                )}`}
              >
                {preorder.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6">
            {/* Customer */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Customer Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <User size={16} />
                    <span className="text-sm">Customer Name</span>
                  </div>

                  <p className="font-semibold text-slate-900">
                    {preorder.customer_name}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Phone size={16} />
                    <span className="text-sm">Phone Number</span>
                  </div>

                  <p className="font-semibold text-slate-900">
                    {preorder.customer_phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Medicine */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Medicine Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Pill size={16} />
                    <span className="text-sm">Medicine</span>
                  </div>

                  <p className="font-semibold text-slate-900">
                    {preorder.medicine?.name}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Package size={16} />
                    <span className="text-sm">Quantity</span>
                  </div>

                  <p className="font-semibold text-slate-900">
                    {preorder.quantity}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Additional Information
              </h3>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Calendar size={16} />
                    <span className="text-sm">Estimated Arrival Date</span>
                  </div>

                  <p className="font-semibold text-slate-900">
                    {preorder.estimated_arrival_date || "-"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <ShoppingCart size={16} />
                    <span className="text-sm">Related Purchase Order</span>
                  </div>

                  <p className="font-semibold text-slate-900">
                    {preorder.purchase_order?.po_number || "-"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <FileText size={16} />
                    <span className="text-sm">Notes</span>
                  </div>

                  <p className="text-slate-700">
                    {preorder.notes || "Tidak ada catatan"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t border-slate-200 px-6 py-4">
            <button
              onClick={onClose}
              className="
              rounded-xl
              border
              border-slate-300
              px-5
              py-2.5
              font-medium
              text-slate-700
              transition
              hover:bg-slate-100
            "
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
