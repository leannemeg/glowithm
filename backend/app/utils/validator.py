from fastapi import HTTPException
from app.utils.io_utils import read_image_from_bytes, pil_bytes_from_cv2, resolution_wh
from app.utils.assess import assess_all
from app.utils.fixes import (
    apply_clahe,
    reduce_highlights,
    unsharp_mask,
    upscale_bicubic_to_min,
    denoise_fastnlmeans,
)
from app.utils.detect import detect_single_face
from app.utils.constants import (
    MIN_BORDERLINE_RES,
    MIN_RESOLUTION,
    MAX_ALLOWED_RES,
    ALLOWED_FORMATS,
)
from PIL import Image
from io import BytesIO
import cv2
import base64


def validate_and_fix_image(image_bytes: bytes) -> tuple[bytes, bool, str | None]:
    """
    Main pipeline that:
    1. Reads image
    2. Validates format
    3. Validates and adjusts resolution
    4. Ensures face is detected
    5. Assesses image quality (brightness, sharpness, noise, etc.)
    6. Fixes borderline-quality issues
    7. Returns (improved image bytes for model, was_enhanced flag, enhanced_image_base64)
    """

    # Decode PIL (to detect format and verify file integrity)
    try:
        pil = Image.open(BytesIO(image_bytes))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image unreadable: {e}")

    fmt = (pil.format or "").upper()
    if fmt not in ALLOWED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format: {pil.format}. Allowed: JPG/JPEG, PNG",
        )

    # Reject true grayscale images (PIL modes 'L' or 'LA')
    if pil.mode in ("L", "LA"):
        raise HTTPException(
            status_code=400,
            detail="Grayscale images are not supported. Refrain from uploading with grayscale or filters applied.",
        )

    # Decode CV2 for algorithm-based processing
    try:
        img = read_image_from_bytes(image_bytes)
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to decode image bytes")

    # Downscale huge images by scaling down proportionally
    w, h = resolution_wh(img)
    if max(w, h) > MAX_ALLOWED_RES:
        scale = MAX_ALLOWED_RES / float(max(w, h))
        img = cv2.resize(
            img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA
        )

    """
    Face detection
    If no face → reject
    If >1 face → reject (only 1 allowed)
    Upscale borderline-res images before rejecting
    """
    face_found, faces = detect_single_face(img, allow_upscale=True)
    if not face_found:
        min_dim = min(resolution_wh(img))
        # Check if image is ALSO too small → definitely reject
        if min_dim < MIN_BORDERLINE_RES:
            raise HTTPException(
                status_code=400,
                detail=f"No face detected and image resolution too low ({w}x{h})",
            )
        # Face missing but resolution borderline or fine → still reject
        raise HTTPException(
            status_code=400,
            detail="No face detected. Please upload single, clear face.",
        )

    if len(faces) > 1:
        raise HTTPException(
            status_code=400,
            detail="Multiple faces detected. Please upload a single face.",
        )

    # Assess using brightness, contrast, sharpness, noise, exposure, resolution metrics
    metrics = assess_all(img)

    # Check if severe issues exist → reject
    severe = [
        k
        for k, v in metrics.items()
        if isinstance(v.get("status"), str) and v.get("status").startswith("severe")
    ]

    if severe:
        keys = ", ".join(severe)
        raise HTTPException(
            status_code=400,
            detail=f"Severe image issues: {keys}. Cannot perform enhancements. Please retake or choose a different photo.",
        )

    # Apply borderline fixes / auto-enhancements
    borderline_keys = [k for k, v in metrics.items() if v.get("status") == "borderline"]

    img_fixed = img.copy()
    was_enhanced = bool(borderline_keys)

    if borderline_keys:
        # Borderline resolution → upscale to meet minimum requirement
        if metrics["resolution"]["status"] == "borderline":
            img_fixed = upscale_bicubic_to_min(img_fixed, MIN_RESOLUTION)

        # Borderline brightness/contrast/exposure → apply CLAHE
        if (
            metrics["brightness"]["status"] == "borderline"
            or metrics["contrast"]["status"] == "borderline"
            or metrics["exposure"]["status"] == "borderline"
        ):
            img_fixed = apply_clahe(img_fixed)

        # Overexposed areas → tone down highlights
        if metrics["overexposed_pct"]["status"] == "borderline":
            img_fixed = reduce_highlights(img_fixed)

        # Borderline noise/sharpness → denoise and sharpen
        if metrics["noise"]["status"] == "borderline":
            img_fixed = denoise_fastnlmeans(img_fixed)

        # Borderline sharpness → unsharp mask
        if metrics["sharpness"]["status"] == "borderline":
            img_fixed = unsharp_mask(img_fixed)

    # Ensure enhanced image still meets min resolution
    w2, h2 = resolution_wh(img_fixed)
    if min(w2, h2) < MIN_BORDERLINE_RES:
        raise HTTPException(
            status_code=400, detail=f"Image too small after fixes ({w2}x{h2})."
        )

    # Return bytes as JPEG to be passed to model
    processed_bytes = pil_bytes_from_cv2(img_fixed, fmt="JPEG", quality=92)

    # If enhanced, also return base64 version for frontend display
    enhanced_image_base64 = None
    if was_enhanced:
        enhanced_image_base64 = base64.b64encode(processed_bytes).decode("utf-8")

    return processed_bytes, was_enhanced, enhanced_image_base64
