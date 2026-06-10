import { api } from "@/lib/api";

export async function getUsers() {
  const response =
    await api.get("/users");

  return response.data.data.data;
}

export async function createUser(
  data: any
) {
  const response =
    await api.post("/users", data);

  return response.data;
}

export async function updateUser(
  id: number,
  data: any
) {
  const response =
    await api.put(
      `/users/${id}`,
      data
    );

  return response.data;
}

export async function deleteUser(
  id: number
) {
  const response =
    await api.delete(
      `/users/${id}`
    );

  return response.data;
}