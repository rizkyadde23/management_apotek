import { api } from "../api";
import { DashboardData } from "@/types/dashboard";

interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

export async function getDashboard() {
  const response =
    await api.get<DashboardResponse>(
      "/dashboard"
    );

  return response.data.data;
}