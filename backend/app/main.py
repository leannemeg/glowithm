from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from . import database, models, schemas, crud, predict

# create DB tables if not existing
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SkinType Ingredient API")

@app.post("/predict", response_model=schemas.PredictResponse)
async def predict_endpoint(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    img_bytes = await file.read()
    pred, err = predict.predict_skin(img_bytes)
    if err:
        raise HTTPException(status_code=400, detail=err)

    skin = pred["prediction"]
    recs_grouped, avoid_grouped = crud.ingredients_for_skin_grouped(db, skin)

    return {
        "skin_type": skin,
        "confidence": pred["confidence"],
        "confidence_display": pred["confidence_display"],
        "all_predictions": pred["all_predictions"],
        "recommended": recs_grouped,
        "avoided": avoid_grouped,
    }

@app.get("/ingredients/{slug}", response_model=schemas.IngredientRead)
def get_ingredient(slug: str, db: Session = Depends(database.get_db)):
    ing = crud.get_ingredient_by_slug(db, slug)
    if not ing:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return ing

@app.post("/ingredients/import-json")
def import_json(payload: List[schemas.IngredientCreate], db: Session = Depends(database.get_db)):
    # expects a JSON array body with existing ingredients (slug,name,categories,recommended_for,avoided_for,description,...)
    created = []
    for item in payload:
        created.append(crud.create_or_update_ingredient(db, item))
    return {"imported": len(created)}

@app.get("/ingredients/search", response_model=List[schemas.IngredientRead])
def search_ingredients(q: str = Query(..., description="Search ingredients by name"), db: Session = Depends(database.get_db)):
    results = crud.search_ingredients(db, q)
    return results
