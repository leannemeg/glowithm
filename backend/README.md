# Glowithm Backend

A FastAPI backend that analyzes a face photo to predict skin type (dry/normal/oily), recommends and flags skincare ingredients, and provides AI-powered ingredient explanations and chat. It uses TensorFlow/Keras for inference, PostgreSQL via SQLAlchemy for data, and Google Gemini (google-genai) for AI responses.

## Architecture

- FastAPI app: app/main.py registers routers.
- Routers:
  - app/routers/predict.py: image upload → skin prediction → grouped ingredient recommendations/avoid.
  - app/routers/ingredients.py: CRUD-like read/search + JSON import endpoint.
  - app/routers/ingredient_explain.py: AI explanation with DB caching.
  - app/routers/chat.py: AI chat.
- Services: app/services/skin_predictor.py loads a Keras model and predicts.
- Database: SQLAlchemy Declarative Base in app/database/base.py, session in app/database/session.py. Tables auto-created at startup.
- Models:
  - app/models/ingredient.py: `ingredients` table (uses PostgreSQL `ARRAY` columns).
  - app/models/ingredient_explanation.py: cached AI explanations.
- Schemas: Pydantic models in app/schemas/\*.
- Image pipeline: app/utils/validator.py validates/auto-enhances photos before inference.

## Requirements

- Python 3.11+ (tested with modern versions)
- PostgreSQL (ARRAY columns are used; SQLite is not supported)
- A trained Keras model file (default path is `models/best_model.keras`)
- Google Gemini API key for AI features (google-genai)

## Environment Variables

Create a `.env` file in `backend/` with:

- `DATABASE_URL`: PostgreSQL URL, e.g. `postgresql+psycopg2://user:password@localhost:5432/glowithm`
- `GOOGLE_API_KEY`: Gemini API key
- Optional:
  - `MODEL_PATH`: path to Keras model (defaults to `models/best_model.keras`)
  - `IMG_SIZE`: input size for the model (default `224`)

Note: If you run the app from the `backend` directory, and your model is stored at repository root `models/best_model.keras`, set `MODEL_PATH=../models/best_model.keras`.

## Setup (Windows)

```powershell
# From repository root
cd backend

# Create and activate a virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Verify env file exists
Get-Content .env
```

## Run the API

