import { api } from "@/lib/api";

export async function getPreOrders() {
  const response = await api.get("/pre-orders");

  return response.data.data.data;
}

export async function getPreOrder(id: number) {
  const response = await api.get(`/pre-orders/${id}`);

  return response.data.data;
}

export async function updatePreOrder(id: number, data: any) {
  const response = await api.put(`/pre-orders/${id}`, data);

  return response.data;
}

export async function deletePreOrder(id: number) {
  const response = await api.delete(`/pre-orders/${id}`);

  return response.data;
}

export async function createPreOrder(data: any) {
  const response = await api.post("/pre-orders", data);

  return response.data;
}

export async function readyPreOrder(id: number) {
  const response = await api.patch(`/pre-orders/${id}/ready`);

  return response.data;
}

export async function completePreOrder(id: number) {
  const response = await api.patch(`/pre-orders/${id}/complete`);

  return response.data;
}

export async function cancelPreOrder(id: number) {
  const response = await api.patch(`/pre-orders/${id}/cancel`);

  return response.data;
}
