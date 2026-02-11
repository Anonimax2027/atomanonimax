from core.database import Base
from sqlalchemy import Column, Integer, String


class Subscriptions(Base):
    __tablename__ = "subscriptions"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    user_id = Column(String, nullable=False)
    plan_type = Column(String, nullable=False)
    single_credits = Column(Integer, nullable=True)
    monthly_posts_today = Column(Integer, nullable=True)
    monthly_expires_at = Column(String, nullable=True)
    last_post_date = Column(String, nullable=True)
    created_at = Column(String, nullable=True)
    updated_at = Column(String, nullable=True)