```powershell
# Inside backend virtual environment
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open Swagger UI at http://localhost:8000/docs.

## Data Model

`ingredients` table fields (see app/models/ingredient.py):

- `id`: int, PK
- `slug`: string, unique identifier
- `name`: string, display name
- `also_called`: string, optional
- `categories`: `ARRAY(String)` (e.g., `Hydrators`, `Emollients`)
- `recommended_for`: `ARRAY(String)` of skin types (e.g., `dry`, `normal`, `oily`)
- `avoided_for`: `ARRAY(String)` of skin types
- `details`: text, long description
- `quickfacts`: `ARRAY(String)` bullets
- `proof`: `ARRAY(String)` URLs

`ingredient_explanations` fields:

- `id`: int, PK
- `name`: string, unique
- `explanation`: string
- `is_verified`: boolean (AI-produced entries stored as `False` until verified)

### Image Validation Deep Dive (Plain English)

What happens when you upload a photo, step by step:

1. File type and safety

- We only accept JPG/JPEG or PNG. These are standard photo formats that our tools understand well.
- The server opens the file safely to make sure it really is an image and isn’t corrupted.

2. Size and resolution

- Extremely large photos are gently scaled down so processing is fast and consistent.
- Very small photos may not contain enough detail for reliable analysis. If a photo is borderline small, we try a careful upscale; if it is too small, we’ll ask for a new photo.

3. Single-face check

- The system looks for exactly one face. If it sees none, or more than one, it stops and asks for a different photo. This avoids mixing signals from multiple people and ensures the model focuses on one subject.
- For borderline small images, we may first upscale a bit and then re-check to avoid false negatives.

4. Quality checks (explained simply)

Each check returns one of: OK, borderline, or severe. Borderline can often be fixed automatically; severe usually requires a new photo.

- Brightness: Is the picture too dark or too bright overall?
- Contrast: Do light and dark areas have enough separation to show detail?
- Exposure/Highlights: Are there blown-out bright spots (e.g., strong glare) that hide detail?
- Sharpness (blur): Are edges clear, or is the image soft from motion/focus blur?
- Noise (grain): Is the image speckled or sandy-looking (common in very dim lighting)?
- Resolution: Is there enough pixel detail for analysis?

5. Automatic improvements for borderline photos

When issues are borderline, we apply small, targeted fixes. These are conservative and designed to preserve how you actually look:

- Balance lighting locally: We use a technique (CLAHE) that evens out brightness/contrast in small regions so dark areas aren’t too dark and bright areas aren’t too bright.
- Tame bright spots: We reduce harsh highlights so details aren’t washed out.
- Reduce grain: We gently smooth speckled noise while keeping important edges.
- Add a touch of crispness: We apply a light “unsharp mask” to restore a bit of edge clarity if the image is slightly soft.
- Meet minimum size: If needed, we upscale with a high-quality method (bicubic) to reach the minimum resolution the model needs.

6. Guardrails and results

- If any problem is severe (very dark/bright, very blurry, very noisy, or far too small), we won’t try to “fix” it—we’ll ask you to retake the photo. This avoids inventing details that aren’t there.
- After processing, we export a clean JPEG for the model. If enhancements were applied, we also send a small preview (base64) back to the app so you can see what changed.

7. What we do NOT do

- We don’t retouch skin, change skin tone, or alter facial features.
- We don’t add makeup effects or filters. Fixes are minimal and only for technical clarity.

Practical tips for a good photo

- Use soft, even lighting (facing a window in daytime works well).
- Keep the camera steady; avoid motion blur.
- Frame a single face; remove sunglasses; avoid harsh backlight or strong glare.
- Fill the frame with your face, but don’t crop too tightly—leave a bit of margin.

For developers

- Validation pipeline: [backend/app/utils/validator.py](backend/app/utils/validator.py)
- Quality metrics: [backend/app/utils/assess.py](backend/app/utils/assess.py)
- Fixes/enhancements: [backend/app/utils/fixes.py](backend/app/utils/fixes.py)
- Face detection: [backend/app/utils/detect.py](backend/app/utils/detect.py)
- Thresholds and format rules: [backend/app/utils/constants.py](backend/app/utils/constants.py)

### Technical Pipeline: Upload → `validate_and_fix_image()` → `predict_skin()`

This section describes the exact steps, parameters, and thresholds used from the moment an image is uploaded until the predictor consumes the processed bytes.

1. Decode and format validation

- PIL open: `PIL.Image.open(BytesIO(image_bytes))` used to validate integrity and read file format.
- Allowed formats: `{"JPEG", "PNG"}` from `ALLOWED_FORMATS` in [backend/app/utils/constants.py](backend/app/utils/constants.py).
- CV2 decode: `read_image_from_bytes(image_bytes)` returns BGR `numpy.ndarray` for algorithmic processing.

2. Resolution normalization

- Read size: `resolution_wh(img)` → `(width, height)`.
- Downscale large images: if `max(width, height) > MAX_ALLOWED_RES (1280)`, resize via `cv2.INTER_AREA` with proportional scale.
- Minimums: `MIN_RESOLUTION = 512`, `MIN_BORDERLINE_RES = 450` (used by face detection and resolution assessment).

3. Face detection (Haar Cascade)

- Detector: `cv2.CascadeClassifier(haarcascade_frontalface_default.xml)` over grayscale.
- Call: `detectMultiScale(gray, scaleFactor=1.1, minNeighbors=8, minSize=(150,150))`.
- Borderline assist: if no face and `allow_upscale=True`, and `MIN_BORDERLINE_RES ≤ min_dim < MIN_RESOLUTION`, upscale to meet `MIN_RESOLUTION` using bicubic (`cv2.INTER_CUBIC`) and re-detect.
- Fail-fast rules:
  - No faces → reject.
  - More than 1 face → reject.

4. Quality assessment (`assess_all(img)`) and statuses

Metrics computed (names map to functions in [backend/app/utils/metrics.py](backend/app/utils/metrics.py)):

- Brightness: `brightness_gray(img)` → classified by `BRIGHTNESS_*` thresholds.
- Contrast: `contrast_std(img)` → classified by `CONTRAST_*` thresholds.
- Exposure: `exposure_percentiles(img)` → `underexposed_pct`, `overexposed_pct` against `EXPOSURE_*` thresholds.
- Sharpness: `sharpness_laplacian(img)` → compared to `SHARPNESS_GOOD/BORDERLINE/SEVERE`.
- Noise: `noise_estimate(img)` → compared to `NOISE_MAX_GOOD/BORDERLINE/SEVERE`.
- Resolution: `min(width,height)` → `MIN_BORDERLINE_RES` and `MIN_RESOLUTION`.

Key thresholds (from constants):

- Resolution: min ≥ 512 good; 450–511 borderline; < 450 severe.
- Brightness: good in ~[70,190], borderline just outside, severe <50 or >220.
- Contrast: good ≥35 and ≤140; borderline around 25–160; severe below/above borderline.
- Noise: good ≤30, borderline ≤45, severe >60.
- Exposure percent (under/over): borderline ≥20%, severe ≥40%.
- Sharpness: good ≥100, borderline 80–99, severe <60.

Status categories per metric:

- `good`: proceed.
- `borderline`: eligible for auto-fix.
- `severe_*`: reject (no auto-fix attempted).

5. Auto-fixes for borderline only

- Borderline resolution: `upscale_bicubic_to_min(img, MIN_RESOLUTION)`.
- Brightness/contrast/exposure borderline: `apply_clahe(img)` on L-channel in LAB color space.
- Overexposed borderline: `reduce_highlights(img)` by damping HSV V-channel above ~230.
- Noise borderline: `denoise_fastnlmeans(img)` with `h=10,hColor=10,templateWindowSize=7,searchWindowSize=21`.
- Sharpness borderline: `unsharp_mask(img, kernel_size=(7,7), sigma=7.0, amount=0.8)`.

6. Post-fix validation and export

- Size guard: ensure `min(width,height) ≥ MIN_BORDERLINE_RES (450)`, else reject.
- Export for model: `pil_bytes_from_cv2(img_fixed, fmt="JPEG", quality=92)` → bytes fed to predictor.
- Frontend preview: when any fix applied, base64 encode the processed JPEG for UI display.

7. Predictor input and pre-processing

- Entry point: `predict_skin(image_bytes)` in [backend/app/services/skin_predictor.py](backend/app/services/skin_predictor.py).
- Preprocess pipeline: `PIL.Image.open(...).convert("RGB")` → `img.resize((IMG_SIZE, IMG_SIZE))` → MobileNetV2 `preprocess_input()` → `np.expand_dims(..., 0)` to shape `(1, IMG_SIZE, IMG_SIZE, 3)`.
- `IMG_SIZE` from config (default `224`); `MODEL_PATH` from env/config (default `models/best_model.keras`).
- Inference: `model.predict(arr, verbose=0)[0]`, argmax for top label, serialize confidences.
- Cleanup: `keras.backend.clear_session()` and `gc.collect()` to reduce memory pressure per request.

Failure behaviors (end-to-end):

- Format/face/severe-quality violations → HTTP 400 with a descriptive `detail` message.
- Otherwise, processed JPEG bytes reach predictor; JSON response includes `skin_type`, confidences, `was_enhanced`, and optional `enhanced_image` preview.

8. Response contract & examples

- Contract: `PredictResponse` in [backend/app/schemas/predict.py](backend/app/schemas/predict.py)

Success example

```json
{
  "skin_type": "normal",
  "confidence": 0.8743,
  "confidence_display": "87.4%",
  "all_predictions": [
    { "label": "normal", "confidence": 0.8743, "confidence_display": "87.4%" },
    { "label": "dry", "confidence": 0.0851, "confidence_display": "8.5%" },
    { "label": "oily", "confidence": 0.0406, "confidence_display": "4.1%" }
  ],
  "recommended": {
    "Hydrators": [
      {
        "slug": "hyaluronic-acid",
        "name": "Hyaluronic Acid",
        "categories": ["Hydrators"],
        "recommended_for": ["dry", "normal"],
        "avoided_for": [""],
        "details": "...",
        "quickfacts": ["..."],
        "proof": ["..."]
      }
    ]
  },
  "avoided": {
    "Strong Actives": [
      {
        "slug": "benzoyl-peroxide",
        "name": "Benzoyl Peroxide",
        "categories": ["Actives"],
        "recommended_for": ["oily"],
        "avoided_for": ["dry"],
        "details": "...",
        "quickfacts": ["..."],
        "proof": ["..."]
      }
    ]
  },
  "was_enhanced": true,
  "enhanced_image": "<base64-jpeg>"
}
```

Typical error examples

```json
{ "detail": "Unsupported format: GIF. Allowed: JPG/JPEG, PNG" }
```

```json
{ "detail": "No face detected. Please upload single, clear face." }
```

```json
{
  "detail": "Severe image issues: brightness, sharpness. Cannot perform enhancements. Please retake or choose a different photo."
}
```

## API Endpoints

Base URL: `http://localhost:8000`

