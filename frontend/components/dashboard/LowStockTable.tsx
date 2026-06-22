interface Props {
  data: {
    id: number;
    name: string;
    stock: number;
    minimum_stock: number;
  }[];
}

export default function LowStockTable({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border shadow p-5">
      <h2 className="text-lg font-bold mb-5 text-slate-900">
        Low Stock Medicines
      </h2>

      {!data || data.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Tidak ada obat dengan stok menipis.
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left py-3 px-2">Medicine</th>

              <th className="text-center py-3 px-2">Stock</th>

              <th className="text-center py-3 px-2">Minimum</th>

              <th className="text-center py-3 px-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((medicine) => (
              <tr key={medicine.id} className="border-b hover:bg-slate-50">
                <td className="py-3 px-2 font-medium">{medicine.name}</td>

                <td className="py-3 px-2 text-center font-semibold text-red-600">
                  {medicine.stock}
                </td>

                <td className="py-3 px-2 text-center">
                  {medicine.minimum_stock}
                </td>

                <td className="py-3 px-2 text-center">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                    Low Stock
                  </span>
                </td>
              </tr>
            ))}

            {/* Placeholder agar tinggi tabel konsisten */}
            {Array.from({
              length: Math.max(0, 5 - data.length),
            }).map((_, index) => (
              <tr key={`empty-${index}`} className="border-b">
                <td className="py-3 px-2 text-slate-300">-</td>

                <td className="py-3 px-2 text-center text-slate-300">-</td>

                <td className="py-3 px-2 text-center text-slate-300">-</td>

                <td className="py-3 px-2 text-center text-slate-300">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
