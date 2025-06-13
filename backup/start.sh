#!/bin/sh
echo "🟡 [start.sh] PROJECT=${PROJECT}"
echo "📁 Diretório atual: $(pwd)"

if [ "$PROJECT" = "html" ]; then
  echo "🌐 Servindo arquivos HTML..."
  pip install --upgrade pip
  pip install fastapi uvicorn jinja2
  echo "🚀 Iniciando Uvicorn com index:app..."
  uvicorn index:app --host 0.0.0.0 --port "${PORT:-8000}" --reload
else
  echo "❌ PROJECT inválido: $PROJECT"
fi
