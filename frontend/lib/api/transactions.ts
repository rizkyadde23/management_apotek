import { api } from "@/lib/api";

export async function getTransactions() {
  const response = await api.get("/transactions");

  return response.data.data.data;
}

export async function getTransaction(id: number) {
  const response = await api.get(`/transactions/${id}`);

  return response.data.data;
}
