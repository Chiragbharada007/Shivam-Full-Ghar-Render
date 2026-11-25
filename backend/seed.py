"""Idempotent database seeder for Shivam Full Ghar (Python FastAPI)."""
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
            ("varmala-garlands", 1, "Royal Varmala", "રોયલ વરમાળા", "रॉयल वरमाला"),
            ("car-decoration", 2, "Car Decoration", "કાર ડેકોરેશન", "कार डेकोरेशन"),
            ("mandap-stage", 3, "Mandap & Stage", "મંડપ અને સ્ટેજ", "मंडप और स्टेज"),
            ("puja-toran", 4, "Puja & Toran", "પૂજા અને તોરણ", "पूजा और तोरण"),
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

        # 3. Sample Products
        if db.query(Product).count() == 0:
            prod_specs = [
                ("SFG-VM-001", "varmala-garlands", 250000, 210000, "Royal Rose & Lotus Varmala", "રોયલ ગુલાબ અને કમળની વરમાળા", "रॉयल गुलाब और कमल वरमाला"),
                ("SFG-VM-002", "varmala-garlands", 180000, None, "Fresh Mogra & Red Rose Garland", "તાજા મોગરા અને લાલ ગુલાબની માળા", "ताजा मोगरा और लाल गुलाब माला"),
                ("SFG-CD-001", "car-decoration", 350000, 310000, "Bridal Car Orchid & Rose Decor", "દુલ્હન કાર ઓર્કિડ અને ગુલાબ ડેકોર", "दुल्हन कार ऑर्किड और गुलाब डेकोर"),
                ("SFG-MS-001", "mandap-stage", 1500000, None, "Traditional Marigold Mandap Setup", "પરંપરાગત ગલગોટા મંડપ ડેકોરેશન", "पारंपरिक गेंदा मंडप सजावट"),
            ]
            for code, cat_slug, base, sale, en, gu, hi in prod_specs:
                p = Product(
                    code=code,
                    categoryId=cats[cat_slug].id,
                    basePrice=base,
                    salePrice=sale,
                    unit="pair" if "VM" in code else "set",
                    status="PUBLISHED",
                )
                p.translations = [
                    ProductTranslation(locale="en", name=en, description=f"Handcrafted {en} with farm-fresh blooms.", slug=code.lower()),
                    ProductTranslation(locale="gu", name=gu, description=f"તાજા ફૂલોથી ખાસ લગ્ન માટે તૈયાર {gu}.", slug=code.lower()),
                    ProductTranslation(locale="hi", name=hi, description=f"शादी के लिए ताजे फूलों से तैयार {hi}.", slug=code.lower()),
                ]
                p.images = [ProductImage(url="/images/placeholder-garland.svg", isPrimary=True, sortOrder=0)]
                p.options = [
                    ProductOption(label="Standard (3.5 ft)", priceAdd=0, isDefault=True, sortOrder=0),
                    ProductOption(label="Grand (4.5 ft)", priceAdd=50000, isDefault=False, sortOrder=1),
                ]
                db.add(p)

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
