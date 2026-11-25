import { redirect } from "next/navigation";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/shop`);
}
