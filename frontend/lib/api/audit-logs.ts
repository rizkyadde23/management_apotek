import { api } from "@/lib/api";

export async function getAuditLogs() {
  const response = await api.get("/audit-logs");

  return response.data.data;
}

export async function filterAuditLogs(filters: any) {
  const response = await api.post("/audit-logs/filter", filters);

  return response.data.data;
}

export async function getAuditLog(id: number) {
  const response = await api.get(`/audit-logs/${id}`);

  return response.data.data;
}