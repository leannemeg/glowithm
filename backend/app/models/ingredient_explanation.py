from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class IngredientExplanation(Base):
    __tablename__ = "ingredient_explanations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    explanation = Column(String)
    is_verified = Column(Boolean, default=False)
