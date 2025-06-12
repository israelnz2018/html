FROM python:3.11-slim

# 1) Define diretório de trabalho
WORKDIR /app

# 2) Copia os requisitos e instala dependências Python
COPY html_app/requirements.txt /app/requirements.txt
RUN pip install --upgrade pip \
 && pip install -r /app/requirements.txt

# 3) Copia os arquivos da aplicação (HTML, CSS, JS, FastAPI, etc.)
COPY html_app/ /app/html_app/

# 4) Dá permissão de execução ao script de inicialização
COPY html_app/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 5) Define variáveis padrão (PORT etc.)
ENV PORT=8000

# 6) Expõe a porta da aplicação
EXPOSE 8000

# 7) Inicia a aplicação FastAPI com Uvicorn
ENTRYPOINT ["/app/start.sh"]
