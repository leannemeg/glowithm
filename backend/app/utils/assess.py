from .metrics import brightness_gray, contrast_std, exposure_percentiles, sharpness_laplacian, noise_estimate
from app.utils.constants import *

def classify_brightness(v):
    if v < BRIGHTNESS_MIN_BORDERLINE: return "severe_low"
    if v < BRIGHTNESS_MIN_GOOD: return "borderline"
    if v > BRIGHTNESS_MAX_BORDERLINE: return "severe_high"
    if v > BRIGHTNESS_MAX_GOOD: return "borderline"
    return "good"

def classify_contrast(v):
    if v < CONTRAST_MIN_BORDERLINE: return "severe_low"
    if v < CONTRAST_MIN_GOOD: return "borderline"
    if v > CONTRAST_MAX_BORDERLINE: return "severe_high"
    if v > CONTRAST_MAX_GOOD: return "borderline"
    return "good"

def classify_sharpness(v):
    if v < SHARPNESS_SEVERE: return "severe_low"
    if v < SHARPNESS_BORDERLINE: return "borderline"
    if v < SHARPNESS_GOOD: return "borderline"
    return "good"

def classify_noise(v):
    if v > NOISE_SEVERE: return "severe_high"
    if v > NOISE_MAX_BORDERLINE: return "borderline"
    if v > NOISE_MAX_GOOD: return "borderline"
    return "good"

def classify_resolution(min_dim):
    if min_dim < MIN_BORDERLINE_RES: return "severe_low"
    if min_dim < MIN_RESOLUTION: return "borderline"
    return "good"

def assess_all(img):
    w, h = img.shape[1], img.shape[0]
    br = brightness_gray(img)
    ct = contrast_std(img)
    under_pct, over_pct = exposure_percentiles(img)
    sh = sharpness_laplacian(img)
    ns = noise_estimate(img)

    metrics = {
        "resolution": {
            "width": w, 
            "height": h, 
            "min_dim": min(w,h), 
            "status": classify_resolution(min(w,h))
        },
        
        "brightness": {
            "value": br, 
            "status": classify_brightness(br)
        },
        
        "contrast": {
            "value": ct, 
            "status": classify_contrast(ct)
        },
        
        "underexposed_pct": {
            "value": under_pct, 
            "status": (
                "severe" if under_pct >= EXPOSURE_SEVERE_PCT 
                 else "borderline" if under_pct >= EXPOSURE_BORDERLINE_PCT 
                 else "good"
            )
        },
        
        "overexposed_pct": {
            "value": over_pct, 
            "status": (
                "severe" if over_pct >= EXPOSURE_SEVERE_PCT 
                else "borderline" if over_pct >= EXPOSURE_BORDERLINE_PCT 
                else "good"
            )
        },
        
        "exposure": {
            "value": (under_pct, over_pct), 
            "status": (
                "severe" if under_pct >= EXPOSURE_SEVERE_PCT or over_pct >= EXPOSURE_SEVERE_PCT 
                else "borderline" if under_pct >= EXPOSURE_BORDERLINE_PCT or over_pct >= EXPOSURE_BORDERLINE_PCT 
                else "good"
            )
        },
        
        "sharpness": {
            "value": sh, 
            "status": classify_sharpness(sh)
        },
        
        "noise": {
            "value": ns, 
            "status": classify_noise(ns)
        }
    }
    
    return metrics