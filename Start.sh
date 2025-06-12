#!/bin/sh
echo "🟡 [start.sh] PROJECT=${PROJECT}"
echo "📁 Diretório atual: $(pwd)"

if [ "$PROJECT" = "html" ]; then
  echo "🌐 Servindo arquivos HTML estáticos..."
  pip install --upgrade pip
  pip install fastapi uvicorn jinja2
  cd html_app
  uvicorn index:app --host 0.0.0.0 --port 8000
else
  echo "❌ PROJECT não reconhecido: $PROJECT"
fi
