from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class IngredientBase(BaseModel):
    slug: str
    name: str
    also_called: Optional[str] = None
    categories: List[str]
    recommended_for: List[str] = Field(default_factory=list)
    avoided_for: List[str] = Field(default_factory=list)
    details: Optional[str] = None
    quickfacts: List[str] = Field(default_factory=list)
    proof: List[str] = Field(default_factory=list)

class IngredientCreate(IngredientBase):
    pass

class IngredientRead(IngredientBase):
    id: int
    model_config = ConfigDict(from_attributes=True)