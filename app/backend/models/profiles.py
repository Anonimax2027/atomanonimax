from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from core.database import Base

class Profiles(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    anonimax_id = Column(String(20), nullable=False, index=True)
    session_id = Column(String(100), nullable=True)
    crypto_type = Column(String(20), nullable=True)
    crypto_network = Column(String(50), nullable=True)
    crypto_address = Column(String(255), nullable=True)
    state = Column(String(2), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)


class Favorites(Base):
    __tablename__ = "favorites"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    target_anonimax_id = Column(String(20), nullable=False, index=True)
    custom_name = Column(String(100), nullable=True)
    custom_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.now)