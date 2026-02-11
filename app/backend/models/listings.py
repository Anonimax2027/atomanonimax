from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from core.database import Base

class Listings(Base):
    __tablename__ = "listings"

    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    anonimax_id = Column(String(20), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    state = Column(String(2), nullable=True)
    status = Column(String(20), default="pending")  # pending, active, rejected, expired
    payment_status = Column(String(20), default="pending")  # pending, verified, rejected
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    expires_at = Column(DateTime, nullable=True)