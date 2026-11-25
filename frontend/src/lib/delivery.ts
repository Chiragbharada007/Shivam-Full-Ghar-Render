import { gatewayFetch } from "@/lib/gateway";

export async function getActiveDeliveryAreas() {
  const res = await gatewayFetch<{ success: boolean; areas: any[] }>("/api/delivery-areas");
  return res?.areas || [];
}

export async function getActiveTimeSlots() {
  const res = await gatewayFetch<{ success: boolean; timeSlots: any[] }>("/api/delivery-areas");
  return res?.timeSlots || [];
}

export function getEarliestDeliveryDate(prepDays: number = 2): Date {
  const date = new Date();
  date.setDate(date.getDate() + Math.max(1, prepDays));
  date.setHours(0, 0, 0, 0);
  return date;
}
