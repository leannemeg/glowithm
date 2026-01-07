import cv2
import numpy as np

# Improve brightness and contrast for slightly dark or low-contrast images
def apply_clahe(img):
    """
    Convert image to LAB color space (where L is lightness, A is green-red, B is blue-yellow).
    Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) on the L channel.
    Convert back to BGR.
    """
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    l2 = clahe.apply(l)
    lab2 = cv2.merge((l2,a,b))
    return cv2.cvtColor(lab2, cv2.COLOR_LAB2BGR)

def reduce_highlights(img):
    """
    Convert the image to HSV (Hue, Saturation, Value) color space.
    Dampens pixels in the V (value/brightness) channel above 230 by 10%.
    Convert back to BGR.
    """
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
    h,s,v = cv2.split(hsv)
    v = np.where(v>230, v*0.9, v)
    hsv2 = cv2.merge((h,s,v)).astype(np.uint8)
    return cv2.cvtColor(hsv2, cv2.COLOR_HSV2BGR)

def unsharp_mask(img, kernel_size=(7,7), sigma=7.0, amount=0.8):
    """
    Blurs the image using Gaussian blur.
    Subtracts blurred image from original (addWeighted) to enhance edges.
    """
    blurred = cv2.GaussianBlur(img, kernel_size, sigma)
    return cv2.addWeighted(img, 1.0+amount, blurred, -amount, 0)
    """
    img - original image
    1.0+amount - weight of the original image
    blurred - Gaussian blurred version of the image
    -amount - weight of the blurred image to be subtracted from the original image
    0 - scalar added to each summand
    """

def upscale_bicubic_to_min(img, min_target=512):
    """
    Upscales the image using bicubic interpolation so that the low res image
    is at least min_target pixels.
    """
    h,w = img.shape[:2]
    if min(h,w) >= min_target: return img
    if w < h:
        new_w = min_target
        new_h = int(h*(min_target/float(w)))
    else:
        new_h = min_target
        new_w = int(w*(min_target/float(h)))
    return cv2.resize(img, (new_w,new_h), interpolation=cv2.INTER_CUBIC)

def denoise_fastnlmeans(img):
    return cv2.fastNlMeansDenoisingColored(img, None, h=10, hColor=10, templateWindowSize=7, searchWindowSize=21)
    """
    img - input image in BGR format
    None - output placeholder (it creates a new image)
    h - filter strength for luminance noise
    hColor - filter strength for color noise
    templateWindowSize - size of the template patch (detail sensitivity)
    searchWindowSize - size of the window used to search for similar patches (for better denoising)
    """
