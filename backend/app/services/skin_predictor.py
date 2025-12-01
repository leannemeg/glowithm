import os
os.environ["TF_XLA_FLAGS"] = "--tf_xla_auto_jit=0"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import io
import numpy as np
from PIL import Image
import tensorflow as tf
from keras.applications.mobilenet_v2 import preprocess_input
from ..core.config import MODEL_PATH, IMG_SIZE, LABELS

# load model once
model = tf.keras.models.load_model(MODEL_PATH)

def preprocess_image(image_bytes: bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))
    arr = preprocess_input(np.array(img).astype("float32"))
    return np.expand_dims(arr, 0)

def predict_skin(image_bytes: bytes):
    arr = preprocess_image(image_bytes)
    preds = model.predict(arr)[0]
    top_idx = int(np.argmax(preds))
    
    response = {
        "prediction": LABELS[top_idx],
        "confidence": float(preds[top_idx]),  # raw probability
        "confidence_display": f"{preds[top_idx]*100:.1f}%",
        "all_predictions": [
            {
                "label": l,
                "confidence": float(p),
                "confidence_display": f"{p*100:.1f}%"
            } for l, p in zip(LABELS, preds)
        ]
    }
    
    # Clean up
    del arr
    del preds

    return response