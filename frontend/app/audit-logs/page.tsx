"use client";

import { useEffect, useState } from "react";

import { getAuditLogs, filterAuditLogs } from "@/lib/api/audit-logs";

import { AuditLog, AuditLogPagination } from "@/types/audit-log";

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
    return <div className="p-6 text-black">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Audit Logs</h1>

      {/* FILTER */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-bold text-lg mb-5 text-black">Filter Audit Logs</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block mb-2 text-black">Action</label>

            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="border rounded-lg p-2 w-full text-black"
            >
              <option value="">Semua</option>
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
            <label className="block mb-2 text-black">Module</label>

            <input
              value={module}
              onChange={(e) => setModule(e.target.value)}
              placeholder="contoh : MEDICINE"
              className="border rounded-lg p-2 w-full text-black"
            />
          </div>

          <div>
            <label className="block mb-2 text-black">Start Date</label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-lg p-2 w-full text-black"
            />
          </div>

          <div>
            <label className="block mb-2 text-black">End Date</label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-lg p-2 w-full text-black"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Filter
          </button>

          <button
            onClick={() => {
              setAction("");
              setModule("");
              setStartDate("");
              setEndDate("");
              loadLogs();
            }}
            className="bg-slate-500 hover:bg-slate-600 text-white px-5 py-2 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-black">Audit Log History</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-3">ID</th>

              <th className="border p-3">User</th>

              <th className="border p-3">Action</th>

              <th className="border p-3">Module</th>

              <th className="border p-3">Description</th>

              <th className="border p-3">Created</th>

              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {logs?.data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-6 text-slate-500">
                  Tidak ada audit log
                </td>
              </tr>
            ) : (
              logs?.data.map((log) => (
                <tr key={log.id}>
                  <td className="border p-3 text-black">{log.id}</td>

                  <td className="border p-3 text-black">
                    {log.user?.name ?? "-"}
                  </td>

                  <td className="border p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
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

                  <td className="border p-3 text-black">{log.module}</td>

                  <td className="border p-3 text-black">{log.description}</td>

                  <td className="border p-3 text-black">
                    {new Date(log.created_at).toLocaleString()}
                  </td>

                  <td className="border p-3">
                    <button
                      onClick={() => openDetail(log)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && selectedLog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-black">
                Audit Log Detail
              </h2>

              <button onClick={closeDetail} className="text-red-600 font-bold">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-black">User</p>

                <p className="text-slate-700">{selectedLog.user?.name}</p>
              </div>

              <div>
                <p className="font-semibold text-black">Action</p>

                <p className="text-slate-700">{selectedLog.action}</p>
              </div>

              <div>
                <p className="font-semibold text-black">Module</p>

                <p className="text-slate-700">{selectedLog.module}</p>
              </div>

              <div>
                <p className="font-semibold text-black">Created At</p>

                <p className="text-slate-700">
                  {new Date(selectedLog.created_at).toLocaleString()}
                </p>
              </div>

              <div className="col-span-2">
                <p className="font-semibold text-black">Description</p>

                <p className="text-slate-700">{selectedLog.description}</p>
              </div>

              <div>
                <p className="font-semibold text-black">IP Address</p>

                <p className="text-slate-700">{selectedLog.ip_address}</p>
              </div>

              <div>
                <p className="font-semibold text-black">Browser</p>

                <p className="text-slate-700 break-all">
                  {selectedLog.user_agent}
                </p>
              </div>
            </div>

            <hr className="my-6" />

            <div>
              <h3 className="font-bold text-lg mb-3 text-black">Old Value</h3>

              <pre className="bg-slate-100 p-4 rounded-lg overflow-auto text-sm text-black">
                {selectedLog.old_value
                  ? JSON.stringify(selectedLog.old_value, null, 2)
                  : "No Data"}
              </pre>
            </div>

            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3 text-black">New Value</h3>

              <pre className="bg-slate-100 p-4 rounded-lg overflow-auto text-sm text-black">
                {selectedLog.new_value
                  ? JSON.stringify(selectedLog.new_value, null, 2)
                  : "No Data"}
              </pre>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={closeDetail}
                className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
