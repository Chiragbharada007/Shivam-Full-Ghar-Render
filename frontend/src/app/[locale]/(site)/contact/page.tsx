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
    <div className="py-14 bg-[#FAF7EF] text-[#282A26] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#244C38]/10 text-[#244C38] border border-[#244C38]/20 text-xs font-semibold uppercase tracking-widest">
            Visit Our Floral Boutique
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#163526]">
            Connect With {settings.shopName}
          </h1>
          <p className="text-sm text-[#282A26]/80 leading-relaxed">
            Planning a wedding varmala, car floral styling, or morning store pickup in Bhat Simroli? Our florists are happy to help you choose the freshest seasonal blooms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Shop Details */}
          <div className="p-8 rounded-3xl bg-white border border-[#244C38]/15 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#9F333E]">
                Boutique Details
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#163526] mt-1">
                Bhat Simroli Flagship Shop
              </h2>
            </div>

            <div className="space-y-4 text-sm text-[#282A26]/85">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#9F333E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#163526]">Address</strong>
                  <span className="text-xs">{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#244C38] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#163526]">Phone</strong>
                  <a
                    href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`}
                    className="text-xs font-medium hover:text-[#9F333E] transition-colors"
                  >
                    {settings.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <MessageSquare className="w-5 h-5 text-[#244C38] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#163526]">WhatsApp Orders</strong>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium hover:text-[#244C38] underline decoration-[#D7B77C]"
                  >
                    {formattedWa}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#9F333E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#163526]">Business Hours</strong>
                  <span className="text-xs">{settings.openingHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#244C38] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#163526]">Email</strong>
                  <a href={`mailto:${settings.email}`} className="text-xs hover:text-[#9F333E]">
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-[#244C38]/12 flex flex-wrap gap-2.5">
              {settings.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#244C38] text-[#FAF7EF] text-xs font-semibold hover:bg-[#163526] transition-colors"
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#244C38]/20 text-[#282A26] text-xs font-medium hover:bg-[#FAF7EF]"
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#244C38]/20 text-[#282A26] text-xs font-medium hover:bg-[#FAF7EF]"
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
