# scripts/import_json.py
import os
import json
import sys
from sqlalchemy.orm import Session
sys.path.append(os.path.dirname(os.path.dirname(__file__)))  # project root

from app.database import SessionLocal, engine
from app import models, crud, schemas

# usage: python scripts/import_json.py path/to/ingredients.json
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python import_json.py path/to/ingredients.json")
        sys.exit(1)
    path = sys.argv[1]
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # create tables if not exist
    models.Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    imported = 0
    try:
        for obj in data:
            # Handle potential 'category' vs 'categories' mismatch
            if "category" in obj and "categories" not in obj:
                obj["categories"] = obj.pop("category")
            if "name" not in obj:
                obj["name"] = obj["slug"].replace("-", " ").title()
            payload = schemas.IngredientCreate(**obj)
            crud.create_or_update_ingredient(db, payload)
            imported += 1
    finally:
        db.close()
    print(f"Imported {imported} ingredients")
