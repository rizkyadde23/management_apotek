const API_URL = "http://127.0.0.1:8000/api";

export async function getCategories() {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(
    `${API_URL}/medicine-categories`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  return response.json();
}