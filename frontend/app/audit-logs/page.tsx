"use client";

import { useEffect, useState } from "react";

import { getAuditLogs, filterAuditLogs } from "@/lib/api/audit-logs";

import { AuditLog, AuditLogPagination } from "@/types/audit-log";

import {
  Shield,
  Eye,
  Activity,
  Filter,
  RotateCcw,
  FileSearch,
  X,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/PrimaryButton";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function AuditLogsPage() {
  const [loading, setLoading] = useState(true);

  const [logs, setLogs] = useState<AuditLogPagination | null>(null);

  const [action, setAction] = useState("");

  const [module, setModule] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [selectedLog, setSelectedLog] = useState<any>(null);

  const [showModal, setShowModal] = useState(false);

  function openDetail(log: any) {
    setSelectedLog(log);

    setShowModal(true);
  }

  function closeDetail() {
    setShowModal(false);

    setSelectedLog(null);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      setLoading(true);

      const data = await getAuditLogs();

      setLogs(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleFilter() {
    try {
      setLoading(true);

      const data = await filterAuditLogs({
        action: action || undefined,
        module: module || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });

      setLogs(data);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Navbar />

          <div className="p-6">Loading Medicines...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            <PageHeader
              title="Audit Logs"
              description="Monitor user activities and system changes."
            />

            {/* Stats */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Logs</p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-800">
                      {logs?.data.length ?? 0}
                    </h3>
                  </div>

                  <Shield className="text-blue-500" size={34} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Create Actions</p>

                    <h3 className="mt-2 text-3xl font-bold text-green-600">
                      {logs?.data.filter((l) => l.action === "CREATE").length}
                    </h3>
                  </div>

                  <Activity className="text-green-500" size={34} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Delete Actions</p>

                    <h3 className="mt-2 text-3xl font-bold text-red-600">
                      {logs?.data.filter((l) => l.action === "DELETE").length}
                    </h3>
                  </div>

                  <FileSearch className="text-red-500" size={34} />
                </div>
              </div>
            </div>

            {/* Filter */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800">
                  Filter Audit Logs
                </h2>

                <p className="text-sm text-slate-500">
                  Filter activities by action, module, and date.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Action
                  </label>

                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                  >
                    <option value="">All Actions</option>
                    <option value="CREATE">CREATE</option>
                    <option value="READ">READ</option>
                    <option value="UPDATE">UPDATE</option>
                    <option value="DELETE">DELETE</option>
                    <option value="LOGIN">LOGIN</option>
                    <option value="LOGOUT">LOGOUT</option>
                    <option value="EXPORT">EXPORT</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Module
                  </label>

                  <input
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                    placeholder="MEDICINE"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <PrimaryButton onClick={handleFilter}>
                  <Filter size={16} className="mr-2" />
                  Filter
                </PrimaryButton>

                <button
                  onClick={() => {
                    setAction("");
                    setModule("");
                    setStartDate("");
                    setEndDate("");
                    loadLogs();
                  }}
                  className="flex items-center rounded-xl bg-slate-600 px-5 py-2 text-white hover:bg-slate-700"
                >
                  <RotateCcw size={16} className="mr-2" />
                  Reset
                </button>
              </div>
            </div>

            {/* Table */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Audit Log History
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        ID
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        User
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Action
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Module
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Description
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Created
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Details
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {logs?.data.length === 0 ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="flex flex-col items-center py-12">
                            <Shield size={48} className="mb-3 text-slate-300" />

                            <p className="text-slate-500">
                              No audit logs found
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      logs?.data.map((log) => (
                        <tr
                          key={log.id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >
                          <td className="px-4 py-4 text-sm">#{log.id}</td>

                          <td className="px-4 py-4 text-sm">
                            {log.user?.name ?? "-"}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium
                            ${
                              log.action === "CREATE"
                                ? "bg-green-100 text-green-700"
                                : log.action === "UPDATE"
                                  ? "bg-blue-100 text-blue-700"
                                  : log.action === "DELETE"
                                    ? "bg-red-100 text-red-700"
                                    : log.action === "LOGIN"
                                      ? "bg-purple-100 text-purple-700"
                                      : log.action === "LOGOUT"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-slate-100 text-slate-700"
                            }`}
                            >
                              {log.action}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm">{log.module}</td>

                          <td className="px-4 py-4 text-sm max-w-xs truncate">
                            {log.description}
                          </td>

                          <td className="px-4 py-4 text-sm">
                            {new Date(log.created_at).toLocaleString()}
                          </td>

                          <td className="px-4 py-4">
                            <button
                              onClick={() => openDetail(log)}
                              className="flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
                            >
                              <Eye size={15} className="mr-2" />
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showModal && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
              <h2 className="text-xl font-bold">Audit Log Detail</h2>

              <button onClick={closeDetail}>
                <X />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* seluruh isi detail lama tetap */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
