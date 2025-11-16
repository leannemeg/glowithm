from pydantic import BaseModel
from typing import List, Dict
from .ingredient import IngredientRead

class PredictionItem(BaseModel):
    label: str
    confidence: float
    confidence_display: str

class PredictResponse(BaseModel):
    skin_type: str
    confidence: float
    confidence_display: str
    all_predictions: List[PredictionItem]
    recommended: Dict[str, List[IngredientRead]]   # grouped by category
    avoided: Dict[str, List[IngredientRead]]       # grouped by category
