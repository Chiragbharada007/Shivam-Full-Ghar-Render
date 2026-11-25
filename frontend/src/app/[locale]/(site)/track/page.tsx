import { redirect } from "next/navigation";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/contact`);
}
