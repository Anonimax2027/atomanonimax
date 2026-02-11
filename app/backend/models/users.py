from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text
from core.database import Base
import secrets
import string

def generate_anonimax_id():
    """Generate a unique Anonimax ID like ANX-XXXX-XXXX"""
    chars = string.ascii_uppercase + string.digits
    part1 = ''.join(secrets.choice(chars) for _ in range(4))
    part2 = ''.join(secrets.choice(chars) for _ in range(4))
    return f"ANX-{part1}-{part2}"

def generate_verification_token():
    """Generate a secure verification token"""
    return secrets.token_urlsafe(32)

class Users(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    anonimax_id = Column(String(20), unique=True, nullable=False, index=True)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    verification_token = Column(String(64), nullable=True)
    reset_token = Column(String(64), nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)