import { api } from "@/lib/api";

export async function getReports() {
  const response = await api.get("/reports");
  return response.data.data;
}

export async function getMyReports() {
  const response = await api.get("/reports/my-reports");
  return response.data.data;
}

export async function generateReport(data: any) {
  const response = await api.post("/reports/generate", data);
  return response.data;
}

export async function deleteReport(id: number) {
  const response = await api.delete(`/reports/${id}`);
  return response.data;
}

export async function downloadReport(
  id: number,
  format: "pdf" | "xlsx"
) {
  const response = await api.get(`/reports/${id}/download`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data]);

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `report-${id}.${format}`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}
