interface Props {
  title: string;
  value: string | number;
}

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-2 text-slate-900">
        {value}
      </h3>
    </div>
  );
}