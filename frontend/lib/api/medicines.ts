import { api } from "@/lib/api";

export async function getMedicines(search = "") {
  const response = await api.get(`/medicines?search=${search}`);

  return response.data.data.data;
}

export async function getMedicine(id: number) {
  const response = await api.get(`/medicines/${id}`);

  return response.data.data;
}

export async function createMedicine(data: any) {
  const response = await api.post("/medicines", data);

  return response.data;
}

export async function updateMedicine(id: number, data: any) {
  const response = await api.put(`/medicines/${id}`, data);

  return response.data;
}

export async function deleteMedicine(id: number) {
  const response = await api.delete(`/medicines/${id}`);

  return response.data;
}
