import logging
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from core.database import get_db
from models.users import Users
from models.profiles import Profiles
from models.listings import Listings
from models.payments import Payments

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])

class AdminLoginRequest(BaseModel):
    email: str
    password: str

class PaymentVerifyRequest(BaseModel):
    payment_id: str
    action: str  # verify, reject

class ListingActionRequest(BaseModel):
    listing_id: str
    action: str  # approve, reject

# Admin credentials (in production, use proper auth)
ADMIN_EMAIL = "admin@anonimax.com"
ADMIN_PASSWORD = "admin123"

def verify_admin(email: str, password: str) -> bool:
    return email == ADMIN_EMAIL and password == ADMIN_PASSWORD

@router.post("/login")
async def admin_login(
    data: AdminLoginRequest,
):
    """Admin login"""
    if not verify_admin(data.email, data.password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    return {"message": "Login admin realizado", "token": "admin-token"}

@router.get("/stats")
async def get_stats(
    admin_token: str,
    db: AsyncSession = Depends(get_db),
):
    """Get platform statistics"""
    try:
        if admin_token != "admin-token":
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        # Count users
        result = await db.execute(select(func.count(Users.id)))
        total_users = result.scalar() or 0
        
        # Count verified users
        result = await db.execute(select(func.count(Users.id)).where(Users.is_verified == True))
        verified_users = result.scalar() or 0
        
        # Count listings by status
        result = await db.execute(select(func.count(Listings.id)))
        total_listings = result.scalar() or 0
        
        result = await db.execute(select(func.count(Listings.id)).where(Listings.status == "active"))
        active_listings = result.scalar() or 0
        
        result = await db.execute(select(func.count(Listings.id)).where(Listings.status == "pending"))
        pending_listings = result.scalar() or 0
        
        # Count payments
        result = await db.execute(select(func.count(Payments.id)).where(Payments.status == "pending"))
        pending_payments = result.scalar() or 0
        
        result = await db.execute(select(func.count(Payments.id)).where(Payments.status == "verified"))
        verified_payments = result.scalar() or 0
        
        # Total revenue
        result = await db.execute(
            select(func.sum(Payments.amount)).where(Payments.status == "verified")
        )
        total_revenue = result.scalar() or 0
        
        return {
            "users": {
                "total": total_users,
                "verified": verified_users,
            },
            "listings": {
                "total": total_listings,
                "active": active_listings,
                "pending": pending_listings,
            },
            "payments": {
                "pending": pending_payments,
                "verified": verified_payments,
                "total_revenue": float(total_revenue),
            },
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Get stats error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users")
async def list_users(
    admin_token: str,
    db: AsyncSession = Depends(get_db),
):
    """List all users"""
    try:
        if admin_token != "admin-token":
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        result = await db.execute(select(Users).order_by(Users.created_at.desc()).limit(100))
        users = result.scalars().all()
        
        return {
            "users": [
                {
                    "id": u.id,
                    "email": u.email,
                    "anonimax_id": u.anonimax_id,
                    "is_verified": u.is_verified,
                    "is_admin": u.is_admin,
                    "created_at": u.created_at,
                }
                for u in users
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"List users error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/listings")
async def list_all_listings(
    admin_token: str,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all listings for admin"""
    try:
        if admin_token != "admin-token":
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        query = select(Listings)
        if status:
            query = query.where(Listings.status == status)
        
        result = await db.execute(query.order_by(Listings.created_at.desc()).limit(100))
        listings = result.scalars().all()
        
        return {
            "listings": [
                {
                    "id": l.id,
                    "anonimax_id": l.anonimax_id,
                    "title": l.title,
                    "content": l.content,
                    "category": l.category,
                    "state": l.state,
                    "status": l.status,
                    "payment_status": l.payment_status,
                    "created_at": l.created_at,
                }
                for l in listings
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"List listings error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payments")
async def list_payments(
    admin_token: str,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all payments"""
    try:
        if admin_token != "admin-token":
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        query = select(Payments)
        if status:
            query = query.where(Payments.status == status)
        
        result = await db.execute(query.order_by(Payments.created_at.desc()).limit(100))
        payments = result.scalars().all()
        
        return {
            "payments": [
                {
                    "id": p.id,
                    "anonimax_id": p.anonimax_id,
                    "listing_id": p.listing_id,
                    "amount": p.amount,
                    "currency": p.currency,
                    "network": p.network,
                    "tx_hash": p.tx_hash,
                    "type": p.type,
                    "status": p.status,
                    "created_at": p.created_at,
                    "verified_at": p.verified_at,
                }
                for p in payments
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"List payments error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/payments/verify")
async def verify_payment(
    data: PaymentVerifyRequest,
    admin_token: str,
    db: AsyncSession = Depends(get_db),
):
    """Verify or reject a payment"""
    try:
        if admin_token != "admin-token":
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        result = await db.execute(select(Payments).where(Payments.id == data.payment_id))
        payment = result.scalar_one_or_none()
        
        if not payment:
            raise HTTPException(status_code=404, detail="Pagamento não encontrado")
        
        if data.action == "verify":
            payment.status = "verified"
            payment.verified_at = datetime.now()
            
            # Activate the listing
            if payment.listing_id:
                result = await db.execute(select(Listings).where(Listings.id == payment.listing_id))
                listing = result.scalar_one_or_none()
                if listing:
                    listing.status = "active"
                    listing.payment_status = "verified"
                    listing.expires_at = datetime.now() + timedelta(days=30)
                    listing.updated_at = datetime.now()
            
            message = "Pagamento verificado e anúncio ativado"
        elif data.action == "reject":
            payment.status = "rejected"
            
            if payment.listing_id:
                result = await db.execute(select(Listings).where(Listings.id == payment.listing_id))
                listing = result.scalar_one_or_none()
                if listing:
                    listing.payment_status = "rejected"
                    listing.updated_at = datetime.now()
            
            message = "Pagamento rejeitado"
        else:
            raise HTTPException(status_code=400, detail="Ação inválida")
        
        await db.commit()
        
        return {"message": message}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Verify payment error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/listings/action")
async def listing_action(
    data: ListingActionRequest,
    admin_token: str,
    db: AsyncSession = Depends(get_db),
):
    """Approve or reject a listing"""
    try:
        if admin_token != "admin-token":
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        result = await db.execute(select(Listings).where(Listings.id == data.listing_id))
        listing = result.scalar_one_or_none()
        
        if not listing:
            raise HTTPException(status_code=404, detail="Anúncio não encontrado")
        
        if data.action == "approve":
            listing.status = "active"
            listing.expires_at = datetime.now() + timedelta(days=30)
            message = "Anúncio aprovado"
        elif data.action == "reject":
            listing.status = "rejected"
            message = "Anúncio rejeitado"
        else:
            raise HTTPException(status_code=400, detail="Ação inválida")
        
        listing.updated_at = datetime.now()
        await db.commit()
        
        return {"message": message}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Listing action error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    admin_token: str,
    db: AsyncSession = Depends(get_db),
):
    """Delete a user and all their data"""
    try:
        if admin_token != "admin-token":
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        result = await db.execute(select(Users).where(Users.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        # Delete user's listings
        result = await db.execute(select(Listings).where(Listings.user_id == user_id))
        listings = result.scalars().all()
        for listing in listings:
            await db.delete(listing)
        
        # Delete user's payments
        result = await db.execute(select(Payments).where(Payments.user_id == user_id))
        payments = result.scalars().all()
        for payment in payments:
            await db.delete(payment)
        
        # Delete user's profile
        result = await db.execute(select(Profiles).where(Profiles.user_id == user_id))
        profile = result.scalar_one_or_none()
        if profile:
            await db.delete(profile)
        
        # Delete user
        await db.delete(user)
        await db.commit()
        
        return {"message": "Usuário excluído com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Delete user error: {e}")
        raise HTTPException(status_code=500, detail=str(e))