FROM python:3.11-slim 

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip \
 && pip install -r /app/requirements.txt

COPY . /app

RUN chmod +x /app/start.sh

ENV PORT=8000

EXPOSE 8000

ENTRYPOINT ["/app/start.sh"] 


