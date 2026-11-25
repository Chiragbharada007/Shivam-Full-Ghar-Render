import { redirect } from "next/navigation";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/shop`);
}
