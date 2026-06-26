FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies for Django and Daphne
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Install daphne for websockets
RUN pip install daphne

COPY . .

EXPOSE 8001

CMD ["daphne", "-b", "0.0.0.0", "-p", "8001", "core.asgi:application"]
