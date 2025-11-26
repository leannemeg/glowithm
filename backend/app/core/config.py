# core/config.py
import os

MODEL_PATH = os.getenv("MODEL_PATH", "models/best_model.keras")
IMG_SIZE = int(os.getenv("IMG_SIZE", 384))
LABELS = ["dry", "normal", "oily"]