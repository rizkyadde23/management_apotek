import { api } from "@/lib/api";

export async function getStockMovements() {
  const response = await api.get("/stock-movements");

  return response.data.data.data;
}

export async function stockIn(
  medicineId: number,
  data: {
    quantity: number;
    notes?: string;
  },
) {
  const response = await api.post(`/medicines/${medicineId}/stock-in`, data);

  return response.data.data;
}

export async function stockOut(
  medicineId: number,
  data: {
    quantity: number;
    notes?: string;
  },
) {
  const response = await api.post(`/medicines/${medicineId}/stock-out`, data);

  return response.data.data;
}