- POST `/predict`

  - Form: `file` (image/jpeg or image/png)
  - Response: `PredictResponse`
    - `skin_type`: `dry|normal|oily`
    - `confidence`: float (0-1)
    - `confidence_display`: string like `87.5%`
    - `all_predictions`: list of `{label, confidence, confidence_display}`
    - `recommended`: object (category → `IngredientRead[]`)
    - `avoided`: object (category → `IngredientRead[]`)
    - `was_enhanced`: boolean
    - `enhanced_image`: base64 string | null

- GET `/ingredients/{slug}` → `IngredientRead`
- GET `/ingredients/search?q=...` → `IngredientRead[]`
- POST `/ingredients/import-json` → body: `IngredientCreate[]`, returns `{ imported: number }`
- POST `/ingredients/explain` → body: `{ ingredient: string }`, returns `{ ingredient, explanation, is_verified }`
- POST `/chat` → body: `{ message: string }`, returns `{ reply }`

## Curl Examples

```bash
# Predict
curl -X POST "http://localhost:8000/predict" \
  -H "Accept: application/json" \
  -F "file=@/path/to/photo.jpg"

# Get one ingredient
curl "http://localhost:8000/ingredients/hyaluronic-acid"

# Search ingredients
curl "http://localhost:8000/ingredients/search?q=acid"

# Import JSON (array of IngredientCreate objects)
curl -X POST "http://localhost:8000/ingredients/import-json" \
  -H "Content-Type: application/json" \
  -d @backend/ingredients.json

# Explain ingredient
curl -X POST "http://localhost:8000/ingredients/explain" \
  -H "Content-Type: application/json" \
  -d '{"ingredient":"niacinamide"}'

# Chat
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"What are good hydrators for dry skin?"}'
```

