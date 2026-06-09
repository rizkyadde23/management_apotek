const API_URL = "http://127.0.0.1:8000/api";

function getHeaders() {
  const token = localStorage.getItem("auth_token");

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

export async function getMedicines(search = "") {
  const response = await fetch(
    `${API_URL}/medicines?search=${search}`,
    {
      headers: getHeaders(),
    }
  );

  return response.json();
}

export async function getMedicine(id: number) {
  const response = await fetch(
    `${API_URL}/medicines/${id}`,
    {
      headers: getHeaders(),
    }
  );

  return response.json();
}

export async function createMedicine(data: unknown) {
  const response = await fetch(
    `${API_URL}/medicines`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function updateMedicine(
  id: number,
  data: unknown
) {
  const response = await fetch(
    `${API_URL}/medicines/${id}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }
  );

  return response.json();
}

export async function deleteMedicine(id: number) {
  const response = await fetch(
    `${API_URL}/medicines/${id}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  return response.json();
}