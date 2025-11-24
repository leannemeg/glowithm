from fastapi import APIRouter, File, UploadFile, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.skin_predictor import predict_skin
from app.schemas.predict import PredictResponse
from app.crud.ingredient import ingredients_for_skin_grouped
from app.utils.image_validator import validate_image

router = APIRouter(prefix="/predict")

@router.post("", response_model=PredictResponse)
async def predict_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    img_bytes = await file.read()
    
    validate_image(img_bytes)
    pred = predict_skin(img_bytes)

    skin = pred["prediction"]
    recs_grouped, avoid_grouped = ingredients_for_skin_grouped(db, skin)

    return {
        "skin_type": skin,
        "confidence": pred["confidence"],
        "confidence_display": pred["confidence_display"],
        "all_predictions": pred["all_predictions"],
        "recommended": recs_grouped,
        "avoided": avoid_grouped,
    }
