import { api } from "@/lib/api";
import { Supplier } from "@/types/supplier";

export async function getSuppliers() {
  const response = await api.get("/suppliers");

  return response.data.data.data;
}

export async function getSupplier(id: number) {
  const response = await api.get(`/suppliers/${id}`);

  return response.data.data;
}

export async function createSupplier(data: Partial<Supplier>) {
  const response = await api.post("/suppliers", data);

  return response.data;
}

export async function updateSupplier(id: number, data: Partial<Supplier>) {
  const response = await api.put(`/suppliers/${id}`, data);

  return response.data;
}

export async function deleteSupplier(id: number) {
  const response = await api.delete(`/suppliers/${id}`);

  return response.data;
}
