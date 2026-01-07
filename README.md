# Glowithm — Skin Analysis & Ingredient Intelligence

Glowithm is a full-stack application that analyzes a face photo to predict the user's skin type, recommends helpful and avoidable skincare ingredients, and provides friendly AI explanations and chat — all wrapped in a modern, mobile-first experience.

This README covers architecture, setup, API reference, data import, and troubleshooting for both backend (FastAPI + TensorFlow + PostgreSQL) and frontend (Expo React Native + TypeScript).

## Overview

- Predicts skin type from a single-face photo using a TensorFlow/Keras model.
- Validates and auto-enhances images (resolution, brightness/contrast, noise, sharpness) for robust predictions.
- Recommends and flags skincare ingredients based on predicted skin type.
- Explains any ingredient via Gemini AI and caches explanations in the database.
- Chat with a skincare-focused AI assistant.
- Cross-platform frontend: iOS/Android with Expo; web via Expo web.

## Architecture

- Backend: FastAPI app and routers in [backend/app/main.py](backend/app/main.py), with endpoints:
  - Predict: [backend/app/routers/predict.py](backend/app/routers/predict.py)
  - Ingredients: [backend/app/routers/ingredients.py](backend/app/routers/ingredients.py)
  - Ingredient Explain (Gemini): [backend/app/routers/ingredient_explain.py](backend/app/routers/ingredient_explain.py)
  - Chat (Gemini): [backend/app/routers/chat.py](backend/app/routers/chat.py)
- ML model: Keras `.keras` file loaded in [backend/app/services/skin_predictor.py](backend/app/services/skin_predictor.py) with configuration in [backend/app/core/config.py](backend/app/core/config.py).
- Image validation/enhancement: [backend/app/utils/validator.py](backend/app/utils/validator.py), constants in [backend/app/utils/constants.py](backend/app/utils/constants.py).
- Database: SQLAlchemy ORM models, PostgreSQL arrays for categories and tags in [backend/app/models/ingredient.py](backend/app/models/ingredient.py) and [backend/app/models/ingredient_explanation.py](backend/app/models/ingredient_explanation.py); session setup in [backend/app/database/session.py](backend/app/database/session.py).
- Frontend: Expo app in [frontend/glowithm](frontend/glowithm) with hooks calling the API (e.g. [frontend/glowithm/hooks/useImageAnalysis.ts](frontend/glowithm/hooks/useImageAnalysis.ts), [frontend/glowithm/utils/api.ts](frontend/glowithm/utils/api.ts)). Uses Expo Router, NativeWind (Tailwind), and TypeScript.

### Unified Architecture & Processes (Text Arrows)

Boundaries & Protocols

```
[User App] --HTTP/JSON--> [FastAPI :8000]
[User App] --multipart/form-data--> [/predict]
[FastAPI] --HTTPS (egress)--> [Gemini AI]
```

Unified Flow (Endpoints + Steps + Outcomes)

```
[User App]
  --> [FastAPI (Routers)]
      -> /predict:
           --> [Image Validator]
               (formats: JPEG/PNG; exactly 1 face; ~512px min; statuses: OK/borderline/severe)
               -> if severe: 400 (message) --> [User App]
               -> if borderline: apply fixes (CLAHE, reduce highlights, denoise, unsharp, upscale)
           --> [Skin Predictor]
               --> [Model File: models/best_model.keras]
               --> probabilities: dry | normal | oily
           --> [PostgreSQL] (ingredients grouped by predicted skin type)
           --> JSON --> [User App]

      -> /ingredients/search | /ingredients/{slug}:
           --> [PostgreSQL]
               -> search: JSON list
               -> slug: JSON record or 404
           --> JSON --> [User App]

      -> /ingredients/import-json:
           --> [PostgreSQL] (bulk upsert)
           --> JSON { imported: number } --> [User App]

      -> /ingredients/explain:
           --> [PostgreSQL] (cache check)
               -> hit: JSON { ingredient, explanation, is_verified }
               -> miss: --> [Gemini AI] (generate concise text)
                         --> store unverified in [PostgreSQL]
                         --> JSON { ingredient, explanation, is_verified=false }
           --> JSON --> [User App]

      -> /chat:
           --> [Gemini AI] (skincare-focused reply)
           --> JSON { reply } --> [User App]
```

Typical Status Codes

- 200: Success
- 400: Image validation errors (format, face count, severe blur/noise/exposure, too small)
- 404: Ingredient not found by slug
- 500: Unexpected server error or external service failure

Data Stores

```
[FastAPI] <--> [PostgreSQL]
  ingredients: slug, name, categories[], recommended_for[], avoided_for[], details, quickfacts[], proof[]
  ingredient_explanations: name, explanation, is_verified
```

Steps (Arrows)

```
[/chat]
  --> [Gemini AI] (skincare-focused reply)
  --> return JSON --> [User App]
```

Outputs (Shape)

```
{ reply }
```

#### Ingredients (Search / Get / Import)

Search (Arrows)

```
[User App] --GET /ingredients/search?q=...--> [FastAPI] --> [PostgreSQL] --> JSON list --> [User App]
```

Get by Slug (Arrows)

```
[User App] --GET /ingredients/{slug}--> [FastAPI] --> [PostgreSQL]
  -> if found: JSON record --> [User App]
  -> else: 404 error --> [User App]
```

Import (Arrows)

