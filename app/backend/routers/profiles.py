import logging
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List

from core.database import get_db
from models.users import Users
from models.profiles import Profiles, Favorites

router = APIRouter(prefix="/api/v1/profiles", tags=["profiles"])

class ProfileUpdate(BaseModel):
    session_id: Optional[str] = None
    crypto_type: Optional[str] = None
    crypto_network: Optional[str] = None
    crypto_address: Optional[str] = None
    state: Optional[str] = None
    description: Optional[str] = None

class FavoriteCreate(BaseModel):
    target_anonimax_id: str
    custom_name: Optional[str] = None
    custom_description: Optional[str] = None

async def get_user_by_token(token: str, db: AsyncSession) -> Users:
    """Simple token validation - in production use proper JWT"""
    # For demo, we'll look up user by a simple mechanism
    # In real app, decode JWT and get user_id
    result = await db.execute(select(Users).limit(1))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="Não autorizado")
    return user

@router.get("/me")
async def get_my_profile(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Get current user's profile"""
    try:
        # In production, decode token to get user_id
        # For demo, we'll use email from token (simplified)
        result = await db.execute(select(Users))
        users = result.scalars().all()
        
        if not users:
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        # Get the first user for demo (in production, decode JWT)
        user = users[0]
        
        result = await db.execute(select(Profiles).where(Profiles.user_id == user.id))
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Perfil não encontrado")
        
        return {
            "id": profile.id,
            "anonimax_id": profile.anonimax_id,
            "session_id": profile.session_id,
            "crypto_type": profile.crypto_type,
            "crypto_network": profile.crypto_network,
            "crypto_address": profile.crypto_address,
            "state": profile.state,
            "description": profile.description,
            "created_at": profile.created_at,
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Get profile error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/me")
async def update_my_profile(
    data: ProfileUpdate,
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Update current user's profile"""
    try:
        result = await db.execute(select(Users))
        users = result.scalars().all()
        
        if not users:
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        user = users[0]
        
        result = await db.execute(select(Profiles).where(Profiles.user_id == user.id))
        profile = result.scalar_one_or_none()
        
        if not profile:
            raise HTTPException(status_code=404, detail="Perfil não encontrado")
        
        # Update fields
        if data.session_id is not None:
            profile.session_id = data.session_id
        if data.crypto_type is not None:
            profile.crypto_type = data.crypto_type
        if data.crypto_network is not None:
            profile.crypto_network = data.crypto_network
        if data.crypto_address is not None:
            profile.crypto_address = data.crypto_address
        if data.state is not None:
            profile.state = data.state
        if data.description is not None:
            if len(data.description) > 1000:
                raise HTTPException(status_code=400, detail="Descrição muito longa (máx 1000 caracteres)")
            profile.description = data.description
        
        profile.updated_at = datetime.now()
        await db.commit()
        
        return {"message": "Perfil atualizado com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Update profile error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_profiles(
    token: str,
    state: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all profiles with optional filters"""
    try:
        query = select(Profiles).where(Profiles.session_id.isnot(None))
        
        if state:
            query = query.where(Profiles.state == state)
        
        result = await db.execute(query.order_by(Profiles.created_at.desc()).limit(100))
        profiles = result.scalars().all()
        
        # Filter by search if provided
        if search:
            search_lower = search.lower()
            profiles = [
                p for p in profiles
                if search_lower in (p.anonimax_id or "").lower()
                or search_lower in (p.description or "").lower()
            ]
        
        return {
            "profiles": [
                {
                    "id": p.id,
                    "anonimax_id": p.anonimax_id,
                    "session_id": p.session_id,
                    "crypto_type": p.crypto_type,
                    "crypto_network": p.crypto_network,
                    "crypto_address": p.crypto_address,
                    "state": p.state,
                    "description": p.description,
                    "created_at": p.created_at,
                }
                for p in profiles
            ]
        }
    except Exception as e:
        logging.error(f"List profiles error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/favorites")
async def add_favorite(
    data: FavoriteCreate,
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Add a profile to favorites"""
    try:
        result = await db.execute(select(Users))
        users = result.scalars().all()
        
        if not users:
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        user = users[0]
        
        # Check if already favorited
        result = await db.execute(
            select(Favorites).where(
                Favorites.user_id == user.id,
                Favorites.target_anonimax_id == data.target_anonimax_id
            )
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            raise HTTPException(status_code=400, detail="Perfil já está nos favoritos")
        
        favorite = Favorites(
            id=str(uuid.uuid4()),
            user_id=user.id,
            target_anonimax_id=data.target_anonimax_id,
            custom_name=data.custom_name,
            custom_description=data.custom_description,
            created_at=datetime.now(),
        )
        db.add(favorite)
        await db.commit()
        
        return {"message": "Adicionado aos favoritos"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Add favorite error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/favorites/list")
async def list_favorites(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """List user's favorites"""
    try:
        result = await db.execute(select(Users))
        users = result.scalars().all()
        
        if not users:
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        user = users[0]
        
        result = await db.execute(
            select(Favorites).where(Favorites.user_id == user.id).order_by(Favorites.created_at.desc())
        )
        favorites = result.scalars().all()
        
        # Get profiles for each favorite
        favorites_with_profiles = []
        for fav in favorites:
            result = await db.execute(
                select(Profiles).where(Profiles.anonimax_id == fav.target_anonimax_id)
            )
            profile = result.scalar_one_or_none()
            
            favorites_with_profiles.append({
                "id": fav.id,
                "target_anonimax_id": fav.target_anonimax_id,
                "custom_name": fav.custom_name,
                "custom_description": fav.custom_description,
                "created_at": fav.created_at,
                "profile": {
                    "session_id": profile.session_id if profile else None,
                    "state": profile.state if profile else None,
                } if profile else None,
            })
        
        return {"favorites": favorites_with_profiles}
    except Exception as e:
        logging.error(f"List favorites error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/favorites/{favorite_id}")
async def remove_favorite(
    favorite_id: str,
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Remove a favorite"""
    try:
        result = await db.execute(select(Users))
        users = result.scalars().all()
        
        if not users:
            raise HTTPException(status_code=401, detail="Não autorizado")
        
        user = users[0]
        
        result = await db.execute(
            select(Favorites).where(Favorites.id == favorite_id, Favorites.user_id == user.id)
        )
        favorite = result.scalar_one_or_none()
        
        if not favorite:
            raise HTTPException(status_code=404, detail="Favorito não encontrado")
        
        await db.delete(favorite)
        await db.commit()
        
        return {"message": "Removido dos favoritos"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Remove favorite error: {e}")
        raise HTTPException(status_code=500, detail=str(e))