## Seeding Data

Two options:

1. Use the API endpoint:

```bash
curl -X POST "http://localhost:8000/ingredients/import-json" \
  -H "Content-Type: application/json" \
  -d @backend/ingredients.json
```

2. Run the script:

```powershell
# From repository root
cd backend
.\.venv\Scripts\Activate.ps1
python app\scripts\import_json.py ingredients.json
```

- The script auto-creates tables and handles `category`→`categories` normalization.

## Model Configuration

- Default `MODEL_PATH` is `models/best_model.keras` (see app/core/config.py).
- If running from `backend/`, set `MODEL_PATH=../models/best_model.keras` or use an absolute path.
- `IMG_SIZE` can be tuned; defaults to `224`.

## Troubleshooting

- "ARRAY type requires PostgreSQL": ensure `DATABASE_URL` points to Postgres (e.g., `postgresql+psycopg2://...`).
- "Cannot open model file": check `MODEL_PATH` and file permissions.
- Gemini errors: set `GOOGLE_API_KEY` in `.env`. Ensure outbound network access.
- Image rejected: message indicates quality issue (no face, multiple faces, severe blur/noise/exposure). Retake photo with good lighting, single face, clear focus.
- CORS (web): if you consume from a web client, add FastAPI CORS middleware.

## Optional: Enable CORS

Add to `app/main.py` if needed:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SkinType Ingredient API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Tune `allow_origins` for production.

## Development Notes

- Tables are auto-created at startup: `Base.metadata.create_all(bind=engine)`.
- The predictor clears Keras/TensorFlow state per request to reduce memory pressure (`K.clear_session()`).
- Image enhancements only apply when metrics are borderline; severe cases are rejected.

---

Maintainers can extend routers, add verified explanations, or integrate authentication as needed. See `requirements.txt` for exact library versions.

## For Non‑Technical Readers

Glowithm helps you understand your skin type and learn which skincare ingredients may be helpful or best avoided. Here’s how it works, in plain language:

- What you do: You take or choose a clear photo of your face in good lighting. The app sends it securely to the backend for analysis.
- Quality check: The backend quickly checks the picture quality (lighting, sharpness) and that there’s just one face. If it’s borderline, it can gently improve brightness/contrast to make the analysis more reliable. If the photo is too poor, it asks you to try another.
- Skin type estimate: Using a trained model, it estimates whether your skin is dry, normal, or oily. It also shows confidence (how sure the model is) and the other possibilities.
- Ingredient guidance: Based on your skin type, it suggests ingredient categories commonly considered helpful (for example, hydrators for dry skin) and flags ones that might be less suitable. This is general guidance, not personalized medical advice.
- Simple explanations: If you’re curious about an ingredient (like “niacinamide”), the AI provides a short, easy-to-understand summary. These are stored so future requests are faster. Unverified AI answers are kept simple and factual but may need professional review.
- Privacy note: The backend processes your photo to make a prediction and returns the result; it does not save your photo by default. Your app may store recent results locally on your device so you can revisit them.

Tips for best results

- Use a single‑person photo with your face clearly visible.
- Avoid heavy shadows, extreme brightness, or motion blur.
- Try facing a window with natural light; keep the camera steady.

Limitations and disclaimers

- This is an educational tool, not medical advice. For skin concerns, consult a dermatologist.
- Ingredient recommendations are general; individual sensitivities vary.
- AI explanations are kept simple but can be incomplete; always cross‑check if you have allergies or conditions.

What you need

- A smartphone or computer with a camera/photo.
- An internet connection so the app can send the photo for analysis and receive results.
