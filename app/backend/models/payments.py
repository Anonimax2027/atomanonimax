from core.database import Base
from sqlalchemy import Column, Float, Integer, String


class Payments(Base):
    __tablename__ = "payments"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    plan_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    crypto_type = Column(String, nullable=True)
    tx_hash = Column(String, nullable=True)
    status = Column(String, nullable=False)
    created_at = Column(String, nullable=True)