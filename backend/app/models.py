import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from app.database import Base


def gen_id() -> str:
    return uuid.uuid4().hex[:24]


def utcnow():
    return datetime.now(timezone.utc)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(String, primary_key=True, default=gen_id)
    email = Column(String, unique=True, nullable=False, index=True)
    passwordHash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="OWNER", nullable=False)
    phone = Column(String, default="9824132014")
    otpHash = Column(String, nullable=True)
    otpExpiresAt = Column(DateTime(timezone=True), nullable=True)
    otpAttempts = Column(Integer, default=0)
    otpLastSentAt = Column(DateTime(timezone=True), nullable=True)
    isActive = Column(Boolean, default=True)
    failedAttempts = Column(Integer, default=0)
    lockedUntil = Column(DateTime(timezone=True), nullable=True)
    lastLoginAt = Column(DateTime(timezone=True), nullable=True)
    securityQuestion1 = Column(String, default="What is your primary flower shop location?")
    securityAnswer1Hash = Column(String, nullable=True)
    securityQuestion2 = Column(String, default="What is your business registered brand name?")
    securityAnswer2Hash = Column(String, nullable=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)
    updatedAt = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    auditLogs = relationship("AuditLog", back_populates="adminUser")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=gen_id)
    adminUserId = Column(String, ForeignKey("admin_users.id"), nullable=False)
    action = Column(String, nullable=False)
    entity = Column(String, nullable=False)
    entityId = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)

    adminUser = relationship("AdminUser", back_populates="auditLogs")


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=gen_id)
    slug = Column(String, unique=True, nullable=False)
    sortOrder = Column(Integer, default=0)
    coverImage = Column(String, nullable=True)
    isActive = Column(Boolean, default=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)
    updatedAt = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    translations = relationship("CategoryTranslation", back_populates="category", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="category")


