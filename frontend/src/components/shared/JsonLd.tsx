// src/components/shared/JsonLd.tsx
import React from "react";

interface JsonLdProps {
  locale: string;
}

export function LocalBusinessJsonLd({ locale }: JsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Florist", "LocalBusiness", "Organization"],
    "@id": "https://shivam-full-ghar.vercel.app/#store",
    name: "Shivam Full Ghar (શિવમ ફૂલ ઘર)",
    alternateName: ["Shivam Flowers Bhat Simroli", "શિવમ ફ્લાવર્સ"],
    url: "https://shivam-full-ghar.vercel.app",
    logo: "https://shivam-full-ghar.vercel.app/icon-192.png",
    image: [
      "https://shivam-full-ghar.vercel.app/products/hero-wedding.webp",
      "https://shivam-full-ghar.vercel.app/products/artisan-craft.webp",
    ],
    telephone: "+91 98241 32014",
    email: "contact@shivamfullghar.com",
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Main Bazaar, Bhat Simroli",
      addressLocality: "Keshod",
      addressRegion: "Gujarat",
      postalCode: "362220",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 21.3039,
      longitude: 70.2458,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "06:00",
        closes: "22:00",
      },
    ],
    areaServed: [
      { "@type": "AdministrativeArea", name: "Bhat Simroli" },
      { "@type": "AdministrativeArea", name: "Keshod" },
      { "@type": "AdministrativeArea", name: "Junagadh" },
      { "@type": "AdministrativeArea", name: "Saurashtra" },
    ],
    sameAs: [
      "https://maps.google.com/?q=Shivam+Full+Ghar+Bhat+Simroli",
      "https://wa.me/919824132014",
    ],
    description:
      locale === "gu"
        ? "ભાટ સિમરોલી અને સૌરાષ્ટ્ર માટે અસલ તાજા ફૂલોની વરમાળા, કાર સજાવટ, બ્રાઇડલ વેણી અને તાજા મોગરા ગજરા."
        : locale === "hi"
        ? "भाट सिमरौली एवं सौराष्ट्र के लिए विशेष ताजे फूलों की वरमाला, कार सजावट और ब्राइडल वेणी।"
        : "Authentic Gujarati fresh wedding garlands (Varmala), bridal hair veni, and floral car decoration in Bhat Simroli and Keshod, Gujarat.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd({ locale }: JsonLdProps) {
  const faqs =
    locale === "gu"
      ? [
          {
            q: "વરમાળા માટે કેટલો સમય અગાઉ ઓર્ડર આપવો જોઈએ?",
            a: "સામાન્ય પ્રસંગ માટે ૧ થી ૨ દિવસ અગાઉ અને મોટા લગ્ન પ્રસંગ માટે ૩ થી ૫ દિવસ અગાઉ વોટ્સએપ પર ઓર્ડર આપવો હિતાવહ છે જેથી તાજા ફૂલો મંગાવી શકાય.",
          },
          {
            q: "શું તમે કસ્ટમ ડિઝાઇન મુજબ વરમાળા અને વેણી બનાવો છો?",
            a: "હા, તમે ઇન્સ્ટાગ્રામ કે પિન્ટરેસ્ટ પરથી કોઈપણ ફોટો મોકલી શકો છો, અમારા કારીગરો તે જ મુજબ તાજા ફૂલોમાંથી બનાવી આપે છે.",
          },
          {
            q: "દુકાનનું સરનામું શું છે?",
            a: "શિવમ ફૂલ ઘર, ભાટ સિમરોલી, કેશોદ નજીક, જિલ્લો જૂનાગઢ, ગુજરાત. ફોન: +91 98241 32014.",
          },
        ]
      : locale === "hi"
      ? [
          {
            q: "वरमाला के लिए कितने समय पहले ऑर्डर देना चाहिए?",
            a: "विवाह प्रसंग के लिए २ से ३ दिन पहले ऑर्डर देना उत्तम रहता है ताकि ताजे फूलों की व्यवस्था हो सके।",
          },
          {
            q: "क्या कस्टम डिज़ाइन के अनुसार वरमाला उपलब्ध है?",
            a: "हाँ, आप व्हाट्सएप पर कोई भी संदर्भ फोटो साझा कर सकते हैं।",
          },
        ]
      : [
          {
            q: "How far in advance should wedding garlands be booked?",
            a: "We recommend booking 2 to 3 days in advance to ensure the freshest morning handpicked flowers.",
          },
          {
            q: "Do you create custom garland designs from photos?",
            a: "Yes! You can share your reference photo on WhatsApp and our artisans will handcraft it.",
          },
        ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
