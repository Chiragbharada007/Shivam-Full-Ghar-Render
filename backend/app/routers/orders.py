import secrets
from datetime import datetime, date, timezone
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Coupon, CustomRequest, Order, OrderItem, Payment, Product, Quotation

router = APIRouter(prefix="/api", tags=["orders"])


class OrderItemInput(BaseModel):
    productId: str
    productOptionId: Optional[str] = None
    productName: Optional[str] = None
    quantity: int = 1
    unitPrice: int = 0
    addOns: Optional[List[Any]] = None
    addOnTotal: int = 0


class CreateOrderRequest(BaseModel):
    customerName: str
    customerMobile: str
    customerEmail: Optional[str] = None
    deliveryMode: str = "PICKUP"
    deliveryAreaId: Optional[str] = None
    deliveryAddress: Optional[str] = None
    eventDate: str
    timeSlotId: Optional[str] = None
    eventNotes: Optional[str] = None
    couponCode: Optional[str] = None
    allowSubstitution: bool = True
    items: List[OrderItemInput]


class CouponValidateRequest(BaseModel):
    code: str
    subtotal: int = 0


class MockPaymentRequest(BaseModel):
    orderId: str
    amount: Optional[int] = None
    type: str = "ADVANCE"


class CustomRequestInput(BaseModel):
    customerName: str
    customerMobile: str
    customerEmail: Optional[str] = None
    eventDate: Optional[str] = None
    budget: Optional[int] = None
    description: str
    photoUrls: Optional[List[str]] = None


class QuotationRespondRequest(BaseModel):
    action: str  # ACCEPT | REJECT
    rejectionReason: Optional[str] = None


@router.post("/orders")
def create_order(payload: CreateOrderRequest, db: Session = Depends(get_db)):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Order must include at least one item")

    subtotal = 0
    order_items = []
    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.productId).first()
        unit_price = item.unitPrice or (product.salePrice or product.basePrice if product else 0)
        line_total = (unit_price + item.addOnTotal) * max(1, item.quantity)
        subtotal += line_total
        order_items.append(
            OrderItem(
                productId=item.productId,
                productOptionId=item.productOptionId,
                productName=item.productName or (product.code if product else "Floral Item"),
                quantity=max(1, item.quantity),
                unitPrice=unit_price,
                addOns=item.addOns or [],
                addOnTotal=item.addOnTotal,
                lineTotal=line_total,
            )
        )

    discount_amount = 0
    if payload.couponCode:
        coupon = db.query(Coupon).filter(Coupon.code == payload.couponCode.strip().upper(), Coupon.isActive == True).first()
        if coupon and subtotal >= (coupon.minOrderAmount or 0):
            if coupon.discountType == "PERCENT":
                discount_amount = int(subtotal * coupon.discountValue / 100)
            else:
                discount_amount = min(subtotal, coupon.discountValue)
            coupon.usedCount = (coupon.usedCount or 0) + 1

    total = max(0, subtotal - discount_amount)
    advance_pct = 40
    advance_amount = int(round(total * advance_pct / 100))
    balance_due = total - advance_amount

    try:
        parsed_date = date.fromisoformat(payload.eventDate[:10])
    except Exception:
        parsed_date = date.today()

    now_str = datetime.now(timezone.utc).strftime("%Y%m%d")
    order_number = f"SFG-{now_str}-{secrets.token_hex(2).upper()}"

    order = Order(
        orderNumber=order_number,
        customerName=payload.customerName.strip(),
        customerMobile=payload.customerMobile.strip(),
        customerEmail=payload.customerEmail.strip().lower() if payload.customerEmail else None,
        deliveryMode=payload.deliveryMode,
        deliveryAreaId=payload.deliveryAreaId,
        deliveryAddress=payload.deliveryAddress,
        eventDate=parsed_date,
        timeSlotId=payload.timeSlotId,
        eventNotes=payload.eventNotes,
        deliveryCharge=0,
        subtotal=subtotal,
        discountAmount=discount_amount,
        couponCode=payload.couponCode,
        total=total,
        advancePct=advance_pct,
        advanceAmount=advance_amount,
        balanceDue=balance_due,
        allowSubstitution=payload.allowSubstitution,
        items=order_items,
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "success": True,
        "order": {
            "id": order.id,
            "orderNumber": order.orderNumber,
            "total": order.total,
            "advanceAmount": order.advanceAmount,
            "balanceDue": order.balanceDue,
            "status": order.status,
        },
    }


@router.get("/orders/{order_id}")
def get_order(order_id: str, db: Session = Depends(get_db)):
    order = (
        db.query(Order)
        .options(joinedload(Order.items), joinedload(Order.payments))
        .filter((Order.id == order_id) | (Order.orderNumber == order_id))
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "success": True,
        "order": {
            "id": order.id,
            "orderNumber": order.orderNumber,
            "customerName": order.customerName,
            "customerMobile": order.customerMobile,
            "customerEmail": order.customerEmail,
            "status": order.status,
            "deliveryMode": order.deliveryMode,
            "eventDate": order.eventDate.isoformat() if order.eventDate else None,
            "subtotal": order.subtotal,
            "discountAmount": order.discountAmount,
            "total": order.total,
            "advanceAmount": order.advanceAmount,
            "balanceDue": order.balanceDue,
            "items": [
                {
                    "id": i.id,
                    "productName": i.productName,
                    "quantity": i.quantity,
                    "unitPrice": i.unitPrice,
                    "lineTotal": i.lineTotal,
                }
                for i in order.items
            ],
            "payments": [
                {
                    "id": p.id,
                    "type": p.type,
                    "status": p.status,
                    "amount": p.amount,
                    "paidAt": p.paidAt.isoformat() if p.paidAt else None,
                }
                for p in order.payments
            ],
        },
    }


