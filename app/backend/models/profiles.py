from core.database import Base
from sqlalchemy import Boolean, Column, DateTime, Integer, String


class Profiles(Base):
    __tablename__ = "profiles"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    anonimax_id = Column(String, nullable=False)
    session_id = Column(String, nullable=True)
    crypto_address = Column(String, nullable=True)
    crypto_type = Column(String, nullable=True)
    city = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)