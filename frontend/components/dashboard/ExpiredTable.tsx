interface Props {
  data: {
    id: number;
    name: string;
    expired_date: string;
  }[];
}

export default function ExpiredTable({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border shadow p-5">
      <h2 className="text-lg font-bold mb-5 text-slate-900">Expiring Soon</h2>

      {!data || data.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Tidak ada obat yang akan kedaluwarsa.
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left py-3 px-2">Medicine</th>

              <th className="text-center py-3 px-2">Expired Date</th>

              <th className="text-center py-3 px-2">Remaining</th>

              <th className="text-center py-3 px-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((medicine) => {
              const expiredDate = new Date(medicine.expired_date);

              const today = new Date();

              const diffDays = Math.ceil(
                (expiredDate.getTime() - today.getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              return (
                <tr key={medicine.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-2 font-medium">{medicine.name}</td>

                  <td className="py-3 px-2 text-center">
                    {expiredDate.toLocaleDateString("id-ID")}
                  </td>

                  <td className="py-3 px-2 text-center">{diffDays} hari</td>

                  <td className="py-3 px-2 text-center">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                      Expiring Soon
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Placeholder */}
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
