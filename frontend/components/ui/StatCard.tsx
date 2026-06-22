interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, subtitle, icon }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="text-3xl font-bold mt-2">{value}</h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
