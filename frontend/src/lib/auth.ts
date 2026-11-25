import { cookies } from "next/headers";
import { gatewayFetch } from "@/lib/gateway";

export type AdminRole = "OWNER" | "MANAGER" | "STAFF";

export async function auth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sfg_admin_token")?.value;
  if (!token) return null;

  const data = await gatewayFetch<{ authenticated: boolean; user: { id: string; email: string; name: string; role: AdminRole } }>(
    "/api/auth/me",
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!data?.authenticated || !data.user) return null;
  return { user: data.user };
}
