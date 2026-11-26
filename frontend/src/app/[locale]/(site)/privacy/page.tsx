// src/app/[locale]/(site)/privacy/page.tsx
import { Metadata } from "next";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy • Shivam Full Ghar (શિવમ ફૂલ ઘર)",
  description: "Privacy-first visitor policy for Shivam Full Ghar Bhat Simroli. Zero personal data logging, no full IP storage, safe Indian wedding floral service.",
};

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-primary/10 border border-brand flex items-center justify-center text-brand-primary">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 dark:text-white">
          {locale === "gu"
            ? "ગોપનીયતા નીતિ (Privacy Policy)"
            : locale === "hi"
            ? "गोपनीयता नीति (Privacy Policy)"
            : "Privacy Policy"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
          {locale === "gu"
            ? "શિવમ ફૂલ ઘર ભાટ સિમરોલી તમારી અંગત માહિતી અને સુરક્ષાને સર્વોચ્ચ પ્રાથમિકતા આપે છે."
            : locale === "hi"
            ? "शिवम फूल घर भाट सिमरौली आपकी व्यक्तिगत जानकारी और सुरक्षा को सर्वोच्च प्राथमिकता देता है।"
            : "Shivam Full Ghar Bhat Simroli is committed to protecting your privacy and personal data."}
        </p>
      </div>

      {/* Content Blocks */}
      <div className="space-y-6 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-white dark:bg-stone-900/60 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-primary" />
            <span>
              {locale === "gu"
                ? "૧. સંપૂર્ણ આઈપી એડ્રેસ સંગ્રહિત થતું નથી (No Full IP Storage)"
                : locale === "hi"
                ? "१. पूर्ण आईपी पता संग्रहीत नहीं किया जाता (No Full IP Storage)"
                : "1. Privacy-First Visitor Logging (No Full IP Stored)"}
            </span>
          </h2>
          <p>
            {locale === "gu"
              ? "અમે કોઈપણ મુલાકાતીનું સંપૂર્ણ આઈપી એડ્રેસ સંગ્રહિત કરતા નથી. સુરક્ષા અને વેબસાઇટ ઝડપ ચકાસવા માટે આઈપી એડ્રેસને તુરંત જ એકતરફી SHA-256 ક્રિપ્ટોગ્રાફિક હેશમાં ફેરવવામાં આવે છે જેથી કોઈ વ્યક્તિગત ઓળખ શક્ય ન રહે."
              : locale === "hi"
              ? "हम किसी भी आगंतुक का पूर्ण आईपी पता संग्रहीत नहीं करते हैं। सुरक्षा और वेबसाइट की गति के लिए आईपी पते को तुरंत एकतरफा SHA-256 हैश में बदल दिया जाता है।"
              : "We do not store complete IP addresses. To measure site traffic without identifying visitors, IP addresses are anonymized and converted into one-way cryptographic SHA-256 hashes."}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-brand-primary" />
            <span>
              {locale === "gu"
                ? "૨. વ્યક્તિગત વિગતો ફક્ત ફોર્મ ભરતી વખતે જ લેવાય છે (Form Data Only)"
                : locale === "hi"
                ? "२. व्यक्तिगत विवरण केवल फॉर्म भरते समय एकत्र किया जाता है"
                : "2. Personal Details Collected Only via Explicit Forms"}
            </span>
          </h2>
          <p>
            {locale === "gu"
              ? "તમારું નામ, મોબાઈલ નંબર અને પ્રસંગ તારીખ જેવી વ્યક્તિગત માહિતી ત્યારે જ સંગ્રહિત થાય છે જ્યારે તમે કસ્ટમ ફૂલ ડિઝાઇન અથવા ક્વોટેશન માટે જાતે ફોર્મ ભરો છો. આ વિગતો માત્ર તમારા ઓર્ડર અને વોટ્સએપ સંપર્ક માટે જ વપરાય છે."
              : locale === "hi"
              ? "आपका नाम, मोबाइल नंबर और प्रसंग तिथि तभी सुरक्षित की जाती है जब आप कस्टम डिज़ाइन या कोटेशन फॉर्म भरते हैं।"
              : "Personal details such as name, mobile number, and wedding date are saved only when you voluntarily submit a custom floral design enquiry or quotation request."}
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-primary" />
            <span>
              {locale === "gu"
                ? "૩. ડેટા સુરક્ષા અને સંચાલન સંપર્ક (Contact Information)"
                : locale === "hi"
                ? "३. डेटा सुरक्षा एवं संपर्क जानकारी"
                : "3. Data Safety & Shop Contact"}
            </span>
          </h2>
          <p>
            {locale === "gu"
              ? "કોઈપણ પ્રશ્ન અથવા તમારા ડેટાને દૂર કરવા માટે, કૃપા કરીને અમારો સંપર્ક કરો: શિવમ ફૂલ ઘર, ભાટ સિમરોલી, જૂનાગઢ, ગુજરાત. વોટ્સએપ / ફોન: +91 98241 32014."
              : locale === "hi"
              ? "किसी भी प्रश्न या अपने डेटा को हटाने के लिए कृपया हमसे संपर्क करें: शिवम फूल घर, भाट सिमरौली, जूनागढ़, गुजरात। व्हाट्सएप / फोन: +91 98241 32014."
              : "For questions or data deletion requests, please contact: Shivam Full Ghar, Bhat Simroli, Junagadh District, Gujarat, India. Phone / WhatsApp: +91 98241 32014."}
          </p>
        </section>
      </div>
    </div>
  );
}
