import { api } from "@/lib/api";

export async function getNotificationSetting() {
  const response = await api.get("/notification-settings");

  return response.data.data;
}

export async function updateNotificationSetting(data: {
  low_stock_threshold: number;
  expired_warning_days: number;
  auto_notification: boolean;
}) {
  const response = await api.put(
    "/notification-settings",
    data
  );

  return response.data.data;
}