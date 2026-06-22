import { Medicine } from "@/types/medicine";
import Badge from "@/components/ui/Badge";

import { Pencil, Trash2 } from "lucide-react";

interface MedicineTableProps {
  medicines: Medicine[];

  onEdit: (medicine: Medicine) => void;

  onDelete: (medicine: Medicine) => void;
}

export default function MedicineTable({
  medicines,
  onEdit,
  onDelete,
}: MedicineTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="bg-slate-100">
              <th className="p-3 text-left">Nama</th>

              <th className="p-3 text-left">Kategori</th>

              <th className="p-3 text-left">Supplier</th>

              <th className="p-3 text-left">Stock</th>

              <th className="p-3 text-left">Harga</th>

              <th className="p-3 text-left">Expired</th>

              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((medicine) => (
              <tr
                key={medicine.id}
                className="border-b transition hover:bg-slate-50"
              >
                <td className="p-3">{medicine.name}</td>

                <td className="p-3">{medicine.category?.name}</td>

                <td className="p-3">{medicine.supplier?.name}</td>

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <span>{medicine.stock}</span>

                    {medicine.stock === 0 ? (
                      <Badge color="red">Empty</Badge>
                    ) : medicine.stock <= medicine.minimum_stock ? (
                      <Badge color="yellow">Low</Badge>
                    ) : (
                      <Badge color="green">Good</Badge>
                    )}
                  </div>
                </td>

                <td className="p-3">
                  Rp {Number(medicine.price).toLocaleString("id-ID")}
                </td>

                <td className="p-3">
                  <div className="space-y-1">
                    <p>
                      {new Date(medicine.expired_date).toLocaleDateString(
                        "id-ID",
                      )}
                    </p>
                    {new Date(medicine.expired_date) < new Date() ? (
                      <Badge color="red">Expired</Badge>
                    ) : (
                      <Badge color="green">Valid</Badge>
                    )}
                  </div>
                </td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(medicine)}
                      className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(medicine)}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
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
