from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Form
from firebase_utils import gerar_link_reset_e_enviar

app = FastAPI()

# Serve arquivos estáticos da raiz do projeto
app.mount("/", StaticFiles(directory=".", html=True), name="static")

@app.get("/")
async def home():
    return FileResponse("index.html")



@app.post("/reset-senha")
async def reset_senha(email: str = Form(...)):
    """
    Endpoint para gerar link de reset de senha
    e enviar email bonito para o usuário.
    """
    sucesso = gerar_link_reset_e_enviar(email)
    if sucesso:
        return {"mensagem": "📧 Email de reset enviado com sucesso."}
    else:
        return {"mensagem": "❌ Falha ao enviar email de reset."}
