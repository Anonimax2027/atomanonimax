from core.database import Base
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String


class Listings(Base):
    __tablename__ = "listings"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    profile_id = Column(Integer, nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, nullable=True)
    city = Column(String, nullable=True)
    price = Column(Float, nullable=True)
    crypto_type = Column(String, nullable=True)
    tags = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), nullable=True)