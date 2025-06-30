from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware




app = FastAPI()

# Serve arquivos estáticos da raiz do projeto
app.mount("/", StaticFiles(directory=".", html=True), name="static")

@app.get("/")
async def home():
    return FileResponse("index.html")

# Middleware de CORS atualizado para incluir ambos os domínios
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://app.educacaopelotrabalho.com",
        "https://educacaopelotrabalho-production.up.railway.app"

    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)





