FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app/2_Backend_Flask_API

COPY 2_Backend_Flask_API/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY 2_Backend_Flask_API/ .
COPY 1_Machine_Learning/ /app/1_Machine_Learning/

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
