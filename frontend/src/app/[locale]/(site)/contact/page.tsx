import { MapPin, Phone, Clock, Mail, MessageSquare, Navigation } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";
import { InstagramIcon, FacebookIcon } from "@/components/shared/SocialIcons";
import { ContactInquiryForm } from "@/components/site/ContactInquiryForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const formattedWa = settings.whatsappNumber.startsWith("+")
    ? settings.whatsappNumber
    : `+${settings.whatsappNumber}`;

  return (
    <div className="py-8 sm:py-14 px-3 sm:px-6 bg-transparent text-[#282A26] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 rounded-3xl bg-white/88 backdrop-blur-md border border-white/25 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand text-xs font-semibold uppercase tracking-widest">
            Visit Our Floral Boutique
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-brand-deep">
            Connect With {settings.shopName}
          </h1>
          <p className="text-sm text-[#282A26]/80 leading-relaxed">
            Planning a wedding varmala, car floral styling, or morning store pickup in Bhat Simroli? Our florists are happy to help you choose the freshest seasonal blooms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Shop Details */}
          <div className="p-8 rounded-3xl bg-white border border-brand shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-brand-primary">
                Boutique Details
              </span>
              <h2 className="font-serif font-bold text-2xl text-brand-deep mt-1">
                Bhat Simroli Flagship Shop
              </h2>
            </div>

            <div className="space-y-4 text-sm text-[#282A26]/85">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-deep">Address</strong>
                  <span className="text-xs">{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-deep">Phone</strong>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                    className="text-xs font-medium hover:text-brand-primary transition-colors"
                  >
                    {settings.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MessageSquare className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-deep">WhatsApp Orders</strong>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium hover:text-brand-primary underline decoration-[#D7B77C]"
                  >
                    {formattedWa}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-deep">Business Hours</strong>
                  <span className="text-xs">{settings.openingHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-brand-deep">Email</strong>
                  <a href={`mailto:${settings.email}`} className="text-xs hover:text-brand-primary">
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-brand flex flex-wrap gap-2.5">
              {settings.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-[#FAF7EF] text-xs font-semibold hover:bg-brand-deep transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#D7B77C]" />
                  <span>Google Maps Directions</span>
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand text-[#282A26] text-xs font-medium hover:bg-[#FAF7EF]"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                  <span>Instagram</span>
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand text-[#282A26] text-xs font-medium hover:bg-[#FAF7EF]"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
              )}
            </div>
          </div>

          {/* Functional Inquiry Form */}
          <ContactInquiryForm whatsappNumber={settings.whatsappNumber} />
        </div>
      </div>
    </div>
  );
}
