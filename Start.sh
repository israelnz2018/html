#!/bin/sh

echo "🔵 Iniciando aplicação HTML com FastAPI..."
echo "📁 Diretório atual: $(pwd)"

# Verifica se o main.py existe na raiz
if [ -f /app/main.py ]; then
  echo "✅ main.py encontrado!"
else
  echo "❌ ERRO: main.py não encontrado!"
  exit 1
fi

# Inicia o servidor FastAPI
cd /app
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
