import { redirect } from "next/navigation";

export default async function DeliveryAreasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/about`);
}
