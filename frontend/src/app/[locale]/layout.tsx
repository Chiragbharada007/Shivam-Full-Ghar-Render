import { Suspense } from "react";
import {
  Plus_Jakarta_Sans,
  Cormorant_Garamond,
  Syne,
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

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
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
    default: "Shivam Full Ghar (શિવમ ફૂલ ઘર) • Bhat Simroli Fresh Wedding Flowers",
    template: "%s | Shivam Full Ghar",
  },
  description:
    "Authentic Gujarati wedding garlands (વરમાળા), bridal hair veni (વેણી), fresh mogra gajra, and floral car decorations in Bhat Simroli, Keshod, Gujarat.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
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
      className={`dark ${plusJakarta.variable} ${cormorant.variable} ${syne.variable} ${jetbrainsMono.variable} ${notoSansGujarati.variable} ${notoSansDevanagari.variable} antialiased`}
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
      <body className="min-h-screen flex flex-col bg-[#faf9f6] text-zinc-900 dark:bg-[#07050c] dark:text-zinc-100 selection:bg-purple-500/30 selection:text-white transition-colors duration-300">
        <DynamicFavicon />
        <NextIntlClientProvider messages={messages}>
          <NotificationProvider>
            <Suspense fallback={null}>
              <GlobalNavigationLoader />
            </Suspense>
            <VisitorTracker />
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </NotificationProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
