import cv2
import numpy as np
from PIL import Image
from io import BytesIO
from fastapi import HTTPException

MIN_RESOLUTION = 512
BLUR_THRESHOLD = 70
BRIGHTNESS_MIN = 60
BRIGHTNESS_MAX = 190

# Load OpenCV's pre-trained face detection model (Haar cascade)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

ALLOWED_FORMATS = ["JPEG", "PNG"]

def validate_image(image_bytes: bytes):
    """
    Validate the uploaded image:
    1. Correct format (JPEG/PNG)
    2. Contains at least one face
    3. Not too blurry
    4. Brightness within acceptable range
    5. Resolution above minimum threshold
    """
    # open image with PIL
    try:
        img = Image.open(BytesIO(image_bytes))
        img_format = img.format
        if img_format not in ALLOWED_FORMATS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image format: {img_format}. Only JPG/JPEG and PNG are allowed."
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image unreadable: {e}")

    # convert to OpenCV format
    img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)

    # detect faces
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=8,
        minSize=(150, 150)
    )
    if len(faces) == 0:
        raise HTTPException(status_code=400, detail="No face detected in the image.")
    if len(faces) > 1:
        raise HTTPException(status_code=400, detail="Multiple faces detected in the image. Please upload an image with a single face.")

    # check blur
    blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
    if blur_score < BLUR_THRESHOLD:
        raise HTTPException(status_code=400, detail=f"Image too blurry (score={blur_score:.1f}). Retake photo.")

    # check brightness
    brightness = np.mean(gray)
    if brightness < BRIGHTNESS_MIN:
        raise HTTPException(status_code=400, detail="Image too dark. Increase lighting and try again.")
    if brightness > BRIGHTNESS_MAX:
        raise HTTPException(status_code=400, detail="Image too bright. Reduce lighting or exposure.")

    # check resolution
    h, w = img_cv.shape[:2]
    if h < MIN_RESOLUTION or w < MIN_RESOLUTION:
        raise HTTPException(status_code=400, detail=f"Image resolution too low ({w}x{h}). Minimum: {MIN_RESOLUTION}x{MIN_RESOLUTION}\nRecommended: 712x712 and above.")

    return True
