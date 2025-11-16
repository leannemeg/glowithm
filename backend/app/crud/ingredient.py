from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.ingredient import Ingredient as IngredientModel  # ORM model
from app.schemas.ingredient import IngredientCreate  # Pydantic schemas


def search_ingredients(db: Session, query: str):
    return (
        db.query(IngredientModel)
        .filter(
            or_(
                IngredientModel.name.ilike(f"%{query}%"),
                IngredientModel.also_called.ilike(f"%{query}%"),
            )
        )
        .all()
    )


def get_ingredient_by_slug(db: Session, slug: str):
    return db.query(IngredientModel).filter(IngredientModel.slug == slug).first()


def create_or_update_ingredient(db: Session, ing: IngredientCreate):
    obj = db.query(IngredientModel).filter(IngredientModel.slug == ing.slug).first()
    if obj:
        # update fields
        for k, v in ing.model_dump().items():
            setattr(obj, k, v)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj
    db_obj = IngredientModel(**ing.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def list_ingredients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(IngredientModel).offset(skip).limit(limit).all()


def ingredients_for_skin(db: Session, skin: str):
    recs = (
        db.query(IngredientModel)
        .filter(IngredientModel.recommended_for.contains([skin]))
        .all()
    )
    avoided = (
        db.query(IngredientModel)
        .filter(IngredientModel.avoided_for.contains([skin]))
        .all()
    )
    return recs, avoided


def ingredients_for_skin_grouped(db: Session, skin: str):
    recs, avoided = ingredients_for_skin(db, skin)

    def group_by_category(items):
        buckets = {}
        for it in items:
            cats = it.categories or ["Uncategorized"]
            for c in cats:
                buckets.setdefault(c, []).append(it)
        return buckets

    return group_by_category(recs), group_by_category(avoided)