```
[User App] --POST /ingredients/import-json (JSON array)--> [FastAPI] --> [PostgreSQL]
  --> { imported: number } --> [User App]
```

#### Data Stores (Arrows)

```
[FastAPI]
  <--> [PostgreSQL]
       - ingredients: slug, name, categories[], recommended_for[], avoided_for[], details, quickfacts[], proof[]
       - ingredient_explanations: name, explanation, is_verified
```

## Prerequisites

- Windows, macOS, or Linux
- Python 3.11+ recommended
- Node.js 18+ (Expo 54, React 19)
- PostgreSQL 14+ (arrays are used in the schema)
- Gemini API key (Google AI): `GOOGLE_API_KEY`

## Backend Setup (FastAPI)

1. Create and activate a virtual environment, then install dependencies:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate
pip install -r requirements.txt
```

2. Create `.env` in `backend` with required configuration:

```
# Required
DATABASE_URL=postgresql+psycopg2://<user>:<password>@localhost:5432/glowithm
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY

# Optional overrides
MODEL_PATH=models/best_model.keras
IMG_SIZE=224
```

Notes:

- PostgreSQL is required because the `ingredients` schema uses `ARRAY` columns; SQLite will not work.
- The default model path points to [models/best_model.keras](models/best_model.keras).

3. Start the API server (FastAPI via Uvicorn):

```powershell
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. Open the interactive docs at `http://localhost:8000/docs`.

## Data Import (Ingredients)

You can seed the database with the provided `ingredients.json` via either the script or API:

- Script (fastest for bulk import):

```powershell
cd backend
python app\scripts\import_json.py ingredients.json
```

- API route (POST array of ingredient objects):
  - Endpoint: `POST /ingredients/import-json`

## Frontend Setup (Expo React Native)

1. Install dependencies:

```powershell
cd frontend\glowithm
npm install
```

2. Point the app to your backend via `.env` (Expo automatically exposes `EXPO_PUBLIC_*` variables):

```
EXPO_PUBLIC_API_URL=http://localhost:8000
```

3. Run the app:

```powershell
npm run start
```

Then choose:

- `i` for iOS simulator (macOS required)
- `a` for Android emulator/device
- `w` for web

The frontend calls the backend using `EXPO_PUBLIC_API_URL` in [frontend/glowithm/utils/api.ts](frontend/glowithm/utils/api.ts).

## API Reference

### POST /predict

- Body: `multipart/form-data` with `file` (JPEG/PNG)
- Returns: `PredictResponse` including
  - `skin_type`: one of `dry|normal|oily`
  - `confidence`: numeric probability
  - `confidence_display`: formatted percentage
  - `all_predictions`: list of label/confidence pairs
  - `recommended` and `avoided`: objects keyed by category, values are arrays of ingredients
  - `was_enhanced`: whether auto-enhancement ran
  - `enhanced_image`: base64-encoded JPEG if enhanced

Image requirements (validated by the backend):

- Format: JPEG/PNG only
- Single, clearly visible face
- Minimum resolution: 512px (borderline at 450px); large images are auto-downscaled
- Borderline images may be auto-enhanced (CLAHE, denoise, sharpen, upscale)

### GET /ingredients/{slug}

- Returns a single ingredient by slug.

### GET /ingredients/search?q=...

- Full-text search across `name` and `also_called`.

### POST /ingredients/import-json

- Accepts an array of ingredient objects to upsert.

### POST /ingredients/explain

- Body: `{ "ingredient": "niacinamide" }`
- Returns a short, beginner-friendly explanation generated with Gemini; cached in DB.

### POST /chat

- Body: `{ "message": "What does AHA do?" }`
- Returns an AI reply tailored to skincare.

## Key Files

- API bootstrap: [backend/app/main.py](backend/app/main.py)
- Prediction service: [backend/app/services/skin_predictor.py](backend/app/services/skin_predictor.py)
- Image validator: [backend/app/utils/validator.py](backend/app/utils/validator.py)
- Ingredient model: [backend/app/models/ingredient.py](backend/app/models/ingredient.py)
- Explain + chat (Gemini): [backend/app/routers/ingredient_explain.py](backend/app/routers/ingredient_explain.py), [backend/app/routers/chat.py](backend/app/routers/chat.py)
- Frontend API usage: [frontend/glowithm/utils/api.ts](frontend/glowithm/utils/api.ts)

## Troubleshooting

- Missing Gemini key: Ensure `GOOGLE_API_KEY` is set in `backend/.env`.
- Database driver errors: Verify `DATABASE_URL` uses `postgresql+psycopg2://...` and that PostgreSQL is running.
- Array column errors on SQLite: Switch to PostgreSQL; arrays require Postgres.
- CORS (web only): If accessing the API from Expo web, you may need to add CORS middleware to FastAPI.
- Large or low-quality images: The validator may reject severe issues; retake the photo with good lighting, single face, and adequate resolution.
- Model path: Confirm `models/best_model.keras` exists or set `MODEL_PATH`.

## Development Notes

- TensorFlow is configured for CPU by default and clears sessions after predictions to manage memory.
- Image processing uses OpenCV + PIL with auto-fixes for borderline quality.
- Ingredient explanations are persisted as unverified records; you can later moderate and mark `is_verified=true`.

## License

This project is provided as-is for educational and product development purposes. Add your preferred license here if needed.
