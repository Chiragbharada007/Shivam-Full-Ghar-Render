import { Suspense } from "react";
import {
  Plus_Jakarta_Sans,
  Cormorant_Garamond,
  JetBrains_Mono,
  Noto_Sans_Gujarati,
  Noto_Sans_Devanagari,
} from "next/font/google";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { DynamicFavicon } from "@/components/shared/DynamicFavicon";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { VisitorTracker } from "@/components/shared/VisitorTracker";
import { GlobalNavigationLoader } from "@/components/shared/GlobalNavigationLoader";
import { NotificationProvider } from "@/components/shared/NotificationSystem";
import { TouchBulbBlastOverlay } from "@/components/shared/TouchBulbBlastOverlay";
import { Metadata } from "next";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const notoSansGujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-gujarati",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://shivam-full-ghar.onrender.com"),
  title: {
    default: "Shivam Full Ghar (શિવમ ફૂલ ઘર) • Indian Wedding Floral Boutique, Keshod",
    template: "%s | Shivam Full Ghar",
  },
  description:
    "Handcrafted Indian wedding garlands (Varmala), bridal hair veni, fresh Madurai mogra gajra, floral jewellery, and car decoration in Bhat Simroli, Keshod, Gujarat.",
  openGraph: {
    title: "Shivam Full Ghar • Fresh Wedding Flowers & Varmala Boutique",
    description:
      "Bespoke wedding garlands, bridal veni, mogra gajra, and car floral decor in Bhat Simroli, Keshod.",
    type: "website",
    images: [{ url: "/products/hero-wedding.jpg", width: 1200, height: 630, alt: "Shivam Full Ghar Wedding Florals" }],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "gu" | "hi" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${plusJakarta.variable} ${cormorant.variable} ${jetbrainsMono.variable} ${notoSansGujarati.variable} ${notoSansDevanagari.variable} antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sfg_brand_theme');if(t==='red'||t==='green'){document.documentElement.setAttribute('data-theme',t);}else{document.documentElement.setAttribute('data-theme','green');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7EF] text-[#282A26] selection:bg-[#244C38]/15 selection:text-[#163526]">
        <DynamicFavicon />
        <NextIntlClientProvider messages={messages}>
          <NotificationProvider>
            <Suspense fallback={null}>
              <GlobalNavigationLoader />
            </Suspense>
            <VisitorTracker />
            <TouchBulbBlastOverlay />
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </NotificationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
