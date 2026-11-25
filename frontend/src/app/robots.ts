// src/app/robots.ts
import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shivam-full-ghar.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/*/admin",
          "/api/admin",
          "/api/auth",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