@router.get("/track")
def track_order(orderNumber: str = Query(...), mobile: Optional[str] = Query(None), db: Session = Depends(get_db)):
    q = db.query(Order).options(joinedload(Order.items)).filter(Order.orderNumber == orderNumber.strip().upper())
    if mobile:
        clean = "".join(ch for ch in mobile if ch.isdigit())[-10:]
        order = q.first()
        if not order or not order.customerMobile.endswith(clean):
            return {"success": False, "message": "Order not found or mobile mismatch."}
    else:
        order = q.first()
        if not order:
            return {"success": False, "message": "Order not found."}

    return {
        "success": True,
        "order": {
            "id": order.id,
            "orderNumber": order.orderNumber,
            "customerName": order.customerName,
            "status": order.status,
            "deliveryMode": order.deliveryMode,
            "eventDate": order.eventDate.isoformat() if order.eventDate else None,
            "total": order.total,
            "advanceAmount": order.advanceAmount,
            "balanceDue": order.balanceDue,
            "items": [{"productName": i.productName, "quantity": i.quantity, "lineTotal": i.lineTotal} for i in order.items],
        },
    }


@router.post("/coupons/validate")
def validate_coupon(payload: CouponValidateRequest, db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.code == payload.code.strip().upper(), Coupon.isActive == True).first()
    if not coupon:
        return {"valid": False, "message": "Invalid or expired coupon code."}
    if payload.subtotal < (coupon.minOrderAmount or 0):
        return {"valid": False, "message": f"Minimum order ₹{(coupon.minOrderAmount or 0) / 100:.0f} required."}
    discount = (
        int(payload.subtotal * coupon.discountValue / 100)
        if coupon.discountType == "PERCENT"
        else min(payload.subtotal, coupon.discountValue)
    )
    return {"valid": True, "code": coupon.code, "discountAmount": discount}


@router.post("/payments/mock")
def process_mock_payment(payload: MockPaymentRequest, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == payload.orderId).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    amount = payload.amount or order.advanceAmount
    payment = Payment(
        orderId=order.id,
        type=payload.type,
        status="PAID",
        amount=amount,
        providerRef=f"MOCK-{secrets.token_hex(4).upper()}",
        paidAt=datetime.now(timezone.utc),
    )
    order.status = "CONFIRMED"
    order.balanceDue = max(0, order.total - amount)
    db.add(payment)
    db.commit()

    return {"success": True, "paymentId": payment.id, "status": "PAID", "orderStatus": order.status}


@router.post("/custom-requests")
def submit_custom_request(payload: CustomRequestInput, db: Session = Depends(get_db)):
    parsed_date = None
    if payload.eventDate:
        try:
            parsed_date = date.fromisoformat(payload.eventDate[:10])
        except Exception:
            parsed_date = None

    req_num = f"CRQ-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{secrets.token_hex(2).upper()}"
    cr = CustomRequest(
        requestNumber=req_num,
        customerName=payload.customerName.strip(),
        customerMobile=payload.customerMobile.strip(),
        customerEmail=payload.customerEmail.strip().lower() if payload.customerEmail else None,
        eventDate=parsed_date,
        budget=payload.budget,
        description=payload.description.strip(),
        photoUrls=payload.photoUrls or [],
        status="SUBMITTED",
    )
    db.add(cr)
    db.commit()
    db.refresh(cr)
    return {"success": True, "requestNumber": cr.requestNumber, "id": cr.id}


@router.get("/quotations/{quotation_id}")
def get_quotation(quotation_id: str, db: Session = Depends(get_db)):
    q = (
        db.query(Quotation)
        .options(joinedload(Quotation.customRequest))
        .filter((Quotation.id == quotation_id) | (Quotation.quotationNumber == quotation_id))
        .first()
    )
    if not q:
        raise HTTPException(status_code=404, detail="Quotation not found")

    return {
        "success": True,
        "quotation": {
            "id": q.id,
            "quotationNumber": q.quotationNumber,
            "status": q.status,
            "lineItems": q.lineItems,
            "subtotal": q.subtotal,
            "taxAmount": q.taxAmount,
            "total": q.total,
            "validUntil": q.validUntil.isoformat() if q.validUntil else None,
            "notes": q.notes,
            "customerName": q.customRequest.customerName if q.customRequest else "",
            "customerMobile": q.customRequest.customerMobile if q.customRequest else "",
        },
    }


@router.post("/quotations/{quotation_id}/respond")
def respond_to_quotation(quotation_id: str, payload: QuotationRespondRequest, db: Session = Depends(get_db)):
    q = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quotation not found")

    action = payload.action.strip().upper()
    if action == "ACCEPT":
        q.status = "ACCEPTED"
        if q.customRequest:
            q.customRequest.status = "ACCEPTED"
    elif action == "REJECT":
        q.status = "REJECTED"
        q.rejectionReason = payload.rejectionReason
        if q.customRequest:
            q.customRequest.status = "REJECTED"
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    db.commit()
    return {"success": True, "status": q.status}
