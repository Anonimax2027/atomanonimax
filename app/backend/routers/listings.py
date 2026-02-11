import logging
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import re

from core.database import get_db
from models.users import Users
from models.profiles import Profiles
from models.listings import Listings
from models.payments import Payments

router = APIRouter(prefix="/api/v1/listings", tags=["listings"])

# Personal info patterns to detect
PERSONAL_INFO_PATTERNS = [
    (r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', 'Email detectado'),
    (r'(\+55\s?)?(\(?\d{2}\)?[\s.-]?)?\d{4,5}[\s.-]?\d{4}', 'Telefone detectado'),
    (r'whatsapp|wpp|zap|whats', 'WhatsApp detectado'),
    (r'\d{3}\.?\d{3}\.?\d{3}-?\d{2}', 'CPF detectado'),
]

def check_personal_info(text: str) -> list:
    """Check for personal information in text"""
    issues = []
    for pattern, message in PERSONAL_INFO_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            issues.append(message)
    return issues

class ListingCreate(BaseModel):
    title: str
    content: str
    category: str
    state: Optional[str] = None

class PaymentSubmit(BaseModel):
    listing_id: str
    tx_hash: str

@router.post("/create")
async def create_listing(
    data: ListingCreate,
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Create a new listing"""
    try:
        result = await db.execute(select(Users))
        users = result.scalars().all()
        
        if not users:
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        user = users[0]
        
        # Validate title
        if len(data.title) < 5:
            raise HTTPException(status_code=400, detail="Título muito curto (mín 5 caracteres)")
        if len(data.title) > 200:
            raise HTTPException(status_code=400, detail="Título muito longo (máx 200 caracteres)")
        
        # Validate content
        if len(data.content) < 20:
            raise HTTPException(status_code=400, detail="Descrição muito curta (mín 20 caracteres)")
        if len(data.content) > 5000:
            raise HTTPException(status_code=400, detail="Descrição muito longa (máx 5000 caracteres)")
        
        # Check for personal info
        title_issues = check_personal_info(data.title)
        content_issues = check_personal_info(data.content)
        all_issues = title_issues + content_issues
        
        if all_issues:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Informações pessoais detectadas",
                    "issues": all_issues
                }
            )
        
        # Get user's profile for anonimax_id
        result = await db.execute(select(Profiles).where(Profiles.user_id == user.id))
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=400, detail="Perfil não encontrado")
        
        # Create listing
        listing_id = str(uuid.uuid4())
        listing = Listings(
            id=listing_id,
            user_id=user.id,
            anonimax_id=profile.anonimax_id,
            title=data.title,
            content=data.content,
            category=data.category,
            state=data.state,
            status="pending",
            payment_status="pending",
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        db.add(listing)
        
        # Create payment record
        payment = Payments(
            id=str(uuid.uuid4()),
            user_id=user.id,
            anonimax_id=profile.anonimax_id,
            listing_id=listing_id,
            amount=10.0,
            currency="BRZ",
            network="Polygon",
            type="listing",
            status="pending",
            created_at=datetime.now(),
        )
        db.add(payment)
        
        await db.commit()
        await db.refresh(listing)
        
        return {
            "id": listing.id,
            "anonimax_id": listing.anonimax_id,
            "title": listing.title,
            "status": listing.status,
            "payment_status": listing.payment_status,
            "message": "Anúncio criado! Aguardando pagamento.",
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Create listing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_listings(
    token: str,
    state: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List active listings"""
    try:
        query = select(Listings).where(Listings.status == "active")
        
        if state:
            query = query.where(Listings.state == state)
        if category:
            query = query.where(Listings.category == category)
        
        result = await db.execute(query.order_by(Listings.created_at.desc()).limit(100))
        listings = result.scalars().all()
        
        # Filter by search if provided
        if search:
            search_lower = search.lower()
            listings = [
                l for l in listings
                if search_lower in (l.title or "").lower()
                or search_lower in (l.content or "").lower()
            ]
        
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
                    "created_at": l.created_at,
                }
                for l in listings
            ]
        }
    except Exception as e:
        logging.error(f"List listings error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-listings")
async def get_my_listings(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Get current user's listings"""
    try:
        result = await db.execute(select(Users))
        users = result.scalars().all()
        
        if not users:
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        user = users[0]
        
        result = await db.execute(
            select(Listings).where(Listings.user_id == user.id).order_by(Listings.created_at.desc())
        )
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
    except Exception as e:
        logging.error(f"Get my listings error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{listing_id}")
async def get_listing(
    listing_id: str,
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Get listing details with author profile"""
    try:
        result = await db.execute(select(Listings).where(Listings.id == listing_id))
        listing = result.scalar_one_or_none()
        
        if not listing:
            raise HTTPException(status_code=404, detail="Anúncio não encontrado")
        
        # Get author's profile
        result = await db.execute(select(Profiles).where(Profiles.anonimax_id == listing.anonimax_id))
        profile = result.scalar_one_or_none()
        
        return {
            "listing": {
                "id": listing.id,
                "anonimax_id": listing.anonimax_id,
                "title": listing.title,
                "content": listing.content,
                "category": listing.category,
                "state": listing.state,
                "status": listing.status,
                "created_at": listing.created_at,
            },
            "profile": {
                "session_id": profile.session_id if profile else None,
                "crypto_type": profile.crypto_type if profile else None,
                "crypto_network": profile.crypto_network if profile else None,
                "crypto_address": profile.crypto_address if profile else None,
            } if profile else None,
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Get listing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/submit-payment")
async def submit_payment(
    data: PaymentSubmit,
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Submit payment proof for a listing"""
    try:
        result = await db.execute(select(Users))
        users = result.scalars().all()
        
        if not users:
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        user = users[0]
        
        # Find the payment record
        result = await db.execute(
            select(Payments).where(
                Payments.listing_id == data.listing_id,
                Payments.user_id == user.id
            )
        )
        payment = result.scalar_one_or_none()
        
        if not payment:
            raise HTTPException(status_code=404, detail="Pagamento não encontrado")
        
        payment.tx_hash = data.tx_hash
        payment.updated_at = datetime.now()
        
        await db.commit()
        
        return {"message": "Comprovante enviado! Aguarde verificação."}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Submit payment error: {e}")
        raise HTTPException(status_code=500, detail=str(e))