import cv2
import numpy as np
from PIL import Image
from io import BytesIO

# Read and write images to be compatible with CV2 and PIL
def read_image_from_bytes(file_bytes: bytes) -> np.ndarray:
    arr = np.frombuffer(file_bytes, np.uint8)       # Take bytes and return CV2 image
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)       # Convert to numpy array
    if img is None:
        raise ValueError("Failed to decode image bytes")
    return img

# Take CV2 image and return PIL bytes
def pil_bytes_from_cv2(img_cv: np.ndarray, fmt="JPEG", quality=90) -> bytes:
    img_rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)       
    pil = Image.fromarray(img_rgb)
    buf = BytesIO()
    pil.save(buf, format=fmt, quality=quality)              # Save PIL image to bytes
    return buf.getvalue()

# Get image resolution (width, height) of CV2 image
def resolution_wh(img: np.ndarray) -> tuple:
    h, w = img.shape[:2]
    return w, h