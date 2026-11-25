import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppFloatingButton } from "@/components/shared/WhatsAppFloatingButton";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-zinc-100 transition-colors duration-300 relative">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
