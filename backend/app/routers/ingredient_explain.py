from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.ingredient_explanation import IngredientExplainRequest, IngredientExplainResponse
from app.models.ingredient_explanation import IngredientExplanation
from app.database import get_db
from google import genai

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])

client = genai.Client()

@router.post("/explain", response_model=IngredientExplainResponse)
async def explain_ingredient(req: IngredientExplainRequest, db: Session = Depends(get_db)):
    ingredient_name = req.ingredient.strip().lower()

    # check DB first
    record = db.query(IngredientExplanation).filter_by(name=ingredient_name).first()
    if record:
        return IngredientExplainResponse(
            ingredient=record.name,
            explanation=record.explanation,
            is_verified=record.is_verified
        )

    # if not found then ask Gemini
    prompt = (
        f"Explain the skincare ingredient '{ingredient_name}' in simple beginner-friendly terms. "
        "Keep it short, easy to understand, and factual."
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    explanation_text = response.text.strip()

    # save to DB as unverified
    new_record = IngredientExplanation(
        name=ingredient_name,
        explanation=explanation_text,
        is_verified=False
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return IngredientExplainResponse(
        ingredient=new_record.name,
        explanation=new_record.explanation,
        is_verified=new_record.is_verified
    )
