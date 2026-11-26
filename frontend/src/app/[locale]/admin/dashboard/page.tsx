import { cookies } from "next/headers";
import { gatewayFetch } from "@/lib/gateway";
import { GlassyDashboardView } from "@/components/admin/GlassyDashboardView";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let kpis = {
    totalRequests: 0,
    pendingRequests: 0,
    totalQuotations: 0,
    acceptedQuotations: 0,
    totalProducts: 0,
  };
  let recentRequests: any[] = [];
  let recentVisits: any[] = [];

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sfg_admin_token")?.value;
    const data = await gatewayFetch<any>("/api/admin/dashboard", {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (data?.success) {
      recentRequests = data.recentRequests || [];
      recentVisits = data.recentVisits || [];
      kpis = {
        totalRequests: data.kpis?.totalRequests || 0,
        pendingRequests: recentRequests.filter((r: any) => r.status === "SUBMITTED").length,
        totalQuotations: data.kpis?.totalQuotations || 0,
        acceptedQuotations: data.kpis?.acceptedQuotations || 0,
        totalProducts: data.kpis?.totalProducts || 0,
      };
    }
  } catch (e) {
    console.error("Dashboard metrics error:", e);
  }

  return (
    <GlassyDashboardView
      locale={locale}
      kpis={kpis}
      recentRequests={recentRequests}
      recentVisits={recentVisits}
    />
  );
}
