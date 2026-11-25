// src/app/[locale]/admin/products/page.tsx
import { getAdminProducts } from "@/lib/products";
import { ProductManager } from "@/components/admin/ProductManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const products = await getAdminProducts();

  return <ProductManager initialProducts={products} locale={locale} />;
}
