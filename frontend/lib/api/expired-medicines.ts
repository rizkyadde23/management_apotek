import { api } from "@/lib/api";

export async function getExpiredMedicines() {
  const response = await api.get("/expired-medicines");

  return response.data.data.data;
}

export async function getExpiringSoonMedicines() {
  const response = await api.get("/expiring-soon");

  return response.data.data.data;
}

export async function getExpiredSummary() {
  const response = await api.get("/expired-summary");

  return response.data.data;
}