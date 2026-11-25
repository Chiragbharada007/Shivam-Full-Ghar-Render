// src/lib/catalog.ts
// Authentic Indian Wedding Floral Catalog inspired by FloralHub & Flower N Petals & Floriwish
// Tailored for Shivam Full Ghar (Bhat Simroli, Gujarat)

export interface ProductCatalogItem {
  id: string;
  code: string;
  name: {
    gu: string;
    hi: string;
    en: string;
  };
  category: "garlands" | "car-decoration" | "hair-flowers" | "gajra" | "floral-jewellery";
  categoryName: {
    gu: string;
    hi: string;
    en: string;
  };
  colour: "red" | "yellow" | "white" | "pink" | "purple" | "multicolour";
  price: number; // in rupees
  mrp: number; // original price before discount
  prepDays: number;
  image: string;
  secondaryImage: string;
  rating: number;
  reviewsCount: number;
  bestseller?: boolean;
  pairInfo: {
    gu: string;
    hi: string;
    en: string;
  };
  flowersUsed: {
    gu: string;
    hi: string;
    en: string;
  };
  description: {
    gu: string;
    hi: string;
    en: string;
  };
  options?: Array<{
    id: string;
    label: string;
    priceAdd: number;
  }>;
  addOns?: Array<{
    id: string;
    label: string;
    price: number;
  }>;
}

