interface Props {
  data: {
    id: number;
    transaction_code: string;
    total: number;
    payment_status: string;
    created_at: string;
    user: {
      name: string;
    };
  }[];
}

export default function RecentTransactionTable({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border shadow p-5">
      <h2 className="text-lg font-bold mb-5 text-slate-900">
        Recent Transactions
      </h2>

      {!data || data.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Belum ada transaksi.
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left py-3 px-2">Code</th>
              <th className="text-left py-3 px-2">User</th>
              <th className="text-right py-3 px-2">Total</th>
              <th className="text-center py-3 px-2">Status</th>
              <th className="text-center py-3 px-2">Tanggal</th>
            </tr>
          </thead>

          <tbody>
            {data.map((trx) => (
              <tr key={trx.id} className="border-b hover:bg-slate-50">
                <td className="py-3 px-2 font-medium">
                  {trx.transaction_code}
                </td>

                <td className="py-3 px-2">{trx.user?.name ?? "-"}</td>

                <td className="py-3 px-2 text-right">
                  Rp {Number(trx.total).toLocaleString("id-ID")}
                </td>

                <td className="py-3 px-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      trx.payment_status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {trx.payment_status}
                  </span>
                </td>

                <td className="py-3 px-2 text-center">
                  {new Date(trx.created_at).toLocaleDateString("id-ID")}
                </td>
              </tr>
            ))}

            {/* Placeholder agar tinggi tabel tetap konsisten */}
            {Array.from({
              length: Math.max(0, 5 - data.length),
            }).map((_, index) => (
              <tr key={`empty-${index}`} className="border-b">
                <td className="py-3 px-2 text-slate-300">-</td>
                <td className="py-3 px-2 text-slate-300">-</td>
                <td className="py-3 px-2 text-slate-300 text-right">-</td>
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
