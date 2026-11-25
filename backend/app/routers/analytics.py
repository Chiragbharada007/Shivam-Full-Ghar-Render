import csv
import hashlib
import io
from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Query, Request, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import VisitLog, VisitorEvent
from app.security import get_current_admin

router = APIRouter(tags=["analytics"])


class TrackVisitRequest(BaseModel):
    path: str = "/"
    locale: str = "gu"
    referrer: Optional[str] = None
    eventType: Optional[str] = "page_view"
    entityId: Optional[str] = None
    visitorEmail: Optional[str] = None
    visitorName: Optional[str] = None
    city: Optional[str] = None
    region: Optional[str] = None
    country: Optional[str] = None


def _parse_device_browser(ua: str) -> tuple[str, str]:
    ual = ua.lower()
    device = "tablet" if "ipad" in ual or "tablet" in ual else ("mobile" if any(k in ual for k in ("mobile", "android", "iphone")) else "desktop")
    if "edg" in ual:
        browser = "Edge"
    elif "chrome" in ual:
        browser = "Chrome"
    elif "safari" in ual:
        browser = "Safari"
    elif "firefox" in ual:
        browser = "Firefox"
    else:
        browser = "Other"
    return device, browser


def _parse_source(referrer: Optional[str]) -> str:
    if not referrer:
        return "direct"
    rl = referrer.lower()
    if "whatsapp" in rl or "wa.me" in rl:
        return "whatsapp"
    if "instagram" in rl:
        return "instagram"
    if "google" in rl:
        return "google"
    return "other"


@router.post("/api/analytics/track")
def track_visit(payload: TrackVisitRequest, request: Request, db: Session = Depends(get_db)):
    ua = request.headers.get("user-agent", "")
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "0.0.0.0").split(",")[0].strip()
    visitor_hash = hashlib.sha256(f"{ip}:{ua[:80]}".encode("utf-8")).hexdigest()[:24]

    city = (
        payload.city
        or request.headers.get("x-vercel-ip-city")
        or request.headers.get("cf-ipcity")
        or request.headers.get("x-geo-city")
        or "Keshod Area"
    )
    region = (
        payload.region
        or request.headers.get("x-vercel-ip-country-region")
        or request.headers.get("cf-region")
        or request.headers.get("x-geo-region")
        or "Gujarat"
    )
    country = (
        payload.country
        or request.headers.get("x-vercel-ip-country")
        or request.headers.get("cf-ipcountry")
        or "India"
    )

    email = payload.visitorEmail.strip().lower() if payload.visitorEmail else None
    name = payload.visitorName.strip() if payload.visitorName else None

    if not email:
        prior = (
            db.query(VisitLog)
            .filter(VisitLog.visitorHash == visitor_hash, VisitLog.visitorEmail.isnot(None))
            .order_by(VisitLog.createdAt.desc())
            .first()
        )
        if prior:
            email = prior.visitorEmail
            name = name or prior.visitorName

    is_returning = db.query(VisitLog.id).filter(VisitLog.visitorHash == visitor_hash).first() is not None
    device, browser = _parse_device_browser(ua)
    source = _parse_source(payload.referrer)

    if payload.eventType and payload.eventType != "page_view":
        db.add(VisitorEvent(visitorHash=visitor_hash, eventType=payload.eventType, entityId=payload.entityId))
    else:
        db.add(
            VisitLog(
                visitorHash=visitor_hash,
                visitorEmail=email,
                visitorName=name,
                path=payload.path[:200],
                locale=payload.locale[:5],
                deviceType=device,
                browser=browser,
                city=city,
                region=region,
                country=country,
                source=source,
                referrer=payload.referrer[:300] if payload.referrer else None,
                isReturning=is_returning,
            )
        )
    db.commit()
    return {"success": True}


@router.get("/api/admin/visitors")
def get_admin_visitors(
    source: Optional[str] = Query(None),
    device: Optional[str] = Query(None),
    path: Optional[str] = Query(None),
    export: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    now = datetime.now(timezone.utc)
    five_mins_ago = now - timedelta(minutes=5)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    seven_days_ago = now - timedelta(days=7)
    thirty_days_ago = now - timedelta(days=30)

    q = db.query(VisitLog).order_by(VisitLog.createdAt.desc())
    if source:
        q = q.filter(VisitLog.source == source)
    if device:
        q = q.filter(VisitLog.deviceType == device)
    if path:
        q = q.filter(VisitLog.path.ilike(f"%{path}%"))

    logs = q.limit(200).all()

    if export == "csv":
        buf = io.StringIO()
        writer = csv.writer(buf)
        writer.writerow(["Time", "VisitorEmail", "VisitorName", "City", "Region", "Country", "Path", "Device", "Browser", "Source", "Returning"])
        for l in logs:
            writer.writerow([
                l.createdAt.isoformat() if l.createdAt else "",
                l.visitorEmail or "",
                l.visitorName or "",
                l.city or "",
                l.region or "",
                l.country or "",
                l.path,
                l.deviceType,
                l.browser,
                l.source,
                "Yes" if l.isReturning else "No",
            ])
        return Response(
            content=buf.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=shivam-visitors-report.csv"},
        )

    all_30d = db.query(VisitLog).filter(VisitLog.createdAt >= thirty_days_ago).all()
    live_now = len({l.visitorHash for l in all_30d if l.createdAt and l.createdAt.replace(tzinfo=timezone.utc) >= five_mins_ago})
    today_count = sum(1 for l in all_30d if l.createdAt and l.createdAt.replace(tzinfo=timezone.utc) >= today_start)
    last_7d = sum(1 for l in all_30d if l.createdAt and l.createdAt.replace(tzinfo=timezone.utc) >= seven_days_ago)
    identified_emails = len({l.visitorEmail for l in all_30d if l.visitorEmail})

    page_counts = Counter(l.path for l in all_30d).most_common(6)
    loc_counts = Counter((l.city or "Keshod Area", l.region or "Gujarat") for l in all_30d).most_common(6)
    src_counts = Counter(l.source for l in all_30d).most_common(6)
    dev_counts = Counter(l.deviceType for l in all_30d).most_common(6)

    whatsapp_clicks = db.query(VisitorEvent).filter(VisitorEvent.eventType == "whatsapp_click").count()
    quote_submits = db.query(VisitorEvent).filter(VisitorEvent.eventType == "custom_request_submit").count()

    return {
        "success": True,
        "stats": {
            "liveNow": live_now,
            "today": today_count,
            "last7Days": last_7d,
            "last30Days": len(all_30d),
            "identifiedVisitors": identified_emails,
            "eventCounts": {
                "whatsapp_click": whatsapp_clicks,
                "custom_request_submit": quote_submits,
            },
        },
        "topPages": [{"path": p, "count": c} for p, c in page_counts],
        "locations": [{"city": loc[0], "region": loc[1], "count": c} for loc, c in loc_counts],
        "sources": [{"source": s, "count": c} for s, c in src_counts],
        "devices": [{"device": d, "count": c} for d, c in dev_counts],
        "logs": [
            {
                "id": l.id,
                "visitorEmail": l.visitorEmail,
                "visitorName": l.visitorName,
                "city": l.city,
                "region": l.region,
                "country": l.country,
                "path": l.path,
                "deviceType": l.deviceType,
                "browser": l.browser,
                "source": l.source,
                "isReturning": l.isReturning,
                "createdAt": l.createdAt.isoformat() if l.createdAt else None,
            }
            for l in logs[:100]
        ],
    }
