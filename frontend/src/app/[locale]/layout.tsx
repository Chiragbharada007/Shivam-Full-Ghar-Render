import { Suspense } from "react";
import { Inter, Playfair_Display, Noto_Sans_Gujarati, Noto_Sans_Devanagari } from "next/font/google";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { DynamicFavicon } from "@/components/shared/DynamicFavicon";
import { SmoothScrollProvider } from "@/components/shared/SmoothScrollProvider";
import { VisitorTracker } from "@/components/shared/VisitorTracker";
import { GlobalNavigationLoader } from "@/components/shared/GlobalNavigationLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
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

import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://shivam-full-ghar.vercel.app"),
  title: {
    default: "Shivam Full Ghar (શિવમ ફૂલ ઘર) • Bhat Simroli Fresh Wedding Flowers",
    template: "%s | Shivam Full Ghar",
  },
  description:
    "Authentic Gujarati wedding garlands (વરમાળા), bridal hair veni (વેણી), fresh mogra gajra, and floral car decorations in Bhat Simroli, Keshod, Gujarat.",
  keywords: [
    "શિવમ ફૂલ ઘર",
    "Shivam Full Ghar",
    "Bhat Simroli flowers",
    "Keshod wedding flowers",
    "વરમાળા",
    "ગજરા",
    "વેણી",
    "કાર સજાવટ",
    "Gujarati wedding varmala",
    "Saurashtra florist",
  ],
  authors: [{ name: "Shivam Full Ghar Bhat Simroli" }],
  openGraph: {
    title: "Shivam Full Ghar (શિવમ ફૂલ ઘર) • Bhat Simroli Fresh Wedding Flowers",
    description:
      "Authentic Gujarati wedding garlands, bridal hair veni, and floral decorations in Bhat Simroli, Gujarat. WhatsApp: +91 98241 32014.",
    url: "https://shivam-full-ghar.vercel.app",
    siteName: "Shivam Full Ghar",
    locale: "gu_IN",
    type: "website",
    images: [
      {
        url: "/products/hero-wedding.webp",
        width: 1200,
        height: 630,
        alt: "Shivam Full Ghar Fresh Wedding Flowers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivam Full Ghar (શિવમ ફૂલ ઘર)",
    description:
      "Authentic Gujarati wedding garlands, bridal hair veni, and floral decorations in Bhat Simroli, Gujarat.",
    images: ["/products/hero-wedding.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
      className={`dark ${inter.variable} ${playfair.variable} ${notoSansGujarati.variable} ${notoSansDevanagari.variable} antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sfg_theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-zinc-100 selection:bg-rose-500/30 selection:text-white transition-colors duration-300">
        <DynamicFavicon />
        <NextIntlClientProvider messages={messages}>
          <Suspense fallback={null}>
            <GlobalNavigationLoader />
          </Suspense>
          <VisitorTracker />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
