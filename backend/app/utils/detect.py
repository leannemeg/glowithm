import cv2
from app.utils.constants import MIN_RESOLUTION, MIN_BORDERLINE_RES
from app.utils.io_utils import resolution_wh

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

def detect_single_face(img, allow_upscale=True):
    """
    Convert img to grayscale and detect faces using Haar Cascade.
    If no faces found, and allow_upscale is True, attempt to upscale borderline images and detect again.
    """
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=8, minSize=(150,150))
    if len(faces)>0:
        return True, faces

    # Attempt upscale for borderline
    w,h = resolution_wh(img)
    min_dim = min(w,h)
    if allow_upscale and min_dim < MIN_RESOLUTION and min_dim >= MIN_BORDERLINE_RES:
        scale = MIN_RESOLUTION/float(min_dim)
        img2 = cv2.resize(img, (int(w*scale), int(h*scale)), interpolation=cv2.INTER_CUBIC)
        gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
        faces2 = face_cascade.detectMultiScale(gray2, scaleFactor=1.1, minNeighbors=8, minSize=(150,150))
        if len(faces2)>0:
            return True, faces2
    return False, ()