export const CATALOG_PRODUCTS: ProductCatalogItem[] = [
  // ── Wedding Garlands (Varmala) ──
  {
    id: "prod-vm-r01",
    code: "VM-R01",
    name: {
      gu: "રોયલ રાજપૂતાના લાલ ગુલાબ વરમાળા (જોડ)",
      hi: "रॉयल राजपूताना लाल गुलाब वरमाला (जोड़ी)",
      en: "Royal Rajputana Red Rose Varmala (Pair)",
    },
    category: "garlands",
    categoryName: {
      gu: "વરમાળા",
      hi: "वरमाला",
      en: "Wedding Garlands",
    },
    colour: "red",
    price: 4500,
    mrp: 5500,
    prepDays: 2,
    image: "/products/VM-R01.jpg",
    secondaryImage: "/products/hero-wedding.jpg",
    rating: 4.95,
    reviewsCount: 68,
    bestseller: true,
    pairInfo: {
      gu: "૧ જોડ (વરરાજા અને કન્યા માટે ૨ માળા)",
      hi: "1 जोड़ी (दूल्हा और दुल्हन के लिए 2 माला)",
      en: "1 Pair (2 Garlands for Groom & Bride)",
    },
    flowersUsed: {
      gu: "ડચ લાલ ગુલાબ • સફેદ મોગરા • ગોલ્ડ જરી ટસલ",
      hi: "डच लाल गुलाब • सफेद मोगरा • गोल्ड जरी टसल",
      en: "Dutch Red Roses • Fresh White Mogra • Gold Zari Tassels",
    },
    description: {
      gu: "પ્રખ્યાત શાહી લગ્ન વરમાળા. તાજા ચૂંટેલા લાલ ગુલાબ અને સુગંધિત મોગરાની ગૂંથણી સાથે સૌરાષ્ટ્રના લગ્નો માટે ખાસ બનાવેલ.",
      hi: "शाही विवाह वरमाला। ताजे लाल गुलाब और सुगंधित मोगरे की बुनाई के साथ सौराष्ट्र के शादियों के लिए विशेष निर्मित।",
      en: "Majestic Rajputana bridal varmala pair hand-strung with velvety Dutch red roses, fragrant jasmine accents, and finished with regal golden zari tassels.",
    },
    options: [
      { id: "opt-3ft", label: "3.5 ft (Standard)", priceAdd: 0 },
      { id: "opt-4ft", label: "4.5 ft (Royal Pair)", priceAdd: 500 },
      { id: "opt-5ft", label: "5.5 ft (Imperial Grand)", priceAdd: 1000 },
    ],
    addOns: [
      { id: "add-spray", label: "Aromatic Mogra Mist & Flower Preservation Spray", price: 100 },
      { id: "add-box", label: "Luxury Satin Padded Presentation Box", price: 250 },
    ],
  },
  {
    id: "prod-vm-y01",
    code: "VM-Y01",
    name: {
      gu: "મેરીગોલ્ડ સનશાઈન અને મોગરા વરમાળા (જોડ)",
      hi: "सनशाइन मेरीगोल्ड और मोगरा वरमाला (जोड़ी)",
      en: "Sunshine Marigold & Mogra Varmala (Pair)",
    },
    category: "garlands",
    categoryName: {
      gu: "વરમાળા",
      hi: "वरमाला",
      en: "Wedding Garlands",
    },
    colour: "yellow",
    price: 2800,
    mrp: 3400,
    prepDays: 2,
    image: "/products/VM-Y01.jpg",
    secondaryImage: "/products/hero-wedding.jpg",
    rating: 4.88,
    reviewsCount: 52,
    bestseller: true,
    pairInfo: {
      gu: "૧ જોડ (૨ માળા)",
      hi: "1 जोड़ी (2 माला)",
      en: "1 Pair (2 Garlands)",
    },
    flowersUsed: {
      gu: "પીળા અને કેસરી ગલગોટા • તાજા મોગરા કળીઓ",
      hi: "पीले और केसरी गेंदा • ताजा मोगरा कलियां",
      en: "Golden Yellow Marigolds • Fresh Madurai Mogra Buds",
    },
    description: {
      gu: "ગુજરાતી સંસ્કૃતિની પરંપરાગત વરમાળા. તાજા ગલગોટાના ફૂલો અને મોગરાની મધુર સુગંધ સાથે પવિત્ર ફેરા માટે સર્વોત્તમ.",
      hi: "पारंपरिक गुजराती वरमाला। ताजे गेंदे के फूल और मोगरे की मनमोहक सुगंध के साथ फेरों के लिए सर्वोत्तम।",
      en: "Traditional Gujarati wedding varmala pair woven with vibrant golden marigold blossoms and delicate mogra buds for an auspicious wedding.",
    },
    options: [
      { id: "opt-3ft", label: "3.5 ft (Standard)", priceAdd: 0 },
      { id: "opt-4ft", label: "4.5 ft (Grand)", priceAdd: 400 },
    ],
    addOns: [
      { id: "add-box", label: "Gift Box Packaging", price: 150 },
    ],
  },
  {
    id: "prod-vm-w01",
    code: "VM-W01",
    name: {
      gu: "સફેદ ચમેલી અને પર્લ રોયલ વરમાળા (જોડ)",
      hi: "सफेद चमेली और पर्ल रॉयल वरमाला (जोड़ी)",
      en: "White Jasmine & Pearl Divine Varmala (Pair)",
    },
    category: "garlands",
    categoryName: {
      gu: "વરમાળા",
      hi: "वरमाला",
      en: "Wedding Garlands",
    },
    colour: "white",
    price: 3800,
    mrp: 4600,
    prepDays: 2,
    image: "/products/VM-W01.jpg",
    secondaryImage: "/products/hero-wedding.jpg",
    rating: 4.92,
    reviewsCount: 41,
    pairInfo: {
      gu: "૧ જોડ (૨ માળા)",
      hi: "1 जोड़ी (2 माला)",
      en: "1 Pair (2 Garlands)",
    },
    flowersUsed: {
      gu: "શુદ્ધ મદુરાઈ મોગરા • સફેદ લિલી • મોતી વર્ક",
      hi: "शुद्ध मदुरै मोगरा • सफेद लिली • मोती वर्क",
      en: "Pure White Jasmine • Fragrant Rajnigandha • Lustrous Pearl Beads",
    },
    description: {
      gu: "શાંત, પવિત્ર અને અલ્ટ્રા-લક્ઝરી લુક આપતી મોગરા-મોતી વરમાળા. ડે-વેડિંગ અને પેસ્ટલ લહેંગા સાથે શ્રેષ્ઠ મેચ.",
      hi: "शांत, पवित्र और अल्ट्रा-लक्जरी सफेद वरमाला। डे-वेडिंग और पेस्टल परिधानों के लिए आदर्श।",
      en: "Pristine white jasmine garland infused with fresh rajnigandha buds and delicate pearl beads, delivering an ethereal bridal look.",
    },
    options: [
      { id: "opt-3ft", label: "3.5 ft (Standard)", priceAdd: 0 },
      { id: "opt-4ft", label: "4.5 ft (Royal Pair)", priceAdd: 500 },
    ],
  },
  {
    id: "prod-vm-p01",
    code: "VM-P01",
    name: {
      gu: "પેસ્ટલ પિંક રોઝ બ્લશ અને જિપ્સોફિલા વરમાળા (જોડ)",
      hi: "पेस्टल पिंक रोज ब्लश और जिप्सोफिला वरमाला (जोड़ी)",
      en: "Pastel Pink Rose Blush & Baby's Breath Varmala (Pair)",
    },
    category: "garlands",
    categoryName: {
      gu: "વરમાળા",
      hi: "वरमाला",
      en: "Wedding Garlands",
    },
    colour: "pink",
    price: 4200,
    mrp: 5000,
    prepDays: 2,
    image: "/products/VM-P01.jpg",
    secondaryImage: "/products/hero-wedding.jpg",
    rating: 4.97,
    reviewsCount: 63,
    bestseller: true,
    pairInfo: {
      gu: "૧ જોડ (૨ માળા)",
      hi: "1 जोड़ी (2 माला)",
      en: "1 Pair (2 Garlands)",
    },
    flowersUsed: {
      gu: "ઇમ્પોર્ટેડ બેબી પિંક ગુલાબ • જિપ્સોફિલા (બેબીઝ બ્રેથ)",
      hi: "इम्पोर्टेड पिंक गुलाब • जिप्सोफिला (बेबी ब्रेथ)",
      en: "Imported Soft Pink Roses • White Baby's Breath • Satin Ribbon",
    },
    description: {
      gu: "આધુનિક ઇન્સ્ટાગ્રામ અને પિન્ટરેસ્ટ ટ્રેન્ડિંગ પેસ્ટલ પિંક વરમાળા. રોમેન્ટિક પેસ્ટલ થીમ વેડિંગ માટે સર્વોચ્ચ પસંદગી.",
      hi: "आधुनिक इंस्टाग्राम और पिनट्रेस्ट ट्रेंडिंग पेस्टल पिंक वरमाला। सॉफ्ट रोमांटिक थीम के लिए परफेक्ट।",
      en: "Modern Pinterest-inspired pastel blush rose varmala intertwined with delicate baby's breathgypsophila. Extremely popular for destination & morning weddings.",
    },
    options: [
      { id: "opt-3ft", label: "3.5 ft (Standard)", priceAdd: 0 },
      { id: "opt-4ft", label: "4.5 ft (Grand Royal)", priceAdd: 500 },
    ],
  },
  {
    id: "prod-vm-m01",
    code: "VM-M01",
    name: {
      gu: "રેઈનબો કાર્નેશન અને મેરીગોલ્ડ ઉત્સવ વરમાળા (જોડ)",
      hi: "रेनबो कार्नेशन और मेरीगोल्ड उत्सव वरमाला (जोड़ी)",
      en: "Rainbow Carnation & Marigold Festive Varmala (Pair)",
    },
    category: "garlands",
    categoryName: {
      gu: "વરમાળા",
      hi: "वरमाला",
      en: "Wedding Garlands",
    },
    colour: "multicolour",
    price: 3500,
    mrp: 4200,
    prepDays: 2,
    image: "/products/VM-M01.jpg",
    secondaryImage: "/products/hero-wedding.jpg",
    rating: 4.86,
    reviewsCount: 39,
    pairInfo: {
      gu: "૧ જોડ (૨ માળા)",
      hi: "1 जोड़ी (2 माला)",
      en: "1 Pair (2 Garlands)",
    },
    flowersUsed: {
      gu: "મલ્ટીકલર કાર્નેશન્સ • ઓરેન્જ ગલગોટા • મોગરા",
      hi: "मल्टीकलर कार्नेशन • ऑरेंज गेंदा • मोगरा",
      en: "Multicolour Carnations • Orange Marigold • Fresh Greenery",
    },
    description: {
      gu: "રંગબેરંગી કાર્નેશન અને તાજા ફૂલોનું સુંદર સંયોજન. આનંદ અને ઉત્સવના રંગોથી ભરપૂર ડિઝાઇન.",
      hi: "रंग-बिरंगे कार्नेशन और ताजे फूलों का भव्य संयोजन। उत्सव की रौनक बढ़ाने वाली माला।",
      en: "Vibrant and celebratory rainbow varmala featuring layered carnations in coral, yellow, pink, and orange accented with fresh jasmine.",
    },
    options: [
      { id: "opt-3ft", label: "3.5 ft (Standard)", priceAdd: 0 },
      { id: "opt-4ft", label: "4.5 ft", priceAdd: 400 },
    ],
  },
  {
    id: "prod-vm-r02",
    code: "VM-R02",
    name: {
      gu: "ગ્રાન્ડ ઇમ્પિરિયલ રોઝ અને પર્પલ ઓર્કિડ વરમાળા, ૫ ફૂટ (જોડ)",
      hi: "ग्रैंड इम्पीरियल रोज और पर्पल ऑर्किड वरमाला, 5 फुट (जोड़ी)",
      en: "Grand Imperial Rose & Purple Orchid Varmala 5 ft (Pair)",
    },
    category: "garlands",
    categoryName: {
      gu: "વરમાળા",
      hi: "वरमाला",
      en: "Wedding Garlands",
    },
    colour: "red",
    price: 7800,
    mrp: 9200,
    prepDays: 3,
    image: "/products/VM-R02.jpg",
    secondaryImage: "/products/hero-wedding.jpg",
    rating: 4.99,
    reviewsCount: 47,
    bestseller: true,
    pairInfo: {
      gu: "૧ જોડ (૫ ફૂટ લાંબી લક્ઝરી ૨ માળા)",
      hi: "1 जोड़ी (5 फुट लंबी 2 माला)",
      en: "1 Pair (5 ft Imperial Garlands)",
    },
    flowersUsed: {
      gu: "પ્રીમિયમ ડચ રોઝ • બેંગકોક પર્પલ ઓર્કિડ્સ • ગોલ્ડ કુંદન પેન્ડન્ટ",
      hi: "प्रीमियम डच गुलाब • बैंकॉक पर्पल ऑर्किड • गोल्ड कुंदन पेंडेंट",
      en: "Dutch Red Roses • Bangkok Purple Dendrobium Orchids • Gold Kundan Medallion",
    },
    description: {
      gu: "અમારી સૌથી ભવ્ય શાહી વરમાળા. ૫ ફૂટની પૂર્ણ લંબાઈ, ઘેરા લાલ ગુલાબ અને પર્પલ ઓર્કિડનું દિવ્ય મિશ્રણ.",
      hi: "हमारी सबसे भव्य शाही वरमाला। 5 फुट लंबी, गहरे लाल गुलाब और पर्पल ऑर्किड का दिव्य संगम।",
      en: "Our flagship bridal varmala pair. 5 feet of dense, hand-threaded Dutch crimson roses and exotic Bangkok orchids finished with gold-trimmed borders.",
    },
  },
  {
    id: "prod-vm-l01",
    code: "VM-L01",
    name: {
      gu: "પવિત્ર કમળ કળી અને રોઝ પેટલ રોયલ વરમાળા (જોડ)",
      hi: "पवित्र कमल कली और गुलाब वरमाला (जोड़ी)",
      en: "Sacred Lotus Bud & Rose Petal Royal Varmala (Pair)",
    },
    category: "garlands",
    categoryName: {
      gu: "વરમાળા",
      hi: "वरमाला",
      en: "Wedding Garlands",
    },
    colour: "pink",
    price: 5400,
    mrp: 6500,
    prepDays: 2,
    image: "/products/VM-L01.jpg",
    secondaryImage: "/products/hero-wedding.jpg",
    rating: 4.94,
    reviewsCount: 36,
    bestseller: true,
    pairInfo: {
      gu: "૧ જોડ (૨ માળા)",
      hi: "1 जोड़ी (2 माला)",
      en: "1 Pair (2 Garlands)",
    },
    flowersUsed: {
      gu: "તાજી ગુલાબી કમળ કળીઓ • દેશી ગુલાબ પાંખડી • જરી ટસલ",
      hi: "ताजी गुलाबी कमल कलियां • देसी गुलाब पंखुड़ी • जरी टसल",
      en: "Fresh Pink Lotus Buds • Indian Rose Petal Strands • Golden Zari Tassels",
    },
    description: {
      gu: "ફ્લોરલ હબ શૈલીની પવિત્ર કમળ વરમાળા. લક્ષ્મી-નારાયણ આશીર્વાદ અને વૈદિક હિન્દુ વિવાહ માટે અત્યંત શુભ.",
      hi: "पवित्र कमल वरमाला। वैदिक विवाह और शुभ फेरों के लिए सर्वोत्तम मांगलिक चयन।",
      en: "Sacred handcrafted varmala featuring handpicked lotus buds encased in layered rose petals and golden accents, inspired by ancient royal Vedic traditions.",
    },
  },
  {
    id: "prod-vm-o01",
    code: "VM-O01",
    name: {
      gu: "એક્ઝોટિક પર્પલ ઓર્કિડ અને વ્હાઇટ લિલી વરમાળા (જોડ)",
      hi: "एग्जॉटिक पर्पल ऑर्किड और व्हाइट लिली वरमाला (जोड़ी)",
      en: "Exotic Purple Orchid & White Lily Garland (Pair)",
    },
    category: "garlands",
    categoryName: {
      gu: "વરમાળા",
      hi: "वरमाला",
      en: "Wedding Garlands",
    },
    colour: "purple",
    price: 4900,
    mrp: 5800,
    prepDays: 2,
    image: "/products/VM-O01.jpg",
    secondaryImage: "/products/hero-wedding.jpg",
    rating: 4.91,
    reviewsCount: 29,
    pairInfo: {
      gu: "૧ જોડ (૨ માળા)",
      hi: "1 जोड़ी (2 माला)",
      en: "1 Pair (2 Garlands)",
    },
    flowersUsed: {
      gu: "પર્પલ ડેન્ડ્રોબિયમ ઓર્કિડ • સફેદ ઓરિએન્ટલ લિલી • ગ્રીનરી",
      hi: "पर्पल डेंड्रोबियम ऑर्किड • सफेद ओरिएंटल लिली • ग्रीनरी",
      en: "Purple Dendrobium Orchids • Oriental White Lilies • Emerald Ferns",
    },
    description: {
      gu: "મોડર્ન રિસેપ્શન અને કોકટેલ થીમ માટે અલ્ટ્રા-સ્ટાઇલિશ ઓર્કિડ વરમાળા. લાંબા સમય સુધી તાજી રહે છે.",
      hi: "मॉडर्न रिसेप्शन और कॉकटेल थीम के लिए अल्ट्रा-स्टाइलिश ऑर्किड वरमाला।",
      en: "Vibrant royal purple orchids paired with pristine white lily florets, crafted for grand reception entries and modern luxury couples.",
    },
  },

  // ── Car Decoration ──
  {
    id: "prod-cr-01",
    code: "CR-01",
    name: {
      gu: "કારના બૉનેટ ફૂલ સજાવટ (V-શેપ રોઝ હાર્ટ)",
      hi: "कार फ्रंट बोनट फूल सजावट (V-शेप)",
      en: "Car Front Bonnet Rose & Carnation Heart V-Shape Bouquet",
    },
    category: "car-decoration",
    categoryName: {
      gu: "કાર સજાવટ",
      hi: "कार सजावट",
      en: "Car Bouquets & Decoration",
    },
    colour: "multicolour",
    price: 3200,
    mrp: 3900,
    prepDays: 2,
    image: "/products/CR-01.jpg",
    secondaryImage: "/products/CR-02.jpg",
    rating: 4.87,
    reviewsCount: 45,
    bestseller: true,
    pairInfo: {
      gu: "સંપૂર્ણ ફ્રન્ટ બોનેટ સેટ (રીબન અને નેટ સહિત)",
      hi: "फ्रंट बोनट सेट (रिबन और नेट सहित)",
      en: "Front Bonnet Arrangement + Ribbon Sash",
    },
    flowersUsed: {
      gu: "લાલ ગુલાબ • સફેદ કાર્નેશન્સ • ઓર્ચિડ્સ • સાટીન રિબન",
      hi: "लाल गुलाब • सफेद कार्नेशन • ऑर्किड • साटन रिबन",
      en: "Red Roses • White Carnations • Purple Orchids • Satin Ribbons",
    },
    description: {
      gu: "વરરાજાની કાર માટે ફ્રન્ટ બોનેટનું શાનદાર V-શેપ રોઝ બુકે. કારના કલરને નુકસાન ન થાય તે રીતે સિક્યોર ફિક્સિંગ.",
      hi: "दूल्हे की कार के लिए फ्रंट बोनट V-शेप रोज बुके। बिना किसी खरोंच के सुरक्षित फिटिंग।",
      en: "Signature V-shape bonnet bouquet featuring dense red roses and pastel carnations with satin sash ribbons that attach safely without scratching paint.",
    },
  },
  {
    id: "prod-cr-02",
    code: "CR-02",
    name: {
      gu: "ગ્રાન્ડ રોયલ જાન ફૂલ કાર સજાવટ (સંપૂર્ણ કાર કવરેજ)",
      hi: "ग्रैंड रॉयल बारात फुल कार गुलाब सजावट",
      en: "Grand Royal Baraat Full Car Rose & Net Canopy Decoration",
    },
    category: "car-decoration",
    categoryName: {
      gu: "કાર સજાવટ",
      hi: "कार सजावट",
      en: "Car Bouquets & Decoration",
    },
    colour: "red",
    price: 5500,
    mrp: 6800,
    prepDays: 3,
    image: "/products/CR-02.jpg",
    secondaryImage: "/products/CR-01.jpg",
    rating: 4.96,
    reviewsCount: 38,
    bestseller: true,
    pairInfo: {
      gu: "સંપૂર્ણ ગાડી: બોનેટ, છત, ૪ દરવાજા અને પાછળની ડેકી",
      hi: "पूरी कार: बोनट, रूफ, 4 दरवाजे और डिकी",
      en: "Full Vehicle: Bonnet, Roof Canopy, 4 Doors & Rear Trunk",
    },
    flowersUsed: {
      gu: "૨૦૦+ તાજા લાલ ગુલાબ • નેટ કેનોપી • મોગરા લડીઓ",
      hi: "200+ ताजे लाल गुलाब • नेट कैनोपी • मोगरा लड़ियां",
      en: "200+ Fresh Red Roses • White Tulle Mesh • Jasmine Garland Drops",
    },
    description: {
      gu: "વરરાજાની એન્ટ્રી માટે સંપૂર્ણ લક્ઝરી કાર શણગાર. ભાટ સિમરોલી અને આસપાસના ગામોમાં અમારા કાર ડેકોરેટર દ્વારા ઓન-સાઇટ સજાવટ.",
      hi: "विवाह बारात के लिए संपूर्ण कार सजावट। हमारे कारीगरों द्वारा ऑन-साइट सुरक्षित फिटिंग।",
      en: "Spectacular full wedding car transformation featuring dense rose bouquets on the bonnet, roof net canopy, door handle corsages, and rear boot decoration.",
    },
  },
  {
    id: "prod-cr-03",
    code: "CR-03",
    name: {
      gu: "કાર ડોર હેન્ડલ ગાર્લન્ડ અને રિબન સેટ (૪ નંગ)",
      hi: "कार दरवाजा हैंडल माला सेट (4 पीस)",
      en: "Car Door Handle Garland & Ribbon Set (4 Pcs)",
    },
    category: "car-decoration",
    categoryName: {
      gu: "કાર સજાવટ",
      hi: "कार सजावट",
      en: "Car Bouquets & Decoration",
    },
    colour: "yellow",
    price: 1200,
    mrp: 1500,
    prepDays: 1,
    image: "/products/CR-03.jpg",
    secondaryImage: "/products/CR-01.jpg",
    rating: 4.82,
    reviewsCount: 27,
    pairInfo: {
      gu: "૪ દરવાજા માટે ૪ સેટ",
      hi: "4 दरवाजों के लिए 4 सेट",
      en: "Set of 4 Door Handle Corsages",
    },
    flowersUsed: {
      gu: "યલો અને વ્હાઇટ કાર્નેશન • સાટીન બો રિબન",
      hi: "पीला और सफेद कार्नेशन • साटन बो रिबन",
      en: "Yellow & White Carnation Corsages • Golden Satin Bows",
    },
    description: {
      gu: "૪ કાર દરવાજા માટે મિનિમલ અને ક્લાસી ફ્લોરલ હેન્ડલ સેટ.",
      hi: "कार के चारों दरवाजों के लिए खूबसूरत फ्लोरल हैंडल सेट।",
      en: "Coordinated set of 4 floral corsages for wedding car doors with scratch-proof ribbon ties.",
    },
  },
  {
    id: "prod-cr-04",
    code: "CR-04",
    name: {
      gu: "હેરિટેજ વિન્ટેજ કાર ફ્લોરલ કમાન અને બોનેટ આર્ક",
      hi: "हेरिटेज विंटेज कार फ्लोरल सजावट व कमान",
      en: "Heritage Vintage Wedding Car Floral Canopy & Arch",
    },
    category: "car-decoration",
    categoryName: {
      gu: "કાર સજાવટ",
      hi: "कार सजावट",
      en: "Car Bouquets & Decoration",
    },
    colour: "multicolour",
    price: 6200,
    mrp: 7500,
    prepDays: 3,
    image: "/products/CR-04.jpg",
    secondaryImage: "/products/CR-02.jpg",
    rating: 4.95,
    reviewsCount: 22,
    pairInfo: {
      gu: "વિન્ટેજ કાર આર્ક + બોનેટ ફ્લોરલ ક્રાઉન",
      hi: "विंटेज कार आर्क + बोनट फ्लोरल क्राउन",
      en: "Full Vintage Arch + Bonnet Floral Crown",
    },
    flowersUsed: {
      gu: "એક્ઝોટિક લિલીઝ • ડચ ગુલાબ • ઇયુકેલિપ્ટસ પાંદડા",
      hi: "एग्जॉटिक लिली • डच गुलाब • नीलगिरी पत्ते",
      en: "White Casablanca Lilies • Red Roses • Silver Dollar Eucalyptus",
    },
    description: {
      gu: "વિન્ટેજ અથવા ઓપન-રૂફ જાન ગાડી માટે શાહી રોયલ લુક આપતી કમાન સજાવટ.",
      hi: "विंटेज और ओपन-रूफ कार के लिए शाही फूलों की भव्य कमान।",
      en: "Regal floral arch and garland drapery custom-designed for vintage and luxury open-top wedding cars.",
    },
  },

  // ── Hair Flowers & Veni ──
  {
    id: "prod-hf-01",
    code: "HF-01",
    name: {
      gu: "બ્રાઈડલ તાજા ગુલાબ અને મોગરા વેણી",
      hi: "ब्राइडल ताजा गुलाब और मोगरा वेणी",
      en: "Bridal Fresh Rose & Jasmine Braided Veni",
    },
    category: "hair-flowers",
    categoryName: {
      gu: "વેણી",
      hi: "बालों के फूल",
      en: "Braided Hair Flowers",
    },
    colour: "red",
    price: 900,
    mrp: 1200,
    prepDays: 1,
    image: "/products/HF-01.jpg",
    secondaryImage: "/products/HF-02.jpg",
    rating: 4.94,
    reviewsCount: 84,
    bestseller: true,
    pairInfo: {
      gu: "૧ નંગ બ્રાઈડલ હેર વેણી (લાંબી ચોટી માટે)",
      hi: "1 पीस ब्राइडल हेयर वेणी",
      en: "1 Piece Full Braid Veni Strand",
    },
    flowersUsed: {
      gu: "નાના લાલ ગુલાબ કળીઓ • મદુરાઈ મોગરા • મોતી લેસ",
      hi: "लाल गुलाब कलियां • मदुरै मोगरा • मोती लेस",
      en: "Mini Crimson Rosebuds • Fragrant Mogra • Pearl Border Trimming",
    },
    description: {
      gu: "દક્ષિણ સૌરાષ્ટ્રની પરંપરાગત બ્રાઈડલ વેણી. વાળની અંબોડા અને લાંબી ચોટી પર અદ્ભુત શોભા આપે છે.",
      hi: "परंपरागत ब्राइडल हेयर वेणी। जूड़े और लंबी चोटी पर अद्भुत निखार लाती है।",
      en: "Traditional Saurashtra bridal hair veni hand-woven with miniature rosebuds and fragrant jasmine florets for bridal buns and long braids.",
    },
  },
  {
    id: "prod-hf-02",
    code: "HF-02",
    name: {
      gu: "સુગંધિત ચમેલી હેર બન રીત (જુડા છલ્લા)",
      hi: "सुगंधित चमेली हेयर बन रिंग (जूड़ा छल्ला)",
      en: "Fragrant Jasmine Hair Bun Wreath (Juda Challa)",
    },
    category: "hair-flowers",
    categoryName: {
      gu: "વેણી",
      hi: "बालों के फूल",
      en: "Braided Hair Flowers",
    },
    colour: "white",
    price: 700,
    mrp: 950,
    prepDays: 1,
    image: "/products/HF-02.jpg",
    secondaryImage: "/products/HF-01.jpg",
    rating: 4.89,
    reviewsCount: 57,
    pairInfo: {
      gu: "૧ નંગ અંબોડા રીંગ",
      hi: "1 पीस जूड़ा रिंग",
      en: "1 Bun Wreath Ring",
    },
    flowersUsed: {
      gu: "ડબલ લેયર મદુરાઈ મોગરા • ગોલ્ડન બીડ્સ",
      hi: "डबल लेयर मदुरै मोगरा • गोल्डन बीड्स",
      en: "Double-Layer Dense Mogra Buds • Golden Accent Beads",
    },
    description: {
      gu: "અંબોડાની આસપાસ સરળતાથી પહેરી શકાય તેવી મોગરાની સુગંધિત રીંગ.",
      hi: "जूड़े के चारों ओर आसानी से फिट होने वाला मोगरे का सुगंधित गजरा रिंग।",
      en: "Circular floral wreath designed to fit securely around bridal hair buns with all-day jasmine fragrance.",
    },
  },
  {
    id: "prod-hf-03",
    code: "HF-03",
    name: {
      gu: "ચોટી શણગાર લાંબી ફ્લોરલ વેણી અને હેર પિન્સ સેટ",
      hi: "चोटी श्रृंगार लंबी फ्लोरल वेणी और हेयर पिन सेट",
      en: "Cascading Long Braid Choti Floral Ornament & Hairpins Set",
    },
    category: "hair-flowers",
    categoryName: {
      gu: "વેણી",
      hi: "बालों के फूल",
      en: "Braided Hair Flowers",
    },
    colour: "multicolour",
    price: 1100,
    mrp: 1400,
    prepDays: 1,
    image: "/products/HF-03.jpg",
    secondaryImage: "/products/HF-01.jpg",
    rating: 4.96,
    reviewsCount: 39,
    pairInfo: {
      gu: "૧ લાંબી ચોટી વેણી + ૬ મેચિંગ ફ્લાવર પિન્સ",
      hi: "1 लंबी चोटी वेणी + 6 मैचिंग हेयर पिंस",
      en: "1 Long Braid Strip + 6 Floral Hairpins",
    },
    flowersUsed: {
      gu: "બેબી પિંક રોઝ • જિપ્સોફિલા • મોગરા કળીઓ",
      hi: "बेबी पिंक गुलाब • जिप्सोफिला • मोगरा",
      en: "Baby Pink Rose Florets • Gypsophila • Jasmine Buds",
    },
    description: {
      gu: "આધુનિક દુલ્હનો માટે ચોટી પર સજાવવા માટે લાંબી ફ્લોરલ લડી અને ૬ પિન્સનો સેટ.",
      hi: "दुल्हन की लंबी चोटी को सजाने के लिए फ्लोरल लड़ी और 6 पिंस का सेट।",
      en: "Graceful cascading braid ornament accompanied by 6 matching rosebud hairpins for reception hairstyles.",
    },
  },

  // ── Gajra ──
  {
    id: "prod-gj-01",
    code: "GJ-01",
    name: {
      gu: "ઓથેન્ટિક મદુરાઈ તાજા મોગરા ગજરા (જોડ)",
      hi: "प्रामाणिक मदुरै ताजा मोगरा गजरा (जोड़ी)",
      en: "Authentic Madurai Fresh Mogra Gajra (Pair)",
    },
    category: "gajra",
    categoryName: {
      gu: "ગજરા",
      hi: "गजरा",
      en: "Gajra",
    },
    colour: "white",
    price: 250,
    mrp: 350,
    prepDays: 1,
    image: "/products/GJ-01.jpg",
    secondaryImage: "/products/GJ-02.jpg",
    rating: 4.98,
    reviewsCount: 142,
    bestseller: true,
    pairInfo: {
      gu: "૧ જોડ (૨ ગજરા લડી)",
      hi: "1 जोड़ी (2 गजरा लड़ियां)",
      en: "1 Pair (2 Hand-Strung Strands)",
    },
    flowersUsed: {
      gu: "૧૦૦% શુદ્ધ મદુરાઈ મોગરા",
      hi: "100% शुद्ध मदुरै मोगरा",
      en: "100% Fresh Morning Plucked Madurai Mogra",
    },
    description: {
      gu: "સવારે ૫:૦૦ વાગ્યે ચૂંટેલા શુદ્ધ મોગરાના ગજરા. તીવ્ર મોહક સુગંધ અને લાંબો સમય તાજા રહેવાની ગેરંટી.",
      hi: "सुबह 5 बजे चुने गए शुद्ध मोगरे के गजरे। बेमिसाल प्राकृतिक खुशबू।",
      en: "The quintessential Indian bridal classic. Two thick, tightly strung strands of aromatic morning-harvested Madurai jasmine.",
    },
  },
  {
    id: "prod-gj-02",
    code: "GJ-02",
    name: {
      gu: "ડ્યુઅલ-ટોન લાલ ગુલાબ અને સફેદ મોગરા ગજરા (જોડ)",
      hi: "डुअल-टोन लाल गुलाब व सफेद मोगरा गजरा (जोड़ी)",
      en: "Dual-Tone Red Rose & White Mogra Gajra (Pair)",
    },
    category: "gajra",
    categoryName: {
      gu: "ગજરા",
      hi: "गजरा",
      en: "Gajra",
    },
    colour: "pink",
    price: 350,
    mrp: 450,
    prepDays: 1,
    image: "/products/GJ-02.jpg",
    secondaryImage: "/products/GJ-01.jpg",
    rating: 4.91,
    reviewsCount: 88,
    pairInfo: {
      gu: "૧ જોડ (૨ ગજરા લડી)",
      hi: "1 जोड़ी (2 गजरा लड़ियां)",
      en: "1 Pair (2 Strands)",
    },
    flowersUsed: {
      gu: "લાલ ગુલાબ પાંખડી • સફેદ મોગરા",
      hi: "लाल गुलाब पंखुड़ी • सफेद मोगरा",
      en: "Red Rose Petals • Madurai Mogra Buds",
    },
    description: {
      gu: "ગુલાબ અને મોગરાનું રંગીન મિશ્રણ. સાડી અને ચણિયાચોળી સાથે અતિ આકર્ષક લાગે છે.",
      hi: "गुलाब और मोगरे का रंगीन मेल। साड़ी व लहंगे पर बेहद खूबसूरत लगता है।",
      en: "Artistic alternating spiral of crimson rose petals and white jasmine florets.",
    },
  },

  // ── Floral Jewellery ──
  {
    id: "prod-fj-01",
    code: "FJ-01",
    name: {
      gu: "બ્રાઈડલ ફ્લોરલ જ્વેલરી સંપૂર્ણ સેટ (૭ નંગ)",
      hi: "ब्राइडल फ्लोरल ज्वेलरी संपूर्ण सेट (7 पीस)",
      en: "Bridal Floral Jewellery Complete 7-Piece Set",
    },
    category: "floral-jewellery",
    categoryName: {
      gu: "ફૂલોના ઘરેણાં",
      hi: "फूलों के गहने",
      en: "Floral Jewellery",
    },
    colour: "multicolour",
    price: 3900,
    mrp: 4800,
    prepDays: 2,
    image: "/products/FJ-01.jpg",
    secondaryImage: "/products/FJ-02.jpg",
    rating: 4.97,
    reviewsCount: 73,
    bestseller: true,
    pairInfo: {
      gu: "૭ નંગ સેટ: નેકલેસ, માંગ ટીક્કો, ૨ ઝૂમખા, ૨ હાથફૂલ, કમરબંધ",
      hi: "7 पीस सेट: चोकर, मांग टीका, 2 झुमके, 2 हाथफूल, कमरबंद",
      en: "7-Piece Bridal Set: Choker, Maang Tikka, 2 Earrings, 2 Haath-Phool & Kamarbandh",
    },
    flowersUsed: {
      gu: "પેસ્ટલ ગુલાબ • મોગરા • ગોટા પત્તી • મોતી",
      hi: "पेस्टल गुलाब • मोगरा • गोटा पत्ती • मोती",
      en: "Fresh Pastel Miniature Roses • Jasmine • Gota Patti • Pearl Drops",
    },
    description: {
      gu: "હળદર અને મહેંદી રસમ માટે દુલહનનું સંપૂર્ણ ફ્લોરલ ઘરેણું. વજનમાં હલકું અને ત્વચા માટે અત્યંત આરામદાયક.",
      hi: "हल्दी व मेहंदी रस्म के लिए दुल्हन का संपूर्ण फूलों का सेट। हल्का और आरामदायक।",
      en: "Handcrafted heirloom flower jewellery set for the bride. Includes collar choker, floral maang-tikka, floral jhumkas, haath-phool wrist corsages with attached rings, and waist belt.",
    },
  },
  {
    id: "prod-fj-02",
    code: "FJ-02",
    name: {
      gu: "મહેંદી અને હળદર સનશાઈન યલો ફ્લોરલ જ્વેલરી સેટ (૫ નંગ)",
      hi: "मेहंदी और हल्दी सनशाइन येलो फ्लोरल ज्वेलरी सेट (5 पीस)",
      en: "Mehndi & Haldi Sunshine Yellow Floral Jewellery Set (5 Pcs)",
    },
    category: "floral-jewellery",
    categoryName: {
      gu: "ફૂલોના ઘરેણાં",
      hi: "फूलों के गहने",
      en: "Floral Jewellery",
    },
    colour: "yellow",
    price: 2600,
    mrp: 3200,
    prepDays: 2,
    image: "/products/FJ-02.jpg",
    secondaryImage: "/products/FJ-01.jpg",
    rating: 4.92,
    reviewsCount: 54,
    pairInfo: {
      gu: "૫ નંગ સેટ: નેકલેસ, માંગ ટીક્કો, ૨ ઝૂમખા, ૧ હાથફૂલ જોડ",
      hi: "5 पीस सेट: नेकलेस, मांग टीका, 2 झुमके, हाथफूल",
      en: "5-Piece Haldi Set: Floral Necklace, Maang Tikka, Earrings & Haath-Phool Pair",
    },
    flowersUsed: {
      gu: "પીળા ગલગોટા • ચંપા • મોગરા કળીઓ",
      hi: "पीला गेंदा • चंपा • मोगरा कलियां",
      en: "Sunshine Yellow Marigolds • White Champa Buds • Gota Zari",
    },
    description: {
      gu: "હળદર સમારોહ માટે ખાસ પીળા અને સોનેરી ફૂલોનો જ્વેલરી સેટ.",
      hi: "हल्दी समारोह के लिए विशेष पीले और सुनहरे फूलों का सेट।",
      en: "Vibrant yellow bridal jewellery ensemble tailored for haldi and sangeet celebrations.",
    },
  },
];

export const SAURASHTRA_VILLAGES = [
  { slug: "bhat-simroli", name: { gu: "ભાટ સિમરોલી (મુખ્ય મથક)", hi: "भाट सिमरौली (मुख्य केंद्र)", en: "Bhat Simroli (Main Boutique)" }, fee: 0, time: "30-45 mins" },
  { slug: "agatrai", name: { gu: "અગત્રાઈ", hi: "अगत्राई", en: "Agatrai" }, fee: 100, time: "45-60 mins" },
  { slug: "sondarda", name: { gu: "સોંડારડા", hi: "सोंदारड़ा", en: "Sondarda" }, fee: 150, time: "45-60 mins" },
  { slug: "shil", name: { gu: "શિળ", hi: "शिल", en: "Shil" }, fee: 200, time: "60-90 mins" },
  { slug: "mangrol", name: { gu: "માંગરોળ", hi: "मांगरोल", en: "Mangrol" }, fee: 250, time: "60-90 mins" },
  { slug: "malia", name: { gu: "માળિયા હાટીના", hi: "माळिया हाटीना", en: "Malia Hatina" }, fee: 300, time: "60-90 mins" },
];
