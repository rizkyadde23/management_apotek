import { User } from "@/types/user";

interface Props {
  users: User[];
}

export default function UserStats({ users }: Props) {
  const activeUsers = users.filter((u) => u.is_active).length;

  const inactiveUsers = users.filter((u) => !u.is_active).length;

  const admins = users.filter((u) => u.role?.name === "ADMIN").length;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border p-5">
        <p className="text-sm text-slate-500">Total Users</p>

        <h3 className="text-3xl font-bold text-slate-900">{users.length}</h3>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <p className="text-sm text-slate-500">Active Users</p>

        <h3 className="text-3xl font-bold text-green-600">{activeUsers}</h3>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <p className="text-sm text-slate-500">Inactive Users</p>

        <h3 className="text-3xl font-bold text-red-600">{inactiveUsers}</h3>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <p className="text-sm text-slate-500">Administrators</p>

        <h3 className="text-3xl font-bold text-blue-600">{admins}</h3>
      </div>
    </div>
  );
}
