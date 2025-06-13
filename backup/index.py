from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Serve arquivos estáticos da raiz do projeto
app.mount("/", StaticFiles(directory=".", html=True), name="static")

@app.get("/")
async def home():
    return FileResponse("index.html")
