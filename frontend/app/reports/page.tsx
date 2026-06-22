"use client";

import { useEffect, useState } from "react";

import { Download, Trash2, FileText, FileSpreadsheet } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

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

      await loadReports();
    } catch (err) {
      console.error(err);

      alert("Gagal membuat report.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus report ini?")) return;

    try {
      await deleteReport(id);

      await loadReports();
    } catch (err) {
      console.error(err);
    }
  }

  const pdfCount = reports.filter((r) => r.format === "pdf").length;

  const excelCount = reports.filter((r) => r.format === "excel").length;

  const typeColors: Record<string, string> = {
    MEDICINE: "bg-blue-100 text-blue-700",
    SALES: "bg-green-100 text-green-700",
    STOCK: "bg-yellow-100 text-yellow-700",
    PURCHASE_ORDER: "bg-purple-100 text-purple-700",
    AUDIT_LOG: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          <Navbar />

          <div className="p-6">Loading Reports...</div>
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
              title="Reports"
              description="Generate and manage pharmacy reports."
            />

            {/* Stats */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Reports</p>

                <h3 className="mt-2 text-3xl font-bold text-slate-800">
                  {reports.length}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">PDF Reports</p>

                <h3 className="mt-2 text-3xl font-bold text-red-600">
                  {pdfCount}
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Excel Reports</p>

                <h3 className="mt-2 text-3xl font-bold text-green-600">
                  {excelCount}
                </h3>
              </div>
            </div>

            {/* Generate Report */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-slate-800">
                  Generate Report
                </h2>

                <p className="text-sm text-slate-500">
                  Generate pharmacy reports based on type and date range.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Report Type
                  </label>

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MEDICINE">Medicine</option>

                    <option value="SALES">Sales</option>

                    <option value="STOCK">Stock</option>

                    <option value="PURCHASE_ORDER">Purchase Order</option>

                    <option value="AUDIT_LOG">Audit Log</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Format
                  </label>

                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pdf">PDF</option>

                    <option value="excel">Excel</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <PrimaryButton onClick={handleGenerate} disabled={generating}>
                  {generating ? "Generating..." : "Generate Report"}
                </PrimaryButton>
              </div>
            </div>

            {/* Report History */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  Report History
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        ID
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Type
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Format
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        User
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Generated At
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {reports.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12">
                          <div className="flex flex-col items-center">
                            <FileText
                              size={48}
                              className="mb-3 text-slate-300"
                            />

                            <p className="text-slate-500">
                              No reports generated yet
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      reports.map((report: any) => (
                        <tr
                          key={report.id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >
                          <td className="px-4 py-4 text-sm text-slate-700">
                            #{report.id}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                typeColors[report.type] ||
                                "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {report.type}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                                report.format === "pdf"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {report.format === "excel" ? (
                                <FileSpreadsheet size={14} />
                              ) : (
                                <FileText size={14} />
                              )}

                              {report.format === "excel" ? "Excel" : "PDF"}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            {report.user?.name || "-"}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            {report.generated_at
                              ? new Date(report.generated_at).toLocaleString()
                              : "-"}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  downloadReport(
                                    report.id,
                                    getExtension(report),
                                  )
                                }
                                className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white transition hover:bg-green-700"
                              >
                                <Download size={16} />
                                Download
                              </button>

                              <button
                                onClick={() => handleDelete(report.id)}
                                className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700"
                              >
                                <Trash2 size={16} />
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
          </div>
        </main>
      </div>
    </div>
  );
}
