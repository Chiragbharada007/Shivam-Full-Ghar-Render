import { Camera } from "lucide-react";
import { GalleryLightboxGrid } from "@/components/site/GalleryLightboxGrid";

export default async function GalleryPage() {
  const galleryItems = [
    { title: "Royal Red Rose Varmala Couple Pair", location: "Bhat Simroli Mandapam", category: "Wedding Garlands", image: "/products/VM-R01.jpg" },
    { title: "Sunshine Marigold & Jasmine Varmala", location: "Agatrai Community Hall", category: "Wedding Garlands", image: "/products/VM-Y01.jpg" },
    { title: "Luxury Sedan Rose Bonnet Decor", location: "Bhat Simroli", category: "Car Decoration", image: "/products/CR-01.jpg" },
    { title: "Pastel Pink Rose & Gypsophila Varmala", location: "Mangrol Beach Resort", category: "Wedding Garlands", image: "/products/VM-P01.jpg" },
    { title: "Authentic Madurai Mogra Gajra Pair", location: "Shil Village Wedding", category: "Gajra & Veni", image: "/products/GJ-01.jpg" },
    { title: "Bridal Fresh Rose & Jasmine Braided Veni", location: "Sondarda Bridal Suite", category: "Gajra & Veni", image: "/products/HF-01.jpg" },
    { title: "Full Bridal 7-Piece Floral Jewellery Set", location: "Bhat Simroli Haldi Ceremony", category: "Floral Jewellery", image: "/products/FJ-01.jpg" },
    { title: "Grand Imperial Rose & Orchid 5 ft Varmala", location: "Royal Palace Grounds", category: "Wedding Garlands", image: "/products/VM-R02.jpg" },
    { title: "Heritage Baraat Car Net Canopy", location: "Malia Hatina", category: "Car Decoration", image: "/products/CR-02.jpg" },
    { title: "Sacred Lotus Bud & Rose Royal Garland", location: "Somnath Temple Wedding", category: "Wedding Garlands", image: "/products/VM-L01.jpg" },
    { title: "Mehndi Floral Haath-Phool & Earring Set", location: "Bhat Simroli", category: "Floral Jewellery", image: "/products/FJ-02.jpg" },
    { title: "Florist Handcrafting Morning Blossoms", location: "Shivam Full Ghar Workshop", category: "Artisan Craft", image: "/products/artisan-craft.jpg" },
  ];

  return (
    <div className="py-14 bg-[#FAF7EF] text-[#282A26] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-primary/10 border border-brand text-brand-primary text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-brand-primary" />
            <span>Real Weddings in Saurashtra</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-deep">
            Floral Masterpiece Gallery
          </h1>
          <p className="text-sm text-[#282A26]/75 leading-relaxed">
            Actual weddings and celebrations adorned with Shivam Full Ghar's morning-harvested fresh floral creations across Bhat Simroli, Keshod, Mangrol, and Junagadh.
          </p>
        </div>

        <GalleryLightboxGrid items={galleryItems} />
      </div>
    </div>
  );
}