class CategoryTranslation(Base):
    __tablename__ = "category_translations"

    id = Column(String, primary_key=True, default=gen_id)
    categoryId = Column(String, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    locale = Column(String, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    category = relationship("Category", back_populates="translations")

    __table_args__ = (UniqueConstraint("categoryId", "locale", name="uq_cat_locale"),)


class Colour(Base):
    __tablename__ = "colours"

    id = Column(String, primary_key=True, default=gen_id)
    slug = Column(String, unique=True, nullable=False)
    hexCode = Column(String, nullable=True)
    sortOrder = Column(Integer, default=0)
    isActive = Column(Boolean, default=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)

    translations = relationship("ColourTranslation", back_populates="colour", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="colour")


class ColourTranslation(Base):
    __tablename__ = "colour_translations"

    id = Column(String, primary_key=True, default=gen_id)
    colourId = Column(String, ForeignKey("colours.id", ondelete="CASCADE"), nullable=False)
    locale = Column(String, nullable=False)
    name = Column(String, nullable=False)

    colour = relationship("Colour", back_populates="translations")

    __table_args__ = (UniqueConstraint("colourId", "locale", name="uq_colour_locale"),)


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=gen_id)
    code = Column(String, unique=True, nullable=False)
    categoryId = Column(String, ForeignKey("categories.id"), nullable=False)
    colourId = Column(String, ForeignKey("colours.id"), nullable=True)
    basePrice = Column(Integer, nullable=False)
    salePrice = Column(Integer, nullable=True)
    unit = Column(String, default="pair")
    prepTimeDays = Column(Integer, default=2)
    status = Column(String, default="PUBLISHED")
    videoUrl = Column(String, nullable=True)
    isMadeToOrder = Column(Boolean, default=False)
    allowSubstitution = Column(Boolean, default=True)
    sortOrder = Column(Integer, default=0)
    createdAt = Column(DateTime(timezone=True), default=utcnow)
    updatedAt = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    category = relationship("Category", back_populates="products")
    colour = relationship("Colour", back_populates="products")
    translations = relationship("ProductTranslation", back_populates="product", cascade="all, delete-orphan")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    options = relationship("ProductOption", back_populates="product", cascade="all, delete-orphan")
    addOns = relationship("ProductAddOn", back_populates="product", cascade="all, delete-orphan")
    faqs = relationship("ProductFaq", back_populates="product", cascade="all, delete-orphan")


class ProductTranslation(Base):
    __tablename__ = "product_translations"

    id = Column(String, primary_key=True, default=gen_id)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    locale = Column(String, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    metaTitle = Column(String, nullable=True)
    metaDescription = Column(String, nullable=True)
    slug = Column(String, nullable=True)

    product = relationship("Product", back_populates="translations")

    __table_args__ = (UniqueConstraint("productId", "locale", name="uq_prod_locale"),)


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(String, primary_key=True, default=gen_id)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    url = Column(Text, nullable=False)
    altText = Column(String, nullable=True)
    sortOrder = Column(Integer, default=0)
    isPrimary = Column(Boolean, default=False)

    product = relationship("Product", back_populates="images")


class ProductOption(Base):
    __tablename__ = "product_options"

    id = Column(String, primary_key=True, default=gen_id)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    label = Column(String, nullable=False)
    priceAdd = Column(Integer, default=0)
    sortOrder = Column(Integer, default=0)
    isDefault = Column(Boolean, default=False)

    product = relationship("Product", back_populates="options")


class ProductAddOn(Base):
    __tablename__ = "product_add_ons"

    id = Column(String, primary_key=True, default=gen_id)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    label = Column(String, nullable=False)
    price = Column(Integer, default=0)
    isDefault = Column(Boolean, default=False)
    sortOrder = Column(Integer, default=0)

    product = relationship("Product", back_populates="addOns")


class ProductFaq(Base):
    __tablename__ = "product_faqs"

    id = Column(String, primary_key=True, default=gen_id)
    productId = Column(String, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    locale = Column(String, nullable=False)
    question = Column(String, nullable=False)
    answer = Column(Text, nullable=False)
    sortOrder = Column(Integer, default=0)

    product = relationship("Product", back_populates="faqs")


class Package(Base):
    __tablename__ = "packages"

    id = Column(String, primary_key=True, default=gen_id)
    slug = Column(String, unique=True, nullable=False)
    price = Column(Integer, nullable=False)
    sortOrder = Column(Integer, default=0)
    isActive = Column(Boolean, default=True)
    coverImage = Column(String, nullable=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)

    translations = relationship("PackageTranslation", back_populates="package", cascade="all, delete-orphan")
    items = relationship("PackageItem", back_populates="package", cascade="all, delete-orphan")


class PackageTranslation(Base):
    __tablename__ = "package_translations"

    id = Column(String, primary_key=True, default=gen_id)
    packageId = Column(String, ForeignKey("packages.id", ondelete="CASCADE"), nullable=False)
    locale = Column(String, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    package = relationship("Package", back_populates="translations")

    __table_args__ = (UniqueConstraint("packageId", "locale", name="uq_pkg_locale"),)


class PackageItem(Base):
    __tablename__ = "package_items"

    id = Column(String, primary_key=True, default=gen_id)
    packageId = Column(String, ForeignKey("packages.id", ondelete="CASCADE"), nullable=False)
    productId = Column(String, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)

    package = relationship("Package", back_populates="items")


class DeliveryArea(Base):
    __tablename__ = "delivery_areas"

    id = Column(String, primary_key=True, default=gen_id)
    slug = Column(String, unique=True, nullable=False)
    pincode = Column(String, nullable=True)
    deliveryCharge = Column(Integer, default=0)
    minOrderAmount = Column(Integer, default=0)
    availableDays = Column(JSON, default=list)
    isActive = Column(Boolean, default=True)
    sortOrder = Column(Integer, default=0)
    createdAt = Column(DateTime(timezone=True), default=utcnow)
    updatedAt = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    translations = relationship("DeliveryAreaTranslation", back_populates="deliveryArea", cascade="all, delete-orphan")


class DeliveryAreaTranslation(Base):
    __tablename__ = "delivery_area_translations"

    id = Column(String, primary_key=True, default=gen_id)
    deliveryAreaId = Column(String, ForeignKey("delivery_areas.id", ondelete="CASCADE"), nullable=False)
    locale = Column(String, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    pageContent = Column(Text, nullable=True)

    deliveryArea = relationship("DeliveryArea", back_populates="translations")

    __table_args__ = (UniqueConstraint("deliveryAreaId", "locale", name="uq_area_locale"),)


class TimeSlot(Base):
    __tablename__ = "time_slots"

    id = Column(String, primary_key=True, default=gen_id)
    label = Column(String, nullable=False)
    startHour = Column(Integer, nullable=False)
    endHour = Column(Integer, nullable=False)
    capacity = Column(Integer, default=10)
    isActive = Column(Boolean, default=True)
    sortOrder = Column(Integer, default=0)


class BlockedDate(Base):
    __tablename__ = "blocked_dates"

    id = Column(String, primary_key=True, default=gen_id)
    date = Column(Date, unique=True, nullable=False)
    reason = Column(String, nullable=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=gen_id)
    orderNumber = Column(String, unique=True, nullable=False)
    customerName = Column(String, nullable=False)
    customerMobile = Column(String, nullable=False)
    customerEmail = Column(String, nullable=True)
    status = Column(String, default="PENDING")
    deliveryMode = Column(String, default="PICKUP")
    deliveryAreaId = Column(String, ForeignKey("delivery_areas.id"), nullable=True)
    deliveryAddress = Column(Text, nullable=True)
    eventDate = Column(Date, nullable=False)
    timeSlotId = Column(String, ForeignKey("time_slots.id"), nullable=True)
    eventNotes = Column(Text, nullable=True)
    deliveryCharge = Column(Integer, default=0)
    subtotal = Column(Integer, nullable=False)
    discountAmount = Column(Integer, default=0)
    couponCode = Column(String, nullable=True)
    total = Column(Integer, nullable=False)
    advancePct = Column(Integer, default=40)
    advanceAmount = Column(Integer, nullable=False)
    balanceDue = Column(Integer, nullable=False)
    allowSubstitution = Column(Boolean, default=True)
    deliveryProofUrl = Column(String, nullable=True)
    cancelReason = Column(String, nullable=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)
    updatedAt = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=gen_id)
    orderId = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    productId = Column(String, ForeignKey("products.id"), nullable=False)
    productOptionId = Column(String, ForeignKey("product_options.id"), nullable=True)
    productName = Column(String, nullable=False)
    quantity = Column(Integer, default=1)
    unitPrice = Column(Integer, nullable=False)
    addOns = Column(JSON, nullable=True)
    addOnTotal = Column(Integer, default=0)
    lineTotal = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, default=gen_id)
    orderId = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)
    status = Column(String, default="PENDING")
    amount = Column(Integer, nullable=False)
    providerRef = Column(String, nullable=True)
    providerPayload = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)
    paidAt = Column(DateTime(timezone=True), nullable=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)

    order = relationship("Order", back_populates="payments")


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(String, primary_key=True, default=gen_id)
    code = Column(String, unique=True, nullable=False)
    discountType = Column(String, nullable=False)
    discountValue = Column(Integer, nullable=False)
    minOrderAmount = Column(Integer, default=0)
    maxUses = Column(Integer, nullable=True)
    usedCount = Column(Integer, default=0)
    validFrom = Column(DateTime(timezone=True), nullable=True)
    validUntil = Column(DateTime(timezone=True), nullable=True)
    isActive = Column(Boolean, default=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)


class CustomRequest(Base):
    __tablename__ = "custom_requests"

    id = Column(String, primary_key=True, default=gen_id)
    requestNumber = Column(String, unique=True, nullable=False)
    customerName = Column(String, nullable=False)
    customerMobile = Column(String, nullable=False)
    customerEmail = Column(String, nullable=True)
    eventDate = Column(Date, nullable=True)
    budget = Column(Integer, nullable=True)
    description = Column(Text, nullable=False)
    photoUrls = Column(JSON, default=list)
    status = Column(String, default="SUBMITTED")
    createdAt = Column(DateTime(timezone=True), default=utcnow)
    updatedAt = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    quotations = relationship("Quotation", back_populates="customRequest", cascade="all, delete-orphan")


class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(String, primary_key=True, default=gen_id)
    customRequestId = Column(String, ForeignKey("custom_requests.id", ondelete="CASCADE"), nullable=False)
    quotationNumber = Column(String, unique=True, nullable=False)
    status = Column(String, default="DRAFT")
    lineItems = Column(JSON, nullable=False)
    subtotal = Column(Integer, nullable=False)
    taxAmount = Column(Integer, default=0)
    total = Column(Integer, nullable=False)
    validUntil = Column(DateTime(timezone=True), nullable=False)
    notes = Column(Text, nullable=True)
    rejectionReason = Column(Text, nullable=True)
    convertedOrderId = Column(String, nullable=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)
    updatedAt = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    customRequest = relationship("CustomRequest", back_populates="quotations")


class ContentBlock(Base):
    __tablename__ = "content_blocks"

    id = Column(String, primary_key=True, default=gen_id)
    type = Column(String, nullable=False)
    key = Column(String, unique=True, nullable=False)
    sortOrder = Column(Integer, default=0)
    isActive = Column(Boolean, default=True)
    imageUrl = Column(Text, nullable=True)
    linkUrl = Column(String, nullable=True)
    metadataJson = Column("metadata", JSON, nullable=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)
    updatedAt = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    translations = relationship("ContentBlockTranslation", back_populates="contentBlock", cascade="all, delete-orphan")


class ContentBlockTranslation(Base):
    __tablename__ = "content_block_translations"

    id = Column(String, primary_key=True, default=gen_id)
    contentBlockId = Column(String, ForeignKey("content_blocks.id", ondelete="CASCADE"), nullable=False)
    locale = Column(String, nullable=False)
    title = Column(String, nullable=True)
    subtitle = Column(String, nullable=True)
    body = Column(Text, nullable=True)

    contentBlock = relationship("ContentBlock", back_populates="translations")

    __table_args__ = (UniqueConstraint("contentBlockId", "locale", name="uq_cb_locale"),)


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=gen_id)
    customerName = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    isApproved = Column(Boolean, default=True)
    isDemo = Column(Boolean, default=False)
    createdAt = Column(DateTime(timezone=True), default=utcnow)


