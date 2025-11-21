from fastapi import FastAPI
from app.database.session import engine
from app.database.base import Base
from app.routers import predict, ingredients, ingredient_explain, chat

# create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkinType Ingredient API")

app.include_router(predict.router)
app.include_router(ingredients.router)
app.include_router(ingredient_explain.router)
app.include_router(chat.router)