from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, ForeignKey
from core.database import Base

class Payments(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    anonimax_id = Column(String(20), nullable=False, index=True)
    listing_id = Column(String(36), ForeignKey("listings.id"), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="BRZ")
    network = Column(String(50), default="Polygon")
    tx_hash = Column(String(100), nullable=True)
    type = Column(String(20), default="listing")  # listing, subscription
    status = Column(String(20), default="pending")  # pending, verified, rejected
    created_at = Column(DateTime, default=datetime.now)
    verified_at = Column(DateTime, nullable=True)