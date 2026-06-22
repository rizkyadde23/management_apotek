interface Props {
  data: {
    id: number;
    title: string;
    message: string;
    created_at: string;
  }[];
}

export default function RecentNotificationTable({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border shadow p-5">
      <h2 className="text-lg font-bold mb-5 text-slate-900">
        Recent Notifications
      </h2>

      {!data || data.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Belum ada notifikasi.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((notification) => (
            <div
              key={notification.id}
              className="border rounded-lg p-4 hover:bg-slate-50"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">{notification.title}</h3>

                <span className="text-sm text-slate-500">
                  {new Date(notification.created_at).toLocaleDateString(
                    "id-ID",
                  )}
                </span>
              </div>

              <p className="mt-2 text-slate-600">{notification.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
