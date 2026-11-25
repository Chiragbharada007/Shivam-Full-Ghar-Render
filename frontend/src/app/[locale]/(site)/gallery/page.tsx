import { getTranslations } from "next-intl/server";
import { Sparkles, Camera, MapPin } from "lucide-react";
import { SmartImage } from "@/components/shared/SmartImage";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const galleryItems = [
    {
      title: "Royal Red Rose Varmala Couple Pair",
      location: "Bhat Simroli Mandapam",
      category: "Wedding Garlands",
      image: "/products/VM-R01.jpg",
    },
    {
      title: "Sunshine Marigold & Jasmine Varmala",
      location: "Agatrai Community Hall",
      category: "Traditional Jaimala",
      image: "/products/VM-Y01.jpg",
    },
    {
      title: "Luxury Mercedes Rose Front Bonnet Decor",
      location: "Bhat Simroli",
      category: "Car Decoration",
      image: "/products/CR-01.jpg",
    },
    {
      title: "Pastel Pink Rose & Gypsophila Varmala",
      location: "Mangrol Beach Resort",
      category: "Destination Varmala",
      image: "/products/VM-P01.jpg",
    },
    {
      title: "Authentic Madurai Mogra Gajra Pair",
      location: "Shil Village Wedding",
      category: "Fresh Mogra Gajra",
      image: "/products/GJ-01.jpg",
    },
    {
      title: "Bridal Fresh Rose & Jasmine Braided Veni",
      location: "Sondarda Bridal Suite",
      category: "Hair Flowers",
      image: "/products/HF-01.jpg",
    },
    {
      title: "Full Bridal 7-Piece Floral Jewellery Set",
      location: "Bhat Simroli Haldi Ceremony",
      category: "Floral Jewellery",
      image: "/products/FJ-01.jpg",
    },
    {
      title: "Grand Imperial Rose & Orchid 5 ft Varmala",
      location: "Royal Palace Grounds",
      category: "Imperial Garlands",
      image: "/products/VM-R02.jpg",
    },
    {
      title: "Heritage Vintage Baraat Car Net Canopy",
      location: "Malia Hatina",
      category: "Car Decoration",
      image: "/products/CR-02.jpg",
    },
    {
      title: "Sacred Lotus Bud & Rose Royal Garland",
      location: "Somnath Temple Wedding",
      category: "Lotus Varmala",
      image: "/products/VM-L01.jpg",
    },
    {
      title: "Mehndi Ceremony Floral Haath-Phool & Earring Set",
      location: "Bhat Simroli",
      category: "Floral Jewellery",
      image: "/products/FJ-02.jpg",
    },
    {
      title: "Florist Handcrafting Morning Blossoms",
      location: "Shivam Full Ghar Workshop",
      category: "Artisan Craft",
      image: "/products/artisan-craft.jpg",
    },
  ];

  return (
    <div className="py-14 bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-zinc-100 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-rose-600 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-rose-500" />
            <span>Real Weddings in Saurashtra</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-zinc-900 dark:text-white">
            Floral Masterpiece Gallery
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Actual weddings and celebrations adorned with Shivam Full Ghar's morning-harvested fresh floral creations across Bhat Simroli, Mangrol, Junagadh, and Saurashtra villages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
            >
              <div className="aspect-4/3 overflow-hidden bg-zinc-100 dark:bg-zinc-950 relative">
                <SmartImage
                  src={item.image}
                  alt={item.title}
                  variant="thumb"
                  aspectRatio="auto"
                  className="w-full h-full"
                  imageClassName="group-hover:scale-108 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium border border-white/20 z-10">
                  {item.category}
                </span>
              </div>
              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-zinc-900 dark:text-white text-sm leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-black/10 dark:border-white/10 font-sans">
                  <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
