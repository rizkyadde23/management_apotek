"use client";

import { useEffect, useState } from "react";

import {
  getReports,
  generateReport,
  deleteReport,
  downloadReport,
} from "@/lib/api/reports";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);

  const [type, setType] = useState("MEDICINE");

  const [format, setFormat] = useState("pdf");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  function getExtension(report: any): "pdf" | "xlsx" {
    return report.format === "excel" ? "xlsx" : "pdf";
  }

  async function loadReports() {
    try {
      setLoading(true);

      const data = await getReports();

      setReports(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    try {
      setGenerating(true);

      await generateReport({
        type,
        format,
        filters: {
          start_date: startDate || null,
          end_date: endDate || null,
        },
      });

      alert("Report berhasil dibuat.");

      loadReports();
    } catch (err) {
      console.error(err);

      alert("Gagal membuat report");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus report ini?")) return;

    try {
      await deleteReport(id);

      loadReports();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Reports</h1>

      {/* Generate */}

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-bold text-lg mb-4 text-black">Generate Report</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-black">Report Type</label>

            <select
              className="border rounded-lg p-2 w-full text-black"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="MEDICINE">Medicine</option>
              <option value="SALES">Sales</option>
              <option value="STOCK">Stock</option>
              <option value="PURCHASE_ORDER">Purchase Order</option>
              <option value="AUDIT_LOG">Audit Log</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-black">Format</label>

            <select
              className="border rounded-lg p-2 w-full text-black"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>

              <option value="excel">Excel</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-black">Start Date</label>

            <input
              type="date"
              className="border rounded-lg p-2 w-full text-black"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 text-black">End Date</label>

            <input
              type="date"
              className="border rounded-lg p-2 w-full text-black"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          {generating ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* History */}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-black">Report History</h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-3">ID</th>

              <th className="border p-3">Type</th>

              <th className="border p-3">Format</th>

              <th className="border p-3">User</th>

              <th className="border p-3">Generated At</th>

              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-slate-500">
                  Tidak ada laporan
                </td>
              </tr>
            ) : (
              reports.map((report: any) => (
                <tr key={report.id}>
                  <td className="border p-3 text-black">{report.id}</td>

                  <td className="border p-3 text-black">{report.type}</td>

                  <td className="border p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        report.format === "pdf"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {report.format === "excel" ? "Excel (.xlsx)" : "PDF"}
                    </span>
                  </td>

                  <td className="border p-3 text-black">{report.user?.name}</td>

                  <td className="border p-3 text-black">
                    {report.generated_at
                      ? new Date(report.generated_at).toLocaleString()
                      : "-"}
                  </td>

                  <td className="border p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          downloadReport(report.id, getExtension(report))
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Download
                      </button>

                      <button
                        onClick={() => handleDelete(report.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
