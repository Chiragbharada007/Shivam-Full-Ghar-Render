import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppFloatingButton } from "@/components/shared/WhatsAppFloatingButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF7EF] text-[#282A26] relative">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <WhatsAppFloatingButton />
      <Footer />
    </div>
  );
}
