import { api } from "@/lib/api";

export async function getSuppliers() {
  const response = await api.get(
    "/suppliers"
  );

  return response.data.data.data;
}