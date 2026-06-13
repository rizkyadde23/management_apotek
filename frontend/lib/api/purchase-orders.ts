import { api } from "@/lib/api";

export async function getPurchaseOrders() {
  const response = await api.get("/purchase-orders");

  return response.data.data.data;
}

export async function createPurchaseOrder(data: any) {
  const response = await api.post("/purchase-orders", data);

  return response.data;
}

export async function approvePurchaseOrder(id: number) {
  const response = await api.patch(`/purchase-orders/${id}/approve`);

  return response.data;
}

export async function receivePurchaseOrder(id: number) {
  const response = await api.patch(`/purchase-orders/${id}/receive`);

  return response.data;
}

export async function cancelPurchaseOrder(id: number) {
  const response = await api.patch(`/purchase-orders/${id}/cancel`);

  return response.data;
}
