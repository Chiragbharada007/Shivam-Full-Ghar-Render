"""Idempotent database seeder for Shivam Full Ghar (Python FastAPI)."""
import base64
from app.database import Base, SessionLocal, engine
from app.models import (
    AdminUser,
    Category,
    CategoryTranslation,
    ContentBlock,
    ContentBlockTranslation,
    Coupon,
    DeliveryArea,
    DeliveryAreaTranslation,
    MediaAsset,
    Package,
    PackageTranslation,
    Product,
    ProductImage,
    ProductOption,
    ProductTranslation,
    Review,
    SiteSetting,
    TimeSlot,
)
from app.security import hash_password, hash_security_answer


def run_seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Admin Owners (Test + Client)
        admins = [
            {
                "email": "chiragcaret09@gmail.com",
                "name": "Chirag (Admin)",
                "phone": "9904578134",
            },
            {
                "email": "chiragbharda8775@gmail.com",
                "name": "Chirag Bharada",
                "phone": "9904578134",
            },
            {
                "email": "owner@shivamfullghar.com",
                "name": "Shivam Owner",
                "phone": "9824132014",
            },
        ]
        for a in admins:
            existing = db.query(AdminUser).filter(AdminUser.email == a["email"]).first()
            if not existing:
                db.add(
                    AdminUser(
                        email=a["email"],
                        name=a["name"],
                        phone=a["phone"],
                        role="OWNER",
                        passwordHash=hash_password("Admin@123"),
                        securityQuestion1="What is your primary flower shop location?",
                        securityAnswer1Hash=hash_security_answer("Keshod"),
                        securityQuestion2="What is your business registered brand name?",
                        securityAnswer2Hash=hash_security_answer("Shivam Full Ghar"),
                        isActive=True,
                    )
                )

        # 2. Categories
        cat_data = [
            ("garlands", 1, "Wedding Garlands", "લગ્ન વરમાળા", "विवाह वरमाला"),
            ("car-decoration", 2, "Car Decoration", "કાર ડેકોરેશન", "कार डेकोरेशन"),
            ("hair-flowers", 3, "Bridal Hair Veni", "બ્રાઈડલ વેણી", "ब्राइडल वेणी"),
            ("gajra", 4, "Mogra Gajra", "મદુરાઈ ગજરા", "मदुरै गजरा"),
            ("floral-jewellery", 5, "Floral Jewellery", "ફૂલોના ઘરેણાં", "फूलों के गहने"),
            ("mandap-stage", 6, "Mandap & Stage", "મંડપ અને સ્ટેજ", "मंडप और स्टेज"),
        ]
        cats = {}
        for slug, order, en, gu, hi in cat_data:
            c = db.query(Category).filter(Category.slug == slug).first()
            if not c:
                c = Category(slug=slug, sortOrder=order, isActive=True)
                c.translations = [
                    CategoryTranslation(locale="en", name=en, description=f"{en} handcrafted in Keshod."),
                    CategoryTranslation(locale="gu", name=gu, description=f"કેશોદમાં તાજા ફૂલોથી તૈયાર {gu}."),
                    CategoryTranslation(locale="hi", name=hi, description=f"केशोद में ताजे फूलों से तैयार {hi}."),
                ]
                db.add(c)
                db.flush()
            cats[slug] = c

        # 3. Curated Products with Real Images (Idempotent + 5 New Products)
        prod_specs = [
            ("SFG-VM-001", "garlands", 250000, 210000, "/products/VM-R01.jpg", "Royal Rose & Lotus Varmala", "રોયલ ગુલાબ અને કમળની વરમાળા", "रॉयल गुलाब और कमल वरमाला"),
            ("SFG-VM-002", "garlands", 180000, None, "/products/VM-R02.jpg", "Fresh Mogra & Red Rose Garland", "તાજા મોગરા અને લાલ ગુલાબની માળા", "ताजा मोगरा और लाल गुलाब माला"),
            ("SFG-VM-003", "garlands", 240000, 195000, "/products/VM-P01.jpg", "Pastel Pink Rose & Gypsophila Varmala", "પેસ્ટલ ગુલાબી રોઝ વરમાળા", "पेस्टल गुलाबी रोज वरमाला"),
            ("SFG-VM-004", "garlands", 280000, 240000, "/products/VM-L01.jpg", "Sacred Lotus & Mogra Royal Varmala", "પવિત્ર કમળ અને મોગરા વરમાળા", "पवित्र कमल और मोगरा वरमाला"),
            ("SFG-CD-001", "car-decoration", 350000, 310000, "/products/CR-01.jpg", "Bridal Car Orchid & Rose Decor", "દુલ્હન કાર ઓર્કિડ અને ગુલાબ ડેકોર", "दुल्हन कार ऑर्किड और गुलाब डेकोर"),
            ("SFG-GJ-001", "gajra", 65000, 55000, "/products/GJ-01.jpg", "Pure Madurai Mogra Bridal Gajra Pair", "મદુરાઈ મોગરા ગજરા જોડી", "मदुरै मोगरा गजरा जोड़ी"),
            ("SFG-HF-001", "hair-flowers", 95000, 80000, "/products/HF-01.jpg", "Bridal Rose & Jasmine Braided Hair Veni", "બ્રાઈડલ ગુલાબ અને મોગરા વેણી", "ब्राइडल गुलाब और मोगरा वेणी"),
            ("SFG-FJ-001", "floral-jewellery", 165000, 145000, "/products/FJ-01.jpg", "Haldi & Mehndi 7-Piece Floral Jewellery Set", "હલ્દી અને મહેંદી ફૂલોના ઘરેણાં સેટ", "हल्दी और मेहंदी फूलों के गहने सेट"),
            ("SFG-MS-001", "mandap-stage", 1500000, None, "/products/hero-wedding.jpg", "Traditional Marigold Mandap Setup", "પરંપરાગત ગલગોટા મંડપ ડેકોરેશન", "पारंपरिक गेंदा मंडप सजावट"),
        ]
        for code, cat_slug, base, sale, img_path, en, gu, hi in prod_specs:
            existing_p = db.query(Product).filter(Product.code == code).first()
            if not existing_p:
                p = Product(
                    code=code,
                    categoryId=cats[cat_slug].id,
                    basePrice=base,
                    salePrice=sale,
                    unit="pair" if "VM" in code or "GJ" in code else "set",
                    status="PUBLISHED",
                )
                p.translations = [
                    ProductTranslation(locale="en", name=en, description=f"Handcrafted {en} with farm-fresh blooms.", slug=code.lower()),
                    ProductTranslation(locale="gu", name=gu, description=f"તાજા ફૂલોથી ખાસ લગ્ન માટે તૈયાર {gu}.", slug=code.lower()),
                    ProductTranslation(locale="hi", name=hi, description=f"शादी के लिए ताजे फूलों से तैयार {hi}.", slug=code.lower()),
                ]
                p.images = [ProductImage(url=img_path, isPrimary=True, sortOrder=0)]
                p.options = [
                    ProductOption(label="Standard (3.5 ft)", priceAdd=0, isDefault=True, sortOrder=0),
                    ProductOption(label="Grand (4.5 ft)", priceAdd=50000, isDefault=False, sortOrder=1),
                ]
                db.add(p)

        # 3b. Replace broken placeholder paths & migrate any inline base64 images to MediaAsset
        img_fix_map = {
            "SFG-VM-001": "/products/VM-R01.jpg",
            "SFG-VM-002": "/products/VM-R02.jpg",
            "SFG-CD-001": "/products/CR-01.jpg",
            "SFG-MS-001": "/products/hero-wedding.jpg",
        }
        for prod_img in db.query(ProductImage).all():
            if prod_img.url == "/images/placeholder-garland.svg":
                parent = db.query(Product).filter(Product.id == prod_img.productId).first()
                prod_img.url = img_fix_map.get(parent.code if parent else "", "/products/VM-R01.jpg")
            elif prod_img.url and prod_img.url.startswith("data:image/"):
                try:
                    header, b64_data = prod_img.url.split(",", 1)
                    mime = header.split(";")[0].replace("data:", "") or "image/jpeg"
                    raw = base64.b64decode(b64_data)
                    asset = MediaAsset(filename="migrated-image", contentType=mime, data=raw, sizeBytes=len(raw))
                    db.add(asset)
                    db.flush()
                    prod_img.url = f"/api/media/{asset.id}"
                except Exception:
                    pass

        # 4. Packages
        if db.query(Package).count() == 0:
            pkg = Package(slug="royal-wedding-combo", price=750000, sortOrder=1, isActive=True)
            pkg.translations = [
                PackageTranslation(locale="en", name="Royal Wedding Floral Combo", description="Varmala Pair + Bridal Car Decor + Home Toran"),
                PackageTranslation(locale="gu", name="રોયલ વેડિંગ ફ્લોરલ કોમ્બો", description="વરમાળા જોડી + કાર ડેકોરેશન + ઘર તોરણ"),
                PackageTranslation(locale="hi", name="रॉयल वेडिंग फ्लोरल कॉम्बो", description="वरमाला जोड़ी + कार सजावट + घर तोरण"),
            ]
            db.add(pkg)

        # 5. Banners & Policy Pages
        if db.query(ContentBlock).count() == 0:
            hero = ContentBlock(type="HERO", key="hero_main", sortOrder=1, isActive=True, linkUrl="/shop")
            hero.translations = [
                ContentBlockTranslation(locale="en", title="Handcrafted Royal Varmalas & Wedding Florals", subtitle="Freshly woven in Bhat Simroli, Keshod"),
                ContentBlockTranslation(locale="gu", title="રોયલ વરમાળા અને લગ્ન ફૂલ ડેકોરેશન", subtitle="કેશોદ (ભાટ સિમરોલી) ખાતે તાજા ફૂલોથી તૈયાર"),
                ContentBlockTranslation(locale="hi", title="रॉयल वरमाला और वेडिंग फ्लोरल डेकोर", subtitle="केशोद में ताजे फूलों से हस्तनिर्मित"),
            ]
            db.add(hero)

        # 6. Delivery Areas & Time Slots
        if db.query(DeliveryArea).count() == 0:
            area = DeliveryArea(slug="keshod-store-pickup", pincode="362220", deliveryCharge=0, isActive=True, sortOrder=1)
            area.translations = [
                DeliveryAreaTranslation(locale="en", name="Bhat Simroli, Keshod (Free Store Pickup)"),
                DeliveryAreaTranslation(locale="gu", name="ભાટ સિમરોલી, કેશોદ (મફત સ્ટોર પિકઅપ)"),
                DeliveryAreaTranslation(locale="hi", name="भाट सिमरोली, केशोद (निःशुल्क स्टोर पिकअप)"),
            ]
            db.add(area)

        if db.query(TimeSlot).count() == 0:
            db.add(TimeSlot(label="Morning 7:00 AM - 11:00 AM", startHour=7, endHour=11, sortOrder=1))
            db.add(TimeSlot(label="Afternoon 12:00 PM - 4:00 PM", startHour=12, endHour=16, sortOrder=2))
            db.add(TimeSlot(label="Evening 5:00 PM - 9:00 PM", startHour=17, endHour=21, sortOrder=3))

        # 7. Coupon & Reviews & Settings
        if not db.query(Coupon).filter(Coupon.code == "SHIVAM10").first():
            db.add(Coupon(code="SHIVAM10", discountType="PERCENT", discountValue=10, minOrderAmount=100000, isActive=True))

        if db.query(Review).count() == 0:
            db.add(Review(customerName="Rajeshbhai Patel, Keshod", rating=5, comment="Beautiful fresh rose varmala delivered right on time!", isApproved=True))

        default_settings = {
            "shopName": "Shivam Full Ghar",
            "whatsappNumber": "9824132014",
            "address": "Bhat Simroli, Keshod, Junagadh, Gujarat 362220",
            "announcementText": "Fresh Wedding Varmalas & Car Decor • Store Pickup in Keshod",
        }
        for k, v in default_settings.items():
            if not db.query(SiteSetting).filter(SiteSetting.key == k).first():
                db.add(SiteSetting(key=k, value=v))

        db.commit()
        print("Database seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
