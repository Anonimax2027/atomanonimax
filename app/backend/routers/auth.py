import logging
import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import hashlib
import secrets

from core.database import get_db
from models.users import Users, generate_anonimax_id, generate_verification_token
from models.profiles import Profiles

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

# Simple password hashing (in production, use bcrypt)
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def generate_token() -> str:
    return secrets.token_urlsafe(32)

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyEmailRequest(BaseModel):
    token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    anonimax_id: str
    is_admin: bool
    is_verified: bool
    created_at: datetime

class AuthResponse(BaseModel):
    user: UserResponse
    token: str
    message: str

@router.post("/register", response_model=AuthResponse)
async def register(
    data: RegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Register a new user"""
    try:
        # Check if email already exists
        result = await db.execute(select(Users).where(Users.email == data.email))
        existing_user = result.scalar_one_or_none()
        
        if existing_user:
            raise HTTPException(status_code=400, detail="Este email já está cadastrado")
        
        # Validate password
        if len(data.password) < 6:
            raise HTTPException(status_code=400, detail="A senha deve ter pelo menos 6 caracteres")
        
        # Generate unique Anonimax ID
        anonimax_id = generate_anonimax_id()
        while True:
            result = await db.execute(select(Users).where(Users.anonimax_id == anonimax_id))
            if not result.scalar_one_or_none():
                break
            anonimax_id = generate_anonimax_id()
        
        # Create user
        user_id = str(uuid.uuid4())
        verification_token = generate_verification_token()
        
        user = Users(
            id=user_id,
            email=data.email,
            password_hash=hash_password(data.password),
            anonimax_id=anonimax_id,
            is_verified=False,
            is_admin=False,
            verification_token=verification_token,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        db.add(user)
        
        # Create profile
        profile = Profiles(
            id=str(uuid.uuid4()),
            user_id=user_id,
            anonimax_id=anonimax_id,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        db.add(profile)
        
        await db.commit()
        await db.refresh(user)
        
        # Generate auth token
        token = generate_token()
        
        # Get frontend host for verification link
        frontend_host = request.headers.get("App-Host", "")
        if frontend_host and not frontend_host.startswith(("http://", "https://")):
            frontend_host = f"https://{frontend_host}"
        
        verification_link = f"{frontend_host}/verify?token={verification_token}"
        logging.info(f"Verification link for {data.email}: {verification_link}")
        
        return AuthResponse(
            user=UserResponse(
                id=user.id,
                email=user.email,
                anonimax_id=user.anonimax_id,
                is_admin=user.is_admin,
                is_verified=user.is_verified,
                created_at=user.created_at,
            ),
            token=token,
            message=f"Conta criada! Verifique seu email para ativar. Seu Anonimax ID é: {anonimax_id}",
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao criar conta: {str(e)}")

@router.post("/login", response_model=AuthResponse)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """Login user"""
    try:
        result = await db.execute(select(Users).where(Users.email == data.email))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=401, detail="Email ou senha incorretos")
        
        if not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Email ou senha incorretos")
        
        token = generate_token()
        
        return AuthResponse(
            user=UserResponse(
                id=user.id,
                email=user.email,
                anonimax_id=user.anonimax_id,
                is_admin=user.is_admin,
                is_verified=user.is_verified,
                created_at=user.created_at,
            ),
            token=token,
            message="Login realizado com sucesso!",
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao fazer login: {str(e)}")

@router.post("/verify-email")
async def verify_email(
    data: VerifyEmailRequest,
    db: AsyncSession = Depends(get_db),
):
    """Verify user email"""
    try:
        result = await db.execute(select(Users).where(Users.verification_token == data.token))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=400, detail="Token de verificação inválido")
        
        if user.is_verified:
            return {"message": "Email já verificado", "success": True}
        
        user.is_verified = True
        user.verification_token = None
        user.updated_at = datetime.now()
        
        await db.commit()
        
        return {"message": "Email verificado com sucesso!", "success": True}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Verify email error: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao verificar email: {str(e)}")

@router.post("/forgot-password")
async def forgot_password(
    data: ForgotPasswordRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Request password reset"""
    try:
        result = await db.execute(select(Users).where(Users.email == data.email))
        user = result.scalar_one_or_none()
        
        # Always return success to prevent email enumeration
        if not user:
            return {"message": "Se o email existir, você receberá instruções para redefinir sua senha"}
        
        reset_token = generate_verification_token()
        user.reset_token = reset_token
        user.reset_token_expires = datetime.now() + timedelta(hours=1)
        user.updated_at = datetime.now()
        
        await db.commit()
        
        frontend_host = request.headers.get("App-Host", "")
        if frontend_host and not frontend_host.startswith(("http://", "https://")):
            frontend_host = f"https://{frontend_host}"
        
        reset_link = f"{frontend_host}/reset-password?token={reset_token}"
        logging.info(f"Reset link for {data.email}: {reset_link}")
        
        return {"message": "Se o email existir, você receberá instruções para redefinir sua senha"}
    except Exception as e:
        logging.error(f"Forgot password error: {e}")
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")

@router.post("/reset-password")
async def reset_password(
    data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    """Reset password with token"""
    try:
        result = await db.execute(select(Users).where(Users.reset_token == data.token))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=400, detail="Token inválido ou expirado")
        
        if user.reset_token_expires and user.reset_token_expires < datetime.now():
            raise HTTPException(status_code=400, detail="Token expirado")
        
        if len(data.password) < 6:
            raise HTTPException(status_code=400, detail="A senha deve ter pelo menos 6 caracteres")
        
        user.password_hash = hash_password(data.password)
        user.reset_token = None
        user.reset_token_expires = None
        user.updated_at = datetime.now()
        
        await db.commit()
        
        return {"message": "Senha redefinida com sucesso!", "success": True}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Reset password error: {e}")
        raise HTTPException(status_code=500, detail=f"Erro: {str(e)}")

@router.get("/me")
async def get_current_user(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """Get current user info (simplified - in production use proper JWT)"""
    # In a real app, decode the JWT token to get user ID
    # For this demo, we'll use a simple approach
    raise HTTPException(status_code=501, detail="Use login endpoint to get user info")