class NotificationLog(Base):
    __tablename__ = "notification_logs"

    id = Column(String, primary_key=True, default=gen_id)
    channel = Column(String, nullable=False)
    recipient = Column(String, nullable=False)
    subject = Column(String, nullable=True)
    body = Column(Text, nullable=False)
    status = Column(String, default="LOGGED")
    orderId = Column(String, nullable=True)
    customRequestId = Column(String, nullable=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id = Column(String, primary_key=True, default=gen_id)
    key = Column(String, unique=True, nullable=False)
    value = Column(Text, nullable=False)
    updatedAt = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)


class VisitLog(Base):
    __tablename__ = "visit_logs"

    id = Column(String, primary_key=True, default=gen_id)
    visitorHash = Column(String, nullable=False, index=True)
    visitorEmail = Column(String, nullable=True, index=True)
    visitorName = Column(String, nullable=True)
    path = Column(String, nullable=False, index=True)
    locale = Column(String, default="gu")
    deviceType = Column(String, default="mobile")
    browser = Column(String, default="Chrome")
    os = Column(String, nullable=True)
    city = Column(String, nullable=True)
    region = Column(String, nullable=True)
    country = Column(String, default="India")
    source = Column(String, default="direct", index=True)
    referrer = Column(String, nullable=True)
    isReturning = Column(Boolean, default=False)
    isBot = Column(Boolean, default=False)
    isAdmin = Column(Boolean, default=False)
    createdAt = Column(DateTime(timezone=True), default=utcnow, index=True)


class VisitorEvent(Base):
    __tablename__ = "visitor_events"

    id = Column(String, primary_key=True, default=gen_id)
    visitorHash = Column(String, nullable=False)
    eventType = Column(String, nullable=False, index=True)
    entityId = Column(String, nullable=True)
    metadataJson = Column("metadata", JSON, nullable=True)
    createdAt = Column(DateTime(timezone=True), default=utcnow)
