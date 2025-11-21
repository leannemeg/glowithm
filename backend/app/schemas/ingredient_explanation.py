from pydantic import BaseModel

class IngredientExplainRequest(BaseModel):
    ingredient: str

class IngredientExplainResponse(BaseModel):
    ingredient: str
    explanation: str
    is_verified: bool
