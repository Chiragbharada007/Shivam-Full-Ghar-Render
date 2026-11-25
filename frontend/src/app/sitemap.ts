import { MetadataRoute } from "next";
import { getStorefrontCategories } from "@/lib/categories";
import { getAllActiveCustomPages } from "@/lib/custom-pages";
import { CATALOG_PRODUCTS } from "@/lib/catalog";
import { getStorefrontProducts } from "@/lib/products";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shivam-full-ghar.vercel.app";
const LOCALES = ["gu", "hi", "en"];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];
  const now = new Date();

  // 1. Core Pages per Locale
  const staticPages = [
    "",
    "/shop",
    "/packages",
    "/custom-design",
    "/gallery",
    "/about",
    "/contact",
    "/privacy",
  ];

  for (const locale of LOCALES) {
    for (const page of staticPages) {
      routes.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  // 2. Dynamic Categories from PostgreSQL
  try {
    const categories = await getStorefrontCategories();
    for (const locale of LOCALES) {
      for (const cat of categories) {
        routes.push({
          url: `${BASE_URL}/${locale}/shop?category=${cat.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch (err) {
    console.warn("Sitemap category query failed:", err);
  }

  // 3. Products
  try {
    let products = await getStorefrontProducts();
    if (!products || products.length === 0) products = CATALOG_PRODUCTS;

    for (const locale of LOCALES) {
      for (const p of products) {
        routes.push({
          url: `${BASE_URL}/${locale}/product/${p.code}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch (err) {
    console.warn("Sitemap product query failed:", err);
  }

  // 4. Dynamic Custom Pages from PostgreSQL (P8-T19)
  try {
    const customPages = await getAllActiveCustomPages();
    for (const locale of LOCALES) {
      for (const cp of customPages) {
        routes.push({
          url: `${BASE_URL}/${locale}/pages/${cp.slug}`,
          lastModified: new Date(cp.updatedAt),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch (err) {
    console.warn("Sitemap custom pages query failed:", err);
  }

  return routes;
}
