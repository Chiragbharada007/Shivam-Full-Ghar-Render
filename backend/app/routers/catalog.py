from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import (
    Category,
    ContentBlock,
    DeliveryArea,
    MediaAsset,
    Package,
    Product,
    Review,
    SiteSetting,
    TimeSlot,
)

router = APIRouter(prefix="/api", tags=["catalog"])


@router.get("/media/{asset_id}")
def get_media_asset(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(MediaAsset).filter(MediaAsset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(
        content=asset.data,
        media_type=asset.contentType or "image/jpeg",
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )


def _trans_map(translations, fields=("name", "description")):
    out = {}
    for t in translations:
        loc = t.locale
        if len(fields) == 1:
            out[loc] = getattr(t, fields[0], "")
        else:
            out[loc] = {f: getattr(t, f, None) for f in fields}
    return out


def _serialize_product(p: Product, locale: str = "gu"):
    t_by_loc = {t.locale: t for t in p.translations}
    t = t_by_loc.get(locale) or t_by_loc.get("gu") or t_by_loc.get("en")
    primary_img = next((img.url for img in p.images if img.isPrimary), None) or (
        p.images[0].url if p.images else "/images/placeholder-garland.svg"
    )
    cat_t = {ct.locale: ct.name for ct in p.category.translations} if p.category else {}
    return {
        "id": p.id,
        "code": p.code,
        "categoryId": p.categoryId,
        "categorySlug": p.category.slug if p.category else "",
        "categoryName": cat_t.get(locale) or cat_t.get("gu") or cat_t.get("en") or "",
        "basePrice": p.basePrice,
        "salePrice": p.salePrice,
        "unit": p.unit,
        "prepTimeDays": p.prepTimeDays,
        "status": p.status,
        "videoUrl": p.videoUrl,
        "isMadeToOrder": p.isMadeToOrder,
        "allowSubstitution": p.allowSubstitution,
        "sortOrder": p.sortOrder,
        "name": t.name if t else p.code,
        "description": t.description if t else "",
        "metaTitle": t.metaTitle if t else None,
        "metaDescription": t.metaDescription if t else None,
        "slug": t.slug if t else p.code.lower(),
        "translations": {
            loc: {
                "name": tr.name,
                "description": tr.description,
                "metaTitle": tr.metaTitle,
                "metaDescription": tr.metaDescription,
                "slug": tr.slug,
            }
            for loc, tr in t_by_loc.items()
        },
        "imageUrl": primary_img,
        "images": [
            {"id": img.id, "url": img.url, "altText": img.altText, "isPrimary": img.isPrimary, "sortOrder": img.sortOrder}
            for img in sorted(p.images, key=lambda x: x.sortOrder)
        ],
        "options": [
            {"id": opt.id, "label": opt.label, "priceAdd": opt.priceAdd, "isDefault": opt.isDefault}
            for opt in sorted(p.options, key=lambda x: x.sortOrder)
        ],
        "addOns": [
            {"id": ao.id, "label": ao.label, "price": ao.price, "isDefault": ao.isDefault}
            for ao in sorted(p.addOns, key=lambda x: x.sortOrder)
        ],
    }


@router.get("/categories")
def list_categories(locale: str = Query("gu"), db: Session = Depends(get_db)):
    cats = (
        db.query(Category)
        .options(joinedload(Category.translations))
        .filter(Category.isActive == True)
        .order_by(Category.sortOrder.asc())
        .all()
    )
    items = []
    for c in cats:
        t_by_loc = {t.locale: t for t in c.translations}
        t = t_by_loc.get(locale) or t_by_loc.get("gu") or t_by_loc.get("en")
        items.append(
            {
                "id": c.id,
                "slug": c.slug,
                "sortOrder": c.sortOrder,
                "coverImage": c.coverImage,
                "isActive": c.isActive,
                "name": t.name if t else c.slug,
                "description": t.description if t else "",
                "translations": {
                    loc: {"name": tr.name, "description": tr.description} for loc, tr in t_by_loc.items()
                },
            }
        )
    return {"success": True, "categories": items}


@router.get("/products")
def list_products(
    locale: str = Query("gu"),
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Product)
        .options(
            joinedload(Product.translations),
            joinedload(Product.images),
            joinedload(Product.options),
            joinedload(Product.addOns),
            joinedload(Product.category).joinedload(Category.translations),
        )
        .filter(Product.status == "PUBLISHED")
        .order_by(Product.sortOrder.asc(), Product.createdAt.desc())
    )
    products = query.all()
    serialized = [_serialize_product(p, locale) for p in products]

    if category:
        serialized = [p for p in serialized if p["categorySlug"] == category]
    if q:
        ql = q.strip().lower()
        serialized = [
            p
            for p in serialized
            if ql in p["name"].lower() or ql in p["code"].lower() or ql in p["description"].lower()
        ]
    return {"success": True, "products": serialized}


@router.get("/products/{code}")
def get_product(code: str, locale: str = Query("gu"), db: Session = Depends(get_db)):
    p = (
        db.query(Product)
        .options(
            joinedload(Product.translations),
            joinedload(Product.images),
            joinedload(Product.options),
            joinedload(Product.addOns),
            joinedload(Product.category).joinedload(Category.translations),
        )
        .filter(Product.code == code)
        .first()
    )
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "product": _serialize_product(p, locale)}


