import { api } from "@/lib/api";
import { Category } from "@/types/category";

export async function getCategories() {
  const response = await api.get(
    "/medicine-categories"
  );

  return response.data.data.data;
}

export async function getCategory(
  id: number
) {
  const response = await api.get(
    `/medicine-categories/${id}`
  );

  return response.data.data;
}

export async function createCategory(
  data: Partial<Category>
) {
  const response = await api.post(
    "/medicine-categories",
    data
  );

  return response.data;
}

export async function updateCategory(
  id: number,
  data: Partial<Category>
) {
  const response = await api.put(
    `/medicine-categories/${id}`,
    data
  );

  return response.data;
}

export async function deleteCategory(
  id: number
) {
  const response = await api.delete(
    `/medicine-categories/${id}`
  );

  return response.data;
}