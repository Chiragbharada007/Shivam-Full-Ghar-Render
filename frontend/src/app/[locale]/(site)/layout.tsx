import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppFloatingButton } from "@/components/shared/WhatsAppFloatingButton";
import { StarfieldCloseCanvas } from "@/components/three/StarfieldCloseCanvas";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#061b12] text-[#282A26] relative">
      {/* Global theme-synced 3D Starfield Close tunnel behind entire storefront */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarfieldCloseCanvas />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <WhatsAppFloatingButton />
        <Footer />
      </div>
    </div>
  );
}
