"use client";

import { Building2, Edit, Trash2 } from "lucide-react";

import { Supplier } from "@/types/supplier";

interface Props {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export default function SupplierTable({ suppliers, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              Supplier
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              Phone
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              Email
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
              Address
            </th>

            <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {suppliers.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-12 text-center text-slate-500">
                No suppliers found.
              </td>
            </tr>
          ) : (
            suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                      <Building2 size={18} className="text-blue-600" />
                    </div>

                    <span className="font-medium text-slate-900">
                      {supplier.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {supplier.phone || "-"}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {supplier.email || "-"}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {supplier.address || "-"}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(supplier)}
                      className="rounded-xl bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(supplier)}
                      className="rounded-xl bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
