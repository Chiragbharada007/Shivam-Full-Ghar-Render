"""Comprehensive end-to-end test suite for Shivam Full Ghar Admin & Auth APIs."""
import os
import sys
import tempfile

# Use isolated temporary SQLite DB for fast deterministic testing
_tmp_db = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
os.environ["DATABASE_URL"] = f"sqlite:///{_tmp_db.name}"
os.environ["JWT_SECRET"] = "test-jwt-secret-key-2026"

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient  # noqa: E402
from seed import run_seed  # noqa: E402
from app.main import app  # noqa: E402
from app.database import SessionLocal  # noqa: E402
from app.models import AdminUser  # noqa: E402
from app.security import hash_otp  # noqa: E402


def run_all_tests():
    run_seed()
    client = TestClient(app)

    # 1. Health Check
    r = client.get("/health")
    assert r.status_code == 200 and r.json()["status"] == "ok", f"Health failed: {r.text}"
    print("[PASS] 1. Health Check")

    # 2. Direct Login (Without OTP)
    r = client.post("/api/auth/login", json={"email": "chiragcaret09@gmail.com", "password": "Admin@123"})
    assert r.status_code == 200 and r.json()["success"] is True, f"Direct login failed: {r.text}"
    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] 2. Direct Login (Without OTP)")

    # 3. Session Check (/api/auth/me)
    r = client.get("/api/auth/me", headers=headers)
    assert r.status_code == 200 and r.json()["authenticated"] is True, f"Session check failed: {r.text}"
    print("[PASS] 3. Session /api/auth/me")

    # 4. OTP Send & Verify Flow
    r = client.post("/api/auth/admin-otp/send", json={"email": "chiragcaret09@gmail.com", "password": "Admin@123"})
    assert r.status_code == 200 and r.json()["success"] is True, f"OTP send failed: {r.text}"

    # Inject known OTP hash in DB to verify OTP verification logic deterministically
    db = SessionLocal()
    admin = db.query(AdminUser).filter(AdminUser.email == "chiragcaret09@gmail.com").first()
    admin.otpHash = hash_otp("123456")
    db.commit()
    db.close()

    r = client.post("/api/auth/admin-otp/verify", json={"email": "chiragcaret09@gmail.com", "otp": "123456"})
    assert r.status_code == 200 and r.json()["success"] is True, f"OTP verify failed: {r.text}"
    print("[PASS] 4. OTP Send & Verify")

    # 5. 2-Security-Questions Fallback Login
    r = client.get("/api/auth/admin-security-questions?email=chiragcaret09@gmail.com")
    assert r.status_code == 200 and r.json()["success"] is True, f"Security Q GET failed: {r.text}"
    r = client.post(
        "/api/auth/admin-security-questions",
        json={"email": "chiragcaret09@gmail.com", "answer1": "keshod", "answer2": "shivam full ghar"},
    )
    assert r.status_code == 200 and r.json()["success"] is True, f"Security Q POST failed: {r.text}"
    print("[PASS] 5. 2-Security-Questions Fallback Login")

    # 6. Admin Dashboard
    r = client.get("/api/admin/dashboard", headers=headers)
    assert r.status_code == 200 and r.json()["success"] is True, f"Dashboard failed: {r.text}"
    print("[PASS] 6. Admin Dashboard")

    # 7. Admin Categories + Reorder
    r = client.get("/api/admin/categories", headers=headers)
    assert r.status_code == 200 and len(r.json()["categories"]) > 0, f"Categories failed: {r.text}"
    cat_id = r.json()["categories"][0]["id"]

    r = client.post(
        "/api/admin/categories",
        headers=headers,
        json={"slug": "test-category", "names": {"en": "Test Cat", "gu": "ટેસ્ટ", "hi": "टेस्ट"}},
    )
    assert r.status_code == 200 and r.json()["success"] is True, f"Category create failed: {r.text}"
    print("[PASS] 7. Admin Categories CRUD")

    # 8. Admin Products CRUD (Exact ProductManager.tsx UI Payload: categorySlug + partial status toggle)
    r = client.post(
        "/api/admin/products",
        headers=headers,
        json={
            "code": "SFG-TEST-001",
            "categorySlug": "garlands",
            "basePrice": 2800,
            "mrp": 3500,
            "unit": "pair",
            "prepTimeDays": 2,
            "status": "PUBLISHED",
            "nameGu": "ટેસ્ટ વરમાળા",
            "nameHi": "टेस्ट वरमाला",
            "nameEn": "Test Varmala Pair",
            "descriptionEn": "Automated test product",
            "imageUrl": "/products/VM-R01.jpg",
        },
    )
    assert r.status_code == 200 and r.json()["success"] is True and r.json().get("product"), f"Product create failed: {r.text}"
    prod_id = r.json()["id"]

    r = client.get("/api/admin/products", headers=headers)
    assert any(p["id"] == prod_id for p in r.json()["products"]), "Created product missing in list"

    # Partial status toggle (just like ProductManager.tsx handleToggleStatus)
    r = client.put(
        f"/api/admin/products/{prod_id}",
        headers=headers,
        json={"status": "DRAFT"},
    )
    assert r.status_code == 200 and r.json()["success"] is True and r.json()["product"]["status"] == "DRAFT", f"Status toggle failed: {r.text}"

    r = client.delete(f"/api/admin/products/{prod_id}", headers=headers)
    assert r.status_code == 200 and r.json()["success"] is True, f"Product delete failed: {r.text}"
    print("[PASS] 8. Admin Products CRUD (UI Payload + Partial Toggle + Delete)")

    # 9. Banners, Pages, Settings, Credentials, SEO Report
    for ep in ("/api/admin/banners", "/api/admin/pages", "/api/admin/settings", "/api/admin/credentials", "/api/admin/seo-report", "/api/admin/db-status"):
        r = client.get(ep, headers=headers)
        assert r.status_code == 200 and r.json()["success"] is True, f"Endpoint {ep} failed: {r.text}"
    print("[PASS] 9. Banners, Pages, Settings, Credentials, SEO Report & DB Status")

    # 10. Custom Inquiry + Admin Quotations + Visitor Geolocation Telemetry
    r = client.post(
        "/api/custom-requests",
        json={"customerName": "Test Bride", "customerMobile": "9876543210", "description": "Red rose varmala"},
    )
    assert r.status_code == 200 and r.json()["success"] is True, f"Custom request failed: {r.text}"

    r = client.get("/api/admin/quotations", headers=headers)
    assert r.status_code == 200 and len(r.json()["requests"]) >= 1, f"Admin quotations failed: {r.text}"

    r = client.post(
        "/api/analytics/track",
        json={"path": "/en/contact", "locale": "en", "visitorEmail": "bride@example.com", "city": "Keshod", "region": "Gujarat"},
    )
    assert r.status_code == 200 and r.json()["success"] is True

    r = client.get("/api/admin/visitors", headers=headers)
    assert r.status_code == 200 and r.json()["stats"]["identifiedVisitors"] >= 1, f"Visitors analytics failed: {r.text}"
    print("[PASS] 10. Custom Inquiries, Quotations & Visitor Email/Geolocation Telemetry")

    print("\nALL 10 ADMIN & AUTH E2E TEST SUITES PASSED!")


if __name__ == "__main__":
    try:
        run_all_tests()
    finally:
        if os.path.exists(_tmp_db.name):
            os.remove(_tmp_db.name)