@router.get("/packages")
def list_packages(locale: str = Query("gu"), db: Session = Depends(get_db)):
    pkgs = (
        db.query(Package)
        .options(joinedload(Package.translations), joinedload(Package.items))
        .filter(Package.isActive == True)
        .order_by(Package.sortOrder.asc())
        .all()
    )
    result = []
    for pkg in pkgs:
        t_by_loc = {t.locale: t for t in pkg.translations}
        t = t_by_loc.get(locale) or t_by_loc.get("gu") or t_by_loc.get("en")
        result.append(
            {
                "id": pkg.id,
                "slug": pkg.slug,
                "price": pkg.price,
                "coverImage": pkg.coverImage,
                "name": t.name if t else pkg.slug,
                "description": t.description if t else "",
                "itemCount": len(pkg.items),
            }
        )
    return {"success": True, "packages": result}


@router.get("/banners")
def list_banners(locale: str = Query("gu"), db: Session = Depends(get_db)):
    blocks = (
        db.query(ContentBlock)
        .options(joinedload(ContentBlock.translations))
        .filter(ContentBlock.type.in_(["BANNER", "HERO"]), ContentBlock.isActive == True)
        .order_by(ContentBlock.sortOrder.asc())
        .all()
    )
    banners = []
    for b in blocks:
        t_by_loc = {t.locale: t for t in b.translations}
        t = t_by_loc.get(locale) or t_by_loc.get("gu") or t_by_loc.get("en")
        banners.append(
            {
                "id": b.id,
                "key": b.key,
                "type": b.type,
                "imageUrl": b.imageUrl,
                "linkUrl": b.linkUrl,
                "sortOrder": b.sortOrder,
                "title": t.title if t else "",
                "subtitle": t.subtitle if t else "",
                "body": t.body if t else "",
                "metadata": b.metadataJson or {},
            }
        )
    return {"success": True, "banners": banners}


@router.get("/pages")
def list_pages(locale: str = Query("gu"), slug: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(ContentBlock).options(joinedload(ContentBlock.translations)).filter(ContentBlock.type == "POLICY")
    if slug:
        b = q.filter(ContentBlock.key == slug).first()
        if not b:
            return {"success": False, "page": None}
        t_by_loc = {t.locale: t for t in b.translations}
        t = t_by_loc.get(locale) or t_by_loc.get("gu") or t_by_loc.get("en")
        return {
            "success": True,
            "page": {
                "id": b.id,
                "slug": b.key,
                "title": t.title if t else b.key,
                "body": t.body if t else "",
                "metadata": b.metadataJson or {},
            },
        }
    pages = []
    for b in q.filter(ContentBlock.isActive == True).order_by(ContentBlock.sortOrder.asc()).all():
        t_by_loc = {t.locale: t for t in b.translations}
        t = t_by_loc.get(locale) or t_by_loc.get("gu") or t_by_loc.get("en")
        pages.append(
            {
                "id": b.id,
                "slug": b.key,
                "title": t.title if t else b.key,
                "body": t.body if t else "",
                "metadata": b.metadataJson or {},
            }
        )
    return {"success": True, "pages": pages}


@router.get("/search")
def search_catalog(q: str = Query(""), locale: str = Query("gu"), db: Session = Depends(get_db)):
    ql = q.strip().lower()
    if not ql:
        return {"success": True, "results": []}
    products = (
        db.query(Product)
        .options(joinedload(Product.translations), joinedload(Product.images), joinedload(Product.category).joinedload(Category.translations))
        .filter(Product.status == "PUBLISHED")
        .all()
    )
    matches = []
    for p in products:
        sp = _serialize_product(p, locale)
        if ql in sp["name"].lower() or ql in sp["code"].lower() or ql in sp["description"].lower():
            matches.append(sp)
    return {"success": True, "results": matches[:20]}


@router.get("/site-settings")
def get_site_settings(db: Session = Depends(get_db)):
    rows = db.query(SiteSetting).all()
    data = {r.key: r.value for r in rows}
    return {"success": True, "settings": data}


@router.get("/delivery-areas")
def list_delivery_areas(locale: str = Query("gu"), db: Session = Depends(get_db)):
    areas = (
        db.query(DeliveryArea)
        .options(joinedload(DeliveryArea.translations))
        .filter(DeliveryArea.isActive == True)
        .order_by(DeliveryArea.sortOrder.asc())
        .all()
    )
    slots = db.query(TimeSlot).filter(TimeSlot.isActive == True).order_by(TimeSlot.sortOrder.asc()).all()
    return {
        "success": True,
        "areas": [
            {
                "id": a.id,
                "slug": a.slug,
                "pincode": a.pincode,
                "deliveryCharge": a.deliveryCharge,
                "name": next((t.name for t in a.translations if t.locale == locale), a.slug),
            }
            for a in areas
        ],
        "timeSlots": [{"id": s.id, "label": s.label, "startHour": s.startHour, "endHour": s.endHour} for s in slots],
    }


@router.get("/reviews")
def list_reviews(db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.isApproved == True).order_by(Review.createdAt.desc()).limit(20).all()
    return {
        "success": True,
        "reviews": [
            {"id": r.id, "customerName": r.customerName, "rating": r.rating, "comment": r.comment}
            for r in reviews
        ],
    }
