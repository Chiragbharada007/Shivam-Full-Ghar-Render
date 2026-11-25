import { MapPin, Phone, Clock, Mail, MessageSquare, Globe } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/shared/SocialIcons";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getSiteSettings();

  return (
    <div className="py-14 bg-[#faf9f6] text-zinc-900 dark:bg-[#060606] dark:text-zinc-100 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-zinc-900 dark:text-white">
            Contact {settings.shopName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Have questions regarding bulk wedding orders, car decorations, or boutique store pickup? Reach out to our Bhat Simroli florists directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-sm space-y-6 transition-colors">
            <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white">
              Shop Information
            </h3>

            <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-zinc-900 dark:text-white text-sm">Our Bhat Simroli Shop</strong>
                  <span>{settings.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                <div>
                  <strong className="block text-zinc-900 dark:text-white text-sm">Call Direct</strong>
                  <a href={`tel:${settings.contactPhone.replace(/\s+/g, "")}`} className="hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors">
                    {settings.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#25D366] shrink-0" />
                <div>
                  <strong className="block text-zinc-900 dark:text-white text-sm">WhatsApp Orders</strong>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors"
                  >
                    +{settings.whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <strong className="block text-zinc-900 dark:text-white text-sm">Business Hours</strong>
                  <span>{settings.openingHours}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <div>
                  <strong className="block text-zinc-900 dark:text-white text-sm">Email Inquiries</strong>
                  <span>{settings.email}</span>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-black/10 dark:border-white/10">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-2.5">Follow Our Floral Work:</p>
              <div className="flex items-center gap-3">
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-black/10 dark:border-white/10 transition-colors"
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-black/10 dark:border-white/10 transition-colors"
                  >
                    <FacebookIcon className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </a>
                )}
                {settings.googleMapsUrl && (
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-medium border border-black/10 dark:border-white/10 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Google Maps</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 shadow-sm space-y-4 transition-colors">
            <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-white">
              Send an Inquiry
            </h3>
            <form className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Vora"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">WhatsApp Mobile *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Event Date</label>
                <input
                  type="date"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white focus:outline-hidden focus:border-rose-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Message / Flowers Required *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Let us know what varmalas, car decoration, or ceremony flowers you are looking for..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-hidden focus:border-rose-500 transition-colors"
                />
              </div>

              <button
                type="button"
                className="w-full py-3.5 rounded-2xl bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Send Direct Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
