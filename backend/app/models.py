from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from .database import Base

class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)   # unique identifier
    name = Column(String, nullable=False)                            # display name
    also_called = Column(String, nullable=True)                      # alt names
    categories = Column(ARRAY(String), nullable=True)                # ["Hydrators", "Emollients"]
    recommended_for = Column(ARRAY(String), nullable=True)           # ["dry", "normal"]
    avoided_for = Column(ARRAY(String), nullable=True)               # ["oily"]
    details = Column(Text, nullable=True)                            # long description
    quickfacts = Column(ARRAY(String), nullable=True)                # list of facts in bullet form
    proof = Column(ARRAY(String), nullable=True)                     # list of URLs with more info