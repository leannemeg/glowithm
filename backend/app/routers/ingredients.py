from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.schemas.ingredient import IngredientCreate, IngredientRead
from app.crud.ingredient import (
    get_ingredient_by_slug,
    create_or_update_ingredient,
    search_ingredients
)

router = APIRouter(prefix="/ingredients")

@router.get("/{slug}", response_model=IngredientRead)
def get_ingredient(slug: str, db: Session = Depends(get_db)):
    ing = get_ingredient_by_slug(db, slug)
    if not ing:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return ing

@router.post("/import-json")
def import_json(payload: List[IngredientCreate], db: Session = Depends(get_db)):
    cnt = 0
    for item in payload:
        create_or_update_ingredient(db, item)
        cnt += 1
    return {"imported": cnt}

@router.get("/search", response_model=List[IngredientRead])
def ingredient_search(q: str = Query(...), db: Session = Depends(get_db)):
    return search_ingredients(db, q)
