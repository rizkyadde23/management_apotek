import { api } from "@/lib/api";

export async function getLowStock() {
  const response = await api.get("/low-stock");

  return response.data.data.data;
}

export async function getOutOfStock() {
  const response = await api.get("/out-of-stock");

  return response.data.data.data;
}

export async function getLowStockSummary() {
  const response = await api.get("/low-stock-summary");

  return response.data.data;
}
